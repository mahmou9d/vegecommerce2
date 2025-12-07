import { useAppSelector } from "../../store/hook";
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
} from "recharts";
import { RootState } from "@/store";

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
    const { products, loading, error } = useAppSelector(
      (state: RootState) => state.product
    );
    const [tickFontSize, setTickFontSize] = useState(14);

    useEffect(() => {
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
  const totalProducts = items.length;
  const [page, setPage] = useState(0);
  const itemsPerPage = 4;

  // تقسيم المنتجات حسب الصفحة
  const paginatedProducts = lowStockProducts.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  const totalPages = Math.ceil(lowStockProducts.length / itemsPerPage);
  const totalStock = useMemo(
    () => items.reduce((acc, item) => acc + item.stock, 0),
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
      items.reduce((acc, item) => acc + Number(item.final_price), 0) /
      items.length
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
      <div className="mb-8">
        <h1
          className="
    text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight 
    text-gray-900
  "
        >
          Products Statistics
        </h1>
        {/* Underline Accent */}
        <div className="mt-3 w-24 h-1.5 bg-gradient-to-r from-blue-700 to-green-700 rounded-full"></div>
      </div>
      {/* <h1 className="text-4xl font-extrabold text-green-700 mb-8 text-center drop-shadow-md">
        Products Statistics
      </h1> */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          {
            title: "Total Products",
            value: totalProducts,
            icon: "📦",
            gradient: "from-green-400 to-green-600",
          },
          {
            title: "Total Stock",
            value: totalStock,
            icon: "📊",
            gradient: "from-yellow-400 to-yellow-600",
          },
          {
            title: "Price of the Goods",
            value: `$${avgPrice.toFixed(2)}`,
            icon: "💰",
            gradient: "from-blue-400 to-blue-600",
          },
        ].map((card, index) => (
          <Card
            key={index}
            className={`p-2 md:p-6 rounded-3xl bg-gradient-to-r ${card.gradient} text-white shadow-2xl hover:shadow-3xl transition-shadow duration-500`}
          >
            <CardContent className="text-center space-y-4">
              <h2 className="text-2xl font-semibold flex items-center justify-center space-x-2">
                <span>{card.icon}</span>
                <span>{card.title}</span>
              </h2>
              <p className="text-4xl md:text-5xl font-extrabold">
                {card.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <Card className="p-2 md:p-6 shadow-2xl rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 flex flex-col">
          <CardContent className="flex-1 flex flex-col">
            <h2 className="text-xl font-bold text-blue-900">
              Top Selling Products
            </h2>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={topSelling}
                  margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                >
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: tickFontSize, fill: "#1e3a8a" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 14, fill: "#1e3a8a" }}
                    axisLine={{ stroke: "#3b82f6" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#f0f9ff",
                      borderRadius: 10,
                    }}
                    itemStyle={{ color: "#1e40af", fontWeight: "bold" }}
                  />
                  <Legend
                    verticalAlign="top"
                    wrapperStyle={{ paddingBottom: 10 }}
                  />
                  <Bar
                    dataKey="sales"
                    fill="#3b82f6"
                    radius={[10, 10, 0, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="p-2 md:p-6 shadow-2xl rounded-3xl bg-gradient-to-br from-red-50 to-red-100 border border-red-200 flex flex-col">
          <CardContent className="flex-1 flex flex-col">
            <h2 className="text-xl font-bold text-red-700 flex justify-between">
              <span>Products Low in Stock</span>
              <span>{`Stock < 20`}</span>
            </h2>

            <div className="flex-1">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={paginatedProducts}
                  margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                >
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: tickFontSize, fill: "#b91c1c" }}
                    tickLine={false}
                    interval={0}
                  />
                  <YAxis
                    tick={{ fontSize: 14, fill: "#b91c1c" }}
                    axisLine={{ stroke: "#ef4444" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fee2e2",
                      borderRadius: 10,
                    }}
                    itemStyle={{ color: "#991b1b", fontWeight: "bold" }}
                  />
                  <Bar
                    dataKey="stock"
                    fill="#ef4444"
                    radius={[10, 10, 0, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pagination Buttons */}
            <div className="flex justify-center mt-4 space-x-2">
              <button
                className="px-3 py-1 bg-red-200 text-red-700 rounded disabled:opacity-50"
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                disabled={page === 0}
              >
                Prev
              </button>
              <span className="px-3 py-1 text-red-700 font-semibold">
                {page + 1} / {totalPages}
              </span>
              <button
                className="px-3 py-1 bg-red-200 text-red-700 rounded disabled:opacity-50"
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages - 1))
                }
                disabled={page === totalPages - 1}
              >
                Next
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="p-2 md:p-6 mt-10 shadow-2xl rounded-3xl bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200">
        <CardContent>
          <h2 className="text-xl font-bold text-yellow-800">Products Stock</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={paginatedProductsSec}
              margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
            >
              <XAxis
                dataKey="name"
                tick={{ fontSize: tickFontSize, fill: "#b45309" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 14, fill: "#b45309" }}
                axisLine={{ stroke: "#f59e0b" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fef3c7", // لون الخلفية اللي انت عايزه
                  border: "none", // الغي البوردر الأسود
                  boxShadow: "none", // الغي أي ظل
                  borderRadius: 10, // الزوايا مدورة لو تحب
                }}
                itemStyle={{ color: "#92400e", fontWeight: "bold" }}
              />
              <Bar
                dataKey="stock"
                fill="#f59e0b"
                radius={[10, 10, 0, 0]}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>

          {/* Pagination Buttons */}
          <div className="flex justify-center mt-4 space-x-2">
            <button
              className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded disabled:opacity-50"
              onClick={() => setPageSec((prev) => Math.max(prev - 1, 0))}
              disabled={pageSec === 0}
            >
              Prev
            </button>
            <span className="px-3 py-1 text-yellow-800 font-semibold">
              {pageSec + 1} / {totalPagesSec}
            </span>
            <button
              className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded disabled:opacity-50"
              onClick={() =>
                setPageSec((prev) => Math.min(prev + 1, totalPagesSec - 1))
              }
              disabled={pageSec === totalPagesSec - 1}
            >
              Next
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
