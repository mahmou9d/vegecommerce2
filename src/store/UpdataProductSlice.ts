// ============================================
// productsApi.ts - RTK Query API (محدث)
// ============================================
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';
import { ProductsCountResponse, TProduct, TProductInput } from '../type/type';


// 🔹 Products API
export const productsApi = createApi({
    reducerPath: 'productsApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Product'],
    endpoints: (builder) => ({
        getProducts: builder.query<TProduct[], void>({
            query: () => '/products/',
            transformResponse: (response: { products: TProduct[]; query: number }) => {
                return response.products || [];
            },
            providesTags: (result) =>
                result?.length
                    ? [
                        ...result.map(({ id }) => ({ type: 'Product' as const, id })),
                        { type: 'Product', id: 'LIST' },
                    ]
                    : [{ type: 'Product', id: 'LIST' }],
        }),

        getProductsCount: builder.query<number, void>({
            query: () => '/dashboard/products/',
            transformResponse: (response: ProductsCountResponse) => {
                return response.total_products || 0;
            },
            providesTags: [{ type: 'Product', id: 'LIST' }],
        }),

        addProduct: builder.mutation<TProduct, TProductInput>({
            query: (product) => {
                const formData = new FormData();

                formData.append('name', product.name);
                formData.append('description', product.description);
                formData.append('original_price', product.original_price);
                formData.append('discount', String(product.discount));
                formData.append('stock', String(product.stock));

                product.categories.forEach((cat) => {
                    formData.append('categories', cat);
                });

                product.tags.forEach((tag) => {
                    formData.append('tags', tag);
                });

                product.img.forEach((imageFile) => {
                    formData.append('img', imageFile);
                });

                return {
                    url: '/dashboard/products/add/',
                    method: 'POST',
                    body: formData,
                    formData: true,
                };
            },
            invalidatesTags: [{ type: 'Product', id: 'LIST' }],
        }),

        updateProduct: builder.mutation<TProduct, { id: number; data: TProductInput }>({
            query: ({ id, data }) => {
                const formData = new FormData();

                formData.append('name', data.name);
                formData.append('description', data.description);
                formData.append('original_price', data.original_price);
                formData.append('discount', String(data.discount));
                formData.append('stock', String(data.stock));

                data.categories.forEach((cat) => {
                    formData.append('categories', cat);
                });

                data.tags.forEach((tag) => {
                    formData.append('tags', tag);
                });

                if (data.img && data.img.length > 0) {
                    data.img.forEach((imageFile) => {
                        formData.append('img', imageFile);
                    });
                }

                return {
                    url: `/dashboard/products/${id}/`,
                    method: 'PUT',
                    body: formData,
                    formData: true,
                };
            },
            invalidatesTags: (result, error, { id }) => [
                { type: 'Product', id },
                { type: 'Product', id: 'LIST' },
            ],
        }),

        deleteProduct: builder.mutation<void, number>({
            query: (id) => ({
                url: `/dashboard/products/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Product', id },
                { type: 'Product', id: 'LIST' },
            ],
        }),
    }),
});

// 🔹 Export hooks
export const {
    useGetProductsQuery,
    useGetProductsCountQuery,
    useAddProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = productsApi;
