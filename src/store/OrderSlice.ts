import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState, AppDispatch } from ".";
import { refreshAccessToken } from "./authSlice";



interface WishlistState {
  orders: number;
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

const initialState: WishlistState = {
  orders: 0,
  loading: "idle",
  error: null,
};
export const GetOrder = createAsyncThunk<
  number,
  void,
  { state: RootState; dispatch: AppDispatch }
>("Order/GetOrder", async (_, thunkAPI) => {
  try {
    const { auth } = thunkAPI.getState();
    let token = auth.access;

    const fetchWishlist = async (token: string) => {
      const res = await fetch(
        "https://e-commerce-web-production-ead4.up.railway.app/api/dashboard/orders/",
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
      const data = await res.json();
      console.log(data.orders)
      return data.orders;
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
console.log(response)
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});
const OrderSlice = createSlice({
  name: "Orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(GetOrder.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(GetOrder.fulfilled, (state, action) => {
      state.loading = "succeeded";
      console.log("TOTAL SALES PAYLOAD:", action.payload);
      state.orders = action.payload;
    });
    builder.addCase(GetOrder.rejected, (state, action) => {
      state.loading = "failed";
      console.log("TOTAL SALES PAYLOAD:", action.payload);
      state.error = (action.payload as string) || "Unexpected error";
    });
  },
});

export default OrderSlice.reducer;
