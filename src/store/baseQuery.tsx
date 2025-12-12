import { BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
export const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  prepareHeaders: (headers, { type }) => {
    const token = localStorage.getItem("access");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    if (type === "query") {
      headers.set("Content-Type", "application/json");
    }
    return headers;
  },
});

// 🔹 Base Query مع Refresh Token
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = localStorage.getItem("refresh");

    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: "/auth/token/refresh/",
          method: "POST",
          body: { refresh: refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const newToken = (refreshResult.data as any).access;
        localStorage.setItem("access", newToken);
        if ((refreshResult.data as any).refresh) {
          localStorage.setItem("refresh", (refreshResult.data as any).refresh);
        }
        result = await baseQuery(args, api, extraOptions);
      } else {
        return {
          error: {
            status: 401,
            data: "Session expired, please login again.",
          } as FetchBaseQueryError,
        };
      }
    }
  }

  return result;
};
