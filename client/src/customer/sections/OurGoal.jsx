import React from "react";
import home1 from "../images/home1.jpg";
import { Container, Grid, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const OurGoal = () => {
  const navigate = useNavigate();

  return (
    <>
      <Container
        maxWidth="lg"
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        sx={{
          py: 10,
          height: "auto",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          backgroundColor: "#f5f5f5",
          borderRadius: "5px",
        }}
      >
        <Grid container spacing={6}>
          <Grid
            item
            xs={12}
            md={5}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: { md: "center", lg: "flex-start" },
            }}
            component={motion.div}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{
                textAlign: { xs: "center", md: "left" },
                color: "#333333",
                fontWeight: "600",
              }}
              className="archive"
            >
              Our Goal
            </Typography>
            <Typography
              variant="body1"
              align="justify"
              component={motion.p}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
            >
              Our goal is to revolutionize the way you explore real estate by
              offering an immersive virtual tour experience that brings
              properties to life. We aim to simplify your search for the perfect
              home, office, or investment by providing 360° views of luxurious
              apartments, modern villas, and prime locations. Our commitment is
              to empower you with the tools to make informed decisions, saving
              time and effort while delivering a seamless, innovative, and
              enjoyable property exploration journey. Your dream space awaits!
            </Typography>
            <Button
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variant="contained"
              onClick={() => navigate("/about")}
              sx={{
                paddingX: 5,
                marginTop: 4,
                backgroundColor: "#0B355B",
                borderRadius: "5px",
                border: "2px solid #0B355B",
                fontWeight: "600",
                boxShadow:
                  "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.10) 0px 10px 10px",

                "&:hover": {
                  backgroundColor: "#F5F5F5",
                  border: "2px solid #0B355B",
                  color: "#0B355B",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  boxShadow:
                    "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px",
                },
              }}
            >
              About Us
            </Button>
          </Grid>
          <Grid
            item
            xs={12}
            md={7}
            component={motion.div}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Box
              component="img"
              src={home1}
              alt="home image"
              sx={{
                width: "100%",
                height: "auto",
                borderRadius: 1,
                boxShadow:
                  "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default OurGoal;
