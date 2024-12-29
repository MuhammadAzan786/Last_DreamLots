import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  TextField,
  Pagination,
  Box,
} from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import SingleBedIcon from '@mui/icons-material/SingleBed';
import BathtubIcon from '@mui/icons-material/Bathtub';

function PropertyContent() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchFilters, setSearchFilters] = useState({
    propertyName: "",
    city: "",
    minPrice: "",
    maxPrice: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 6;

  useEffect(() => {
    // Fetch property data
    const fetchProperties = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/property/get-all-property");
        setProperties(response.data);
        setFilteredProperties(response.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };
    fetchProperties();
  }, []);

  const handleSearch = () => {
    const { propertyName, city, minPrice, maxPrice, bedrooms,bathrooms } = searchFilters;
    let filtered = properties;

    if (propertyName) {
      filtered = filtered.filter((property) =>
        property.propertyName.toLowerCase().includes(propertyName.toLowerCase())
      );
    }

    if (city) {
      filtered = filtered.filter((property) =>
        property.city.toLowerCase().includes(city.toLowerCase())
      );
    }

    if (minPrice) {
      filtered = filtered.filter((property) => property.propertyPrice >= parseInt(minPrice));
    }

    if (maxPrice) {
      filtered = filtered.filter((property) => property.propertyPrice <= parseInt(maxPrice));
    }

    setFilteredProperties(filtered);
    setCurrentPage(1); // Reset to first page
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  // Pagination Logic
  const startIndex = (currentPage - 1) * propertiesPerPage;
  const currentProperties = filteredProperties.slice(startIndex, startIndex + propertiesPerPage);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Search Filters */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Property Name"
            variant="outlined"
            fullWidth
            value={searchFilters.propertyName}
            onChange={(e) => setSearchFilters({ ...searchFilters, propertyName: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label="City"
            variant="outlined"
            fullWidth
            value={searchFilters.city}
            onChange={(e) => setSearchFilters({ ...searchFilters, city: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Min Price"
            variant="outlined"
            fullWidth
            type="number"
            value={searchFilters.minPrice}
            onChange={(e) => setSearchFilters({ ...searchFilters, minPrice: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Max Price"
            variant="outlined"
            fullWidth
            type="number"
            value={searchFilters.maxPrice}
            onChange={(e) => setSearchFilters({ ...searchFilters, maxPrice: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <Button variant="contained" color="primary" onClick={handleSearch} fullWidth>
            Search
          </Button>
        </Grid>
      </Grid>

      {/* Property Cards */}
      <Grid container spacing={3}>
        {currentProperties.map((property) => (
          <Grid item xs={12} sm={6} md={4} key={property._id}>
            <Card sx={{ height: "100%" }}>
              <CardMedia
                component="img"
                height="200"
                image={property.propertyImages?.[0] || "https://via.placeholder.com/300"}
                alt={property.propertyName}
              />
              <CardContent sx={{textAlign:"center"}}>
                <Typography variant="h6">{property.propertyName}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {property.address}, {property.city}
                </Typography>
                <Typography variant="h6" sx={{ mt: 1 }}>
                  PKR {property.propertyPrice}
                </Typography>
                <Box sx={{display:"flex", justifyContent:"center",alignItems:"center"}}>
                <Typography variant="body" sx={{ mt: 1 }}>
                   {property.bedrooms} <SingleBedIcon/>
                </Typography>
                <Typography variant="body" sx={{ mt: 1 }}>
                   {property.bathrooms} <BathtubIcon/>
                </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  component={Link}
                  to={`/view-detail`}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {filteredProperties.length > propertiesPerPage && (
        <Pagination
          sx={{ mt: 4, display: "flex", justifyContent: "center" }}
          count={Math.ceil(filteredProperties.length / propertiesPerPage)}
          page={currentPage}
          onChange={handlePageChange}
        />
      )}
    </Container>
  );
}

export default PropertyContent;
