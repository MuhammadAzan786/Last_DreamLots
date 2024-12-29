import React from "react";
import { Container, Grid, Typography, Button, Card } from "@mui/material";
import { styled } from "@mui/system";
import invest from "../../assets/images/invest.png";
import wanted from "../../assets/images/wanted.png";

// Styled components for the card and image
const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  padding: theme.spacing(3),
  borderRadius: "12px",
  marginBottom: theme.spacing(2),
  height: "100%", // Ensure consistent height for cards
  minHeight: "500px", // Set a minimum height for the cards
}));

const Image = styled("img")({
  width: "80%",
  height: "300px", // Set a fixed height for images
  objectFit: "cover", // Ensures images maintain aspect ratio without stretching
  marginBottom: "15px",
});

// Main component
const InvestWanted = () => {
  // Card data for reusability
  const cardData = [
    {
      id: 1,
      image: invest,
      title: "Invest",
      description:
        "Invest in fully legal Imarat projects. Our “Ownerships & Approvals, Demand & Delivery” approach ensures fantastic returns with full risk mitigation.",
      buttonText: "Invest Now",
    },
    {
      id: 2,
      image: wanted,
      title: "Wanted",
      description:
        "In just 3 clicks, activate a team of experts to find the properties you need.",
      buttonText: "Wanted",
    },
  ];

  return (
    <Container sx={{ paddingY: 4 }}>
      <Grid container spacing={4} justifyContent="center" alignItems="stretch">
        {cardData.map((card) => (
          <Grid item xs={12} sm={6} key={card.id}>
            <StyledCard>
              <Image src={card.image} alt={card.title} />
              <Typography variant="h5" gutterBottom>
                {card.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {card.description}
              </Typography>
              <Button variant="contained" color="primary">
                {card.buttonText}
              </Button>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default InvestWanted;
