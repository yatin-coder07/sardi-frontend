"use client"
import { motion } from "framer-motion";



import { ImageSlider } from "@/components/image-slider";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";

export default function ImageSliderLoginDemo() {
  const images = [
   "model1.png",
    "model-2.png",
    "model3.png",
  ];
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  


    const handleSuccess = async (credentialResponse) => {
    try {

      const googleToken = credentialResponse.credential;

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/google/`,
        {
          token: googleToken
        }
      );

      const { access_token, refresh_token } = res.data;

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      console.log("Login successful");
      router.push("/")

    } catch (err) {
      console.error("Login failed", err);
    }
  };


  return (
    <div className="w-full h-screen min-h-[700px] flex items-center justify-center bg-background bg-gray-200 p-4">
      <motion.div 
        className="w-full max-w-5xl h-[700px] grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl border"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Left side: Image Slider */}
        <div className="hidden lg:block">
          <ImageSlider images={images} interval={4000} />
        </div>

        {/* Right side: Login Form */}
        <div className="w-full h-full bg-card text-card-foreground flex flex-col items-center justify-center p-8 md:p-12 text-center">
          <motion.div 
            className="w-full max-w-sm"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 variants={itemVariants} className="text-3xl font-bold tracking-tight mb-2">
              Welcome To Sardi
            </motion.h1>
            <motion.p variants={itemVariants} className="text-muted-foreground mb-8">
              Your one-stop shop for traditional and Trending fashion <br /> Please log in to continue.
            </motion.p>

            <motion.div variants={itemVariants} className="flex items-center justify-center">
              <GoogleLogin size="large"
      onSuccess={handleSuccess}
      onError={() => console.log("Login Failed")}
    />
            </motion.div>


            
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
