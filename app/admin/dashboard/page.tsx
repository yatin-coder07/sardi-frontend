"use client"
export const dynamic = "force-dynamic";

import AdminGuard from "@/components/AdminGuard"
import { useEffect, useState } from "react"
import Products from "./Products"
import { Sidebar } from "@/components/sidebar"
import CreateProduct from "./CreateProducts"
import SkeletonLoading from "@/components/SkelitonLoading"
import { ApiFetch } from "@/lib/ApiFetch"
import Navbar from "@/components/Navbar"
import { Menu, X } from "lucide-react"

export default function AdminDashboard() {

  const [user, setUser] = useState(null)
  const [section, setSection] = useState("dashboard")
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const res = await ApiFetch("/api/auth/user/")
      const data = await res.json()
      setUser(data)
    }
    fetchUser()
  }, [])

  const fetchOrders = async () => {
    setLoadingOrders(true)
    const res = await ApiFetch("/api/orders/admin/orders/")
    const data = await res.json()
    setOrders(data)
    setLoadingOrders(false)
  }

  useEffect(() => {
    if (section === "dashboard") fetchOrders()
  }, [section])

  const updateStatus = async (orderId, status) => {
    await ApiFetch(`/api/orders/admin/orders/${orderId}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_status: status }),
    })
    fetchOrders()
  }

  const deleteOrder = async () => {
    if (!deleteId) return
    await ApiFetch(`/api/orders/admin/orders/${deleteId}/`, {
      method: "DELETE",
    })
    setDeleteId(null)
    fetchOrders()
  }

  if (!user) return <SkeletonLoading />

  const getStatusStyle = (status) => {
    switch (status) {
      case "DELIVERED":
      case "PAID":
        return "bg-green-100 text-green-700"
      case "CANCELLED":
        return "bg-red-100 text-red-700"
      default:
        return "bg-yellow-100 text-yellow-700"
    }
  }

  // ✅ MOBILE MENU LINKS (same functionality as sidebar)
  const menuItems = [
    { name: "Dashboard", value: "dashboard" },
    { name: "Products", value: "products" },
    { name: "Create Product", value: "create" },
  ]

  const sections = {
    dashboard: (
      <>
        <Navbar />

        <div className="space-y-10 mt-6">
          <h1 className="text-3xl md:text-5xl font-bold">
            Admin Dashboard
          </h1>

          {loadingOrders ? (
            <SkeletonLoading />
          ) : orders.length === 0 ? (
            <p>No orders found</p>
          ) : (
            <div className="space-y-6 md:space-y-10">
              {orders.map(order => (
                <div key={order.id} className="bg-white p-4 md:p-12 rounded-2xl shadow">

                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-2 text-sm md:text-lg">
                      <p className="text-xl md:text-3xl font-bold">
                        Order #{order.order_number}
                      </p>
                      <p>{order.name}</p>
                      <p>{order.phone_number}</p>
                      <p>{order.address}</p>
                    </div>

                    <div>
                      <p className="text-xl md:text-3xl font-bold">
                        ₹{order.total_amount}
                      </p>
                      <span className={`px-3 py-1 rounded ${getStatusStyle(order.order_status)}`}>
                        {order.order_status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    {order.items.map(item => (
                      <div key={item.id} className="flex gap-2 items-center">
                        <img
                          src={item.product?.images?.[0]?.image}
                          className="w-12 h-12 rounded"
                        />
                        <p>{item.product?.product_name}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex gap-2 flex-col md:flex-row">
                    <select
                      value={order.order_status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="border px-3 py-2 rounded"
                    >
                      <option value="PAID">PAID</option>
                      <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                      <option value="DELIVERED">DELIVERED</option>
                    </select>

                    {(order.order_status === "DELIVERED" || order.order_status === "CANCELLED") && (
                      <button
                        onClick={() => setDeleteId(order.id)}
                        className="bg-red-500 text-white px-3 py-2 rounded"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </>
    ),

    products: <Products />,
    create: <CreateProduct />,
  }

  return (
    <AdminGuard user={user}>
      <div className="flex min-h-screen bg-gray-100">

        {/* ✅ DESKTOP ONLY SIDEBAR */}
        <div className="hidden md:block w-64 border-r bg-white">
          <Sidebar setSection={setSection} />
        </div>

        {/* ✅ MOBILE TOP BAR */}
        <div className="md:hidden fixed top-0 left-0 right-0 bg-white z-50 flex justify-between items-center p-4 shadow">
          <Menu onClick={() => setMobileMenuOpen(true)} />
          <p className="font-bold">Admin</p>
        </div>

        {/* ✅ MOBILE MENU (NO SIDEBAR USED) */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/40">

            <div className="bg-white w-64 h-full p-5 shadow-lg">

              <button onClick={() => setMobileMenuOpen(false)}>
                <X />
              </button>

              <div className="mt-6 space-y-4">
                {menuItems.map(item => (
                  <button
                    key={item.value}
                    onClick={() => {
                      setSection(item.value)
                      setMobileMenuOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 rounded hover:bg-gray-100"
                  >
                    {item.name}
                  </button>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* MAIN CONTENT */}
        <div className="flex-1 p-4 md:p-10 mt-16 md:mt-0">
          {sections[section]}
        </div>

      </div>
    </AdminGuard>
  )
}