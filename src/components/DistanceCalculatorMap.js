import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Card, Spinner } from "react-bootstrap";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";

const center = { lat: 28.581718002134057, lng: 77.05769058833593 };

const DistanceCalculatorMap = forwardRef((props, ref) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);

  useImperativeHandle(ref, () => ({
    async calculateRoute(origin, destination, waypoints) {
      if (origin === "" || destination === "") {
        return;
      }
      setDirectionsResponse(null);
      // eslint-disable-next-line no-undef
      const directionsService = new google.maps.DirectionsService();
      try {
        const data = await directionsService.route({
          origin,
          destination,
          waypoints,
          // eslint-disable-next-line no-undef
          travelMode: google.maps.TravelMode.DRIVING,
        });
        setDirectionsResponse(data);
        return { error: false, data };
      } catch (error) {
        return { error: true, data: error };
      }
    },
  }));

  if (!isLoaded) {
    return <Spinner animation="border" variant="primary" />;
  }

  return (
    <Card className="google-map">
      <GoogleMap
        center={center}
        zoom={15}
        mapContainerStyle={{ width: "100%", height: "100%" }}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
        onLoad={(map) => setMap(map)}
        onUnmount={(map) => setMap(map)}
      >
        <Marker position={center} />
        {directionsResponse && (
          <DirectionsRenderer directions={directionsResponse} />
        )}
      </GoogleMap>
    </Card>
  );
});

export default DistanceCalculatorMap;
