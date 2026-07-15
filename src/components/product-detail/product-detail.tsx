import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../cart-context/CartContext";
import { toast } from "react-toastify";

interface Variant {
  _id: string;
  variant_id: string;
  product_id: string;
  variant_name: string;
  long_description: string;
  price: number;
  size: string | null;
  color: string | null;
  fragrance: string | null;
  shape: string | null;
  weight: number | null;
  burn_time: number | null;
  stock: number;
  sku: string | null;
  images: string[];
}

interface CartItem {
  product_variant_id: string;
  user_id: string;
  name: string;
  amount: number;
  quantity: number;
  image: string;
  size: string | null;
  color: string | null;
  fragrance: string | null;
}

export default function ProductDetail_() {
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshCart } = useCart();

  const productDetail = location.state?.product;
console.log('lalalalaa',productDetail)
  const [variants, setVariants] = useState<Variant[]>([]);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [userId, setUserId] = useState<string>("user123");
  const [activeTab, setActiveTab] = useState("description");
  const [loading, setLoading] = useState(true);
const token = sessionStorage.getItem("token");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedFragrance, setSelectedFragrance] = useState<string | null>(null);

  // ── Fetch variants ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!productDetail) return;

    const userData = sessionStorage.getItem("user");
    if (userData) setUserId(JSON.parse(userData).id);

    const fetchVariants = async () => {
      try {
        const res = await fetch(
          `https://hridaya-customer-backend-production.up.railway.app/api/auth/variants/${productDetail.product_id}`
        );
        const json = await res.json();

        // API returns { success: true, data: [...] }
        const data: Variant[] = json.success ? json.data : json;

        setVariants(data);

        if (data.length > 0) {
          setMainImage(data[0].images?.[0] || "");
          // Pre-select the first size so a variant is active immediately
          if (data[0].size) setSelectedSize(data[0].size);
        }
      } catch (err) {
        console.error("Error fetching variants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVariants();
  }, [productDetail]);

  // ── Reset downstream selections when parent changes ─────────────────────────
  useEffect(() => {
    setSelectedColor(null);
    setSelectedFragrance(null);
  }, [selectedSize]);

  useEffect(() => {
    setSelectedFragrance(null);
  }, [selectedColor]);

  // ── Derived option lists ─────────────────────────────────────────────────────
  const sizes = Array.from(new Set(variants.map((v) => v.size))).filter(Boolean) as string[];

  const filteredBySize = selectedSize
    ? variants.filter((v) => v.size === selectedSize)
    : variants;

  const colors = Array.from(new Set(filteredBySize.map((v) => v.color))).filter(
    Boolean
  ) as string[];

  const filteredBySizeColor =
    selectedColor
      ? filteredBySize.filter((v) => v.color === selectedColor)
      : filteredBySize;

  const fragrances = Array.from(
    new Set(filteredBySizeColor.map((v) => v.fragrance))
  ).filter(Boolean) as string[];

  const filteredVariants = filteredBySizeColor.filter((v) =>
    selectedFragrance ? v.fragrance === selectedFragrance : true
  );

  const currentVariant: Variant | null = filteredVariants[0] ?? null;

  const images: string[] = currentVariant?.images ?? [];
  const totalAmount = (currentVariant?.price ?? 0) * quantity;

  // ── Quantity ─────────────────────────────────────────────────────────────────
  const increaseQty = () => setQuantity((q) => q + 1);
  const decreaseQty = () => setQuantity((q) => Math.max(1, q - 1));

  // ── Add to cart ──────────────────────────────────────────────────────────────
  const handleAddToCart = async () => {
    if (!currentVariant) return;

    const item: CartItem = {
      product_variant_id: currentVariant.variant_id,
      user_id: userId,
      name: productDetail.name,
      amount: totalAmount,
      quantity,
      image: mainImage || productDetail.image,
      size: selectedSize,
      color: selectedColor,
      fragrance: selectedFragrance,
    };
console.log(item,'item455454')
    try {
      const res = await fetch(
        "https://hridaya-customer-backend-production.up.railway.app/api/auth/addToCart",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" ,
              Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(item),
         
        }
      );
      const data = await res.json();
      refreshCart();

      if (data.success) {
        toast.success(data.message);
        navigate("/cartList");
      } else {
        toast.error(data.message || "Failed to add item");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to add item");
    }
  };

  // ── Loading / missing product ────────────────────────────────────────────────
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-accent border-t-transparent" />
      </div>
    );

  if (!productDetail)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Product not found.
      </div>
    );

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="container mx-auto px-4 py-20 mt-20">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* ── Images ── */}
        <div className="lg:w-1/2 flex flex-col lg:flex-row gap-4">
          {/* Main image */}
          <div className="flex-1 order-1 lg:order-2">
            {mainImage ? (
              <img
                src={`https://res.cloudinary.com/feqmtduq/image/upload/${mainImage}`}
                alt={currentVariant?.variant_name}
                className="w-full h-[500px] object-cover rounded-2xl shadow-md"
              />
            ) : (
              <div className="w-full h-[420px] bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                No image available
              </div>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex flex-row lg:flex-col gap-2 order-2 lg:order-1 overflow-x-auto lg:overflow-y-auto max-h-[420px]">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={`https://res.cloudinary.com/feqmtduq/image/upload/${img}`}
                alt={`Thumbnail ${idx + 1}`}
                className={`w-20 h-20 flex-shrink-0 object-cover rounded-lg cursor-pointer border-2 transition ${
                  mainImage === img ? "border-accent" : "border-gray-200 hover:border-gray-400"
                }`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        {/* ── Details ── */}
        <div className="lg:w-1/2 flex flex-col gap-2">
          {currentVariant ? (
            <>
              {/* Name & meta */}
              <div>
                <h1 className="text-3xl font-bold mb-1">{currentVariant.variant_name}</h1>
                <p className="text-gray-500 text-sm">{currentVariant.shape}</p>
              </div>

              {/* Price */}
              <p className="text-2xl font-semibold text-accent">
                Rs. {currentVariant.price.toLocaleString()}
              </p>

              {/* Specs grid */}
              {/* Specifications */}
<div className=" text-sm space-y-2">

  {/* First Row */}
  <div className="flex flex-wrap gap-4">
    <span><strong>Weight:</strong> {currentVariant.weight} g</span>
    <span><strong>Burn Time:</strong> {currentVariant.burn_time} hrs</span>
    <span><strong>Size:</strong> {currentVariant.size}</span>
  </div>

  {/* Second Row */}
  <div className="flex flex-wrap gap-4">
    
    <span>
      <strong>Stock:</strong> {currentVariant.stock} left
    </span>
   
  </div>

</div>

              {/* Options */}
              <div className="flex flex-col gap-3">
                <h2 className="font-semibold text-gray-700">Options</h2>

                {sizes.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Size</p>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition ${
                            selectedSize === size
                              ? "bg-accent text-white border-accent"
                              : "border-gray-300 hover:border-accent"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {colors.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Color</p>
                    <div className="flex flex-wrap gap-2">
                      {colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition capitalize ${
                            selectedColor === color
                              ? "bg-accent text-white border-accent"
                              : "border-gray-300 hover:border-accent"
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {fragrances.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Fragrance</p>
                    <div className="flex flex-wrap gap-2">
                      {fragrances.map((fragrance) => (
                        <button
                          key={fragrance}
                          onClick={() => setSelectedFragrance(fragrance)}
                          className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition capitalize ${
                            selectedFragrance === fragrance
                              ? "bg-accent text-white border-accent"
                              : "border-gray-300 hover:border-accent"
                          }`}
                        >
                          {fragrance}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity + total */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 border rounded-lg px-2 py-1">
                  <button
                    onClick={decreaseQty}
                    className="w-8 h-8 flex items-center justify-center text-lg font-bold hover:bg-gray-100 rounded transition"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={increaseQty}
                    className="w-8 h-8 flex items-center justify-center text-lg font-bold hover:bg-gray-100 rounded transition"
                  >
                    +
                  </button>
                </div>
                <p className="text-lg font-semibold">
                  Total:{" "}
                  <span className="text-accent">Rs. {totalAmount.toLocaleString()}</span>
                </p>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                disabled={currentVariant.stock === 0}
                className={`bg-accent text-white py-3 px-8 rounded-xl font-semibold text-base transition w-full md:w-auto ${
                  currentVariant.stock === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-accent-dark active:scale-95"
                }`}
              >
                {currentVariant.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </>
          ) : (
            <div className="mt-4 p-4 bg-red-50 rounded-lg text-red-500 text-sm">
              No variant matches your selection. Please choose a different combination.
            </div>
          )}


        </div>
        
      </div>
          {/* Description tab */}
<div className="mt-4 m-2 border-t pt-6 w-full">
  <div className="flex gap-4 border-b pb-2 mb-4 w-full">
    <button
      className={`pb-2 font-medium border-b-2 transition ${
        activeTab === "description"
          ? "border-accent text-accent"
          : "border-transparent text-gray-500 hover:text-accent"
      }`}
      onClick={() => setActiveTab("description")}
    >
      Description
    </button>
  </div>

  {activeTab === "description" && (
    <div className="w-full">
      <p className="text-gray-600 text-sm leading-relaxed w-full">
        {currentVariant?.long_description ??
          "Select a variant to see its description."}
      </p>
    </div>
  )}
</div>
      {/* ── All variants summary ── */}
      {variants.length > 1 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold mb-6">All Variants</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {variants.map((v) => (
              <div
                key={v.variant_id}
                onClick={() => {
                  setSelectedSize(v.size);
                  setSelectedColor(v.color);
                  setSelectedFragrance(v.fragrance);
                  setMainImage(v.images?.[0] || "");
                }}
                className={`cursor-pointer rounded-xl border-2 p-4 flex gap-4 transition ${
                  currentVariant?.variant_id === v.variant_id
                    ? "border-accent bg-accent/5"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <img
                  src={`https://res.cloudinary.com/feqmtduq/image/upload/${v.images?.[0]}`}
                  alt={v.variant_name}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                />
                <div className="text-sm">
                  <p className="font-semibold">{v.variant_name}</p>
                  <p className="text-accent font-medium">Rs. {v.price.toLocaleString()}</p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {[v.size, v.color, v.fragrance].filter(Boolean).join(" · ")}
                  </p>
                  <p className={`text-xs mt-0.5 ${v.stock > 0 ? "text-green-500" : "text-red-400"}`}>
                    {v.stock > 0 ? `${v.stock} in stock` : "Out of stock"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
