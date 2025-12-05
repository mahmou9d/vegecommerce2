import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from ".";
import { fetchWithRefresh } from "./cartSlice";


interface checkoutSession {
    items: number;
    loading: "idle" | "pending" | "succeeded" | "failed";
    error: string | null;
}

const initialState: checkoutSession = {
    items: 0,
    loading: "idle",
    error: null,
};

export const checkoutSession = createAsyncThunk<
    any, // بيرجع الـ product_id
    number, // payload = product_id
    { state: RootState; dispatch: AppDispatch }
>("checkout/checkoutSession", async (order_id, thunkAPI) => {
    try {
        const data = await fetchWithRefresh(
            "https://e-commerce-web-production-ead4.up.railway.app/api/payment/create-checkout-session/",
            {
                method: "POST",
                body: JSON.stringify({ order_id }),
            },
            thunkAPI
        );

        return data; // بيرجع الـ product_id فقط
    } catch (err: any) {
        return thunkAPI.rejectWithValue(err.message);
    }
});

const checkoutSessionSlice = createSlice({
    name: "checkoutSession",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(checkoutSession.pending, (state) => {
                state.loading = "pending";
                state.error = null;
            })
            .addCase(checkoutSession.fulfilled, (state, action) => {
                state.loading = "succeeded";
                state.items = action.payload;
            })
            .addCase(checkoutSession.rejected, (state, action) => {
                state.loading = "failed";
                state.error = (action.payload as string) || "Unexpected error";
            });
    },
});

export default checkoutSessionSlice.reducer;
