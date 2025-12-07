import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  PlusSquare,
  BarChart,
  ClipboardList,
  XIcon,
  MenuIcon,
} from "lucide-react";
import { useState } from "react";

export default function AdminLayout() {
  const location = useLocation();
const [sidebarOpen, setSidebarOpen] = useState(false);
  const menu = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/admin" },
    { name: "Statistics", icon: <BarChart size={20} />, path: "/admin/stats" },
    // { name: "Products", icon: <Package size={20} />, path: "/admin/products" },
    { name: "Edit Product", icon: <PlusSquare size={20} />, path: "/admin/add" },
    
    // {
    //   name: "Orders",
    //   icon: <ClipboardList size={20} />,
    //   path: "/admin/orders",
    // },
  ];

  return (
    <div className=" md:flex md:flex-1 min-h-screen">
      {/* Mobile Header */}
      <header className="md:hidden bg-white p-4">
        {/* <h1 className="text-xl font-bold text-green-600">Admin Panel</h1> */}
        <button onClick={() => setSidebarOpen(true)}>
          <MenuIcon className="h-6 w-6 text-gray-700" />
        </button>
      </header>

      {/* Sidebar */}
      <section
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl p-6
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:flex-shrink-0
        `}
      >
        {/* Mobile Close Button */}
        <div className="flex justify-between items-center md:hidden mb-6">
          <h1 className="text-2xl font-bold text-green-600">Admin Panel</h1>
          <button onClick={() => setSidebarOpen(false)}>
            <XIcon className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        {/* Menu */}
        <nav className="">
          <h1 className="text-2xl font-bold text-center text-green-600 hidden md:block">
            Admin Panel
          </h1>

          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 p-3 rounded-xl font-medium transition
                ${
                  location.pathname === item.path
                    ? "bg-green-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
      </section>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="px-8 pb-8 pt-0 md:pt-8">
        <Outlet />
      </main>
    </div>
  );
}
