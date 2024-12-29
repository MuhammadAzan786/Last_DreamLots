import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  Box,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CustomerOrderHistoryPage = () => {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getdata = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_DOMAIN_NAME
          }/api/order/getUserOrders/${id}`
        );
        setOrders(response.data);
        console.log(response.data);
      } catch (error) {
        console.log("Error in Getting Data:", error);
      }
    };
    getdata();
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // const totalOrders = orders.length;
  // const shippedOrders = orders.filter(
  //   (order) => order.status === "Shipped"
  // ).length;
  // const totalCost = orders.reduce((acc, order) => acc + order.total, 0);

  return (
    <Container
      sx={{
        mt: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Grid container spacing={4} mb={4}>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              backgroundColor: "#f5f5f5",
              boxShadow: 4,
              borderLeft: "4px solid #3f51b5",
              borderRadius: 0,
              transition:
                "transform 0.2s ease-in-out, box-shadow 0.3s ease-in-out",
              "&:hover": {
                transform: "translateY(-10px)",
                boxShadow: 6,
              },
              display: "flex",
              alignItems: "center",
              px: 2,
            }}
          >
            <ShoppingCartIcon sx={{ fontSize: 60, color: "#3f51b5" }} />
            <CardContent sx={{ flex: 1, textAlign: "center" }}>
              <Typography
                variant="h5"
                component="div"
                gutterBottom
                sx={{ fontWeight: "bold", color: "#3f51b5" }}
              >
                Total Orders
              </Typography>
              <Typography
                variant="h3"
                color="textSecondary"
                sx={{ fontWeight: "bold" }}
              >
                {/* {totalOrders} */}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              backgroundColor: "#f5f5f5",
              boxShadow: 4,
              borderLeft: "4px solid #4caf50",
              borderRadius: 0,
              transition:
                "transform 0.2s ease-in-out, box-shadow 0.3s ease-in-out",
              "&:hover": {
                transform: "translateY(-10px)",
                boxShadow: 6,
              },
              display: "flex",
              alignItems: "center",
              px: 2,
            }}
          >
            <LocalShippingIcon sx={{ fontSize: 60, color: "#4caf50" }} />
            <CardContent sx={{ flex: 1, textAlign: "center" }}>
              <Typography
                variant="h5"
                component="div"
                gutterBottom
                sx={{ fontWeight: "bold", color: "#4caf50" }}
              >
                Shipped Orders
              </Typography>
              <Typography
                variant="h3"
                color="textSecondary"
                sx={{ fontWeight: "bold" }}
              >
                {/* {shippedOrders} */}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              backgroundColor: "#f5f5f5",
              boxShadow: 4,
              borderLeft: "4px solid #ff5722",
              borderRadius: 0,
              transition:
                "transform 0.2s ease-in-out, box-shadow 0.3s ease-in-out",
              "&:hover": {
                transform: "translateY(-10px)",
                boxShadow: 6,
              },
              display: "flex",
              alignItems: "center",
              px: 2,
            }}
          >
            <MonetizationOnIcon sx={{ fontSize: 60, color: "#ff5722" }} />
            <CardContent sx={{ flex: 1, textAlign: "center" }}>
              <Typography
                variant="h5"
                component="div"
                gutterBottom
                sx={{ fontWeight: "bold", color: "#ff5722" }}
              >
                Total Cost
              </Typography>
              <Typography
                variant="h3"
                color="textSecondary"
                sx={{ fontWeight: "bold" }}
              >
                {/* ${totalCost} */}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box
        sx={{
          height: "100%",
          width: "100%",
          backgroundColor: "#ffffff",
          boxShadow: 4,
          borderRadius: 2,
          p: 2,
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <h1>data grid component</h1>
        )}
      </Box>
    </Container>
  );
};

export default CustomerOrderHistoryPage;
