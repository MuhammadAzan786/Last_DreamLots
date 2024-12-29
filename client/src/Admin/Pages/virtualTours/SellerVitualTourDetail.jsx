import { Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VirtualTour from "./VirtualTour";

const SellerVitualTourDetail = () => {
  const [tour, setTour] = useState({});
  const { id } = useParams();
  const fetchTour = async () => {
    axios
      .get(
        `${
          import.meta.env.VITE_BACKEND_DOMAIN_NAME
        }/api/virtualTours/getVirtualTourById/${id}`
      )
      .then((data) => {
        setTour(data.data.data);
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
    </>
  );
};

export default SellerVitualTourDetail;
