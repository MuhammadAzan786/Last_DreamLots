import React, { useEffect, useState } from "react";

import "./styles.css";

import ProductCard from "../components/productPageCard";
import { Container } from "@mui/system";
import Loading from "../../Admin/components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/Slices/productsSlice";
import { fetchCategories } from "../../redux/Slices/categoriesSlice";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import "./Pagination.css";
import {
  Box,
  Grid,
  Typography,
  Slider,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";

import CategoryChip from "../components/catagoreyChip";
import ReactPaginate from "react-paginate"; // for pagination
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { IconContext } from "react-icons"; // for customizing icons

import "./styles.css"; // stylesheet

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Start from page 1
  const [totalCount, setTotalCount] = useState(0);
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 10000]); // Default price range
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, applyFilter] = useState(false);
  const [isloading, setisLoading] = useState(true);
  const [isActive, setIsActive] = useState(false);
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const stateCategories = useSelector((state) => state.categories);
  useEffect(() => {
    if (stateCategories.data) {
      setCategories(stateCategories.data);
      // console.log(categories);
    }
  }, [stateCategories.data]);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
    setCurrentPage(1); // Reset to page 1 when selecting a new category
  };
  const handlePageClick = (event) => {
    setCurrentPage(event.selected + 1);

    // console.log(event.selected);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = new URL(
          `${import.meta.env.VITE_BACKEND_DOMAIN_NAME}/api/product/getProducts`
        );
        url.searchParams.set("page", currentPage);
        url.searchParams.set("limit", 9);

        if (selectedCategory) {
          url.searchParams.set("category", selectedCategory);
        }

        // Price Range Filter
        url.searchParams.set("minPrice", priceRange[0]);
        url.searchParams.set("maxPrice", priceRange[1]);

        // Search Query Filter
        if (searchQuery) {
          url.searchParams.set("search", searchQuery);
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data.products);
        setTotalCount(data.pagination.totalPages);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, selectedCategory, filter]); // Fetch when currentPage or selectedCategory changes

  const applyFilters = () => {
    setCurrentPage(1);
    applyFilter(!filter);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setPriceRange([0, 10000]); // Reset to default price range
    setSearchQuery("");
    setCurrentPage(1); // Optional: Reset to the first page

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = new URL(
          `${import.meta.env.VITE_BACKEND_DOMAIN_NAME}/api/product/getProducts`
        );
        url.searchParams.set("page", currentPage);
        url.searchParams.set("limit", 10);

        if (selectedCategory) {
          url.searchParams.set("category", selectedCategory);
        }

        // Price Range Filter
        url.searchParams.set("minPrice", priceRange[0]);
        url.searchParams.set("maxPrice", priceRange[1]);

        // Search Query Filter
        if (searchQuery) {
          url.searchParams.set("search", searchQuery);
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data.products);
        setTotalCount(data.pagination.totalPages);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    // Refetch products (this will use the default/cleared filter values)
    fetchProducts();
  };

  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);

    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  if (stateCategories.isLoading || loading) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen">
        <Loading />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column" },
        bg: "url(./images/bg.png)",
      }}
    >
      <Container
        sx={{
          maxWidth: "lg",
          pt: 15,
        }}
      >
        <Box
          sx={{
            mb: 2, // Adds margin below the entire container for better spacing
          }}
        >
          {/* Grid container for Category Dropdown, Search Input, and Buttons */}
          <Grid container spacing={2} alignItems="center">
            {/* Category Dropdown and Search Input */}
            <Grid item xs={12} md={8} container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Search products"
                  fullWidth
                  value={searchQuery}
                  onChange={handleSearchChange}
                  sx={{
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow for better focus
                    borderRadius: "0px",
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ minWidth: 200 }}>
                  <InputLabel id="category-label">Categories</InputLabel>
                  <Select
                    labelId="category-label"
                    value={selectedCategory}
                    onChange={(e) => handleCategorySelect(e.target.value)}
                    label="Categories"
                    sx={{
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      borderRadius: "0px",
                    }}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.categoryName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Buttons */}
            <Grid
              item
              xs={12}
              md={4}
              container
              spacing={2}
              justifyContent="flex-end"
            >
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={applyFilters}
                  startIcon={<FilterAltIcon />}
                  sx={{
                    backgroundColor: "#0B355B",
                    borderRadius: "0px",
                    textTransform: "none",
                    ":hover": {
                      backgroundColor: "#3c5d7c",
                    },
                  }}
                >
                  Apply Filters
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  onClick={clearFilters}
                  startIcon={<FilterAltOffIcon />}
                  sx={{
                    borderRadius: "0px",
                    textTransform: "none",
                    color: "#0B355B",
                    borderColor: "#0B355B",
                  }}
                >
                  Clear Filters
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Products List (Left) */}
      <Box sx={{ flex: 1 }}>
        {" "}
        {/* Takes up remaining space */}
        {products.length === 0 ? (
          <Container maxWidth="lg">
            <Typography variant="h6" align="center" sx={{ py: 10 }}>
              No products found
            </Typography>
          </Container>
        ) : (
          <Container maxWidth={"lg"}>
            <Grid container spacing={4}>
              {products.map((product) => (
                <ProductCard product={product} />
              ))}
            </Grid>

            <Grid container justifyContent={"center"}>
              <Box sx={{ marginTop: "50px", marginBottom: "30px" }}>
                <ReactPaginate
                  key={currentPage}
                  containerClassName={"pagination"}
                  pageClassName={"page-item"}
                  activeClassName={"active-page"}
                  onPageChange={handlePageClick}
                  pageCount={totalCount}
                  breakLabel="..."
                  previousLabel={
                    <IconContext.Provider
                      value={{ color: "#f7a400", size: "35px" }}
                    >
                      <div style={{ marginRight: "10px" }}>
                        <ArrowBackIosIcon
                          className={`icon-style ${
                            isActive ? "icon-style-active" : ""
                          }`}
                          onClick={() => setIsActive(!isActive)}
                        />
                      </div>
                    </IconContext.Provider>
                  }
                  nextLabel={
                    <IconContext.Provider
                      value={{ color: "#f7a400", size: "35px" }}
                    >
                      <div style={{ marginLeft: "10px" }}>
                        <ArrowForwardIosIcon
                          className={`icon-style ${
                            isActive ? "icon-style-active" : ""
                          }`}
                          onClick={() => setIsActive(!isActive)}
                        />
                      </div>
                    </IconContext.Provider>
                  }
                  renderOnZeroPageCount={null}
                  forcePage={currentPage - 1}
                  pageRangeDisplayed={8}
                />
              </Box>
            </Grid>
          </Container>
        )}
      </Box>
    </Box>
  );
};

export default Products;
