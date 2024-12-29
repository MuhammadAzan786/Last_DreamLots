import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, CircularProgress, Typography } from "@mui/material";
import axios from "axios";

const HeroSection = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all banners on component mount
  useEffect(() => {
    const fetchBanners = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_DOMAIN_NAME}/api/banner/getAllBanners`
        );
        setBanners(response.data.data);
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <Box sx={{ width: "100%", overflow: "hidden", height: "100%" }}>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh", // Full height for the loading spinner
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Slider {...settings} style={{ height: "100vh" }}>
          {banners?.map((banner) => (
            <div key={banner._id}>
              {banner.bannerImages.map((image) => (
                <Box
                  key={image.public_id}
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: "100vh", // Full screen height for banners
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={image.url}
                    alt={image.original_filename}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  {/* Overlay */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      backgroundColor: "rgba(0, 0, 0, 0.6)", // Semi-transparent black overlay
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "white",
                      textAlign: "center",
                      px: 2, // Padding for responsive text
                    }}
                  >
                    <Typography variant="h3" sx={{ fontWeight: "bold", color:"white" }}>
                      Explore Virtually, Find Home Sweet Home!
                    </Typography>
                  </Box>
                </Box>
              ))}
            </div>
          ))}
        </Slider>
      )}
    </Box>
  );
};

export default HeroSection;
