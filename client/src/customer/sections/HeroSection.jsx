import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, CircularProgress } from "@mui/material"; // Added CircularProgress for loading spinner
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
        <Slider {...settings} style={{ height: "100%" }}>
          {banners?.map((banner) => (
            <div key={banner._id}>
              {banner.bannerImages.map((image) => (
                <div className="banner-container" key={image.public_id}>
                  <img
                    src={image.url}
                    alt={image.original_filename}
                    className="background-image"
                  />
                </div>
              ))}
            </div>
          ))}
        </Slider>
      )}
    </Box>
  );
};

export default HeroSection;
