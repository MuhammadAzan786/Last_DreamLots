import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const Sellers = () => {
  const [rows, setRows] = useState([]);

  const fetchSellers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_DOMAIN_NAME}/api/authentication/sellers`
      );
      console.log("Response:", response.data);
      setRows(
        response.data.data.map((item, index) => ({
          id: index + 1,
          sellerId: item._id,
          username: item.username,
          email: item.email,
          city: item.city,
          role: item.role,
          isVerified: item.isVerified,
          createdAt: item.createdAt, // Use directly if API returns valid date strings
          lastLogin: item.lastLogin, // Use directly if API returns valid date strings
        }))
      );
    } catch (error) {
      console.error("Error fetching sellers:", error);
    }
  };

  const handleDelete = async (row) => {
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_DOMAIN_NAME
        }/api/authentication/deleteSeller/${row.sellerId}`
      );
      setRows(
        (prevRows) => prevRows.filter((item) => item.sellerId !== row.sellerId) // Use row.sellerId here
      );
      console.log(`Seller with ID ${row.sellerId} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting seller with ID ${row.sellerId}:`, error);
    }
  };

  const columns = [
    { field: "id", headerName: "#", width: 50 },
    { field: "username", headerName: "Username", width: 150 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "city", headerName: "City", width: 150 },
    {
      field: "role",
      headerName: "Role",
      width: 120,
    },
    {
      field: "isVerified",
      headerName: "Verified",
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value ? "Verified" : "Not Verified"}
          color={params.value ? "success" : "default"}
          variant="outlined"
        />
      ),
    },
    {
      field: "createdAt",
      headerName: "Added On",
      width: 200,
      renderCell: (params) => (
        <Box>{new Date(params.value).toLocaleString()}</Box>
      ),
    },
    {
      field: "lastLogin",
      headerName: "Last Login",
      width: 200,
      renderCell: (params) => (
        <Box>{new Date(params.value).toLocaleString()}</Box>
      ),
    },
    {
      field: "_id",
      headerName: "Delete Account",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <IconButton color="error" onClick={() => handleDelete(params.row)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  useEffect(() => {
    fetchSellers();
  }, []);

  return (
    <Box sx={{ height: "74vh", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={8}
        getRowId={(row) => row.id}
        rowsPerPageOptions={[8]}
        disableRowSelectionOnClick
        sx={{
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#f5f5f5",
            fontWeight: "bold",
            color: "#333",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            color: "#000",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#e0f7fa",
          },
          "& .MuiDataGrid-cell": {
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: "0.9rem",
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: "#f5f5f5",
          },
        }}
      />
    </Box>
  );
};

export default Sellers;
