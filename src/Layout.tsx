import { Suspense, lazy, useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
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

type TProduct = {
  id: number;
  name: string;
  description: string;
  original_price: string;
  final_price: string;
  discount: number;
  stock: number;
  categories: string[];
  tags: string[];
  img: string;
  average_rating: number;
  img_url: string;
};

function Layout() {
  const location = useLocation();
  // const dispatch = useAppDispatch();
  // { name: "Products", icon: <Package size={20} />, path: "/admin/products" },
  const hideLayout = [
    "/login",
    "/signup",
    "/admin",
    "/admin/stats",
    "/admin/add",
    "/admin/orders",
    "/admin/reviews",
  ].includes(location.pathname);
  // const { products, loaded } = useAppSelector((state) => state.product);
  const { data: products = [], isLoading, refetch } = useGetProductsQuery();
  const fetchedRef = useRef(false);
  const { data } = useGetRoleQuery();
  
  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      // dispatch(productUser());
      // dispatch(GetWishlist());
      // dispatch(GetToCart());
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
        {data?.is_admin && (
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} /> {/* /admin */}
            <Route path="stats" element={<DashboardStats />} />
            <Route path="add" element={<EditProductPage />} />
            <Route path="orders" element={<AdminOrder />} />
            <Route path="reviews" element={<AdminReviews />} />
          </Route>
        )}
      </Routes>
      {!hideLayout && <Footer />}
      <ScrollToTop />
      <Toaster />
    </Suspense>
  );
}

export default Layout;
