'use client';
import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const FoodBankMap = () => {
  const [selectedFoodBank, setSelectedFoodBank] = useState(null);
  const [foodBanks, setFoodBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const center = {
    lat: 51.509865,
    lng: -0.118092
  };

  const containerStyle = {
    width: '100%',
    height: '600px'
  };

  useEffect(() => {
    const fetchFoodBanks = async () => {
      try {
        const response = await fetch('/api/foodbanks');
        const data = await response.json();
        
        if (data.success) {
          
          const transformedData = data.data.map(bank => ({
            id: bank._id || bank.id,
            name: bank.name,
            position: {
              lat: Number(bank.latitude), 
              lng: Number(bank.longitude) 
            },
            address: bank.address,
            hours: bank.hours
          }));
          setFoodBanks(transformedData);
          console.log('Transformed data:', transformedData);
        } else {
          setError('Failed to fetch food banks');
        }
      } catch (err) {
        setError('Error loading food banks');
        console.error('Error fetching food banks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodBanks();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading food banks...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={11}
      >
        {foodBanks && foodBanks.map(foodBank => {

          if (!isNaN(foodBank.position.lat) && !isNaN(foodBank.position.lng)) {
            return (
              <Marker
                key={foodBank.id}
                position={foodBank.position}
                onClick={() => setSelectedFoodBank(foodBank)}
              />
            );
          }
          return null;
        })}

          {selectedFoodBank && (
          <InfoWindow
            position={selectedFoodBank.position}
            onCloseClick={() => setSelectedFoodBank(null)}
          >
            <div className="p-2">
              <h3 className="font-bold text-lg">{selectedFoodBank.name}</h3>
              <p className="text-sm">{selectedFoodBank.address}</p>
              <p className="text-sm">Hours: {selectedFoodBank.hours}</p>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedFoodBank.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline mt-2 inline-block"
              >
                Get Directions
              </a>
            </div>
          </InfoWindow>
        )}
        
      </GoogleMap>
    </LoadScript>
  );
};


export default FoodBankMap;