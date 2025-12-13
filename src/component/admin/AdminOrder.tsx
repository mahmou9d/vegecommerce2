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
  const { data: Counted = {} as Counted } = useGetOrdersCountQuery();
  const { data: orderRecent = [], isLoading: l1 } = useGetRecentOrdersQuery();
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
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const filteredOrders = orderRecent.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-green-600 to-green-600 rounded-xl shadow-lg">
              <ShoppingBag className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-700 to-green-700 bg-clip-text text-transparent">
                Order Management
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Track and manage all your orders in one place
              </p>
              <div className="mt-3 h-1.5 w-24 bg-gradient-to-r from-green-700 to-green-900 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Total Orders",
              value: Counted.orders,
              color: "from-blue-500 to-blue-600",
            },
            {
              label: "Pending",
              value: Counted.pending,
              color: "from-amber-500 to-amber-600",
            },
            {
              label: "paid",
              value: Counted.paid as string,
              color: "from-purple-500 to-purple-600",
            },
            {
              label: "Delivered",
              value: Counted.delivered,
              color: "from-green-500 to-green-600",
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-md p-5 border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div
                className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}
              >
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="text-green-600" size={20} />
            <h3 className="font-semibold text-gray-800">Filter Orders</h3>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search orders, customers, or emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 hover:bg-white"
              />
            </div>

            {/* Status Filter */}
            <Select
              value={filterStatus}
              onValueChange={(value: string) =>
                setFilterStatus(value as OrderStatus | "all")
              }
            >
              <SelectTrigger className="md:w-48 h-[50px] rounded-xl border-2 border-gray-200 hover:border-green-400 transition-all">
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                <Package className="mx-auto text-gray-300 mb-4" size={64} />
                <p className="text-gray-500 text-lg font-medium">
                  No orders found
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Try adjusting your filters
                </p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const statusInfo = getStatusInfo(order?.status as OrderStatus);
                const StatusIcon = statusInfo.icon;

                return (
                  <div
                    key={order.id}
                    className={`bg-white rounded-2xl shadow-md p-6 cursor-pointer transition-all duration-300 border-2 hover:shadow-xl hover:-translate-y-1 ${
                      selectedOrder?.id === order.id
                        ? "border-green-500 shadow-xl ring-4 ring-green-100"
                        : "border-gray-100 hover:border-green-300"
                    }`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg font-bold text-gray-900">
                            {order.id}
                          </span>
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 flex items-center gap-1.5 ${statusInfo.bgColor} ${statusInfo.color}`}
                          >
                            <StatusIcon size={14} />
                            {statusInfo.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <User size={14} />
                          <span className="font-medium">{order.customer}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar size={12} />
                          <span>{order.created}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Package size={16} className="text-gray-400" />
                        <span className="font-medium">
                          {order.items.length}{" "}
                          {order.items.length === 1 ? "item" : "items"}
                        </span>
                      </div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-600 bg-clip-text text-transparent">
                        ${order.total_price}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Order Details */}
          <div className="lg:col-span-1">
            {selectedOrder ? (
              <div className="bg-white sticky overflow-y-scroll h-[calc(100vh-3rem)] rounded-2xl shadow-lg p-6 top-6 border-2 border-gray-100">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-100">
                  <div className="p-2.5 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                    <Eye className="text-white" size={22} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Order Details
                  </h2>
                </div>

                {/* Order Info */}
                <div className="space-y-4 mb-6">
                  <div className="bg-gradient-to-br from-green-50 to-green-50 p-4 rounded-xl border border-green-100">
                    <label className="text-xs font-semibold text-green-700 uppercase tracking-wide block mb-1">
                      Order Number
                    </label>
                    <p className="font-bold text-xl text-gray-900">
                      {selectedOrder.id}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Calendar size={18} className="text-gray-500" />
                    <div className="flex-1">
                      <label className="text-xs font-medium text-gray-500 block">
                        Date
                      </label>
                      <p className="font-semibold text-gray-900">
                        {selectedOrder.created}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t-2 border-gray-100 space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <User size={18} className="text-gray-500 mt-0.5" />
                      <div className="flex-1">
                        <label className="text-xs font-medium text-gray-500 block">
                          Customer Name
                        </label>
                        <p className="font-semibold text-gray-900">
                          {selectedOrder.full_name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <Mail size={18} className="text-gray-500 mt-0.5" />
                      <div className="flex-1">
                        <label className="text-xs font-medium text-gray-500 block">
                          Email
                        </label>
                        <p className="font-medium text-gray-700 text-sm break-all">
                          {selectedOrder.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <Phone size={18} className="text-gray-500 mt-0.5" />
                      <div className="flex-1">
                        <label className="text-xs font-medium text-gray-500 block">
                          Phone
                        </label>
                        <p className="font-medium text-gray-700">
                          {selectedOrder.phone_number}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <MapPin size={18} className="text-gray-500 mt-0.5" />
                      <div className="flex-1">
                        <label className="text-xs font-medium text-gray-500 block">
                          Address
                        </label>
                        <p className="font-medium text-gray-700 text-sm">
                          {selectedOrder.full_address}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Package size={18} className="text-green-600" />
                    Order Items
                  </h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-4 bg-gradient-to-br from-gray-50 to-green-50 rounded-xl border border-gray-200 hover:shadow-md transition-all"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">
                            {item.product_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="font-bold text-lg text-gray-900">
                          ${+item.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t-2 border-gray-200">
                    <span className="font-bold text-gray-700 text-lg">
                      Total
                    </span>
                    <span className="font-bold text-2xl bg-gradient-to-r from-green-600 to-green-600 bg-clip-text text-transparent">
                      ${selectedOrder.total_price}
                    </span>
                  </div>
                </div>

                {/* Status Update */}
                <div className="bg-gradient-to-br from-green-50 to-green-50 p-4 rounded-xl border-2 border-green-100">
                  <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Package size={18} className="text-green-600" />
                    Update Order Status
                  </label>

                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as OrderStatus)}
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-xl
             focus:ring-2 focus:ring-green-500 focus:border-green-500
             font-medium bg-white transition-all hover:border-green-400"
                  >
                    {statusOptions.map((statusOption) => (
                      <option
                        key={statusOption.value}
                        value={statusOption.value}
                      >
                        {statusOption.label}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() =>
                      selectedOrder &&
                      handleStatusChange(selectedOrder.id, status)
                    }
                    className="mt-4 w-full px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold shadow-md hover:shadow-lg"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center sticky top-6 border-2 border-gray-100">
                <div className="bg-gradient-to-br from-green-100 to-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Eye className="text-green-600" size={48} />
                </div>
                <p className="text-gray-600 font-medium text-lg mb-2">
                  No Order Selected
                </p>
                <p className="text-gray-400 text-sm">
                  Click on an order to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrder;
