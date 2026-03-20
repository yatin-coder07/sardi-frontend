"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ApiFetch } from "@/lib/ApiFetch";

export default function PaymentCheckoutForm({
  isOpen,
  setIsOpen,
  items,
  totalAmount,
}) {
  const [form, setForm] = useState({
    name: "",
    phone_number: "",
    address: "",
    secondary_address: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePayment = async () => {
    console.log("FORM DATA:", form); // 🔥 DEBUG

    try {
      setLoading(true);

      const res = await ApiFetch(`/api/orders/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          items,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Something went wrong");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: data.amount,
        currency: "INR",
        name: "Premium Kurtis",
        description: "Order Payment",
        order_id: data.razorpay_order_id,

        handler: async function (response) {
          const verifyRes = await ApiFetch(`/api/orders/verify-payment/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();
          alert(verifyData.status);

          setIsOpen(false);
        },

        prefill: {
          name: form.name,
          contact: form.phone_number,
        },

        theme: {
          color: "#2563eb",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", function () {
        alert("Payment failed ❌");
      });

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50"
        >
          <motion.div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">
                Delivery Details
              </h2>
              <button onClick={() => setIsOpen(false)}>✕</button>
            </div>

            <div className="space-y-4">

              <input
                name="name"
                value={form.name}
                placeholder="Full Name"
                className="w-full border p-3 rounded-xl"
                onChange={handleChange}
              />

              <input
                name="phone_number"
                value={form.phone_number}
                placeholder="Phone Number"
                className="w-full border p-3 rounded-xl"
                onChange={handleChange}
              />

              <textarea
                name="address"
                value={form.address}
                placeholder="Primary Address"
                className="w-full border p-3 rounded-xl"
                onChange={handleChange}
              />

              <input
                name="secondary_address"
                value={form.secondary_address}
                placeholder="Secondary Address"
                className="w-full border p-3 rounded-xl"
                onChange={handleChange}
              />

              <input
                name="landmark"
                value={form.landmark}
                placeholder="Landmark"
                className="w-full border p-3 rounded-xl"
                onChange={handleChange}
              />

              <input
                name="city"
                value={form.city}
                placeholder="City"
                className="w-full border p-3 rounded-xl"
                onChange={handleChange}
              />

              <input
                name="state"
                value={form.state}
                placeholder="State"
                className="w-full border p-3 rounded-xl"
                onChange={handleChange}
              />

              <input
                name="pincode"
                value={form.pincode}
                placeholder="Pincode"
                className="w-full border p-3 rounded-xl"
                onChange={handleChange}
              />

            </div>

            <motion.button
              onClick={handlePayment}
              disabled={loading}
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl"
            >
              {loading ? "Processing..." : `Proceed to Pay ₹${totalAmount}`}
            </motion.button>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}