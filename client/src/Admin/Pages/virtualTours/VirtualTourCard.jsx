import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Grid,
} from "@mui/material";
import KingBedOutlinedIcon from "@mui/icons-material/KingBedOutlined";
import BathtubOutlinedIcon from "@mui/icons-material/BathtubOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

const VirtualTourCard = ({ property }) => {
  const navigate = useNavigate();
  const { thumbnail, name, price, streetAddress, city, bedrooms, bathrooms } =
    property;

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        maxWidth: 345,
        borderRadius: "5px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.2)",
        },
      }}
      onClick={() => {
        navigate(`virtualTourDetail/${property._id}`);
      }}
    >
      <CardMedia
        component="img"
        image={thumbnail.url}
        alt={name}
        sx={{
          height: 200,
          objectFit: "cover",
          borderTopLeftRadius: 5,
          borderTopRightRadius: 5,
        }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {name}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="h6" fontWeight="bold" color="primary">
            RS: {price}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <LocationOnOutlinedIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              {city} , {streetAddress}
            </Typography>
          </Box>
        </Box>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <KingBedOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">{bedrooms} Rooms</Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <BathtubOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">{bathrooms} Bathrooms</Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions
        sx={{ display: "flex", justifyContent: "space-between", padding: 2 }}
      >
        <Button
          variant="outlined"
          color="primary"
          size="small"
          sx={{ flexGrow: 1 }}
        >
          View Tour
        </Button>
        {/* <Button
          variant="contained"
          size="small"
          sx={{ flexGrow: 1, backgroundColor: "#474E93" }}
        >
          Edit
        </Button> */}
      </CardActions>
    </Card>
  );
};

export default VirtualTourCard;
