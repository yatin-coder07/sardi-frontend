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

    existingImages.forEach(img=>{
      formData.append("existing_images", img.id)
    })

    newImages.forEach(img=>{
      formData.append("images", img)
    })

    const res = await ApiFetch(`/api/products/update/${id}/`,{
       method: "POST",
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

  if(loading) return <p>Loading...</p>

  return (

<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  className="max-w-5xl mx-auto mt-10 px-4 "
>
  <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200 shadow-2xl rounded-3xl p-8 sm:p-10">

    <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-800 text-center">
       Edit Your Product Here
    </h1>

    <form onSubmit={handleSubmit} className="space-y-8">

      {/* PRODUCT NAME */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-600">
          Product Name
        </label>
        <input
          value={productName}
          onChange={(e)=>setProductName(e.target.value)}
          className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-black outline-none"
        />
      </div>

      {/* PRICE */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-600">
          Price (Rs.)
        </label>
        <input
          value={price}
          onChange={(e)=>setPrice(e.target.value)}
          className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-black outline-none"
        />
      </div>

      {/* DESCRIPTION */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-600">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
          className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-black outline-none"
        />
      </div>

      {/* AVAILABILITY */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-600">
          Availability
        </label>
        <select
          value={availability}
          onChange={(e)=>setAvailability(e.target.value)}
          className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-black outline-none"
        >
          <option>In Stock</option>
          <option>Out Of Stock</option>
        </select>
      </div>

      {/* DRAG DROP */}
      <div
        onDrop={handleDrop}
        onDragOver={(e)=>{e.preventDefault();setDragActive(true)}}
        onDragLeave={()=>setDragActive(false)}
        className={`border-2 border-dashed p-10 rounded-xl text-center transition ${
          dragActive ? "border-blue-600 bg-gray-100" : "border-gray-300"
        }`}
      >
        <p className="text-gray-600 mb-2 font-medium">
          Drag & Drop images or click to upload 
        </p>
        <input type="file" multiple onChange={(e)=>handleFiles(e.target.files)} />
      </div>

      {/* EXISTING IMAGES */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-700">
          Existing Images
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {existingImages.map((img,index)=>(
            <div key={img.id} className="relative group">
              <img src={img.image} className="h-32 w-full object-cover rounded-lg"/>
              <button
                type="button"
                onClick={()=>removeExistingImage(index)}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs rounded"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* NEW IMAGES */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-700">
          New Images
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {newImages.map((img,index)=>(
            <div key={index} className="relative group">
              <img src={URL.createObjectURL(img)} className="h-32 w-full object-cover rounded-lg"/>
              <button
                type="button"
                onClick={()=>removeNewImage(index)}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs rounded"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* BUTTON */}
     <div className="flex gap-4">
       <button className="w-1/2 bg-gradient-to-r from-blue-400 to-blue-700 hover:from-blue-600 hover:to-blue-900 text-white py-3 rounded-xl font-semibold transition">
        Save Changes
      </button>
      <button onClick={DeleteProduct} className="bg-red-600 text-white hover:bg-red-800 w-1/2 rounded-lg">
        Delete
      </button>

     </div>

    </form>

  </div>
</motion.div>

  )
}