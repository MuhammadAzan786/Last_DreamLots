import React, { useState, useEffect } from "react";
import axios from "axios";
import Marzipano from "marzipano";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import LocationMap from "../virtualTours/LocationMap"; // Import LocationMap component
import Autocomplete from "@mui/material/Autocomplete";
import { Upload as UploadIcon } from "@mui/icons-material";

import "leaflet/dist/leaflet.css";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Box,
  ImageList,
  ImageListItem,
  Backdrop,
  CircularProgress,
  Container,
  Input,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
} from "@mui/material";
import { useSelector } from "react-redux";

const AddProperty = () => {
  const user = useSelector((state) => state.Singleuser);
  console.log(user.data._id);
  // =================   imports   =============

  const [tourName, setTourName] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const [propertyType, setPropertyType] = useState("");
  const [loading, setLoading] = useState(false);
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [area, setArea] = useState("");
  const [location, setLocation] = useState({
    lat: 31.5204, // Default to Lahore, Pakistan
    lng: 74.3587,
  });

  const cities = [
    "Karachi",
    "Lahore",
    "Islamabad",
    "Rawalpindi",
    "Faisalabad",
    "Multan",
    "Peshawar",
    "Quetta",
    "Sialkot",
    "Gujranwala",
    "Bahawalpur",
    "Sargodha",
    "Mardan",
    "Hyderabad",
    "Larkana",
    "Gujrat",
    "Muzaffarabad",
    "Abbotabad",
    "Swat",
    "Dera Ghazi Khan",
  ];

  // ============= functions====================

  const handlePropertyTypeChange = (event) => {
    setPropertyType(event.target.value);
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);

    setImages((prevImages) => [...prevImages, ...files]);
    const filePreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prevPreviews) => [...prevPreviews, ...filePreviews]);
  };

  // Custom hook for handling map events (dragging the marker)
  const MapEventHandler = ({ setLocation }) => {
    useMapEvents({
      click(event) {
        const { lat, lng } = event.latlng;
        setLocation({ lat, lng });
      },
    });

    return null;
  };
  const handleThumbnailImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (setter) => (event) => {
    setter(event.target.value);
  };
  const handleCityChange = (event, newValue) => {
    setCity(newValue);
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append("images", image);
    });
    formData.append("name", tourName);
    formData.append("propertyType", propertyType);
    formData.append("area", area);
    formData.append("bedrooms", bedrooms);
    formData.append("bathrooms", bathrooms);
    formData.append("price", price);
    formData.append("city", city);
    formData.append("streetAddress", address);
    formData.append("location", JSON.stringify(location));
    formData.append("thumbnail", thumbnail);
    formData.append("seller", user.data._id);
    console.log("formdata", ...formData);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_DOMAIN_NAME}/api/property/add-property`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setLoading(false);
      console.log(res.data);
      alert("property created successfully!");

      setImages([]); // Assuming `images` is an array of image objects
      setTourName(""); // Reset tour name
      setImagePreviews([]);
      setPropertyType(""); // Reset property type
      setArea(""); // Reset area
      setBedrooms(""); // Reset bedrooms
      setBathrooms(""); // Reset bathrooms
      setPrice(""); // Reset price
      setCity(""); // Reset city
      setAddress(""); // Reset address
      setPreview(null);
      setLocation({
        lat: 31.5204, // Default to Lahore, Pakistan
        lng: 74.3587,
      }); // Reset location object
      setThumbnail(null); // Reset thumbnail
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert("Failed to create tour.");
    }
  };

  return (
    <>
      <Container maxWidth="xl">
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography
            gutterBottom
            sx={{
              fontWeight: "600",
              fontSize: "25px",
              color: "#3b4056",
              fontFamily: "Segoe UI",
            }}
          >
            Property Form
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Property Name"
                  variant="outlined"
                  value={tourName}
                  onChange={(e) => setTourName(e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="property-type-label">
                    Property Type
                  </InputLabel>
                  <Select
                    labelId="property-type-label"
                    id="property-type-select"
                    value={propertyType}
                    onChange={handlePropertyTypeChange}
                    label="Property Type"
                  >
                    <MenuItem value="apartment">Apartment</MenuItem>
                    <MenuItem value="house">House</MenuItem>
                    <MenuItem value="commercial">Commercial Space</MenuItem>
                    <MenuItem value="plot">Plot</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Built-Up Area (sq. ft.)"
                  value={area}
                  onChange={handleChange(setArea)}
                />
              </Grid>

              {/* Number of Bedrooms */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="bedrooms-label">
                    Number of Bedrooms
                  </InputLabel>
                  <Select
                    labelId="bedrooms-label"
                    value={bedrooms}
                    onChange={handleChange(setBedrooms)}
                    label="Number of Bedrooms"
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                    <MenuItem value={5}>5+</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Number of Bathrooms */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="bathrooms-label">
                    Number of Bathrooms
                  </InputLabel>
                  <Select
                    labelId="bathrooms-label"
                    value={bathrooms}
                    onChange={handleChange(setBathrooms)}
                    label="Number of Bathrooms"
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                    <MenuItem value={5}>5+</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Price (PKR)"
                  value={price}
                  onChange={handleChange(setPrice)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">PKR</InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Autocomplete
                  disablePortal
                  id="city-selector"
                  options={cities}
                  onChange={handleCityChange}
                  renderInput={(params) => (
                    <TextField {...params} label="City" />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Street Address"
                  variant="outlined"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <div>
                  <Typography
                    gutterBottom
                    sx={{
                      fontWeight: "500",
                      fontSize: "20px",
                      color: "#3b4056",
                      fontFamily: "Segoe UI",
                    }}
                  >
                    Select Property Location
                  </Typography>

                  {/* MapContainer with MapEventHandler for handling map clicks */}
                  <MapContainer
                    center={location}
                    zoom={10}
                    style={{ width: "100%", height: "400px" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <MapEventHandler setLocation={setLocation} />
                    <LocationMap location={location} />
                  </MapContainer>

                  {/* Latitude and Longitude TextFields */}
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Latitude"
                        value={location.lat}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Longitude"
                        value={location.lng}
                        margin="normal"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Grid>
                  </Grid>
                </div>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{}}>
                  <Grid container>
                    {/* Left Side: Upload Section */}
                    <Grid
                      item
                      xs={12}
                      md={6}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        border: "2px dashed #ccc",
                        borderRight: "none",
                        borderRadius: 1,
                        p: 3,
                        textAlign: "center",
                        height: 250,
                        cursor: "pointer", // Changes cursor to indicate a clickable area
                        transition: "all 0.3s ease",
                        "&:hover": {
                          borderColor: "#007bff", // Change border color on hover
                          boxShadow: "0px 4px 12px rgba(0, 123, 255, 0.2)", // Add box shadow on hover
                        },
                      }}
                      onClick={() =>
                        document.getElementById("thumbnail-upload").click()
                      } // Trigger file input on click
                    >
                      <Box sx={{ textAlign: "center", mb: 2 }}>
                        <UploadIcon
                          sx={{ fontSize: 90, color: "#acacac", mb: 0 }}
                        />{" "}
                        {/* Large Upload Icon */}
                      </Box>
                      <Box sx={{ textAlign: "center" }}>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleThumbnailImageChange}
                          sx={{ display: "none" }}
                          id="thumbnail-upload"
                        />
                        <Typography
                          variant="body1"
                          sx={{
                            color: "#3b4056",
                            fontWeight: "bold",
                            cursor: "pointer",
                            fontFamily: "Segoe UI",
                            mb: 1,
                            "&:hover": {
                              textDecoration: "underline", // Underline on hover
                            },
                          }}
                        >
                          Upload Thumbnail
                        </Typography>
                        <Typography variant="body2" sx={{ color: "gray" }}>
                          Supported formats: JPG, PNG
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Right Side: Image Preview */}
                    <Grid
                      item
                      xs={12}
                      md={6}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px solid #ccc",
                        borderRadius: 1,
                        borderLeft: "none",
                        height: 250, // Fixed height
                        backgroundColor: preview ? "transparent" : "#f5f5f5",
                        p: 1,
                      }}
                    >
                      {preview ? (
                        <img
                          src={preview}
                          alt="Thumbnail Preview"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <Typography variant="body1" sx={{ color: "gray" }}>
                          No Image Selected
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid container>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    component="label"
                    sx={{ ml: 3, mt: 2, mb: 2 }}
                  >
                    Select Images
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      hidden
                      onChange={handleImageChange}
                    />
                  </Button>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                {imagePreviews.map((preview, index) => (
                  <Grid item xs={4} key={index}>
                    <Box
                      component="img"
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      sx={{
                        width: "100%",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: 1,
                        border: "1px solid #ddd",
                      }}
                    />
                  </Grid>
                ))}
              </Grid>

              <Grid item xs={12}>
                <Button variant="contained" type="submit" color="secondary">
                  Create Property
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
        {loading && (
          <Backdrop
            sx={{
              color: "#fff",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={loading}
          >
            <CircularProgress />
          </Backdrop>
        )}
      </Container>
    </>
  );
};

export default AddProperty;
