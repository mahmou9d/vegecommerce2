import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState, AppDispatch } from ".";
import { refreshAccessToken } from "./authSlice";

type TProduct = {
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
};

interface WishlistState {
  items: TProduct[];
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  loading: "idle",
  error: null,
};
export const GetWishlist = createAsyncThunk<
  TProduct[],
  void,
  { state: RootState; dispatch: AppDispatch }
>("wishlist/GetWishlist", async (_, thunkAPI) => {
  try {
    const { auth } = thunkAPI.getState();
    let token = auth.access;

    const fetchWishlist = async (token: string) => {
      const res = await fetch(
        "https://e-commerce-web-production-ead4.up.railway.app/api/wishlist/items/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      if (res.status === 401) return "expired";
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      return res.json();
    };
    let response: any = await fetchWishlist(token);
    if (response === "expired") {
      try {
        const refreshRes = await thunkAPI
          .dispatch(refreshAccessToken())
          .unwrap();
        token = refreshRes.access;
        response = await fetchWishlist(token);
        if (response === "expired") {
          return thunkAPI.rejectWithValue(
            "Session expired, please login again."
          );
        }
      } catch {
        return thunkAPI.rejectWithValue("Session expired, please login again.");
      }
    }

    return response.wishlist.products;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addWishlistLocally: (state, action: { payload: TProduct }) => {
      const product = action.payload;

      // لو المنتج مش موجود ضيفه
      const exists = state.items.some(
        (p) => p.product_id === product.product_id
      );

      if (!exists) {
        state.items.push(product);
      }
    },

    removeWishlistLocally: (state, action: { payload: number }) => {
      const product_id = action.payload;
      state.items = state.items.filter((p) => p.product_id !== product_id);
    },

    rollbackWishlist: (state, action: { payload: TProduct[] }) => {
      state.items = action.payload; // رجع النسخة القديمة من الـ wishlist
    },
  },
  extraReducers: (builder) => {
    builder.addCase(GetWishlist.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(GetWishlist.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.items = action.payload || [];
    });
    builder.addCase(GetWishlist.rejected, (state, action) => {
      state.loading = "failed";
      state.error = (action.payload as string) || "Unexpected error";
    });
  },
});
export const { addWishlistLocally, removeWishlistLocally, rollbackWishlist } =
  wishlistSlice.actions;
export default wishlistSlice.reducer;

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { RootState, AppDispatch } from ".";
// import { refreshAccessToken } from "./authSlice";

// type TProduct = {
//   product_id: number;
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

// interface WishlistState {
//   items: TProduct[];
//   loading: "idle" | "pending" | "succeeded" | "failed";
//   error: string | null;
// }

// const initialState: WishlistState = {
//   items: [],
//   loading: "idle",
//   error: null,
// };

// export const GetWishlist = createAsyncThunk<
//   TProduct[], // ✅ نوع الـ response (array of products)
//   void, // ✅ مفيش payload
//   { state: RootState; dispatch: AppDispatch }
// >("wishlist/GetWishlist", async (_, thunkAPI) => {
//   try {
//     const state = thunkAPI.getState();
//     let token = state.auth.access;

//     let res = await fetch(
//       "https://e-commerce-web-production-ead4.up.railway.app/api/wishlist/items/",
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           ...(token && { Authorization: `Bearer ${token}` }),
//         },
//       }
//     );

//     if (res.status === 401) {
//       try {
//         const refreshRes = await thunkAPI
//           .dispatch(refreshAccessToken())
//           .unwrap();
//         token = refreshRes.access;

//         res = await fetch(
//           "https://e-commerce-web-production-ead4.up.railway.app/api/wishlist/items/",
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               ...(token && { Authorization: `Bearer ${token}` }),
//             },
//           }
//         );
//       } catch {
//         return thunkAPI.rejectWithValue("Session expired, please login again.");
//       }
//     }

//     if (!res.ok) {
//       throw new Error(`HTTP error! status: ${res.status}`);
//     }

//     const data = await res.json();
//     return data.wishlist.products as TProduct[];
//   } catch (error: any) {
//     return thunkAPI.rejectWithValue(error.message);
//   }
// });

// const wishlistSlice = createSlice({
//   name: "wishlist",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder.addCase(GetWishlist.pending, (state) => {
//       state.loading = "pending";
//       state.error = null;
//     });
//     builder.addCase(GetWishlist.fulfilled, (state, action) => {
//       state.loading = "succeeded";
//       state.items = action.payload || [];
//     });
//     builder.addCase(GetWishlist.rejected, (state, action) => {
//       state.loading = "failed";
//       state.error = (action.payload as string) || "Unexpected error";
//     });
//   },
// });

// export default wishlistSlice.reducer;
