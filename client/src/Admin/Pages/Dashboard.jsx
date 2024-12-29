import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom"; // Import Link
import CustomLineChart from "../components/Grahp";
import DonutChart from "../components/DonutChart";
import LastCustomer from "../components/LastCustomer";
import StackOrderInsideOutChart from "../components/RevnueChart";
import CustomBarChart from "../components/OrderChart";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrder } from "../../redux/Slices/ordrSlice";
import { fetchMessages } from "../../redux/Slices/messageSlice";
import { fetchCategories } from "../../redux/Slices/categoriesSlice";
import { fetchProducts } from "../../redux/Slices/productsSlice"; // Import fetchProducts
import MessageIcon from "@mui/icons-material/Message";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import AppsIcon from "@mui/icons-material/Apps";
import CategoryIcon from "@mui/icons-material/Category";

const Dashboard = () => {
  const dispatch = useDispatch();

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("xs"));
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  const [totalMessages, setTotalMessages] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderError, setOrderError] = useState(null);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0); // State for total products
  const [dateRange, setDateRange] = useState({
    startDate: Date.now(),
    endDate: Date.now(),
  });
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messageError, setMessageError] = useState(null);

  // Fetch data when the dashboard is mounted
  useEffect(() => {
    dispatch(fetchOrder(dateRange));

    dispatch(fetchCategories());
    dispatch(fetchProducts()); // Fetch products
  }, [dispatch]);

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
          setTotalMessages(data.data.length);
        } else {
          setTotalMessages(0);
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

  // Fetch orders directly from the API when the component mounts
  useEffect(() => {
    const fetchOrdersDirectly = async () => {
      try {
        setLoadingOrders(true);
        const { startDate, endDate } = dateRange;
        const start = startDate ? new Date(startDate).toISOString() : null;
        const end = endDate ? new Date(endDate).toISOString() : null;
        const query = new URLSearchParams();
        if (start) query.append("startDate", start);
        if (end) query.append("endDate", end);

        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_DOMAIN_NAME
          }/api/order/getallorder?${query.toString()}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        if (Array.isArray(data.data)) {
          setTotalOrders(data.data.length);
        } else {
          setTotalOrders(0);
        }
        setOrderError(null); // Clear any previous error
      } catch (error) {
        setOrderError(error.message);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrdersDirectly();
  }, [dateRange]);

  // Calculate total categories
  const categoriesData = useSelector((state) => state.categories.data);
  useEffect(() => {
    if (categoriesData && Array.isArray(categoriesData)) {
      setTotalCategories(categoriesData.length);
    }
  }, [categoriesData]);

  // Calculate total products
  const productsData = useSelector((state) => state.products.data);
  useEffect(() => {
    if (productsData && Array.isArray(productsData.products)) {
      setTotalProducts(productsData.products.length); // Count the total products
    }
  }, [productsData]);

  const handleDateChange = (newValue) => {
    setDateRange(newValue);
  };

  return (
    <>
      {/* Total Messages and Stats */}
      <Box
        sx={{
          display: "grid",
          gridTemplateRows: "repeat(3, 1fr)",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 2,
          height: "120px",
          marginBottom: "20px",
          "@media (max-width:600px)": {
            gridTemplateColumns: "repeat(2, 1fr)", // Responsive layout
            height: "auto",
          },
        }}
      >
        <Box
          sx={{
            gridColumn: "1 / 4",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 2,
          }}
        >
          {[
            {
              title: "Total Categories",
              value: totalCategories,
              icon: <CategoryIcon sx={{ fontSize: 40 }} />,
              link: "/admin/categories",
            },
            {
              title: "Total Products",
              value: totalProducts,
              icon: <AppsIcon sx={{ fontSize: 40 }} />,
              link: "/admin/allproduct",
            },
            {
              title: "Total Orders",
              value: totalOrders,
              icon: <LocalGroceryStoreIcon sx={{ fontSize: 40 }} />,
              link: "/admin/orders",
            },
            {
              title: "Total Messages",
              value: totalMessages,
              icon: <MessageIcon sx={{ fontSize: 40 }} />,
              link: "/admin/messages",
            },
          ].map(({ title, value, icon, link }) => (
            <Link to={link} key={title} style={{ textDecoration: "none" }}>
              <Box
                sx={{
                  backgroundColor: "white",
                  boxShadow: 2,
                  borderRadius: "8px",
                  height: "100px",
                  transition: "0.3s",
                  "&:hover": {
                    boxShadow: 4, // Hover effect
                    transform: "scale(1.02)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start", // Align items to start
                    height: "100%",
                    width: "100%",
                    paddingLeft: "20px",
                  }}
                >
                  <IconButton
                    sx={{
                      height: "50px", // Adjust height
                      width: "50px", // Adjust width
                      borderRadius: "6px",
                      marginRight: "20px",
                    }}
                    aria-label={title} // Accessibility feature
                  >
                    {icon}
                  </IconButton>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      display: "flex",
                      flexDirection: "column",
                      fontSize: "1rem", // Adjusted font size (small)
                    }}
                  >
                    {title}:
                    <span style={{ fontWeight: "normal", fontSize: "16px" }}>
                      {value}
                    </span>{" "}
                    {/* Slightly smaller value text */}
                  </Typography>
                </Box>
              </Box>
            </Link>
          ))}
        </Box>
      </Box>

      {/* Main Charts Section */}
      <Box
        sx={{
          display: "grid",
          gridTemplateRows: "repeat(3, 1fr)",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 2,
        }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            boxShadow: 3,
            borderRadius: "8px",
            gridColumn: isSm ? "1 / 4" : "1 / 3",
            gridRow: "1 / 20",
          }}
        >
          <Typography variant="h6" sx={{ m: 2 }}>
            Order Analysis
          </Typography>
          <CustomLineChart dateRange={dateRange} />
        </Box>
        <Box
          sx={{
            display: "grid",
            px: 2,
            gridTemplateColumns: "repeat(3, 1fr)",
            alignContent: "center",
            alignItems: "center",
            backgroundColor: "white",
            boxShadow: 3,
            borderRadius: "8px",
            gridColumn: "1 / 2",
            gridRow: isSm ? "24 / 30" : "21 / 27",
          }}
        >
          <StackOrderInsideOutChart dateRange={dateRange} />
        </Box>
        <Box
          sx={{
            display: "grid",
            px: 2,
            gridTemplateColumns: "repeat(3, 1fr)",
            alignContent: "center",
            alignItems: "center",
            backgroundColor: "white",
            boxShadow: 3,
            borderRadius: "8px",
            gridColumn: "2 / 3",
            gridRow: isSm ? "24 / 30" : "21 / 27",
          }}
        >
          <CustomBarChart dateRange={dateRange} />
        </Box>
        <Box
          sx={{
            backgroundColor: "white",
            boxShadow: 3,
            borderRadius: "8px",
            gridColumn: isSm ? "1 / 2" : "3 / 4",
            gridRow: isSm ? "21 / 23" : "1 / 12",
          }}
        >
          <DonutChart dateRange={dateRange} />
        </Box>
        <Box
          sx={{
            backgroundColor: "white",
            boxShadow: 3,
            borderRadius: "8px",
            gridColumn: isSm ? "2 / 3" : "3 / 4",
            gridRow: isSm ? "21 / 23" : "13 / 27",
          }}
        >
          <LastCustomer dateRange={dateRange} />
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;
