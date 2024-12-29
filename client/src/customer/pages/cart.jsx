import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Button,
  TextField,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { fetchCartFromServer } from "../../redux/Slices/cartSlice";
import { updateQuantityOnServer } from "../../redux/Slices/cartSlice";
import { removeFromCartOnServer } from "../../redux/Slices/cartSlice";
import toast, { Toaster } from "react-hot-toast";
import { Container } from "@mui/system";
import ServicesSection from "../sections/ServicesSection";

// Sample data for demonstration (replace with your actual data)

const CartPage = () => {
  const navigate = useNavigate();

  const [selectedShipping, setSelectedShipping] = useState("free");

  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);

  // console.log("Cart", cart);

  // Now you can access: cart.items, cart.totalQuantity, cart.totalAmount
  useEffect(() => {
    // Fetch cart data when the component mounts
    dispatch(fetchCartFromServer())
      .then(() => {
        // Optionally, you can handle success here (e.g., logging)
        console.log("Cart fetched successfully!");
      })
      .catch((error) => {
        // Handle errors (e.g., display an error message to the user)
        console.error("Error fetching cart:", error);
      });
  }, [dispatch]); // Run only once on component mount

  // ... rest of your component logic
  //     (you can now use cart.items, cart.totalAmount, etc. in your JSX)

  useEffect(() => {
    dispatch(fetchCartFromServer());
  }, [dispatch]);

  const handleQuantityChange = (itemId, count, type, color) => {
    const props = {
      itemId,
      count,
      type,
      color,
    };
    dispatch(updateQuantityOnServer({ props }));
    toast.success("Cart Updated successfully");
  };

  const handleRemoveItem = (itemId, quantity, type, color) => {
    // console.log(itemId, quantity, type, color);
    dispatch(removeFromCartOnServer({ itemId, quantity, type, color }));
    toast.success("Item Removed from Cart");
  };

  const handleShippingChange = (event) => {
    setSelectedShipping(event.target.value);
  };

  const calculateSubtotal = () => {
    return cart.items.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
  };

  const calculateShippingCost = () => {
    switch (selectedShipping) {
      case "free":
        return 0;
      case "flat":
        return 10.0;
      case "pickup":
        return 15.0;
      default:
        return 0;
    }
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShippingCost();
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <>
      <Container maxWidth={"lg"}>
        <div className="mt-[4rem]">
          <Box sx={{ padding: "20px 0", fontFamily: "sans-serif" }}>
            <Typography variant="h4" gutterBottom>
              Shopping cart
            </Typography>

            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                {cart.items.length === 0 ? (
                  <Typography variant="body1">Your cart is empty.</Typography>
                ) : (
                  <List>
                    {cart.items.map((item, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          borderBottom: "1px solid #eee",
                          padding: "20px 0",
                          alignItems: "start",
                          border: "1px solid #eee",
                          gap: "10px",
                        }}
                      >
                        <Box
                          sx={{display: "flex", flexDirection: "row", marginLeft: "20px",}}
                        >
                          <img
                            src={item.imageUrl}
                            style={{
                              width: "80px",
                              height: "80px",
                              marginRight: "20px",
                            }}
                          />
                          <Box
                            sx={{display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "8px", marginTop: "-18px",}}
                          >
                            <Typography variant="subtitle1">
                              {item.productName}
                            </Typography>
                            <Typography variant="subtitle1">
                              {item.productName}
                            </Typography>
                            <Typography
                              variant="h4"
                              sx={{
                                fontSize: 14,
                                fontWeight: "800",
                              }}
                            >
                              {item.productId.name}
                            </Typography>
                            <div></div>
                            <Typography
                              variant="body2"
                              sx={{ marginRight: "10px" }}
                            >
                              Size: {item.type}
                            </Typography>
                            <Box
                              sx={{
                                marginTop: 1,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                border: `2px solid   ${
                                  item.color ? "transparent" : "#000000"
                                }`, // Conditional border color
                                height: "10px",
                                width: "10px",
                                backgroundColor: item.color,
                                borderRadius: "50%",
                                mb: 1,
                                boxShadow: item.color
                                  ? "0px 0px 8px rgba(0, 0, 0, 0.8)"
                                  : "none", // Conditional shadow
                                transition: "all 0.3s ease", // Smooth transition for hover effects
                                "&:hover": {
                                  borderColor: "#666666", // Change border color on hover
                                  boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.3)", // Enhance shadow on hover
                                },
                              }}
                            >
                              {" "}
                            </Box>
                            <div></div>
                            
                            <Box
                              key={index}
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                cursor: "pointer",
                              }}
                            ></Box>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            width: { xs: "92%", sm: "94%", md: "96%", },
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginLeft: "20px",
                            borderTop: "1px solid #eee",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "start",
                            }}
                          >
                            {/* Quantity Controls */}
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleQuantityChange(
                                  item.productId._id,
                                  item.quantity - 1,
                                  item.type,
                                  item.color
                                )
                              }
                              disabled={item.quantity === 1}
                            >
                              <RemoveCircleOutlineIcon />
                            </IconButton>
                            <Typography variant="body1" sx={{ margin: "0 10px" }}>
                              {item.quantity}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleQuantityChange(
                                  item.productId._id,
                                  item.quantity === item.stock
                                    ? item.quantity
                                    : item.quantity + 1,
                                  item.type,
                                  item.color
                                )
                              }
                              disabled={item.quantity === item.stock}
                            >
                              <AddCircleOutlineIcon />
                            </IconButton>
                          </Box>

                          {/* Remove Item Button */}
                          <IconButton
                            sx={{ marginLeft: "20px" }}
                            onClick={() =>
                              handleRemoveItem(
                                item.productId._id,
                                item.quantity,
                                item.type,
                                item.color
                              )
                            }
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </Box>


                        {/* Item Total Price */}
                        <Typography
                          variant="body1"
                          sx={{ marginLeft: "20px", fontWeight: "bold" }}
                        >
                          {(item.quantity * item.price).toFixed(2)} Rs.
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Grid>

              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    border: "1px solid #eee",
                    padding: "20px",
                    borderRadius: "4px",
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Cart totals
                  </Typography>

                  <Box sx={{ marginBottom: "20px" }}>
                    <Typography variant="body2" sx={{ marginTop: "10px" }}>
                      Note: Shipping charges will be decided in later stage may
                      vary from area to area.
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      borderTop: "1px solid #eee",
                      paddingTop: "20px",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h6">
                      {calculateSubtotal().toFixed(2)} Rs.
                    </Typography>
                  </Box>

                  <Button
                    disabled={cart.items.length === 0}
                    variant="contained"
                    fullWidth
                    sx={{
                      mt: 2,
                      paddingY: "5px",
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
                    onClick={handleCheckout}
                  >
                    Proceed to checkout
                  </Button>
                </Box>
              </Grid>
            </Grid>
            <Toaster position="top-right" reverseOrder={true} />
          </Box>
        </div>
      </Container>
      <ServicesSection />
    </>
  );
};

export default CartPage;
