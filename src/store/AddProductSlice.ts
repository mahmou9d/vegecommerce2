import { category } from './../component/Hero';

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from ".";
import { refreshAccessToken } from "./authSlice";

interface TReview {
    name: string;
    description: string;
    original_price: string;
    discount: number;
    stock: number;
    categories: string[];
    tags: string[];
    final_price?: string;
    img: File[];
}

interface ReviewState {
    items: TReview[];
    loading: "idle" | "pending" | "succeeded" | "failed";
    error: string | null;
}

const initialState: ReviewState = {
    items: [],
    loading: "idle",
    error: null,
};

export const AddProduct = createAsyncThunk(
    "Product/AddProduct",
    async (payload: TReview, { rejectWithValue, getState, dispatch }) => {
        try {
            const state = getState() as RootState;
            let token = localStorage.getItem("access");

            // 🟢 1) جهّز FormData
            const formData = new FormData();

            formData.append("name", payload.name);
            formData.append("description", payload.description);
            formData.append("original_price", payload.original_price);
            formData.append("discount", String(payload.discount));
            formData.append("stock", String(payload.stock));
            // formData.append("final_price", payload.final_price ?? "");

            // 🟢 2) ابعت categories واحدة واحدة
            payload.categories.forEach((cat) => {
                formData.append("categories", cat);
            });

            // 🟢 3) ابعت tags واحدة واحدة
            payload.tags.forEach((tag) => {
                formData.append("tags", tag);
            });

            // 🟢 4) ابعت الصور واحدة واحدة
            payload.img.forEach((imageFile) => {
                formData.append("img", imageFile);
            });

            // 🟢 5) Send FormData (ماتحطّش Content-Type)
            let res = await fetch(
                "https://e-commerce-web-production-ead4.up.railway.app/api/dashboard/products/add/",
                {
                    method: "POST",
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` }),
                    },
                    body: formData,
                }
            );

            // 🟡 Refresh token logic (نفس اللي عندك)
            if (res.status === 401) {
                try {
                    const refreshRes = await dispatch(refreshAccessToken()).unwrap();
                    token = refreshRes.access;

                    res = await fetch(
                        "https://e-commerce-web-production-ead4.up.railway.app/api/dashboard/product/add/",
                        {
                            method: "POST",
                            headers: {
                                ...(token && { Authorization: `Bearer ${token}` }),
                            },
                            body: formData,
                        }
                    );
                } catch {
                    return rejectWithValue("Session expired, please login again.");
                }
            }

            const data = await res.json();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const AddProductSlice = createSlice({
    name: "AddProduct",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(AddProduct.pending, (state) => {
            state.loading = "pending";
            state.error = null;
        });
        builder.addCase(AddProduct.fulfilled, (state, action) => {
            state.loading = "succeeded";
            state.items.push(action.payload); 
        });
        builder.addCase(AddProduct.rejected, (state, action) => {
            console.log("Checkout fulfilled payload:", action.payload);
            state.loading = "failed";
            state.error = (action.payload as string) || "Unexpected error";
        });
    },
});

export default AddProductSlice.reducer;
