import React, { useEffect, useState } from "react";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import {
  Box,
  Typography,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Button,
} from "@mui/material";
import {
  LocationOn,
  Phone,
  Person,
  Email,
  ShoppingCart,
  LocalShipping,
} from "@mui/icons-material";

import ServicesSection from "../../customer/sections/ServicesSection";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleOrder } from "../../redux/Slices/singleOrderSlice";
import Loading from "../components/Loading";
import { useParams, useNavigate } from "react-router-dom";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [orders, setOrder] = useState({});
  const state = useSelector((state) => state.singleOrder);

  // console.log(state);

  const user = useSelector((state) => state.Singleuser);
  useEffect(() => {
    if (state.data) {
      setOrder(state.data.data);
    }
  }, [state.data]);

  useEffect(() => {
    dispatch(fetchSingleOrder({ id: id }));
  }, []);

  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <Box
        px={{ xs: 2, sm: 2, md: 3 }}
        maxWidth="900px"
        mx="auto"
        sx={{ py: 11 }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: { xs: "center", md: "space-between" },
            alignItems: { xs: "center", md: "flex-start" },
            marginBottom: { xs: "32px", md: "0px" },
          }}
        >
          <Box>
            {" "}
            <Typography
              variant="h4"
              gutterBottom
              align="center"
              sx={{ mb: 4 }}
              fontWeight={"500"}
            >
              Order Details
            </Typography>
          </Box>
          <Box>
            {user.data?.role === "user" && (
              <Button
                startIcon={<ShoppingBagOutlinedIcon />}
                sx={{
                  paddingX: 5,
                  backgroundColor: "#0B355B",
                  borderRadius: "0px",
                  border: "1px solid #0B355B",
                  fontWeight: "600",
                  width: {
                    xs: "100%",
                    sm: "100%",
                    md: "auto",
                  },
                  boxShadow:
                    "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.10) 0px 10px 10px",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#F5F5F5",
                    border: "1px solid #0B355B",
                    color: "#0B355B",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                    boxShadow:
                      "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px",
                  },
                }}
                onClick={() => {
                  navigate("/");
                }}
              >
                Continue Shopping
              </Button>
            )}
          </Box>
        </Box>

        {/* User Info */}
        <Box
          sx={{
            p: 3,
            mb: 4,
            boxShadow: "0px 0px 15px rgba(0,0,0,0.1)",
            backgroundColor: "#fff",
          }}
        >
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", mb: 2 }}
          >
            <Person sx={{ mr: 1 }} /> User Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography
            variant="body1"
            sx={{ display: "flex", alignItems: "center", mt: 1 }}
          >
            <Person sx={{ mr: 1 }} /> {orders.shippingInfo?.username}
          </Typography>
          <Typography
            variant="body1"
            sx={{ display: "flex", alignItems: "center", mt: 1 }}
          >
            <Email sx={{ mr: 1 }} /> {orders.shippingInfo?.email}
          </Typography>
        </Box>

        {/* Shipping Info */}
        <Box
          sx={{
            p: 3,
            mb: 4,
            boxShadow: "0px 0px 15px rgba(0,0,0,0.1)",
            backgroundColor: "#fff",
          }}
        >
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", mb: 2 }}
          >
            <LocationOn sx={{ mr: 1 }} /> Shipping Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" fontWeight={"600"}>
                Address:
              </Typography>
              <Typography variant="body2">
                {orders.shippingInfo?.address}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" fontWeight={"600"}>
                City:
              </Typography>
              <Typography variant="body2">
                {orders.shippingInfo?.city}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" fontWeight={"600"}>
                State:
              </Typography>
              <Typography variant="body2">
                {orders.shippingInfo?.state}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" fontWeight={"600"}>
                Country:
              </Typography>
              <Typography variant="body2">
                {orders.shippingInfo?.country}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" fontWeight={"600"}>
                Pin Code:
              </Typography>
              <Typography variant="body2">
                {orders.shippingInfo?.pinCode}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" fontWeight={"600"}>
                Phone Number:
              </Typography>
              <Typography variant="body2">
                {orders.shippingInfo?.phoneNo}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Order Items */}
        <Box
          sx={{
            p: 3,
            mb: 4,
            boxShadow: "0px 0px 15px rgba(0,0,0,0.1)",
            backgroundColor: "#fff",
          }}
        >
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", mb: 2 }}
          >
            <ShoppingCart sx={{ mr: 1 }} /> Order Items
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List>
            {orders.orderItems?.map((item) => (
              <ListItem
                key={item._id.$oid}
                sx={{
                  mb: 2,
                  p: 2,

                  backgroundColor: "#f9f9f9",
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={item.imageUrl}
                    variant="square"
                    sx={{ width: 64, height: 64 }}
                  />
                </ListItemAvatar>

                <ListItemText
                  primary={item.name}
                  secondary={
                    <>
                      <Box sx={{ my: 1 }}>
                        <span>{`Quantity: ${item.quantity} | Price: ${item.price}`}</span>
                      </Box>
                      <Box>
                        <span>{` Size: ${item.type}`}</span>
                        <span>{` | Color:`}</span>
                        <Chip
                          // label={item.color}
                          sx={{
                            ml: 1,
                            backgroundColor: item.color.toLowerCase(), // Valid color name
                            color: "#fff",
                            fontWeight: "bold",
                            padding: "0 8px",
                            borderRadius: "5px",
                            height: 24,
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)", // Subtle shadow for depth
                            fontSize: "0.875rem", // Slightly smaller text
                          }}
                        />
                      </Box>
                    </>
                  }
                  sx={{ ml: 2 }}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Order Summary */}
        <Box
          sx={{
            p: 3,
            mb: 4,
            boxShadow: "0px 0px 15px rgba(0,0,0,0.1)",
            backgroundColor: "#fff",
          }}
        >
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", mb: 2 }}
          >
            <LocalShipping sx={{ mr: 1 }} /> Order Summary
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body1">Total Price:</Typography>
              <Typography variant="body2">{orders.totalPrice}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" align="right">
                Shipping Price:
              </Typography>
              <Typography variant="body2" align="right">
                {orders.shippingPrice}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Chip
                label={`Order Status: ${orders.orderStatus}`}
                color={
                  orders.orderStatus === "Processing"
                    ? "warning"
                    : orders.orderStatus === "Shipped"
                    ? "success"
                    : "error"
                }
                sx={{ mt: 2, float: "right" }}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
      <ServicesSection />
    </>
  );
};

export default OrderDetailsPage;
