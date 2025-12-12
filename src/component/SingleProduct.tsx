import { Button } from "../components/ui/button";
import { Rating, RatingButton } from "../components/ui/shadcn-io/rating";
import { FaPinterest } from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";
import { IoIosArrowForward, IoMdHeartEmpty } from "react-icons/io";
import { RiShoppingCartLine } from "react-icons/ri";
import { TiHome } from "react-icons/ti";
import InnerImageZoom from "react-inner-image-zoom";
import { MdOutlineCheckCircle } from "react-icons/md";
import { LiaFacebookF } from "react-icons/lia";
import { FaWhatsapp } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaRegCopy } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { useEffect, useState } from "react";
import { Textarea } from "../components/ui/textarea";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
// import { useAppDispatch, useAppSelector } from "../store/hook";
import { useAddReviewMutation, useGetRecentReviewsQuery } from "../store/reviewSlice";
import { useParams } from "react-router-dom";
// import { productUser } from "../store/productSlice";
import { RootState } from "../store";
import {
  useAddToWishlistMutation,
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "../store/wishlistSlice";
// import { GetWishlist } from "../store/GetwishlistSlice";
import { GoHeart, GoHeartFill } from "react-icons/go";
import {
  useAddToCartMutation,
  useGetCartQuery,
} from "../store/cartSlice";
import { useToast } from "../hooks/use-toast";
// import { GetReview } from "../store/reviewgetSlice";
import { useGetProductsQuery } from "../store/UpdataProductSlice";
import { access } from "fs";

const listfirst = ["brand", "sku", "status", "tags", "categories"];
const listsecond = [
  "XTRA",
  "SKU_40",
  "72 in stock",
  "Pasta, Sauce",
  "Breads & Sweats, Supermarket",
];
const description = [
  {
    title: "Your Personal Assistant",
    desc: "Welcome to the next generation of assistance with our Future Helper Robot. Engineered with cutting-edge artificial intelligence, this robotic companion serves as your personal assistant, seamlessly integrating into your daily routine to enhance productivity and convenience. Whether you need help with scheduling, organization, or simply a friendly chat, our Future Helper Robot is always at your service, learning from your preferences and adapting to your needs over time.",
  },
  {
    title: "Effortless Household Management",
    desc: "Say goodbye to mundane chores and hello to newfound freedom with our Future Helper Robot. Equipped with nimble mobility and dexterous manipulators, it effortlessly navigates your home, tackling household tasks with efficiency and precision. From cleaning and tidying to managing smart home devices and even assisting with meal preparation, this robot revolutionizes the way you maintain your living space, leaving you with more time to focus on what truly matters.",
  },
  {
    title: "Entertainment Hub of Tomorrow",
    desc: "But our Future Helper Robot is more than just a practical assistant—it’s also a gateway to endless entertainment and enrichment. With its intuitive interface and seamless connectivity, it transforms into your personal entertainment hub, streaming music, news, and immersive virtual reality experiences at your command. Whether you’re unwinding after a long day or seeking inspiration for your next adventure, this robot brings entertainment to life in ways you never thought possible.",
  },
];
const SingleProduct = () => {
  const { toast } = useToast();
  const [edit, setEdit] = useState(1);
  const { id } = useParams();
  // const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState("Description");
  const tabs = [
    "Description",
    "Information",
    "Reviews",
    "Size Guide",
    "FAQ",
    "Shopping & Returns",
  ];
  // const { products, loading, error } = useAppSelector(
  //   (state: RootState) => state.product
  // );
  const { data: products = [] } = useGetProductsQuery();
  const [addToCart] = useAddToCartMutation();
  const { data: getwishlist = [] } = useGetWishlistQuery();
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
      const { data: items = [], isLoading } = useGetRecentReviewsQuery();
      const [addReview, { isLoading: isAdding, isSuccess }] =
        useAddReviewMutation();

  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  // const { access } = useAppSelector((state) => state?.auth);

  // useEffect(() => {
  //   if (products.length === 0) {
  //     dispatch(productUser());
  //   }
  // }, [dispatch, products.length]);
  // console.log(products,"hglkjghfhvkgcfhig")
  // const { items } = useAppSelector((state) => state.reviewget);
  // const { error: error2 } = useAppSelector((state) => state.review);
  // useEffect(() => {
  //   dispatch(GetReview());
  // }, [dispatch]);
  console.log(items, "atrtehqeterter");
  const filterProduct = products.filter((item) => item?.id?.toString() === id);
  const firstItem = filterProduct[0];
  // console.log(firstItem,"firstItemuymmytmyt")
  const filterReview = items.filter(
    (item) => item?.product?.toString() === firstItem?.name
  );
  const firstReview = filterReview;
  console.log(filterReview, "wqgqtetjty/ejtyte");

  // const handleAddReviews = () => {
  //   dispatch(
  //     AddReviews({
  //       product_id: firstItem.id as number,
  //       comment: review,
  //       rating: rating,
  //     })
  //   );
  // };
  const handleAddReviews = () => {
    const username = localStorage.getItem("username") || "Guest";
    if (!username) {
      toast({
        title: "Login required",
        description: "Please login first to add a review.",
      });
      return;
    }
    const hasReviewed = items.some(
      (item) =>
        item.product.toString() === firstItem?.name &&
        item.customer === username
    );

    if (hasReviewed) {
      toast({
        title: "❌ Review already submitted",
        description: "You have already submitted a review for this product.",
      });
      return;
    }


      addReview({
        product_id: firstItem.id as number,
        comment: review,
        rating: rating,
      })
        .unwrap()
        .then(() => {
          toast({
            title: "✅ Review submitted",
            description: "Your review has been added successfully.",
          });
          // dispatch(GetReview());
        })
        .catch((err) => {
          let message = "Unexpected error";
          if (typeof err === "string") message = err;
          else if (err?.error) message = err.error; // <== هنا نأخذ الرسالة من السيرفر

          toast({
            title: "Error ❌",
            description: message,
          });
        });
  };

  // const wishlist = useAppSelector((state) => state.wishlist.items);
  // const getwishlist = useAppSelector((state) => state.Getwishlists.items);
  // console.log(wishlist, "khflhjdjfhs;kjjdhsfg;lkjhfdgdfogkjh");
  const inWishlist = id
    ? getwishlist.some((w) => w.product_id === Number(id))
    : false;

  const toggleWishlist = () => {
    if (!id) return;

    if (inWishlist) {
      toast({
        title: "Removed ❤️",
        description: `${firstItem?.name} has been removed from your wishlist.`,
        className: "bg-white text-black border shadow-lg", // ستايل بسيط
      });
      removeFromWishlist(Number(id))
        .unwrap()
        .then(() => {});
    } else {
      addToWishlist(Number(id))
        .unwrap()
        .then(() => {
          toast({
            title: "Added 💚",
            description: `${firstItem?.name} has been added to your wishlist.`,
          });
        });
    }
    // dispatch(GetWishlist());
  };
  const handleAddToCart = async () => {
    if (!id) return;
    await addToCart({ product_id: Number(id), quantity: 1 });
    // dispatch(GetToCart());
  };
  // const { items: items3, total } = useAppSelector((state) => state.cart);
  const { data: items3 } = useGetCartQuery();
  console.log(items3, "vvvvvvvvvvvvvvvvvvv");
  // useEffect(() => {
    // dispatch(GetToCart());
  // }, [dispatch]);
  const updateQuantity = () => {
    addToCart({ product_id: Number(firstItem.id), quantity: edit })
      .unwrap()
      .then(() => {
        // dispatch(GetToCart());
        setEdit(1);
        toast({
          title: "🛒 Added to Cart",
          description: `${firstItem?.name} (x${edit}) has been added to your cart.`,
        });
      })
      .catch((error) => {
        if (localStorage.getItem("access")) {
          toast({
            title: "Error ❌",
            description: "Failed to add item to cart.",
          });
        } else {
          toast({
            title: "Error ❌",
            description: "Please login first",
          });
        }
      });
  };
  return (
    <div>
      <div className="bg-[#f9f9f9] pt-20 pb-10">
        <div className="container mx-auto px-5 flex justify-between">
          <h1 className="text-[14px] xl:text-[24px] text-[#122d40] font-bold">
            {firstItem?.name}
          </h1>
          <div className="text-[14px] xl:text-[18px] flex flex-wrap items-center gap-3 font-medium">
            <TiHome />
            <IoIosArrowForward />
            Products
            <IoIosArrowForward />
            {firstItem?.categories}
            <IoIosArrowForward />
            {firstItem?.name}
          </div>
        </div>
      </div>
      <div className="container mx-auto px-5 flex flex-col xl:flex-row my-10">
        <div className="xl:w-[50%]">
          <div className="xl:w-[400px] h-[400px]">
            <img src={firstItem?.img_url} alt={""} loading="lazy" />
          </div>
        </div>
        <div className="xl:w-[50%]">
          <h1 className="text-[36px] font-bold">{firstItem?.name}</h1>
          <Rating value={firstItem?.average_rating} readOnly>
            {Array.from({ length: 5 }).map((_, index) => (
              <RatingButton className="text-yellow-500" key={index} />
            ))}
          </Rating>
          <h1 className="text-[28px] font-bold text-[#01e281] pt-7 pb-3">
            ${firstItem?.final_price}
          </h1>
          <h1 className="pb-4">
            {/* {firstItem?.categories[2] || firstItem?.categories[1] || firstItem?-.categories[0]||""} */}
          </h1>
          <div className="flex items-center gap-2 mb-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setEdit(edit > 1 ? edit - 1 : 1)}
              className="bg-[#f9f9f9] text-[#01e281] transition duration-200 delay-100 hover:text-[#122d40] hover:bg-[#01e281]  rounded-full text-[18px] w-12 h-12"
            >
              −
            </Button>
            <span className="px-3 w-20 border border-[#a7a7a74d] h-10 rounded-full flex items-center justify-center text-[16px]">
              {edit ?? 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setEdit(edit + 1)}
              className="bg-[#f9f9f9] text-[#01e281] transition duration-200 delay-100 hover:text-[#122d40] hover:bg-[#01e281] rounded-full text-[18px] w-12 h-12"
            >
              +
            </Button>
          </div>
          <div className="flex items-end gap-4">
            <button
              onClick={updateQuantity}
              className="bg-[#01e281] mt-4 text-[#122d40] hover:bg-[#122d40] hover:text-[#01e281] text-[18px] flex items-center justify-center gap-3 font-bold px-4 py-2  rounded-full  shadow-md"
            >
              <RiShoppingCartLine className="text-[18px]" /> Add to cart
            </button>
            <div className=" group flex">
              {inWishlist ? (
                <GoHeartFill
                  onClick={toggleWishlist}
                  className="  border border-[#01e281] bg-[#01e281] text-[#122d40] w-[45px] h-[45px] p-[10px] rounded-full duration-300 cursor-pointer"
                />
              ) : (
                <GoHeart
                  onClick={toggleWishlist}
                  className="w-[45px] h-[45px] p-[10px] text-black bg-[#01e281]  text-[20px]   border border-[#9fb6cb33] group-hover:border-[#01e281] group-hover:text-[#122d40] rounded-full duration-300 cursor-pointer"
                />
              )}
              <div
                className={`absolute   ${
                  inWishlist ? "ml-[9.5rem] left-[47%] top-[87%]" : "ml-[13rem]"
                } z-10 top-[78%] left-[44.5%] opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              >
                <button
                  onClick={toggleWishlist}
                  className="bg-[#01e281] text-white px-4 py-2 rounded-full text-sm font-medium shadow-md"
                >
                  {inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                </button>
              </div>
            </div>
          </div>

          <h1 className="flex mt-6 my-8 items-center gap-2 text-[#676767] bg-[#67676712] text-[15px] py-[12px] px-10 rounded-[50px]">
            <RiShoppingCartLine className="text-[18px]" />
            <span className="font-bold">110</span> people have added this
            product to their cart
          </h1>
          <div className=" flex gap-7 py-8 border-y border-y-[#6767671f]">
            <div>
              {listfirst.map((item, i) => (
                <h1 className="font-bold text-[15px]">{item}</h1>
              ))}
            </div>
            <div>
              {listsecond.map((item, i) => (
                <h1 className="text-[15px]">{item}</h1>
              ))}
            </div>
          </div>
          <div className="py-5 border-b border-[#6767671f]">
            <h1 className="flex items-center gap-3 text-[#676767]">
              <MdOutlineCheckCircle />
              Free shipping on all orders over $100
            </h1>{" "}
            <h1 className="flex items-center gap-3 text-[#676767]">
              <MdOutlineCheckCircle />
              14 days easy refund & returns
            </h1>
            <h1 className="flex items-center gap-3 text-[#676767]">
              <MdOutlineCheckCircle />
              Product taxes and customs duties included
            </h1>
          </div>
          <div className="flex justify-between py-5">
            <h1>Secure payments:</h1>
            <img
              src="https://xtratheme.com/wp-content/uploads/2025/07/cards.png"
              alt="payment"
              className="w-[150px] xl:w-full"
              loading="lazy"
            />
          </div>
          <div className="bg-[#f1f2f6] rounded-[50px] text-[#676767] px-20 py-4 flex justify-center items-center">
            <h1 className="xl:pr-7 text-black font-medium">Share</h1>
            <TooltipProvider>
              <Tooltip delayDuration={0.5}>
                <TooltipTrigger>
                  <LiaFacebookF className="w-10 h-10 px-[10px] py-1 mr-2 hover:scale-125 hover:bg-[#3b5998] rounded-full hover:text-white transition-all duration-200 ease-in-out" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share on Facebook</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip delayDuration={0.5}>
                <TooltipTrigger>
                  <RiTwitterXFill className="w-10 h-10 px-[10px] py-1 mr-2 hover:scale-125 hover:bg-black rounded-full hover:text-white transition-all duration-200 ease-in-out" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share on X</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip delayDuration={0.5}>
                <TooltipTrigger>
                  <FaPinterest className="w-10 h-10 px-[10px] py-1 mr-2 hover:scale-125 hover:bg-[#cb2027] rounded-full hover:text-white transition-all duration-200 ease-in-out" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share on Pinterest</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>{" "}
            <TooltipProvider>
              <Tooltip delayDuration={0.5}>
                <TooltipTrigger>
                  <FaWhatsapp className="w-10 h-10 px-[10px] py-1 mr-2 hover:scale-125 hover:bg-[#25D366] rounded-full hover:text-white transition-all duration-200 ease-in-out" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share by Whatsapp</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>{" "}
            <TooltipProvider>
              <Tooltip delayDuration={0.5}>
                <TooltipTrigger>
                  <MdEmail className="w-10 h-10 px-[10px] py-1 mr-2 hover:scale-125 hover:bg-[#aaa] rounded-full hover:text-white transition-all duration-200 ease-in-out" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share by Email</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip delayDuration={0.5}>
                <TooltipTrigger>
                  <FaRegCopy className="w-10 h-10 px-[10px] py-1 mr-1 hover:scale-125 hover:bg-[#aaa] rounded-full hover:text-white transition-all duration-200 ease-in-out" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy Shortlink</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      <div className="flex container mx-auto flex-col">
        {" "}
        <div className="flex justify-center gap-3 flex-wrap">
          {tabs.map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-7 px-7 font-bold rounded-t-[16px] rounded-b-none text-[16px] transition-colors
              ${
                activeTab === tab
                  ? "bg-[#122d40] text-white hover:bg-[#122d40]" // الـ Active
                  : "bg-[#01e28105] text-[#515151] opacity-70 border-x border-[#a7a7a733] hover:bg-[#01e28105]"
              }`}
            >
              {tab}
            </Button>
          ))}
        </div>
        <div className="bg-[#122d40] text-white rounded-[20px] p-14">
          {activeTab === "Description" &&
            description.map((item, i) => {
              return (
                <div className="pb-8">
                  <h1 className="text-[24px] font-bold pb-3">{item.title}</h1>
                  <p className="leading-8">{item.desc}</p>
                </div>
              );
            })}
          {activeTab === "Information" && (
            <div>
              <h1 className="text-[22px] pb-5 mb-5 border-b font-bold border-[#a7a7a733] ">
                Additional information
              </h1>
              <div className="flex">
                <h1 className="font-bold w-[20%] py-[14px] px-[28px]">
                  Weight
                </h1>
                <p className="py-[14px] px-[28px] opacity-70 ">10 kg</p>
              </div>
              <div className="flex">
                <h1 className="font-bold w-[20%]  bg-[#67676717] py-[14px] px-[28px]">
                  Dimensions
                </h1>
                <p className="py-[14px] px-[28px] opacity-70   bg-[#67676717] w-[100%]">
                  61 × 52 × 45 cm
                </p>
              </div>
              <div className="flex">
                <h1 className="font-bold w-[20%] py-[14px] px-[28px]">
                  Product year
                </h1>
                <p className="py-[14px] px-[28px] opacity-70 ">2024</p>
              </div>
              <div className="flex">
                <h1 className="font-bold w-[20%] bg-[#67676717]  py-[14px] px-[28px]">
                  Product manual
                </h1>
                <p className="py-[14px] px-[28px] opacity-70  bg-[#67676717] w-[100%]">
                  Included in the package
                </p>
              </div>
              <div className="flex">
                <h1 className="font-bold w-[20%] py-[14px] px-[28px]">
                  Refundable
                </h1>
                <p className="py-[14px] px-[28px] opacity-70 ">Up to 14 days</p>
              </div>
            </div>
          )}
          {activeTab === "Reviews" && (
            <div>
              <h1
                className={`text-[22px] font-bold pb-5 ${
                  filterReview?.length === 0
                    ? ""
                    : " border-b border-[#a7a7a733]"
                }`}
              >
                {filterReview?.length === 0
                  ? "No reviews"
                  : `${filterReview?.length} reviews for ${firstReview[0]?.product}`}
              </h1>

              {filterReview?.length !== 0 &&
                firstReview.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white mb-4 text-black py-7 px-7 rounded-2xl"
                  >
                    <div className="flex justify-between pb-4">
                      <p className="font-medium">{item?.customer}</p>
                      <p>
                        <Rating defaultValue={item?.rating}>
                          {Array.from({ length: 5 }).map((_, index) => (
                            <RatingButton
                              className="text-[#ffc000]"
                              key={index}
                            />
                          ))}
                        </Rating>
                      </p>
                    </div>
                    <h1>{item?.comment}</h1>
                  </div>
                ))}
              <p className="py-4">Add a review</p>
              <p className="pb-4">
                Your email address will not be published. Required fields are
                marked *
              </p>
              <p className="pb-4">Your rating *</p>
              <div className="flex flex-col pb-4 gap-3">
                <Rating
                  value={rating}
                  onChange={(_event, value: number) => setRating(value)}
                >
                  {Array.from({ length: 5 }).map((_, index) => (
                    <RatingButton
                      className="text-yellow-500"
                      key={index}
                      size={32}
                      index={index}
                    />
                  ))}
                </Rating>
              </div>
              <h2 className="pb-4">Your review *</h2>
              <Textarea
                placeholder=""
                className="focus:shadow-[#01e281] text-black"
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
              <div className="flex items-center gap-3 pt-3">
                <Checkbox id="terms" />
                <Label htmlFor="terms">Accept terms and conditions</Label>
              </div>
              <button
                onClick={handleAddReviews}
                className="bg-[#01e281] mt-5 text-[#122d40] hover:bg-[#122d40] hover:text-[#01e281] text-[18px] flex items-center justify-center gap-3 font-bold px-4 py-2  h-full  rounded-full  shadow-md"
              >
                Submit
              </button>
              {/* {error2 && (
                <p className="text-red-500">
                  {typeof error2 === "string" ? error2 : JSON.stringify(error2).error}
                </p>
              )} */}
            </div>
          )}
          {activeTab === "Size Guide" && (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-700 text-white ">
                <thead>
                  <tr className="bg-[#a7a7a71a] text-center">
                    <th className="px-6 py-3 border border-gray-700">Size</th>
                    <th className="px-6 py-3 border border-gray-700">USA</th>
                    <th className="px-6 py-3 border border-gray-700">Europe</th>
                    <th className="px-6 py-3 border border-gray-700">Others</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  <tr>
                    <td className="px-6 py-3 border border-gray-700">XS</td>
                    <td className="px-6 py-3 border border-gray-700">28-30</td>
                    <td className="px-6 py-3 border border-gray-700">27-29</td>
                    <td className="px-6 py-3 border border-gray-700">34-36</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 border border-gray-700">S</td>
                    <td className="px-6 py-3 border border-gray-700">30-32</td>
                    <td className="px-6 py-3 border border-gray-700">29-31</td>
                    <td className="px-6 py-3 border border-gray-700">36-38</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 border border-gray-700">M</td>
                    <td className="px-6 py-3 border border-gray-700">32-33</td>
                    <td className="px-6 py-3 border border-gray-700">31-33</td>
                    <td className="px-6 py-3 border border-gray-700">38-40</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 border border-gray-700">L</td>
                    <td className="px-6 py-3 border border-gray-700">33-34</td>
                    <td className="px-6 py-3 border border-gray-700">33-36</td>
                    <td className="px-6 py-3 border border-gray-700">40-44</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 border border-gray-700">XL</td>
                    <td className="px-6 py-3 border border-gray-700">34-38</td>
                    <td className="px-6 py-3 border border-gray-700">36-40</td>
                    <td className="px-6 py-3 border border-gray-700">44-48</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 border border-gray-700">XXL</td>
                    <td className="px-6 py-3 border border-gray-700">38-48</td>
                    <td className="px-6 py-3 border border-gray-700">40-44</td>
                    <td className="px-6 py-3 border border-gray-700">48-50</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          {activeTab === "FAQ" && (
            <section className=" text-white">
              <h2 className="text-3xl font-bold mb-6">FAQ</h2>
              <div className=" mx-auto flex gap-10 items-start">
                <div>
                  <img
                    src="https://xtratheme.com/wp-content/uploads/2024/04/faq.jpg"
                    alt="FAQ"
                    className="rounded-2xl shadow-lg w-[400px] p-5 "
                    loading="lazy"
                  />
                </div>

                <div className=" ">
                  <ul className="space-y-8">
                    <li>
                      <p className="font-bold">
                        <span className="mr-2">•</span> What payment methods do
                        you accept?
                      </p>
                      <p className="text-gray-300 text-sm mt-1 pl-6">
                        We accept various payment methods, including
                        credit/debit cards, PayPal, and bank transfers for your
                        convenience.
                      </p>
                    </li>
                    <li>
                      <p className="font-bold">
                        <span className="mr-2">•</span> Do you offer
                        international shipping?
                      </p>
                      <p className="text-gray-300 text-sm mt-1 pl-6">
                        Yes, we offer international shipping to many countries.
                        Please check our shipping information page for details
                        on available destinations and shipping rates.
                      </p>
                    </li>
                    <li>
                      <p className="font-bold">
                        <span className="mr-2">•</span> How can I track my
                        order?
                      </p>
                      <p className="text-gray-300 text-sm mt-1 pl-6">
                        Once your order is shipped, you will receive a tracking
                        number via email. You can use this number to track your
                        package's delivery status on our website or through the
                        courier's tracking portal.
                      </p>
                    </li>
                    <li>
                      <p className="font-bold">
                        <span className="mr-2">•</span> What is your return
                        policy?
                      </p>
                      <p className="text-gray-300 text-sm mt-1 pl-6">
                        We offer a hassle-free return policy. If you're not
                        satisfied with your purchase for any reason, you can
                        return it within 30 days for a full refund or exchange.
                        Please refer to our returns page for detailed
                        instructions.
                      </p>
                    </li>
                    <li>
                      <p className="font-bold">
                        <span className="mr-2">•</span> Are your products
                        covered by a warranty?
                      </p>
                      <p className="text-gray-300 text-sm mt-1 pl-6">
                        Yes, most of our products come with a manufacturer's
                        warranty against defects in materials and
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
              <p className="text-gray-300 text-sm mt-1 pl-6">
                workmanship. The duration and terms of the warranty vary by
                product, so please check the product description or contact our
                customer support team for specific details.
              </p>
            </section>
          )}
          {activeTab === "Shopping & Returns" && (
            <section className=" text-white">
              <div className=" mx-auto  gap-10 items-start">
                {/* النصوص */}
                <div>
                  {/* Shipping & Delivery */}
                  <h2 className="text-2xl font-bold mb-4">
                    Shipping & Delivery
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    All estimated shipping times are in addition to fulfillment
                    times, We offer a next working day delivery for orders
                    placed before 6:30 p.m. Monday to Friday. Orders placed
                    after this will be delivered within two working days. This
                    excludes Saturday, Sunday and holidays. Appointed is not
                    responsible for any customs/duties related to international
                    orders. We are unable to calculate charges prior to your
                    order being delivered, and recommend checking with your
                    local customs office for more information. Shipping fees
                    will not be refunded if you refuse these charges.
                  </p>
                  <div className="flex items-center justify-between">
                    <ul className="list-disc list-inside space-y-1 text-gray-200 mb-8">
                      <li>Free destination delivery above $100</li>
                      <li>Europe 1 – 3 days Free</li>
                      <li>United States 4 – 6 days Free</li>
                      <li>Asia 3 – 6 days Free</li>
                      <li>Africa 5 – 7 days Free</li>
                      <li>Australia 3 – 5 days Free</li>
                    </ul>

                    <img
                      src="https://xtratheme.com/wp-content/uploads/2024/04/shipping.png"
                      alt="Shipping"
                      className="rounded-xl shadow-lg w-[35%] object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Returns & Refunds */}
                  <h2 className="text-2xl font-bold mb-4">Returns & Refunds</h2>
                  <p className="text-gray-300 leading-relaxed">
                    We have a 14-day return policy, which means you have 14 days
                    after receiving your item to request a return. To be
                    eligible for a return, your item must be in the same
                    condition that you received it, unused, and in its original
                    packaging. You’ll also need the order confirmation, order
                    number, or proof of purchase. We will notify you once we’ve
                    received and inspected your return, and let you know if the
                    refund was approved or not. If approved, you’ll be
                    automatically refunded on your original payment method.
                    Please remember it can take some time for your bank or
                    credit card company to process and post the refund too.
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
