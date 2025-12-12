// ============================================
// EditProductPage.tsx - Enhanced UI Version
// ============================================
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
} from "../../store/UpdataProductSlice";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editopen, setEditopen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { data: items = [], isLoading, refetch } = useGetProductsQuery();
  console.log(items);

  const [addProduct, { isLoading: isAdding, isSuccess: isAddSuccess }] =
    useAddProductMutation();
  const [updateProduct, { isLoading: isUpdating, isSuccess: isUpdateSuccess }] =
    useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

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

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id).unwrap();
      console.log("✅ تم حذف المنتج بنجاح");
    } catch (error) {
      console.error("❌ خطأ في حذف المنتج:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm((prev) => ({ ...prev, img: Array.from(e.target.files!) }));
    }
  };

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

  const handleSave = async () => {
    try {
      if (editopen && editingId) {
        await updateProduct({
          id: editingId,
          data: form,
        }).unwrap();
        console.log("✅ تم تحديث المنتج بنجاح");
      } else {
        await addProduct(form).unwrap();
        console.log("✅ تم إضافة المنتج بنجاح");
      }

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
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setEditopen(false);
      setEditingId(null);
    } catch (error) {
      console.error("❌ خطأ في حفظ المنتج:", error);
    }
  };

  const handleEditClick = (item: any) => {
    window.scrollTo(0, 0);
    setEditopen(true);
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description,
      original_price: item.original_price,
      discount: item.discount,
      stock: item.stock,
      categories: item.categories || [],
      tags: item.tags || [],
      final_price: item.final_price,
      img: [],
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 p-6">
      {/* ======= HEADER ======= */}
      <motion.div
        className="mb-10 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-emerald-700 via-teal-600 to-green-700 bg-clip-text text-transparent mb-3">
          Product Admin Dashboard
        </h1>
        <p className="text-gray-600 text-lg">Manage your products with ease</p>
        <div className="mt-4 mx-auto w-32 h-1.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-green-600 rounded-full shadow-lg"></div>
      </motion.div>

      {/* ======= FORM ======= */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="rounded-3xl shadow-2xl backdrop-blur-xl bg-white/90 border-2 border-emerald-200 mb-12 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <span className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                {editopen ? "✏️" : "➕"}
              </span>
              {editopen ? "Edit Product" : "Add New Product"}
            </h2>
          </div>

          <CardContent className="space-y-6 p-8">
            {/* Name */}
            <motion.div
              className="space-y-2"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <label className="font-bold text-emerald-700 text-sm uppercase tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                Product Name
              </label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter product name..."
                className="border-2 border-emerald-300 h-14 rounded-2xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
              />
            </motion.div>

            {/* Description */}
            <motion.div
              className="space-y-2"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <label className="font-bold text-emerald-700 text-sm uppercase tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                Description
              </label>
              <Textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your product..."
                className="border-2 border-emerald-300 h-32 rounded-2xl resize-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
              />
            </motion.div>

            {/* Categories + Tags */}
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <label className="font-bold text-emerald-700 text-sm uppercase tracking-wide flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                  Categories
                </label>
                <Select
                  value={undefined}
                  onValueChange={(val) =>
                    setForm((prev) => ({
                      ...prev,
                      categories: prev.categories.includes(val)
                        ? prev.categories
                        : [...prev.categories, val],
                    }))
                  }
                >
                  <SelectTrigger className="h-14 rounded-2xl border-2 border-emerald-300 focus:border-emerald-500">
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
                <div className="flex flex-wrap gap-2 mt-3">
                  {form.categories.map((cat, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Badge
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white cursor-pointer hover:from-emerald-600 hover:to-teal-600 px-4 py-2 text-sm font-semibold shadow-md"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            categories: prev.categories.filter(
                              (c) => c !== cat
                            ),
                          }))
                        }
                      >
                        {cat} ×
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <label className="font-bold text-emerald-700 text-sm uppercase tracking-wide flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-teal-600 rounded-full"></span>
                  Tags
                </label>
                <Select
                  value={undefined}
                  onValueChange={(val) =>
                    setForm((prev) => ({
                      ...prev,
                      tags: prev.tags.includes(val)
                        ? prev.tags
                        : [...prev.tags, val],
                    }))
                  }
                >
                  <SelectTrigger className="h-14 rounded-2xl border-2 border-emerald-300 focus:border-emerald-500">
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
                <div className="flex flex-wrap gap-2 mt-3">
                  {form.tags.map((tag, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Badge
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white cursor-pointer hover:from-blue-600 hover:to-indigo-600 px-4 py-2 text-sm font-semibold shadow-md"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            tags: prev.tags.filter((t) => t !== tag),
                          }))
                        }
                      >
                        #{tag} ×
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Prices */}
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                className="space-y-2"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <label className="font-bold text-emerald-700 text-sm uppercase tracking-wide flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                  Original Price
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 font-bold text-lg">
                    $
                  </span>
                  <Input
                    name="original_price"
                    type="number"
                    value={form.original_price}
                    onChange={handleChangePrice}
                    placeholder="0.00"
                    className="border-2 border-emerald-300 h-14 rounded-2xl pl-10 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                  />
                </div>
              </motion.div>

              <motion.div
                className="space-y-2"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <label className="font-bold text-emerald-700 text-sm uppercase tracking-wide flex items-center gap-2">
                  <span className="w-2 h-2 bg-teal-600 rounded-full"></span>
                  Final Price
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-600 font-bold text-lg">
                    $
                  </span>
                  <Input
                    value={form.final_price}
                    disabled
                    className="border-2 border-teal-300 bg-gradient-to-r from-teal-50 to-emerald-50 h-14 rounded-2xl pl-10 font-bold text-teal-700 text-lg"
                  />
                </div>
              </motion.div>
            </div>

            {/* Discount + Stock */}
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                className="space-y-2"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <label className="font-bold text-emerald-700 text-sm uppercase tracking-wide flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
                  Discount (%)
                </label>
                <div className="relative">
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-600 font-bold text-lg">
                    %
                  </span>
                  <Input
                    name="discount"
                    type="number"
                    value={form.discount}
                    onChange={handleChangePrice}
                    placeholder="0"
                    className="border-2 border-orange-300 h-14 rounded-2xl pr-10 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                  />
                </div>
              </motion.div>

              <motion.div
                className="space-y-2"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <label className="font-bold text-emerald-700 text-sm uppercase tracking-wide flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                  Stock
                </label>
                <Input
                  name="stock"
                  type="number"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="Available quantity"
                  className="border-2 border-purple-300 h-14 rounded-2xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                />
              </motion.div>
            </div>

            {/* File Upload */}
            <motion.div
              className="space-y-2"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <label className="font-bold text-emerald-700 text-sm uppercase tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 bg-pink-600 rounded-full"></span>
                Product Images
              </label>
              <div className="relative">
                <Input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="border-2 border-pink-300 h-14 rounded-2xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-pink-100 file:text-pink-700 file:font-semibold hover:file:bg-pink-200"
                />
              </div>
              {form.img.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-200"
                >
                  <span className="w-8 h-8 bg-emerald-200 rounded-full flex items-center justify-center font-bold text-emerald-700">
                    {form.img.length}
                  </span>
                  <span className="font-semibold">صورة محددة</span>
                </motion.div>
              )}
            </motion.div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <motion.button
                onClick={handleSave}
                disabled={isAdding || isUpdating}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white text-lg font-bold shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isAdding || isUpdating
                  ? "⏳ جاري الحفظ..."
                  : editopen
                  ? "✓ Update Product"
                  : "✓ Save Product"}
              </motion.button>

              {editopen && (
                <motion.button
                  onClick={() => {
                    setEditopen(false);
                    setEditingId(null);
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
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                >
                  ✕ Cancel
                </motion.button>
              )}
            </div>

            {/* Success Messages */}
            <AnimatePresence>
              {isAddSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-2xl font-bold text-center shadow-lg"
                >
                  ✅ تم إضافة المنتج بنجاح!
                </motion.div>
              )}
              {isUpdateSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-4 rounded-2xl font-bold text-center shadow-lg"
                >
                  ✅ تم تحديث المنتج بنجاح!
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* PRODUCTS LIST */}
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-emerald-800 mb-6 flex items-center gap-3">
          <span className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center">
            📦
          </span>
          Products List
        </h2>

        <div className="grid gap-6">
          <AnimatePresence>
            {items.map((item: any) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                whileHover={{ scale: 1.01, y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 border-2 border-emerald-200 bg-white/95 shadow-xl hover:shadow-2xl rounded-3xl flex flex-col md:flex-row items-center gap-6 backdrop-blur-sm transition-all">
                  {/* ========== Image ========== */}
                  <motion.div
                    className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-emerald-400 shadow-lg relative flex-shrink-0"
                    whileHover={{ scale: 1.1, rotate: 2 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={item.img_url || "/placeholder.png"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  </motion.div>

                  {/* ========== Info Section ========== */}
                  <div className="flex-1 space-y-3">
                    <h3 className="text-2xl font-black text-emerald-800 flex items-center gap-2">
                      {item.name}
                      {item.stock < 10 && (
                        <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                          Low Stock!
                        </span>
                      )}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.description}
                    </p>

                    {/* Prices */}
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 text-base font-bold shadow-md">
                        ${item.final_price}
                      </Badge>
                      <Badge className="bg-gray-300 text-gray-600 line-through px-4 py-2 text-base">
                        ${item.original_price}
                      </Badge>
                      {item.discount > 0 && (
                        <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 text-base font-bold shadow-md">
                          -{item.discount}%
                        </Badge>
                      )}
                    </div>

                    {/* Stock */}
                    <div>
                      <Badge
                        className={`px-4 py-2 text-sm font-bold ${
                          item.stock > 50
                            ? "bg-green-200 text-green-800"
                            : item.stock > 10
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        📦 Stock: {item.stock}
                      </Badge>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-2">
                      {item.categories?.map((cat: string, i: number) => (
                        <Badge
                          key={i}
                          className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 px-3 py-1 border border-emerald-300"
                        >
                          {cat}
                        </Badge>
                      ))}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {item.tags?.map((tag: string, i: number) => (
                        <Badge
                          key={i}
                          className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-3 py-1 border border-blue-300"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* ========== Action Buttons ========== */}
                  <div className="flex flex-col gap-3 flex-shrink-0">
                    <motion.button
                      onClick={() => handleEditClick(item)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
                    >
                      ✏️ Edit
                    </motion.button>

                    <motion.button
                      onClick={() => handleDelete(item.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
                    >
                      🗑️ Delete
                    </motion.button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
