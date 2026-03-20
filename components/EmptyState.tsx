"use client";

import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

export default function EmptyState({ page = "Cart" }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-neutral-900/40 backdrop-blur-md">
            <ShoppingCart className="w-10 h-10 " />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-gray-500 mb-2">
          Nothing here yet
        </h2>

        {/* Dynamic Text */}
        <p className="text-gray-400 text-sm">
          Add your first product in{" "}
          <span className="text-gray-600 font-medium">{page}</span>
        </p>
      </motion.div>
    </div>
  );
}