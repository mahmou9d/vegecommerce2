import React, { useState, useEffect } from "react";
import {
  Search,
  Eye,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  LucideIcon,
  Filter,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  useGetOrdersCountQuery,
  useGetRecentOrdersQuery,
  usePatchOrdersMutation,
} from "../../store/SalesOrdersSlice";
import { Counted, OrderRecent } from "../../type/type";
import { Card, CardContent } from "../../components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

// Types
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  date: string;
  address: string;
}

type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

interface StatusOption {
  value: OrderStatus;
  label: string;
  color: string;
  bgColor: string;
  icon: LucideIcon;
}

const AdminOrder: React.FC = () => {
   const [page, setPage] = useState(1);
   const { data: Counted = {} as Counted } = useGetOrdersCountQuery();
   const { data, isLoading } = useGetRecentOrdersQuery(page);
   const [patchOrders] = usePatchOrdersMutation();

   const [selectedOrder, setSelectedOrder] = useState<OrderRecent | null>(null);
   const [searchTerm, setSearchTerm] = useState<string>("");
   const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");
   const [status, setStatus] = useState<OrderStatus>("pending");

   // Update status when selectedOrder changes
   useEffect(() => {
     if (selectedOrder) {
       setStatus(selectedOrder.status as OrderStatus);
     }
   }, [selectedOrder]);

   // ✅ الـ statusOptions كـ constant
   const statusOptions: StatusOption[] = [
     {
       value: "pending",
       label: "Pending",
       color: "text-amber-700",
       bgColor: "bg-amber-50 border-amber-200",
       icon: Clock,
     },
     {
       value: "paid",
       label: "paid",
       color: "text-blue-700",
       bgColor: "bg-blue-50 border-blue-200",
       icon: Package,
     },
     {
       value: "shipped",
       label: "Shipped",
       color: "text-purple-700",
       bgColor: "bg-purple-50 border-purple-200",
       icon: Truck,
     },
     {
       value: "delivered",
       label: "Delivered",
       color: "text-green-700",
       bgColor: "bg-green-50 border-green-200",
       icon: CheckCircle,
     },
     {
       value: "cancelled",
       label: "Cancelled",
       color: "text-red-700",
       bgColor: "bg-red-50 border-red-200",
       icon: XCircle,
     },
   ];

   const getStatusInfo = (status: OrderStatus): StatusOption => {
     return statusOptions.find((s) => s.value === status) || statusOptions[0];
   };

   const handleStatusChange = async (id: number, newStatus: OrderStatus) => {
     try {
       await patchOrders({
         id,
         status: newStatus,
       }).unwrap();

       setTimeout(() => {
         const orderElement = document.getElementById(`order-${id}`);
         if (orderElement) {
           orderElement.scrollIntoView({
             behavior: "smooth",
             block: "center",
           });
         }
       }, 300);
     } catch (error) {
       console.error("Failed to update order status:", error);
     }
   };

   console.log(data);

   // Loading state
   if (isLoading) {
     return (
       <div className="flex justify-center items-center min-h-screen">
         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-600"></div>
       </div>
     );
   }

   // No data state
   if (!data) return null;

   const { orders, count, next, previous } = data;

   const filteredOrders = orders.filter((order) => {
     const matchesSearch =
       order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
       order.email.toLowerCase().includes(searchTerm.toLowerCase());

     const matchesStatus =
       filterStatus === "all" || order.status === filterStatus;

     return matchesSearch && matchesStatus;
   });

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
          Order Management
        </h1>
        <p className="text-gray-600 text-lg">
          Track and manage all your orders in one place
        </p>
        <div className="mt-4 mx-auto w-32 h-1.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-green-600 rounded-full shadow-lg"></div>
      </motion.div>

      {/* ======= STATS CARDS ======= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {[
          {
            label: "Total Orders",
            value: Counted.orders,
            color: "from-blue-500 to-indigo-600",
            icon: "📦",
            iconBg: "bg-blue-100",
          },
          {
            label: "Pending",
            value: Counted.pending,
            color: "from-amber-500 to-orange-600",
            icon: "⏳",
            iconBg: "bg-amber-100",
          },
          {
            label: "Paid",
            value: Counted.paid as string,
            color: "from-purple-500 to-pink-600",
            icon: "💳",
            iconBg: "bg-purple-100",
          },
          {
            label: "Delivered",
            value: Counted.delivered,
            color: "from-emerald-500 to-teal-600",
            icon: "✓",
            iconBg: "bg-emerald-100",
          },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            whileHover={{ scale: 1.05, y: -4 }}
          >
            <div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-gray-100 hover:shadow-2xl transition-all overflow-hidden relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br opacity-10 rounded-full -mr-10 -mt-10"></div>

              <div
                className={`w-12 h-12 ${stat.iconBg} rounded-2xl flex items-center justify-center shadow-md mb-3`}
              >
                <span className="text-2xl">{stat.icon}</span>
              </div>

              <div
                className={`text-4xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}
              >
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 font-bold uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ======= FILTERS SECTION ======= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="rounded-3xl shadow-2xl backdrop-blur-xl bg-white/90 border-2 border-emerald-200 mb-12 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
              <span className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Filter size={22} />
              </span>
              Filter Orders
            </h2>
          </div>

          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600"
                  size={22}
                />
                <input
                  type="text"
                  placeholder="Search orders, customers, or emails..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 border-2 border-emerald-300 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white hover:border-emerald-400 font-medium"
                />
              </div>

              {/* Status Filter */}
              <Select
                value={filterStatus}
                onValueChange={(value: string) =>
                  setFilterStatus(value as OrderStatus | "all")
                }
              >
                <SelectTrigger className="md:w-56 h-[56px] rounded-2xl border-2 border-emerald-300 hover:border-emerald-400 transition-all font-bold">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        <div className="flex items-center gap-2">
                          <status.icon size={16} className={status.color} />
                          {status.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ======= ORDERS GRID ======= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="rounded-3xl shadow-2xl p-12 text-center border-2 border-gray-200">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="text-gray-400" size={48} />
                </div>
                <p className="text-gray-500 text-xl font-bold mb-2">
                  No orders found
                </p>
                <p className="text-gray-400 text-sm">
                  Try adjusting your filters
                </p>
              </Card>
            </motion.div>
          ) : (
            <AnimatePresence>
              {filteredOrders.map((order, index) => {
                const statusInfo = getStatusInfo(order?.status as OrderStatus);
                const StatusIcon = statusInfo.icon;
                const isSelected = selectedOrder?.id === order.id;

                return (
                  <motion.div
                    key={order.id}
                    id={`order-${order.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={`rounded-3xl shadow-xl p-6 cursor-pointer transition-all duration-300 border-2 ${
                        isSelected
                          ? "border-emerald-500 shadow-2xl ring-4 ring-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50"
                          : "border-gray-200 hover:border-emerald-300 bg-white"
                      }`}
                      onClick={() => {
                        setSelectedOrder(order);
                        window.scrollTo(0, 666);
                      }}
                    >
                      <CardContent>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <span className="text-xl font-black text-gray-900 bg-gray-100 px-3 py-1 rounded-xl">
                                #{order.id}
                              </span>
                              <span
                                className={`px-4 py-2 rounded-full text-xs font-bold border-2 flex items-center gap-2 ${statusInfo.bgColor} ${statusInfo.color}`}
                              >
                                <StatusIcon size={16} />
                                {statusInfo.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700 mb-2 bg-gray-100 px-3 py-2 rounded-lg w-fit">
                              <User size={16} className="text-emerald-600" />
                              <span className="font-bold">
                                {order.customer}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg w-fit">
                              <Calendar size={14} />
                              <span className="font-semibold">
                                {order.created}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200">
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                              <Package size={18} className="text-emerald-600" />
                            </div>
                            <span className="font-bold text-gray-700">
                              {order.items.length}{" "}
                              {order.items.length === 1 ? "item" : "items"}
                            </span>
                          </div>
                          <div className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            ${order.total_price}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
          {/* Pagination Buttons */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <motion.button
              disabled={!previous}
              onClick={() => {
                setPage((p) => p - 1)
               setTimeout(() => {
                 window.scrollTo({
                   top: 0,
                   behavior: "smooth",
                 });
               }, 100);}}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              ← Previous
            </motion.button>

            <span className="px-6 py-3 bg-emerald-100 text-emerald-700 rounded-2xl font-black border-2 border-emerald-300">
              Page {Math.ceil(count/10)}
            </span>

            <motion.button
              disabled={!next}
              onClick={() => {
                setPage((p) => p + 1)
               setTimeout(() => {
                 window.scrollTo({
                   top: 0,
                   behavior: "smooth",
                 });
               }, 100);}}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next →
            </motion.button>
          </div>
        </div>

        {/* Order Details */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {selectedOrder ? (
              <motion.div
                key={selectedOrder.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="sticky overflow-y-auto h-[calc(100vh-3rem)] rounded-3xl shadow-2xl top-6 border-2 border-emerald-200 bg-white">
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                      <span className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <Eye size={22} />
                      </span>
                      Order Details
                    </h2>
                  </div>

                  <CardContent className="p-6 space-y-6">
                    {/* Order Info */}
                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-emerald-100 to-teal-100 p-5 rounded-2xl border-2 border-emerald-300">
                        <label className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-2 flex items-center gap-2">
                          <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                          Order Number
                        </label>
                        <p className="font-black text-2xl text-gray-900">
                          #{selectedOrder.id}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-2xl">
                        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                          <Calendar size={20} className="text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">
                            Date
                          </label>
                          <p className="font-bold text-gray-900">
                            {selectedOrder.created}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t-2 border-gray-200 space-y-3">
                        <motion.div
                          className="flex items-start gap-3 p-4 bg-gray-100 rounded-2xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <User size={20} className="text-emerald-600" />
                          </div>
                          <div className="flex-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">
                              Customer Name
                            </label>
                            <p className="font-bold text-gray-900">
                              {selectedOrder.full_name}
                            </p>
                          </div>
                        </motion.div>

                        <motion.div
                          className="flex items-start gap-3 p-4 bg-gray-100 rounded-2xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Mail size={20} className="text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">
                              Email
                            </label>
                            <p className="font-semibold text-gray-700 text-sm break-all">
                              {selectedOrder.email}
                            </p>
                          </div>
                        </motion.div>

                        <motion.div
                          className="flex items-start gap-3 p-4 bg-gray-100 rounded-2xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Phone size={20} className="text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">
                              Phone
                            </label>
                            <p className="font-semibold text-gray-700">
                              {selectedOrder.phone_number}
                            </p>
                          </div>
                        </motion.div>

                        <motion.div
                          className="flex items-start gap-3 p-4 bg-gray-100 rounded-2xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <MapPin size={20} className="text-red-600" />
                          </div>
                          <div className="flex-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">
                              Address
                            </label>
                            <p className="font-semibold text-gray-700 text-sm">
                              {selectedOrder.full_address}
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="border-t-2 border-gray-200 pt-6">
                      <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2 text-lg">
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <Package size={18} className="text-emerald-600" />
                        </div>
                        Order Items
                      </h3>
                      <div className="space-y-3">
                        {selectedOrder.items.map((item, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="flex justify-between items-center p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200 hover:shadow-lg transition-all">
                              <div>
                                <p className="font-bold text-gray-900 mb-1">
                                  {item.product_name}
                                </p>
                                <p className="text-sm text-gray-600 bg-white px-3 py-1 rounded-lg w-fit font-semibold">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                              <p className="font-black text-xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                ${(+item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center mt-6 pt-6 border-t-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-2xl">
                        <span className="font-black text-gray-900 text-xl">
                          Total
                        </span>
                        <span className="font-black text-3xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                          ${selectedOrder.total_price}
                        </span>
                      </div>
                    </div>

                    {/* Status Update */}
                    <div className="bg-gradient-to-br from-emerald-100 to-teal-100 p-6 rounded-2xl border-2 border-emerald-300">
                      <label className="block text-sm font-black text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                          <Package size={18} className="text-white" />
                        </div>
                        Update Order Status
                      </label>

                      {/* <select
                        value={status}
                        onChange={(e) =>
                          setStatus(e.target.value as OrderStatus)
                        }
                        className="w-full px-4 py-4 border-2 border-emerald-300 rounded-2xl
                 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                 font-bold bg-white transition-all hover:border-emerald-400 text-gray-900"
                      >
                        {statusOptions.map((statusOption) => (
                          <option
                            key={statusOption.value}
                            value={statusOption.value}
                          >
                            {statusOption.label}
                          </option>
                        ))}
                      </select> */}
                      <Select
                        value={status}
                        onValueChange={(value) =>
                          setStatus(value as OrderStatus)
                        }
                      >
                        <SelectTrigger className="w-full h-[56px] rounded-2xl border-2 border-emerald-300 hover:border-emerald-400 focus:ring-2 focus:ring-emerald-500 transition-all font-bold bg-white text-gray-900">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {statusOptions.map((statusOption) => (
                              <SelectItem
                                key={statusOption.value}
                                value={statusOption.value}
                                className="font-bold"
                              >
                                <div className="flex items-center gap-2">
                                  <statusOption.icon size={18} />
                                  {statusOption.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <motion.button
                        onClick={() =>
                          selectedOrder &&
                          handleStatusChange(selectedOrder.id, status)
                        }
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-4 w-full px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl hover:from-emerald-700 hover:to-teal-700 transition-all font-black text-lg shadow-xl hover:shadow-2xl"
                      >
                        ✓ Save Changes
                      </motion.button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="rounded-3xl shadow-2xl p-12 text-center sticky top-6 border-2 border-gray-200">
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-emerald-200">
                    <Eye className="text-emerald-600" size={48} />
                  </div>
                  <p className="text-gray-700 font-black text-xl mb-2">
                    No Order Selected
                  </p>
                  <p className="text-gray-500 text-sm font-semibold">
                    Click on an order to view details
                  </p>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminOrder;
