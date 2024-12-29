import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, Typography, Card, CardContent, CardMedia } from "@mui/material";
import lahore from "../../assets/images/lahore.jpg";
import karachi from "../../assets/images/karachi.jpg";
import islamabad from "../../assets/images/islamabad.jpg";
import multan from "../../assets/images/multan.jpg";
import quetta from "../../assets/images/quetta.jpg";
import "./AreaGuideCarousel.css"; // Custom styles for hover effects

const cities = [
  {
    name: "Lahore",
    description: "Your ultimate guide to Lahore's best neighborhoods.",
    image: lahore,
  },
  {
    name: "Karachi",
    description: "Experience Karachi like a local.",
    image: karachi,
  },
  {
    name: "Islamabad",
    description: "Discover the beauty of Islamabad.",
    image: islamabad,
  },
  {
    name: "Multan",
    description: "Explore the city of saints and its vibrant culture.",
    image: multan,
  },
  {
    name: "Quetta",
    description: "A glimpse into Quetta's stunning landscapes.",
    image: quetta,
  },
];

const AreaGuideCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768, // Tablet and smaller screens
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480, // Mobile screens
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Box sx={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <Typography variant="h4" align="center" sx={{ fontWeight: "bold", mb: 3 }}>
        Property in Poppular Areas
      </Typography>
      <Slider {...settings}>
        {cities.map((city, index) => (
          <Box key={index} sx={{ padding: "0 10px" }}>
            <Card
              sx={{
                borderRadius: "5px",
                overflow: "hidden",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                position: "relative",
                height: "300px",
              }}
            >
              <Box className="card-overlay">
                <Typography variant="h5" sx={{ color: "white", fontWeight: "bold" }}>
                  {city.name}
                </Typography>
              </Box>
              <CardMedia
                component="img"
                height="300"
                image={city.image}
                alt={city.name}
                sx={{
                  objectFit: "cover",
                  height: "100%",
                  width: "100%",
                  transition: "opacity 0.3s ease-in-out",
                }}
              />
              <CardContent sx={{ height: "80px", overflow: "hidden" }}>
                <Typography variant="body2" sx={{ textAlign: "center" }}>
                  {city.description}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default AreaGuideCarousel;
