// ============================================
// cartApi.ts - RTK Query
// ============================================
import { createApi } from "@reduxjs/toolkit/query/react";
import { AddToCartRequest, CartResponse, CheckoutResponse, EditCartRequest, RemoveCartRequest } from "../type/type";
import { baseQueryWithReauth } from "./baseQuery";


// 🔹 Cart API
export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    getCart: builder.query<CartResponse, void>({
      query: () => "/cart/items/",
      providesTags: ["Cart"],
    }),

    addToCart: builder.mutation<CartResponse, AddToCartRequest>({
      query: (payload) => ({
        url: "/cart/add/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Cart"],
    }),

    editCart: builder.mutation<CartResponse, EditCartRequest>({
      query: (payload) => ({
        url: "/cart/edit/",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Cart"],
    }),

    removeFromCart: builder.mutation<CartResponse, RemoveCartRequest>({
      query: (payload) => ({
        url: "/cart/remove/",
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["Cart"],
    }),

    clearCart: builder.mutation<CartResponse, void>({
      query: () => ({
        url: "/cart/clear/",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    checkout: builder.mutation<CheckoutResponse, any>({
      query: (payload) => ({
        url: "/order/add/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

// 🔹 Export hooks
export const {
  useGetCartQuery,
  useAddToCartMutation,
  useEditCartMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
  useCheckoutMutation,
} = cartApi;