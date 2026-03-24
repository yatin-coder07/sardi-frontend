"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ApiFetch } from "@/lib/ApiFetch";

export default function EditProduct() {

  const { id } = useParams()
  const router = useRouter()

  const [loading,setLoading] = useState(true)

  const [productName,setProductName] = useState("")
  const [price,setPrice] = useState("")
  const [description,setDescription] = useState("")
  const [availability,setAvailability] = useState("In Stock")

  const [materialType,setMaterialType] = useState("")
  const [sleevesType,setSleevesType] = useState("")
  const [collection,setCollection] = useState("all") // ✅ ADDED

  const [existingImages,setExistingImages] = useState([])
  const [newImages,setNewImages] = useState([])

  const [dragActive,setDragActive] = useState(false)

  useEffect(() => {

    const fetchProduct = async () => {

      const token = localStorage.getItem("access_token")

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/detail/${id}/`,
        {
          headers:{ Authorization:`Bearer ${token}` }
        }
      )

      const data = await res.json()

      setProductName(data.product_name)
      setPrice(data.price)
      setDescription(data.product_description)
      setAvailability(data.product_availability)

      setMaterialType(data.material_type || "")
      setSleevesType(data.sleeves_type || "")
      setCollection(data.collection || "all") // ✅ ADDED

      setExistingImages(data.images || [])

      setLoading(false)

    }

    fetchProduct()

  }, [id])

  const handleFiles = (files) => {
    const validImages = []

    Array.from(files).forEach(file => {
      if(file.type.startsWith("image/")){
        validImages.push(file)
      }
    })

    setNewImages(prev => [...prev,...validImages])
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const removeExistingImage = (index) => {
    const updated = [...existingImages]
    updated.splice(index,1)
    setExistingImages(updated)
  }

  const removeNewImage = (index) => {
    const updated = [...newImages]
    updated.splice(index,1)
    setNewImages(updated)
  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    const formData = new FormData()

    formData.append("product_name",productName)
    formData.append("price",price)
    formData.append("product_description",description)
    formData.append("product_availability",availability)

    formData.append("material_type", materialType)
    formData.append("sleeves_type", sleevesType)
    formData.append("collection", collection) // ✅ ADDED

    existingImages.forEach(img=>{
      formData.append("existing_images", img.id)
    })

    newImages.forEach(img=>{
      formData.append("images", img)
    })

    const res = await ApiFetch(`/api/products/update/${id}/`,{
       method: "PUT",
       body: formData
    })

    if(res.ok){
      alert("Updated ✅")
      router.push("/admin/dashboard")
    } else {
      alert("Error ❌ while updating product")
    }

  }

  const DeleteProduct=async()=>{
    const res = await ApiFetch(`/api/products/delete/${id}/`,{
       method: "DELETE",
    })

    if(res.ok){
      alert("Deleted Successfully ✅")
      router.push(`/admin/dashboard`)
    } else {
      alert("Error ❌ while Deleting product")
    }
  }

  if(loading) return <p className="text-center mt-10">Loading...</p>

  return (
    <main className="min-h-screen bg-gray-50 p-6">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >

        {/* HEADER */}
        <div className="mb-10">
          <h2 className="text-4xl font-extrabold">
            Edit Product
          </h2>
          <p className="text-gray-500 mt-2">
            Update your product details
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-12 gap-8">

            {/* LEFT SIDE */}
            <div className="col-span-12 lg:col-span-7 space-y-8">

              {/* IMAGE SECTION */}
              <section className="bg-white p-8 rounded-xl shadow">
                <h3 className="font-bold mb-6">Product Gallery</h3>

                <div
                  onDrop={handleDrop}
                  onDragOver={(e)=>{e.preventDefault();setDragActive(true)}}
                  onDragLeave={()=>setDragActive(false)}
                  className={`border-2 border-dashed p-10 rounded-xl text-center
                  ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"}`}
                >
                  Drag & Drop or Upload Images
                  <input
                    type="file"
                    multiple
                    onChange={(e)=>handleFiles(e.target.files)}
                    className="block mt-4"
                  />
                </div>

                {/* EXISTING */}
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Existing Images</h4>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {existingImages.map((img,index)=>(
                      <div key={img.id} className="relative group">
                        <img src={img.image} className="h-28 w-full object-cover rounded-lg"/>
                        <button
                          type="button"
                          onClick={()=>removeExistingImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* NEW */}
                {newImages.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">New Images</h4>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {newImages.map((img,index)=>(
                        <div key={index} className="relative group">
                          <img src={URL.createObjectURL(img)} className="h-28 w-full object-cover rounded-lg"/>
                          <button
                            type="button"
                            onClick={()=>removeNewImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </section>

              {/* NAME + DESC */}
              <section className="bg-white p-8 rounded-xl shadow space-y-6">

                <div>
                  <label className="font-semibold">Product Name</label>
                  <input
                    value={productName}
                    onChange={(e)=>setProductName(e.target.value)}
                    className="w-full mt-2 p-4 bg-gray-100 rounded-lg"
                  />
                </div>

                <div>
                  <label className="font-semibold">Description</label>
                  <textarea
                    value={description}
                    onChange={(e)=>setDescription(e.target.value)}
                    className="w-full mt-2 p-4 bg-gray-100 rounded-lg"
                  />
                </div>

              </section>
            </div>

            {/* RIGHT SIDE */}
            <div className="col-span-12 lg:col-span-5 space-y-8">

              <section className="bg-white p-8 rounded-xl shadow space-y-5">

                <div>
                  <label className="font-semibold">Price</label>
                  <input
                    value={price}
                    onChange={(e)=>setPrice(e.target.value)}
                    className="w-full mt-2 p-4 bg-gray-100 rounded-lg"
                  />
                </div>

                <div>
                  <label className="font-semibold">Availability</label>
                  <select
                    value={availability}
                    onChange={(e)=>setAvailability(e.target.value)}
                    className="w-full mt-2 p-4 bg-gray-100 rounded-lg"
                  >
                    <option>In Stock</option>
                    <option>Out Of Stock</option>
                  </select>
                </div>

                {/* ✅ COLLECTION UI */}
                <div>
                  <label className="font-semibold">Collection</label>
                  <select
                    value={collection}
                    onChange={(e)=>setCollection(e.target.value)}
                    className="w-full mt-2 p-4 bg-gray-100 rounded-lg"
                  >
                    <option value="summer">Summer</option>
                    <option value="winter">Winter</option>
                    <option value="all">All Season</option>
                  </select>
                </div>

              </section>

              <section className="bg-white p-8 rounded-xl shadow space-y-5">

                <div>
                  <label className="font-semibold">Material</label>
                  <input
                    value={materialType}
                    onChange={(e)=>setMaterialType(e.target.value)}
                    className="w-full mt-2 p-4 bg-gray-100 rounded-lg"
                  />
                </div>

                <div>
                  <label className="font-semibold">Sleeves</label>
                  <input
                    value={sleevesType}
                    onChange={(e)=>setSleevesType(e.target.value)}
                    className="w-full mt-2 p-4 bg-gray-100 rounded-lg"
                  />
                </div>

              </section>

              <div className="space-y-4">
                <button className="w-full h-14 bg-blue-600 text-white rounded-xl font-bold">
                  Save Changes
                </button>

                <button
                  type="button"
                  onClick={DeleteProduct}
                  className="w-full h-14 bg-red-600 text-white rounded-xl font-bold"
                >
                  Delete Product
                </button>
              </div>

            </div>

          </div>
        </form>
      </motion.div>
    </main>
  )
}