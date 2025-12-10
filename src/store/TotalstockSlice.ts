import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState, AppDispatch } from ".";
import { refreshAccessToken } from "./authSlice";


interface WishlistState {
    total_stock: number;
    loading: "idle" | "pending" | "succeeded" | "failed";
    error: string | null;
}

const initialState: WishlistState = {
    total_stock: 0,
    loading: "idle",
    error: null,
};
export const GetTotalstockSlice = createAsyncThunk<
    number,
    void,
    { state: RootState; dispatch: AppDispatch }
    >("TotalstockSlice/GetTotalstockSlice", async (_, thunkAPI) => {
    try {
        const { auth } = thunkAPI.getState();
        let token = auth.access;

        const fetchWishlist = async (token: string) => {
            const res = await fetch(
                "https://e-commerce-web-production-ead4.up.railway.app/api/dashboard/totalstock/",
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
            console.log(data.total_stock)
            return data.total_stock;
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
const TotalstockSlice = createSlice({
    name: "Totalstock",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(GetTotalstockSlice.pending, (state) => {
            state.loading = "pending";
            state.error = null;
        });
        builder.addCase(GetTotalstockSlice.fulfilled, (state, action) => {
            state.loading = "succeeded";
            state.total_stock = action.payload;
        });
        builder.addCase(GetTotalstockSlice.rejected, (state, action) => {
            state.loading = "failed";
            state.error = (action.payload as string) || "Unexpected error";
        });
    },
});

export default TotalstockSlice.reducer;
