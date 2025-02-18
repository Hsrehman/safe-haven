import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '600px',
};

const center = {
  lat: 51.509865, 
  lng: -0.118092, 
};

const FoodBankMap = () => {
  const [foodBanks, setFoodBanks] = useState([]);
  const [selectedFoodBank, setSelectedFoodBank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoodBanks = async () => {
      try {
        const response = await fetch('/api/foodbanks');
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch food banks: ${errorText}`);
        }
        const data = await response.json();
        setFoodBanks(data);
      } catch (error) {
        console.error('Error fetching food banks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodBanks();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
        <div className="map-container">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={12}
          >
            {foodBanks.map((foodBank) => (
              <Marker
                key={foodBank.id}
                position={{
                  lat: foodBank.latitude,
                  lng: foodBank.longitude,
                }}
                onClick={() => setSelectedFoodBank(foodBank)}
              />
            ))}

            {selectedFoodBank && (
              <InfoWindow
                position={{
                  lat: selectedFoodBank.latitude,
                  lng: selectedFoodBank.longitude,
                }}
                onCloseClick={() => setSelectedFoodBank(null)}
              >
                <div className="info-window">
                  <h4>{selectedFoodBank.name}</h4>
                  <p>{selectedFoodBank.address}</p>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedFoodBank.latitude},${selectedFoodBank.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get Directions
                  </a>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>
      </LoadScript>
    </div>
  );
};

export default FoodBankMap;