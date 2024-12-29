import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import Marquee from "react-fast-marquee";
import { partner1, partner2, partner3, partner4, partner5 } from "../imports";

const CoorporationPartners = () => {
  const partners = [partner1, partner2, partner3, partner4, partner5];

  return (
    <>
      <Box sx={{ width: "100%", py: "120px", backgroundColor: "#f9f9f9" }}>
        <Box sx={{ mb: 6 }}>
          <Typography
            className="archive text-center text-[#0B355B] sm:my-12 md:my-14"
            sx={{
              fontSize: {
                lg: "2.3rem",
                md: "2.0rem",
                sm: "1.7rem",
                xs: "1.6rem",
              },
              fontWeight: "bold",
            }}
          >
            Satisfied Customers{" "}
          </Typography>
        </Box>

        {/* Marquee with Partner Images */}
        <Marquee autoFill={true} gradient={true} speed={40} pauseOnHover={true}>
          {partners.map((partner, index) => (
            <Box
              key={index}
              sx={{
                padding: "10px 40px",
                marginRight: "20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={partner}
                alt={`Partner ${index + 1}`}
                style={{
                  width: "200px",
                  height: "auto",
                }}
              />
            </Box>
          ))}
        </Marquee>
      </Box>
    </>
  );
};

export default CoorporationPartners;
