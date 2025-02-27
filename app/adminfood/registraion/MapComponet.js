// MapComponent.js
"use client";

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Component to handle map events
function LocationMarker({ onLocationSelect, initialLocation }) {
  const [position, setPosition] = useState(initialLocation || null);
  
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      
      // Reverse geocode to get address (optional)
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`)
        .then(response => response.json())
        .then(data => {
          onLocationSelect({
            lat: e.latlng.lat,
            lng: e.latlng.lng,
            address: data.display_name
          });
        })
        .catch(error => {
          console.error("Error getting address:", error);
          onLocationSelect({
            lat: e.latlng.lat,
            lng: e.latlng.lng
          });
        });
    }
  });

  useEffect(() => {
    if (initialLocation) {
      map.flyTo(initialLocation, map.getZoom());
    }
  }, [initialLocation, map]);

  return position ? <Marker position={position} /> : null;
}

export default function MapComponent({ onLocationSelect, initialLocation }) {
  const defaultPosition = [51.505, -0.09]; // Default to London
  
  return (
    <MapContainer 
      center={initialLocation || defaultPosition} 
      zoom={13} 
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker 
        onLocationSelect={onLocationSelect}
        initialLocation={initialLocation}
      />
    </MapContainer>
  );
}