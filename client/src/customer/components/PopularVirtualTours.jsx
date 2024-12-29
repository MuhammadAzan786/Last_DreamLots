import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Container, Grid, Typography, Button } from "@mui/material";
import { styled } from "@mui/system";
import ExploreIcon from "@mui/icons-material/Explore";
import BusinessIcon from "@mui/icons-material/Business";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Link } from "react-router-dom";
import axios from "axios";

const SectionContainer = styled("div")({
  paddingTop: "4rem",
  paddingBottom: "4rem",
  backgroundColor: "#f8f9fa",
  width: "100%",
});

const PropertySliderWrap = styled("div")({
  position: "relative",
  width: "100%",
});

const PropertyItem = styled("div")({
  padding: "0 10px",
  "& img": {
    width: "100%",
    height: "200px",
    objectFit: "cover",
  },
  "& .slick-slide": {
    padding: "0 10px",
  },
});

const PropertyContent = styled("div")({
  textAlign: "center",
  padding: "1rem",
  backgroundColor: "#fff",
  borderRadius: "8px",
});

const Price = styled(Typography)({
  marginBottom: "1rem",
  fontWeight: "bold",
});

const Address = styled(Typography)({
  marginBottom: "0.5rem",
  color: "#6c757d",
});

const City = styled(Typography)({
  marginBottom: "1rem",
  color: "#6c757d",
});

const Specs = styled("div")({
  display: "flex",
  justifyContent: "center",
  marginBottom: "1rem",
  "& span": {
    display: "flex",
    alignItems: "center",
    marginRight: "1rem",
    "&:last-child": {
      marginRight: 0,
    },
  },
});

const HeadingContainer = styled(Grid)({
  marginBottom: "2rem",
  alignItems: "center",
  justifyContent: "space-between",
});

const PopularVirtualTours = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const [tours, setTours] = useState([]);

  const fetchTours = async () => {
    axios
      .get(
        `${
          import.meta.env.VITE_BACKEND_DOMAIN_NAME
        }/api/virtualTours/getAllVirtualTours`
      )
      .then((data) => {
        setTours(data.data.data);
        console.log("data", data.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchTours();
  }, []);

  return (
    <SectionContainer>
      <Container>
        <HeadingContainer container>
          <Grid item>
            {/* <Typography
              variant="h4"
              component="h2"
              className="font-weight-bold text-primary heading"
              style={{ marginBottom: "1rem" }}
            >
              Popular Properties
            </Typography> */}
            <Typography
              variant="h4"
              align="center"
              sx={{ fontWeight: "bold", mb: 3 }}
            >
              Popular Property
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              sx={{
                bgcolor: "#2C387E",
                color: "#fff",
                "&:hover": { bgcolor: "#566098" },
              }}
              startIcon={<VisibilityOutlinedIcon />}
            >
              View All Properties
            </Button>
          </Grid>
        </HeadingContainer>
        <PropertySliderWrap>
          <Slider {...settings}>
            {tours?.map((tour, index) => (
              <PropertyItem key={index} component={Link} to="/propertyContent">
                <a href="/propertyContent" className="img">
                  <img src={tour.thumbnail?.url} alt={tour.name} />
                </a>
                <PropertyContent>
                  <Price variant="h6">RS {tour.price}</Price>
                  <Address variant="body2">{tour.city}</Address>
                  <City variant="body2"> {tour.streetAddress}</City>
                  <Specs>
                    <span>
                      <ExploreIcon style={{ marginRight: "0.5rem" }} />
                      {tour.bedrooms}
                    </span>
                    <span>
                      <BusinessIcon style={{ marginRight: "0.5rem" }} />{" "}
                      {tour.bathrooms}
                    </span>
                  </Specs>
                  <Button
                    variant="contained"
                    color="primary"
                    href="property-single.html"
                    className="py-2 px-3"
                  >
                    See details
                  </Button>
                </PropertyContent>
              </PropertyItem>
            ))}
          </Slider>
        </PropertySliderWrap>
      </Container>
    </SectionContainer>
  );
};

export default PopularVirtualTours;
