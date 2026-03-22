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
import EmptyState from "@/components/EmptyState";

export default function ProductsPage() {

  const [products, setProducts] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  const router = useRouter()

  // 🔥 PRODUCTION SAFE FETCH
const fetchProducts = async (query = "", collection = "", retry = true) => {
  try {
    setLoading(true);

    let url = `/api/products/?search=${query}`;

    if (collection) {
      url += `&collection=${collection}`;
    }

    const res = await ApiFetch(url);

    if (!res) {
      setProducts([]);
      return;
    }

    if (!res.ok) {
      throw new Error("API failed");
    }

    const data = await res.json();
    setProducts(data);

  } catch (err) {
    console.error("❌ Fetch products error:", err);

    if (retry) {
      setTimeout(() => {
        fetchProducts(query, collection, false);
      }, 1000);
      return;
    }

    setProducts([]);
  } finally {
    setLoading(false);
  }
};

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

      <input
        type="text"
        placeholder="Search products..."
        className="flex-1 px-4 py-3 outline-none text-sm md:text-base"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.03 }}
        type="submit"
        className="flex items-center gap-2 text-gray-500 px-5 py-3 text-sm md:text-base"
      >
        <Search size={18}/>
        Search
      </motion.button>

      
    </form>
   <div className="flex gap-3 mt-4 flex-wrap justify-center">

  <button
    onClick={() => fetchProducts("", "summer")}
    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
  >
    ☀️ Summer Collection
  </button>

  <button
    onClick={() => fetchProducts("", "winter")}
    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
  >
    ❄️ Winter Collection
  </button>

  <button
    onClick={() => fetchProducts()}
    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-black transition"
  >
    🔄 All Products
  </button>

</div>

  </motion.div>


  {/* Products Grid */}

  <section>

    {/* 🔥 EMPTY STATE (ONLY IF FAILED) */}
    {!loading && products.length === 0 ? (
      <div className="text-center py-16">
       <EmptyState/>
        <button
          onClick={() => fetchProducts()}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Retry
        </button>
      </div>
    ) : (

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {products.map((product) => (

        <Link href={`products/${product.id}`} key={product.id}>
          <div
            className="bg-white border rounded-md overflow-hidden hover:shadow-lg transition"
          >

            {/* Product Image */}
            <div className="aspect-square bg-gray-100">
              <img
                src={product.images?.[0]?.image}
                alt={product.product_name}
                className="w-full h-full object-cover"
                loading="lazy" // 🔥 PERFORMANCE BOOST
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

          </div>
        </Link>

        ))}

      </div>

    )}

  </section>

</div>
</>
  )

}