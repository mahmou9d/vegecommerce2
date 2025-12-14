
import React, { useState } from "react";
import {
  Star,
  Search,
  Filter,
  Calendar,
  TrendingUp,
  MessageSquare,
} from "lucide-react";
import { useGetRecentReviewsQuery } from "../../store/reviewSlice";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent } from "../../components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";

const AdminReviews = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("all");
const { data: reviews = [], isLoading } = useGetRecentReviewsQuery();

const averageRating =
  reviews.length > 0
    ? (
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      ).toFixed(1)
    : "0.0";
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const thisMonthCount = reviews.filter((review) => {
      const reviewDate = new Date(review.created);
      return (
        reviewDate.getMonth() === currentMonth &&
        reviewDate.getFullYear() === currentYear
      );
    }).length;
  const stats = [
    {
      label: "Total Reviews",
      value: reviews.length,
      icon: MessageSquare,
      color: "bg-blue-500",
    },
    {
      label: "Average Rating",
      value: averageRating,
      icon: Star,
      color: "bg-yellow-500",
    },
    {
      label: "This Month",
      value: thisMonthCount,
      icon: TrendingUp,
      color: "bg-green-500",
    },
  ];

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating =
      filterRating === "all" || review.rating === parseInt(filterRating);
    return matchesSearch && matchesRating;
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
          Reviews Management
        </h1>
        <p className="text-gray-600 text-lg">
          Manage and analyze all product reviews
        </p>
        <div className="mt-4 mx-auto w-32 h-1.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-green-600 rounded-full shadow-lg"></div>
      </motion.div>

      {/* ======= STATS CARDS ======= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -4 }}
          >
            <Card
              className={`rounded-3xl shadow-xl p-6 border-0 overflow-hidden relative bg-gradient-to-br ${stat.color}`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

              <CardContent className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm">
                    <stat.icon className="text-white" size={28} />
                  </div>
                </div>

                <p className="text-white/90 text-sm font-bold uppercase tracking-wide mb-2">
                  {stat.label}
                </p>
                <p className="text-5xl font-black text-white">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ======= FILTERS SECTION ======= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="rounded-3xl shadow-2xl backdrop-blur-xl bg-white/90 border-2 border-emerald-200 mb-12 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
              <span className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Filter size={22} />
              </span>
              Filter Reviews
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
                  placeholder="Search by user or product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 border-2 border-emerald-300 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white hover:border-emerald-400 font-medium"
                />
              </div>

              {/* Rating Filter */}
              <div className="relative md:w-56">
                <Filter
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none z-10"
                  size={22}
                />
                {/* <select
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value)}
                  className="w-full pl-14 pr-10 py-4 border-2 border-emerald-300 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white cursor-pointer appearance-none font-bold text-gray-900 hover:border-emerald-400"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23059669'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 1rem center",
                    backgroundSize: "1.5em 1.5em",
                  }}
                >
                  <option value="all">All Ratings</option>
                  <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                  <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                  <option value="3">⭐⭐⭐ 3 Stars</option>
                  <option value="2">⭐⭐ 2 Stars</option>
                  <option value="1">⭐ 1 Star</option>
                </select> */}
                <Select
                  value={filterRating}
                  onValueChange={(value) => setFilterRating(value)}
                >
                  <SelectTrigger className="w-full md:w-56 h-[56px] rounded-2xl border-2 border-emerald-300 hover:border-emerald-400 focus:ring-2 focus:ring-emerald-500 transition-all font-bold bg-white text-gray-900">
                    <div className="flex items-center gap-2">
                      <Filter size={20} className="text-emerald-600" />
                      <SelectValue placeholder="All Ratings" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all" className="font-bold">
                        All Ratings
                      </SelectItem>
                      <SelectItem value="5" className="font-bold">
                        <div className="flex items-center gap-2">
                          <span>⭐⭐⭐⭐⭐</span>
                          <span>5 Stars</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="4" className="font-bold">
                        <div className="flex items-center gap-2">
                          <span>⭐⭐⭐⭐</span>
                          <span>4 Stars</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="3" className="font-bold">
                        <div className="flex items-center gap-2">
                          <span>⭐⭐⭐</span>
                          <span>3 Stars</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="2" className="font-bold">
                        <div className="flex items-center gap-2">
                          <span>⭐⭐</span>
                          <span>2 Stars</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="1" className="font-bold">
                        <div className="flex items-center gap-2">
                          <span>⭐</span>
                          <span>1 Star</span>
                        </div>
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ======= REVIEWS CARDS ======= */}
      <div className="space-y-6">
        <AnimatePresence>
          {filteredReviews.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="rounded-3xl shadow-2xl p-12 text-center border-2 border-gray-200">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare size={48} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">
                  No reviews found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters or search terms
                </p>
              </Card>
            </motion.div>
          ) : (
            filteredReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.01, y: -4 }}
              >
                <Card className="rounded-3xl shadow-xl hover:shadow-2xl transition-all p-8 border-2 border-gray-200 bg-white">
                  <CardContent>
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      {/* User Info */}
                      <div className="flex items-center gap-4 md:w-72 flex-shrink-0">
                        <motion.div
                          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-green-500 flex items-center justify-center text-white font-black text-2xl shadow-xl relative overflow-hidden"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
                          <span className="relative z-10">
                            {review.customer.charAt(0).toUpperCase()}
                          </span>
                        </motion.div>
                        <div className="flex-1">
                          <p className="font-black text-lg text-gray-900">
                            {review.customer}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <span className="text-xs text-gray-500 font-semibold">
                              Verified Buyer
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Review Content */}
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap items-center gap-4">
                          <p className="font-black text-xl text-gray-900 bg-gray-100 px-4 py-2 rounded-xl">
                            {review.product}
                          </p>
                          <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 px-4 py-2 rounded-xl border-2 border-yellow-200">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{
                                    delay: index * 0.05 + i * 0.05,
                                  }}
                                >
                                  <Star
                                    size={20}
                                    className={
                                      i < review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "fill-gray-300 text-gray-300"
                                    }
                                  />
                                </motion.div>
                              ))}
                            </div>
                            <span className="ml-1 text-base font-black text-gray-900">
                              {review.rating}.0
                            </span>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-gray-50 to-emerald-50 p-5 rounded-2xl border-2 border-gray-200">
                          <p className="text-gray-800 leading-relaxed font-medium">
                            "{review.comment}"
                          </p>
                        </div>

                        <div className="flex items-center gap-3 text-sm bg-gray-100 px-4 py-2 rounded-xl w-fit">
                          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Calendar size={16} className="text-emerald-600" />
                          </div>
                          <span className="font-bold text-gray-700">
                            {new Date(review.created).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminReviews;