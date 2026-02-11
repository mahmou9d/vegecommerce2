// ==================== Import libraries & components ====================
import React from "react";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../components/ui/carousel";
import { FaLink } from "react-icons/fa6";

// ==================== Blog posts data array (static) ====================
const blogs = [
  {
    title: "Tutorial",
    img: "/images/young-man-shopping-supermarket-trolley-cart-smiling-cheerful-bearded-walking-along-shelves-grocery-store-happy-guy-384804102.webp",
    time: "10 June 2025",
    desc: "March retail sales, foot traffic take a dip",
  },
  {
    title: "Interview",
    img: "/images/istockphoto-1485785466-612x612.jpg",
    time: "24 June 2025",
    desc: "Kroger ready to expand technology reach",
  },
  {
    title: "News",
    img: "/images/depositphotos_35847395-Guy-chooses-groceries-in-supermarket.jpg",
    time: "27 June 2025",
    desc: "Coborn’s to acquire Sullivan’s Foods in Illinois",
  },
  {
    title: "Updates",
    img: "/images/360_F_532657634_pZqytUqZ8rahd7ExAgz0bDO4sAy1LXNM.jpg",
    time: "5 June 2025",
    desc: "Whole Foods announces layoffs, restructuring",
  },
  {
    title: "News",
    img: "/images/p7.jpg",
    time: "13 June 2025",
    desc: "Walmart adds first-of-its-kind truck to fleet",
  },
  {
    title: "Tutorial",
    img: "/images/p10.jpg",
    time: "19 June 2025",
    desc: "Metro sales were on the rise in Q2",
  },
];

// ==================== Banner Styles ====================
const bannerStyle: React.CSSProperties = {
  backgroundColor: "#01E281",
  backgroundImage:
    "url(https://xtratheme.com/elementor/supermarket/wp-content/uploads/sites/106/2023/05/box-bg.jpg)",
  backgroundPosition: "center center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  padding: "50px 70px 0 70px",
  borderRadius: "30px",
  width: "100%",
  height: "600px",
  display: "flex",
  // justifyContent: "space-between",
  color: "white",
};

// ==================== BlogItem Component (memoized) ====================
const BlogItem = React.memo(({ item }: { item: (typeof blogs)[0] }) => (
  <CarouselItem
    key={item.img}
    className="xl:basis-1/4 basis-full relative group cursor-pointer"
  >
    {/* Small title badge */}
    <p className="absolute text-[12px] z-10 -top-6 border-[7px] rounded-full px-5 py-2 text-white border-white left-1/2 -translate-x-1/2 bg-[#122d40]">
      {item.title}
    </p>

    {/* Image container */}
    <div className="relative h-80 rounded-3xl overflow-hidden">
      <img
        className="w-full h-full object-cover"
        src={item.img}
        alt={item.title}
        loading="lazy"
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-[#01e281] opacity-0 group-hover:opacity-60 transition duration-500"></div>

      {/* Hover link icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-14 h-14 rounded-md bg-transparent flex items-center justify-center transform scale-75 opacity-0 transition duration-500 group-hover:scale-100 group-hover:opacity-100">
          <FaLink className="text-white text-[2.5rem]" />
        </div>
      </div>
    </div>

    {/* Time + separator */}
    <h1 className="text-[#01e281] my-6 flex justify-between items-center">
      {item.time} <div className="h-[1px] w-[65%] bg-[#122d402b]" />
    </h1>

    {/* Blog description */}
    <h1 className="text-[24px] font-medium">{item.desc}</h1>
  </CarouselItem>
));

// ==================== Blog Component ====================
const Blog = () => {
  return (
    <div className="container mx-auto mt-40 ">
      {/* ==================== Banner Section ==================== */}
      <div className="justify-center items-center" style={bannerStyle}>
        {/* Left Side (Text + App Store Buttons) */}
        <div className="xl:w-[50%] pt-10">
          <h1 className="text-[42px] font-light">XtraSupermarket</h1>
          <h1 className="text-[40px] xl:text-[60px] font-bold py-10">Faster on Mobile</h1>
          <p className="text-[20px] xl:leading-[50px] mb-8">
            A supermarket is a self-service shop offering a wide variety of
            food, beverages and household products, organized into sections.
          </p>

          {/* Download App Buttons */}
          <div className="flex gap-8 pb-10">
            <motion.img
              className="w-[170px] h-[54px] rounded-[15px] cursor-pointer"
              src="/images/btn2.png"
              alt="btn2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            />
            <motion.img
              className="w-[170px] h-[54px] rounded-[15px] cursor-pointer"
              src="/images/btn-1.png"
              alt="btn1"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              viewport={{ once: true }}
            />
          </div>
        </div>

        {/* Right Side (Image) */}
        <img
          className="w-[40%] rounded-t-3xl hidden xl:block"
          src="/images/man-supermarket-as-shop-assistant-20446866.webp"
          alt="Supermarket Assistant"
          loading="lazy"
        />
      </div>

      {/* ==================== Blog Carousel Section ==================== */}
      <div className="pt-20">
        <h1 className="text-[36px] pb-5 justify-center xl:justify-start font-bold flex ">
          Latest{" "}
          <span
            className="text-[#01e281] ml-2 relative inline-block  
              after:content-[''] after:absolute after:bottom-1 after:left-[5px]
              after:w-60 after:h-[30%]
              after:bg-[#01e281] after:opacity-20 after:rounded-md after:z-[1]"
          >
            News & Blog
          </span>
        </h1>

        <Carousel className="relative w-full mt-16">
          <CarouselContent className="-ml-[8px] flex justify-between w-full pt-10">
            {blogs.map((item) => (
              <BlogItem key={item.img} item={item} />
            ))}
          </CarouselContent>

          {/* Carousel navigation buttons */}
          <CarouselPrevious className="absolute left-[5%] xl:left-[90%] top-[-5%] -translate-y-1/2" />
          <CarouselNext className="absolute right-[5%] xl:left-[95%] top-[-5%] -translate-y-1/2" />
        </Carousel>
      </div>
    </div>
  );
};

// ==================== Export component ====================
export default Blog;
