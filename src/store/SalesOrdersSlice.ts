// ============================================
// dashboardApi.ts - RTK Query (كامل)
// ============================================
import { createApi } from '@reduxjs/toolkit/query/react';
import { OrderRecent, OrderRecentResponse, OrdersCountResponse, UsersCountResponse, TotalSalesResponse, TopSellingProduct, TopSellingResponse, SalesOrder, Counted } from '../type/type';
import { baseQueryWithReauth } from './baseQuery';


// 🔹 Dashboard API
export const dashboardApi = createApi({
    reducerPath: 'dashboardApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Orders', 'Users', 'Sales', 'Products'],
    endpoints: (builder) => ({

        getRecentOrders: builder.query<OrderRecent[], void>({
            query: () => '/dashboard/orders/recent/',
            transformResponse: (response: OrderRecentResponse) => {
                return response.orders || [];
            },
            providesTags: ['Orders'],
        }),

        getOrdersCount: builder.query<Counted, void>({
            query: () => '/dashboard/orders/',
            transformResponse: (response: OrdersCountResponse) => {
                return response || 0;
            },
            providesTags: ['Orders'],
        }),

        getUsersCount: builder.query<number, void>({
            query: () => '/dashboard/users/',
            transformResponse: (response: UsersCountResponse) => {
                return response.users || 0;
            },
            providesTags: ['Users'],
        }),

        getTotalSales: builder.query<number, void>({
            query: () => '/dashboard/totalsales/',
            transformResponse: (response: TotalSalesResponse) => {
                return response.total_sales || 0;
            },
            providesTags: ['Sales'],
        }),

        getTopSelling: builder.query<TopSellingProduct[], void>({
            query: () => '/charts/products/top-selling/',
            transformResponse: (response: TopSellingResponse) => {
                return response.topSelling || [];
            },
            providesTags: ['Products'],
        }),

        getSalesOrders: builder.query<SalesOrder[], void>({
            query: () => '/charts/sales-orders/',
            providesTags: ['Sales', 'Orders'],
        }),
    }),
});

// 🔹 Export hooks
export const {
    useGetRecentOrdersQuery,
    useGetOrdersCountQuery,
    useGetUsersCountQuery,
    useGetTotalSalesQuery,
    useGetTopSellingQuery,
    useGetSalesOrdersQuery,
} = dashboardApi;

