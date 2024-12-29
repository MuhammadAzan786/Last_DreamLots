import React, { useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const UpdatePasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { token } = useParams();
  const PASSWORD_UPDATE_API = `${
    import.meta.env.VITE_BACKEND_DOMAIN_NAME
  }/api/authentication/resetPassword/${token}`;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    // console.log(PASSWORD_UPDATE_API);
    axios
      .post(PASSWORD_UPDATE_API, { password }, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message || "Password Updated successfully!");
        setTimeout(() => {
          toast.success("Password updated successfully");
          navigate("/login");
        }, 1000);
      })
      .catch((err) => {
        toast.error("Failed to update password. Please try again.");
        // console.log(err);
      });
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            backgroundColor: "white",
            padding: 4,
            borderRadius: 2,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#0b355b", // Consistent with button color
              mb: 3,
            }}
          >
            Update Your Password
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 4,
              color: "#555",
            }}
          >
            Enter your new password and confirm it to update your account.
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              type="password"
              label="New Password"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              type="password"
              label="Confirm Password"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error && (
              <Typography variant="body2" sx={{ color: "red", mb: 2 }}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#0b355b", // Consistent with button color
                "&:hover": {
                  backgroundColor: "#3c5d7c",
                },
                fontWeight: "bold",
                width: "100%",
              }}
            >
              Update Password
            </Button>
          </form>
        </Box>
      </Container>
      <Toaster position="bottom-right" reverseOrder={false} />
    </Box>
  );
};

export default UpdatePasswordPage;
