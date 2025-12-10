import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState, AppDispatch } from ".";
import { refreshAccessToken } from "./authSlice";

interface orderRecent {
    id:number
    customer:string
    status:string
    total_price:number
}

// { id: 96, customer: 'Fo2sh', status: 'paid', total_price: 3.4 }
interface WishlistState {
    orderRecent: orderRecent[];
    loading: "idle" | "pending" | "succeeded" | "failed";
    error: string | null;
}

const initialState: WishlistState = {
    orderRecent: [],
    loading: "idle",
    error: null,
};
export const GetOrderLatest = createAsyncThunk<
    orderRecent[],
    void,
    { state: RootState; dispatch: AppDispatch }
    >("OrderLatest/GetOrderLatest", async (_, thunkAPI) => {
    try {
        const { auth } = thunkAPI.getState();
        let token = auth.access;

        const fetchWishlist = async (token: string) => {
            const res = await fetch(
                "https://e-commerce-web-production-ead4.up.railway.app/api/dashboard/orders/recent/",
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

        return response;
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});
const OrderLatestSlice = createSlice({
    name: "OrderLatest",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(GetOrderLatest.pending, (state) => {
            state.loading = "pending";
            state.error = null;
        });
        builder.addCase(GetOrderLatest.fulfilled, (state, action) => {
            state.loading = "succeeded";
            state.orderRecent = action.payload;
        });
        builder.addCase(GetOrderLatest.rejected, (state, action) => {
            state.loading = "failed";
            state.error = (action.payload as string) || "Unexpected error";
        });
    },
});

export default OrderLatestSlice.reducer;
