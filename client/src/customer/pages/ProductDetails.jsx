import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import BoltIcon from "@mui/icons-material/Bolt";
import {
  Box,
  Grid,
  Typography,
  Chip,
  Button,
  Popover,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import Gallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import { BsCart4 } from "react-icons/bs";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleProduct } from "../../redux/Slices/singleProductSlice";
import Loading from "../../Admin/components/Loading";
import "./styles.css";
import "../../index.css";
import {
  addToCartOnServer,
  fetchCartFromServer,
} from "../../redux/Slices/cartSlice";
import { Container } from "@mui/system";
import DataSaverOnIcon from "@mui/icons-material/DataSaverOn";
import FeatureProducts from "../sections/FeatureProducts";
// Styled TabPanel component directly within the file
const TabPanel = styled("div")(({ theme, value, index }) => ({
  display: value === index ? "block" : "none",
  padding: theme.spacing(3),
  marginTop: "4rem",
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(6),
  },
}));

const CustomerProductDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [productData, setProductData] = useState({});
  const [images, setImages] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [selectedSize, setSelectedSize] = useState({});
  const [selectedColor, setSelectedColor] = useState({});
  const [selectedColorName, setSelectedColorName] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [currentItemStockInCart, setCurrentItemStockInCart] = useState(0);

  const user = useSelector((state) => state.Singleuser);
  const cart = useSelector((state) => state.cart.items);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  function truncateText(text, wordLimit) {
    if (!text) return ""; // Return an empty string if text is undefined or null
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return text;
  }
  const handleSizeChange = (size) => {
    const sizeData = sizes.find((s) => s.size === size);
    setColors(sizeData.colors);
    setSelectedColor(sizeData.colors?.[0]);
    setSelectedSize(sizeData);
    setQuantity(1);
  };

  const getChipProps = (type) => {
    switch (type) {
      case "AC_only":
        return {
          label: "AC Only",
          icon: <BoltIcon />,
          sx: {
            backgroundColor: "#e8f5e9", // Light green
            color: "#4caf50", // Darker green for text
            borderColor: "#4caf50",
            borderWidth: 1,
            borderStyle: "solid",
          },
        };
      case "DC_only":
        return {
          label: "DC Only",
          icon: <BoltIcon />,
          sx: {
            backgroundColor: "#e3f2fd", // Light blue
            color: "#2196f3", // Darker blue for text
            borderColor: "#2196f3",
            borderWidth: 1,
            borderStyle: "solid",
          },
        };
      case "AC_DC":
        return {
          label: "AC & DC",
          icon: <BoltIcon />,
          sx: {
            backgroundColor: "#fff3e0", // Light orange
            color: "#ff9800", // Darker orange for text
            borderColor: "#ff9800",
            borderWidth: 1,
            borderStyle: "solid",
          },
        };
      case "Inverter_Fan":
        return {
          label: "Inverter",
          icon: <BoltIcon />,
          sx: {
            backgroundColor: "#fff3e0", // Light orange
            color: "#ff9800", // Darker orange for text
            borderColor: "#ff9800",
            borderWidth: 1,
            borderStyle: "solid",
          },
        };
      default:
        return {
          label: "Unknown",
          icon: <BoltIcon />,
          sx: {
            backgroundColor: "#f5f5f5", // Light grey
            color: "#9e9e9e", // Darker grey for text
            borderColor: "#9e9e9e",
            borderWidth: 1,
            borderStyle: "solid",
          },
        };
    }
  };

  const handleColorChange = (color) => {
    const colorData = colors.find((c) => c.color === color);
    setSelectedColor(colorData);
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const addToCart = async (name, id, price, image, stock) => {
    // console.log("name", name, "image", image);
    // console.log("dataaaaa", user.data);
    if (user.data === null) {
      toast.error("Please login to add items to cart");

      return;
    }

    if (user.data.isVerified === false) {
      // console.log("verified", user.data.isVerified);
      toast.error("Please verify your account to add items to cart");
      setTimeout(() => {
        navigate("/emailverification");
      }, 1000);
      return;
    }

    const resultAction = await dispatch(
      addToCartOnServer({
        name: name,
        productId: id,
        quantity: quantity,
        type: selectedSize.size,
        color: selectedColor.color,

        price: parseFloat(price),
        imageUrl: image,
        stock: stock,
      })
    );
    // console.log("reasullt", resultAction);

    if (resultAction.payload === 1) {
      toast.error("Not enough stock for this item");
    }
    if (resultAction.payload === 0) {
      toast.success("Added to cart");
    }
  };

  const state = useSelector((state) => state.Singleproduct);
  useEffect(() => {
    if (state.data) {
      const product = state.data.data;
      setSizes(product.sizes);
      setColors(product.sizes[0].colors);
      setSelectedSize(product.sizes[0]);
      setSelectedColor(product.sizes[0].colors[0]);

      const formattedImages = product.Main_images.map((img) => ({
        original: img.url,
        originalClass: "gallery-image",
        thumbnailClass: "thumb-image",
      }));
      setProductData(product);

      setImages(formattedImages);

      const cartCount = () => {
        cart?.map((item) => {
          if (item.color === selectedColor.color) {
            setCurrentItemStockInCart(item.stock);
          }
        });
      };
      cartCount();
    }
  }, [state.data]);

  useEffect(() => {
    dispatch(fetchCartFromServer());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchSingleProduct({ id: id }));
  }, [dispatch]);

  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="mt-[4rem]">
      <Container maxWidth={"lg"}>
        <Box sx={{ p: { xs: 1, sm: 2, md: 3, lg: 4 } }}>
          <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={6}
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Gallery Section with responsive height */}
              <Box
                sx={{
                  flex: 1,
                  padding: "5px",
                  justifyContent: "center",
                  width: "100%",
                  overflow: "hidden",
                  border: "2px solid #e6e6e6",
                }}
              >
                <Gallery
                  items={images}
                  showThumbnails={false}
                  showPlayButton={false}
                  showFullscreenButton={false}
                  thumbnailPosition="bottom"
                  slideDuration={700}
                  slideInterval={3000}
                  showBullets={false}
                  showNav={true}
                  infinite={true}
                  autoPlay={true}
                />
              </Box>
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={6}
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Content Section */}
              <Box
                sx={{
                  flex: 1,
                  paddingX: "20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "start",
                  flexDirection: "column",
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: "1.7rem",
                      fontWeight: "700",
                      color: "#3a5872",
                      mb: 1,
                    }}
                  >
                    {productData.name ?? "Product name not available"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    gap: 8,
                    mb: 2,
                  }}
                >
                  <Box display={"flex"} alignItems={"center"}>
                    <DataSaverOnIcon
                      sx={{
                        marginRight: "5px",
                        color: selectedColor.stock <= 0 ? "red" : "#4da64d",
                      }}
                    />

                    <Typography
                      sx={{
                        fontSize: { xs: "0.8rem", sm: "1rem" },
                        fontWeight: "400",
                        mr: 1,
                      }}
                    >
                      {selectedColor.stock <= 0 ? "Out of Stock" : "in Stock"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: { xs: "1.1rem", sm: "1rem" },
                        fontWeight: "500",
                        color: "#F7A400",
                      }}
                    >
                      <Chip {...getChipProps(productData.currentType)} />
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  sx={{
                    fontWeight: "800",
                    fontSize: "1.1rem",
                    color: "#3A5872",
                  }}
                >
                  Description
                </Typography>
                <div>
                  <Box
                    component="span"
                    sx={{
                      display: "block",
                      fontSize: { xs: "0.7rem", sm: "0.9rem" },
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "wrap",
                      width: "100%",
                      mb: 1,
                    }}
                    aria-owns={open ? "mouse-over-popover" : undefined}
                    aria-haspopup="true"
                    onMouseEnter={handlePopoverOpen}
                    onMouseLeave={handlePopoverClose}
                  >
                    <div
                      className="product-description"
                      dangerouslySetInnerHTML={{
                        __html: truncateText(productData.description, 20),
                      }}
                    />
                  </Box>
                  <Popover
                    id="mouse-over-popover"
                    sx={{
                      pointerEvents: "none",
                      cursor: "pointer",
                    }}
                    open={open}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                    onClose={handlePopoverClose}
                    disableRestoreFocus
                  >
                    <Box
                      sx={{ p: 3 }}
                      className="product-description"
                      dangerouslySetInnerHTML={{
                        __html: productData.description,
                      }}
                    />
                  </Popover>
                </div>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    sx={{
                      fontSize: "1.5rem",
                      fontWeight: "700",
                      color: "#61798e",
                    }}
                  >
                    Rs {selectedSize.size_price ?? "size_price not available"}
                    .00
                  </Typography>
                </Box>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      variant="outlined"
                      sx={{
                        width: "100%",
                        borderRadius: "0",
                      }}
                    >
                      <InputLabel id="size-select-label">Size</InputLabel>
                      <Select
                        labelId="size-select-label"
                        value={selectedSize.size}
                        onChange={(e) => handleSizeChange(e.target.value)}
                        label="Size"
                        sx={{
                          borderRadius: "0",
                        }}
                      >
                        {sizes.map((size) => (
                          <MenuItem key={size.size} value={size.size}>
                            <Typography
                              sx={{
                                fontSize: { xs: "0.8rem", sm: "1rem" },
                                fontWeight: "500",
                                color:
                                  size.size === selectedSize.size
                                    ? "#3a5872"
                                    : "#666666",
                              }}
                            >
                              {size.size}
                            </Typography>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      variant="outlined"
                      sx={{
                        width: "100%",
                        borderRadius: "0",
                      }}
                    >
                      <InputLabel id="color-select-label">Color</InputLabel>
                      <Select
                        labelId="color-select-label"
                        value={selectedColor.color}
                        onChange={(e) => handleColorChange(e.target.value)}
                        label="Color"
                        sx={{
                          borderRadius: "0",
                        }}
                      >
                        {selectedSize && Array.isArray(selectedSize.colors) ? (
                          selectedSize.colors.map((c) => (
                            <MenuItem
                              key={c._id}
                              value={c.color}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 1,
                                width: "100%",
                                padding: "8px 16px",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                }}
                              >
                                <Box
                                  sx={{
                                    height: "25px",
                                    width: "25px",
                                    backgroundColor: c.color,
                                    boxShadow:
                                      c.color === selectedColor.color
                                        ? "0px 0px 4px rgba(0, 0, 0, 0.5)"
                                        : "none",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                      borderColor: "#666666",
                                      boxShadow:
                                        "0px 0px 6px rgba(0, 0, 0, 0.3)",
                                    },
                                  }}
                                />
                                <Typography>{c.colorName}</Typography>
                              </Box>
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>
                            Select size to show colors
                          </MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={6}>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          marginBottom: 1,
                          fontWeight: "500",
                          fontSize: "1rem",
                          color: "#4d4d4d",
                        }}
                      >
                        Quantity
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          border: "1px solid #b3b3b3",
                          width: "100%",
                          paddingY: "8px",
                          paddingX: "20px",
                        }}
                      >
                        <Box
                          onClick={() =>
                            quantity > 1 && setQuantity(quantity - 1)
                          }
                          size="large"
                          sx={{
                            backgroundColor: "#fff",
                            border: "1px solid #e6e6e6",
                            paddingX: 2,
                            paddingY: "5px",
                            cursor: quantity === 1 ? "not-allowed" : "pointer",
                            opacity: quantity === 1 ? 0.5 : 1,
                            "&:hover": {
                              backgroundColor:
                                quantity === 1 ? "#fff" : "#e0e0e0",
                            },
                          }}
                        >
                          <RemoveIcon />
                        </Box>
                        <Typography variant="h6" sx={{ margin: "0 10px" }}>
                          {quantity}
                        </Typography>
                        <Box
                          size="large"
                          onClick={() =>
                            setQuantity((quantity) =>
                              quantity < selectedColor.stock
                                ? quantity + 1
                                : quantity
                            )
                          }
                          sx={{
                            backgroundColor: "#fff",
                            paddingX: 2,
                            paddingY: "5px",
                            border: "1px solid #e6e6e6",
                            cursor:
                              quantity === selectedColor.stock
                                ? "not-allowed"
                                : "pointer",
                            opacity: quantity === selectedColor.stock ? 0.5 : 1,
                            "&:hover": {
                              backgroundColor: "#e0e0e0",
                            },
                          }}
                        >
                          <AddIcon />
                        </Box>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={6}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      onClick={() =>
                        addToCart(
                          productData.name,
                          productData._id,
                          selectedSize.size_price,
                          productData.thumbnail[0].url,
                          selectedColor.stock
                        )
                      }
                      disabled={selectedColor.stock <= 0}
                      sx={{
                        backgroundColor: "#0A3153",
                        color: "white",
                        "&:hover": { backgroundColor: "#082651" },
                        width: "100%",
                        borderRadius: "0px",
                        paddingY: "14px",
                      }}
                      startIcon={<BsCart4 />}
                    >
                      Add to Cart
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Accordion
                sx={{
                  marginTop: "50px",
                  width: "100%",
                  border: "2px solid #e6e6e6",
                  borderRadius: "0px",
                  paddingX: 5,
                }}
              >
                <AccordionSummary
                  id="panel-header"
                  aria-controls="panel-content"
                >
                  SPECIFICATIONS <ArrowDropDownIcon />
                </AccordionSummary>
                <AccordionDetails>
                  {selectedSize.specification}
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        </Box>
        <FeatureProducts />
      </Container>
      <Toaster position="top-right" reverseOrder={true} />
    </div>
  );
};

export default CustomerProductDetail;
