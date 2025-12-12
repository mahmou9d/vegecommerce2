import React, { useState } from "react";
import { Eye, Check, X, Clock, Star } from "lucide-react";

interface Review {
  id: number;
  userName: string;
  userEmail: string;
  productName: string;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  date: string;
  userAvatar: string;
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

type FilterType = "all" | "pending" | "approved" | "rejected";

const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      userName: "Ahmed Mohamed",
      userEmail: "ahmed@example.com",
      productName: "Smart Watch Pro Max",
      rating: 5,
      comment:
        "Excellent product, high quality and fast shipping. Highly recommend!",
      status: "pending",
      date: "2024-12-10",
      userAvatar: "AM",
    },
    {
      id: 2,
      userName: "Fatma Ali",
      userEmail: "fatma@example.com",
      productName: "Wireless Headphones",
      rating: 4,
      comment: "Great sound quality, but battery needs improvement.",
      status: "approved",
      date: "2024-12-09",
      userAvatar: "FA",
    },
    {
      id: 3,
      userName: "Mahmoud Hassan",
      userEmail: "mahmoud@example.com",
      productName: "Galaxy S23 Phone",
      rating: 2,
      comment:
        "Product did not arrive as shown in pictures, quality lower than expected.",
      status: "rejected",
      date: "2024-12-08",
      userAvatar: "MH",
    },
    {
      id: 4,
      userName: "Sara Khaled",
      userEmail: "sara@example.com",
      productName: "Laptop Bag",
      rating: 5,
      comment: "Very practical and durable bag, large storage space.",
      status: "approved",
      date: "2024-12-07",
      userAvatar: "SK",
    },
    {
      id: 5,
      userName: "Youssef Ibrahim",
      userEmail: "youssef@example.com",
      productName: "Canon EOS Camera",
      rating: 3,
      comment: "Good quality but price is somewhat high.",
      status: "pending",
      date: "2024-12-06",
      userAvatar: "YI",
    },
  ]);

  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");

  const getStatusColor = (status: Review["status"]): string => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: Review["status"]): string => {
    switch (status) {
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "pending":
        return "Pending";
      default:
        return status;
    }
  };

  const updateReviewStatus = (
    id: number,
    newStatus: Review["status"]
  ): void => {
    setReviews(
      reviews.map((review) =>
        review.id === id ? { ...review, status: newStatus } : review
      )
    );
    if (selectedReview && selectedReview.id === id) {
      setSelectedReview({ ...selectedReview, status: newStatus });
    }
  };

  const filteredReviews: Review[] =
    filter === "all" ? reviews : reviews.filter((r) => r.status === filter);

  const stats: Stats = {
    total: reviews.length,
    pending: reviews.filter((r) => r.status === "pending").length,
    approved: reviews.filter((r) => r.status === "approved").length,
    rejected: reviews.filter((r) => r.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reviews Management
          </h1>
          <p className="text-gray-600">Manage and view all product reviews</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Reviews</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Star className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Approved</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.approved}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Check className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Rejected</p>
                <p className="text-3xl font-bold text-red-600">
                  {stats.rejected}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <X className="text-red-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === "pending"
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => setFilter("approved")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === "approved"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Approved ({stats.approved})
            </button>
            <button
              onClick={() => setFilter("rejected")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === "rejected"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Rejected ({stats.rejected})
            </button>
          </div>
        </div>

        {/* Reviews Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Rating
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Comment
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                          {review.userAvatar}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {review.userName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {review.userEmail}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{review.productName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                        <span className="ml-2 text-sm font-medium text-gray-700">
                          {review.rating}/5
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 max-w-xs truncate">
                        {review.comment}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          review.status
                        )}`}
                      >
                        {getStatusText(review.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{review.date}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedReview(review)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        {review.status !== "approved" && (
                          <button
                            onClick={() =>
                              updateReviewStatus(review.id, "approved")
                            }
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                            title="Approve"
                          >
                            <Check size={18} />
                          </button>
                        )}
                        {review.status !== "rejected" && (
                          <button
                            onClick={() =>
                              updateReviewStatus(review.id, "rejected")
                            }
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Reject"
                          >
                            <X size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Review Details Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Review Details
                </h2>
                <button
                  onClick={() => setSelectedReview(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* User Info */}
                <div className="flex items-center gap-4 pb-6 border-b">
                  <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-semibold">
                    {selectedReview.userAvatar}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedReview.userName}
                    </h3>
                    <p className="text-gray-600">{selectedReview.userEmail}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedReview.date}
                    </p>
                  </div>
                </div>

                {/* Product */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">
                    Product
                  </h4>
                  <p className="text-lg text-gray-900">
                    {selectedReview.productName}
                  </p>
                </div>

                {/* Rating */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">
                    Rating
                  </h4>
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={24}
                        className={
                          i < selectedReview.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                    <span className="text-xl font-semibold text-gray-900 ml-2">
                      {selectedReview.rating}/5
                    </span>
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">
                    Comment
                  </h4>
                  <p className="text-gray-900 leading-relaxed">
                    {selectedReview.comment}
                  </p>
                </div>

                {/* Status */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">
                    Current Status
                  </h4>
                  <span
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                      selectedReview.status
                    )}`}
                  >
                    {getStatusText(selectedReview.status)}
                  </span>
                </div>

                {/* Actions */}
                <div className="pt-6 border-t">
                  <h4 className="text-sm font-semibold text-gray-500 mb-3">
                    Change Status
                  </h4>
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        updateReviewStatus(selectedReview.id, "approved")
                      }
                      className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition font-medium flex items-center justify-center gap-2"
                    >
                      <Check size={20} />
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        updateReviewStatus(selectedReview.id, "rejected")
                      }
                      className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition font-medium flex items-center justify-center gap-2"
                    >
                      <X size={20} />
                      Reject
                    </button>
                    <button
                      onClick={() =>
                        updateReviewStatus(selectedReview.id, "pending")
                      }
                      className="flex-1 bg-yellow-600 text-white px-4 py-3 rounded-lg hover:bg-yellow-700 transition font-medium flex items-center justify-center gap-2"
                    >
                      <Clock size={20} />
                      Pending
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
