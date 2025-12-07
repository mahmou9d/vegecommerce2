import { Card, CardContent } from "../../components/ui/card";
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
      <div className="mb-8">
        <h1
          className="
    text-4xl font-extrabold tracking-tight 
    text-gray-900
  "
        >
          Dashboard Overview
        </h1>

        <p
          className="
    text-gray-500 text-base mt-2 
    leading-relaxed
  "
        >
          Quick summary of your store performance
        </p>

        {/* Underline Accent */}
        <div className="mt-3 w-24 h-1.5 bg-gradient-to-r from-blue-700 to-green-700 rounded-full"></div>
      </div>

      {/* ========== Stats Cards ========== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total Sales",
            value: "$12,450",
            Icon: DollarSign,
            gradient: "from-green-400 to-green-600",
          },
          {
            title: "Orders",
            value: "340",
            Icon: ShoppingCart,
            gradient: "from-blue-400 to-blue-600",
          },
          {
            title: "Products",
            value: "120",
            Icon: Package,
            gradient: "from-yellow-400 to-yellow-600",
          },
          {
            title: "Customers",
            value: "825",
            Icon: Users,
            gradient: "from-purple-400 to-purple-600",
          },
        ].map(({ title, value, Icon, gradient }, i) => (
          <Card
            key={i}
            className={`p-6 rounded-3xl bg-gradient-to-r ${gradient} text-white shadow-2xl hover:shadow-3xl transition-shadow duration-500`}
          >
            <CardContent className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold flex items-center space-x-2">
                  <Icon size={24} />
                  <span>{title}</span>
                </h2>
                <p className="text-4xl md:text-5xl font-extrabold mt-2">
                  {value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ========== Charts Section (Placeholder) ========== */}
      <div className="bg-white p-10 rounded-3xl shadow-2xl h-96">
        <h2 className="text-xl font-bold text-gray-800 mb-5">
          Sales & Orders Chart
        </h2>

        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 0, right: 30, left: 0, bottom: 10 }}
            barCategoryGap="25%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#d1d5db"
              opacity={0.6}
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tick={{ fontSize: 14, fill: "#1f2937", fontWeight: 500 }}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
            />

            <YAxis
              tick={{ fontSize: 14, fill: "#1f2937", fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.03)" }}
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                padding: "10px 15px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
              }}
              itemStyle={{ fontWeight: 600, color: "#111827" }}
              labelStyle={{ color: "#6b7280", marginBottom: 5 }}
            />

            <Legend
              verticalAlign="top"
              wrapperStyle={{
                paddingBottom: 20,
                fontWeight: 600,
                color: "#374151",
              }}
            />

            <Bar
              dataKey="sales"
              fill="#4F46E5"
              barSize={34}
              radius={[10, 10, 0, 0]}
              animationDuration={900}
            />

            <Bar
              dataKey="orders"
              fill="#10B981"
              barSize={34}
              radius={[10, 10, 0, 0]}
              animationDuration={900}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ========== Recent Orders Table ========== */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 tracking-tight">
          Recent Orders
        </h2>

        <table className="w-full border-collapse">
          <thead>
            <tr className="text-gray-500 text-sm border-b">
              <th className="py-3 px-4 font-semibold">Order ID</th>
              <th className="py-3 px-4 font-semibold">Customer</th>
              <th className="py-3 px-4 font-semibold">Total</th>
              <th className="py-3 px-4 font-semibold">Status</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {[1, 2, 3, 4].map((id) => (
              <tr
                key={id}
                className="group hover:bg-gray-50 transition border-b last:border-none"
              >
                <td className="py-4 px-auto font-medium text-center">
                  #{id}002
                </td>
                <td className="py-4 px-auto text-center">Ahmed Ali</td>
                <td className="py-4 px-auto font-semibold text-gray-900 text-center">
                  $150
                </td>

                <td className="py-4 px-auto text-center">
                  <span
                    className="
              px-3 py-1.5 
              rounded-full 
              text-sm 
              font-medium
              bg-green-100 
              text-green-700 
              border border-green-200
              shadow-sm
            "
                  >
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
