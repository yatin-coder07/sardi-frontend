"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, User, Settings, Bell, Grid, Box, Pen } from "lucide-react";

const AnimatedMenuToggle = ({
  toggle,
  isOpen,
}) => (
  <button
    onClick={toggle}
    aria-label="Toggle menu"
    className="focus:outline-none z-999"
  >
    <motion.div animate={{ y: isOpen ? 13 : 0 }} transition={{ duration: 0.3 }}>
      <motion.svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        transition={{ duration: 0.3 }}
        className="text-black"
      >
        <motion.path
          fill="transparent"
          strokeWidth="3"
          stroke="currentColor"
          strokeLinecap="round"
          variants={{
            closed: { d: "M 2 2.5 L 22 2.5" },
            open: { d: "M 3 16.5 L 17 2.5" },
          }}
        />
        <motion.path
          fill="transparent"
          strokeWidth="3"
          stroke="currentColor"
          strokeLinecap="round"
          variants={{
            closed: { d: "M 2 12 L 22 12", opacity: 1 },
            open: { opacity: 0 },
          }}
          transition={{ duration: 0.2 }}
        />
        <motion.path
          fill="transparent"
          strokeWidth="3"
          stroke="currentColor"
          strokeLinecap="round"
          variants={{
            closed: { d: "M 2 21.5 L 22 21.5" },
            open: { d: "M 3 2.5 L 17 16.5" },
          }}
        />
      </motion.svg>
    </motion.div>
  </button>
);

const Sidebar = ({ setSection }) => {

  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState(null)

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


  const mobileSidebarVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0 },
  };

  const toggleSidebar = () => setIsOpen(!isOpen)

  return (
    <div className="flex h-screen">

      {/* Mobile Sidebar */}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileSidebarVariants}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 z-50 bg-white text-black"
          >

            <div className="flex flex-col h-full">

              {/* Profile */}

              <div className="p-4 border-b border-gray-200">

                {user && (
                  <div className="flex items-center space-x-3">

                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                     {user.profile_picture}
                    </div>

                    <div>
                      <p className="font-semibold">{user.username}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>

                  </div>
                )}

              </div>

              {/* Navigation */}

              <nav className="flex-1 p-4 overflow-y-auto">

                <ul>

                  <li className="mb-2">
                    <button
                      onClick={() => setSection("products")}
                      className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-gray-100"
                    >
                      <Box className="h-5 w-5" />
                      Products
                    </button>
                  </li>

                  <li className="mb-2">
                    <button
                      onClick={() => setSection("orders")}
                      className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-gray-100"
                    >
                      <Bell className="h-5 w-5" />
                      Orders
                    </button>

                  </li>
                  <li className="mb-2">
                     <button
                      onClick={() => setSection("create")}
                      className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-gray-100"
                    >
                      <Bell className="h-5 w-5" />
                      Create Product
                    </button>
                  </li>

                </ul>

              </nav>

            </div>

          </motion.div>
        )}
      </AnimatePresence>


      {/* Desktop Sidebar */}

      <div className="hidden md:flex flex-col fixed top-0 left-0 h-full w-64 bg-white text-black shadow">

        {/* Profile */}

        <div className="p-4 border-b border-gray-200">

          {user && (
            <div className="flex items-center space-x-3">

              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
               <img src={user.profile_picture} alt="" className="rounded-full" />
              </div>

              <div>
                <p className="font-semibold">{user.username}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>

            </div>
          )}

        </div>

        {/* Navigation */}

        <nav className="flex-1 p-4 overflow-y-auto">

          <ul>

            <li className="mb-2">
              <button
                onClick={() => setSection("products")}
                className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-gray-100"
              >
                <Box className="h-5 w-5" />
                Products
              </button>
            </li>

            <li className="mb-2">
              <button
                onClick={() => setSection("orders")}
                className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-gray-100"
              >
                <Bell className="h-5 w-5" />
                Orders
              </button>
            </li>
              <li className="mb-2">
                     <button
                      onClick={() => setSection("create")}
                      className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-gray-100"
                    >
                      <Pen className="h-5 w-5" />
                      Create Product
                    </button>
                  </li>

          </ul>

        </nav>

      </div>

      {/* Main Content placeholder */}

      <div className="flex-1 ml-0 md:ml-64 transition-all duration-300">

        <div className="p-4 bg-gray-100 border-b border-gray-200 md:hidden flex justify-between items-center">
          <h1 className="text-xl font-bold">Main Content</h1>
          <AnimatedMenuToggle toggle={toggleSidebar} isOpen={isOpen} />
        </div>

      
      </div>

    </div>
  );
};

export { Sidebar };