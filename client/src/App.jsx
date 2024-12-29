import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import SideNav from "./Admin/components/SideNav.jsx";
import ScrollToTop from "./customer/components/ScrolltoTop.jsx";
// Pages
import Dashboard from "./Admin/Pages/Dashboard.jsx";
import AllProducts from "./Admin/Pages/Products/AllProducts.jsx";
import AddProduct from "./Admin/Pages/Products/AddProduct.jsx";
import EditProduct from "./Admin/Pages/Products/EditProduct.jsx";
import CategoryPage from "./Admin/Pages/Category/CategoryPage.jsx";
import Orders from "./Admin/Pages/Orders.jsx";
import Customers from "./Admin/Pages/Customers.jsx";
import AddCategoryForm from "./Admin/Pages/Category/AddCategoryForm.jsx";
import Login from "./Admin/Pages/Login.jsx";
import NotFound from "./Admin/Pages/NotFound.jsx";
import ProductDetails from "./Admin/Pages/Products/ProductDetails.jsx";
import Editcategory from "./Admin/Pages/Category/Editcategory.jsx";
import CustomerProductDetail from "./customer/pages/ProductDetails.jsx";
import Layout from "./customer/components/Layout.jsx";
import Home from "./customer/pages/home.jsx";
import About from "./customer/pages/About.jsx";
import Contact from "./customer/pages/Contact.jsx";
import Products from "./customer/pages/Products.jsx";
import CartPage from "./customer/pages/cart.jsx";
import SignUp from "./Admin/Pages/SignUp.jsx";
import ForgotPassword from "./Admin/Pages/ForgotPassword.jsx";
import EmailVerificationPage from "./Admin/Pages/EmailVerificationPage.jsx";
import ResetpasswordEmailSentPage from "./Admin/Pages/ResetpasswordEmailSentPage.jsx";
import UpdatePasswordPage from "./Admin/Pages/UpdatePasswordPage.jsx";
import Stock from "./Admin/Pages/Stock.jsx";
import EditStock from "./Admin/Pages/EditStock.jsx";
import CheckoutPage from "./customer/pages/CheckoutPage.jsx";
import Messages from "./Admin/Pages/Messages.jsx";
import MessagePage from "./Admin/Pages/MessagePage.jsx";
import OrderDetailsPage from "./Admin/Pages/OrderDetailsPage.jsx";
import CategoriesPage from "./customer/pages/CategoriesPage.jsx";
import LoadingProcess from "./customer/pages/LoadingProcess.jsx";
import UniqueProducts from "./customer/pages/UniqueProducts.jsx";
import CustomerOrderHistoryPage from "./Admin/Pages/CustomerOrderHistoryPage.jsx";
import Invoice from "./customer/pages/invoice.jsx";
import TermsAndConditions from "./customer/pages/TermsConditions.jsx";
import VerificationEmailResend from "./Admin/Pages/VerificationEmailResend.jsx";
import AddBanner from "./Admin/Pages/addbanner.jsx";
import AddVirtualTourForm from "./Admin/Pages/virtualTours/AddVirtualTourForm.jsx";
import SellerAllVirtualTours from "./Admin/Pages/virtualTours/SellerAllVirtualTours.jsx";
import AddProperty from "./Admin/Pages/Property/AddPropert.jsx";

const VERIFY_API = `${
  import.meta.env.VITE_BACKEND_DOMAIN_NAME
}/api/authentication/verify-token`;

export default function App() {
  const user = useSelector((state) => state.Singleuser);

  return (
    <>
      <ScrollToTop /> {/* Add ScrollToTop here */}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgotPass" element={<ForgotPassword />} />
        <Route path="/emailverification" element={<EmailVerificationPage />} />
        <Route
          path="/verificationEmailResend"
          element={<VerificationEmailResend />}
        />
        <Route path="/reset-password/:token" element={<UpdatePasswordPage />} />
        <Route
          path="/resetpasswordrequest"
          element={<ResetpasswordEmailSentPage />}
        />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="uniqueproducts/:id" element={<UniqueProducts />} />
          <Route path="order-details/:id" element={<OrderDetailsPage />} />
          <Route path="products" element={<Products />} />
          <Route path="term" element={<TermsAndConditions />} />
          <Route
            path="products/product/:id"
            element={<CustomerProductDetail />}
          />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
        </Route>

        {/* Protected Routes (Based on role) */}
        {user.data?.role === "admin" ? (
          <>
            <Route path="/admin" element={<SideNav />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="allproduct" element={<AllProducts />} />
              <Route path="addproduct/" element={<AddProduct />} />
              <Route path="categories" element={<CategoryPage />} />
              <Route path="editproduct/:id" element={<EditProduct />} />
              <Route path="editcategory/:id" element={<Editcategory />} />
              <Route path="order-details/:id" element={<OrderDetailsPage />} />
              <Route path="invoice/:id" element={<Invoice />} />
              <Route path="edit-stock/:id" element={<EditStock />} />
              <Route path="message-page/:id" element={<MessagePage />} />
              <Route path="orders" element={<Orders />} />
              <Route path="stock" element={<Stock />} />
              <Route path="messages" element={<Messages />} />
              <Route path="customers" element={<Customers />} />
              <Route path="addbanner" element={<AddBanner />} />
              <Route path="addVirtualTour" element={<AddVirtualTourForm />} />
              <Route
                path="SellerAllVirtualTours"
                element={<SellerAllVirtualTours />}
              />
              <Route path="add-property" element={<AddProperty />} />
              
              <Route
                path="customerOrderHistoryPage/:id"
                element={<CustomerOrderHistoryPage />}
              />
              <Route path="addcategory" element={<AddCategoryForm />} />
              <Route path="productdetails/:id" element={<ProductDetails />} />
            </Route>

            {/* Catch-all for authenticated users (if needed) */}
            <Route path="*" element={<NotFound />} />
          </>
        ) : (
          // Public Route (Login)
          <Route path="*" element={<NotFound />} />
        )}
      </Routes>
    </>
  );
}
