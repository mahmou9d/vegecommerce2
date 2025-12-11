// ============================================
// paymentApi.ts - RTK Query
// ============================================
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

const BASE_URL = 'https://e-commerce-web-production-ead4.up.railway.app/api';

// 🔹 Types
interface CheckoutSessionRequest {
    order_id: number;
}

interface CheckoutSessionResponse {
    url?: string;
    session_id?: string;
    // عدّل حسب الـ response الفعلي من الـ API
}

// 🔹 Base Query مع Token
const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('access');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        headers.set('Content-Type', 'application/json');
        return headers;
    },
});

// 🔹 Base Query مع Refresh Token
const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError> = async (args, api, extraOptions) => {
        let result = await baseQuery(args, api, extraOptions);

        if (result.error && result.error.status === 401) {
            const refreshToken = localStorage.getItem('refresh');

            if (refreshToken) {
                const refreshResult = await baseQuery(
                    {
                        url: '/auth/token/refresh/',
                        method: 'POST',
                        body: { refresh: refreshToken },
                    },
                    api,
                    extraOptions
                );

                if (refreshResult.data) {
                    const newToken = (refreshResult.data as any).access;
                    localStorage.setItem('access', newToken);
                    if ((refreshResult.data as any).refresh) {
                        localStorage.setItem('refresh', (refreshResult.data as any).refresh);
                    }
                    result = await baseQuery(args, api, extraOptions);
                }
            }
        }

        return result;
    };

// 🔹 Payment API
export const paymentApi = createApi({
    reducerPath: 'paymentApi',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({

        // ✅ إنشاء جلسة الدفع
        createCheckoutSession: builder.mutation<CheckoutSessionResponse, number>({
            query: (order_id) => ({
                url: '/payment/create-checkout-session/',
                method: 'POST',
                body: { order_id },
            }),
        }),
    }),
});

// 🔹 Export hooks
export const { useCreateCheckoutSessionMutation } = paymentApi;
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { AppDispatch, RootState } from ".";
// import { fetchWithRefresh } from "./cartSlice";


// interface checkoutSession {
//     items: number;
//     loading: "idle" | "pending" | "succeeded" | "failed";
//     error: string | null;
// }

// const initialState: checkoutSession = {
//     items: 0,
//     loading: "idle",
//     error: null,
// };

// export const checkoutSession = createAsyncThunk<
//     any, // بيرجع الـ product_id
//     number, // payload = product_id
//     { state: RootState; dispatch: AppDispatch }
// >("checkout/checkoutSession", async (order_id, thunkAPI) => {
//     try {
//         const data = await fetchWithRefresh(
//             "https://e-commerce-web-production-ead4.up.railway.app/api/payment/create-checkout-session/",
//             {
//                 method: "POST",
//                 body: JSON.stringify({ order_id }),
//             },
//             thunkAPI
//         );

//         return data; // بيرجع الـ product_id فقط
//     } catch (err: any) {
//         return thunkAPI.rejectWithValue(err.message);
//     }
// });

// const checkoutSessionSlice = createSlice({
//     name: "checkoutSession",
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(checkoutSession.pending, (state) => {
//                 state.loading = "pending";
//                 state.error = null;
//             })
//             .addCase(checkoutSession.fulfilled, (state, action) => {
//                 state.loading = "succeeded";
//                 state.items = action.payload;
//             })
//             .addCase(checkoutSession.rejected, (state, action) => {
//                 state.loading = "failed";
//                 state.error = (action.payload as string) || "Unexpected error";
//             });
//     },
// });

// export default checkoutSessionSlice.reducer;
