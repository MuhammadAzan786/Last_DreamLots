import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrder } from "../../redux/Slices/ordrSlice";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import toast, { Toaster } from "react-hot-toast";
import DeleteIcon from "@mui/icons-material/Delete";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";

import {
  Button,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Backdrop,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";

const OrdersTable = ({ dateRange }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [shipmentMenuAnchorEl, setShipmentMenuAnchorEl] = useState(null);
  const [paymentMenuAnchorEl, setPaymentMenuAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [shipmentStatusToUpdate, setShipmentStatusToUpdate] = useState(null); // Track the order that needs to be updated

  const shipmentMenuOpen = Boolean(shipmentMenuAnchorEl);
  const paymentMenuOpen = Boolean(paymentMenuAnchorEl);

  const { data, isLoading, isError } = useSelector((state) => state.orders);

  useEffect(() => {
    if (data?.data) {
      setOrders(data.data);
    }
  }, [data]);

  useEffect(() => {
    dispatch(fetchOrder(dateRange));
  }, [dispatch, dateRange]);

  const handleShipmentMenuOpen = (event, row) => {
    setShipmentMenuAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleShipmentMenuClose = () => {
    setShipmentMenuAnchorEl(null);
    setSelectedRow(null);
  };

  const handlePaymentMenuOpen = (event, row) => {
    setPaymentMenuAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handlePaymentMenuClose = () => {
    setPaymentMenuAnchorEl(null);
    setSelectedRow(null);
  };

  const handleRowClick = (params) => {
    const messageId = params.row.orderId;
    navigate(`/admin/order-details/${messageId}`);
  };

  const handlePdfClick = (params) => {
    navigate(`/admin/invoice/${params.row.orderId}`);
  };

  const handleDelete = async (row) => {
    setLoading(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_DOMAIN_NAME}/api/order/deleteorder/${
          row.orderId
        }`
      );
      dispatch(fetchOrder(dateRange));
      toast.success("Order deleted successfully");
    } catch (error) {
      console.log("Error deleting order:", error);
    }
    setLoading(false);
  };

  const handleShipmentStatusChange = async (orderId, newStatus) => {
    handleShipmentMenuClose();

    if (newStatus === "Shipped") {
      setShipmentStatusToUpdate({ orderId, newStatus });
      setModalOpen(true); // Open modal for tracking ID input
      return;
    }

    // For statuses other than "Shipped", just update the shipment status directly
    await updateShipmentStatus(orderId, newStatus);
  };

  const addTrackingId = async (orderId, trackingId) => {
    setModalOpen(false);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_DOMAIN_NAME}/api/order/trackingId`,
        { trackingId, orderId }
      );
    } catch (error) {
      console.error("Error adding tracking ID:", error);
      throw new Error("Tracking ID submission failed");
    }
  };

  const updateShipmentStatus = async (orderId, newStatus) => {
    setLoading(true);
    try {
      await axios.patch(
        `${
          import.meta.env.VITE_BACKEND_DOMAIN_NAME
        }/api/order/updateorderstatus/${orderId}`,
        { shipmentStatus: newStatus }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating shipment status:", error);
    }
    setLoading(false);
  };

  const handleTrackingIdSubmit = async () => {
    const { orderId, newStatus } = shipmentStatusToUpdate;

    if (!trackingId) {
      toast.error("Please enter a valid tracking ID");
      return;
    }

    try {
      // Step 1: Add tracking ID via separate API
      await addTrackingId(orderId, trackingId);

      // Step 2: Once tracking ID is added, update the shipment status to 'Shipped'
      await updateShipmentStatus(orderId, newStatus);

      toast.success("Tracking ID added and status updated to 'Shipped'");
      setModalOpen(false);
      setTrackingId("");
    } catch (error) {
      console.error("Error submitting tracking ID:", error);
      toast.error("Failed to add tracking ID or update status");
    }
  };

  const handleConfirmationStatusChange = async (orderId, newStatus) => {
    setLoading(true);
    handlePaymentMenuClose();
    try {
      const response = await axios.patch(
        `${
          import.meta.env.VITE_BACKEND_DOMAIN_NAME
        }/api/order/updatepaymentstatus/${orderId}`,
        { confirmationStatus: newStatus }
      );

      if (response.status === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  paymentInfo: { ...order.paymentInfo, status: newStatus },
                }
              : order
          )
        );
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
    setLoading(false);
  };

  const columns = [
    { field: "id", headerName: "#", width: 60 },
    { field: "orderId", headerName: "Order Id", width: 150 },
    { field: "orderNumber", headerName: "Order Number", width: 150 },
    { field: "customerName", headerName: "Customer Name", width: 150 },
    { field: "address", headerName: "Address", width: 300 },
    { field: "date", headerName: "Date", width: 150 },
    { field: "price", headerName: "Price", width: 100 },
    {
      field: "confirmationStatus",
      headerName: "Payment Status",
      width: 200,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="body2" sx={{ marginRight: 1 }}>
            {params.row.confirmationStatus}
          </Typography>
          <IconButton
            onClick={(event) => handlePaymentMenuOpen(event, params.row)}
            size="small"
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={paymentMenuAnchorEl}
            open={
              paymentMenuOpen && selectedRow?.orderId === params.row.orderId
            }
            onClose={handlePaymentMenuClose}
          >
            <MenuItem
              onClick={() =>
                handleConfirmationStatusChange(params.row.orderId, "Paid")
              }
            >
              Paid
            </MenuItem>
            <MenuItem
              onClick={() =>
                handleConfirmationStatusChange(params.row.orderId, "Unpaid")
              }
            >
              Unpaid
            </MenuItem>
          </Menu>
        </Box>
      ),
    },
    {
      field: "shipmentStatus",
      headerName: "Shipment Status",
      width: 203,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="body2" sx={{ marginRight: 1 }}>
            {params.row.shipmentStatus}
          </Typography>
          <IconButton
            onClick={(event) => handleShipmentMenuOpen(event, params.row)}
            size="small"
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={shipmentMenuAnchorEl}
            open={
              shipmentMenuOpen && selectedRow?.orderId === params.row.orderId
            }
            onClose={handleShipmentMenuClose}
          >
            <MenuItem
              onClick={() =>
                handleShipmentStatusChange(params.row.orderId, "Processing")
              }
            >
              Processing
            </MenuItem>
            <MenuItem
              onClick={() =>
                handleShipmentStatusChange(params.row.orderId, "Unshipped")
              }
            >
              Unshipped
            </MenuItem>
            <MenuItem
              onClick={() =>
                handleShipmentStatusChange(params.row.orderId, "Shipped")
              }
            >
              Shipped
            </MenuItem>
          </Menu>
        </Box>
      ),
    },
    {
      field: "manageOrder",
      headerName: "Manage Your Order",
      width: 203,
      renderCell: (params) => (
        <>
          <IconButton
            sx={{ color: "blue" }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleRowClick(params);
            }}
            aria-label="View"
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            sx={{ color: "blue" }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handlePdfClick(params);
            }}
            aria-label="View"
          >
            <PictureAsPdfIcon />
          </IconButton>
          <IconButton
            sx={{ color: "red" }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDelete(params.row);
            }}
            aria-label="delete"
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  if (isLoading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loading />
      </div>
    );
  if (isError) return <div>Error fetching orders</div>;

  const rows = orders?.map((order, index) => ({
    id: index + 1,
    orderId: order._id,
    orderNumber: order.orderNumber,
    customerName: order.shippingInfo.username,
    address: order.shippingInfo.address,
    date: new Date(order.createdAt).toISOString().split("T")[0],
    price: order.totalPrice,
    confirmationStatus: order.paymentInfo.status,
    shipmentStatus: order.orderStatus,
  }));

  return (
    <Box sx={{ height: "74vh", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={8}
        getRowId={(row) => row.id}
        rowsPerPageOptions={[8]}
        sx={{
          "& .MuiDataGrid-columnHeader": { backgroundColor: "#e7edf3" },
          "& .MuiDataGrid-columnHeaderTitle": { color: "black" },
          "& .MuiDataGrid-scrollbarFiller": { backgroundColor: "#e7edf3" },
          "& .MuiDataGrid-cell": {
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          },
        }}
      />
      {loading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}

      {/* Modal for entering tracking ID */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>Enter Tracking ID</DialogTitle>
        <DialogContent>
          <TextField
            label="Tracking ID"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleTrackingIdSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Toaster position="bottom-right" reverseOrder={false} />
    </Box>
  );
};

export default OrdersTable;
