// LocationMap.jsx
import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

const LocationMap = ({ location }) => {
  return (
    <Marker
      position={location}
      icon={
        new L.Icon({
          iconUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        })
      }
    >
      <Popup>Selected Location</Popup>
    </Marker>
  );
};

export default LocationMap;
