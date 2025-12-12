import React, { useState } from "react";
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

type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

interface StatusOption {
  value: OrderStatus;
  label: string;
  color: string;
  bgColor: string;
  icon: LucideIcon;
}

const AdminOrder: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      orderNumber: "ORD-001",
      customerName: "Ahmed Mohamed",
      email: "ahmed@example.com",
      phone: "+20 101 234 5678",
      items: [
        { name: "Product 1", quantity: 2, price: 150 },
        { name: "Product 2", quantity: 1, price: 200 },
      ],
      total: 500,
      status: "pending",
      date: "2024-12-10",
      address: "Cairo, Nasr City, Al Nozha Street",
    },
    {
      id: 2,
      orderNumber: "ORD-002",
      customerName: "Sara Ali",
      email: "sara@example.com",
      phone: "+20 109 876 5432",
      items: [{ name: "Product 3", quantity: 3, price: 100 }],
      total: 300,
      status: "processing",
      date: "2024-12-11",
      address: "Giza, Dokki, Tahrir Street",
    },
    {
      id: 3,
      orderNumber: "ORD-003",
      customerName: "Mahmoud Hassan",
      email: "mahmoud@example.com",
      phone: "+20 112 345 6789",
      items: [
        { name: "Product 4", quantity: 1, price: 350 },
        { name: "Product 5", quantity: 2, price: 125 },
      ],
      total: 600,
      status: "shipped",
      date: "2024-12-09",
      address: "Alexandria, Smouha, Fawzy Moaz Street",
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");

  const statusOptions: StatusOption[] = [
    {
      value: "pending",
      label: "Pending",
      color: "text-amber-700",
      bgColor: "bg-amber-50 border-amber-200",
      icon: Clock,
    },
    {
      value: "processing",
      label: "Processing",
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

  const handleStatusChange = (
    orderId: number,
    newStatus: OrderStatus
  ): void => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
              <div className="mt-3 h-1.5 bg-gradient-to-r from-blue-700 to-green-700 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Total Orders",
              value: orders.length,
              color: "from-blue-500 to-blue-600",
            },
            {
              label: "Pending",
              value: orders.filter((o) => o.status === "pending").length,
              color: "from-amber-500 to-amber-600",
            },
            {
              label: "Processing",
              value: orders.filter((o) => o.status === "processing").length,
              color: "from-purple-500 to-purple-600",
            },
            {
              label: "Delivered",
              value: orders.filter((o) => o.status === "delivered").length,
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
                const statusInfo = getStatusInfo(order.status);
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
                            {order.orderNumber}
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
                          <span className="font-medium">
                            {order.customerName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar size={12} />
                          <span>{order.date}</span>
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
                        ${order.total}
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
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6 border-2 border-gray-100">
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
                      {selectedOrder.orderNumber}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Calendar size={18} className="text-gray-500" />
                    <div className="flex-1">
                      <label className="text-xs font-medium text-gray-500 block">
                        Date
                      </label>
                      <p className="font-semibold text-gray-900">
                        {selectedOrder.date}
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
                          {selectedOrder.customerName}
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
                          {selectedOrder.phone}
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
                          {selectedOrder.address}
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
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="font-bold text-lg text-gray-900">
                          ${item.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t-2 border-gray-200">
                    <span className="font-bold text-gray-700 text-lg">
                      Total
                    </span>
                    <span className="font-bold text-2xl bg-gradient-to-r from-green-600 to-green-600 bg-clip-text text-transparent">
                      ${selectedOrder.total}
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
                    value={selectedOrder.status}
                    onChange={(e) =>
                      handleStatusChange(
                        selectedOrder.id,
                        e.target.value as OrderStatus
                      )
                    }
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium bg-white transition-all hover:border-green-400"
                  >
                    {statusOptions.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
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
