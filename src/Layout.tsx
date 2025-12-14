import { Suspense, lazy, useEffect, useRef } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
// import { useAppDispatch, useAppSelector } from "./store/hook";
// import { RootState } from "./store";
// import { productUser } from "./store/productSlice";
import ScrollToTop from "./ScrollToTop";
import { Toaster } from "./components/ui/toaster";
import Header from "./component/Header";
// import { GetWishlist } from "./store/GetwishlistSlice";
// import { GetToCart } from "./store/cartSlice";
import Stats from "./component/admin/AdminDashboard";
import AdminLayout from "./component/admin/AdminLayout";
import AddProduct from "./component/admin/EditProductPage";
import Dashborad from "./component/admin/AdminDashboard";
import AdminDashboard from "./component/admin/AdminDashboard";
import EditProductPage from "./component/admin/EditProductPage";
import DashboardStats from "./component/admin/DashboardStats";
import PaymentSuccess from "./component/PaymentSuccess";
import PaymentCancel from "./component/PaymentCancel";
import { useGetProductsQuery } from "./store/UpdataProductSlice";
import AdminOrder from "./component/admin/AdminOrder";
import AdminReviews from "./component/admin/AdminReviews";
import { useGetRoleQuery } from "./store/authSlice";
// import Admin from "./component/Admin ";

// ✅ Lazy load components
// const Header = lazy(() => import("./component/Header"));
const Footer = lazy(() => import("./component/Footer"));
const Home = lazy(() => import("./component/Home"));
const Login = lazy(() => import("./component/Login"));
const Signup = lazy(() => import("./component/Signup"));
const Wishlist = lazy(() => import("./component/Wishlist"));
const Shop = lazy(() => import("./component/Shop"));
const Cart = lazy(() => import("./component/Cart"));
const Product = lazy(() => import("./component/Product"));
const Categories = lazy(() => import("./component/Categories"));
const Checkoutcart = lazy(() => import("./component/Checkoutcart"));
const SingleProduct = lazy(() => import("./component/SingleProduct"));
const Ordercomplete = lazy(() => import("./component/Ordercomplete"));
// const PaymentSuccess = lazy(() => import("./component/PaymentSuccess"));
// const PaymentCancel = lazy(() => import("./component/PaymentCancel"));
const Admin = lazy(() => import("./component/admin/AdminLayout"));
// ✅ Loader component
const Loader = () => (
  <div className="w-full h-[60vh] flex justify-center items-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#01e281] border-solid"></div>
  </div>
);

// type TProduct = {
//   id: number;
//   name: string;
//   description: string;
//   original_price: string;
//   final_price: string;
//   discount: number;
//   stock: number;
//   categories: string[];
//   tags: string[];
//   img: string;
//   average_rating: number;
//   img_url: string;
// };
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading } = useGetRoleQuery();
  if (isLoading) {
    return <Loader />;
  }
  if (!data?.is_admin) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};
function Layout() {
  const location = useLocation();
  const hideLayout = [
    "/login",
    "/signup",
    "/admin",
    "/admin/stats",
    "/admin/add",
    "/admin/orders",
    "/admin/reviews",
  ].includes(location.pathname);
  const { data: products = [], isLoading, refetch } = useGetProductsQuery();

  const fetchedRef = useRef(false);
  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
    }
  }, []);

  const categoryName = decodeURIComponent(
    location.pathname.split("/").pop() || ""
  ).toLowerCase();

  const mergedFiltered = products.filter(
    (item) =>
      item.categories.some((cat) => cat.toLowerCase() === categoryName) ||
      item.tags.some((tag) => tag.toLowerCase() === categoryName)
  );

  return (
    <Suspense fallback={<Loader />}>
      {!hideLayout && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/ordercomplete" element={<Ordercomplete />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />
        <Route
          path="/category/:name"
          element={
            <Categories products={mergedFiltered} title={categoryName} />
          }
        />
        <Route path="/checkout" element={<Checkoutcart />} />
        <Route path="/singleproduct/:id" element={<SingleProduct />} />
        {/* <Route path="/admin" element={<Admin />} /> */}
          <Route path="/admin" element={<ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute>}>
            <Route index element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} /> {/* /admin */}
            <Route path="stats" element={<ProtectedAdminRoute><DashboardStats /></ProtectedAdminRoute>} />
            <Route path="add" element={<ProtectedAdminRoute><EditProductPage /></ProtectedAdminRoute>} />
            <Route path="orders" element={<ProtectedAdminRoute><AdminOrder /></ProtectedAdminRoute>} />
            <Route path="reviews" element={<ProtectedAdminRoute><AdminReviews /></ProtectedAdminRoute>} />
          </Route>
        
      </Routes>
      {!hideLayout && <Footer />}
      <ScrollToTop />
      <Toaster />
    </Suspense>
  );
}

export default Layout;
