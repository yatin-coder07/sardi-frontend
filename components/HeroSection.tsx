'use client';


import { motion } from "framer-motion"
import { useState, useEffect } from 'react';
import ScrollExpandMedia from '@/components/scroll-expansion-hero';
import { HoverSliderHero } from "./HoverSliderHero";
import FooterDemo from "./Footer";
import Link from "next/link";
import { TestimonialsSectionDemo } from "./Testimonials";

interface MediaAbout {
  overview: string;
  conclusion: string;
}

interface MediaContent {
  src: string;
  poster?: string;
  background: string;
  title: string;
  date: string;
  scrollToExpand: string;
  about: MediaAbout;
}

interface MediaContentCollection {
  [key: string]: MediaContent;
}

const sampleMediaContent: MediaContentCollection = {
  video: {
    src: '/model1video.mp4',
    poster: '/model1.png',
    background: '/kurtis.png',
    title: 'Sardi',
    date: 'Premium Kurti Style',
    scrollToExpand: 'Experience the tradition',
    about: {
      overview:
        'Experience Premium kurtis with rich embroidery, premium fabric, and modern silhouettes.We offer premium fabrics with a touch of tradition.',
     
    },
  },
  image: {
    src: '/kurtis.png',
    background: '/model-2.png',
    title: 'Elegant Kurti Showcase',
    date: 'Authentic Indian Style',
    scrollToExpand: 'Scroll for More Details',
    about: {
      overview:
        'Showcase beautiful kurti images with elegant animations and text blending. The component supports both video and image content from public assets.',
      conclusion:
        'Switch between media types and highlight your latest collection in an immersive way that drives interest and conversions.',
    },
  },
};

const MediaContent = ({ mediaType }: { mediaType: 'video' | 'image' }) => {
  const currentMedia = sampleMediaContent[mediaType];

  return (
    <div className="relative w-full flex flex-col items-center justify-center min-h-[40vh] gap-30">
      
      <motion.h1
        initial={{ opacity: 0, y: 80, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="
          w-full
          text-center
          text-5xl md:text-7xl lg:text-8xl
          bg-gradient-to-b from-foreground/20 via-foreground/10 to-transparent 
          bg-clip-text text-transparent
          font-extrabold tracking-tighter
          px-4
        "
      >
        PREMIUM KURTI COLLECTION
      </motion.h1>
      <img src={"/sardi.jpeg"} alt="" className="h-60 w-90" />

    </div>
  )
};

const HeroSection = () => {
  const [mediaType, setMediaType] = useState<'video' | 'image'>('video');
  const currentMedia = sampleMediaContent[mediaType];

  useEffect(() => {
    window.scrollTo(0, 0);
    const resetEvent = new Event('resetSection');
    window.dispatchEvent(resetEvent);
  }, [mediaType]);

  return (
   <>
    <div className='min-h-screen bg-slate-50 w-full'>
      <div className='fixed top-4 right-4 z-50 flex gap-2'>
       
      </div>

      <ScrollExpandMedia
        mediaType={mediaType}
        mediaSrc={currentMedia.src}
        posterSrc={mediaType === 'video' ? currentMedia.poster : undefined}
        bgImageSrc={currentMedia.background}
        title={currentMedia.title}
        date={currentMedia.date}
        scrollToExpand={currentMedia.scrollToExpand}
        textBlend>
        <MediaContent mediaType={mediaType} />
      </ScrollExpandMedia>
    </div>
     <div className="w-full min-h-screen flex flex-col md:flex-row items-center justify-center gap-8 px-6 py-12 bg-slate-50">

      {/* LEFT - CARD */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden w-full md:w-1/2 max-w-xl rounded-3xl shadow-2xl border border-neutral-200 group cursor-pointer"
      >
        {/* Hover Gradient Overlay (right → left) */}
        <motion.div
          className="absolute inset-0 bg-[#f5f5dc] origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"
        />

        {/* Content */}
        <div className="relative z-10 p-10">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight text-gray-600 group-hover:text-black transition-colors duration-300">
            Premium Embroidered Kurtis
          </h2>

          <p className="text-lg leading-relaxed text-gray-700 group-hover:text-gray-800 transition-colors duration-300">
            Premium embroidered kurtis with best pricing — no compromise in quality.
          </p>
          <Link href={"/products"}>
          <button className="p-2 mt-5 bg-black text-white ">
            Shop Now
          </button></Link>
        </div>
      </motion.div>

      {/* RIGHT - VIDEO */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full md:w-1/2 max-w-xl rounded-3xl overflow-hidden shadow-2xl"
      >
        <video
          src="/model2video.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </motion.div>

    </div>
  
    <section>
      <HoverSliderHero/>
      </section>
      <div>
        <TestimonialsSectionDemo/>
      </div>
     <div className="w-screen h-screen relative">
  <img
    src="/kurtis2.png"
    alt="Kurti Collection"
    className="
      w-full h-full 
      object-cover 
      
    "
  />
</div>
      <footer id="contact">
        <FooterDemo/>
      </footer>
      </>
      
  );
};

export default HeroSection;
