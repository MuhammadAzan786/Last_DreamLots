import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import axios from "axios";

import DeleteIcon from "@mui/icons-material/Delete";

import "../Pages/Products/AddProduct.css";
import AddIcon from "@mui/icons-material/Add";
import SendIcon from "@mui/icons-material/Send";
import toast, { Toaster } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

const EditStock = () => {
  const navigate = useNavigate();

  const [sizes, setSizes] = useState([
    {
      size: "",
      specification: "",
      size_price: "",
      colors: [{ color: "", colorName: "", stock: "" }],
    },
  ]);

  const { id } = useParams();

  const handleAddSize = () => {
    setSizes([
      ...sizes,
      {
        size: "",
        specification: "",
        size_price: "",
        colors: [{ color: "", colorName: "", stock: "" }],
      },
    ]);
  };

  const handleAddColor = (event, sizeIndex) => {
    const newSizes = [...sizes];
    newSizes[sizeIndex].colors.push({ color: "", colorName: "", stock: "" });
    setSizes(newSizes);
  };

  const handleSizeChange = (index, event) => {
    const newSizes = [...sizes];
    newSizes[index][event.target.name] = event.target.value;
    setSizes(newSizes);
  };

  const handleColorChange = (sizeIndex, colorIndex, event) => {
    const newSizes = [...sizes];
    newSizes[sizeIndex].colors[colorIndex][event.target.name] =
      event.target.value;
    setSizes(newSizes);
  };
  const handleDeleteSize = (sizeIndex) => {
    const updatedSizes = sizes.filter((_, index) => index !== sizeIndex);
    setSizes(updatedSizes);
  };

  const handleDeleteColor = (sizeIndex, colorIndex) => {
    const updatedSizes = sizes.map((size, index) => {
      if (index === sizeIndex) {
        return {
          ...size,
          colors: size.colors.filter((_, colorIdx) => colorIdx !== colorIndex),
        };
      }

      return size;
    });
    setSizes(updatedSizes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    toast.success("Successfully Product Uploaded !");
    console.log("sizes", sizes);
    try {
      const response = await axios.patch(
        `${
          import.meta.env.VITE_BACKEND_DOMAIN_NAME
        }/api/product/editstock/${id}`,
        { sizes },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSizes([
        {
          size: "",
          specification: "",
          size_price: "",
          colors: [{ color: "", stock: "" }],
        },
      ]);

      navigate(`/admin/stock`);
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Error adding product");
    }
  };

  useEffect(() => {
    if (id) {
      const fetchCourseData = async () => {
        try {
          const response = await axios.get(
            `${
              import.meta.env.VITE_BACKEND_DOMAIN_NAME
            }/api/product/product/${id}`,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          const product = response.data.data;

          setSizes(product?.sizes);
        } catch (error) {
          console.error("There was an error fetching the course data!", error);
        }
      };

      fetchCourseData();
    }
  }, [id]);

  return (
    <Box padding={2}>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid
              container
              spacing={2}
              sx={{
                padding: "20px",
                backgroundColor: "#fff",
                boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                borderRadius: "8px",
              }}
            >
              <Grid item xs={12}>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", marginBottom: 0 }}
                >
                  Edit Product Stock
                </Typography>
              </Grid>

              <Grid item xs={12}>
                {sizes.map((size, sizeIndex) => (
                  <div key={sizeIndex}>
                    <Divider
                      sx={{
                        marginTop: 5,
                        borderBottom: "2px solid #c8cfd7",
                        display: sizeIndex > 0 ? "block" : "none",
                      }}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: sizeIndex > 0 ? 4 : 0,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="body1"
                          sx={{
                            marginTop: 0,
                            marginBottom: 1,
                            fontSize: "15px",
                            fontWeight: "600",
                            color: "#475f7b",
                          }}
                        >
                          Size {sizeIndex + 1}
                        </Typography>
                      </Box>
                      {sizeIndex === 0 ? (
                        ""
                      ) : (
                        <Box>
                          <Button
                            variant="text"
                            onClick={(event) => handleDeleteSize(sizeIndex)}
                            sx={{
                              color: "#d32f2f", // Red color for delete
                              "&:hover": { backgroundColor: "#fddede" }, // Light red hover effect
                              marginBottom: "10px",
                            }}
                            startIcon={<DeleteIcon sx={{ color: "#d32f2f" }} />}
                          >
                            Delete
                          </Button>
                        </Box>
                      )}
                      {sizeIndex === 0 && (
                        <Box>
                          <Button
                            variant="text"
                            onClick={handleAddSize}
                            sx={{
                              color: "#2b394a",
                              "&:hover": { backgroundColor: "#edeff2" },
                              marginBottom: "10px",
                            }}
                            startIcon={<AddIcon sx={{ color: "#2b394a" }} />}
                          >
                            Add Size
                          </Button>
                        </Box>
                      )}
                    </Box>
                    <div>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            id={`size-${sizeIndex}`}
                            label="Size:"
                            name="size"
                            type="text"
                            value={size.size}
                            onChange={(e) => handleSizeChange(sizeIndex, e)}
                            required
                            variant="outlined"
                            sx={{ width: "100%" }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            id={`size_price-${sizeIndex}`}
                            name="size_price"
                            type="number"
                            value={size.size_price}
                            required
                            onChange={(e) => handleSizeChange(sizeIndex, e)}
                            label="Price:"
                            variant="outlined"
                            sx={{ width: "100%" }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <textarea
                            id={`specification-${sizeIndex}`}
                            name="specification"
                            type="text"
                            value={size.specification}
                            required
                            onChange={(e) => handleSizeChange(sizeIndex, e)}
                            rows="2"
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Write size specification here in points..."
                          ></textarea>
                        </Grid>
                        <Grid item xs={12}>
                          {size.colors.map((color, colorIndex) => (
                            <div key={colorIndex}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  marginTop: colorIndex > 0 ? 2 : 0,
                                }}
                              >
                                <Box>
                                  <Typography
                                    variant="body1"
                                    sx={{
                                      marginTop: 1,
                                      marginBottom: 1,
                                      fontSize: "15px",
                                      fontWeight: "600",
                                      color: "#475f7b",
                                    }}
                                  >
                                    Color {colorIndex + 1}
                                  </Typography>
                                </Box>
                                {colorIndex === 0 && (
                                  <Box>
                                    <Button
                                      sx={{
                                        color: "#2b394a",
                                        "&:hover": {
                                          backgroundColor: "#edeff2",
                                        },
                                        marginBottom: "10px",
                                      }}
                                      variant="text"
                                      startIcon={
                                        <AddIcon sx={{ color: "#2b394a" }} />
                                      }
                                      onClick={(event) =>
                                        handleAddColor(event, sizeIndex)
                                      }
                                    >
                                      Add Color
                                    </Button>
                                  </Box>
                                )}
                                {colorIndex !== 0 && (
                                  <Box>
                                    <Button
                                      variant="text"
                                      onClick={(event) =>
                                        handleDeleteColor(sizeIndex, colorIndex)
                                      }
                                      sx={{
                                        color: "#d32f2f", // Red color for delete
                                        "&:hover": {
                                          backgroundColor: "#fddede",
                                        }, // Light red hover effect
                                        marginBottom: "10px",
                                      }}
                                      startIcon={
                                        <DeleteIcon sx={{ color: "#d32f2f" }} />
                                      }
                                    >
                                      Delete
                                    </Button>
                                  </Box>
                                )}
                              </Box>

                              <div>
                                <Grid container spacing={2}>
                                  <Grid item xs={12} md={4}>
                                    <TextField
                                      id={`color-${sizeIndex}-${colorIndex}`}
                                      name="color"
                                      type="text"
                                      value={color.color}
                                      onChange={(e) =>
                                        handleColorChange(
                                          sizeIndex,
                                          colorIndex,
                                          e
                                        )
                                      }
                                      required
                                      label="Color Code:"
                                      variant="outlined"
                                      sx={{ width: "100%" }}
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={4}>
                                    <TextField
                                      id={`color-${sizeIndex}-${colorIndex}`}
                                      name="colorName"
                                      type="text"
                                      value={color.colorName}
                                      onChange={(e) =>
                                        handleColorChange(
                                          sizeIndex,
                                          colorIndex,
                                          e
                                        )
                                      }
                                      required
                                      label="Color Name:"
                                      variant="outlined"
                                      sx={{ width: "100%" }}
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={4}>
                                    <TextField
                                      id={`stock-${sizeIndex}-${colorIndex}`}
                                      name="stock"
                                      type="number"
                                      value={color.stock}
                                      required
                                      onChange={(e) =>
                                        handleColorChange(
                                          sizeIndex,
                                          colorIndex,
                                          e
                                        )
                                      }
                                      label="Stock:"
                                      variant="outlined"
                                      sx={{ width: "100%" }}
                                    />
                                  </Grid>
                                </Grid>
                              </div>
                            </div>
                          ))}
                        </Grid>
                      </Grid>
                    </div>
                  </div>
                ))}
              </Grid>
              <Grid item xs={12} textAlign={"end"} sx={{ marginTop: "20px" }}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    paddingX: 3,
                    paddingY: 2,
                    backgroundColor: "#475f7b",
                    color: "#ffffff",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#24303e",
                      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
                      transform: "translateY(-10px)",
                      "& .MuiButton-startIcon": {
                        transform: "rotate(-45deg) scale(1.2) translateX(18px)",
                      },
                    },
                    "& .MuiButton-startIcon": {
                      transition: "transform 0.7s ease",
                    },
                  }}
                  startIcon={<SendIcon sx={{ marginRight: "20px" }} />}
                >
                  Update Stock
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Toaster position="bottom-right" reverseOrder={true} />
      </form>
    </Box>
  );
};

export default EditStock;
