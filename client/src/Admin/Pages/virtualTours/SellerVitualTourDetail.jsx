import { Divider, Grid, Paper, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VirtualTour from "./VirtualTour";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import LocationMap from "./LocationMap";
import { Box } from "@mui/system";
import {
  AttachMoney,
  Bathtub,
  Bed,
  Home,
  Landscape,
  LocationCity,
  Place,
} from "@mui/icons-material";

const SellerVitualTourDetail = () => {
  const [tour, setTour] = useState({});
  const { id } = useParams();
  const [location, setLocation] = useState({
    lat: 31.5204, // Default to Lahore, Pakistan
    lng: 74.3587,
  });

  const fetchTour = async () => {
    axios
      .get(
        `${
          import.meta.env.VITE_BACKEND_DOMAIN_NAME
        }/api/virtualTours/getVirtualTourById/${id}`
      )
      .then((data) => {
        setTour(data.data.data);
        setLocation(data.data.data.location);
        console.log("data", data.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchTour();
  }, []);

  return (
    <>
      <Typography>Virtual Tour Details</Typography>
      <VirtualTour images={tour.images} hotspots={tour.hotspots} />
      <MapContainer
        center={location}
        zoom={10}
        style={{ width: "100%", height: "400px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <LocationMap location={location} />
      </MapContainer>

      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: "bold", color: "primary.main" }}
            >
              Property Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Home sx={{ color: "primary.main", mr: 1 }} />
              <Typography variant="body1">Type: {tour.propertyType}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Landscape sx={{ color: "primary.main", mr: 1 }} />
              <Typography variant="body1">Area: {tour.area} sq ft</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Bed sx={{ color: "primary.main", mr: 1 }} />
              <Typography variant="body1">Bedrooms: {tour.bedrooms}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Bathtub sx={{ color: "primary.main", mr: 1 }} />
              <Typography variant="body1">
                Bathrooms: {tour.bathrooms}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <AttachMoney sx={{ color: "primary.main", mr: 1 }} />
              <Typography variant="body1">Price: PKR {tour.price}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <LocationCity sx={{ color: "primary.main", mr: 1 }} />
              <Typography variant="body1">City: {tour.city}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Place sx={{ color: "primary.main", mr: 1 }} />
              <Typography variant="body1">
                Address: {tour.streetAddress}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default SellerVitualTourDetail;
