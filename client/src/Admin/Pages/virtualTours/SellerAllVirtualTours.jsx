import React, { useEffect, useState } from "react";
import { Grid, Container } from "@mui/material";
import PropertyCard from "./VirtualTourCard";
import axios from "axios";
import { useSelector } from "react-redux";

const SellerAllVirtualTours = () => {
  const user = useSelector((state) => state.Singleuser);
  const [tours, setTours] = useState([]);

  const fetchTours = async () => {
    axios
      .get(
        `${
          import.meta.env.VITE_BACKEND_DOMAIN_NAME
        }/api/virtualTours/getAllVirtualToursBySellerId/${user.data._id}`
      )
      .then((data) => {
        setTours(data.data);
        console.log("data", data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchTours();
  }, []);

  return (
    <Container maxWidth={"xl"} sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {tours?.map((property, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <PropertyCard property={property} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SellerAllVirtualTours;
