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
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  console.log("BASE URL:", import.meta.env.VITE_BASE_URL);
  const menu = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/admin" },
    { name: "Statistics", icon: <BarChart size={20} />, path: "/admin/stats" },
    {
      name: "Edit Product",
      icon: <PlusSquare size={20} />,
      path: "/admin/add",
    },
    {
      name: "Orders",
      icon: <ClipboardList size={20} />,
      path: "/admin/orders",
    },
    { name: "Reviews", icon: <Package size={20} />, path: "/admin/reviews" },
  ];

  return (
    <div className="md:flex md:flex-1 min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
      {/* Mobile Header */}
      <motion.header
        className="md:hidden bg-white shadow-lg p-4 border-b-4 border-emerald-500"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">⚡</span>
            </div>
            <h1 className="text-xl font-black bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
              Admin Panel
            </h1>
          </div>
          <motion.button
            onClick={() => setSidebarOpen(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center hover:bg-emerald-200 transition-all"
          >
            <MenuIcon className="h-6 w-6 text-emerald-700" />
          </motion.button>
        </div>
      </motion.header>

      {/* Sidebar */}
      <motion.section
        initial={false}
        animate={{ x: isDesktop ? 0 : sidebarOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl md:static md:flex-shrink-0 overflow-hidden"
      >
        {/* Gradient Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-600 via-teal-600 to-green-600 opacity-10"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500 rounded-full opacity-5 -mr-16 -mb-16"></div>

        <div className="relative z-10 h-full flex flex-col">
          {/* Mobile Close Button & Header */}
          <div className="flex justify-between items-center p-6 md:hidden border-b-2 border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">⚡</span>
              </div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                Admin Panel
              </h1>
            </div>
            <motion.button
              onClick={() => setSidebarOpen(false)}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center hover:bg-red-200 transition-all"
            >
              <XIcon className="h-6 w-6 text-red-600" />
            </motion.button>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:block p-6 border-b-2 border-emerald-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">⚡</span>
              </div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                Admin Panel
              </h1>
            </div>
            <p className="text-xs text-gray-500 ml-1">Management Dashboard</p>
          </div>
          <Link to="/" className="flex justify-center items-center">
            Home
          </Link>
          {/* Menu Navigation */}
          <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
            {menu.map((item, index) => {
              const isActive = location.pathname === item.path;

              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className="block"
                  >
                    <motion.div
                      whileHover={{ scale: 1.03, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        flex items-center gap-4 p-4 rounded-2xl font-bold transition-all
                        ${
                          isActive
                            ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl"
                            : "text-gray-700 hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100 hover:shadow-md"
                        }
                      `}
                    >
                      <div
                        className={`
                        w-10 h-10 rounded-xl flex items-center justify-center transition-all
                        ${
                          isActive
                            ? "bg-white/20"
                            : "bg-emerald-100 group-hover:bg-emerald-200"
                        }
                      `}
                      >
                        {item.icon}
                      </div>
                      <span className="text-base tracking-wide">
                        {item.name}
                      </span>

                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="ml-auto w-2 h-2 bg-white rounded-full"
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Footer Section */}
          <div className="p-6 border-t-2 border-emerald-100">
            <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl p-4 border-2 border-emerald-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">👤</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-emerald-800">
                    Admin User
                  </p>
                  <p className="text-xs text-emerald-600">Online</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="px-6 md:px-8 pb-8 pt-4 md:pt-8 md:flex-1 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
