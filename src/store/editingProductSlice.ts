// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface IEditingProduct {
//     name: string;
//     description: string;
//     original_price: string;
//     discount: number;
//     stock: number;
//     categories: string[];
//     tags: string[];
//     img: File[];
// }

// const initialState: IEditingProduct = {
//     name: "",
//     description: "",
//     original_price: "",
//     discount: 0,
//     stock: 0,
//     categories: [],
//     tags: [],
//     img: [],
// };

// const editingProductSlice = createSlice({
//     name: "editingProduct",
//     initialState,
//     reducers: {
//         setEditingProduct: (state, action: PayloadAction<IEditingProduct>) => {
//             return { ...action.payload };
//         },
//         clearEditingProduct: () => initialState,
//     },
// });

// export const { setEditingProduct, clearEditingProduct } = editingProductSlice.actions;
// export default editingProductSlice.reducer;
