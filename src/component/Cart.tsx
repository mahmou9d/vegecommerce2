// Icons
import { IoIosArrowForward } from "react-icons/io";
import { TiHome } from "react-icons/ti";
import { FaArrowRight, FaCartArrowDown } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { LiaCartPlusSolid } from "react-icons/lia";

// UI components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";

// Redux actions
import {
  useEditCartMutation,
  useGetCartQuery,
  useRemoveFromCartMutation,
} from "../store/cartSlice";

// Components
import Product from "./Product";

// Routing
import { Link, useNavigate } from "react-router-dom";

// Custom hook for toast notifications
import { useToast } from "../hooks/use-toast";

// Styles
import "./Header.css";
import { useGetProductsQuery } from "../store/UpdataProductSlice";

// ==================== Component ====================
const Cart = () => {
  const { toast } = useToast();
  const nav = useNavigate();
const [editCart] = useEditCartMutation();
  const { data: products = [], isLoading, refetch } = useGetProductsQuery();
   const { data: items } = useGetCartQuery();
   const [removeFromCart] = useRemoveFromCartMutation();

const updateQuantity = (
  product_id: number,
  type: "inc" | "dec",
  currentQty: number
) => {
  const newQty =
    type === "inc" ? currentQty + 1 : Math.max(1, currentQty - 1);

  editCart({ product_id, quantity: newQty })
    .unwrap()
    .then(() => {
      toast({
        title: "Cart updated ✅",
        description: `Quantity changed to ${newQty}.`,
      });
    })
    .catch(() => {
      toast({
        title: "Update failed ❌",
        description: "Restored previous quantity.",
      });
    });
};

const removeItem = (product_id: number) => {
  removeFromCart({ product_id })
    .unwrap()
    .then(() => {
      toast({
        title: "Removed from cart 🗑️",
        description: "The item was successfully removed.",
      });
    })
    .catch(() => {
      toast({
        title: "Remove failed ❌",
        description: "Could not remove the item, please try again.",
      });
    });
};
  // ==================== Calculate Totals ====================
  const limit = 1000; // Free shipping limit
  const subtotal = Array.isArray(items?.items)
    ? items?.items.reduce((sum, item) => sum + Number(item.subtotal), 0)
    : 0;
   const total =
     items?.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) ??
     0;
  // Progress bar value for free shipping
  const progress = Math.min((subtotal / limit) * 100, 100);

  // ==================== Render ====================
  return (
    <div>
      {/* ==================== Breadcrumb Section ==================== */}
      <div className="bg-[#f9f9f9] px-5 pt-20 pb-10">
        <div className="container mx-auto flex justify-between">
          <h1 className="text-[24px] text-[#122d40] font-bold">Cart</h1>
          <div className="text-[18px] flex items-center gap-3 font-medium">
            <TiHome />
            <IoIosArrowForward />
            Cart
          </div>
        </div>
      </div>

      {/* ==================== If items exist in cart ==================== */}
      {Array.isArray(items?.items) && items?.items.length !== 0 ? (
        <div>
          {/* ==================== Checkout Steps ==================== */}
          <div className="py-24 container hidden xl:flex mx-auto  justify-center gap-x-16">
            <Link
              to={"/cart"}
              className="flex items-center justify-between cursor-pointer"
            >
              <h1 className="w-8 h-8 leading-2 p-[5px] text-center mr-4 text-[18px] rounded-full bg-[#01e281]">
                1
              </h1>
              <h1 className="text-[25px] font-medium">Shopping cart</h1>
            </Link>

            <h4 className="flex items-center opacity-50">
              <FaArrowRight className="text-[24px]" />
            </h4>

            <Link
              to={"/checkout"}
              className="flex items-center justify-center opacity-50 cursor-pointer"
            >
              <h1 className="w-8 h-8 leading-2 p-[5px] text-center mr-4 text-[18px] rounded-full bg-[#01e281]">
                2
              </h1>
              <h1 className="text-[25px] font-medium">Checkout details</h1>
            </Link>

            <h4 className="flex items-center opacity-50">
              <FaArrowRight className="text-[24px]" />
            </h4>

            <div className="flex items-center justify-center opacity-50">
              <h1 className="w-8 h-8 leading-2 p-[5px] text-center mr-4 text-[18px] rounded-full bg-[#01e281]">
                3
              </h1>
              <h1 className="text-[25px] font-medium">Order complete</h1>
            </div>
          </div>

          {/* ==================== Table Section ==================== */}
          <div className="p-6 container mx-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#a7a7a71a] text-black h-20 text-[18px] font-extrabold">
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Subtotal</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {/* Loop through cart items */}
                {items?.items.map((item) => (
                  <TableRow key={item.product_id}>
                    {/* Remove Button */}
                    <TableCell>
                      <Button
                        variant="ghost"
                        onClick={() => removeItem(item.product_id)}
                        className="hover-effect text-red-500"
                      >
                        <IoClose
                          style={{
                            width: "2rem",
                            height: "2rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "0.5rem",
                            cursor: "pointer",
                          }}
                        />
                      </Button>
                    </TableCell>

                    {/* Product Image */}
                    <TableCell className="cursor-pointer gap-3 min-w-[150px]">
                      <img
                        src={item.img_url}
                        alt={item.product_name}
                        className="rounded-md w-24 h-16"
                        onClick={() => {
                          nav(`/singleProduct/${item.product_id}`);
                          window.scrollTo(0, 0);
                        }}
                        loading="lazy"
                      />
                    </TableCell>

                    {/* Product Name */}
                    <TableCell
                      className="flex flex-col p-7 gap-3 cursor-pointer"
                      onClick={() => {
                        nav(`/singleProduct/${item.product_id}`);
                        window.scrollTo(0, 0);
                      }}
                    >
                      <p className="font-bold text-[18px] hover:text-[#01e281] transition-all duration-150">
                        {item.product_name}
                      </p>
                      <p className="text-sm text-gray-500">SKU: SKU_1192</p>
                    </TableCell>

                    {/* Price */}
                    <TableCell className="text-[16px]">${item.price}</TableCell>

                    {/* Quantity Controls */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {/* Decrease Quantity */}
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(
                              item.product_id,
                              "dec",
                              item.quantity
                            )
                          }
                          className="bg-[#f9f9f9] text-[#01e281] transition duration-200 delay-100 hover:text-[#122d40] hover:bg-[#01e281]  rounded-full text-[18px] w-12 h-12"
                        >
                          −
                        </Button>

                        {/* Quantity Display */}
                        <span className="px-3 w-20 border border-[#a7a7a74d] h-10 rounded-full flex items-center justify-center text-[16px]">
                          {item.quantity}
                        </span>

                        {/* Increase Quantity */}
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(
                              item.product_id,
                              "inc",
                              item.quantity
                            )
                          }
                          className="bg-[#f9f9f9] text-[#01e281] transition duration-200 delay-100 hover:text-[#122d40] hover:bg-[#01e281] rounded-full text-[18px] w-12 h-12"
                        >
                          +
                        </Button>
                      </div>
                    </TableCell>

                    {/* Subtotal */}
                    <TableCell className="text-[16px]">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}

                {/* Continue Shopping Button */}
                <TableRow>
                  <TableCell colSpan={6} className="text-left">
                    <div className="flex justify-end">
                      <Button
                        onClick={() => {
                          nav("/shop");
                          window.scrollTo(0, 0);
                        }}
                        className="flex text-[18px] items-center gap-2 px-6 bg-[#01e281] text-[#122d40] font-bold rounded-full  h-12 justify-center m-2 hover:bg-[#122d40] hover:text-[#01e281] transition duration-200 delay-100"
                      >
                        Continue shopping
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* ==================== Cart Totals Section ==================== */}
          <div className="bg-[#f1f2f6] container mx-auto w-[90%] xl:w-[40%] p-8 rounded-[50px] flex flex-col justify-center  gap-5 pb-14 ">
            <h2 className="bg-[#01e281] text-[18px] relative flex-col items-center justify-center flex text-[#122d40] h-14 font-bold rounded-full px-6  w-full">
              Cart totals
              <span className="block h-[3px] absolute bottom-0 w-6 bg-black mt-1 rounded"></span>
            </h2>

            <div>
              {/* Totals Table */}
              <div className="border border-[#a7a7a733] ">
                {/* Header Row */}
                <div className="flex   border-b border-[#a7a7a733]  bg-[#a7a7a71a]">
                  <h1 className="w-3/4 border-r border-[#a7a7a733]  h-full">
                    <h2 className="p-[10px] xl:p-6 text-[16px] font-bold">
                      Product
                    </h2>
                  </h1>
                  <h2 className="w-[28%] text-[16px] font-bold p-[10px] xl:p-6">
                    Subtotal
                  </h2>
                </div>

                {/* Loop through items */}
                {(items?.items ?? []).map((item, i) => {
                  return (
                    <div
                      key={i}
                      className="flex   border-b border-[#a7a7a733]  bg-[#a7a7a71a]"
                    >
                      <h1 className="w-3/4 border-r border-[#a7a7a733]  h-full">
                        <h2 className="p-6 text-[16px] font-normal">
                          {item.product_name}
                          <span className=" text-[16px] font-bold">
                            × {item.quantity}
                          </span>
                        </h2>
                      </h1>
                      <h2 className="w-[28%] text-[16px] font-normal p-6">
                        ${item.price}
                      </h2>
                    </div>
                  );
                })}
                <div className="flex  border-b border-[#a7a7a733] ">
                  <h1 className="w-3/4 border-r border-[#a7a7a733]  h-full">
                    <h2 className="p-6 text-[16px] font-bold">Subtotal</h2>
                  </h1>
                  <h2 className="w-[28%] text-[16px] font-bold p-6">
                    ${total.toFixed(2)}
                  </h2>
                </div>

                {/* Total */}
                <div className="flex text-[16px] font-bold">
                  <h1 className="w-3/4 border-r border-[#a7a7a733]  h-full">
                    <h2 className="p-6 text-[16px] font-bold">Total</h2>
                  </h1>
                  <h2 className="w-[28%] p-6">${total.toFixed(2)}</h2>
                </div>
              </div>

              {/* Free Shipping Progress */}
              <div className=" pb-5 border-b border-dashed border-[#cdc7c7]">
                <div className="flex items-center pb-3 px-1 text-[13px] xl:text-[18px] mt-4">
                  <FaCartArrowDown />
                  <p className="flex items-center pl-2">
                    Add <p className="font-bold px-2">${subtotal.toFixed(2)}</p>{" "}
                    more to get free shipping!
                  </p>
                </div>
                <Progress value={progress} className="h-4 text-[#01e281]" />
              </div>

              {/* Checkout Button */}
              <div className="flex justify-center pt-5">
                <Button
                  onClick={() => {
                    nav("/checkout");
                    window.scrollTo(0, 0);
                  }}
                  className="flex text-[18px] items-center gap-2 px-6 bg-[#01e281] text-[#122d40] font-bold rounded-full  h-12 justify-center m-2 hover:bg-[#122d40] hover:text-[#01e281] transition duration-200 delay-100"
                >
                  Process to Checkout
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // ==================== Empty Cart Section ====================
        <div className=" h-48 p-5 container mx-auto mb-[50rem] xl:mb-[70rem]">
          <div className=" flex flex-col items-center justify-center rounded-2xl">
            <LiaCartPlusSolid className="text-[240px] opacity-30" />
            <h1 className="text-[36px] font-bold text-center">
              Looks like your cart is empty!
            </h1>
            <h1 className="text-[20px] opacity-50">
              Time to start your shopping
            </h1>
            <div className="hidden xl:flex flex-col items-center justify-center rounded-2xl">
              {/* Product Suggestions */}
              <div className="bg-[#f1f2f6] container mx-auto mt-10  p-8 rounded-[50px] flex flex-col justify-center  gap-5  ">
                <h2 className="bg-[#01e281] text-[18px] relative flex-col items-center justify-center flex text-[#122d40] h-14 font-bold rounded-full px-6  w-full">
                  You may be interested in ...
                  <span className="block h-[3px] absolute bottom-0 w-6 bg-black mt-1 rounded"></span>
                </h2>

                <div className="flex justify-between my-10">
                  {products.slice(0, 4).map((product, i) => {
                    return <Product key={i} item={product} />;
                  })}
                </div>
              </div>
            </div>
            {/* Return to Shop Button */}
            <Button
              onClick={() => {
                nav("/checkout");
                window.scrollTo(0, 0);
              }}
              className="flex text-[18px] items-center gap-2 px-8 py-8 mt-8 bg-[#01e281] text-[#122d40] font-bold rounded-full  h-12 justify-center  hover:bg-[#122d40] hover:text-[#01e281] transition duration-200 delay-100"
            >
              Return to shop
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== Export Component ====================
export default Cart;
