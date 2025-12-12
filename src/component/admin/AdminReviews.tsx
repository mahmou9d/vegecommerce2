
import React, { useState } from "react";
import {
  Star,
  Search,
  Filter,
  Calendar,
  TrendingUp,
  MessageSquare,
} from "lucide-react";

const AdminReviews = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("all");

  const reviews = [
    {
      id: 1,
      userName: "Ahmed Hassan",
      userEmail: "ahmed@example.com",
      userAvatar: "AH",
      productName: "Wireless Headphones Pro",
      rating: 5,
      comment:
        "Amazing quality! The sound is crystal clear and battery life is excellent.",
      date: "2024-12-10",
    },
    {
      id: 2,
      userName: "Sara Mohamed",
      userEmail: "sara@example.com",
      userAvatar: "SM",
      productName: "Smart Watch Elite",
      rating: 4,
      comment:
        "Great product overall, but could use better battery optimization.",
      date: "2024-12-09",
    },
    {
      id: 3,
      userName: "Omar Ali",
      userEmail: "omar@example.com",
      userAvatar: "OA",
      productName: "Laptop Stand Adjustable",
      rating: 5,
      comment:
        "Perfect for my home office setup. Very sturdy and well-designed.",
      date: "2024-12-08",
    },
    {
      id: 4,
      userName: "Layla Ibrahim",
      userEmail: "layla@example.com",
      userAvatar: "LI",
      productName: "USB-C Hub 7-in-1",
      rating: 3,
      comment: "Works as expected but gets a bit warm during heavy use.",
      date: "2024-12-07",
    },
  ];

  const stats = [
    {
      label: "Total Reviews",
      value: "1,234",
      icon: MessageSquare,
      color: "bg-blue-500",
    },
    {
      label: "Average Rating",
      value: "4.6",
      icon: Star,
      color: "bg-yellow-500",
    },
    {
      label: "This Month",
      value: "+124",
      icon: TrendingUp,
      color: "bg-green-500",
    },
  ];

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating =
      filterRating === "all" || review.rating === parseInt(filterRating);
    return matchesSearch && matchesRating;
  });

  return (
    <div className="min-h-screen">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-green-600 to-emerald-400 bg-clip-text text-transparent">
            Reviews Management
          </h1>
          <p className="text-gray-600">
            Manage and analyze all product reviews
          </p>
          <div className="mt-2 w-16 h-1.5 rounded-full bg-gradient-to-r from-green-700 to-green-900"></div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm mb-6 p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by user or product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Rating Filter */}
            <div className="relative">
              <Filter
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none bg-white cursor-pointer"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reviews Cards */}
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                {/* User Info */}
                <div className="flex items-center gap-4 md:w-64">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                    {review.userAvatar}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {review.userName}
                    </p>
                    <p className="text-sm text-gray-500">{review.userEmail}</p>
                  </div>
                </div>

                {/* Review Content */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-4">
                    <p className="font-medium text-gray-900">
                      {review.productName}
                    </p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-200 text-gray-200"
                          }
                        />
                      ))}
                      <span className="ml-2 text-sm font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-full">
                        {review.rating}.0
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed">
                    {review.comment}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar size={16} />
                    <span>
                      {new Date(review.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredReviews.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
            <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No reviews found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviews;