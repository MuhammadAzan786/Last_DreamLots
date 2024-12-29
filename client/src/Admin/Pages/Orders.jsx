import React, { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import dayjs from "dayjs";
import DateRangePicker from "../components/DateRangePicker";
import OrdersTable from "../components/OrdersTable";
import { fetchOrder } from "../../redux/Slices/ordrSlice";
import { useDispatch } from "react-redux";

const Orders = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOrder(dateRange));
  }, [dispatch]);

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
            Orders
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <DateRangePicker onChange={handleDateChange} />
        </Grid>
        <Grid item xs={12} sx={{ marginTop: "10px" }}>
          <OrdersTable dateRange={dateRange} />
        </Grid>
      </Grid>
    </>
  );
};

export default Orders;
