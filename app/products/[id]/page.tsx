"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import SkeletonLoading from "@/components/SkelitonLoading";
import { ApiFetch } from "@/lib/ApiFetch";

export default function ProductDetailPage() {

  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState("");

  const [quantity, setQuantity] = useState(1);

  // ✅ NEW: user state
  const [user, setUser] = useState(null);

  useEffect(() => {

    const fetchData = async () => {
      try {
        // ✅ Fetch product
        const res = await ApiFetch(`/api/products/detail/${id}/`);
        const data = await res.json();
        setProduct(data);

        if (data.images?.length > 0) {
          setSelectedImage(data.images[0].image);
        }

        // ✅ Fetch user (will fail if not logged in)
        try {
          const userRes = await ApiFetch(`/api/auth/user/`);
          if (userRes.ok) {
            const userData = await userRes.json();
            setUser(userData);
          }
        } catch (err) {
          console.log("User not logged in");
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, [id]);

  if (loading) return <SkeletonLoading/>;

  const addToCart = async () => {

    // ❌ NOT LOGGED IN
    if (!user) {
      alert("Please login to add items to cart");
     
      return;
    }

    // ❌ OUT OF STOCK
    if (product.product_availability === "Out Of Stock") {
      alert("This product is out of stock");
      return;
    }

    try {

      const res = await ApiFetch("/api/cart/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: quantity,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error:", data);
        alert("Error while adding the product to cart");
        return;
      }

      alert("Successfully added to cart");

    } catch (err) {
      console.error("Failed to add to cart", err);
    }
  };

  return (
    <>
      <nav><Navbar/></nav>

      <div className="min-h-screen bg-[#f7f7f7] p-4 md:p-10">

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10">

          {/* LEFT */}
          <div>

            <div className="w-full aspect-[4/5] bg-gray-200 overflow-hidden">
              <img src={selectedImage} className="w-full h-full object-cover" />
            </div>

            <div className="flex gap-3 mt-4 overflow-x-auto">
              {product.images?.map((img, index) => (
                <img
                  key={index}
                  src={img.image}
                  onClick={() => setSelectedImage(img.image)}
                  className={`w-20 h-24 object-cover cursor-pointer border ${
                    selectedImage === img.image
                      ? "border-black"
                      : "border-gray-300"
                  }`}
                />
              ))}
            </div>

          </div>

          {/* RIGHT */}
          <div className="bg-white p-6 md:p-10">

            <h1 className="text-2xl md:text-3xl font-semibold mb-4">
              {product.product_name}
            </h1>

            <p className="text-2xl text-orange-500 font-semibold mb-6">
              ₹ {product.price}
            </p>

            {/* SIZE */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-500 mb-2">FREE SIZE</p>
            </div>

            {/* DESCRIPTION */}
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">DETAILS</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {product.product_description}
              </p>
            </div>

            {/* AVAILABILITY */}
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">AVAILABILITY</p>
              <p className={`text-sm font-medium w-25 p-2 ${
                product.product_availability === "Out Of Stock"
                  ? "bg-red-600 text-white"
                  : "text-lg font-medium text-gray-500"
              }`}>
                {product.product_availability}
              </p>
            </div>

            {/* ✅ QUANTITY */}
            <div className="mb-6">
             
             
            </div>

            {/* ADD TO CART */}
            <button
              disabled={product.product_availability === "Out Of Stock"}
              className={`w-full py-3 mt-4 transition text-white ${
                product.product_availability === "Out Of Stock"
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#c58b5b] hover:opacity-90"
              }`}
              onClick={addToCart}
            >
              ADD TO CART
            </button>

          </div>

        </div>

      </div>
    </>
  );
}