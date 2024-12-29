import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrder } from "../../redux/Slices/ordrSlice";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";

const columns = [
    { field: "id", headerName: "#", width: 50 },
    { field: "username", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 200, renderCell: renderEllipsisCell },
    { field: "phoneNo", headerName: "Phone", width: 150, renderCell: renderEllipsisCell },
    { field: "shipped", headerName: "Order Delivered", width: 150 },
    { field: "processing", headerName: "Order Processing", width: 150 },
    { field: "unshipped", headerName: "Orders Canceled", width: 150 },
    { field: "totalOrders", headerName: "Total Orders", width: 150 },
];

function renderEllipsisCell(params) {
    return (
        <Box
            sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
            }}
        >
            {params.value}
        </Box>
    );
}

const CustomerTable = ({ dateRange }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);

    const { data: orderData, isLoading: orderLoading, isError: orderError } = useSelector((state) => state.orders);

    useEffect(() => {
        if (orderData) {
            setOrders(orderData.data);
        }
    }, [orderData]);

    useEffect(() => {
        dispatch(fetchOrder(dateRange));
    }, [dispatch, dateRange]);

    if (orderLoading) {
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
    }

    if (orderError) return <div>Error fetching data</div>;


    const userOrdersMap = orders.reduce((acc, order) => {
        const userId = order.shippingInfo.user;
        if (!acc[userId]) {
            acc[userId] = {
                username: order.shippingInfo.username,
                email: order.shippingInfo.email,
                phoneNo: order.shippingInfo.phoneNo,
                shipped: 0,
                processing: 0,
                unshipped: 0,
                totalOrders: 0,
            };
        }
        acc[userId][order.orderStatus.toLowerCase()] += 1;
        acc[userId].totalOrders += 1;
        return acc;
    }, {});

    const rows = Object.keys(userOrdersMap).map((userId, index) => ({
        id: index + 1,
        ...userOrdersMap[userId],
    }));

    return (
        <Box sx={{ height: "74vh", width: "100%" }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={8}
                getRowId={(row) => row.id}
                rowsPerPageOptions={[8]}
                // onRowClick={handleRowClick}
                disableRowSelectionOnClick
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

export default CustomerTable;
