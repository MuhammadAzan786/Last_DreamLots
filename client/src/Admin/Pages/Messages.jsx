import React, { useState } from "react";
import { Grid, Typography } from "@mui/material";
import dayjs from "dayjs";
import DateRangePicker from "../components/DateRangePicker";
import MessagesTable from "../components/MessagesTable";
const Messages = () => {
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  const handleDateChange = (newValue) => {
    setDateRange(newValue);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography
            variant="h5"
            sx={{ fontWeight: "600", color: "#808080", display: "inline" }}
          >
            Messages 
          </Typography>
          {/* <Typography
            variant="body2"
            sx={{
              color: "#4d4d4d",
              display: "inline",
              marginLeft: "5px",
              fontWeight: "500",
            }}
          >
            35 Messages today
          </Typography> */}
        </Grid>
        <Grid item xs={12} md={6}>
          <DateRangePicker onChange={handleDateChange} />
        </Grid>
        <Grid item xs={12} sx={{ marginTop: "10px" }}>
          <MessagesTable dateRange={dateRange} />
        </Grid>
      </Grid>
    </>
  );
};

export default Messages;
