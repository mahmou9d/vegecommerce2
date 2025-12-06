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
import { clearEditingProduct } from "../../store/editingProductSlice";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";

interface IItem {
  id?: number;
  name: string;
  description: string;
  original_price: string;
  final_price: string;
  discount: number;
  stock: number;
  img: string;
  imgFile?: File | null;
  categories: string[];
  tags: string[];
}

export default function EditProductPage() {
  const [items, setItems] = useState<IItem[]>([]);
  const editingProduct = useAppSelector((state) => state.editingProduct);
  const dispatch = useAppDispatch();

  const [form, setForm] = useState(editingProduct);
  const navigate = useNavigate();
  useEffect(() => {
    setForm(editingProduct); // كل مرة يتغير المنتج المختار
  }, [editingProduct]);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imgPreview = URL.createObjectURL(file);
      setForm((prev) => ({ ...prev, img: imgPreview, imgFile: file }));
    }
  };

  const handleSubmit = () => {
    if (editingProduct.id) {
      // Update existing product
      setItems((prev:any) =>
        prev.map((item:any) => (item.id === editingProduct.id ? form : item))
      );
      dispatch(clearEditingProduct()); // بعد التعديل امسح ال state
    } else {
      // Add new product
      const newItem = { ...form, id: Date.now() };
      setItems((prev:any) => [newItem, ...prev]);
    }

setForm({
  name: "",
  description: "",
  original_price: "",
  final_price: "",
  discount: 0,
  stock: 0,
  img: "",
  imgFile: null,
  categories: [],
  tags: [],
});

  };

  const handleDelete = (id?: number) => {
    if (!id) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };
  const handleChangePrice = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;

  setForm((prev) => {
    const updated = { ...prev, [name]: value };

    // حساب السعر النهائي تلقائياً
    const original = parseFloat(updated.original_price) || 0;
    const discount = parseFloat(updated.discount.toString()) || 0;

    const final = original - (original * discount) / 100;

    return { ...updated, final_price: final.toFixed(2) };
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
    <div className="p-8 min-h-screen bg-gradient-to-br from-green-50 to-white">
      <h1 className="text-4xl font-extrabold text-green-700 mb-8 text-center drop-shadow-md">
        Product Admin Dashboard
      </h1>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="rounded-3xl shadow-2xl backdrop-blur-md bg-white/30 border border-green-300 mb-10">
          <CardContent className="space-y-6 p-6">
            <h2 className="text-2xl font-bold text-green-800">Add Product</h2>

            {/* Product Name */}
            <div className="space-y-2">
              <label className="font-semibold text-green-500">
                Product Name
              </label>
              <Input
                name="name"
                placeholder="Product Name"
                value={form.name}
                onChange={handleChange}
                className="border-green-400 h-12 rounded-2xl focus:ring-2 focus:ring-green-600 focus:outline-none"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="font-semibold text-green-500">
                Description
              </label>
              <Textarea
                name="description"
                placeholder="Description..."
                value={form.description}
                onChange={handleChange}
                className="border-green-400 h-32 rounded-2xl p-3 focus:ring-2 focus:ring-green-600 focus:outline-none resize-none"
              />
            </div>

            {/* Prices */}
            <div className="grid grid-cols-2 gap-4">
              {/* Original Price */}
              <div className="space-y-2">
                <label className="font-semibold text-green-500">
                  Original Price
                </label>
                <Input
                  name="original_price"
                  type="number"
                  placeholder="Original Price"
                  value={form.original_price}
                  onChange={handleChangePrice}
                  className="border-green-400 h-12 rounded-2xl focus:ring-2 focus:ring-green-600 focus:outline-none"
                />
              </div>

              {/* Final Price (Auto Calculated) */}
              <div className="space-y-2">
                <label className="font-semibold text-green-500">
                  Final Price
                </label>
                <Input
                  name="final_price"
                  type="number"
                  placeholder="Final Price"
                  value={form.final_price}
                  disabled
                  className="border-green-400 bg-gray-100 h-12 rounded-2xl focus:ring-2 focus:ring-green-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Discount */}
              <div className="space-y-2">
                <label className="font-semibold text-green-500">
                  Discount (%)
                </label>
                <Input
                  name="discount"
                  type="number"
                  placeholder="Discount %"
                  value={form.discount}
                  onChange={handleChangePrice}
                  className="border-green-400 h-12 rounded-2xl focus:ring-2 focus:ring-green-600 focus:outline-none"
                />
              </div>

              {/* Stock */}
              <div className="space-y-2">
                <label className="font-semibold text-green-500">Stock</label>
                <Input
                  name="stock"
                  type="number"
                  placeholder="Stock"
                  value={form.stock}
                  onChange={handleChange}
                  className="border-green-400 h-12 rounded-2xl focus:ring-2 focus:ring-green-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="font-semibold text-green-500">
                Product Image
              </label>
              <Input
                name="imgFile"
                type="file"
                onChange={handleFileChange}
                className="border-green-400 h-12 rounded-2xl focus:ring-2 focus:ring-green-600 focus:outline-none p-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-green-500">
                  Categories
                </label>
                <Select
                  onValueChange={(val) =>
                    setForm({
                      ...form,
                      categories: form.categories.includes(val)
                        ? form.categories
                        : [...form.categories, val],
                    })
                  }
                >
                  <SelectTrigger className="w-full h-12 rounded-2xl border-green-400 focus:ring-green-600">
                    <SelectValue placeholder="Select Categories" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {categoriesList.map((cat) => (
                        <SelectItem
                          className="p-3 hover:border-l-4 hover:border-green-500"
                          key={cat}
                          value={cat}
                        >
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="font-semibold text-green-500">Tags</label>
                <Select
                  onValueChange={(val) =>
                    setForm({
                      ...form,
                      tags: form.tags.includes(val)
                        ? form.tags
                        : [...form.tags, val],
                    })
                  }
                >
                  <SelectTrigger className="w-full h-12 rounded-2xl border-green-400 focus:ring-green-600">
                    <SelectValue placeholder="Select Tags" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {tagsList.map((tag) => (
                        <SelectItem
                          className="p-3 hover:border-l-4 hover:border-green-500"
                          key={tag}
                          value={tag}
                        >
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <motion.button
              onClick={handleSubmit}
              whileHover={{
                // scale: 1.05,
                boxShadow: "0px 8px 20px rgba(34,197,94,0.6)",
              }}
              whileTap={{
                // scale: 0.97,
                boxShadow: "0px 4px 10px rgba(34,197,94,0.4)",
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-green-500 to-green-700 text-white text-lg font-semibold shadow-lg transition-all duration-300"
            >
              Save Product
            </motion.button>
            <motion.button
              onClick={() => {
                navigate("/shop");
                window.scrollTo(0, 0);
              }}
              whileHover={{
                // scale: 1.05,
                boxShadow: "0px 8px 20px rgba(34,197,94,0.6)",
              }}
              whileTap={{
                // scale: 0.97,
                boxShadow: "0px 4px 10px rgba(34,197,94,0.4)",
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-green-500 to-green-700 text-white text-lg font-semibold shadow-lg transition-all duration-300"
            >
              Edit Products
            </motion.button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Products List */}
      <div className="grid gap-6">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 border border-green-300 bg-white/40 backdrop-blur-md shadow-xl rounded-3xl flex items-center gap-6 hover:shadow-2xl hover:scale-105 transform transition-all duration-300 relative">
                {/* Image with overlay */}
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-green-500 relative group">
                  <img src={item.img} className="w-full h-full object-cover" />
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-xs font-bold gap-1 transition-opacity rounded-full"
                  >
                    <div>Stock: {item.stock}</div>
                    {item.discount > 0 && <div>Discount: {item.discount}%</div>}
                  </motion.div>
                </div>

                {/* Info */}
                <div className="flex-1 space-y-1">
                  <h3 className="text-xl font-bold text-green-800">
                    {item.name}
                  </h3>
                  <p className="text-green-700 text-sm">{item.description}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge className="bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold px-3 py-1 rounded-full shadow-md flex items-center gap-1 hover:scale-110 transform transition-all">
                      <FiDollarSign className="w-3 h-3" /> {item.final_price}
                    </Badge>
                    <Badge className="bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold px-3 py-1 rounded-full shadow-md line-through flex items-center gap-1 hover:scale-110 transform transition-all">
                      <FiDollarSign className="w-3 h-3" /> {item.original_price}
                    </Badge>
                    {item.discount > 0 && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1 hover:scale-110 transform transition-all">
                        <FiTag className="w-3 h-3" /> -{item.discount}%
                      </Badge>
                    )}
                  </div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-2xl shadow-lg"
                  >
                    Delete
                  </Button>
                </motion.div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
