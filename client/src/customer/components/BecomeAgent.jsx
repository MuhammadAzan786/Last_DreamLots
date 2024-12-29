import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { Container, Grid, Typography, Button } from "@mui/material";
import { styled } from "@mui/system";

const Section = styled("div")({
  // Your custom CSS styles for the section
});

const BecomeAgent = () => {
  // Simulated user login state (replace this with real authentication logic)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  const handleAddProperty = () => {
    if (isLoggedIn) {
      // Navigate to admin page if the user is logged in
      navigate("/admin");
    } else {
      // Navigate to login page if the user is not logged in
      navigate("/login");
    }
  };

  return (
    <Section
      sx={{
        height: "55vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container>
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <Grid item xs={12} lg={12}>
            <Typography
              variant="h3"
              align="center"
              sx={{ fontWeight: "bold", mb: 3 }}
            >
              Be a part of our growing real estate agents
            </Typography>
            <Grid container justifyContent="center">
              <Grid item>
                <Button
                  variant="contained"
                  sx={{ marginTop: "20px" }}
                  color="primary"
                  size="large"
                  onClick={handleAddProperty} // Call the handler on button click
                >
                  Add Your Property
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Section>
  );
};

export default BecomeAgent;
