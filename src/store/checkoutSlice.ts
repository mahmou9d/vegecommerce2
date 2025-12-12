// ============================================
// paymentApi.ts - RTK Query
// ============================================
import { createApi } from '@reduxjs/toolkit/query/react';
import { CheckoutSessionResponse } from '@/type/type';
import { baseQueryWithReauth } from './baseQuery';


// 🔹 Payment API
export const paymentApi = createApi({
    reducerPath: 'paymentApi',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({

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