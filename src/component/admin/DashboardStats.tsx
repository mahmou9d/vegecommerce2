import { useAppSelector } from "../../store/hook";
import { Card, CardContent } from "../../components/ui/card";
import { useMemo } from "react";
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
    const lowStockProducts = products.filter((p) => p.stock < 20);
  const totalProducts = items.length;

  const totalStock = useMemo(
    () => items.reduce((acc, item) => acc + item.stock, 0),
    []
  );

  const avgPrice = useMemo(() => {
    return (
      items.reduce((acc, item) => acc + Number(item.final_price), 0) /
      items.length
    );
  }, []);

  const discountData = useMemo(() => {
    const map: Record<number, number> = {};
    items.forEach((item) => {
      map[item.discount] = (map[item.discount] || 0) + 1;
    });
    return Object.keys(map).map((key) => ({
      discount: key,
      count: map[Number(key)],
    }));
  }, []);
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
        <Card className="p-6 shadow-xl rounded-2xl">
          <CardContent className="text-center">
            <h2 className="text-lg font-semibold text-green-800">
              Total Products
            </h2>
            <p className="text-3xl font-bold">{totalProducts}</p>
          </CardContent>
        </Card>

        <Card className="p-6 shadow-xl rounded-2xl">
          <CardContent className="text-center">
            <h2 className="text-lg font-semibold text-green-800">
              Total Stock
            </h2>
            <p className="text-3xl font-bold">{totalStock}</p>
          </CardContent>
        </Card>

        <Card className="p-6 shadow-xl rounded-2xl">
          <CardContent className="text-center">
            <h2 className="text-lg font-semibold text-green-800">
              Average Price
            </h2>
            <p className="text-3xl font-bold">${avgPrice.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 shadow-2xl rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <CardContent>
            <h2 className="text-xl font-bold text-blue-900 mb-6">
              Top Selling Products
            </h2>
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
                  radius={[10, 10, 0, 0]} // rounded top corners
                  barSize={30}
                  onMouseEnter={(data) => console.log("Hovered:", data)}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="p-6 shadow-2xl rounded-3xl bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
          <CardContent>
            <h2 className="text-xl font-bold text-red-700 mb-6">
              Products Low in Stock
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={lowStockProducts}
                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 14, fill: "#b91c1c" }}
                  tickLine={false}
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
                  radius={[10, 10, 0, 0]} // rounded top corners
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Price Trend */}
      <Card className="p-6 shadow-xl rounded-2xl mt-6">
        <CardContent>
          <h2 className="text-lg font-semibold text-green-800 mb-4">
            Price Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={items}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="final_price" stroke="#22c55e" />
              <Line type="monotone" dataKey="original_price" stroke="#f87171" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
