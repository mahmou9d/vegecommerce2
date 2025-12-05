// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { AppDispatch, RootState } from ".";
// import { fetchWithRefresh } from "./cartSlice";
// // import { AppDispatch } from "./store"; // ✅ لازم يكون عندك AppDispatch
// // import { fetchWithRefresh } from "../utils/fetchWithRefresh"; // ✅ الهيلبر الموحد

// interface TReview {
//   id: number;
//   comment: string;
//   rating: number;
//   customer: string;
//   created: string;
//   product: string; // 👈 خليه string زي ما انت كاتب
// }

// interface ReviewState {
//   items: TReview[];
//   loading: "idle" | "pending" | "succeeded" | "failed";
//   error: string | null;
// }

// const initialState: ReviewState = {
//   items: [],
//   loading: "idle",
//   error: null,
// };

// // =============================
// // Get recent reviews
// // =============================
// export const GetReview = createAsyncThunk<
//   { reviews: TReview[] }, // ✅ نوع الريسبونس
//   void, // مفيش payload
//   { state: RootState; dispatch: AppDispatch }
// >("review/GetReview", async (_, thunkAPI) => {
//   try {
//     return await fetchWithRefresh(
//       "https://e-commerce-web-production-ead4.up.railway.app/api/reviews/recent/",
//       { method: "GET" },
//       thunkAPI
//     );
//   } catch (err: any) {
//     return thunkAPI.rejectWithValue(err.message);
//   }
// });

// // =============================
// // Add review
// // =============================
// export const AddReviews = createAsyncThunk<
//   TReview, // ✅ الريسبونس بيرجع الريفيو الجديد
//   { product_id: number; comment: string; rating: number }, // ✅ payload
//   { state: RootState; dispatch: AppDispatch }
// >("review/AddReviews", async (payload, thunkAPI) => {
//   try {
//     return await fetchWithRefresh(
//       "https://e-commerce-web-production-ead4.up.railway.app/api/reviews/add/",
//       {
//         method: "POST",
//         body: JSON.stringify({
//           product_id: payload.product_id,
//           comment: payload.comment,
//           rating: Number(payload.rating),
//         }),
//       },
//       thunkAPI
//     );
//   } catch (err: any) {
//     return thunkAPI.rejectWithValue(err.message);
//   }
// });

// // =============================
// // Slice
// // =============================
// const reviewSlice = createSlice({
//   name: "review",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(GetReview.pending, (state) => {
//         state.loading = "pending";
//         state.error = null;
//       })
//       .addCase(GetReview.fulfilled, (state, action) => {
//         state.loading = "succeeded";
//         state.items = action.payload.reviews || [];
//       })
//       .addCase(GetReview.rejected, (state, action) => {
//         state.loading = "failed";
//         state.error = (action.payload as string) || "Unexpected error";
//       });

//     builder
//       .addCase(AddReviews.pending, (state) => {
//         state.loading = "pending";
//         state.error = null;
//       })
//       .addCase(AddReviews.fulfilled, (state, action) => {
//         state.loading = "succeeded";
//         // ✅ ضيف الريفيو الجديد على اللي موجود
//         state.items = [action.payload, ...state.items];
//       })
//       .addCase(AddReviews.rejected, (state, action) => {
//         state.loading = "failed";
//         state.error = (action.payload as string) || "Unexpected error";
//       });
//   },
// });

// export default reviewSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from ".";
import { refreshAccessToken } from "./authSlice";

interface TReview {
  id: number;
  comment: string;
  rating: number;
  customer: string;
  created: string;
  product: string; // 👈 خليه string
}

interface ReviewState {
  items: TReview[];
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ReviewState = {
  items: [],
  loading: "idle",
  error: null,
};

export const AddReviews = createAsyncThunk(
  "review/AddReviews",
  async (
    payload: { product_id: number; comment: string; rating: number },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const state = getState() as RootState;
      let token = state.auth.access;
      // console.log(payload, "handleAddReviews");
      let res = await fetch(
        "https://e-commerce-web-production-ead4.up.railway.app/api/reviews/add/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({
            product_id: payload.product_id,
            comment: payload.comment,
            rating: Number(payload.rating),
          }),
        }
      );

      if (res.status === 401) {
        try {
          const refreshRes = await dispatch(refreshAccessToken()).unwrap();
          token = refreshRes.access;

          res = await fetch(
            "https://e-commerce-web-production-ead4.up.railway.app/api/reviews/add/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
              },
              body: JSON.stringify({
                product_id: payload.product_id,
                comment: payload.comment,
                rating: Number(payload.rating),
              }),
            }
          );
        } catch {
          return rejectWithValue("Session expired, please login again.");
        }
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        // console.error("Review API error:", errorData);
        return rejectWithValue(
          errorData || `HTTP error! status: ${res.status}`
        );
      }

      const data = await res.json();
      console.log(data, "handleAddReviews");
      return data;
    } catch (error: any) {
      // console.log(error, "errorcart/add/");
      return rejectWithValue(error.message);
    }
  }
);
const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(AddReviews.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(AddReviews.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.items = action.payload || [];
    });
    builder.addCase(AddReviews.rejected, (state, action) => {
      console.log("Checkout fulfilled payload:", action.payload);
      state.loading = "failed";
      state.error = (action.payload as string) || "Unexpected error";
    });
  },
});

export default reviewSlice.reducer;
