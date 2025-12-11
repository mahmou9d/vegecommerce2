// ============================================
// cartApi.ts - RTK Query
// ============================================
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

const BASE_URL = "https://e-commerce-web-production-ead4.up.railway.app/api";

// 🔹 Types
interface CartItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
  img_url: string;
}

interface CartResponse {
  items: CartItem[];
  total?: number;
}

interface CheckoutResponse {
  order_id: number;
}

interface AddToCartRequest {
  product_id: number;
  quantity: number;
}

interface EditCartRequest {
  product_id: number;
  quantity: number;
}

interface RemoveCartRequest {
  product_id: number;
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
  credentials: "include",
});

// 🔹 Base Query مع Refresh Token
const baseQueryWithReauth: BaseQueryFn<
  // ✅ ضيف < هنا
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

// 🔹 Cart API
export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    // ✅ جلب عناصر السلة
    getCart: builder.query<CartResponse, void>({
      query: () => "/cart/items/",
      providesTags: ["Cart"],
    }),

    // ✅ إضافة للسلة
    addToCart: builder.mutation<CartResponse, AddToCartRequest>({
      query: (payload) => ({
        url: "/cart/add/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Cart"],
    }),

    // ✅ تعديل الكمية
    editCart: builder.mutation<CartResponse, EditCartRequest>({
      query: (payload) => ({
        url: "/cart/edit/",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Cart"],
    }),

    // ✅ حذف عنصر من السلة
    removeFromCart: builder.mutation<CartResponse, RemoveCartRequest>({
      query: (payload) => ({
        url: "/cart/remove/",
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["Cart"],
    }),

    // ✅ تفريغ السلة
    clearCart: builder.mutation<CartResponse, void>({
      query: () => ({
        url: "/cart/clear/",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    // ✅ إتمام الطلب
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
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { AppDispatch, RootState } from ".";
// import { refreshAccessToken } from "./authSlice";

// /* ============================
//    Types
// ============================ */
// type CartItem = {
//   product_id: number;
//   product_name: string;
//   quantity: number;
//   price: number;
//   subtotal: number;
//   img_url: string;
// };

// interface CartState {
//   items: CartItem[];
//   order_id: number;
//   total: number;
//   loading: {
//     add: boolean;
//     remove: boolean;
//     edit: boolean;
//     get: boolean;
//     checkout: boolean;
//     del: boolean;
//   };
//   error: string | null;
//   loaded: boolean;
// }

// const initialState: CartState = {
//   items: [],
//   order_id: 0,
//   total: 0,
//   loading: {
//     add: false,
//     remove: false,
//     edit: false,
//     get: false,
//     checkout: false,
//     del: false,
//   },
//   error: null,
//   loaded: false,
// };

// /* ============================
//    Helpers
// ============================ */
// const recalcTotal = (items: CartItem[]) =>
//   items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

// /* ============================
//    Fetch Wrapper
// ============================ */
// export const fetchWithRefresh = async (
//   url: string,
//   options: RequestInit,
//   thunkAPI: {
//     dispatch: AppDispatch;
//     getState: () => RootState;
//     rejectWithValue: (v: any) => any;
//   }
// ) => {
//   // let token = thunkAPI.getState().auth.access;
//   let token = localStorage.getItem("access"); // ✅ معاك access

//   let res = await fetch(url, {
//     ...options,
//     headers: {
//       "Content-Type": "application/json",
//       ...(token && { Authorization: `Bearer ${token}` }),
//       ...(options.headers || {}),
//     },
//     credentials: "include",
//   });

//   if (res.status === 401) {
//     const refreshRes = await thunkAPI.dispatch(refreshAccessToken()).unwrap();
//     token = refreshRes.access;

//     res = await fetch(url, {
//       ...options,
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//         ...(options.headers || {}),
//       },
//       credentials: "include",
//     });
//   }

//   if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

//   return res.json();
// };

// /* ============================
//    Thunks
// ============================ */
// export const AddToCart = createAsyncThunk<
//   any,
//   { product_id: number; quantity: number },
//   { state: RootState; dispatch: AppDispatch }
// >("cart/AddToCart", async (payload, thunkAPI) => {
//   try {
//     return await fetchWithRefresh(
//       "https://e-commerce-web-production-ead4.up.railway.app/api/cart/add/",
//       { method: "POST", body: JSON.stringify(payload) },
//       thunkAPI
//     );
//   } catch (err: any) {
//     return thunkAPI.rejectWithValue(err.message);
//   }
// });

// export const RemoveCart = createAsyncThunk<
//   any,
//   { product_id: number },
//   { state: RootState; dispatch: AppDispatch }
// >("cart/RemoveCart", async (payload, thunkAPI) => {
//   try {
//     return await fetchWithRefresh(
//       "https://e-commerce-web-production-ead4.up.railway.app/api/cart/remove/",
//       { method: "DELETE", body: JSON.stringify(payload) },
//       thunkAPI
//     );
//   } catch (err: any) {
//     return thunkAPI.rejectWithValue(err.message);
//   }
// });

// export const EditCart = createAsyncThunk<
//   any,
//   { product_id: number; quantity: number },
//   { state: RootState; dispatch: AppDispatch }
// >("cart/EditCart", async (payload, thunkAPI) => {
//   try {
//     return await fetchWithRefresh(
//       "https://e-commerce-web-production-ead4.up.railway.app/api/cart/edit/",
//       { method: "PATCH", body: JSON.stringify(payload) },
//       thunkAPI
//     );
//   } catch (err: any) {
//     return thunkAPI.rejectWithValue(err.message);
//   }
// });

// export const Checkout = createAsyncThunk<
//   any,
//   any,
//   { state: RootState; dispatch: AppDispatch }
// >("cart/Checkout", async (payload, thunkAPI) => {
//   try {
//     return await fetchWithRefresh(
//       "https://e-commerce-web-production-ead4.up.railway.app/api/order/add/",
//       { method: "POST", body: JSON.stringify(payload) },
//       thunkAPI
//     );
//   } catch (err: any) {
//     return thunkAPI.rejectWithValue(err.message);
//   }
// });
// export const GetToCart = createAsyncThunk<
//   any,
//   void,
//   { state: RootState; dispatch: AppDispatch }
// >("cart/GetToCart", async (_, thunkAPI) => {
//   try {
//     const res = await fetchWithRefresh(
//       "https://e-commerce-web-production-ead4.up.railway.app/api/cart/items/",
//       { method: "GET" },
//       thunkAPI
//     );
//     const text = await res.text();
//     const data = text ? JSON.parse(text) : { items: [] };
//     return data;
//   } catch (err: any) {
//     return thunkAPI.rejectWithValue(err.message);
//   }
// });
// export const DeleteToCart = createAsyncThunk<
//   any,
//   void,
//   { state: RootState; dispatch: AppDispatch }
// >("cart/DeleteToCart", async (_, thunkAPI) => {
//   try {
//     const res = await fetchWithRefresh(
//       "https://e-commerce-web-production-ead4.up.railway.app/api/cart/clear/",
//       { method: "DELETE" },
//       thunkAPI
//     );
//     const text = await res.text(); // اقرأ النص فقط
//     const data = text ? JSON.parse(text) : { items: [] }; // لو فارغ اعمل default
//     return data;
//   } catch (err: any) {
//     return thunkAPI.rejectWithValue(err.message);
//   }
// });
// /* ============================
//    Slice
// ============================ */
// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     /* ADD — OPTIMISTIC */
//     addItemLocally: (state, action) => {
//       const { product_id, product_name, price, img_url } = action.payload;

//       const existing = state.items.find((i) => i.product_id === product_id);
//       if (existing) {
//         existing.quantity += 1;
//         existing.subtotal = existing.quantity * existing.price;
//       } else {
//         state.items.push({
//           product_id,
//           product_name,
//           quantity: 1,
//           price: Number(price),
//           subtotal: Number(price),
//           img_url,
//         });
//       }

//       state.total = state.items.reduce((sum, i) => sum + i.subtotal, 0);
//     },

//     rollbackAdd: (state, action) => {
//       const product_id = action.payload;

//       const item = state.items.find((i) => i.product_id === product_id);
//       if (!item) return;

//       if (item.quantity > 1) item.quantity--;
//       else state.items = state.items.filter((i) => i.product_id !== product_id);

//       state.total = recalcTotal(state.items);
//     },

//     /* REMOVE — OPTIMISTIC */
//     removeItemLocally: (state, action) => {
//       const { product_id } = action.payload;

//       state.items = state.items.filter((i) => i.product_id !== product_id);
//       state.total = recalcTotal(state.items);
//     },

//     rollbackRemove: (state, action) => {
//       state.items.push(action.payload.item);
//       state.total = recalcTotal(state.items);
//     },

//     /* EDIT — OPTIMISTIC */
//     updateQuantityLocally: (state, action) => {
//       const { product_id, quantity } = action.payload;

//       const item = state.items.find((i) => i.product_id === product_id);
//       if (!item) return;

//       item.quantity = quantity;
//       if (quantity === 0) {
//         state.items = state.items.filter((i) => i.product_id !== product_id);
//       }

//       state.total = recalcTotal(state.items);
//     },

//     rollbackEdit: (state, action) => {
//       const old = action.payload;
//       const item = state.items.find((i) => i.product_id === old.product_id);
//       if (!item) return;

//       item.quantity = old.quantity;
//       state.total = recalcTotal(state.items);
//     },
//   },

//   extraReducers: (builder) => {
//     /* ADD */
//     builder
//       .addCase(AddToCart.pending, (state) => {
//         state.loading.add = true;
//       })
//       .addCase(AddToCart.fulfilled, (state, action) => {
//         state.loading.add = false;

//         if (Array.isArray(action.payload?.items)) {
//           state.items = action.payload.items;
//           state.total = recalcTotal(state.items);
//         }
//       })

//       .addCase(AddToCart.rejected, (state, action) => {
//         state.loading.add = false;

//         const failedProduct = action.meta.arg.product_id;

//         const item = state.items.find((i) => i.product_id === failedProduct);
//         if (item) {
//           if (item.quantity > 1) item.quantity--;
//           else
//             state.items = state.items.filter(
//               (i) => i.product_id !== failedProduct
//             );
//         }

//         state.total = recalcTotal(state.items);
//       });

//     /* REMOVE */
//     builder
//       .addCase(RemoveCart.pending, (state) => {
//         state.loading.remove = true;
//       })
//       .addCase(RemoveCart.fulfilled, (state) => {
//         state.loading.remove = false;
//       })
//       .addCase(RemoveCart.rejected, (state, action) => {
//         state.loading.remove = false;
//       });

//     /* EDIT */
//     builder
//       .addCase(EditCart.pending, (state) => {
//         state.loading.edit = true;
//       })
//       .addCase(EditCart.fulfilled, (state, action) => {
//         state.loading.edit = false;

//         if (Array.isArray(action.payload?.items)) {
//           state.items = action.payload.items;
//           state.total = recalcTotal(state.items);
//         }
//       })
//       .addCase(EditCart.rejected, (state, action) => {
//         state.loading.edit = false;
//       });

//     builder
//       .addCase(GetToCart.pending, (state) => {
//         state.loading.get = true;
//       })
//       .addCase(GetToCart.fulfilled, (state, action) => {
//         state.loading.get = false;
//         state.items = action.payload.items;
//         state.total = recalcTotal(state.items);
//         state.loaded = true;
//       })
//       .addCase(GetToCart.rejected, (state, action) => {
//         state.loading.get = false;
//         state.error = action.payload as string;
//       });
//     /* CHECKOUT */
//     builder
//       .addCase(Checkout.pending, (state) => {
//         state.loading.checkout = true;
//       })
//       .addCase(Checkout.fulfilled, (state, action) => {
//         state.loading.checkout = false;
//         state.items = [];
//         state.total = 0;
//         state.order_id = action.payload.order_id;
//       })
//       .addCase(Checkout.rejected, (state, action) => {
//         state.loading.checkout = false;
//       });
//     // DeleteToCart
//     builder
//       .addCase(DeleteToCart.pending, (state) => {
//         state.loading.del = true;
//       })
//       .addCase(DeleteToCart.fulfilled, (state, action) => {
//         state.loading.del = false;
//         state.items = action.payload.items;
//         state.total = recalcTotal(state.items);
//         state.loaded = true;
//       })
//       .addCase(DeleteToCart.rejected, (state, action) => {
//         state.loading.del = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const {
//   addItemLocally,
//   rollbackAdd,
//   removeItemLocally,
//   rollbackRemove,
//   updateQuantityLocally,
//   rollbackEdit,
// } = cartSlice.actions;

// export default cartSlice.reducer;
