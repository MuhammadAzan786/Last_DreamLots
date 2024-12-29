import { Typography, Box } from "@mui/material";
import React from "react";
import { motion } from "framer-motion"; // Import motion from framer-motion
import { certificate } from "../imports";

const Certified = () => {
  return (
    <Box
      className="certified-container"
      sx={{ textAlign: "center", my: { xs: 6, sm: 12, md: 14 } }}
    >
      {/* Heading */}
      <Typography
        className="archive text-[#bd3d39]"
        sx={{
          fontSize: {
            lg: "2.3rem",
            md: "2.2rem",
            sm: "1.9rem",
            xs: "1.8rem",
          },
          fontWeight: "bold",
          mb: { xs: 4, sm: 6 }, // Margin bottom for spacing
        }}
      >
        Certification
      </Typography>

      {/* Certification Image with framer-motion animation */}
      <motion.div
        initial={{ opacity: 0, y: 50 }} // Initial state: hidden and moved down
        whileInView={{ opacity: 1, y: 0 }} // Reveal effect: become visible and move to original position
        transition={{ duration: 0.6, ease: "easeOut" }} // Transition configuration
        viewport={{ once: true }} // Animate only once when it comes into view
      >
        <Box
          component={motion.img}
          src={certificate} // Replace with actual image path
          alt="Certification"
          whileHover={{ scale: 1.05 }} // Scale effect on hover
          transition={{ duration: 0.3, ease: "easeInOut" }} // Hover transition effect
          sx={{
            width: { xs: "90%", sm: "70%", md: "50%" }, // Responsive width
            maxWidth: "600px",
            height: "auto",
            margin: "0 auto", // Center the image
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", // Subtle shadow for better visual effect
            borderRadius: "8px", // Rounded corners for the image
          }}
        />
      </motion.div>
    </Box>
  );
};

export default Certified;
