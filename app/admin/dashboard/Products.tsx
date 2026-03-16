"use client";
"force-dynamic";



import SkeletonLoading from "@/components/SkelitonLoading";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ProductsGrid() {

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const fetchProducts = async () => {

      const token = localStorage.getItem("access_token")

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await res.json()

      console.log(data)

      setProducts(data)
      setLoading(false)

    }

    fetchProducts()

  }, [])

  if (loading) return <SkeletonLoading/>

  return (

    <section className="p-4 sm:p-6">

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xl sm:text-2xl font-semibold mb-6 text-center"
      >
        Your Products
      </motion.h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">

        {products.map((product, index) => {

          const image =
            product.images?.length > 0
              ? product.images[0].image
              : "/placeholder.png"

          return (

            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.05
              }}
              whileHover={{ scale: 1.03 }}
              className="bg-white border rounded-md overflow-hidden hover:shadow-lg transition"
            >

              <div className="aspect-square bg-gray-100">

                {product.images && product.images.length > 0 && (
                  <img
                    src={product.images[0].image}
                    alt={product.product_name}
                    className="w-full h-full object-cover"
                  />
                )}

              </div>

              <div className="flex justify-between items-center px-3 sm:px-4 py-3 border-t">

                <p className="text-xs sm:text-sm font-medium truncate">
                  {product.product_name}
                </p>

                <p className="text-xs sm:text-sm font-semibold whitespace-nowrap">
                  Rs. {product.price}
                </p>

              </div>

            </motion.div>

          )

        })}

      </div>

    </section>

  )

}