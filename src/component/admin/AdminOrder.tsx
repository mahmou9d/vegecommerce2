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
} from "lucide-react";

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
  icon: LucideIcon;
}

const AdminOrder: React.FC = () => {
  // Sample orders data
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
      color: "bg-yellow-100 text-yellow-800",
      icon: Clock,
    },
    {
      value: "processing",
      label: "Processing",
      color: "bg-blue-100 text-blue-800",
      icon: Package,
    },
    {
      value: "shipped",
      label: "Shipped",
      color: "bg-purple-100 text-purple-800",
      icon: Truck,
    },
    {
      value: "delivered",
      label: "Delivered",
      color: "bg-green-100 text-green-800",
      icon: CheckCircle,
    },
    {
      value: "cancelled",
      label: "Cancelled",
      color: "bg-red-100 text-red-800",
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Management
          </h1>
          <p className="text-gray-600">View and update order status</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by order number, customer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as OrderStatus | "all")
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-500">No orders found</p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                const StatusIcon = statusInfo.icon;

                return (
                  <div
                    key={order.id}
                    className={`bg-white rounded-lg shadow-sm p-6 cursor-pointer transition-all hover:shadow-md ${
                      selectedOrder?.id === order.id
                        ? "ring-2 ring-blue-500"
                        : ""
                    }`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {order.orderNumber}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {order.customerName}
                        </p>
                        <p className="text-xs text-gray-500">{order.date}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusInfo.color}`}
                      >
                        <StatusIcon size={14} />
                        {statusInfo.label}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-600">
                        {order.items.length}{" "}
                        {order.items.length === 1 ? "item" : "items"}
                      </div>
                      <div className="text-lg font-bold text-gray-900">
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
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                <div className="flex items-center gap-2 mb-6">
                  <Eye className="text-blue-600" size={24} />
                  <h2 className="text-xl font-bold text-gray-900">
                    Order Details
                  </h2>
                </div>

                {/* Order Info */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">
                      Order Number
                    </label>
                    <p className="font-bold text-gray-900">
                      {selectedOrder.orderNumber}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 block mb-1">
                      Date
                    </label>
                    <p className="text-gray-900">{selectedOrder.date}</p>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <label className="text-xs text-gray-500 block mb-1">
                      Customer Name
                    </label>
                    <p className="font-medium text-gray-900">
                      {selectedOrder.customerName}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 block mb-1">
                      Email
                    </label>
                    <p className="text-gray-900">{selectedOrder.email}</p>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 block mb-1">
                      Phone
                    </label>
                    <p className="text-gray-900">{selectedOrder.phone}</p>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 block mb-1">
                      Address
                    </label>
                    <p className="text-gray-900 text-sm">
                      {selectedOrder.address}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-3">Items</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between text-sm bg-gray-50 p-3 rounded"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-bold text-gray-900">
                          ${item.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-lg text-blue-600">
                      ${selectedOrder.total}
                    </span>
                  </div>
                </div>

                {/* Status Update */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <div className="bg-white rounded-lg shadow-sm p-8 text-center sticky top-6">
                <Eye className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-500">Select an order to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrder;
