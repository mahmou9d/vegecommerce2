// Local components
import Categories from "./Categories";
import { useGetProductsQuery } from "../store/UpdataProductSlice";

const Shop = () => {
  const { data: products = [], isLoading, refetch } = useGetProductsQuery();
  return (
    <div>
      <Categories products={products ?? []} title={"Shop"} />
    </div>
  );
};

export default Shop;
