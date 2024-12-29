import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import logo from "../../assets/images/logo.png";
import login_img from "../../assets/images/login_img.jpg";
import { fetchUserData } from "../../redux/Slices/userSlice";
import toast, { Toaster } from "react-hot-toast";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { CircularProgress } from "@mui/material";

// APIs
const LOGIN_API = `${
  import.meta.env.VITE_BACKEND_DOMAIN_NAME
}/api/authentication/login`;

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string().required("Required"),
});

export default function Login() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.Singleuser);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = (values) => {
    setLoading(true);
    axios
      .post(LOGIN_API, values, { withCredentials: true })
      .then((res) => {
        setLoading(false);
        navigate("/");
        dispatch(fetchUserData({ id: res.data.user._id }));
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message);
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
        padding: { xs: 1, sm: 2, md: 4 },
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          padding: 0,
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: "0px",
              boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
              overflow: "hidden",
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              width: "100%",
              maxWidth: "800px",
              maxHeight: "90vh",
            }}
          >
            {/* Image Section */}
            <Box
              className="Hello"
              sx={{
                display: { xs: "none", md: "block" },
                flex: "1",
                overflow: "hidden",
                background: `url(${login_img}) center center no-repeat`,
                backgroundSize: "cover",
              }}
            />
            {/* Form Section */}
            <Box
              sx={{
                flex: "1",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: { xs: 2, sm: 3, md: 5 },
                width: "100%", // Ensure full width
              }}
            >
              <Box
                sx={{
                  textAlign: "center",
                  marginBottom: "20px",
                }}
              >
                <img
                  onClick={() => {
                    navigate("/");
                  }}
                  src={logo}
                  alt="Logo"
                  style={{
                    height: "60px",
                    maxWidth: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>

              <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={validationSchema}
                onSubmit={handleLogin}
              >
                {({ touched, errors }) => (
                  <Form style={{ width: "100%" }}>
                    <Field name="email">
                      {({ field, meta }) => (
                        <TextField
                          {...field}
                          type="email"
                          label="Email"
                          variant="outlined"
                          fullWidth
                          sx={{ marginBottom: 2 }} // Adjusted margin for better spacing
                          error={touched.email && Boolean(errors.email)}
                          helperText={
                            touched.email && <ErrorMessage name="email" />
                          }
                          InputProps={{
                            sx: {
                              borderColor:
                                touched.email && Boolean(errors.email)
                                  ? "red"
                                  : "inherit",
                              "&:focus": {
                                borderColor:
                                  touched.email && Boolean(errors.email)
                                    ? "red"
                                    : "inherit",
                              },
                            },
                          }}
                        />
                      )}
                    </Field>
                    <Field name="password">
                      {({ field, meta }) => (
                        <TextField
                          {...field}
                          type={showPassword ? "text" : "password"} // Toggle between text and password
                          label="Password"
                          variant="outlined"
                          fullWidth
                          sx={{ marginBottom: 3 }}
                          error={meta.touched && Boolean(meta.error)}
                          helperText={
                            meta.touched && <ErrorMessage name="password" />
                          }
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={handleClickShowPassword}
                                  edge="end"
                                  aria-label="toggle password visibility"
                                >
                                  {showPassword ? (
                                    <VisibilityOff />
                                  ) : (
                                    <Visibility />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                            sx: {
                              borderColor:
                                meta.touched && Boolean(meta.error)
                                  ? "red"
                                  : "inherit",
                              "&:focus": {
                                borderColor:
                                  meta.touched && Boolean(meta.error)
                                    ? "red"
                                    : "inherit",
                              },
                            },
                          }}
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
                        paddingX: "40px",
                        "&:hover": { backgroundColor: "#3c5d7c" },
                        width: "100%",
                      }}
                    >
                      Login
                    </Button>
                  </Form>
                )}
              </Formik>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  mt: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2">
                    Don't have an account?
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "#0a66c2",
                      cursor: "pointer",
                      marginLeft: "5px",
                      fontWeight: "600",
                    }}
                    onClick={() => navigate("/signup")}
                  >
                    <u>Sign up</u>
                  </Typography>
                </Box>
                <Box
                  sx={{
                    mt: 1,
                    color: "#0a66c2",
                    cursor: "pointer",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "600" }}
                    onClick={() => navigate("/forgotPass")}
                  >
                    <u>Forgot Password</u>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </motion.div>
      </Container>
      <Toaster position="bottom-right" reverseOrder={false} />
    </Box>
  );
}
