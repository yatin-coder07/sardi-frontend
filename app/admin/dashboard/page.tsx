"use client"
"force-dynamic"

import AdminGuard from "@/components/AdminGuard"
import { useEffect, useState } from "react"
import Products from "./Products"
import { Sidebar } from "@/components/sidebar"
import CreateProduct from "./CreateProducts"
import SkeletonLoading from "@/components/SkelitonLoading"
import { ApiFetch } from "@/lib/ApiFetch"
import Navbar from "@/components/Navbar"

export default function AdminDashboard() {

  const [user, setUser] = useState(null)
  const [section, setSection] = useState("dashboard")
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  // 🔥 Fetch User
  useEffect(() => {
    const fetchUser = async () => {
      const res = await ApiFetch("/api/auth/user/")
      const data = await res.json()
      setUser(data)
    }
    fetchUser()
  }, [])

  // 🔥 Fetch Orders
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

  // 🔥 Update Status
  const updateStatus = async (orderId, status) => {
    await ApiFetch(`/api/orders/admin/orders/${orderId}/`, {
      method: "PATCH",
      headers: {
      "Content-Type": "application/json",   // ✅ REQUIRED
    },
      body: JSON.stringify({ order_status: status }),
    })

    fetchOrders()
  }

  // 🔥 Delete Order
  const deleteOrder = async () => {
    if (!deleteId) return

    await ApiFetch(`/api/orders/admin/orders/${deleteId}/`, {
      method: "DELETE",
    })

    setDeleteId(null)
    fetchOrders()
  }

  if (!user) return <SkeletonLoading />

  // 🎨 Status Styling
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

  const sections = {
    dashboard: (
      <>
        {/* 🔥 NAVBAR */}
        <Navbar />

        <div className="space-y-10 mt-6">

          <h1 className="text-5xl font-bold">Admin Dashboard</h1>

          <div>
            <h2 className="text-3xl font-semibold mb-6">Recent Orders</h2>

            {loadingOrders ? (
              <SkeletonLoading />
            ) : orders.length === 0 ? (
              <p className="text-gray-500">No orders found</p>
            ) : (
              <div className="space-y-8">

                {orders.map(order => (
                  <div
                    key={order.id}
                    className="bg-white p-10 rounded-3xl shadow-lg hover:shadow-2xl transition"
                  >

                    {/* HEADER */}
                    <div className="flex justify-between flex-wrap gap-6">

                      {/* CUSTOMER */}
                      <div className="space-y-3 text-lg">

                        <p className="text-3xl font-bold">
                          Order #{order.order_number}
                        </p>

                        <p>
                          <span className="font-semibold">👤 Name:</span>{" "}
                          {order.name}
                        </p>

                        <p>
                          <span className="font-semibold">📞 Phone:</span>{" "}
                          {order.phone_number}
                        </p>

                        <p>
                          <span className="font-semibold">📍 Address:</span>{" "}
                          {order.address}
                        </p>

                        {order.secondary_address && (
                          <p>
                            <span className="font-semibold">🏠 Secondary:</span>{" "}
                            {order.secondary_address}
                          </p>
                        )}

                        {order.landmark && (
                          <p>
                            <span className="font-semibold">📌 Landmark:</span>{" "}
                            {order.landmark}
                          </p>
                        )}

                      </div>

                      {/* PRICE + STATUS */}
                      <div className="text-right space-y-4">
                        <p className="text-4xl font-bold">
                          ₹{order.total_amount}
                        </p>

                        <span
                          className={`px-5 py-2 rounded-full text-lg font-semibold ${getStatusStyle(order.order_status)}`}
                        >
                          {order.order_status}
                        </span>
                      </div>

                    </div>

                    {/* ITEMS */}
                    <div className="mt-8 border-t pt-6">
                      <p className="font-semibold text-xl mb-4">
                        🛒 Ordered Items
                      </p>

                      <div className="space-y-4">
                        {order.items.map(item => (
                          <div
                            key={item.id}
                            className="flex items-center gap-4"
                          >
                            {/* 🔥 PRODUCT IMAGE */}
                          {item.product?.images?.[0]?.image && (
  <img
    src={item.product.images[0].image}
    className="w-16 h-16 rounded-lg object-cover"
  />
)}

                            <div className="flex-1">
                              <p className="font-semibold text-lg">
                                {item.product?.product_name}
                              </p>
                              <p className="text-gray-500">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="mt-6 flex flex-wrap gap-4 items-center">
                        <p>Send Order Status To The Customer</p>
                      <select
                        className="border px-4 py-2 rounded-xl text-md"
                        value={order.order_status}
                        onChange={(e) =>
                          updateStatus(order.id, e.target.value)
                        }
                      >
                        <option value="PAID">PAID</option>
                       
                        <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                        <option value="DELIVERED">DELIVERED</option>

                      </select>

                      {order.order_status === "CANCELLED" && (
                        <button
                          onClick={() => setDeleteId(order.id)}
                          className="bg-red-500 text-white px-5 py-2 rounded-xl hover:bg-red-600"
                        >
                          Delete Order
                        </button>
                      )}

                    </div>

                  </div>
                ))}

              </div>
            )}
          </div>

          {/* 🔥 MODAL */}
          {deleteId && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-2xl shadow-xl w-[400px] text-center space-y-4">

                <h2 className="text-xl font-bold">
                  ⚠ Delete Order?
                </h2>

                <p className="text-gray-500">
                  This action cannot be undone.
                </p>

                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={() => setDeleteId(null)}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={deleteOrder}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>

              </div>
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

        <div className="w-64 border-r bg-white">
          <Sidebar setSection={setSection} />
        </div>

        <div className="flex-1 p-10">
          {sections[section]}
        </div>

      </div>
    </AdminGuard>
  )
}