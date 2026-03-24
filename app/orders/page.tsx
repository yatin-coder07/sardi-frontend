"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ApiFetch } from "@/lib/ApiFetch";
import SkeletonLoading from "@/components/SkelitonLoading";
import Navbar from "@/components/Navbar";
import EmptyState from "@/components/EmptyState"; // ✅ added

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

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await ApiFetch("/api/orders/my-orders/");
      const data = await res.json();
      
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId) => {
    try {
      setActionLoading(orderId);

      const res = await ApiFetch(`/api/orders/cancel/${orderId}/`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, order_status: "CANCELLED" } : o
        )
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (orderId) => {
    try {
      setActionLoading(orderId);

      const res = await ApiFetch(
        `/api/orders/my-orders/delete/${orderId}/`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } finally {
      setActionLoading(null);
    }
  };

  const getStep = (status) => {
    switch (status) {
      case "PAID":
        return 0;
      case "OUT_FOR_DELIVERY":
        return 1;
      case "DELIVERED":
        return 2;
      default:
        return -1;
    }
  };

  return (
    <>
      <Navbar />

      <div className="w-full px-4 md:px-10 py-8">
        <h1 className="text-4xl font-bold mb-10 text-center">
          My Orders
        </h1>

        {loading ? (
          <SkeletonLoading />
        ) : orders.length === 0 ? (
          // ✅ replaced text with EmptyState
          <EmptyState page="Orders" />
        ) : (
          <div className="flex flex-col gap-6 w-full">
            {orders.map((order, index) => {
              const step = getStep(order?.order_status || "PAID");

              // ✅ UPDATED CONDITION (added DELIVERED)
              const isDeletable =
                !order.is_paid ||
                order.order_status === "CANCELLED" ||
                order.order_status === "DELIVERED";

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.005 }}
                  className="w-full border rounded-2xl p-6 shadow-md bg-white"
                >
                  {/* TOP */}
                  <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                      <p className="font-semibold text-xl">
                        Order #{order.order_number}
                      </p>

                      <p className="text-gray-500">
                        ₹ {order.total_amount}
                      </p>

                      <p
                        className={`text-sm mt-1 font-medium ${
                          order.is_paid
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {order.is_paid
                          ? "Payment Successful ✅"
                          : "Payment Failed ❌"}
                      </p>

                      <p className="text-sm mt-1 font-semibold text-blue-600">
                        Status: {order.order_status}
                      </p>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-3">

                      {/* CANCEL DIALOG */}
                      {order.order_status !== "DELIVERED" &&
                        order.order_status !== "CANCELLED" && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button className="bg-blue-700 text-white px-3 py-2 rounded-md">
                                Cancel Order
                              </button>
                            </AlertDialogTrigger>

                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Cancel this order?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will cancel your order. You cannot undo this action.
                                </AlertDialogDescription>
                              </AlertDialogHeader>

                              <AlertDialogFooter>
                                <AlertDialogCancel>
                                  No
                                </AlertDialogCancel>

                                <AlertDialogAction
                                  onClick={() => handleCancel(order.id)}
                                  className="bg-blue-700 hover:bg-blue-800"
                                >
                                  {actionLoading === order.id
                                    ? "Cancelling..."
                                    : "Yes, Cancel"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}

                      {/* DELETE DIALOG */}
                      {isDeletable && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600"
                            >
                              Delete
                            </motion.button>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
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
                                onClick={() => handleDelete(order.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                {actionLoading === order.id
                                  ? "Deleting..."
                                  : "Yes, Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>

                  {/* PRODUCTS */}
                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 border p-3 rounded-lg"
                      >
                        <img
                          src={item.product.images[0]?.image}
                          className="w-16 h-16 object-cover rounded-md"
                        />

                        <div>
                          <p className="font-medium text-sm">
                            {item.product.product_name}
                          </p>
                          <p className="text-gray-500 text-xs">
                            ₹ {item.price} × {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* STATUS BAR */}
                  <div className="mt-6">
                    {order.order_status === "CANCELLED" ? (
                      <p className="text-red-600 text-center font-semibold">
                        ❌ Order Cancelled
                      </p>
                    ) : !order.is_paid ? (
                      <p className="text-red-500 text-center font-semibold">
                        ❌ Payment Failed
                      </p>
                    ) : (
                      <>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Paid</span>
                          <span>Out for Delivery</span>
                          <span>Delivered</span>
                        </div>

                        <div className="relative w-full h-2 bg-gray-200 rounded-full">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width:
                                step === 0
                                  ? "33%"
                                  : step === 1
                                  ? "66%"
                                  : "100%",
                            }}
                            transition={{ duration: 0.5 }}
                            className="h-2 bg-blue-600 rounded-full"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}