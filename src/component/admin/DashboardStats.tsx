// import { useAppDispatch, useAppSelector } from "../../store/hook";
import { Card, CardContent } from "../../components/ui/card";
import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  CartesianGrid,
} from "recharts";
import { RootState } from "../../store";
// import { GetTotalstockSlice } from "../../store/TotalstockSlice";
// import { GetTopSelling } from "../../store/TopSellingSlice";
import { useGetProductsQuery } from "../../store/UpdataProductSlice";
import { useGetTopSellingQuery } from "../../store/SalesOrdersSlice";
import { motion } from "framer-motion";

interface IItem {
  id: number;
  name: string;
  description: string;
  original_price: number;
  final_price: number;
  discount: number;
  stock: number;
}

// =======================
// MOCK DATA TEMPORARY
// =======================

const items: IItem[] = [
  {
    id: 1,
    name: "Product A",
    description: "High quality item A",
    original_price: 200,
    final_price: 150,
    discount: 25,
    stock: 30,
  },
  {
    id: 2,
    name: "Product B",
    description: "High quality item B",
    original_price: 300,
    final_price: 240,
    discount: 20,
    stock: 12,
  },
  {
    id: 3,
    name: "Product C",
    description: "High quality item C",
    original_price: 150,
    final_price: 120,
    discount: 20,
    stock: 50,
  },
  {
    id: 4,
    name: "Product D",
    description: "High quality item D",
    original_price: 500,
    final_price: 400,
    discount: 20,
    stock: 8,
  },
  {
    id: 5,
    name: "Product E",
    description: "High quality item E",
    original_price: 100,
    final_price: 80,
    discount: 20,
    stock: 100,
  },
];

export default function DashboardStats() {
  // const dispatch = useAppDispatch();
  // const { products, loading, error } = useAppSelector(
  //   (state: RootState) => state.product
  // );
  // const { products  } = useAppSelector(
  //   (state: RootState) => state.product
  // );
  const { data: products = [], isLoading, refetch } = useGetProductsQuery();
  const { data: items = [], isLoading: l5 } = useGetTopSellingQuery();
  // const { items } = useAppSelector((state: RootState) => state.TopSelling);
  console.log(items);

  const [tickFontSize, setTickFontSize] = useState(14);

  useEffect(() => {
    // dispatch(GetTopSelling());
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setTickFontSize(10); // شاشة صغيرة
      } else if (window.innerWidth < 1024) {
        setTickFontSize(12); // شاشة متوسطة
      } else {
        setTickFontSize(14); // شاشة كبيرة
      }
    };

    handleResize(); // initial
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const lowStockProducts = products.filter((p) => p.stock < 20);
  const totalProducts = products.length;
  const [page, setPage] = useState(0);
  const itemsPerPage = 4;

  // تقسيم المنتجات حسب الصفحة
  const paginatedProducts = lowStockProducts.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  const totalPages = Math.ceil(lowStockProducts.length / itemsPerPage);
  const totalStock = useMemo(
    () => products.reduce((acc, item) => acc + item.stock, 0),
    []
  );

  const [pageSec, setPageSec] = useState(0);
  const itemsPerPageSec = 5;

  const paginatedProductsSec = products.slice(
    pageSec * itemsPerPageSec,
    (pageSec + 1) * itemsPerPageSec
  );

  const totalPagesSec = Math.ceil(products.length / itemsPerPage);

  const avgPrice = useMemo(() => {
    return (
      products.reduce((acc, item) => acc + Number(item.final_price), 0) /
      products.length
    );
  }, []);

  // const discountData = useMemo(() => {
  //   const map: Record<number, number> = {};
  //   items.forEach((item) => {
  //     map[item.discount] = (map[item.discount] || 0) + 1;
  //   });
  //   return Object.keys(map).map((key) => ({
  //     discount: key,
  //     count: map[Number(key)],
  //   }));
  // }, []);
  const topSelling = [
    { name: "T-Shirt", sales: 120 },
    { name: "Sneakers", sales: 90 },
    { name: "Backpack", sales: 70 },
  ];
  return (
    <div className="min-h-screen">
      {/* ======= HEADER ======= */}
      <motion.div
        className="mb-10 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-emerald-700 via-teal-600 to-green-700 bg-clip-text text-transparent mb-3">
          Products Statistics
        </h1>
        <p className="text-gray-600 text-lg">
          Comprehensive overview of your inventory
        </p>
        <div className="mt-4 mx-auto w-32 h-1.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-green-600 rounded-full shadow-lg"></div>
      </motion.div>

      {/* ======= STATS CARDS ======= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          {
            title: "Total Products",
            value: totalProducts,
            icon: "📦",
            gradient: "from-emerald-500 to-teal-600",
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-700",
          },
          {
            title: "Total Stock",
            value: totalStock,
            icon: "📊",
            gradient: "from-orange-500 to-yellow-600",
            iconBg: "bg-orange-100",
            iconColor: "text-orange-700",
          },
          {
            title: "Price of the Goods",
            value: `$${Number(avgPrice).toFixed(2) || 0}`,
            icon: "💰",
            gradient: "from-blue-500 to-indigo-600",
            iconBg: "bg-blue-100",
            iconColor: "text-blue-700",
          },
        ].map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.03, y: -4 }}
          >
            <Card
              className={`p-6 rounded-3xl bg-gradient-to-br ${card.gradient} shadow-xl hover:shadow-2xl transition-all border-0 overflow-hidden relative`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

              <CardContent className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-14 h-14 ${card.iconBg} rounded-2xl flex items-center justify-center shadow-lg`}
                  >
                    <span className="text-3xl">{card.icon}</span>
                  </div>
                </div>

                <h2 className="text-white/90 text-lg font-bold mb-2 tracking-wide">
                  {card.title}
                </h2>
                <p className="text-4xl md:text-5xl font-black text-white">
                  {card.value}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ======= CHARTS SECTION ======= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Top Selling Products */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="rounded-3xl shadow-2xl backdrop-blur-xl bg-white/90 border-2 border-blue-200 overflow-hidden h-full">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                <span className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  🏆
                </span>
                Top Selling Products
              </h2>
            </div>

            <CardContent className="p-8">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={items}
                  margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                >
                  <defs>
                    <linearGradient
                      id="blueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                      <stop
                        offset="100%"
                        stopColor="#1e40af"
                        stopOpacity={0.7}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{
                      fontSize: tickFontSize,
                      fill: "#1e40af",
                      fontWeight: 600,
                    }}
                    tickLine={false}
                    axisLine={{ stroke: "#3b82f6", strokeWidth: 2 }}
                  />
                  <YAxis
                    tick={{ fontSize: 14, fill: "#1e40af", fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "2px solid #3b82f6",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                    itemStyle={{ color: "#1e40af", fontWeight: "bold" }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ paddingBottom: "10px" }}
                  />
                  <Bar
                    dataKey="sales"
                    fill="url(#blueGradient)"
                    radius={[10, 10, 0, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Low Stock Products */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="rounded-3xl shadow-2xl backdrop-blur-xl bg-white/90 border-2 border-red-200 overflow-hidden h-full">
            <div className="bg-gradient-to-r from-red-600 to-pink-600 p-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center justify-between">
                <span className="flex items-center gap-3">
                  <span className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    ⚠️
                  </span>
                  Low Stock Alert
                </span>
                <span className="text-lg bg-white/20 px-3 py-1 rounded-full">
                  Stock &lt; 20
                </span>
              </h2>
            </div>

            <CardContent className="p-8">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={paginatedProducts}
                  margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                >
                  <defs>
                    <linearGradient
                      id="redGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9} />
                      <stop
                        offset="100%"
                        stopColor="#b91c1c"
                        stopOpacity={0.7}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{
                      fontSize: tickFontSize,
                      fill: "#b91c1c",
                      fontWeight: 600,
                    }}
                    tickLine={false}
                    axisLine={{ stroke: "#ef4444", strokeWidth: 2 }}
                    interval={0}
                  />
                  <YAxis
                    tick={{ fontSize: 14, fill: "#b91c1c", fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "2px solid #ef4444",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                    itemStyle={{ color: "#991b1b", fontWeight: "bold" }}
                  />
                  <Bar
                    dataKey="stock"
                    fill="url(#redGradient)"
                    radius={[10, 10, 0, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>

              {/* Pagination */}
              <div className="flex justify-center items-center gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                  disabled={page === 0}
                >
                  ← Prev
                </motion.button>
                <span className="px-4 py-2 bg-red-100 text-red-700 rounded-xl font-bold border-2 border-red-300">
                  {page + 1} / {totalPages}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages - 1))
                  }
                  disabled={page === totalPages - 1}
                >
                  Next →
                </motion.button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ======= PRODUCTS STOCK CHART ======= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Card className="rounded-3xl shadow-2xl backdrop-blur-xl bg-white/90 border-2 border-yellow-200 overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <span className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                📈
              </span>
              Products Stock Overview
            </h2>
          </div>

          <CardContent className="p-8">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={paginatedProductsSec}
                margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
              >
                <defs>
                  <linearGradient
                    id="yellowGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#d97706" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{
                    fontSize: tickFontSize,
                    fill: "#92400e",
                    fontWeight: 600,
                  }}
                  tickLine={false}
                  axisLine={{ stroke: "#f59e0b", strokeWidth: 2 }}
                />
                <YAxis
                  tick={{ fontSize: 14, fill: "#92400e", fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "2px solid #f59e0b",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                  itemStyle={{ color: "#92400e", fontWeight: "bold" }}
                />
                <Bar
                  dataKey="stock"
                  fill="url(#yellowGradient)"
                  radius={[10, 10, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                onClick={() => setPageSec((prev) => Math.max(prev - 1, 0))}
                disabled={pageSec === 0}
              >
                ← Prev
              </motion.button>
              <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-xl font-bold border-2 border-yellow-300">
                {pageSec + 1} / {totalPagesSec}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                onClick={() =>
                  setPageSec((prev) => Math.min(prev + 1, totalPagesSec - 1))
                }
                disabled={pageSec === totalPagesSec - 1}
              >
                Next →
              </motion.button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
