import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { fetchProducts } from "../../redux/Slices/productsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Chip, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { textAlign } from "@mui/system";

const columns = [
  {
    field: "productName",
    headerName: "Product Name",
    width: 200,
    renderCell: (params) => (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            color: "#333",
            fontWeight: "500",
            fontSize: "20px",
            paddingY: 3,
          }}
        >
          {params.value || "Unknown Product"}
        </Typography>
      </Box>
    ),
  },

  {
    field: "totalStock",
    headerName: "Total Stock",
    width: 150,
    renderCell: (params) => (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            height: "28px",
            backgroundColor: "#e6e6e6",
            color: "#000000",
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "0.8rem",
            borderRadius: "3px",
            padding: "0 12px",
          }}
        >
          {params.value}
        </Typography>
      </Box>
    ),
  },

  {
    field: "sizes",
    headerName: "Sizes",
    width: 200,
    renderCell: (params) => (
      <Box
        sx={{
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          height: "100%",
          flexWrap: "wrap",
          paddingY: 1,
          gap: 0.5,
        }}
      >
        {params.value?.split(", ").map((size, index) => (
          <Chip
            key={index}
            label={size}
            sx={{
              backgroundColor: "#e6e6e6",
              color: "#000000",
              fontWeight: "bold",
              fontSize: "0.8rem",
              borderRadius: "3px",
            }}
          />
        ))}
      </Box>
    ),
  },
  {
    field: "colors",
    headerName: "Colors",
    width: 350,
    renderCell: (params) => (
      <Box
        sx={{
          flexDirection: "column",
          gap: 1,
          whiteSpace: "normal",
        }}
      >
        {(params.value?.split(", ") || []).map((item, index) => {
          const [size, colorName, colorHex] = item.split(" - ");
          return (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2, // Add consistent spacing between items
                paddingY: 1,
                paddingX: 2, // Add horizontal padding for better structure
              }}
            >
              {/* Size Typography */}
              <Typography
                variant="body2"
                sx={{
                  height: "28px",
                  backgroundColor: "#f5f5f5",
                  color: "#000",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "0.8rem",
                  borderRadius: "4px",
                  paddingX: 2,
                  width: "60px", // Set consistent width for size column
                }}
              >
                {size}
              </Typography>

              {/* Arrow Icon */}
              <ArrowForwardIcon sx={{ color: "#bdbdbd" }} />

              {/* Color Box */}
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: colorHex, // Use colorHex dynamically
                  borderRadius: "4px",
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                }}
              />

              {/* Color Name Typography */}
              <Typography
                variant="caption"
                sx={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#666",
                  width: "100px", // Set consistent width for color name
                  textAlign: "left",
                }}
              >
                {colorName}
              </Typography>
            </Box>
          );
        })}
      </Box>
    ),
  },

  {
    field: "stockStatus",
    headerName: "Stock Status",
    width: 412,
    renderCell: (params) => {
      const stockItems = (params.value?.split("; ") || []).map((item) =>
        item.split(", ")
      );

      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            whiteSpace: "normal",
          }}
        >
          {stockItems.map((sizeData, sizeIndex) => {
            return (
              <Box
                key={sizeIndex}
                sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
              >
                {sizeData.map((item, colorIndex) => {
                  const [size, colorName, stock, colorHex] = item.split(" -> ");
                  return (
                    <Box
                      key={colorIndex}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingY: 1,
                        paddingX: 2,
                        gap: 2, // Add spacing between items
                      }}
                    >
                      {/* Size Typography */}
                      <Typography
                        variant="body2"
                        sx={{
                          height: "28px",
                          backgroundColor: "#f5f5f5",
                          color: "#000",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: "0.8rem",
                          borderRadius: "4px",
                          paddingX: 2,
                          width: "60px", // Set a consistent width for better alignment
                        }}
                      >
                        {size}
                      </Typography>

                      {/* Arrow Icon */}
                      <ArrowForwardIcon sx={{ color: "#bdbdbd" }} />

                      {/* Color Box */}
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          backgroundColor: colorHex,
                          borderRadius: "4px",
                          boxShadow:
                            "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                        }}
                      />

                      {/* Color Name Typography */}
                      <Typography
                        variant="caption"
                        sx={{
                          width: "100px", // Set a consistent width for better alignment
                          fontSize: "12px",
                          fontWeight: "600",
                          color: "#666",
                          textAlign: "left",
                        }}
                      >
                        {colorName}
                      </Typography>

                      {/* Arrow Icon */}
                      <ArrowForwardIcon sx={{ color: "#bdbdbd" }} />

                      {/* Stock Typography */}
                      <Typography
                        variant="body2"
                        sx={{
                          height: "28px",
                          backgroundColor: "#f5f5f5",
                          color: "#000",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: "0.8rem",
                          borderRadius: "4px",
                          paddingX: 2,
                          width: "60px", // Set a consistent width for better alignment
                        }}
                      >
                        {stock}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            );
          })}
        </Box>
      );
    },
  },
];

const StockTable = () => {
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();
  const state = useSelector((state) => state.products);
  const navigate = useNavigate();

  useEffect(() => {
    if (state.data) {
      setProducts(state.data.products);
    }
  }, [state.data]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const rows = products.map((product, index) => {
    const sizesData = product.sizes?.map((size) => size.size).join(", ") || "";
    const colorsData =
      product.sizes
        ?.map(
          (size) =>
            size.colors
              ?.map(
                (color) => `${size.size} - ${color.colorName} - ${color.color}`
              ) // Include colorName and color (hex code)
              .join(", ") || ""
        )
        .join(", ") || "";

    const stockData =
      product.sizes
        ?.map((size) =>
          size.colors
            ?.map(
              (color) =>
                `${size.size} -> ${color.colorName} -> ${color.stock} -> ${color.color}`
            ) // Include colorHex here
            .join(", ")
        )
        .join("; ") || "";

    return {
      id: product._id,
      productName: product.name || "Unknown Product",
      totalStock: product.sizes
        ? product.sizes.reduce(
            (acc, size) =>
              acc + size.colors?.reduce((sum, color) => sum + color.stock, 0) ||
              0,
            0
          )
        : 0,
      sizes: sizesData,
      colors: colorsData,
      stockStatus: stockData,
    };
  });

  const handleRowClick = (params) => {
    const productId = params.row.id; // Get the product ID from the row
    navigate(`/admin/edit-stock/${productId}`); // Navigate to the edit page with the product ID
  };

  return (
    <Box sx={{ height: "74vh", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={8}
        rowsPerPageOptions={[8]}
        disableRowSelectionOnClick
        onRowClick={handleRowClick} // Handle row click
        getRowHeight={() => "auto"}
        sx={{
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#e7edf3",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            color: "black",
          },
          "& .MuiDataGrid-scrollbarFiller": {
            backgroundColor: "#e7edf3",
          },
        }}
      />
    </Box>
  );
};

export default StockTable;
