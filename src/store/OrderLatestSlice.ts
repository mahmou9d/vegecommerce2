// // ============================================
// // dashboardApi.ts - RTK Query
// // ============================================
// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

// const BASE_URL = 'https://e-commerce-web-production-ead4.up.railway.app/api';

// // 🔹 Types
// interface OrderRecent {
//     id: number;
//     customer: string;
//     status: string;
//     total_price: number;
// }

// interface OrderRecentResponse {
//     orders: OrderRecent[];
// }

// // 🔹 Base Query مع Token
// const baseQuery = fetchBaseQuery({
//     baseUrl: BASE_URL,
//     prepareHeaders: (headers) => {
//         const token = localStorage.getItem('access');
//         if (token) {
//             headers.set('Authorization', `Bearer ${token}`);
//         }
//         headers.set('Content-Type', 'application/json');
//         return headers;
//     },
// });

// // 🔹 Base Query مع Refresh Token
// const baseQueryWithReauth: BaseQueryFn<
//     string | FetchArgs,
//     unknown,
//     FetchBaseQueryError
// > = async (args, api, extraOptions) => {
//     let result = await baseQuery(args, api, extraOptions);

//     if (result.error && result.error.status === 401) {
//         const refreshToken = localStorage.getItem('refresh');

//         if (refreshToken) {
//             const refreshResult = await baseQuery(
//                 {
//                     url: '/auth/token/refresh/',
//                     method: 'POST',
//                     body: { refresh: refreshToken },
//                 },
//                 api,
//                 extraOptions
//             );

//             if (refreshResult.data) {
//                 const newToken = (refreshResult.data as any).access;
//                 localStorage.setItem('access', newToken);
//                 if ((refreshResult.data as any).refresh) {
//                     localStorage.setItem('refresh', (refreshResult.data as any).refresh);
//                 }
//                 result = await baseQuery(args, api, extraOptions);
//             } else {
//                 return {
//                     error: {
//                         status: 401,
//                         data: 'Session expired, please login again.',
//                     } as FetchBaseQueryError,
//                 };
//             }
//         }
//     }

//     return result;
// };

// // 🔹 Dashboard API
// export const dashboardApi = createApi({
//     reducerPath: 'dashboardApi',
//     baseQuery: baseQueryWithReauth,
//     tagTypes: ['Orders', 'Users', 'Sales', 'Products'],
//     endpoints: (builder) => ({

//         // ✅ جلب أحدث الطلبات
//         getRecentOrders: builder.query<OrderRecent[], void>({
//             query: () => '/dashboard/orders/recent/',
//             transformResponse: (response: OrderRecentResponse) => {
//                 return response.orders || [];
//             },
//             providesTags: ['Orders'],
//         }),
//     }),
// });

// // 🔹 Export hooks
// export const {
//     useGetRecentOrdersQuery,
// } = dashboardApi;

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { RootState, AppDispatch } from ".";
// import { refreshAccessToken } from "./authSlice";

// interface orderRecent {
//     id:number
//     customer:string
//     status:string
//     total_price:number
// }

// // { id: 96, customer: 'Fo2sh', status: 'paid', total_price: 3.4 }
// interface WishlistState {
//     orderRecent: orderRecent[];
//     loading: "idle" | "pending" | "succeeded" | "failed";
//     error: string | null;
// }

// const initialState: WishlistState = {
//     orderRecent: [],
//     loading: "idle",
//     error: null,
// };
// export const GetOrderLatest = createAsyncThunk<
//     orderRecent[],
//     void,
//     { state: RootState; dispatch: AppDispatch }
//     >("OrderLatest/GetOrderLatest", async (_, thunkAPI) => {
//     try {
//         const { auth } = thunkAPI.getState();
//         let token = localStorage.getItem("access"); // ✅ معاك access


//         const fetchWishlist = async (token: string) => {
//             const res = await fetch(
//                 "https://e-commerce-web-production-ead4.up.railway.app/api/dashboard/orders/recent/",
//                 {
//                     method: "GET",
//                     headers: {
//                         "Content-Type": "application/json",
//                         Authorization: token ? `Bearer ${token}` : "",
//                     },
//                 }
//             );

//             if (res.status === 401) return "expired";
//             if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//             const data = await res.json();
//             console.log(data.orders)
//             return data.orders;
//         };
//         let response: any = await fetchWishlist(token);
//         if (response === "expired") {
//             try {
//                 const refreshRes = await thunkAPI
//                     .dispatch(refreshAccessToken())
//                     .unwrap();
//                 token = refreshRes.access;
//                 response = await fetchWishlist(token);
//                 if (response === "expired") {
//                     return thunkAPI.rejectWithValue(
//                         "Session expired, please login again."
//                     );
//                 }
//             } catch {
//                 return thunkAPI.rejectWithValue("Session expired, please login again.");
//             }
//         }

//         return response;
//     } catch (error: any) {
//         return thunkAPI.rejectWithValue(error.message);
//     }
// });
// const OrderLatestSlice = createSlice({
//     name: "OrderLatest",
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder.addCase(GetOrderLatest.pending, (state) => {
//             state.loading = "pending";
//             state.error = null;
//         });
//         builder.addCase(GetOrderLatest.fulfilled, (state, action) => {
//             state.loading = "succeeded";
//             state.orderRecent = action.payload;
//         });
//         builder.addCase(GetOrderLatest.rejected, (state, action) => {
//             state.loading = "failed";
//             state.error = (action.payload as string) || "Unexpected error";
//         });
//     },
// });

// export default OrderLatestSlice.reducer;
