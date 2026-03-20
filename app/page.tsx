import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";


export default function Home() {
  return (
   <>
   <nav className="relative z-50"><Navbar/></nav>
   <div className="z-0">
    <HeroSection/>
   </div>
   </>
  )}
