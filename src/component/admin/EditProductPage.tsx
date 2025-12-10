import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { FiTag, FiDollarSign } from "react-icons/fi";
import { useNavigate } from "react-router";
import { useAppSelector, useAppDispatch } from "../../store/hook";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { AddProduct } from "../../store/AddProductSlice";
import { RootState } from "../../store";
import { DeleteProduct, EditProduct } from "../../store/UpdataProduct";

interface IItem {
  name: string;
  description: string;
  original_price: string;
  discount: number;
  stock: number;
  categories: string[];
  tags: string[];
  final_price?: string;
  img: File[];
}

export default function EditProductPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [editopen, setEditopen] = useState(false);
  const { products: items } = useAppSelector(
    (state: RootState) => state.product
  );
  // ============================
  //   INITIAL FORM STATE
  // ============================
  const [form, setForm] = useState<IItem>({
    name: "",
    description: "",
    original_price: "",
    discount: 0,
    stock: 0,
    categories: [],
    tags: [],
    final_price: "0",
    img: [],
  });

  // ============================
  //   ITEMS (Placeholder)
  // ============================
  // const items = useAppSelector((s) => s.products?.items || []);

  const handleDelete = (id: number) => {
    dispatch(DeleteProduct(id));
    console.log("delete", id);
  };

  // ============================
  //   BASIC TEXT HANDLER
  // ============================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ============================
  //   FILE UPLOAD HANDLER
  // ============================
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm((prev) => ({ ...prev, img: [...prev.img, ...e.target.files!] }));
    }
  };

  // ============================
  //   PRICE AUTO CALC
  // ============================
  const handleChangePrice = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      const original = parseFloat(updated.original_price) || 0;
      const discount = parseFloat(updated.discount.toString()) || 0;

      const final = original - (original * discount) / 100;

      return { ...updated, final_price: final.toFixed(2) };
    });
  };

  // ============================
  //   SUBMIT
  // ============================
const handleSave = () => {
  if (editopen) {
    // تحديث المنتج
    dispatch(EditProduct(form));
  } else {
    // إضافة منتج جديد
    dispatch(AddProduct(form));
  }

  // إعادة تعيين الفورم بعد الحفظ
  setForm({
    name: "",
    description: "",
    original_price: "",
    discount: 0,
    stock: 0,
    categories: [],
    tags: [],
    final_price: "0",
    img: [],
  });
  setEditopen(false);
};
  const handleEditClick = (item: any) => {
    setEditopen(true); // تفعيل وضع التعديل
    setForm({
      ...item,
      img: [], // الصور الجديدة سيتم رفعها إذا اختار المستخدم
    });
  };

  const categoriesList = [
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

  const tagsList = ["Pasta", "Sauce", "Cowboy", "Steak", "Burgers", "Spray"];

  return (
    <div className="min-h-screen">
      {/* ======= HEADER ======= */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
          Product Admin Dashboard
        </h1>
        <div className="mt-3 w-24 h-1.5 bg-gradient-to-r from-blue-700 to-green-700 rounded-full"></div>
      </div>

      {/* ======= FORM ======= */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="rounded-3xl shadow-2xl backdrop-blur-md bg-white/40 border border-green-300 mb-10">
          <CardContent className="space-y-6 p-6">
            <h2 className="text-2xl font-bold text-green-800">Add Product</h2>

            {/* Name */}
            <div className="space-y-2">
              <label className="font-semibold text-green-600">
                Product Name
              </label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Product Name"
                className="border-green-400 h-12 rounded-2xl"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="font-semibold text-green-600">
                Description
              </label>
              <Textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description..."
                className="border-green-400 h-32 rounded-2xl resize-none"
              />
            </div>

            {/* Categories + Tags */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-green-600">
                  Categories
                </label>
                <Select
                  onValueChange={(val) =>
                    setForm((prev) => ({
                      ...prev,
                      categories: prev.categories.includes(val)
                        ? prev.categories
                        : [...prev.categories, val],
                    }))
                  }
                >
                  <SelectTrigger className="h-12 rounded-2xl border-green-400">
                    <SelectValue placeholder="Select Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {categoriesList.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="font-semibold text-green-600">Tags</label>
                <Select
                  onValueChange={(val) =>
                    setForm((prev) => ({
                      ...prev,
                      tags: prev.tags.includes(val)
                        ? prev.tags
                        : [...prev.tags, val],
                    }))
                  }
                >
                  <SelectTrigger className="h-12 rounded-2xl border-green-400">
                    <SelectValue placeholder="Select Tags" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {tagsList.map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Prices */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="font-semibold text-green-600">
                  Original Price
                </label>
                <Input
                  name="original_price"
                  type="number"
                  value={form.original_price}
                  onChange={handleChangePrice}
                  placeholder="Original Price"
                  className="border-green-400 h-12 rounded-2xl"
                />
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-green-600">
                  Final Price
                </label>
                <Input
                  value={form.final_price}
                  disabled
                  className="border-green-400 bg-gray-100 h-12 rounded-2xl"
                />
              </div>
            </div>

            {/* Discount + Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="font-semibold text-green-600">
                  Discount (%)
                </label>
                <Input
                  name="discount"
                  type="number"
                  value={form.discount}
                  onChange={handleChangePrice}
                  placeholder="Discount %"
                  className="border-green-400 h-12 rounded-2xl"
                />
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-green-600">Stock</label>
                <Input
                  name="stock"
                  type="number"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="Stock"
                  className="border-green-400 h-12 rounded-2xl"
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="font-semibold text-green-600">
                Product Image
              </label>
              <Input
                type="file"
                onChange={handleFileChange}
                className="border-green-400 h-12 rounded-2xl"
              />
            </div>

            {/* Buttons */}
            <motion.button
              onClick={handleSave}
              className="py-3 rounded-2xl bg-gradient-to-r from-green-500 to-green-700 text-white text-lg font-semibold shadow-lg"
            >
              {editopen ? "Update Product" : "Save Product"}
            </motion.button>
          </CardContent>
        </Card>
      </motion.div>

      {/* PRODUCTS LIST */}
      <div className="grid gap-6">
        <AnimatePresence>
          {items.map((item: any) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 border border-green-300 bg-white/40 shadow-xl rounded-3xl flex items-center gap-6">
                {/* ========== Image ========== */}
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-green-500 relative">
                  <img
                    src={item.img_url}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* ========== Info Section ========== */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-green-800">
                    {item.name}
                  </h3>
                  <p className="text-green-700 text-sm">{item.description}</p>

                  {/* Prices */}
                  <div className="flex gap-2 mt-2">
                    <Badge>{item.final_price}</Badge>
                    <Badge className="line-through">
                      {item.original_price}
                    </Badge>
                    {item.discount > 0 && <Badge>-{item.discount}%</Badge>}
                  </div>

                  {/* Stock */}
                  <div className="mt-2">
                    <Badge className="bg-yellow-200 text-yellow-800">
                      Stock: {item.stock}
                    </Badge>
                  </div>

                  {/* Categories */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.categories?.map((cat: string, i: number) => (
                      <Badge key={i} className="bg-green-200 text-green-800">
                        {cat}
                      </Badge>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {item.tags?.map((tag: string, i: number) => (
                      <Badge key={i} className="bg-blue-200 text-blue-800">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* ========== Action Buttons ========== */}
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={() => handleEditClick(item)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-2xl"
                  >
                    Edit
                  </Button>

                  <Button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-2xl"
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
