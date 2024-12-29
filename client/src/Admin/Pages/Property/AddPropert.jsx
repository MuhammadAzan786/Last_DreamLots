import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Button,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useSelector } from "react-redux";
import axios from "axios";

const AddProperty = () => {
    const user = useSelector((state) => state.Singleuser);
  console.log(user.data._id);
  const [formData, setFormData] = useState({
    propertyName: "",
    propertyType: "",
    propertyCategory: "",
    propertyPrice: "",
    floors: 0,
    bedrooms: 0,
    bathrooms: 0,
    city: "",
    propertySize: "",
    description: "",
    lat: "",
    lng: "",
    gasSupply: false,
    waterSupply: false,
    electricity: false,
    solarEnergy: false,
    securityStaff: false,
    swimmingPool: false,
    garage: false,
    thumbnail: null,
    images: [],
  });

  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [location, setLocation] = useState({
    lat: 31.5204, // Default to Lahore, Pakistan
    lng: 74.3587,
  });
  const MapEventHandler = ({ setLocation }) => {
    useMapEvents({
      click(event) {
        const { lat, lng } = event.latlng;
        setLocation({ lat, lng });
      },
    });

    return null;
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "thumbnail") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, thumbnail: file }));
      setThumbnailPreview(URL.createObjectURL(file));
    } else if (name === "images") {
      const fileArray = Array.from(files);
      setFormData((prev) => ({ ...prev, images: fileArray }));
      setImagePreviews(fileArray.map((file) => URL.createObjectURL(file)));
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation example for price
    if (formData.propertyPrice <= 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        propertyPrice: "Price must be greater than 0",
      }));
      return;
    }

    setOpenSnackbar(true);
    const validBedrooms = formData.bedrooms || 1;  // default to 1 if not valid
    const validBathrooms = formData.bathrooms || 1;

    const newPropertyData = {
      ...formData,
      bedrooms: validBedrooms,
      bathrooms: validBathrooms,
    };

    const formDataToSubmit = new FormData();
    Object.keys(newPropertyData).forEach((key) => {
      formDataToSubmit.append(key, newPropertyData[key]);
    });

    if (formData.thumbnail) {
      formDataToSubmit.append("thumbnail", formData.thumbnail);
    }
    formData.images.forEach((image) => {
      formDataToSubmit.append("images", image);
    });

    try {
      const response = await axios.post(
        "http://localhost:4000/api/property/add-property",
        formDataToSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.data.token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Property added successfully:", response.data);
        setFormData({
          propertyName: "",
          propertyType: "",
          propertyCategory: "",
          propertyPrice: "",
          floors: 0,
          bedrooms: 0,
          bathrooms: 0,
          city: "",
          propertySize: "",
          description: "",
          lat: "",
          lng: "",
          gasSupply: false,
          waterSupply: false,
          electricity: false,
          solarEnergy: false,
          securityStaff: false,
          swimmingPool: false,
          garage: false,
          thumbnail: null,
          images: [],
        });
        setImagePreviews([]);
        setThumbnailPreview("");
        setLocation({ lat: 31.5204, lng: 74.3587 }); // Reset location after submission
        setOpenSnackbar(false); // Close snackbar
      }
    } catch (error) {
      console.error("Error adding property:", error);
      setOpenSnackbar(true);
    }
  };
  

  const handleMapClick = ({ lat, lng }) => {
    setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
      <Box component="main" sx={{ width: "100%", maxWidth: 1200 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
          Add Property
        </Typography>
        <Paper
          sx={{
            padding: 3,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: "#f9f9f9",
          }}
        >
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Property Name"
                  fullWidth
                  name="propertyName"
                  value={formData.propertyName}
                  onChange={handleInputChange}
                  error={Boolean(errors.propertyName)}
                  helperText={errors.propertyName}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Property Type"
                  fullWidth
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  select
                  required
                >
                  <MenuItem value="Apartment">Apartment</MenuItem>
                  <MenuItem value="House">House</MenuItem>
                  <MenuItem value="Plot">Plot</MenuItem>
                  <MenuItem value="Commercial">Commercial</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Property Category"
                  fullWidth
                  name="propertyCategory"
                  value={formData.propertyCategory}
                  onChange={handleInputChange}
                  select
                  required
                >
                  <MenuItem value="Buy">Buy</MenuItem>
                  <MenuItem value="Sell">Sell</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Property Price"
                  fullWidth
                  name="propertyPrice"
                  type="number"
                  value={formData.propertyPrice}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="No of Floors"
                  fullWidth
                  name="floors"
                  value={formData.floors}
                  onChange={handleInputChange}
                  select
                  required
                >
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="2">2</MenuItem>
                  <MenuItem value="3">3</MenuItem>
                  <MenuItem value="4">4</MenuItem>
                  <MenuItem value="5">5</MenuItem>
                  <MenuItem value="6">6</MenuItem>
                  <MenuItem value="7">7</MenuItem>
                  <MenuItem value="8">8</MenuItem>
                  <MenuItem value="9">9</MenuItem>
                  <MenuItem value="10+">10+</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="No of Bedrooms"
                  fullWidth
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  select
                  required
                >
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="2">2</MenuItem>
                  <MenuItem value="3">3</MenuItem>
                  <MenuItem value="4">4</MenuItem>
                  <MenuItem value="5">5</MenuItem>
                  <MenuItem value="6">6</MenuItem>
                  <MenuItem value="7">7</MenuItem>
                  <MenuItem value="8">8</MenuItem>
                  <MenuItem value="9">9</MenuItem>
                  <MenuItem value="10+">10+</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="No of Bathrooms"
                  fullWidth
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  select
                  required
                >
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="2">2</MenuItem>
                  <MenuItem value="3">3</MenuItem>
                  <MenuItem value="4">4</MenuItem>
                  <MenuItem value="5">5</MenuItem>
                  <MenuItem value="6">6</MenuItem>
                  <MenuItem value="7">7</MenuItem>
                  <MenuItem value="8">8</MenuItem>
                  <MenuItem value="9">9</MenuItem>
                  <MenuItem value="10+">10+</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="City"
                  fullWidth
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Property Size(in sqft)"
                  fullWidth
                  name="propertySize"
                  type="text"
                  value={formData.propertySize}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Property Description"
                  fullWidth
                  multiline
                  rows="5"
                  name="description"
                  type="text"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              <Grid container spacing={2}>
  {/* Left Column for Medium and Large Screens */}
  <Grid item xs={12} md={6} lg={6}>
    <Grid container spacing={2}  sx={{padding:"2rem"}}>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.gasSupply}
              onChange={handleCheckboxChange}
              name="gasSupply"
            />
          }
          label={
            <Box display="flex" alignItems="center" gap={1}>
              <Typography>Gas Supply Available</Typography>
            </Box>
          }
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.electricity}
              onChange={handleCheckboxChange}
              name="electricity"
            />
          }
          label="Electricity Available"
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.waterSupply}
              onChange={handleCheckboxChange}
              name="waterSupply"
            />
          }
          label="Water Supply Available"
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.garage}
              onChange={handleCheckboxChange}
              name="garage"
            />
          }
          label="garage Available"
        />
      </Grid>
    </Grid>
  </Grid>

  {/* Right Column for Medium and Large Screens */}
  <Grid item xs={12} md={6} lg={6}>
    <Grid container spacing={2}  sx={{padding:"2rem"}}>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.solarEnergy}
              onChange={handleCheckboxChange}
              name="solarEnergy"
            />
          }
          label={
            <Box display="flex" alignItems="center" gap={1}>
              <Typography>Solar System Available</Typography>
            </Box>
          }
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.securityStaff}
              onChange={handleCheckboxChange}
              name="securityStaff"
            />
          }
          label="Security Staff Available"
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.swimmingPool}
              onChange={handleCheckboxChange}
              name="swimmingPool"
            />
          }
          label="Swimming Pool Available"
        />
      </Grid>
    </Grid>
  </Grid>
</Grid>



              {/* Additional fields for bedrooms, bathrooms, etc. */}
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
                  <MapContainer center={[location.lat, location.lng]} zoom={13} style={{ height: "300px", width: "100%" }}>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  />
  <MapEventHandler setLocation={setLocation} />
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

              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                  sx={{ borderRadius: 2, backgroundColor: "#2C387E" }}
                >
                  Upload Thumbnail
                  <input
                    type="file"
                    name="thumbnail"
                    accept="image/*"
                    onChange={handleFileChange}
                    hidden
                  />
                  <AttachFileIcon />
                </Button>
                {thumbnailPreview && (
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail Preview"
                    style={{ width: "100%", marginTop: 10 }}
                  />
                )}



              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                  sx={{ borderRadius: 2, backgroundColor: "#2C387E" }}
                >
                  Upload Images
                  <input
                    type="file"
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    hidden
                  />
                  <AttachFileIcon />
                </Button>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    marginTop: 1,
                  }}
                >
                  {imagePreviews.map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt={`Preview ${idx + 1}`}
                      style={{ width: 100, height: 100, objectFit: "cover" }}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    backgroundColor: "#2C387E",
                    fontSize: "1.1rem",
                  }}
                >
                  Add Property
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
      <Snackbar
  open={openSnackbar}
  autoHideDuration={3000}
  onClose={() => setOpenSnackbar(false)}
>
  <Alert onClose={() => setOpenSnackbar(false)} severity="success">
    Property added successfully!
  </Alert>
</Snackbar>

    </Box>
  );
};

export default AddProperty;
