"use client";
export const dynamic = "force-dynamic";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ApiFetch } from "@/lib/ApiFetch";
import SkeletonLoading from "@/components/SkelitonLoading";
import PaymentCheckoutForm from "@/components/PaymentCheckoutForm";

export default function CartPage() {

  const [open , setOpen]=useState(false)
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    const res = await ApiFetch(`/api/cart/`);
    const data = await res.json();
    setCart(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeItem = async (id) => {
    await ApiFetch(`/api/cart/remove/${id}/`, {
      method: "DELETE",
    });
    fetchCart();
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return;

    await ApiFetch(`/api/cart/update/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity }),
    });
    fetchCart();
  };

  if (loading) return <SkeletonLoading/>

  const subtotal = cart.items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const shipping = 50;

  // ✅ FINAL TOTAL = SUBTOTAL ONLY (shipping discounted)
  const total = subtotal;

  return (
    <>
      <Navbar />

      <section className="p-4 md:p-8 bg-gray-50 min-h-screen">

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-semibold mb-6"
        >
          Shopping Cart
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-4">

            {cart.items.map((item, index) => {

              const image =
                item.product.images?.[0]?.image || "/placeholder.png";

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between bg-white p-4 rounded-md border"
                >

                  <div className="flex items-center gap-4">

                    <img
                      src={image}
                      className="w-16 h-16 object-cover rounded"
                    />

                    <div>
                      <p className="font-medium">
                        {item.product.product_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Rs. {item.product.price}
                      </p>
                    </div>

                  </div>

                  <div className="flex items-center border rounded">

                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      className="px-2 py-1 text-sm"
                    >
                      -
                    </button>

                    <span className="px-3 text-sm">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="px-2 py-1 text-sm"
                    >
                      +
                    </button>

                  </div>

                  <p className="font-medium">
                    Rs. {item.product.price * item.quantity}
                  </p>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>

                </motion.div>
              );
            })}

          </div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-md border h-fit"
          >

            <h3 className="text-lg font-semibold mb-4">
              Summary
            </h3>

            <div className="space-y-2 text-sm">

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs. {subtotal}</span>
              </div>

              {/* ✅ Shipping shown as cut (offer applied) */}
              <div className="flex justify-between items-center">
                <span>Shipping</span>
                <div className="flex gap-2 items-center">
                  <span className="line-through text-gray-400">
                    Rs. {shipping}
                  </span>
                  <span className="text-green-600 font-medium">
                    Free
                  </span>
                </div>
              </div>

              {/* ✅ Final total = subtotal */}
              <div className="flex justify-between font-semibold text-base mt-4">
                <span>Total</span>
                <span>Rs. {total}</span>
              </div>

            </div>

            <button
              onClick={()=>setOpen(true)}
              className="w-full mt-6 bg-blue-600 text-white py-2 rounded"
            >
              Order now
            </button>

            <PaymentCheckoutForm
              isOpen={open}
              setIsOpen={setOpen}
              items={cart.items.map(item => ({
                product_id: item.product.id,
                quantity: item.quantity,
              }))}
              totalAmount={total}
            />

          </motion.div>

        </div>

      </section>
    </>
  );
}