'use client';

import { Input } from '@material-tailwind/react';
import {
  GoogleMap,
  MarkerF,
  useJsApiLoader,
  Autocomplete,
} from '@react-google-maps/api';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

interface LocationProps {
  // eslint-disable-next-line unused-imports/no-unused-vars
  onLocationChange: (position: { lat: number; lng: number }) => void;
  initalPlace: { latitude: number; longitude: number };
}
const Location: React.FC<LocationProps> = ({
  onLocationChange,
  initalPlace,
}) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '',
    libraries: ['places'],
  });
  const ethiopiaBounds = {
    north: 14.8944,
    south: 3.4024,
    east: 48.0,
    west: 32.9994,
  };

  const defaultCenter = {
    latitude: 9.030177384554046,
    longitude: 38.76288469514627,
  };

  const isInitialPlaceEmpty =
    !initalPlace || Object.keys(initalPlace).length === 0;
  const isInitialPlaceZero =
    initalPlace.latitude === 0 && initalPlace.longitude === 0;

  const center = {
    lat:
      isInitialPlaceEmpty || isInitialPlaceZero
        ? defaultCenter.latitude
        : initalPlace.latitude,
    lng:
      isInitialPlaceEmpty || isInitialPlaceZero
        ? defaultCenter.longitude
        : initalPlace.longitude,
  };

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [position, setPosition] = useState(center);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [address, setAddress] = useState('');
  const markerRef = useRef(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const onLoad = useCallback((mapInstance: any) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place && place.geometry && place.geometry.location) {
        const newPosition = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setPosition(newPosition);
        setAddress(place.formatted_address || '');
        onLocationChange(newPosition);
      }
    }
  };
  const fetchAddress = async (lat: any, lng: any) => {
    if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
      console.error('Google Maps API is not loaded properly.');
      return;
    }
    const geocoder = new window.google.maps.Geocoder();
    const latlng = { lat, lng };
    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === 'OK') {
        if (results && results[0]) {
          setAddress(results[0].formatted_address);
        } else {
          console.log('No results found');
        }
      } else {
        console.log('Geocoder failed due to: ' + status);
      }
    });
  };
  useEffect(() => {
    if (map) {
      // Set mapLoaded to true once the map is loaded
      setMapLoaded(true);
    }
  }, [map]);

  useEffect(() => {
    // If map is loaded and position is updated, pan to the new position
    if (mapLoaded && position && map) {
      map.panTo(position);
    }
  }, [mapLoaded, position, map]);

  useEffect(() => {
    // Fetch address if initial place coordinates are not 0
    if (initalPlace.latitude !== 0 && initalPlace.longitude !== 0) {
      fetchAddress(initalPlace.latitude, initalPlace.longitude);
    }
  }, [initalPlace]);

  const onMapClick = (event: any) => {
    // Update marker position to the clicked coordinates
    const newPosition = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setPosition(newPosition);
    fetchAddress(newPosition.lat, newPosition.lng);
    onLocationChange(newPosition);
  };
  const onMarkerLoad = (marker: any) => {
    markerRef.current = marker;
  };
  const clearLocation = () => {
    setPosition({
      lat: 9.030177384554046,
      lng: 38.76288469514627,
    });
    setAddress('');
    onLocationChange({ lat: 0, lng: 0 });
  };
  return isLoaded ? (
    <div>
      <Autocomplete
        onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
        onPlaceChanged={onPlaceChanged}
        options={{
          bounds: new window.google.maps.LatLngBounds(
            new window.google.maps.LatLng(
              ethiopiaBounds.south,
              ethiopiaBounds.west
            ),
            new window.google.maps.LatLng(
              ethiopiaBounds.north,
              ethiopiaBounds.east
            )
          ),
          strictBounds: false,
        }}
      >
        <div className='relative flex w-full items-center justify-center '>
          <Input
            className=''
            color='amber'
            label='Search for places'
            crossOrigin={undefined}
            value={address} // Set the input value to the address state
            onChange={(e) => setAddress(e.target.value)} // Update the address state on input change
          />
          <div
            className='cursor-pointer !absolute right-1 rounded-full bg-gray-200 p-1 flex items-center justify-center'
            onClick={clearLocation}
          >
            <AiOutlineClose className='text-gray-600' size={20} />
          </div>
        </div>
      </Autocomplete>

      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '300px' }}
        center={center}
        zoom={16}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={onMapClick}
      >
        {/* Ensure Marker is conditionally rendered only if position is defined */}
        {position && (
          <MarkerF position={position} draggable={true} onLoad={onMarkerLoad} />
        )}
      </GoogleMap>
    </div>
  ) : (
    <></>
  );
};

export default Location;
