// import { useAppDispatch, useAppSelector } from "../../store/hook";
import { Card, CardContent } from "../../components/ui/card";
// import { motion } from "framer-motion";
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
// import { RootState } from "../../store";
// import { useEffect } from "react";
// import { GetOrder } from "../../store/OrderSlice";
// import { GetTopSelling } from "../../store/TopSellingSlice";
// import { GetSumProducts } from "../../store/ProductsSlice";
// import { GetUsers } from "../../store/SumUsersSlice";
// import { GetTotalsales } from "../../store/TotalsalesSlice";
// import { GetOrderLatest } from "../../store/OrderLatestSlice";
import {  useGetOrdersCountQuery, useGetRecentOrdersQuery, useGetSalesOrdersQuery, useGetTotalSalesQuery, useGetUsersCountQuery } from "../../store/SalesOrdersSlice";
import { useGetProductsCountQuery } from "../../store/UpdataProductSlice";
import { Counted } from "../../type/type";

interface IData {
  month: string;
  sales: number;
  orders: number;
}
export default function AdminDashboard() {
  // const dispatch = useAppDispatch();
  // const { total_sales  } = useAppSelector(
  //   (state: RootState) => state.Totalsales
  // );
  const { data: total_sales = 0 } = useGetTotalSalesQuery();
  // const { orders } = useAppSelector(
  //   (state: RootState) => state.Orders
  // );
  const { data: orders = {} as Counted } = useGetOrdersCountQuery();

  // const { total_products } = useAppSelector(
  //   (state: RootState) => state.GetSumProducts
  // );
  const { data: total_products = 0 } = useGetProductsCountQuery();
  const { data: users = 0 } = useGetUsersCountQuery();
  // const { users } = useAppSelector(
  //   (state: RootState) => state.Users
  // );
    // const { orderRecent } = useAppSelector(
    //   (state: RootState) => state.OrderLatest
    // );
     const { data: orderRecent = [], isLoading: l1 } =
       useGetRecentOrdersQuery();
       const orderRecentTopTen =orderRecent.slice(0,10)
    //     const { items } = useAppSelector(
    //   (state: RootState) => state.SalesOrders
    // );
    const { data: items = [], isLoading: l6 } = useGetSalesOrdersQuery();
  // useEffect(() => {
    // dispatch(GetTotalsales());
    // dispatch(GetOrder());
    // dispatch(GetOrderLatest());
    // dispatch(GetSumProducts());
    // dispatch(GetUsers());
    // dispatch(GetSalesOrders());
  // }, [dispatch]);
console.log(items);
  // const data: IData[] = [
  //   { month: "Jan", sales: 4000, orders: 2400 },
  //   { month: "Feb", sales: 3000, orders: 2210 },
  //   { month: "Mar", sales: 5000, orders: 2290 },
  //   { month: "Apr", sales: 4780, orders: 2000 },
  //   { month: "May", sales: 5890, orders: 2780 },
  //   { month: "Jun", sales: 4390, orders: 1890 },
  // ];
  return (
    <div className="">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900">
          Dashboard Overview
        </h1>
        <p className="text-xs md:text-sm text-gray-500 mt-1 md:mt-2">
          Quick summary of your store performance
        </p>
        <div className="mt-2 w-16 h-1.5 rounded-full bg-gradient-to-r from-green-700 to-green-900"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          {
            title: "Total Sales",
            value: total_sales,
            Icon: DollarSign,
            gradient: "from-green-400 to-green-600",
          },
          {
            title: "Orders",
            value: orders.orders,
            Icon: ShoppingCart,
            gradient: "from-blue-400 to-blue-600",
          },
          {
            title: "Products",
            value: total_products,
            Icon: Package,
            gradient: "from-yellow-400 to-yellow-600",
          },
          {
            title: "Customers",
            value: users,
            Icon: Users,
            gradient: "from-purple-400 to-purple-600",
          },
        ].map(({ title, value, Icon, gradient }, i) => (
          <Card
            key={i}
            className={`p-2 md:p-4 rounded-2xl sm:rounded-3xl text-white bg-gradient-to-r ${gradient} shadow-lg hover:shadow-2xl transition`}
          >
            <CardContent className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <Icon size={22} />
                  <span>{title}</span>
                </h2>
                <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold mt-1">
                  {value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white p-7 md:p-10 rounded-2xl shadow-lg h-72 sm:h-80 md:h-96 mb-10">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4">
          Sales & Orders Chart
        </h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={items}
            margin={{ top: 0, right: 20, left: 0, bottom: 10 }}
            barCategoryGap="20%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "#1f2937" }}
              tickLine={false}
              axisLine={{ stroke: "#d1d5db" }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#1f2937" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip />
            <Legend verticalAlign="top" />
            <Bar
              dataKey="sales"
              fill="#4F46E5"
              radius={[6, 6, 0, 0]}
              barSize={20}
            />
            <Bar
              dataKey="orders"
              fill="#10B981"
              radius={[6, 6, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 overflow-x-auto">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4">
          Recent Orders
        </h2>
        <table className="min-w-[600px] w-full border-collapse">
          <thead>
            <tr className="text-gray-500 text-sm sm:text-base border-b">
              <th className="py-2 px-4 text-left font-medium">Order ID</th>
              <th className="py-2 px-4 text-left font-medium">Customer</th>
              <th className="py-2 px-4 text-left font-medium">Total</th>
              <th className="py-2 px-4 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm sm:text-base">
            {orderRecentTopTen.map((orderRecent) => (
              <tr
                key={orderRecent.id}
                className="hover:bg-gray-50 transition border-b last:border-none"
              >
                <td className="py-2 px-4 font-medium">#{orderRecent.id}</td>
                <td className="py-2 px-4">{orderRecent.customer}</td>
                <td className="py-2 px-4 font-semibold">
                  ${orderRecent.total_price}
                </td>
                <td className="py-2 px-4">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-200">
                    {orderRecent.status}
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
