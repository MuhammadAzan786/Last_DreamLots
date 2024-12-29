import React, { useEffect, useState } from "react";
import { fetchOrder } from "../../redux/Slices/ordrSlice";

import { useDispatch, useSelector } from "react-redux";
import CustomerTable from "./customerTable";
import { Grid, Typography } from "@mui/material";
import DateRangePicker from "../components/DateRangePicker";

const Customers = () => {
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
    
    const handleDateChange = (newValue) => {
        setDateRange(newValue);
    } 


  
  return <>
  <Grid container spacing={2}>
    <Grid item xs={12} md={6}>
      <Typography
        variant="h5"
        sx={{ fontWeight: "600", color: "#808080", display: "inline" }}
      >
        Customers
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
      <CustomerTable dateRange={dateRange} />
    </Grid>
  </Grid>
</>
};

export default Customers;
