import { Rating, RatingButton } from "../components/ui/shadcn-io/rating";
import { IoIosArrowForward } from "react-icons/io";
import { RiShoppingCartLine } from "react-icons/ri";
import { TiHome } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import { RootState } from "../store";
// import { useAppDispatch, useAppSelector } from "../store/hook";
import {
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "../store/wishlistSlice";
import { useAddToCartMutation } from "../store/cartSlice";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
// import { GetWishlist, removeWishlistLocally } from "../store/GetwishlistSlice";
import { useToast } from "../hooks/use-toast";

const Wishlist = () => {
  // const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [addToCart] = useAddToCartMutation();
  const { data: items = [], isLoading } = useGetWishlistQuery();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  // Select wishlist state from Redux store
  // const { items, loading, error } = useAppSelector(
  //   (state: RootState) => state?.Getwishlists
  // );

  // console.log(items)
  // Fetch wishlist items when component loads (if empty)
  // useEffect(() => {
  //   if (items.length === 0) {
  //     dispatch(GetWishlist());
  //   }
  // }, [dispatch, items.length]);

  /**
   * Remove an item from wishlist
   */
  const removeItem = (product_id: number) => {
    // dispatch(removeWishlistLocally(product_id));
    // toast({
    //   title: "Removed ❤️",
    //   description: `The item has been removed from your wishlist.`,
    // });
    removeFromWishlist(product_id)
      .unwrap()
      .then(() => {
        // dispatch(GetWishlist()); // Refresh wishlist after removing
      });
  };

  /**
   * Add an item from wishlist to cart
   */
  const handleAddToCart = (item: any) => {
    console.log(item);
    // dispatch(
    //   addItemLocally({
    //     product_id: item.product_id,
    //     product_name: item.name || "no",
    //     price: Number(item.final_price),
    //     img_url: item.img_url,
    //   })
    // );
    // toast({
    //   title: "Added 🛒",
    //   description: `The item has been added to your cart.`,
    // });
    addToCart({ product_id: item.product_id, quantity: 1 })
      .unwrap()
      .then(() => {
        // dispatch(GetToCart()); // Refresh cart after adding
      })
      .catch(() => {
        toast({
          title: "Error ❌",
          description: "Could not add item to cart.",
        });
      });
  };
  // const handleAddToCart = useCallback(async () => {
  //   if (!item.id) return;

  //   // setCartBtnLoading(true);
  //   const previousCart = [...items]; // للـ rollback

  //   try {
  //     // إضافة محلية سريعة (Optimistic)

  //     dispatch(addItemLocally({
  //       product_id: item.id,
  //       product_name: item.name,
  //       price: Number(item.final_price),
  //       img_url: item.img_url
  //     }))

  //     toast({
  //       title: "Added to cart 🛒",
  //       description: `${item.name} has been added to your cart.`,
  //     });
  //   // setCartBtnLoading(false);
  //     // تحديث السلة على السيرفر
  //     await dispatch(AddToCart({ product_id: item.id, quantity: 1 })).unwrap();
  //   } catch (err) {
  //     // ❌ rollback
  //     previousCart.forEach((cartItem) => {
  //       dispatch(rollbackRemove({ item: cartItem }));
  //     });
  // //  setCartBtnLoading(false);
  //     toast({
  //       title: "Error ❌",
  //       description: access
  //         ? "Failed to add item to cart."
  //         : "Please login first",
  //     });
  //   } finally {
  //     // setCartBtnLoading(false);
  //   }
  // }, [item, items, dispatch, toast, access]);
  return (
    <div>
      {/* Wishlist Header Section */}
      <div className="bg-[#f9f9f9] pt-20 pb-10">
        <div className="container px-5 mx-auto flex justify-between">
          <h1 className="text-[24px] text-[#122d40] font-bold">Wishlist</h1>
          <div className=" text-[18px] flex items-center gap-3 font-medium">
            <TiHome />
            <IoIosArrowForward />
            Wishlist
          </div>
        </div>
      </div>

      {/* If wishlist has items */}
      {Array.isArray(items) && items?.length !== 0 ? (
        <div className="flex flex-wrap container mx-auto">
          {items.map((product, i) => (
            <div
              key={i}
              className="relative cursor-pointer container mx-auto mt-10 overflow-visible group/item xl:w-[420px] mb-28 h-[500px] py-12 bg-white p-[30px] flex flex-col justify-between items-start rounded-ee-[25px] rounded-ss-[25px] shadow-[0px_8px_64px_0px_#122d401a]"
            >
              {/* Remove Button */}
              <div className="relative group flex">
                <IoClose
                  onClick={() => removeItem(product.product_id)}
                  className="absolute right-[-345px] xl:right-[-405px] top-[-65px] text-white bg-[#ff2d2d] shadow-[1px_1px_10px_#1111110d] group-hover:rotate-90 w-10 h-10 p-[6px] rounded-full duration-300"
                />
              </div>

              {/* Product Content */}
              <div className="h-full flex flex-col justify-between items-start">
                <img
                  className="max-w-[350px]"
                  src={product.img_url}
                  alt={product.name}
                  loading="lazy"
                />
                <div>
                  <h1 className="text-[22px] font-extrabold group-hover/item:text-[#01e281] duration-200">
                    {product.name}
                  </h1>
                </div>

                {/* Rating + Price */}
                <div className="flex justify-between mt-2 gap-2 items-center">
                  <Rating value={product.average_rating} readOnly>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <RatingButton className="text-yellow-500" key={index} />
                    ))}
                  </Rating>
                  <h1 className="text-[26px] bg-white py-4 px-3 rounded-full ">
                    ${product.final_price}
                  </h1>
                </div>
              </div>

              {/* Add to Cart Button (appears on hover) */}
              <div
                onClick={() => handleAddToCart(product)}
                className="absolute -bottom-4 w-[180px] h-[50px] text-[#122d40] font-bold opacity-0 right-0 group-hover/item:opacity-100 transition-opacity duration-300"
              >
                <button className="bg-[#01e281] text-[#122d40] hover:bg-[#122d40] hover:text-[#01e281] text-[18px] flex items-center justify-center gap-3 font-bold px-4 py-2 w-full h-full rounded-full shadow-md">
                  <RiShoppingCartLine className="text-[18px]" /> Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // If wishlist is empty
        <div className="container mx-auto flex flex-col items-center py-5">
          <h1 className="text-[24px] xl:text-[36px] font-bold">
            Your wishlist is empty.
          </h1>
          <Button className="flex text-[18px] items-center gap-2 px-6 py-6 mt-8 bg-[#01e281] text-[#122d40] font-bold rounded-full h-12 justify-center hover:bg-[#122d40] hover:text-[#01e281] transition duration-200 delay-100">
            <Link to={"/shop"}>Back to shop</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
