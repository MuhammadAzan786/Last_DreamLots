import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";

// APIs
const FORGOT_PASSWORD_API = `${
  import.meta.env.VITE_BACKEND_DOMAIN_NAME
}/api/authentication/forgotPassword`;

// Validation Schema
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
});

export default function ForgotPassword() {
  const navigate = useNavigate();

  const handleForgotPassword = (values, { setSubmitting }) => {
    axios
      .post(
        FORGOT_PASSWORD_API,
        { email: values.email },
        { withCredentials: true }
      )
      .then(() => {
        navigate("/resetpasswordrequest");
        toast.success("Password reset link sent to your email.");
        setSubmitting(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to send password reset link.");
        setSubmitting(false);
      });
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 4,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: "0px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              padding: 3,
              width: "100%",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h5"
              sx={{ marginBottom: 2, fontWeight: "600" }}
            >
              Forgot Password
            </Typography>

            <Typography variant="body2" sx={{ marginBottom: 3 }}>
              Enter your email address to receive a password reset link.
            </Typography>

            <Formik
              initialValues={{ email: "" }}
              validationSchema={validationSchema}
              onSubmit={handleForgotPassword}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form>
                  <Field name="email">
                    {({ field }) => (
                      <TextField
                        {...field}
                        type="email"
                        label="Email Address"
                        variant="outlined"
                        fullWidth
                        sx={{
                          marginBottom: 2,
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-error": {
                              "& fieldset": {
                                borderColor: "red",
                              },
                            },
                          },
                          "& .MuiFormHelperText-root": {
                            color: "red",
                          },
                        }}
                        error={!!(errors.email && touched.email)}
                        helperText={<ErrorMessage name="email" />}
                      />
                    )}
                  </Field>

                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      backgroundColor: "#0b355b",
                      color: "white",
                      borderRadius: "0px",
                      width: "100%",
                      "&:hover": { backgroundColor: "#3c5d7c" },
                    }}
                    disabled={isSubmitting}
                  >
                    Send Reset Link
                  </Button>
                </Form>
              )}
            </Formik>

            <Typography variant="body2" sx={{ marginTop: 2 }}>
              Remember your password?{" "}
              <Button
                onClick={() => navigate("/login")}
                sx={{
                  color: "#0a66c2",
                  textTransform: "none",
                  fontWeight: "600",
                }}
              >
                <u>Login</u>
              </Button>
            </Typography>
          </Box>
        </motion.div>
      </Container>
      <Toaster position="bottom-right" reverseOrder={false} />
    </Box>
  );
}
