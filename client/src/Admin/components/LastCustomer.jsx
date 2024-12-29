import { Box, Typography } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages } from "../../redux/Slices/messageSlice";
import MessagesTable from "./MessagesTable";
import MiniMessageTable from "./MiniMessageTable.jsx";

const LastCustomer = ({ dateRange }) => {
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  // Fetch messages directly from the API when the component mounts
  useEffect(() => {
    const fetchMessagesDirectly = async () => {
      try {
        setLoadingMessages(true);
        const { startDate, endDate } = dateRange;
        const start = startDate ? new Date(startDate).toISOString() : null;
        const end = endDate ? new Date(endDate).toISOString() : null;
        const query = new URLSearchParams();
        if (start) query.append("startDate", start);
        if (end) query.append("endDate", end);

        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_DOMAIN_NAME
          }/api/contact/messages?${query.toString()}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }

        const data = await response.json();
        if (Array.isArray(data.data)) {
          setMessages(data.data);
        } else {
          setMessages(0);
        }
        setMessageError(null); // Clear any previous error
      } catch (error) {
        setMessageError(error.message);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessagesDirectly();
  }, [dateRange]);

  return (
    <Box sx={{ display: "grid", gridTemplateRows: "repeat(4, 1fr)" }}>
      <Typography sx={{ mx: 2, mt: 2 }} variant="h6">
        Customer Support
      </Typography>
      <Box sx={{ gridRow: "2/5" }}>
        {Array.isArray(messages) ? (
          <Box>
            <MiniMessageTable dateRange={dateRange} />
          </Box>
        ) : (
          <ChatIcon sx={{ fontSize: "60px", color: "gray", opacity: 0.3 }} />
        )}
      </Box>
    </Box>
  );
};

export default LastCustomer;
