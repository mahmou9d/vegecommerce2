// ============================================
// productsApi.ts - RTK Query API (محدث)
// ============================================
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

const BASE_URL = 'https://e-commerce-web-production-ead4.up.railway.app/api';

// 🔹 Types
export interface TProduct {
    id?: number;
    name: string;
    description: string;
    original_price: string;
    discount: number;
    stock: number;
    categories: string[];
    tags: string[];
    final_price?: string;
    img?: string[] | File[];
    img_url?: string;
    average_rating?: number;
}

export interface TProductInput {
    name: string;
    description: string;
    original_price: string;
    discount: number;
    stock: number;
    categories: string[];
    tags: string[];
    img: File[];
}

interface ProductsCountResponse {
    total_products: number;
}

// 🔹 Base Query مع Token
const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('access');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

// 🔹 Base Query مع Refresh Token
const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        const refreshToken = localStorage.getItem('refresh');

        if (refreshToken) {
            const refreshResult = await baseQuery(
                {
                    url: '/auth/refresh/',
                    method: 'POST',
                    body: { refresh: refreshToken },
                },
                api,
                extraOptions
            );

            if (refreshResult.data) {
                const newToken = (refreshResult.data as any).access;
                localStorage.setItem('access', newToken);
                result = await baseQuery(args, api, extraOptions);
            } else {
                return {
                    error: {
                        status: 401,
                        data: 'Session expired, please login again.',
                    } as FetchBaseQueryError,
                };
            }
        }
    }

    return result;
};

// 🔹 Products API
export const productsApi = createApi({
    reducerPath: 'productsApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Product'],
    endpoints: (builder) => ({
        // ✅ جلب كل المنتجات
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

        // ✅ جلب عدد المنتجات (Dashboard)
        getProductsCount: builder.query<number, void>({
            query: () => '/dashboard/products/',
            transformResponse: (response: ProductsCountResponse) => {
                return response.total_products || 0;
            },
            providesTags: [{ type: 'Product', id: 'LIST' }],
        }),

        // ✅ إضافة منتج جديد
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
                };
            },
            invalidatesTags: [{ type: 'Product', id: 'LIST' }],
        }),

        // ✅ تعديل منتج (PUT - كامل)
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
                };
            },
            invalidatesTags: (result, error, { id }) => [
                { type: 'Product', id },
                { type: 'Product', id: 'LIST' },
            ],
        }),

        // ✅ حذف منتج
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

// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import { AppDispatch, RootState } from ".";
// import { refreshAccessToken } from "./authSlice";
// import { fetchWithRefresh } from "./cartSlice";

// interface IItem {
//     id?: number; // لو عندك id من الـ backend
//     name: string;
//     description: string;
//     original_price: string;
//     discount: number;
//     stock: number;
//     categories: string[];
//     tags: string[];
//     final_price?: string;
//     img: File[] | string[]; // ممكن تكون ملفات أو روابط موجودة
// }

// interface ProductState {
//     items: IItem[];
//     loading: "idle" | "pending" | "succeeded" | "failed";
//     error: string | null;
// }

// const initialState: ProductState = {
//     items: [],
//     loading: "idle",
//     error: null,
// };

// // ===== Async Thunks =====
// export const EditProduct = createAsyncThunk<
//     any,
//     IItem,
//     { state: RootState; dispatch: AppDispatch }
// >(
//     "product/EditProduct",
//     async (payload, thunkAPI) => {
//         try {
//             const state = thunkAPI.getState() as RootState;
//             let token = localStorage.getItem("access");

//             // ----- 1️⃣ جهّز FormData -----
//             const formData = new FormData();
//             formData.append("name", payload.name);
//             formData.append("description", payload.description);
//             formData.append("original_price", payload.original_price);
//             formData.append("discount", String(payload.discount));
//             formData.append("stock", String(payload.stock));
//             // formData.append("final_price", payload.final_price ?? "");

//             // ----- 2️⃣ ابعت categories واحدة واحدة -----
//             payload.categories.forEach((cat) => {
//                 formData.append("categories", cat);
//             });

//             // ----- 3️⃣ ابعت tags واحدة واحدة -----
//             payload.tags.forEach((tag) => {
//                 formData.append("tags", tag);
//             });

//             // ----- 4️⃣ ابعت الصور واحدة واحدة -----
//             payload.img.forEach((file) => {
//                 formData.append("img", file);
//             });

//             // ----- 5️⃣ نفّذ الطلب -----
//             const url = `https://e-commerce-web-production-ead4.up.railway.app/api/dashboard/products/${payload.id}/`;

//             let res = await fetch(url, {
//                 method: "PUT",
//                 headers: {
//                     ...(token && { Authorization: `Bearer ${token}` }),
//                 },
//                 body: formData, // FormData هنا مهم
//             });

//             // ----- 6️⃣ تحقق لو محتاج Refresh Token -----
//             if (res.status === 401) {
//                 try {
//                     const refreshRes = await thunkAPI.dispatch(refreshAccessToken()).unwrap();
//                     token = refreshRes.access;

//                     res = await fetch(url, {
//                         method: "PATCH",
//                         headers: {
//                             ...(token && { Authorization: `Bearer ${token}` }),
//                         },
//                         body: formData,
//                     });
//                 } catch {
//                     return thunkAPI.rejectWithValue("Session expired, please login again.");
//                 }
//             }

//             const data = await res.json();
//             return data;
//         } catch (err: any) {
//             return thunkAPI.rejectWithValue(err.message);
//         }
//     }
// );


// export const DeleteProduct = createAsyncThunk<
//     number,
//     number,
//     { state: RootState; dispatch: AppDispatch }
// >("product/DeleteProduct", async (id, thunkAPI) => {
//     try {
//         await fetchWithRefresh(
//             `https://e-commerce-web-production-ead4.up.railway.app/api/dashboard/products/${id}/`,
//             { method: "DELETE" },
//             thunkAPI
//         );
//         return id; // نرجع id عشان نحذفه من الـ state
//     } catch (err: any) {
//         return thunkAPI.rejectWithValue(err.message);
//     }
// });

// // ===== Slice =====
// const productSlice = createSlice({
//     name: "product",
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         // ===== Edit Product =====
//         builder.addCase(EditProduct.pending, (state) => {
//             state.loading = "pending";
//             state.error = null;
//         });
//         builder.addCase(
//             EditProduct.fulfilled,
//             (state, action: PayloadAction<IItem>) => {
//                 state.loading = "succeeded";
//                 // تحديث العنصر الموجود في items
//                 const index = state.items.findIndex((i) => i.id === action.payload.id);
//                 if (index !== -1) {
//                     state.items[index] = action.payload;
//                 } else {
//                     state.items.push(action.payload); // لو مش موجود ضيفه
//                 }
//             }
//         );
//         builder.addCase(EditProduct.rejected, (state, action) => {
//             state.loading = "failed";
//             state.error = action.payload as string;
//         });

//         // ===== Delete Product =====
//         builder.addCase(DeleteProduct.pending, (state) => {
//             state.loading = "pending";
//             state.error = null;
//         });
//         builder.addCase(
//             DeleteProduct.fulfilled,
//             (state, action: PayloadAction<number>) => {
//                 state.loading = "succeeded";
//                 // حذف المنتج من الـ array
//                 state.items = state.items.filter((item) => item.id !== action.payload);
//             }
//         );
//         builder.addCase(DeleteProduct.rejected, (state, action) => {
//             state.loading = "failed";
//             state.error = action.payload as string;
//         });
//     },
// });
// export default productSlice.reducer;
