// ============================================
// authApi.ts - RTK Query
// ============================================
import { LoginRequest, LoginResponse, RefreshResponse, SignupRequest, SignupResponse } from "../type/type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface role {
  email: string;
  is_admin:boolean
}

// 🔹 Auth API
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
  tagTypes: ["auth"],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (payload) => ({
        url: "/auth/login/",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem("access", data.access);
          localStorage.setItem("refresh", data.refresh);
        } catch (err) {
          console.error("Login failed:", err);
        }
      },
      invalidatesTags: ["auth"],
    }),

    signup: builder.mutation<SignupResponse, SignupRequest>({
      query: (payload) => ({
        url: "/auth/signup/",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
      }),
    }),

    refreshToken: builder.mutation<RefreshResponse, void>({
      query: () => {
        const refreshToken = localStorage.getItem("refresh");
        return {
          url: "/auth/token/refresh/",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: { refresh: refreshToken },
        };
      },
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem("access", data.access);
          localStorage.setItem("refresh", data.refresh);
        } catch (err) {
          console.error("Refresh failed:", err);
        }
      },
    }),

    logout: builder.mutation<void, void>({
      query: () => {
        const accessToken = localStorage.getItem("access");
        const refreshToken = localStorage.getItem("refresh");
        return {
          url: "/auth/logout/",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: { refresh: refreshToken },
        };
      },
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          await queryFulfilled;
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
        } catch (err) {
          console.error("Logout failed:", err);
        }
      },
    }),
    getRole: builder.query<role, void>({
      query: () => {
        const token = localStorage.getItem("access");
        return {
          url: "/auth/me/",
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      providesTags: ["auth"],
    }),
  }),
});

// 🔹 Export hooks
export const {
  useGetRoleQuery,
  useLoginMutation,
  useSignupMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
} = authApi;