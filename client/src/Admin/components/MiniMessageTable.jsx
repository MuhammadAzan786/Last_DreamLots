import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages } from "../../redux/Slices/messageSlice";
import Loading from "./Loading";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

// Define columns with hover popover
const columns = [
  {
    field: "idz",
    headerName: "#",
    width: 80,
    renderCell: (params) => <HoverableCell params={params} field="idz" />,
  },
  {
    field: "name",
    headerName: "Name",
    width: 100,
    renderCell: (params) => <HoverableCell params={params} field="name" />,
  },
  {
    field: "subject",
    headerName: "Subject",
    width: 400,
    renderCell: (params) => <HoverableCell params={params} field="subject" />,
  },
];

const HoverableCell = ({ params, field }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [messageDetails, setMessageDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePopoverOpen = async (event) => {
    setAnchorEl(event.currentTarget);
    setLoading(true);

    // Fetch message details by ID
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_DOMAIN_NAME}/api/contact/messages/${params.row.id}`
      );
      if (!response.ok) throw new Error("Failed to fetch message details");
      const data = await response.json();
      setMessageDetails(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Box
        component="span"
        sx={{
          display: "block",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
        aria-owns={open ? "mouse-over-popover" : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        {params.value}
      </Box>
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: "none",
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Box sx={{ p: 2 }}>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <Box>
              <Typography variant="subtitle2">
                Received On:{" "}
                {new Date(messageDetails.createdAt).toLocaleDateString()}
              </Typography>
              <Typography variant="subtitle2">
                Email: {messageDetails.email}
              </Typography>
              <Typography variant="subtitle2">
                Phone: {messageDetails.phone}
              </Typography>
              <Typography variant="subtitle2" sx={{ whiteSpace: "pre-line" }}>
                Message: {messageDetails.message}
              </Typography>
            </Box>
          )}
        </Box>
      </Popover>
    </>
  );
};

const MiniMessageTable = ({ dateRange }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const { data, isLoading, isError } = useSelector((state) => state.messages);

  useEffect(() => {
    if (data.data) {
      setMessages(data.data);
    }
  }, [data.data]);

  useEffect(() => {
    dispatch(fetchMessages(dateRange));
  }, [dispatch, dateRange]);

  if (isLoading)
    return (
      <div
        style={{
          height: "50vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loading />
      </div>
    );
  
  const handleRowClick = (params) => {
    const messageId = params.row.id;
    navigate(`/admin/message-page/${messageId}`);
  };

  // Format data to fit DataGrid structure
  const rows = messages.map((item, index) => ({
    idz: index + 1,
    id: item._id,
    name: item.name,
    subject: item.subject,
  }));

  return (
    <Box sx={{ height: "25vh", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={2}
        getRowId={(row) => row.id}
        onRowClick={handleRowClick}
        disableRowSelectionOnClick
        pagination={false}
        hideFooter={true}
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
          "& .MuiDataGrid-cell": {
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          },
        }}
      />
    </Box>
  );
};

export default MiniMessageTable;
