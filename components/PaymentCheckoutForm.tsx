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
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Phone validation
  const validate = () => {
    let newErrors = {};

    if (!/^\d{10}$/.test(form.phone_number)) {
      newErrors.phone_number = "Enter a valid 10-digit phone number";
    }

    if (!form.name) newErrors.name = "Name is required";
    if (!form.address && !form.secondary_address) {
      newErrors.address = "Provide at least one address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validate()) return;

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

      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error("Server returned HTML:", text);
        alert("Server error. Check backend.");
        return;
      }

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
          color: "#2563eb", // 🔵 blue theme
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl"
            initial={{ y: 80, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">
                Delivery Details
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-lg hover:scale-110 transition"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="text-base font-medium">
                  Full Name
                </label>
                <input
                  name="name"
                  placeholder="Enter your full name"
                  className="w-full border p-3 rounded-xl mt-1"
                  onChange={handleChange}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="text-base font-medium">
                  Phone Number (10 digits)
                </label>
                <input
                  name="phone_number"
                  placeholder="e.g. 9876543210"
                  className="w-full border p-3 rounded-xl mt-1"
                  onChange={handleChange}
                />
                {errors.phone_number && (
                  <p className="text-red-500 text-sm">
                    {errors.phone_number}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="text-base font-medium">
                  Primary Address
                </label>
                <textarea
                  name="address"
                  placeholder="House no, street, city, pincode"
                  className="w-full border p-3 rounded-xl mt-1"
                  onChange={handleChange}
                />
              </div>

              {/* Secondary Address */}
              <div>
                <label className="text-base font-medium">
                  Secondary Address (use if primary is unavailable)
                </label>
                <input
                  name="secondary_address"
                  placeholder="Alternative delivery address"
                  className="w-full border p-3 rounded-xl mt-1"
                  onChange={handleChange}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm">
                    {errors.address}
                  </p>
                )}
              </div>

              {/* Landmark */}
              <div>
                <label className="text-base font-medium">
                  Nearby Landmark (optional)
                </label>
                <input
                  name="landmark"
                  placeholder="e.g. Near temple / mall"
                  className="w-full border p-3 rounded-xl mt-1"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handlePayment}
              disabled={loading}
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold shadow-lg hover:bg-blue-700 transition"
            >
              {loading
                ? "Processing..."
                : `Proceed to Pay ₹${totalAmount}`}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}