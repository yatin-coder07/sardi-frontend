"use client"
"force-dynamic"

import AdminGuard from "@/components/AdminGuard"

import { useEffect, useState } from "react"
import Orders from "./Orders"
import Products from "./Products"
import { Sidebar } from "@/components/sidebar"
import CreateProduct from "./CreateProducts"
import SkeletonLoading from "@/components/SkelitonLoading"


export default function AdminDashboard() {

  const [user, setUser] = useState(null)
  const [section, setSection] = useState("dashboard")

  useEffect(() => {

    const fetchUser = async () => {

      const token = localStorage.getItem("access_token")

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/user/`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await res.json()
      setUser(data)

    }

    fetchUser()

  }, [])

  if (!user) return <SkeletonLoading/>

  const sections = {
   
    orders: <Orders />,
    products: <Products />,
    create:<CreateProduct/>
    
  }

  return (

    <AdminGuard user={user}>

      <div className="flex min-h-screen bg-gray-100">

        {/* Sidebar */}

        <div className="w-64 border-r bg-white">

          <Sidebar setSection={setSection} />

          
      

        </div>


        {/* Main Content */}

        <div className="flex-1 p-10">

          {sections[section]}

        </div>

      </div>

    </AdminGuard>

  )
}