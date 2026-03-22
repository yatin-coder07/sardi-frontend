"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ApiFetch } from "@/lib/ApiFetch"
import Error from "next/error"

export default function CreateProduct() {

  const [productName,setProductName] = useState("")
  const [price,setPrice] = useState("")
  const [description,setDescription] = useState("")
  const [availability,setAvailability] = useState("In Stock")

  // 🔥 NEW STATES
  const [materialType,setMaterialType] = useState("")
  const [sleevesType,setSleevesType] = useState("half")
  const [collection,setCollection] = useState("all")

  const [images,setImages] = useState([])
  const [dragActive,setDragActive] = useState(false)
  const [loading , setLoading] = useState(false)

  const handleFiles = (files) => {

    const validImages = []

    Array.from(files).forEach(file => {

      if(file.type.startsWith("image/")){
        validImages.push(file)
      } else {
        alert("Only image files allowed")
      }

    })

    setImages(prev => [...prev,...validImages])

  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = () => {
    setDragActive(false)
  }

  const removeImage = (index) => {

    const updated = [...images]
    updated.splice(index,1)
    setImages(updated)

  }

  const handleSubmit = async (e) => {

    e.preventDefault()
    setLoading(true)

    if(!productName || !price){
      alert("Product name and price required")
      return
    }

    if(images.length === 0){
      alert("Add at least one image")
      return
    }

    const formData = new FormData()

    formData.append("product_name",productName)
    formData.append("price",price)
    formData.append("product_description",description)
    formData.append("product_availability",availability)

    // 🔥 ADD THESE (NO BREAK)
    formData.append("material_type", materialType)
    formData.append("sleeves_type", sleevesType)
    formData.append("collection", collection)

    images.forEach(img=>{
      formData.append("images",img)
    })

    const res = await ApiFetch("/api/products/create/", {
      method: "POST",
      body: formData
    })

    if(!res || !res.ok){
      alert("upload failed")
      return
      setLoading(false)
    }
    setLoading(false)
    alert("Product Created")

    setProductName("")
    setPrice("")
    setDescription("")
    setImages([])
    setMaterialType("")
  }

  
return (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-5xl mx-auto mt-10"
  >
    <div className="bg-white/70 backdrop-blur-xl border border-gray-200 shadow-xl rounded-3xl p-10">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">
          Create Product
        </h1>
        <p className="text-gray-500 mt-2">
          Add a new product to your store
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Product Name */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Product Name
          </label>

          <input
            value={productName}
            onChange={(e)=>setProductName(e.target.value)}
            placeholder="kurti"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 
            focus:outline-none focus:ring-2 focus:ring-black/70
            transition"
          />
        </div>

        {/* Price */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Price
          </label>

         <input
          type="number"
          min="0"
          value={price}
          onChange={(e) => {
            const value = e.target.value
            if (/^\d*\.?\d*$/.test(value)) {
              setPrice(value)
            }
          }}
          placeholder="1200"
          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4
          focus:outline-none focus:ring-2 focus:ring-black/70 transition"
        />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Description
          </label>

          <textarea
            rows={4}
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4
            focus:outline-none focus:ring-2 focus:ring-black/70 transition"
          />
        </div>

        {/* Availability */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Availability
          </label>

          <select
            value={availability}
            onChange={(e)=>setAvailability(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4
            focus:outline-none focus:ring-2 focus:ring-black/70"
          >
            <option>In Stock</option>
            <option>Out Of Stock</option>
          </select>
        </div>

        {/* 🔥 MATERIAL TYPE */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Material Type
          </label>

          <input
            value={materialType}
            onChange={(e)=>setMaterialType(e.target.value)}
            placeholder="Cotton, Silk..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4
            focus:outline-none focus:ring-2 focus:ring-black/70"
          />
        </div>

        {/* 🔥 SLEEVES TYPE */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Sleeves Type
          </label>

          <select
            value={sleevesType}
            onChange={(e)=>setSleevesType(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4"
          >
            <option value="half">Half Sleeves</option>
            <option value="full">Full Sleeves</option>
            <option value="sleeveless">Sleeveless</option>
          </select>
        </div>

        {/* 🔥 COLLECTION */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Collection
          </label>

          <select
            value={collection}
            onChange={(e)=>setCollection(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4"
          >
            <option value="summer">Summer</option>
            <option value="winter">Winter</option>
            <option value="all">All Season</option>
          </select>
        </div>

        {/* Image Upload (UNCHANGED ✅) */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700">
            Product Images
          </label>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative border-2 border-dashed rounded-2xl p-14 text-center transition
            ${dragActive
              ? "border-blue-500 bg-gray-100"
              : "border-gray-300 bg-gray-50"}`}
          >
            <p className="text-lg font-medium text-gray-700">
              Drag & Drop images
            </p>

            <p className="text-gray-400 text-sm mt-1">
              or upload manually
            </p>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e)=>handleFiles(e.target.files)}
              className="hidden"
              id="fileUpload"
            />

            <label
              htmlFor="fileUpload"
              className="inline-block mt-5 px-6 py-3 bg-blue-700 text-white
              rounded-xl cursor-pointer hover:scale-105 transition"
            >
              Select Images
            </label>
          </div>
        </div>

        {/* Preview (UNCHANGED ✅) */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {images.map((img,index)=>{
              const preview = URL.createObjectURL(img)

              return(
                <motion.div key={index} className="relative group">
                  <img
                    src={preview}
                    className="h-32 w-full object-cover rounded-xl shadow-md"
                  />

                  <button
                    type="button"
                    onClick={()=>removeImage(index)}
                    className="absolute top-2 right-2 bg-red/80 text-white text-xs
                    px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    Remove
                  </button>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Submit */}
        <motion.button
          whileTap={{scale:0.95}}
          whileHover={{scale:1.03}}
          className="w-full bg-blue-700 text-white py-4 rounded-xl text-lg
          font-semibold shadow-lg hover:shadow-xl transition"
        >
         {loading?" Creating....": "Create Product"}
        </motion.button>

      </form>

    </div>
  </motion.div>
)
}