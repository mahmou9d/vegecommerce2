// ============================================
// wishlistApi.ts - RTK Query
// ============================================
import { createApi } from "@reduxjs/toolkit/query/react";
import { TProduct, WishlistResponse } from "../type/type";
import { baseQueryWithReauth } from "./baseQuery";

// 🔹 Wishlist API
export const wishlistApi = createApi({
  reducerPath: "wishlistApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Wishlist"],
  endpoints: (builder) => ({
    // ✅ جلب الـ Wishlist
    getWishlist: builder.query<TProduct[], void>({
      query: () => "/wishlist/items/",
      transformResponse: (response: WishlistResponse) => {
        return response.wishlist?.products || [];
      },
      providesTags: ["Wishlist"],
    }),

    // ✅ إضافة للـ Wishlist
    addToWishlist: builder.mutation<number, number>({
      query: (product_id) => ({
        url: "/wishlist/add/",
        method: "POST",
        body: { product_id },
      }),
      invalidatesTags: ["Wishlist"],
    }),

    // ✅ حذف من الـ Wishlist
    removeFromWishlist: builder.mutation<number, number>({
      query: (product_id) => ({
        url: "/wishlist/remove/",
        method: "DELETE",
        body: { product_id },
      }),
      invalidatesTags: ["Wishlist"],
    }),
  }),
});

// 🔹 Export hooks
export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = wishlistApi;