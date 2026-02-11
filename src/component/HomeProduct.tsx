import { Button } from "../components/ui/button";
import Product from "./Product";
import { useNavigate } from "react-router";
import { useGetProductsQuery } from "../store/UpdataProductSlice";

// Component for displaying Home Products
const HomeProduct = () => {
  const nav = useNavigate();
  const { data: products = [], isLoading, refetch } = useGetProductsQuery();


  return (
    <div className="container mx-auto mt-40">
      {/* Section Header */}
      <div className="flex items-center flex-col xl:flex-row justify-between px-3">
        <h1 className="text-[28px] xl:text-[36px] font-bold xl:font-bold flex justify-center">
          Best Seller
          <span
            className="text-[#01e281] ml-2 relative inline-block  
              after:content-[''] after:absolute after:bottom-1 after:left-0
              after:w-40 after:h-[30%]
              after:bg-[#01e281] after:opacity-20 after:rounded-md after:z-[1]"
          >
            Products
          </span>
        </h1>

        {/* Button to navigate to shop page */}
        <Button
          onClick={() => {
            nav("/shop");
            window.scrollTo(0, 0);
          }}
          className="bg-[#01e281] my-8 text-[#122d40] font-extrabold 
            rounded-full px-[14px] py-7 text-[16px] tracking-[0.5px] 
            hover:bg-[#122d40] hover:text-[#01e281]"
        >
          View all Products
        </Button>
      </div>

      {/* Product List */}
      <div className="flex flex-wrap p-[10px] justify-between gap-y-12">
        {products.map((product, i) => (
          <Product key={i} item={product} />
        ))}
      </div>
    </div>
  );
};

export default HomeProduct;
