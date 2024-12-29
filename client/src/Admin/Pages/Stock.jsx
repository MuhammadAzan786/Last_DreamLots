import React, { useState } from "react";
import { Grid, Typography } from "@mui/material";
import dayjs from "dayjs";
import DateRangePicker from "../components/DateRangePicker";
import StockTable from "../components/StockTable";

const Stock = () => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography
            variant="h5"
            sx={{ fontWeight: "600", color: "#808080", display: "inline" }}
          >
            Stock 
          </Typography>
         
        </Grid>
        <Grid item xs={12} sx={{ marginTop: "10px" }}>
          <StockTable />
        </Grid>
      </Grid>
    </>
  );
};

export default Stock;
