import { TiHome } from "react-icons/ti";
import Product from "./Product";
import { IoIosArrowForward } from "react-icons/io";
import { Rating, RatingButton } from "../components/ui/shadcn-io/rating";
import { Button } from "../components/ui/button";
import { Slider } from "../components/ui/slider";
import { useCallback, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";
import React from "react";
import { TProduct } from "@/type/type";

const list = [
  "Bestsellers",
  "Breads & Sweats",
  "Cleaning Materials",
  "Fishes & Raw Meats",
  "Fruits & Vegetables",
  "Milks & Proteins",
  "Others",
  "Supermarket",
  "Uncategorized",
];

// ---------------------------
// Categories Component
// ---------------------------
const Categories = ({
  products,
  title,
}: {
  products: TProduct[];
  title: string;
}) => {
  const [range, setRange] = useState([0, 100]);
  const [perPage, setPerPage] = useState(8);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("Default");

  // ✅ Memoized filtered products (by price)
  const filteredProducts = useMemo(() => {
    return products.filter(
      (item) =>
        Number(item.final_price) >= range[0] &&
        Number(item.final_price) <= range[1]
    );
  }, [products, range]);

  // ✅ Memoized sorted products
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      if (sortBy === "Top Rated")
        return (b.average_rating as number) - (a.average_rating ?? 0);
      if (sortBy === "Popular") return b.stock - a.stock;
      if (sortBy === "Featured") return a.discount - b.discount;
      return 0;
    });
  }, [filteredProducts, sortBy]);

  // ✅ Pagination
  const totalPages = Math.ceil(sortedProducts.length / perPage);

  const visibleProducts = useMemo(() => {
    const startIndex = (page - 1) * perPage;
    return sortedProducts.slice(startIndex, startIndex + perPage);
  }, [sortedProducts, page, perPage]);

  // ✅ Showing text
  const showingText = useMemo(() => {
    if (visibleProducts.length === 0) return "No results";
    if (sortedProducts.length <= perPage)
      return `Showing all ${sortedProducts.length} results`;
    const startIndex = (page - 1) * perPage;
    return `Showing ${startIndex + 1}–${
      startIndex + visibleProducts.length
    } of ${sortedProducts.length} results`;
  }, [visibleProducts, sortedProducts, perPage, page]);

  // ✅ Handlers with useCallback
  const handleChangePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleFilter = useCallback(() => {
    setPage(1);
  }, []);

  return (
    <div>
      {/* Header breadcrumb section */}
      <div className="bg-[#f9f9f9] pt-20 pb-10">
        <div className="container px-5 mx-auto flex justify-between">
          <h1 className="xl:text-[24px] text-[#122d40] font-bold">{title}</h1>
          <div className="xl:text-[18px] flex items-center gap-3 font-medium">
            <TiHome />
            <IoIosArrowForward />
            Products
            <IoIosArrowForward />
            {title}
          </div>
        </div>
      </div>

      {/* Main content wrapper */}
      <div>
        <div className="flex flex-col container mx-auto pt-10">
          {/* Left content - products list */}
          <div className="container mx-auto">
            <div className="px-5">
              <h1 className="text-[36px] font-bold mb-5">{title}</h1>

              {/* Top bar */}
              <div className="flex flex-col items-center  xl:flex-row justify-between pb-5">
                {showingText}
                <div className="flex mt-5 xl:mt-0 gap-3">
                  {/* Per page select */}
                  <Select
                    defaultValue="8"
                    onValueChange={(value) => {
                      setPerPage(Number(value));
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[185px] h-[50px] rounded-3xl px-4 py-2 border-0">
                      <SelectValue placeholder="8 Products" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8">8 Products</SelectItem>
                      <SelectItem value="16">16 Products</SelectItem>
                      <SelectItem value="32">32 Products</SelectItem>
                      <SelectItem value="48">48 Products</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Sort select */}
                  <Select
                    onValueChange={(value) => setSortBy(value)}
                    defaultValue="Default"
                  >
                    <SelectTrigger className="w-[185px] h-[50px] rounded-3xl px-4 py-2 ">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Default">Default</SelectItem>
                      <SelectItem value="Top Rated">Top Rated</SelectItem>
                      <SelectItem value="Popular">Popular</SelectItem>
                      <SelectItem value="Featured">Featured</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col-reverse xl:flex-row">
            <div className="flex flex-col p-[10px] ">
              <div className="flex flex-wrap p-[10px] justify-between gap-y-12">
                {visibleProducts.map((product) => (
                  <Product key={product.id} item={product} />
                ))}
              </div>

              {/* Pagination */}
              {products.length > perPage && (
                <Pagination>
                  <PaginationContent>
                    {page > 1 && (
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={() => handleChangePage(page - 1)}
                          className="rounded-full flex items-center text-[20px] w-12 h-12 border text-black hover:bg-[#122d40] hover:text-[#01e281]"
                        />
                      </PaginationItem>
                    )}

                    {Array.from({ length: totalPages }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href="#"
                          isActive={page === i + 1}
                          onClick={() => handleChangePage(i + 1)}
                          className={`rounded-full border text-black text-[20px] w-12 h-12 hover:bg-[#122d40] hover:text-[#01e281] ${
                            page === i + 1 ? "bg-[#122d40] text-[#01e281]" : ""
                          }`}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    {page < totalPages && (
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={() => handleChangePage(page + 1)}
                          className="rounded-full w-12 h-12 border text-[20px] text-black hover:bg-[#122d40] hover:text-[#01e281]"
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              )}
            </div>
            {/* Right content - sidebar */}
            <div className="flex flex-col gap-10">
              {/* Filter by price */}
              <div className="bg-[#f1f2f6] my-6 xl:my-0 container mx-auto w-[95%] xl:w-[450px] p-8 rounded-[50px] flex flex-col justify-center items-center gap-5 pb-14 ">
                <h2 className="bg-[#01e281] text-[18px] relative flex-col items-center justify-center flex text-[#122d40] h-14 font-bold rounded-full px-6  w-full">
                  Filter by price
                  <span className="block h-[3px] absolute bottom-0 w-6 bg-black mt-1 rounded"></span>
                </h2>
                <Slider
                  defaultValue={[20, 80]}
                  value={range}
                  onValueChange={setRange}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-gray-700 font-medium">
                  Price: ${range[0]} — ${range[1]}
                </p>
                <Button
                  onClick={handleFilter}
                  className="w-3/4 text-[16px] rounded-full bg-[#01e281] hover:bg-[#122d40] text-[#122d40] hover:text-[#01e281] font-bold"
                >
                  Filter
                </Button>
              </div>

              {/* Product categories */}
              <div className="bg-[#f1f2f6] hidden container mx-auto w-[450px] p-8 rounded-[50px] xl:flex flex-col justify-center gap-5 pb-14 ">
                <h2 className="bg-[#01e281] text-[18px] relative flex-col items-center justify-center flex text-[#122d40] h-14 font-bold rounded-full px-6  w-full">
                  Product categories
                  <span className="block h-[3px] absolute bottom-0 w-6 bg-black mt-1 rounded"></span>
                </h2>
                <ul>
                  {list.map((item, i) => (
                    <li className="pt-4" key={i}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Featured products */}
              <div className="bg-[#f1f2f6] hidden container mx-auto w-[450px] p-8 rounded-[50px] xl:flex flex-col justify-center gap-5 pb-14 ">
                <h2 className="bg-[#01e281] text-[18px] relative flex-col items-center justify-center flex text-[#122d40] h-14 font-bold rounded-full px-6  w-full">
                  Featured products
                  <span className="block h-[3px] absolute bottom-0 w-6 bg-black mt-1 rounded"></span>
                </h2>
                <div>
                  {products.map((item) => (
                    <div
                      key={item.id}
                      className="p-2 flex items-center mt-3 border-b-slate-200"
                    >
                      <img
                        className="w-28 pr-2 rounded-3xl"
                        src={item.img_url}
                        alt={item.name}
                        loading="lazy"
                      />
                      <div>
                        <p className="font-extrabold">{item.name}</p>
                        <p className="font-extrabold py-2">
                          <Rating value={item.average_rating} readOnly>
                            {Array.from({ length: 5 }).map((_, index) => (
                              <RatingButton
                                className="text-yellow-500 text-[14px]"
                                key={index}
                              />
                            ))}
                          </Rating>
                        </p>
                        <p className="text-[14px]">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default React.memo(Categories);
