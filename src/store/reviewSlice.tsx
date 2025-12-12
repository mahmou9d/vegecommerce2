// ============================================
// reviewApi.ts - RTK Query
// ============================================
import { createApi } from "@reduxjs/toolkit/query/react";
import { AddReviewRequest, ReviewsResponse, TReview } from "../type/type";
import { baseQueryWithReauth } from "./baseQuery";

// 🔹 Review API
export const reviewApi = createApi({
  reducerPath: "reviewApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Review"],
  endpoints: (builder) => ({
    getRecentReviews: builder.query<TReview[], void>({
      query: () => "/reviews/recent/",
      transformResponse: (response: ReviewsResponse) => {
        return response.reviews || [];
      },
      providesTags: ["Review"],
    }),

    addReview: builder.mutation<TReview, AddReviewRequest>({
      query: (payload) => ({
        url: "/reviews/add/",
        method: "POST",
        body: {
          product_id: payload.product_id,
          comment: payload.comment,
          rating: Number(payload.rating),
        },
      }),
      invalidatesTags: ["Review"],
    }),
  }),
});

// 🔹 Export hooks
export const { useGetRecentReviewsQuery, useAddReviewMutation } = reviewApi;
