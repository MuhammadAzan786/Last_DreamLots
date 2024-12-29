import React, { useState, useEffect } from "react";
import axios from "axios";
import Marzipano from "marzipano";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import LocationMap from "./LocationMap"; // Import LocationMap component
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

const AddVirtualTourForm = () => {
  const user = useSelector((state) => state.Singleuser);
  console.log(user.data._id);
  // =================   imports   =============

  const [tourName, setTourName] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const [images, setImages] = useState([]);
  const [hotspots, setHotspots] = useState({});
  const [propertyType, setPropertyType] = useState("");
  const [loading, setLoading] = useState(false);
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");
  const [location, setLocation] = useState({
    lat: 31.5204, // Default to Lahore, Pakistan
    lng: 74.3587,
  });
  const [currentHotspot, setCurrentHotspot] = useState({
    pitch: "",
    yaw: "",
    roomId: "",
    description: "",
    targetImage: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [viewer, setViewer] = useState(null);
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

  useEffect(() => {
    if (selectedImage) {
      const viewerElement = document.querySelector("#pano");

      // Destroy previous viewer instance
      if (viewer) {
        viewer.destroy();
      }

      const viewerInstance = new Marzipano.Viewer(viewerElement);
      const source = Marzipano.ImageUrlSource.fromString(
        URL.createObjectURL(selectedImage.file)
      );
      const geometry = new Marzipano.EquirectGeometry([{ tileSize: 512 }]);
      const view = new Marzipano.RectilinearView({
        yaw: 0,
        pitch: 0,
        fov: Math.PI / 2,
      });

      const scene = viewerInstance.createScene({ source, geometry, view });
      scene.switchTo();

      // Get hotspots for the selected image
      const imageHotspots = hotspots[selectedImage.name] || [];
      imageHotspots.forEach((hotspot) => {
        const hotspotElement = document.createElement("div");
        hotspotElement.classList.add("hotspot");
        hotspotElement.style.width = "20px";
        hotspotElement.style.height = "20px";
        hotspotElement.style.backgroundColor = "red";
        hotspotElement.style.borderRadius = "50%";
        hotspotElement.style.cursor = "pointer";

        hotspotElement.addEventListener("click", () => {
          const targetImage = images.find(
            (img) => img.name === hotspot.targetImage
          );
          console.log(targetImage);
          if (targetImage) {
            setSelectedImage(targetImage);
          }
        });

        scene.hotspotContainer().createHotspot(hotspotElement, {
          yaw: hotspot.yaw,
          pitch: hotspot.pitch,
        });
      });

      setViewer(viewerInstance);
    }
  }, [selectedImage, hotspots]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).map((file, index) => ({
      file,
      name: file.name || `Image ${index + 1}`,
    }));
    setImages(files);
    if (files.length > 0) {
      setSelectedImage(files[0]);
    }
  };

  const handleChange = (setter) => (event) => {
    setter(event.target.value);
  };
  const handleCityChange = (event, newValue) => {
    setCity(newValue);
  };

  const handleHotspotChange = (e) => {
    const { name, value } = e.target;
    setCurrentHotspot({
      ...currentHotspot,
      [name]: value,
    });
  };

  const handleImageClick = (e) => {
    if (viewer) {
      const clickPosition = viewer
        .view()
        .screenToCoordinates({ x: e.clientX, y: e.clientY });
      setCurrentHotspot({
        ...currentHotspot,
        pitch: clickPosition.pitch,
        yaw: clickPosition.yaw,
      });
    }
  };

  const addHotspot = () => {
    if (!selectedImage) return;

    setHotspots((prevHotspots) => ({
      ...prevHotspots,
      [selectedImage.name]: [
        ...(prevHotspots[selectedImage.name] || []),
        currentHotspot,
      ],
    }));

    setCurrentHotspot({
      pitch: "",
      yaw: "",
      roomId: "",
      description: "",
      targetImage: "",
    });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image.file);
    });
    formData.append("hotspots", JSON.stringify(hotspots));
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
        `${
          import.meta.env.VITE_BACKEND_DOMAIN_NAME
        }/api/virtualTours/createVirtualTour`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setLoading(false);
      console.log(res.data);
      alert("Tour created successfully!");

      setImages([]); // Assuming `images` is an array of image objects
      setHotspots([]); // Reset hotspots array
      setTourName(""); // Reset tour name
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
      setSelectedImage(null);
      setViewer(null);
      setCurrentHotspot({
        pitch: "",
        yaw: "",
        roomId: "",
        description: "",
        targetImage: "",
      });
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
            Virtual Tour Form
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tour Name"
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

              <Grid item xs={12}>
                <Button
                  component="label"
                  fullWidth
                  sx={{
                    backgroundColor: "#f5f5f5",
                    py: 4,

                    color: "#494949",
                    fontFamily: "Segoe UI",
                    fontSize: "15px",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    border: "2px dashed #c4c4c4",
                  }}
                  endIcon={<UploadIcon />}
                >
                  Upload Images
                  <input
                    type="file"
                    multiple
                    onChange={handleImageChange}
                    accept="image/*"
                    hidden
                    required
                  />
                </Button>
              </Grid>
              {images.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Set Names for Images
                  </Typography>
                  <Grid container spacing={2}>
                    {images.map((image, index) => (
                      <Grid item xs={12} key={index}>
                        <Box display="flex" alignItems="center">
                          <Typography sx={{ flex: "0 0 50px" }}>
                            {index + 1}.
                          </Typography>
                          <TextField
                            label="Image Name"
                            value={image.name}
                            onChange={(e) => {
                              const newImages = [...images];
                              newImages[index].name = e.target.value;
                              setImages(newImages);
                            }}
                            fullWidth
                            variant="outlined"
                          />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              )}

              {images.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Select an Image to Add Hotspots
                  </Typography>
                  <ImageList cols={4} rowHeight={150}>
                    {images.map((image, index) => (
                      <ImageListItem
                        key={index}
                        onClick={() => setSelectedImage(image)}
                        sx={{
                          cursor: "pointer",
                          border:
                            selectedImage === image
                              ? "3px solid #1976d2"
                              : "none",
                          borderRadius: "5px",
                          overflow: "hidden",
                          transition: "transform 0.2s",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                      >
                        <img
                          src={URL.createObjectURL(image.file)}
                          alt={`Image ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Grid>
              )}

              {selectedImage && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Click on the Image to Set a Hotspot
                  </Typography>
                  <Box
                    id="pano"
                    onClick={handleImageClick}
                    sx={{
                      width: "100%",
                      height: "500px",
                      position: "relative",
                      overflow: "hidden",
                      margin: "0 auto",
                      border: "1px solid #1976d2",
                      borderRadius: "8px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      backgroundColor: "#f7f7f7",
                    }}
                  />
                </Grid>
              )}

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Pitch"
                  name="pitch"
                  variant="outlined"
                  value={currentHotspot.pitch}
                  onChange={handleHotspotChange}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Yaw"
                  name="yaw"
                  variant="outlined"
                  value={currentHotspot.yaw}
                  onChange={handleHotspotChange}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Room ID"
                  name="roomId"
                  variant="outlined"
                  value={currentHotspot.roomId}
                  onChange={handleHotspotChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  variant="outlined"
                  value={currentHotspot.description}
                  onChange={handleHotspotChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Target Image"
                  name="targetImage"
                  variant="outlined"
                  value={currentHotspot.targetImage}
                  onChange={handleHotspotChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={addHotspot}
                  disabled={!selectedImage}
                >
                  Add Hotspot
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Button variant="contained" type="submit" color="secondary">
                  Create Tour
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

export default AddVirtualTourForm;
