import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { refreshAccessToken } from "./authSlice";

type TProduct = {
  id?: number;
  product_id?: number;
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
};

interface ProductSliceState {
  products: TProduct[];
  loading: {
    list: boolean; // loading لعملية جلب المنتجات
  };
  error: string | null;
  loaded: boolean; // true لو البيانات اتجلبت قبل كده -> يمنع refetch غير ضروري
}

const initialState: ProductSliceState = {
  products: [],
  loading: { list: false },
  error: null,
  loaded: false,
};

/**
 * Thunk: productUser
 * - يحتوي على condition تمنع إعادة الطلب لو already loaded
 */
export const productUser = createAsyncThunk<
  any,
  void,
  { state: { product: ProductSliceState }; rejectValue: string }
>(
  "product/productUser",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      let res = await fetch(
        "https://e-commerce-web-production-ead4.up.railway.app/api/products/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // if (!res.ok) {
      //   throw new Error(`HTTP error! status: ${res.status}`);
      // }
      if (res.status === 401) {
        try {
          const refreshRes = await dispatch(refreshAccessToken()).unwrap();
          const token = refreshRes.access;

          res = await fetch(
            "https://e-commerce-web-production-ead4.up.railway.app/api/auth/logout/",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
              },
              // body: JSON.stringify(payload),
            }
          );
        } catch (refreshErr) {
          return rejectWithValue("Session expired, please login again.");
        }
      }
      const data = await res.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Unknown error");
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as { product: ProductSliceState };
      // لو اتعمل fetch قبل كده، امنع إعادة الطلب
      if (state.product.loaded) return false;
      return true;
    },
    // خيار: يمكنك إضافة `dispatchConditionRejection: false` لو عايز تتعامل مع الرفض من condition بطريقة مختلفة
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    // لو حابب تفرّغ المنتجات (مثلاً عند logout) هتستدعي هذا الـ reducer
    clearProducts(state) {
      state.products = [];
      state.loaded = false;
      state.error = null;
      state.loading.list = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(productUser.pending, (state) => {
      state.loading.list = true;
      state.error = null;
    });
    builder.addCase(productUser.fulfilled, (state, action) => {
      state.loading.list = false;
      // افتراضياً response عندك فيه { products: [...] }
      // لو شكل response مختلف غيره هنا
      state.products = action.payload?.products ?? action.payload ?? [];
      state.loaded = true; // مهم لمنع refetch
    });
    builder.addCase(productUser.rejected, (state, action) => {
      state.loading.list = false;
      state.error =
        (action.payload as string) ||
        action.error?.message ||
        "Unexpected error";
    });
  },
});

export const { clearProducts } = productSlice.actions;
export default productSlice.reducer;

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// type TProduct = {
//   id?: number;
//   product_id?: number;
//   name: string;
//   description: string;
//   original_price: string;
//   final_price: string;
//   discount: number;
//   stock: number;
//   categories: string[];
//   tags: string[];
//   img: string;
//   average_rating: number;
//   img_url: string;
// };
// interface productSlice {
//   products: TProduct[];
//   loading: "idle" | "pending" | "succeeded" | "failed";
//   error: string | null;
// }

// const initialState: productSlice = {
//   products: [],
//   loading: "idle",
//   error: null,
// };

// export const productUser = createAsyncThunk(
//   "product/productUser",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await fetch(
//         "https://e-commerce-web-production-ead4.up.railway.app/api/products/",
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!res.ok) {
//         throw new Error(`HTTP error! status: ${res.status}`);
//       }

//       const data = await res.json();
//       // console.log(data, "data");
//       return data;
//     } catch (error: any) {
//       // console.log(error, "errorcart/add/");
//       return rejectWithValue(error.message);
//     }
//   }
// );

// const productSlice = createSlice({
//   name: "product",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder.addCase(productUser.pending, (state) => {
//       state.loading = "pending";
//       state.error = null;
//     });
//     builder.addCase(productUser.fulfilled, (state, action) => {
//       state.loading = "succeeded";
//       state.products = action.payload.products;
//     });
//     builder.addCase(productUser.rejected, (state, action) => {
//       state.loading = "failed";
//       state.error = (action.payload as string) || "Unexpected error";
//     });
//   },
// });

// export default productSlice.reducer;
