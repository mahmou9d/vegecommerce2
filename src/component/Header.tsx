// =============================
// Import React, Hooks & Helpers
// =============================
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// =============================
// Import Icons
// =============================
import { HiSearch } from "react-icons/hi";
import { BiSolidPhoneCall } from "react-icons/bi";
import {
  FaBasketShopping,
  FaGift,
  FaFolder,
  FaLink,
  FaCartArrowDown,
} from "react-icons/fa6";
import { IoMdHeartEmpty } from "react-icons/io";
import { GoPerson } from "react-icons/go";
import { TbPercentage } from "react-icons/tb";
import { MdDiscount, MdOutlineMenu } from "react-icons/md";
import { TiArrowSortedUp } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import { RiFileListLine } from "react-icons/ri";
import { LiaCartPlusSolid } from "react-icons/lia";

// =============================
// Import UI Components (Sheet, Accordion, Progress)
// =============================
import "./Header.css";
import { SheetTrigger, SheetContent, Sheet } from "../components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { Progress } from "../components/ui/progress";

// =============================
// Import Redux Hooks & Actions
// =============================
// import { useAppDispatch, useAppSelector } from "../store/hook";
import {
  useGetCartQuery,
  useRemoveFromCartMutation,
} from "../store/cartSlice";
import { useLogoutMutation } from "../store/authSlice";
import { useGetWishlistQuery } from "../store/wishlistSlice";

// =============================
// Import Custom Hooks
// =============================
import { useToast } from "../hooks/use-toast";

// =============================
// Static Data: Category & Footer
// =============================
const category = [
  {
    Icon: "/images/s1.png",
    title: "Fishes & Raw",
    title2: "Meats",
    desc: "20% OFF",
  },
  {
    Icon: "/images/s2.png",
    title: "Fruits &",
    title2: "Vegetables",
    desc: "15% OFF",
  },
  {
    Icon: "/images/s3.png",
    title: "Breads &",
    title2: "Sweats",
    desc: "50% OFF",
  },
  {
    Icon: "/images/s4.png",
    title: "Milks &",
    title2: "Proteins",
    desc: "40% OFF",
  },
  {
    Icon: "/images/s6.png",
    title: "Ready touse",
    title2: "Foods",
    desc: "45% OFF",
  },
];

const footerData = {
  Categories: [
    "Supermarket",
    "Fishes & Meats",
    "Vegetables",
    "Milks & Proteins",
    "Cleaning Tools",
    "Bestsellers",
  ],
  TopTags: ["Pasta", "Sauce", "Cowboy", "Steak", "Burgers", "Spray"],
  QuickAccess: [
    "About",
    "FAQ",
    "My account",
    "Orders",
    "Downloads",
    "Lost password",
  ],
};

// =============================
// Interface for Product
// =============================
interface Product {
  id: number;
  title: string;
  price: number;
}

// =============================
// Header Component
// =============================
const Header = () => {
  // Hooks
  const { toast } = useToast();
  // const dispatch = useAppDispatch();
  // const { access } = useAppSelector((state) => state?.auth);
  const [logout, { isLoading }] = useLogoutMutation();
  // Cart Items & Total from Redux
  // const { items, total } = useAppSelector((state) => state?.cart);
  const { data: items } = useGetCartQuery();
  const [removeFromCart] = useRemoveFromCartMutation();
  const access =localStorage.getItem("access")
  // Load cart items when component mounts
  // useEffect(() => {
  //   if (access) {
  //     dispatch(GetToCart());
  //   }
  // }, [access]);

  // Local cart state
  const [cart, setCart] = useState<Product[]>([]);

  // Wishlist Items
  const { data: items2 = [] } = useGetWishlistQuery();
  // const { items: items2 } = useAppSelector((state) => state.Getwishlists);

  // Variables
  const limit = 1000; // free shipping limit
  const nav = useNavigate();

  // Calculate cart quantity
  const subquantity = Array.isArray(items?.items ?? [])
    ? items?.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
    : 0;

  // Calculate cart subtotal
  const subtotal = Array.isArray(items?.items ?? [])
    ? (items?.items ??[]).reduce((sum, item) => sum + Number(item.subtotal || 0), 0)
    : 0;

  // Progress bar for free shipping
  const progress = Math.min((subtotal / limit) * 100, 100);

  // =============================
  // Remove item from cart
  // =============================
  // const removeItem = (product_id: number) => {
  //   dispatch(RemoveCart({ product_id }))
  //     .unwrap()
  //     .then(() => {
  //       dispatch(GetToCart());
  //       toast({
  //         title: "Removed from cart 🛒",
  //         description: "The item has been removed successfully.",
  //       });
  //     })
  //     .catch(() => {
  //       if (access) {
  //         toast({
  //           title: "Error ❌",
  //           description: "Failed to remove item from cart.",
  //         });
  //       } else {
  //         toast({ title: "Error ❌", description: "Please login first" });
  //       }
  //     });
  // };
  const removeItem = (product_id: number) => {
    // احفظ النسخة القديمة للـ rollback
    const previousCart = [...(items?.items ?? [])]; // cart جاي من useSelector

    // 🔥 Optimistic Update — شيّل العنصر من UI فورًا
    // dispatch(
    //   removeItemLocally({
    //     product_id,
    //   })
    // );

    // إرسال الريكوست
    removeFromCart({ product_id })
      .unwrap()
      .then(() => {
        toast({
          title: "Removed from cart",
          description: "The item was successfully removed.",
        });
      })
      .catch(() => {
        // ❌ Rollback — رجّع الحالة القديمة
        // dispatch(rollbackRemove(previousCart));

        toast({
          title: "Remove failed",
          description: "Restored the item.",
        });
      });
  };
  // =============================
  // Logout handler
  // =============================
  const handleLogout = () => {
    logout()
      .then(() => {
        toast({
          title: "Logged out ✅",
          description: "You have been logged out successfully.",
        });
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
        // Remove all cart items & wishlist items on logout
        // Promise.all(
        //   items.map((item) =>
        //     dispatch(RemoveCart({ product_id: item.product_id })).unwrap()
        //   )
        // );
        // Promise.all(
        //   items2.map((item) =>
        //     dispatch(WishlistRemove(item.product_id)).unwrap()
        //   )
        // );

        nav("/");
      })
      .catch((err) => {
        toast({ title: "Error ❌", description: err || "Logout failed" });
      });
  };
   const total =
     items?.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) ??
     0;
     
  // =============================
  // Return JSX
  // =============================
  return (
    <div>
      <div className=" bg-[#122d40]">
        <div className="container py-7 px-4 lg:h-[200px]  mx-auto lg:pt-[40px] lg:pb-[80px] flex items-center justify-between">
          <div className="flex items-center">
            <Link to={"/"}>
              <img
                src="/images/logo-sm.png"
                alt="logo"
                className="w-[150px] lg:w-[276px]"
                loading="eager"
              />
            </Link>
            <div className="w-[1px] h-10 bg-[#a7a7a733] mx-10 mt-3 hidden lg:block"></div>
            <div className="bg-[#ffffff26] w-[420px] h-[55px] text-white rounded-[100px] relative hidden lg:block">
              <input
                type="text"
                className="w-full h-full  bg-transparent px-[25px] outline-none"
                placeholder="What are you looking for?"
              />
              <HiSearch className="absolute bg-[#122d40] text-white rounded-[100px] left-[88%] top-[4px] text-[47px] p-[6px]" />
            </div>
          </div>
          <div className="relative flex gap-[6px] lg:hidden">
            {access ? (
              <button
                onClick={handleLogout}
                className="font-semibold duration-300 h-[45px] p-[10px] text-white text-[16px] border border-[#ffffff26] rounded-full hover:bg-[#01e281] hover:text-[#122d40] transition"
              >
                Logout
              </button>
            ) : (
              <Link to={"/login"}>
                <GoPerson className="w-[45px] h-[45px] p-[10px] text-white text-[20px] border border-[#ffffff26] rounded-full" />
              </Link>
            )}
            <Link
              to={access ? "/wishlist" : "/"}
              onClick={(e) => {
                if (!access) {
                  e.preventDefault();
                  toast({
                    title: "Error ❌",
                    description: "Please login first",
                  });
                }
              }}
            >
              <IoMdHeartEmpty className="w-[45px] h-[45px] p-[10px] text-white text-[20px] border border-[#ffffff26] rounded-full" />
            </Link>
            <Link
              to={access ? "/cart" : "/"}
              onClick={(e) => {
                if (!access) {
                  e.preventDefault();
                  toast({
                    title: "Error ❌",
                    description: "Please login first",
                  });
                }
              }}
            >
              <FaBasketShopping className=" w-[45px] h-[45px] p-[10px] text-white text-[20px] border border-[#ffffff26] rounded-full" />
              <span
                className={`absolute ${
                  access ? "right-[18%]" : "right-[21%]"
                } top-[25%] bg-[#01e281] text-[13px] text-[#122d40] rounded-full w-5 h-5 flex justify-center text-center`}
              >
                {subquantity}
              </span>
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <MdOutlineMenu className=" w-[45px] h-[45px] p-[10px] text-white text-[20px] border border-[#ffffff26] rounded-full" />
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[350px] bg-[#0c2c3c] text-white border-0 p-0 overflow-y-scroll"
              >
                <Link
                  to="/shop"
                  className="px-5 py-[10px] flex text-[14px] font-bold items-center gap-2 text-white"
                >
                  <FaBasketShopping /> New Products
                </Link>

                <div className="h-[1px] bg-[#a7a7a733]"></div>
                <div className="px-5 py-[10px] flex text-[14px] font-bold items-center text-white">
                  Best Sales
                  <h1 className="bg-red-500 rounded-[100px] text-[12px] mx-[5px] py-[2px] px-[9px]">
                    Hot
                  </h1>
                </div>
                <div className="h-[1px] bg-[#a7a7a733]"></div>
                <nav className="px-5 py-[10px] flex items-center text-[14px] relative">
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full  space-y-2"
                  >
                    <AccordionItem value="categories">
                      <AccordionTrigger className="text-white hover:text-green-400">
                        <div className="flex text-[14px] font-bold items-center gap-2 text-white">
                          <TbPercentage className="border rounded-full" />{" "}
                          Special Offers
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 pl-4">
                          <div className="flex container justify-between flex-col mt-4 gap-5">
                            {category.map((item, i) => {
                              return (
                                <div
                                  className="p-8 flex flex-col items-center border border-[#01e2812b] rounded-[20px] group"
                                  key={i}
                                >
                                  <img
                                    className="w-40 p-8 flip-hover"
                                    src={item.Icon}
                                    alt={item.title}
                                    loading="lazy"
                                  />
                                  <h1 className="text-white font-bold text-[25px]">
                                    {item.title}
                                  </h1>
                                  <h1 className="text-white font-bold text-[25px]">
                                    {item.title2}
                                  </h1>
                                  <p className="text-[#01e281]">{item.desc}</p>
                                </div>
                              );
                            })}
                          </div>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </nav>
                <div className="h-[1px] bg-[#a7a7a733]"></div>
                <nav className=" py-[10px] flex items-center text-[14px] relative">
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full  space-y-2"
                  >
                    <AccordionItem value="Quickfind">
                      <AccordionTrigger className="text-white px-5 hover:text-green-400">
                        <div className="flex text-[14px] font-bold items-center gap-2 text-white">
                          Quick find
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 pt-3 flex flex-col">
                          <div className="h-[1px] bg-[#a7a7a733]"></div>
                          <div>
                            <Accordion
                              type="single"
                              collapsible
                              className="w-full space-y-2"
                            >
                              <AccordionItem value="categories">
                                <AccordionTrigger className="text-white px-5 hover:text-green-400">
                                  Categories
                                </AccordionTrigger>
                                <AccordionContent>
                                  <ul className="space-y-2 pt-2 flex flex-col">
                                    {footerData.Categories.map((item, i) => {
                                      return (
                                        <div
                                          className="px-5 flex flex-col"
                                          key={i}
                                        >
                                          <div className="h-[1px] bg-[#a7a7a733] w-[100vh] -ml-5"></div>
                                          <li
                                            key={i}
                                            className="pt-2 flex items-center gap-3 text-gray-300 hover:text-green-400 cursor-pointer transition"
                                          >
                                            <FaFolder className="text-gray-400 text-lg" />
                                            <span>{item}</span>
                                          </li>
                                        </div>
                                      );
                                    })}
                                  </ul>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </div>
                          <div className="h-[1px] bg-[#a7a7a733]"></div>
                          <div>
                            <Accordion
                              type="single"
                              collapsible
                              className="w-full space-y-2"
                            >
                              <AccordionItem value="categories">
                                <AccordionTrigger className="text-white px-5 hover:text-green-400">
                                  Top Tags
                                </AccordionTrigger>
                                <AccordionContent>
                                  <ul className="space-y-2 pt-2 flex flex-col">
                                    {footerData.TopTags.map((tag, i) => (
                                      <div
                                        className="px-5 flex flex-col"
                                        key={i}
                                      >
                                        <div className="h-[1px] bg-[#a7a7a733] w-[100vh] -ml-5"></div>
                                        <li
                                          key={i}
                                          className="pt-2 flex items-center gap-3 text-gray-300 hover:text-green-400 cursor-pointer transition"
                                        >
                                          <MdDiscount className="text-gray-400 text-lg" />
                                          <span>{tag}</span>
                                        </li>
                                      </div>
                                    ))}
                                  </ul>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </div>
                          <div className="h-[1px] bg-[#a7a7a733]"></div>
                          <div>
                            <Accordion
                              type="single"
                              collapsible
                              className="w-full space-y-2"
                            >
                              <AccordionItem value="categories">
                                <AccordionTrigger className="text-white px-5 hover:text-green-400">
                                  Quick Access
                                </AccordionTrigger>
                                <AccordionContent>
                                  <ul className="space-y-2 pt-2 flex flex-col">
                                    {footerData.QuickAccess.map((link, i) => (
                                      <div
                                        className="px-5 flex flex-col"
                                        key={i}
                                      >
                                        <div className="h-[1px] bg-[#a7a7a733] w-[100vh] -ml-5"></div>
                                        <li
                                          key={i}
                                          className="pt-2 flex items-center gap-3 text-gray-300 hover:text-green-400 cursor-pointer transition"
                                        >
                                          <FaLink className="text-gray-400 text-lg" />
                                          <span>{link}</span>
                                        </li>
                                      </div>
                                    ))}
                                  </ul>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </div>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </nav>
                <div className="h-[1px] bg-[#a7a7a733]"></div>
                <div className="px-5 py-[10px] flex text-[14px] font-bold items-center gap-2 text-white">
                  News
                </div>
                <div className="h-[1px] bg-[#a7a7a733]"></div>
                <div className="px-5 py-[10px] flex text-[14px] font-bold items-center gap-2 text-white">
                  Contact
                </div>
                <div className="h-[1px] bg-[#a7a7a733]"></div>
                <div className="px-5 py-[10px] flex text-[14px] font-bold items-center gap-2 text-white">
                  Buy XTRA Theme
                </div>
                <div className="h-[1px] bg-[#a7a7a733]"></div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="hidden items-center gap-[10px] lg:flex">
            <div className="flex gap-2">
              <BiSolidPhoneCall className="w-[45px] h-[45px] p-[10px] text-white text-[20px] border border-[#ffffff26] hover:border-[#01e281] hover:text-[#01e281] transition-all duration-200 rounded-full" />
              <div>
                <p className="text-[#9fb6cb] text-[14px]">Call Center</p>
                <h1 className="text-white text-[18px]">01009014597</h1>
              </div>
            </div>
            <div className="relative group/item">
              <Link
                to={access ? "/cart" : "/"}
                onClick={(e) => {
                  if (!access) {
                    e.preventDefault();
                    toast({
                      title: "Error ❌",
                      description: "Please login first",
                    });
                  }
                }}
              >
                <FaBasketShopping className="w-[45px] h-[45px] p-[10px] text-white text-[20px] border border-[#ffffff26] rounded-full" />
                <span className="absolute right-[-25%] top-[25%] bg-[#01e281] text-[13px] text-[#122d40] rounded-full w-5 h-5 flex justify-center text-center">
                  {subquantity}
                </span>
              </Link>

              <div
                className="
      absolute right-[-45%] z-[100] w-[400px] bg-white shadow-xl rounded-xl 
      opacity-0 scale-95 translate-y-3 pointer-events-none
      transition-all duration-300 ease-in-out
      group-hover/item:opacity-100 group-hover/item:scale-100 group-hover/item:translate-y-0 group-hover/item:pointer-events-auto 
    "
              >
                <TiArrowSortedUp className="absolute top-[-13px] text-white text-[22px] right-[32px]" />
                {Array.isArray(items?.items) && items?.items.length !== 0 ? (
                  <div>
                    <div className="p-7">
                      {items?.items.map((item, i) => {
                        return (
                          <div
                            key={i}
                            className="p-2 border flex justify-between items-center mt-3 border-slate-200 cursor-pointer"
                          >
                            <div
                              onClick={() => {
                                nav(`/singleProduct/${item.product_id}`);
                                window.scrollTo(0, 0);
                              }}
                              className="flex gap-4"
                            >
                              <img
                                className="w-28 pr-2"
                                src={item.img_url}
                                alt={item.product_name}
                                loading="lazy"
                              />
                              <div>
                                <p className="font-extrabold">
                                  {item.product_name}
                                </p>
                                <p className="text-[14px]">
                                  {item.quantity} x {item.price}
                                </p>
                              </div>
                            </div>

                            <IoClose
                              onClick={() =>
                                removeFromCart({
                                  product_id: item.product_id,
                                })
                              }
                              className="text-[20px]"
                            />
                          </div>
                        );
                      })}
                      <div className="flex items-center justify-between bg-[#f3f3f3] py-3 px-5 rounded-b-2xl">
                        <div className="flex items-center gap-3">
                          <RiFileListLine />
                          <p>Cart subtotal</p>
                        </div>
                        <p className="font-bold">${subtotal.toFixed(2)}</p>
                      </div>
                      <div className=" pb-5 border-b border-dashed">
                        <div className="flex items-center justify-center px-1 text-[14px] mt-4">
                          <FaCartArrowDown />
                          <p className="flex items-center pl-2">
                            Add{" "}
                            <p className="font-bold px-2">
                              ${(limit - (total ?? 0)).toFixed(2)}
                            </p>{" "}
                            more to get free shipping!
                          </p>
                        </div>
                        <Progress
                          value={progress}
                          className="h-4 text-[#01e281]"
                        />
                      </div>
                      <div
                        onClick={() => {
                          nav("/cart");
                          window.scrollTo(0, 0);
                        }}
                        className="flex h-12 cursor-pointer font-bold items-center gap-2 px-4 bg-[#01e281] rounded-full  justify-center m-2 hover:bg-[#122d40] hover:text-[#01e281] transition duration-200 delay-100"
                      >
                        Process to Checkout
                      </div>
                    </div>{" "}
                    <p className="bg-[#f3f3f3] h-[50px] flex items-center justify-center rounded-b-2xl italic text-[14px]">
                      Free shipping on purchases over $999
                    </p>
                  </div>
                ) : (
                  <div className=" h-48 p-5 ">
                    <div className="border border-[#e5e7eb] h-full w-full flex flex-col items-center justify-center rounded-2xl">
                      <LiaCartPlusSolid className="text-[85px] opacity-30" />
                      Cart's empty! Let's fill it up!
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="w-[1px] h-10 bg-[#a7a7a733] mt-3  ml-2"></div>
            <Link
              to={access ? "/wishlist" : "/"}
              onClick={(e) => {
                if (!access) {
                  e.preventDefault();
                  toast({
                    title: "Error ❌",
                    description: "Please login first",
                  });
                }
              }}
            >
              <IoMdHeartEmpty className="w-[45px] h-[45px] p-[10px] text-white text-[20px] border border-[#ffffff26] rounded-full" />
            </Link>

            {access ? (
              <button
                onClick={handleLogout}
                className="font-semibold duration-300 h-[45px] p-[10px] text-white text-[16px] border border-[#ffffff26] rounded-full hover:bg-[#01e281] hover:text-[#122d40] transition"
              >
                Logout
              </button>
            ) : (
              <Link to={"/login"}>
                <GoPerson className="w-[45px] h-[45px] p-[10px] text-white text-[20px] border border-[#ffffff26] rounded-full" />
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="z-50 relative container hidden lg:flex justify-between pl-10 w-full h-[78px] bg-[#1c3e56] rounded-full mx-auto -m-[50px]">
        <div className="flex justify-between gap-14">
          <Link
            to={"/shop"}
            className="flex text-[18px] hover:text-[#01e281] transition-all duration-200 items-center gap-2 text-white"
          >
            <FaBasketShopping /> New Products
          </Link>
          <div className="flex">
            <Link
              to={"/category/bestsellers"}
              className="flex items-center justify-center text-[18px]  text-white "
            >
              <h1 className="hover:text-[#01e281] transition-all duration-200">
                Best Sales
              </h1>
              <span className="bg-red-500 rounded-[100px] text-[12px] mx-[5px] py-[2px] px-[9px] hover:text-white">
                Hot
              </span>
            </Link>
          </div>
          <nav className="flex items-center text-[18px] relative">
            <ul>
              <li className="dropdown relative group">
                <a href="#" className="flex items-center">
                  <div className="flex text-[18px] items-center gap-2 text-white hover:text-[#01e281] transition-all duration-200">
                    <TbPercentage className="border rounded-full " /> Special
                    Offers
                  </div>
                </a>

                {/* الدروب داون */}
                <ul className="absolute  p-12 top-full left-0 ml-[-205%] w-[169vh] opacity-0 invisible transition-all duration-300 bg-[#122d40] shadow-lg rounded-[15px] group-hover:opacity-100 group-hover:visible">
                  <div className="flex container justify-between gap-7">
                    {category.map((item, i) => {
                      return (
                        <div
                          className="p-8 cursor-pointer flex flex-col items-center border border-[#01e2812b] hover:border-[#01e281] transition-all duration-150 rounded-[20px] group"
                          key={i}
                        >
                          <img
                            className="w-40 p-8 flip-hover"
                            src={item.Icon}
                            alt={item.title}
                            loading="lazy"
                          />
                          <h1 className="text-white font-bold text-[25px]">
                            {item.title}
                          </h1>
                          <h1 className="text-white font-bold text-[25px]">
                            {item.title2}
                          </h1>
                          <p className="text-[#01e281]">{item.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </ul>
              </li>
            </ul>
          </nav>
          <nav className="flex items-center text-[18px] relative">
            <ul>
              <li className="dropdown relative group">
                <a href="#" className="flex items-center">
                  <div className="flex text-[18px] items-center gap-2 text-white hover:text-[#01e281] transition-all duration-200">
                    Quick find
                  </div>
                </a>

                {/* الدروب داون */}
                <ul className="absolute p-6  top-full left-0 ml-[-190%] w-[75vh] opacity-0 invisible transition-all duration-300 bg-[#122d40] shadow-lg rounded-[15px] group-hover:opacity-100 group-hover:visible">
                  <div className="container flex justify-between">
                    <div>
                      <h1 className="font-bold text-green-400 mb-4 text-lg ">
                        Categories
                      </h1>
                      {footerData.Categories.map((item, i) => {
                        return (
                          <div
                            className="p-1 flex flex-col"
                            key={i}
                            onClick={() => {
                              nav(`/category/${item.toLowerCase()}`);
                            }}
                          >
                            <li
                              key={i}
                              className="flex items-center gap-3 text-gray-300 hover:text-green-400 cursor-pointer transition"
                            >
                              <FaFolder className="text-gray-400 text-lg" />
                              <span>{item}</span>
                            </li>
                          </div>
                        );
                      })}
                    </div>
                    <div className="w-[1px] bg-[#a7a7a733] mr-3"></div>
                    <div>
                      <h1 className="font-bold text-green-400 mb-4 text-lg">
                        Top Tags
                      </h1>
                      {footerData.TopTags.map((tag, i) => (
                        <div
                          className="p-1 flex flex-col"
                          key={i}
                          onClick={() => {
                            nav(`/category/${tag.toLowerCase()}`);
                          }}
                        >
                          <li
                            key={i}
                            className="flex items-center gap-3 text-gray-300 hover:text-green-400 cursor-pointer transition"
                          >
                            <MdDiscount className="text-gray-400 text-lg" />
                            <span>{tag}</span>
                          </li>
                        </div>
                      ))}
                    </div>
                    <div>
                      <h1 className="font-bold text-green-400 mb-4 text-lg">
                        Quick Access
                      </h1>
                      {footerData.QuickAccess.map((link, i) => (
                        <div className="p-1 flex flex-col" key={i}>
                          <li
                            key={i}
                            className="flex items-center gap-3 text-gray-300 hover:text-green-400 cursor-pointer transition"
                          >
                            <FaLink className="text-gray-400 text-lg" />
                            <span>{link}</span>
                          </li>
                        </div>
                      ))}
                    </div>
                  </div>
                </ul>
              </li>
            </ul>
          </nav>

          <div className="flex cursor-pointer text-[18px] items-center gap-2 text-white hover:text-[#01e281] transition-all duration-200">
            News
          </div>
          <div className="flex cursor-pointer text-[18px] items-center gap-2 text-white hover:text-[#01e281] transition-all duration-200">
            Contact
          </div>
        </div>
        <div className="flex cursor-pointer items-center gap-2 px-4 bg-[#01e281] rounded-full w-44 justify-center m-2 hover:bg-[#122d40] hover:text-[#01e281] transition duration-200 delay-100">
          <FaGift /> Daily Offers
        </div>
      </div>
    </div>
  );
};

export default Header;
