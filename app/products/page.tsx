"use client"
export const dynamic = "force-dynamic";

import Navbar from "@/components/Navbar"
import SkeletonLoading from "@/components/SkelitonLoading"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ApiFetch } from "@/lib/ApiFetch"

export default function ProductsPage() {

  const [products, setProducts] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchProducts = async (query = "") => {

    const res = await ApiFetch(`/api/products/?search=${query}`)
    const data = await res.json()

    setProducts(data)
    setLoading(false)

  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchProducts(search)
  }

  if (loading) return <SkeletonLoading/>

  return (
<>
<nav>
  <Navbar/>
</nav>

<div className="w-full px-4 md:px-6 py-8">

  {/* Search Section */}

  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="max-w-2xl mx-auto mb-10"
  >

    <form
      onSubmit={handleSearch}
      className="flex items-center bg-white border rounded-xl shadow-sm overflow-hidden"
    >

      {/* Input */}

      <input
        type="text"
        placeholder="Search products..."
        className="flex-1 px-4 py-3 outline-none text-sm md:text-base"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Search Button */}

      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.03 }}
        type="submit"
        className="flex items-center gap-2 text-gray-500  px-5 py-3 text-sm md:text-base"
      >
        <Search size={18}/>
        Search
      </motion.button>

    </form>

  </motion.div>


  {/* Products Grid */}

  <section>

    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
>

      {products.map((product) => (

      <Link href={`products/${product.id}`}>
        <div
          key={product.id}
          className="bg-white border rounded-md overflow-hidden hover:shadow-lg transition"
             
        >

          {/* Product Image */}

          <div className="aspect-square bg-gray-100">

            <img
              src={product.images?.[0]?.image}
              alt={product.product_name}
              className="w-full h-full object-cover"
            />

          </div>


          {/* Bottom Info */}

          <div className="flex justify-between items-center px-4 py-3 border-t">

            <p className="text-sm font-medium">
              {product.product_name}
            </p>

            <p className="text-sm font-semibold">
              Rs. {product.price}
            </p>

          </div>

        </div></Link>

      ))}

    </div>

  </section>

</div>
</>
  )

}