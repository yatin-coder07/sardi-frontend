"use client";
export const dynamic = "force-dynamic";

import AdminGuard from "@/components/AdminGuard";
import { useEffect, useState } from "react";
import Products from "./Products";
import { Sidebar } from "@/components/sidebar";
import CreateProduct from "./CreateProducts";
import SkeletonLoading from "@/components/SkelitonLoading";
import { ApiFetch } from "@/lib/ApiFetch";
import Navbar from "@/components/Navbar";
import { Menu, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [section, setSection] = useState("dashboard");
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // USER
  useEffect(() => {
    const fetchUser = async () => {
      const res = await ApiFetch("/api/auth/user/");
      const data = await res.json();
      setUser(data);
    };
    fetchUser();
  }, []);

  // ORDERS
  const fetchOrders = async () => {
    setLoadingOrders(true);
    const res = await ApiFetch("/api/orders/admin/orders/");
    const data = await res.json();
    setOrders(data);
   
    setLoadingOrders(false);
  };

  // ANALYTICS
  const fetchAnalytics = async () => {
    const res = await ApiFetch("/api/orders/admin/analytics/");
    const data = await res.json();
    setAnalytics(data);
  };

  useEffect(() => {
    if (section === "dashboard") {
      fetchOrders();
      fetchAnalytics();
    }
  }, [section]);

  // UPDATE STATUS
  const updateStatus = async (orderId, status) => {
    await ApiFetch(`/api/orders/admin/orders/${orderId}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_status: status }),
    });
    fetchOrders();
  };

  // EXPAND ORDER
  const handleExpand = async (order) => {
    if (order.order_status === "NEW") {
      await updateStatus(order.id, "PAID");
    }
    setExpandedOrder(prev => (prev === order.id ? null : order.id));
  };

  // DELETE ORDER
  const deleteOrder = async (orderId) => {
    await ApiFetch(`/api/orders/admin/orders/${orderId}/`, {
      method: "DELETE",
    });
    fetchOrders();
  };

  if (!user) return <SkeletonLoading />;

  const getStatusStyle = (status) => {
    switch (status) {
      case "NEW":
        return "bg-blue-100 text-blue-700";
      case "PAID":
      case "DELIVERED":
        return "bg-green-100 text-green-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const menuItems = [
    { name: "Dashboard", value: "dashboard" },
    { name: "Products", value: "products" },
    { name: "Create Product", value: "create" },
  ];

  return (
    <AdminGuard user={user}>
      <div className="flex min-h-screen bg-gray-100">

        {/* SIDEBAR */}
        <div className="hidden md:block w-64 border-r bg-white">
          <Sidebar setSection={setSection} />
        </div>

        {/* MOBILE */}
        <div className="md:hidden fixed top-0 left-0 right-0 bg-white z-50 flex justify-between items-center p-4 shadow">
          <Menu onClick={() => setMobileMenuOpen(true)} />
          <p className="font-bold">Admin</p>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/40">
            <div className="bg-white w-64 h-full p-5">
              <button onClick={() => setMobileMenuOpen(false)}>
                <X />
              </button>

              <div className="mt-6 space-y-4">
                {menuItems.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => {
                      setSection(item.value);
                      setMobileMenuOpen(false);
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

        {/* MAIN */}
        <div className="flex-1 p-4 md:p-10 mt-16 md:mt-0">

          {/* ✅ DASHBOARD */}
          {section === "dashboard" && (
            <>
              <Navbar />

              <div className="space-y-8 mt-6">
                <h1 className="text-3xl md:text-5xl font-bold">
                  Sales Overview
                </h1>

                {/* ANALYTICS */}
                {analytics && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-2xl shadow">
                      <p>Total Sales</p>
                      <h2 className="text-2xl font-bold">
                        ₹{analytics.total_sales}
                      </h2>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow">
                      <p>Orders</p>
                      <h2 className="text-2xl font-bold">
                        {analytics.total_orders}
                      </h2>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow">
                      <p>Products Sold</p>
                      <h2 className="text-2xl font-bold">
                        {analytics.total_products}
                      </h2>
                    </div>
                  </div>
                )}

                {/* GRAPH */}
                {analytics && (
                  <div className="bg-white p-6 rounded-2xl shadow">
                    <h2 className="text-xl font-bold mb-4">
                      Weekly Sales
                    </h2>

                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analytics.daily}>
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="sales"  />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* ORDERS */}
                {loadingOrders ? (
                  <SkeletonLoading />
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white p-4 rounded-xl shadow cursor-pointer"
                        onClick={() => handleExpand(order)}
                      >
                        <div className="flex justify-between items-center">
                          <p className="font-bold">
                            #{order.order_number}
                          </p>

                          <span className={`px-3 py-1 rounded ${getStatusStyle(order.order_status)}`}>
                            {order.order_status === "NEW"
                              ? "NEW 🔥"
                              : order.order_status}
                          </span>
                        </div>

                        {expandedOrder === order.id && (
  <div className="mt-4 border-t pt-4 space-y-6">

    {/* 🧑 CUSTOMER INFO */}
    <div>
      <h2 className="font-semibold text-lg mb-2">Customer Info</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
        <p><b>Name:</b> {order.name}</p>
        <p><b>Phone:</b> {order.phone_number}</p>
        <p><b>User ID:</b> {order.user}</p>
      </div>
    </div>

    {/* 📍 ADDRESS */}
    <div>
      <h2 className="font-semibold text-lg mb-2">Address</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
        <p><b>Address:</b> {order.address}</p>
        {order.secondary_address && (
          <p><b>Secondary:</b> {order.secondary_address}</p>
        )}
        {order.landmark && (
          <p><b>Landmark:</b> {order.landmark}</p>
        )}
        <p><b>City:</b> {order.city}</p>
        <p><b>State:</b> {order.state}</p>
        <p><b>Pincode:</b> {order.pincode}</p>
      </div>
    </div>

    {/* 📦 ORDER DETAILS */}
    <div>
      <h2 className="font-semibold text-lg mb-2">Order Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
        <p><b>Order ID:</b> {order.id}</p>
        <p><b>Order Number:</b> {order.order_number}</p>
        <p><b>Status:</b> {order.order_status}</p>
        <p><b>Created:</b> {new Date(order.created_at).toLocaleString()}</p>
      </div>
    </div>

    {/* 💳 PAYMENT */}
    <div>
      <h2 className="font-semibold text-lg mb-2">Payment</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
        <p className="font-bold text-lg"><b>Total:</b> ₹{order.total_amount}</p>
        <p><b>Paid:</b> {order.is_paid ? "Yes ✅" : "No ❌"}</p>
        <p><b>Razorpay Order ID:</b> {order.razorpay_order_id || "N/A"}</p>
        <p><b>Payment ID:</b> {order.razorpay_payment_id || "N/A"}</p>
      </div>
    </div>

    {/* 🛍 PRODUCTS */}
    <div>
      <h2 className="font-semibold text-lg mb-2">Products</h2>

      <div className="space-y-2">
        {order.items?.map((item) => (
          <div
            key={item.id}
            className="flex gap-3 items-center bg-gray-50 p-3 rounded-lg"
          >
            <img
              src={item.product?.images?.[0]?.image}
              className="w-12 h-12 rounded object-cover"
            />

            <div>
              <p className="font-medium">
                {item.product?.product_name}
              </p>
              <p className="text-sm text-gray-500">
                ₹{item.price} × {item.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* ⚙️ ACTIONS */}
    <div className="flex flex-wrap gap-3 pt-2">

      <select
        value={order.order_status}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) =>
          updateStatus(order.id, e.target.value)
        }
        className="border px-3 py-2 rounded"
      >
        <option value="PAID">PAID</option>
        <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
        <option value="DELIVERED">DELIVERED</option>
      </select>

      {(order.order_status === "DELIVERED" || order.order_status === "CANCELLED") && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <button
                                      onClick={(e) => e.stopPropagation()}
                                      className="bg-red-500 text-white px-3 py-2 rounded"
                                    >
                                      Delete
                                    </button>
                                  </AlertDialogTrigger>

                                  <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Delete this order?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action is permanent. This order will be removed forever.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>

                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>

                                      <AlertDialogAction
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          deleteOrder(order.id);
                                        }}
                                        className="bg-red-500 hover:bg-red-600"
                                      >
                                        Yes, Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}

    </div>

  </div>
)}
                       
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ✅ PRODUCTS */}
          {section === "products" && <Products />}

          {/* ✅ CREATE */}
          {section === "create" && <CreateProduct />}

        </div>
      </div>
    </AdminGuard>
  );
}