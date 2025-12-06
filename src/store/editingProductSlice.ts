import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IEditingProduct {
    id?: number;
    name: string;
    description: string;
    original_price: string;
    final_price: string;
    discount: number;
    stock: number;
    img: string;
    imgFile?: File | null;
    categories: string[];
    tags: string[];
}

const initialState: IEditingProduct = {
    name: "",
    description: "",
    original_price: "",
    final_price: "",
    discount: 0,
    stock: 0,
    img: "",
    imgFile: null,
    categories: [],
    tags: [],
};

const editingProductSlice = createSlice({
    name: "editingProduct",
    initialState,
    reducers: {
        setEditingProduct: (state, action: PayloadAction<IEditingProduct>) => {
            return { ...action.payload };
        },
        clearEditingProduct: () => initialState,
    },
});

export const { setEditingProduct, clearEditingProduct } = editingProductSlice.actions;
export default editingProductSlice.reducer;
