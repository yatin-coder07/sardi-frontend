import { Search, ShoppingBag } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="w-full border-b border-gray-200 bg-white font-[var(--font-display)]">
      <div className="w-full mx-auto flex items-center justify-between px-6 py-4 font-">
        
        {/* Logo */}
        <div className="text-xl font-semibold tracking-tight text-gray-800 lg:text-2xl">
          Sardi
        </div>

        {/* Navigation */}
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

          <button className="bg-black text-white p-3 ml-4">
            <ShoppingBag size={18} />
          </button>
        </div>

      </div>
    </nav>
  );
}