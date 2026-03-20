"use client";

import {
  LogOut,
  BoxIcon,
  ShoppingCart,
  Shield,
  Menu,
  X
} from "lucide-react";

import { useEffect, useState } from "react";
import FloatingActionMenu from "./ui/floating-action-menu";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ApiFetch } from "@/lib/ApiFetch";

export default function Navbar() {

  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {

    const fetchUser = async () => {

      try {

       

        const res = await ApiFetch("/api/auth/user/")

        if (!res.ok) return;

        const data = await res.json();

        setUser(data);

      } catch (err) {

        console.error("Failed to fetch user", err);

      }

    };

    fetchUser();

  }, []);

  const Logout = () => {

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
     sessionStorage.clear();

    router.push("/login");

  };

  return (

    <nav className="w-full border-b border-gray-200 bg-white">

      <div className="flex items-center justify-between px-4 md:px-6 py-4">

        {/* Logo */}
       <Link href={"/"}>
        <div className="text-lg md:text-xl lg:text-2xl font-semibold tracking-tight text-gray-800">
          Sardi
        </div>
</Link>
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-500 font-semibold">

          <Link href="/">Home</Link>

          <span className="text-gray-300">|</span>

          <Link href="/products">Products</Link>

          <span className="text-gray-300">|</span>

          <a href="#contact">Contact</a>

          <span className="text-gray-300">|</span>

         <Link href={"/cart"}><span className={`flex items-center text-sm gap-2 ${!user ? "cursor-not-allowed":""}`}><ShoppingCart/>Cart</span></Link>

        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">

          {/* Desktop user menu */}
          <div className="hidden md:flex">

            {user ? (

              <FloatingActionMenu
                className="relative z-6"
                options={[
                   {
                          label: "Cart",
                          Icon:  <ShoppingCart className="w-4 h-4" />,
                          onClick: () => router.push("/cart"),
                        },
                  {
                    label: "Your Orders",
                    Icon: <BoxIcon className="w-4 h-4" />,
                    onClick: () => router.push("/orders"),
                  },
                  {
                    label: "Logout",
                    Icon: <LogOut className="w-4 h-4" />,
                    onClick: () => Logout(),
                  },
                  ...(user?.is_staff
                    ? [
                        {
                          label: "Admin Panel",
                          Icon: <Shield className="w-4 h-4" />,
                          onClick: () => router.push("/admin/dashboard"),
                        },
                      ]
                    : []),
                ]}
              />

            ) : (

              <Link href="/login">
                <Button variant={"outline"} className="border-0 text-gray-500">
                  Login
                </Button>
              </Link>

            )}

          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>

        </div>

      </div>

      {/* Mobile Menu */}
      <AnimatePresence>

        {mobileOpen && (

          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t overflow-hidden"
          >

            <div className="flex flex-col px-6 py-4 gap-4 text-gray-700 font-medium">

              <Link href="/" onClick={() => setMobileOpen(false)}>
                Home
              </Link>

              <Link href="/products" onClick={() => setMobileOpen(false)}>
                Products
              </Link>

              <Link href="#" onClick={() => setMobileOpen(false)}>
                About
              </Link>

              <Link href="#" onClick={() => setMobileOpen(false)}>
                Contact
              </Link>

              <div className="border-t pt-4">

                {user ? (

                  <div className="flex flex-col gap-3">

                    <button onClick={() => router.push("/cart")}>
                      Cart
                    </button>

                    <button onClick={() => router.push("/orders")}>
                      Your Orders
                    </button>

                    {user?.is_staff && (
                      <button
                        onClick={() => router.push("/admin/dashboard")}
                      >
                        Admin Panel
                      </button>
                    )}

                    <button onClick={Logout}>
                      Logout
                    </button>

                  </div>

                ) : (

                  <Link href="/login">
                    <Button className="w-full">
                      Login
                    </Button>
                  </Link>

                )}

              </div>

            </div>

          </motion.div>

        )}

      </AnimatePresence>

    </nav>

  );

}