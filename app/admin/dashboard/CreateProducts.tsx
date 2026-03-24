"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ApiFetch } from "@/lib/ApiFetch"

export default function CreateProduct() {

  const [productName,setProductName] = useState("")
  const [price,setPrice] = useState("")
  const [description,setDescription] = useState("")
  const [availability,setAvailability] = useState("In Stock")

  const [materialType,setMaterialType] = useState("")
  const [sleevesType,setSleevesType] = useState("half")
  const [collection,setCollection] = useState("all")

  const [images,setImages] = useState<File[]>([])
  const [dragActive,setDragActive] = useState(false)
  const [loading , setLoading] = useState(false)

  const handleFiles = (files: FileList) => {
    const validImages: File[] = []

    Array.from(files).forEach(file => {
      if(file.type.startsWith("image/")){
        validImages.push(file)
      } else {
        alert("Only image files allowed")
      }
    })

    setImages(prev => [...prev,...validImages])
  }

  const handleDrop = (e:any) => {
    e.preventDefault()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleDragOver = (e:any) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = () => {
    setDragActive(false)
  }

  const removeImage = (index:number) => {
    const updated = [...images]
    updated.splice(index,1)
    setImages(updated)
  }

  const handleSubmit = async (e:any) => {
    e.preventDefault()
    setLoading(true)

    if(!productName || !price){
      alert("Product name and price required")
      setLoading(false)
      return
    }

    if(images.length === 0){
      alert("Add at least one image")
      setLoading(false)
      return
    }

    const formData = new FormData()

    formData.append("product_name",productName)
    formData.append("price",price)
    formData.append("product_description",description)
    formData.append("product_availability",availability)

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
      setLoading(false)
      return
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
    <main className="min-h-screen bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >

        {/* HEADER */}
        <div className="mb-10">
          <h2 className="text-4xl font-extrabold tracking-tight">
            Create Product
          </h2>
          <p className="text-gray-500 mt-2">
            Craft a premium product listing
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-12 gap-8">

            {/* LEFT SIDE */}
            <div className="col-span-12 lg:col-span-7 space-y-8">

              {/* IMAGE UPLOAD */}
              <section className="bg-white p-8 rounded-xl shadow">
                <h3 className="text-lg font-bold mb-6">
                  Product Gallery
                </h3>

                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`border-2 border-dashed rounded-xl p-10 text-center transition
                  ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"}`}
                >
                  <p className="font-medium">Drag & Drop images</p>

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e)=>handleFiles(e.target.files!)}
                    className="hidden"
                    id="fileUpload"
                  />

                  <label
                    htmlFor="fileUpload"
                    className="mt-4 inline-block px-5 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
                  >
                    Upload
                  </label>
                </div>

                {/* PREVIEW */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {images.map((img,index)=>{
                      const preview = URL.createObjectURL(img)

                      return(
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            className="h-28 w-full object-cover rounded-lg"
                          />

                          <button
                            type="button"
                            onClick={()=>removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100"
                          >
                            Remove
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </section>

              {/* NAME + DESC */}
              <section className="bg-white p-8 rounded-xl shadow space-y-6">

                <div>
                  <label className="text-sm font-semibold">Product Name</label>
                  <input
                    value={productName}
                    onChange={(e)=>setProductName(e.target.value)}
                    className="w-full mt-2 p-4 rounded-lg bg-gray-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">Description</label>
                  <textarea
                    value={description}
                    onChange={(e)=>setDescription(e.target.value)}
                    rows={5}
                    className="w-full mt-2 p-4 rounded-lg bg-gray-100"
                  />
                </div>

              </section>
            </div>

            {/* RIGHT SIDE */}
            <div className="col-span-12 lg:col-span-5 space-y-8">

              {/* PRICE */}
              <section className="bg-white p-8 rounded-xl shadow space-y-5">

                <div>
                  <label className="text-sm font-semibold">Price</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e)=>setPrice(e.target.value)}
                    className="w-full mt-2 p-4 rounded-lg bg-gray-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">Availability</label>
                  <select
                    value={availability}
                    onChange={(e)=>setAvailability(e.target.value)}
                    className="w-full mt-2 p-4 rounded-lg bg-gray-100"
                  >
                    <option>In Stock</option>
                    <option>Out Of Stock</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold">Collection</label>
                  <select
                    value={collection}
                    onChange={(e)=>setCollection(e.target.value)}
                    className="w-full mt-2 p-4 rounded-lg bg-gray-100"
                  >
                    <option value="summer">Summer</option>
                    <option value="winter">Winter</option>
                    <option value="all">All</option>
                  </select>
                </div>

              </section>

              {/* ATTRIBUTES */}
              <section className="bg-white p-8 rounded-xl shadow space-y-5">

                <div>
                  <label className="text-sm font-semibold">Material</label>
                  <input
                    value={materialType}
                    onChange={(e)=>setMaterialType(e.target.value)}
                    className="w-full mt-2 p-4 rounded-lg bg-gray-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">Sleeves</label>
                  <select
                    value={sleevesType}
                    onChange={(e)=>setSleevesType(e.target.value)}
                    className="w-full mt-2 p-4 rounded-lg bg-gray-100"
                  >
                    <option value="half">Half</option>
                    <option value="full">Full</option>
                    <option value="sleeveless">Sleeveless</option>
                  </select>
                </div>

              </section>

              {/* SUBMIT */}
              <button
                className="w-full h-14 bg-blue-600 text-white rounded-xl font-bold text-lg"
              >
                {loading ? "Creating..." : "Create Product"}
              </button>

            </div>

          </div>
        </form>
      </motion.div>
    </main>
  )
}