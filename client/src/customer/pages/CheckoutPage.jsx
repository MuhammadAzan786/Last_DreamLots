import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Container,
  CircularProgress,
  Backdrop,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import ServicesSection from "../sections/ServicesSection";
import {
  clearCartOnServer,
  fetchCartFromServer,
} from "../../redux/Slices/cartSlice";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const phoneRegExp = /^\d{11}$/;

const validationSchema = yup.object({
  username: yup.string().required("Username is required"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  country: yup.string().required("Country is required"),
  pinCode: yup
    .number()
    .typeError("Pin Code must be a number")
    .required("Pin Code is required"),
  phoneNo: yup
    .string()
    .matches(phoneRegExp, "Phone number must be exactly 11 digits")
    .required("Phone Number is required"),
});

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = useState(0);
  const user = useSelector((state) => state.Singleuser);
  const cart = useSelector((state) => state.cart);

  // console.log(cart);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchCartFromServer());
  }, [dispatch]);

  useEffect(() => {
    const calculatedTotalPrice = cart.items.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
    setTotalPrice(calculatedTotalPrice);
  }, [cart]);

  const formik = useFormik({
    initialValues: {
      username: user.data.username || "",
      email: user.data.email || "",
      address: "",
      city: user.data.city || "",
      state: "",
      country: "",
      pinCode: "",
      phoneNo: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);

      const orderData = {
        shippingInfo: values,
        user: user.data._id,
        totalPrice: cart.items.reduce(
          (total, item) => total + item.quantity * item.price,
          0
        ),
        orderItems: cart.items,
      };

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_DOMAIN_NAME}/api/order/neworder`,
          orderData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Order placed successfully:", response.data);

        dispatch(clearCartOnServer());
        setLoading(false);

        toast.success("Order placed successfully!", {
          position: "top-center",
        });

        setTimeout(() => {
          navigate(`/order-details/${response.data.order._id}`);
        }, 2000);
      } catch (error) {
        console.error("Error placing order:", error);
        toast.error("Failed to place order. Please try again.", {
          position: "top-center",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <>
      <Container maxWidth="lg" sx={{ paddingY: "80px" }}>
        <Box padding="16px">
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box
                  padding={3}
                  boxShadow="rgba(0, 0, 0, 0.1) 0px 4px 12px"
                  borderRadius="8px"
                >
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Address Details
                  </Typography>
                  <Grid container spacing={2}>
                    {/* Form Fields */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        required
                        disabled
                        margin="normal"
                        label="Username"
                        name="username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.username &&
                          Boolean(formik.errors.username)
                        }
                        helperText={
                          formik.touched.username && formik.errors.username
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        required
                        disabled
                        margin="normal"
                        label="Email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.email && Boolean(formik.errors.email)
                        }
                        helperText={formik.touched.email && formik.errors.email}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        required
                        margin="normal"
                        label="Address"
                        name="address"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.address &&
                          Boolean(formik.errors.address)
                        }
                        helperText={
                          formik.touched.address && formik.errors.address
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        required
                        disabled
                        margin="normal"
                        label="City"
                        name="city"
                        value={formik.values.city}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.city && Boolean(formik.errors.city)
                        }
                        helperText={formik.touched.city && formik.errors.city}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        required
                        margin="normal"
                        label="State"
                        name="state"
                        value={formik.values.state}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.state && Boolean(formik.errors.state)
                        }
                        helperText={formik.touched.state && formik.errors.state}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        required
                        margin="normal"
                        label="Country"
                        name="country"
                        value={formik.values.country}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.country &&
                          Boolean(formik.errors.country)
                        }
                        helperText={
                          formik.touched.country && formik.errors.country
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        required
                        margin="normal"
                        label="Postal Code"
                        name="pinCode"
                        value={formik.values.pinCode}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.pinCode &&
                          Boolean(formik.errors.pinCode)
                        }
                        helperText={
                          formik.touched.pinCode && formik.errors.pinCode
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        required
                        margin="normal"
                        label="Phone Number"
                        name="phoneNo"
                        value={formik.values.phoneNo}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.phoneNo &&
                          Boolean(formik.errors.phoneNo)
                        }
                        helperText={
                          formik.touched.phoneNo && formik.errors.phoneNo
                        }
                        placeholder="03108878865"
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box
                  padding={3}
                  boxShadow="rgba(0, 0, 0, 0.1) 0px 4px 12px"
                  borderRadius="8px"
                >
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Order Information
                  </Typography>

                  <List disablePadding>
                    {cart?.items.map((item, index) => (
                      <ListItem
                        key={index}
                        disableGutters
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          alignItems: { xs: "flex-start", sm: "center" },
                          justifyContent: "space-between",
                          padding: 2,
                          borderBottom: "1px solid #e0e0e0", // Add a subtle border for separation
                          backgroundColor: "#fafafa", // Light background color for better contrast
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: { xs: 1, sm: 0 },
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar
                              src={item.imageUrl}
                              variant="square"
                              sx={{
                                width: 64,
                                height: 64,
                                borderRadius: 1,
                                boxShadow: 2,
                              }} // Add shadow for depth
                            />
                          </ListItemAvatar>
                        </Box>

                        <Box
                          sx={{
                            flex: 1,
                            ml: { xs: 0, sm: 2 },
                            mr: { xs: 0, sm: 2 },
                          }}
                        >
                          <ListItemText
                            primary={item.name}
                            primaryTypographyProps={{
                              sx: { fontWeight: 600, color: "#333" },
                            }}
                            secondary={
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 1,
                                  mt: 1,
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: {
                                      xs: "flex-start",
                                      md: "center",
                                    },
                                    flexDirection: { xs: "column", sm: "row" },
                                    gap: 0.5,
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: 500,
                                      color: "#555",
                                    }}
                                  >
                                    Quantity: {item.quantity}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: "flex", gap: 1 }}>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 500, color: "#555" }}
                                  >
                                    Size: {item.type}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      fontWeight: 500,
                                      color: "#555",
                                    }}
                                  >
                                    Color:
                                    <Box
                                      sx={{
                                        width: 44,
                                        height: 15,
                                        backgroundColor: item.color,
                                        borderRadius: 1,
                                        ml: 1,
                                        border: "1px solid #ccc",
                                      }}
                                    />
                                  </Typography>
                                </Box>
                              </Box>
                            }
                          />
                        </Box>

                        <Box
                          sx={{
                            mt: { xs: 1, sm: 0 },
                            textAlign: { xs: "left", sm: "right" },
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: "#333" }}
                          >
                            Rs. {item.price * item.quantity}
                          </Typography>
                        </Box>
                      </ListItem>
                    ))}
                    <Divider />
                    <ListItem disableGutters>
                      <ListItemText primary="Total" />
                      <Typography variant="h6" fontWeight="bold">
                        Rs.
                        {cart.items.reduce(
                          (total, item) => total + item.quantity * item.price,
                          0
                        )}
                      </Typography>
                    </ListItem>
                  </List>
                  <Box mt={2}>
                    <Button
                      fullWidth
                      variant="contained"
                      type="submit"
                      disabled={loading}
                      sx={{
                        paddingY: "12px",
                        backgroundColor: "#fff",
                        color: "black",
                        borderRadius: "0px",
                        border: "2px solid #0B355B",
                        "&:hover": {
                          backgroundColor: "#0B355B",
                          color: "#fff",
                          borderColor: "#0B355B",
                        },
                      }}
                    >
                      Place Order
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Box>
        {loading && (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        )}
        <Toaster /> {/* Add the Toaster component for toast notifications */}
      </Container>
    </>
  );
};

export default CheckoutPage;
