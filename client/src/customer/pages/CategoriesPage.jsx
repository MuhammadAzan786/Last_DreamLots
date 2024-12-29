import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  Skeleton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import Loading from "../../Admin/components/Loading";
import { fetchCategories } from "../../redux/Slices/categoriesSlice";
import { useNavigate } from "react-router-dom";
import ServicesSection from "../sections/ServicesSection";

const CategoriesPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loadedImages, setLoadedImages] = useState({});
  const state = useSelector((state) => state.categories);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (state.data) {
      setCategories(state.data);
    }
  }, [state.data]);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleImageLoad = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 7 }}>
        <Box p={{ xs: 2, sm: 3, md: 4 }}>
          <Grid container spacing={4}>
            {categories.map((category, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card
                    onClick={() => navigate(`/uniqueproducts/${category._id}`)}
                    sx={{
                      cursor: "pointer",
                      borderRadius: "0",
                      boxShadow: "none",
                      overflow: "hidden",
                      height: "auto",
                      position: "relative",
                      "&:hover": {
                        boxShadow: "0px 10px 30px rgba(0,0,0,0.3)",
                        transform: "scale(1.02)",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      },
                    }}
                  >
                    {!loadedImages[category._id] && (
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={isSmallScreen ? 200 : 300}
                      />
                    )}
                    <CardMedia
                      component="img"
                      height={isSmallScreen ? 200 : 300}
                      image={category.categoryImage.url}
                      alt={category.categoryName}
                      sx={{
                        objectFit: "cover",
                        width: "100%",
                        transition: "transform 0.3s ease",
                        display: loadedImages[category._id] ? "block" : "none",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                      }}
                      onLoad={() => handleImageLoad(category._id)}
                      onError={() => handleImageLoad(category._id)} // Ensure skeleton hides even if image fails to load
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        bgcolor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        color: "white",
                        p: 2,
                        transition: "opacity 0.3s ease",
                        opacity: 1,
                        "&:hover": {
                          opacity: 0,
                        },
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          color: "white",
                          fontWeight: "800",
                          mb: 1,
                          textShadow: "0px 1px 2px rgba(0,0,0,0.4)",
                        }}
                      >
                        {category.categoryName}
                      </Typography>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
      <ServicesSection />
    </>
  );
};

export default CategoriesPage;
