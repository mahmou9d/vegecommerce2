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

export const GetReview = createAsyncThunk(
  "review/GetReview",
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const state = getState() as RootState;
      let token = state.auth.access;

      let res = await fetch(
        "https://e-commerce-web-production-ead4.up.railway.app/api/reviews/recent/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          // body: JSON.stringify(payload),
        }
      );

      if (res.status === 401) {
        try {
          const refreshRes = await dispatch(refreshAccessToken()).unwrap();
          token = refreshRes.access;

          res = await fetch(
            "https://e-commerce-web-production-ead4.up.railway.app/api/reviews/recent/",
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

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        // console.error("Review API error:", errorData);
        return rejectWithValue(
          errorData || `HTTP error! status: ${res.status}`
        );
      }

      const data = await res.json();
      console.log(data, "datafckcllclllcclcllclccc");
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(GetReview.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(GetReview.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.items = action.payload.reviews || [];
    });
    builder.addCase(GetReview.rejected, (state, action) => {
      state.loading = "failed";
      state.error = (action.payload as string) || "Unexpected error";
    });
  },
});

export default reviewSlice.reducer;
