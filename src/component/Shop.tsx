import React, { useEffect } from "react";

// Local components
import Categories from "./Categories";

// Redux hooks & store
// import { useAppDispatch, useAppSelector } from "../store/hook";
import { RootState } from "../store";
// import { productUser } from "../store/productSlice";
import { TProduct, useGetProductsQuery } from "../store/UpdataProductSlice";

// -------------------------------
// Product type definition
// -------------------------------
// type TProduct = {
//   id: number;
//   name: string;
//   description: string;
//   original_price: string;
//   final_price: string;
//   discount: number;
//   stock: number;
//   categories: string[];
//   tags: string[];
//   img: string;
//   average_rating: number;
//   img_url: string;
// };

// -------------------------------
// Shop Component
// -------------------------------
const Shop = () => {
  // const dispatch = useAppDispatch();

  // Select product state from Redux
  // const { products, loading, error } = useAppSelector(
  //   (state: RootState) => state.product
  // );
  const { data: products = [], isLoading, refetch } = useGetProductsQuery();
  // Fetch products only if not already loaded
  // useEffect(() => {
  //   if (products.length === 0) {
  //     dispatch(productUser());
  //   }
  // }, [dispatch, products.length]);

  // -------------------------------
  // JSX Layout
  // -------------------------------
  return (
    <div>
      {/* Categories component renders product list */}
      <Categories products={products ?? []} title={"Shop"} />
    </div>
  );
};

export default Shop;
