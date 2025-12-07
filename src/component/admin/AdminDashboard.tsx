import { motion } from "framer-motion";
import { ShoppingCart, Package, Users, DollarSign } from "lucide-react";
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, LineChart, BarChart, Bar } from "recharts";

interface IData{
  month:string
  sales:number
  orders:number
}
export default function AdminDashboard() {
  const data: IData[] = [
    { month: "Jan", sales: 4000, orders: 2400 },
    { month: "Feb", sales: 3000, orders: 2210 },
    { month: "Mar", sales: 5000, orders: 2290 },
    { month: "Apr", sales: 4780, orders: 2000 },
    { month: "May", sales: 5890, orders: 2780 },
    { month: "Jun", sales: 4390, orders: 1890 },
  ];
  return (
    <div className="space-y-10">
      {/* ========== Header ========== */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Quick summary of store performance</p>
      </div>

      {/* ========== Stats Cards ========== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white shadow-md p-6 rounded-2xl border-l-4 border-green-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-gray-600 text-sm font-medium">Total Sales</h2>
              <p className="text-2xl font-bold mt-1">$12,450</p>
            </div>
            <DollarSign size={32} className="text-green-600" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white shadow-md p-6 rounded-2xl border-l-4 border-blue-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-gray-600 text-sm font-medium">Orders</h2>
              <p className="text-2xl font-bold mt-1">340</p>
            </div>
            <ShoppingCart size={32} className="text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white shadow-md p-6 rounded-2xl border-l-4 border-yellow-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-gray-600 text-sm font-medium">Products</h2>
              <p className="text-2xl font-bold mt-1">120</p>
            </div>
            <Package size={32} className="text-yellow-600" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white shadow-md p-6 rounded-2xl border-l-4 border-purple-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-gray-600 text-sm font-medium">Customers</h2>
              <p className="text-2xl font-bold mt-1">825</p>
            </div>
            <Users size={32} className="text-purple-600" />
          </div>
        </motion.div>
      </div>

      {/* ========== Charts Section (Placeholder) ========== */}
      <div className="bg-white p-8 rounded-3xl shadow-2xl h-96">
        <h2 className="text-xl font-bold text-gray-800 mb-5">
          Sales & Orders Chart
        </h2>

        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 14, fill: "#374151" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 14, fill: "#374151" }}
              axisLine={{ stroke: "#4F46E5" }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#f9fafb", borderRadius: 10 }}
              itemStyle={{ fontWeight: "bold", color: "#1f2937" }}
            />
            <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 10 }} />

            <Bar
              dataKey="sales"
              fill="#4F46E5"
              barSize={30}
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="orders"
              fill="#10B981"
              barSize={30}
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ========== Recent Orders Table ========== */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-3 text-gray-600">Order ID</th>
              <th className="py-3 text-gray-600">Customer</th>
              <th className="py-3 text-gray-600">Total</th>
              <th className="py-3 text-gray-600">Status</th>
            </tr>
          </thead>

          <tbody>
            {[1, 2, 3, 4].map((id) => (
              <tr key={id} className="border-b hover:bg-gray-50 transition">
                <td className="py-3">#{id}002</td>
                <td className="py-3">Ahmed Ali</td>
                <td className="py-3">$150</td>
                <td className="py-3">
                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded-xl text-sm">
                    Completed
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
