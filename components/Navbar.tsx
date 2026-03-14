"use client";

import { Search , LogOut, BoxIcon,ShoppingCart} from "lucide-react";
import { useEffect, useState } from "react";
import FloatingActionMenu from "./ui/floating-action-menu";
import { useRouter } from "next/navigation";

export default function Navbar() {

  const [profilePic, setProfilePic] = useState(null);
   const router = useRouter();

  useEffect(() => {
   

    const fetchUser = async () => {
      try {

        const token = localStorage.getItem("access_token");
        console.log("Access token:", token);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/user/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
   console.log("User data:", data);
        setProfilePic(data.profile_picture);

      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    fetchUser();

  }, []);

  const Logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    console.log("Logged out");
      router.push("/login");
  }


  return (
    <nav className="w-full border-b border-gray-200 bg-white font-[var(--font-display)]">
      <div className="w-full mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <div className="text-xl font-semibold tracking-tight text-gray-800 lg:text-2xl">
          Sardi
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm text-gray-500 font-semibold">
          <a className="hover:text-black cursor-pointer">Home</a>
          <span className="text-gray-300 font-bold">|</span>
          <a className="hover:text-black cursor-pointer">Products</a>
          <span className="text-gray-300 font-bold">|</span>
          <a className="hover:text-black cursor-pointer">About</a>
          <span className="text-gray-300 font-bold">|</span>
          <a className="hover:text-black cursor-pointer">Contact</a>
        </div>

        {/* Icons */}
        <div className="flex items-center">

          
         

          <button className="p-2 text-gray-700 hover:text-black">
            <Search size={18} />
          </button>

          <FloatingActionMenu
          className="relative"
          options={[
            {
              label: "Cart",
              Icon: <ShoppingCart className="w-4 h-4" />,
              onClick: () => console.log("Cart clicked"),
            },
            {
              label: "Your Orders",
              Icon: <BoxIcon className="w-4 h-4" />,
              onClick: () => console.log("Your Orders clicked"),
            },
            {
              label: "Logout",
              Icon: <LogOut className="w-4 h-4 " />,
              onClick: () => Logout(),
            },
          ]}
        />

        </div>

      </div>
    </nav>
  );
}
