import { useAppSelector } from "../../store/hook";
import { Card, CardContent } from "../../components/ui/card";
import { useMemo, useState } from "react";
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
    // const lowStockProducts = products.filter((p) => p.stock < 20);
  const totalProducts = items.length;
  const [page, setPage] = useState(0);
  const itemsPerPage = 10;

  // تقسيم المنتجات حسب الصفحة
  const paginatedProducts = products.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  const totalPages = Math.ceil(products.length / itemsPerPage);
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
    <div className="p-8 min-h-screen bg-gradient-to-br from-green-50 to-white">
      <h1 className="text-4xl font-extrabold text-green-700 mb-8 text-center drop-shadow-md">
        Products Statistics
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Products */}
        <Card className="p-6 shadow-xl rounded-3xl bg-white border-l-8 border-green-500 hover:shadow-2xl transition-shadow">
          <CardContent className="text-center">
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">
              Total Products
            </h2>
            <p className="text-3xl md:text-4xl font-bold text-gray-900">
              {totalProducts}
            </p>
          </CardContent>
        </Card>

        {/* Total Stock */}
        <Card className="p-6 shadow-xl rounded-3xl bg-white border-l-8 border-yellow-500 hover:shadow-2xl transition-shadow">
          <CardContent className="text-center">
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">
              Total Stock
            </h2>
            <p className="text-3xl md:text-4xl font-bold text-gray-900">
              {totalStock}
            </p>
          </CardContent>
        </Card>

        {/* Price of the Goods */}
        <Card className="p-6 shadow-xl rounded-3xl bg-white border-l-8 border-blue-500 hover:shadow-2xl transition-shadow">
          <CardContent className="text-center">
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">
              Price of the Goods
            </h2>
            <p className="text-3xl md:text-4xl font-bold text-gray-900">
              ${avgPrice.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <Card className="p-6 shadow-2xl rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 flex flex-col">
          <CardContent className="flex-1 flex flex-col">
            <h2 className="text-xl font-bold text-blue-900 mb-6">
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
                    tick={{ fontSize: 14, fill: "#1e3a8a" }}
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

        <Card className="p-6 shadow-2xl rounded-3xl bg-gradient-to-br from-red-50 to-red-100 border border-red-200 flex flex-col">
          <CardContent className="flex-1 flex flex-col">
            <h2 className="text-xl font-bold text-red-700 mb-6 flex justify-between">
              <span>Products Low in Stock</span>
              <span>{`Stock < 20`}</span>
            </h2>

            <div className="flex-1">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={paginatedProductsSec}
                  margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                >
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 14, fill: "#b91c1c" }}
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
                onClick={() => setPageSec((prev) => Math.max(prev - 1, 0))}
                disabled={pageSec === 0}
              >
                Prev
              </button>
              <span className="px-3 py-1 text-red-700 font-semibold">
                {pageSec + 1} / {totalPagesSec}
              </span>
              <button
                className="px-3 py-1 bg-red-200 text-red-700 rounded disabled:opacity-50"
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

      <Card className="p-6 mt-10 shadow-2xl rounded-3xl bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200">
        <CardContent>
          <h2 className="text-xl font-bold text-yellow-800 mb-6">
            Products Stock
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={paginatedProducts}
              margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
            >
              <XAxis
                dataKey="name"
                tick={{ fontSize: 14, fill: "#b45309" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 14, fill: "#b45309" }}
                axisLine={{ stroke: "#f59e0b" }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#fef3c7", borderRadius: 10 }}
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
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              disabled={page === 0}
            >
              Prev
            </button>
            <span className="px-3 py-1 text-yellow-800 font-semibold">
              {page + 1} / {totalPages}
            </span>
            <button
              className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded disabled:opacity-50"
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
  );
}
