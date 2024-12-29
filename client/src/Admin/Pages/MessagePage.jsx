import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Divider,
  Grid,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useParams } from "react-router-dom";

// Styled components for enhanced look
const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: "0px 0px 15px rgba(0,0,0,0.1)",
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  border: "none",
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  //   borderColor: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
}));

const MessagePage = () => {
  const [messageData, setMessageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    // Fetch message data from API
    const fetchMessageData = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_DOMAIN_NAME
          }/api/contact/messages/${id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setMessageData(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessageData();
  }, [id]);

  // Convert createdAt to readable date format
  const messageReceivedOn = messageData
    ? new Date(messageData.createdAt).toLocaleDateString()
    : "";

  if (loading)
    return <CircularProgress sx={{ display: "block", mx: "auto", mt: 5 }} />;
  if (error)
    return (
      <Alert severity="error" sx={{ mt: 5 }}>
        {error}
      </Alert>
    );

  return (
    <Container maxWidth="md">
      <StyledCard variant="outlined">
        <CardContent>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "500" }}>
            Message Details
          </Typography>
          <StyledDivider />
          <Grid container spacing={3}>
            {messageData && (
              <>
                <Grid item xs={12} md={6}>
                  <StyledTypography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold" }}
                  >
                    Name:
                  </StyledTypography>
                  <StyledTypography
                    variant="body1"
                    sx={{ color: "text.secondary" }}
                  >
                    {messageData.name}
                  </StyledTypography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <StyledTypography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold" }}
                  >
                    Subject:
                  </StyledTypography>
                  <StyledTypography
                    variant="body1"
                    sx={{ color: "text.secondary" }}
                  >
                    {messageData.subject}
                  </StyledTypography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <StyledTypography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold" }}
                  >
                    Email:
                  </StyledTypography>
                  <StyledTypography
                    variant="body1"
                    sx={{ color: "text.secondary" }}
                  >
                    {messageData.email}
                  </StyledTypography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <StyledTypography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold" }}
                  >
                    Phone:
                  </StyledTypography>
                  <StyledTypography
                    variant="body1"
                    sx={{ color: "text.secondary" }}
                  >
                    {messageData.phone}
                  </StyledTypography>
                </Grid>
                <Grid item xs={12}>
                  <StyledTypography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold" }}
                  >
                    Message:
                  </StyledTypography>
                  <StyledTypography
                    variant="body1"
                    sx={{ whiteSpace: "pre-line", color: "text.secondary" }}
                  >
                    {messageData.message}
                  </StyledTypography>
                </Grid>
                <Grid item xs={12}>
                  <StyledTypography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold" }}
                  >
                    Received On:
                  </StyledTypography>
                  <StyledTypography
                    variant="body1"
                    sx={{ color: "text.secondary" }}
                  >
                    {messageReceivedOn}
                  </StyledTypography>
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
      </StyledCard>
    </Container>
  );
};

export default MessagePage;
