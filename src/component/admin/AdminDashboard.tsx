import { Card, CardContent } from "../../components/ui/card";
import { ShoppingCart, Package, Users, DollarSign } from "lucide-react";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  LineChart,
  BarChart,
  Bar,
} from "recharts";
import {
  useGetOrdersCountQuery,
  useGetRecentOrdersQuery,
  useGetSalesOrdersQuery,
  useGetTotalSalesQuery,
  useGetUsersCountQuery,
} from "../../store/SalesOrdersSlice";
import { useGetProductsCountQuery } from "../../store/UpdataProductSlice";
import { Counted } from "../../type/type";
import { motion, AnimatePresence } from "framer-motion";

interface IData {
  month: string;
  sales: number;
  orders: number;
}
export default function AdminDashboard() {
  const { data: total_sales = 0 } = useGetTotalSalesQuery();
  const { data: orders = {} as Counted } = useGetOrdersCountQuery();
  const { data: total_products = 0 } = useGetProductsCountQuery();
  const { data: users = 0 } = useGetUsersCountQuery();
  const { data, isLoading: l1 } = useGetRecentOrdersQuery();
  const { data: items = [], isLoading: l6 } = useGetSalesOrdersQuery();
  const { orders: orderRecentTopTen = [] } = data ?? {};
  console.log(items);
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
          Dashboard Overview
        </h1>
        <p className="text-gray-600 text-lg">
          Quick summary of your store performance
        </p>
        <div className="mt-4 mx-auto w-32 h-1.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-green-600 rounded-full shadow-lg"></div>
      </motion.div>

      {/* ======= STATS CARDS ======= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          {
            title: "Total Sales",
            value: total_sales,
            Icon: DollarSign,
            gradient: "from-emerald-500 to-teal-600",
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-700",
          },
          {
            title: "Orders",
            value: orders.orders ?? 0,
            Icon: ShoppingCart,
            gradient: "from-blue-500 to-indigo-600",
            iconBg: "bg-blue-100",
            iconColor: "text-blue-700",
          },
          {
            title: "Products",
            value: total_products,
            Icon: Package,
            gradient: "from-orange-500 to-yellow-600",
            iconBg: "bg-orange-100",
            iconColor: "text-orange-700",
          },
          {
            title: "Customers",
            value: users,
            Icon: Users,
            gradient: "from-purple-500 to-pink-600",
            iconBg: "bg-purple-100",
            iconColor: "text-purple-700",
          },
        ].map(({ title, value, Icon, gradient, iconBg, iconColor }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            whileHover={{ scale: 1.03, y: -4 }}
          >
            <Card
              className={`p-6 rounded-3xl bg-gradient-to-br ${gradient} shadow-xl hover:shadow-2xl transition-all border-0 overflow-hidden relative`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

              <CardContent className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center shadow-lg`}
                  >
                    <Icon size={28} className={iconColor} />
                  </div>
                  <span className="text-white/80 text-sm font-semibold uppercase tracking-wider">
                    Live
                  </span>
                </div>

                <h2 className="text-white/90 text-lg font-bold mb-2 tracking-wide">
                  {title}
                </h2>
                <p className="text-4xl md:text-5xl font-black text-white">
                  {title === "Total Sales" ? `$${value}` : value}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ======= CHART SECTION ======= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="rounded-3xl shadow-2xl backdrop-blur-xl bg-white/90 border-2 border-emerald-200 mb-12 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <span className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                📊
              </span>
              Sales & Orders Chart
            </h2>
          </div>

          <CardContent className="p-8">
            <div className="h-72 sm:h-80 md:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={items}
                  margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                  barCategoryGap="25%"
                >
                  <defs>
                    <linearGradient
                      id="salesGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#10B981" stopOpacity={0.9} />
                      <stop
                        offset="100%"
                        stopColor="#059669"
                        stopOpacity={0.7}
                      />
                    </linearGradient>
                    <linearGradient
                      id="ordersGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#14B8A6" stopOpacity={0.9} />
                      <stop
                        offset="100%"
                        stopColor="#0D9488"
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
                    dataKey="month"
                    tick={{ fontSize: 13, fill: "#374151", fontWeight: 600 }}
                    tickLine={false}
                    axisLine={{ stroke: "#d1d5db", strokeWidth: 2 }}
                  />
                  <YAxis
                    tick={{ fontSize: 13, fill: "#374151", fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "2px solid #10B981",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ paddingBottom: "20px" }}
                  />
                  <Bar
                    dataKey="sales"
                    fill="url(#salesGradient)"
                    radius={[10, 10, 0, 0]}
                    barSize={30}
                  />
                  <Bar
                    dataKey="orders"
                    fill="url(#ordersGradient)"
                    radius={[10, 10, 0, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ======= RECENT ORDERS TABLE ======= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Card className="rounded-3xl shadow-2xl backdrop-blur-xl bg-white/90 border-2 border-emerald-200 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <span className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                🛒
              </span>
              Recent Orders
            </h2>
          </div>

          <CardContent className="p-8">
            <div className="overflow-x-auto">
              <table className="min-w-full w-full">
                <thead>
                  <tr className="border-b-2 border-emerald-200">
                    <th className="py-4 px-6 text-left font-bold text-emerald-700 text-sm uppercase tracking-wide">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                        Order ID
                      </div>
                    </th>
                    <th className="py-4 px-6 text-left font-bold text-emerald-700 text-sm uppercase tracking-wide">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-teal-600 rounded-full"></span>
                        Customer
                      </div>
                    </th>
                    <th className="py-4 px-6 text-left font-bold text-emerald-700 text-sm uppercase tracking-wide">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                        Total
                      </div>
                    </th>
                    <th className="py-4 px-6 text-left font-bold text-emerald-700 text-sm uppercase tracking-wide">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        Status
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <AnimatePresence>
                    {orderRecentTopTen.map((orderRecent, index) => (
                      <motion.tr
                        key={orderRecent.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all border-b border-emerald-100 last:border-none"
                        whileHover={{ scale: 1.01 }}
                      >
                        <td className="py-4 px-6">
                          <span className="font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-lg">
                            #{orderRecent.id}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-semibold text-gray-800">
                          {orderRecent.customer}
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-bold text-xl text-emerald-700">
                            ${orderRecent.total_price}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <motion.span
                            className="inline-block px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md"
                            whileHover={{ scale: 1.05 }}
                          >
                            ✓ {orderRecent.status}
                          </motion.span>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
