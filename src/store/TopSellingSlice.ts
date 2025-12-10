import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState, AppDispatch } from ".";
import { refreshAccessToken } from "./authSlice";

type TProduct = {
id:number
name:string
sales:number
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
export const GetTopSelling = createAsyncThunk<
    TProduct[],
    void,
    { state: RootState; dispatch: AppDispatch }
>("TopSelling/GetTopSelling", async (_, thunkAPI) => {
    try {
        const { auth } = thunkAPI.getState();
        let token = auth.access;

        const fetchWishlist = async (token: string) => {
            const res = await fetch(
                "https://e-commerce-web-production-ead4.up.railway.app/api/charts/products/top-selling/",
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
            console.log(data)
            return data.topSelling;
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
const TopSellingSlice = createSlice({
    name: "TopSelling",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(GetTopSelling.pending, (state) => {
            state.loading = "pending";
            state.error = null;
        });
        builder.addCase(GetTopSelling.fulfilled, (state, action) => {
            state.loading = "succeeded";
            state.items = action.payload || [];
        });
        builder.addCase(GetTopSelling.rejected, (state, action) => {
            state.loading = "failed";
            state.error = (action.payload as string) || "Unexpected error";
        });
    },
});
export default TopSellingSlice.reducer;
