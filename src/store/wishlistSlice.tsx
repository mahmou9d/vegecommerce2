// ============================================
// wishlistApi.ts - RTK Query
// ============================================
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

const BASE_URL = "https://e-commerce-web-production-ead4.up.railway.app/api";

// 🔹 Types
interface TProduct {
  product_id: number;
  name: string;
  description: string;
  original_price: string;
  final_price: string;
  discount: number;
  stock: number;
  categories: string[];
  tags: string[];
  img: string;
  average_rating: number;
  img_url: string;
}

interface WishlistResponse {
  wishlist: {
    products: TProduct[];
  };
}

// 🔹 Base Query مع Token
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("access");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

// 🔹 Base Query مع Refresh Token
const baseQueryWithReauth: BaseQueryFn<
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
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { AppDispatch, RootState } from ".";
// import { fetchWithRefresh } from "./cartSlice";
// // import { AppDispatch } from "./store"; // ✅ لو عندك ملف store
// // import { fetchWithRefresh } from "../utils/fetchWithRefresh"; // ✅ الهيلبر اللي عملناه

// interface WishlistState {
//   items: number;
//   loading: "idle" | "pending" | "succeeded" | "failed";
//   error: string | null;
// }

// const initialState: WishlistState = {
//   items: 0,
//   loading: "idle",
//   error: null,
// };

// // =============================
// // Add to wishlist
// // =============================
// export const WishlistItems = createAsyncThunk<
//   number, // بيرجع الـ product_id
//   number, // payload = product_id
//   { state: RootState; dispatch: AppDispatch }
// >("wishlist/WishlistItems", async (product_id, thunkAPI) => {
//   try {
//     await fetchWithRefresh(
//       "https://e-commerce-web-production-ead4.up.railway.app/api/wishlist/add/",
//       {
//         method: "POST",
//         body: JSON.stringify({ product_id }),
//       },
//       thunkAPI
//     );

//     return product_id; // بيرجع الـ product_id فقط
//   } catch (err: any) {
//     return thunkAPI.rejectWithValue(err.message);
//   }
// });

// // =============================
// // Remove from wishlist
// // =============================
// export const WishlistRemove = createAsyncThunk<
//   number, // بيرجع الـ product_id اللي اتشال
//   number,
//   { state: RootState; dispatch: AppDispatch }
// >("wishlist/WishlistRemove", async (product_id, thunkAPI) => {
//   try {
//     await fetchWithRefresh(
//       "https://e-commerce-web-production-ead4.up.railway.app/api/wishlist/remove/",
//       {
//         method: "DELETE",
//         body: JSON.stringify({ product_id }),
//       },
//       thunkAPI
//     );

//     return product_id; // برضه بيرجع الـ product_id اللي اتشال
//   } catch (err: any) {
//     return thunkAPI.rejectWithValue(err.message);
//   }
// });

// const WishlistSlice = createSlice({
//   name: "wishlist",
//   initialState,
//   reducers: {

//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(WishlistItems.pending, (state) => {
//         state.loading = "pending";
//         state.error = null;
//       })
//       .addCase(WishlistItems.fulfilled, (state, action) => {
//         state.loading = "succeeded";
//         state.items = action.payload;
//         // console.log(action.payload); // ✅ product_id
//       })
//       .addCase(WishlistItems.rejected, (state, action) => {
//         state.loading = "failed";
//         state.error = (action.payload as string) || "Unexpected error";
//       });

//     builder
//       .addCase(WishlistRemove.pending, (state) => {
//         state.loading = "pending";
//         state.error = null;
//       })
//       .addCase(WishlistRemove.fulfilled, (state, action) => {
//         state.loading = "succeeded";
//         state.items = action.payload; // ✅ product_id
//       })
//       .addCase(WishlistRemove.rejected, (state, action) => {
//         state.loading = "failed";
//         state.error = (action.payload as string) || "Unexpected error";
//       });
//   },
// });

// export default WishlistSlice.reducer;

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { RootState } from ".";
// import { refreshAccessToken } from "./authSlice";

// interface WishlistState {
//   items: number;
//   loading: "idle" | "pending" | "succeeded" | "failed";
//   error: string | null;
// }

// const initialState: WishlistState = {
//   items: 0,
//   loading: "idle",
//   error: null,
// };

// // Add to wishlist
// export const WishlistItems = createAsyncThunk(
//   "wishlist/WishlistItems",
//   async (product_id: number, { rejectWithValue, getState, dispatch }) => {
//     try {
//       const state = getState() as RootState;
//       let token = state.auth.access;

//       let res = await fetch(
//         "https://e-commerce-web-production-ead4.up.railway.app/api/wishlist/add/",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             ...(token && { Authorization: `Bearer ${token}` }),
//           },
//           body: JSON.stringify({ product_id }),
//           credentials: "include",
//         }
//       );

//       if (res.status === 401) {
//         try {
//           const refreshRes = await dispatch(refreshAccessToken()).unwrap();
//           token = refreshRes.access;

//           res = await fetch(
//             "https://e-commerce-web-production-ead4.up.railway.app/api/wishlist/add/",
//             {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//                 ...(token && { Authorization: `Bearer ${token}` }),
//               },
//               body: JSON.stringify({ product_id }),
//               credentials: "include",
//             }
//           );
//         } catch {
//           return rejectWithValue("Session expired, please login again.");
//         }
//       }

//       if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

//       const data = await res.json();
//       // console.log(data, "EWME;LML;EWQ");
//       return product_id; // backend لازم يرجع المنتج نفسه أو { product }
//     } catch (error: any) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// // Remove from wishlist
// export const WishlistRemove = createAsyncThunk(
//   "wishlist/WishlistRemove",
//   async (product_id: number, { rejectWithValue, getState, dispatch }) => {
//     try {
//       const state = getState() as RootState;
//       let token = state.auth.access;

//       let res = await fetch(
//         "https://e-commerce-web-production-ead4.up.railway.app/api/wishlist/remove/",
//         {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//             ...(token && { Authorization: `Bearer ${token}` }),
//           },
//           body: JSON.stringify({ product_id }),
//           credentials: "include",
//         }
//       );

//       // في حالة الـ access token منتهي
//       if (res.status === 401) {
//         try {
//           const refreshRes = await dispatch(refreshAccessToken()).unwrap();
//           token = refreshRes.access;

//           res = await fetch(
//             "https://e-commerce-web-production-ead4.up.railway.app/api/wishlist/remove/",
//             {
//               method: "DELETE",
//               headers: {
//                 "Content-Type": "application/json",
//                 ...(token && { Authorization: `Bearer ${token}` }),
//               },
//               body: JSON.stringify({ product_id }),
//               credentials: "include",
//             }
//           );
//         } catch (refreshErr) {
//           return rejectWithValue("Session expired, please login again.");
//         }
//       }

//       if (!res.ok) {
//         throw new Error(`HTTP error! status: ${res.status}`);
//       }

//       const data = await res.json();
//       // console.log("WishlistRemove data:", data);
//       return data;
//     } catch (error: any) {
//       // console.log(error, "errorcart/add/");
//       return rejectWithValue(error.message);
//     }
//   }
// );

// const WishlistSlice = createSlice({
//   name: "wishlist",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder.addCase(WishlistItems.pending, (state) => {
//       state.loading = "pending";
//       state.error = null;
//     });
//     builder.addCase(WishlistItems.fulfilled, (state, action) => {
//       state.loading = "succeeded";
//       state.items = action.payload;
//     });
//     builder.addCase(WishlistItems.rejected, (state, action) => {
//       state.loading = "failed";
//       state.error = (action.payload as string) || "Unexpected error";
//     });

//     builder.addCase(WishlistRemove.pending, (state) => {
//       state.loading = "pending";
//       state.error = null;
//     });
//     builder.addCase(WishlistRemove.fulfilled, (state, action) => {
//       state.loading = "succeeded";
//       state.items = action.payload;
//     });
//     builder.addCase(WishlistRemove.rejected, (state, action) => {
//       state.loading = "failed";
//       state.error = (action.payload as string) || "Unexpected error";
//     });
//   },
// });

// export default WishlistSlice.reducer;
