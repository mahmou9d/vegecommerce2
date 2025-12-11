// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { RootState, AppDispatch } from ".";
// import { refreshAccessToken } from "./authSlice";


// interface WishlistState {
//     total_sales: number;
//     loading: "idle" | "pending" | "succeeded" | "failed";
//     error: string | null;
// }

// const initialState: WishlistState = {
//     total_sales: 0,
//     loading: "idle",
//     error: null,
// };
// export const GetTotalsales = createAsyncThunk<
//     number,
//     void,
//     { state: RootState; dispatch: AppDispatch }
// >("Totalsales/GetTotalsales", async (_, thunkAPI) => {
//     try {
//         const { auth } = thunkAPI.getState();
//         let token = localStorage.getItem("access"); // ✅ معاك access

//         const fetchWishlist = async (token: string) => {
//             const res = await fetch(
//                 "https://e-commerce-web-production-ead4.up.railway.app/api/dashboard/totalsales/",
//                 {
//                     method: "GET",
//                     headers: {
//                         "Content-Type": "application/json",
//                         Authorization: token ? `Bearer ${token}` : "",
//                     },
//                 }
//             );

//             if (res.status === 401) return "expired";
//             if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//             const data = await res.json();
//             console.log(data.total_sales)
//             return data.total_sales;
//         };
//         let response: any = await fetchWishlist(token);
//         if (response === "expired") {
//             try {
//                 const refreshRes = await thunkAPI
//                     .dispatch(refreshAccessToken())
//                     .unwrap();
//                 token = refreshRes.access;
//                 response = await fetchWishlist(token);
//                 if (response === "expired") {
//                     return thunkAPI.rejectWithValue(
//                         "Session expired, please login again."
//                     );
//                 }
//             } catch {
//                 return thunkAPI.rejectWithValue("Session expired, please login again.");
//             }
//         }

//         return response;
//     } catch (error: any) {
//         return thunkAPI.rejectWithValue(error.message);
//     }
// });
// const TotalsalesSlice = createSlice({
//     name: "Totalsales",
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder.addCase(GetTotalsales.pending, (state) => {
//             state.loading = "pending";
//             state.error = null;
//         });
//         builder.addCase(GetTotalsales.fulfilled, (state, action) => {
//             state.loading = "succeeded";
//             console.log("TOTAL SALES PAYLOAD:", action.payload);
//             state.total_sales = action.payload;
//         });
//         builder.addCase(GetTotalsales.rejected, (state, action) => {
//             console.log("REJECTED! → ", action.payload);
//             state.loading = "failed";
//             state.error = (action.payload as string) || "Unexpected error";
//         });
//     },
// });

// export default TotalsalesSlice.reducer;
