import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from ".";
import { refreshAccessToken } from "./authSlice";
import { fetchWithRefresh } from "./cartSlice";

interface IItem {
    id?: number; // لو عندك id من الـ backend
    name: string;
    description: string;
    original_price: string;
    discount: number;
    stock: number;
    categories: string[];
    tags: string[];
    final_price?: string;
    img: File[] | string[]; // ممكن تكون ملفات أو روابط موجودة
}

interface ProductState {
    items: IItem[];
    loading: "idle" | "pending" | "succeeded" | "failed";
    error: string | null;
}

const initialState: ProductState = {
    items: [],
    loading: "idle",
    error: null,
};

// ===== Async Thunks =====
export const EditProduct = createAsyncThunk<
    any,
    IItem,
    { state: RootState; dispatch: AppDispatch }
>(
    "product/EditProduct",
    async (payload, thunkAPI) => {
        try {
            const state = thunkAPI.getState() as RootState;
            let token = localStorage.getItem("access");

            // ----- 1️⃣ جهّز FormData -----
            const formData = new FormData();
            formData.append("name", payload.name);
            formData.append("description", payload.description);
            formData.append("original_price", payload.original_price);
            formData.append("discount", String(payload.discount));
            formData.append("stock", String(payload.stock));
            // formData.append("final_price", payload.final_price ?? "");

            // ----- 2️⃣ ابعت categories واحدة واحدة -----
            payload.categories.forEach((cat) => {
                formData.append("categories", cat);
            });

            // ----- 3️⃣ ابعت tags واحدة واحدة -----
            payload.tags.forEach((tag) => {
                formData.append("tags", tag);
            });

            // ----- 4️⃣ ابعت الصور واحدة واحدة -----
            payload.img.forEach((file) => {
                formData.append("img", file);
            });

            // ----- 5️⃣ نفّذ الطلب -----
            const url = `https://e-commerce-web-production-ead4.up.railway.app/api/dashboard/products/${payload.id}/`;

            let res = await fetch(url, {
                method: "PUT",
                headers: {
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: formData, // FormData هنا مهم
            });

            // ----- 6️⃣ تحقق لو محتاج Refresh Token -----
            if (res.status === 401) {
                try {
                    const refreshRes = await thunkAPI.dispatch(refreshAccessToken()).unwrap();
                    token = refreshRes.access;

                    res = await fetch(url, {
                        method: "PATCH",
                        headers: {
                            ...(token && { Authorization: `Bearer ${token}` }),
                        },
                        body: formData,
                    });
                } catch {
                    return thunkAPI.rejectWithValue("Session expired, please login again.");
                }
            }

            const data = await res.json();
            return data;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);


export const DeleteProduct = createAsyncThunk<
    number,
    number,
    { state: RootState; dispatch: AppDispatch }
>("product/DeleteProduct", async (id, thunkAPI) => {
    try {
        await fetchWithRefresh(
            `https://e-commerce-web-production-ead4.up.railway.app/api/dashboard/products/${id}/`,
            { method: "DELETE" },
            thunkAPI
        );
        return id; // نرجع id عشان نحذفه من الـ state
    } catch (err: any) {
        return thunkAPI.rejectWithValue(err.message);
    }
});

// ===== Slice =====
const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        clearProducts: (state) => {
            state.items = [];
            state.error = null;
            state.loading = "idle";
        },
    },
    extraReducers: (builder) => {
        // ===== Edit Product =====
        builder.addCase(EditProduct.pending, (state) => {
            state.loading = "pending";
            state.error = null;
        });
        builder.addCase(
            EditProduct.fulfilled,
            (state, action: PayloadAction<IItem>) => {
                state.loading = "succeeded";
                // تحديث العنصر الموجود في items
                const index = state.items.findIndex((i) => i.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                } else {
                    state.items.push(action.payload); // لو مش موجود ضيفه
                }
            }
        );
        builder.addCase(EditProduct.rejected, (state, action) => {
            state.loading = "failed";
            state.error = action.payload as string;
        });

        // ===== Delete Product =====
        builder.addCase(DeleteProduct.pending, (state) => {
            state.loading = "pending";
            state.error = null;
        });
        builder.addCase(
            DeleteProduct.fulfilled,
            (state, action: PayloadAction<number>) => {
                state.loading = "succeeded";
                // حذف المنتج من الـ array
                state.items = state.items.filter((item) => item.id !== action.payload);
            }
        );
        builder.addCase(DeleteProduct.rejected, (state, action) => {
            state.loading = "failed";
            state.error = action.payload as string;
        });
    },
});

export const { clearProducts } = productSlice.actions;
export default productSlice.reducer;
