'use client';

import { motion } from "framer-motion"
import { useState, useEffect } from 'react';
import ScrollExpandMedia from '@/components/scroll-expansion-hero';
import { HoverSliderHero } from "./HoverSliderHero";
import FooterDemo from "./Footer";
import Link from "next/link";
import { TestimonialsSectionDemo } from "./Testimonials";

const sampleMediaContent = {
  video: {
    src: '/model1video.mp4',
    poster: '/model1.png',
    background: '/kurtis.png',
    title: 'Sardi',
    date: 'Premium Kurti Style',
    scrollToExpand: 'Experience the tradition',
    about: {
      overview:
        'Experience Premium kurtis with rich embroidery, premium fabric, and modern silhouettes.',
    },
  },
};

const MediaContent = ({ mediaType }) => {
  return (
    <div className="relative w-full flex flex-col items-center justify-center min-h-[40vh] gap-10 px-4">

      <motion.h1
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          text-center
          text-3xl sm:text-5xl md:text-7xl lg:text-8xl
          font-extrabold tracking-tight
        "
      >
        PREMIUM KURTI COLLECTION
      </motion.h1>

      <img
        src="/sardi.jpeg"
        alt="Sardi"
        className="w-40 sm:w-56 md:w-72 h-auto object-contain"
      />

    </div>
  )
};

const HeroSection = () => {
  const [mediaType, setMediaType] = useState('video');
  const currentMedia = sampleMediaContent[mediaType];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [mediaType]);

  return (
    <>
      {/* HERO */}
      <div className='min-h-screen bg-slate-50 w-full'>
        <ScrollExpandMedia
          mediaType={mediaType}
          mediaSrc={currentMedia.src}
          posterSrc={currentMedia.poster}
          bgImageSrc={currentMedia.background}
          title={currentMedia.title}
          date={currentMedia.date}
          scrollToExpand={currentMedia.scrollToExpand}
          textBlend
        >
          <MediaContent mediaType={mediaType} />
        </ScrollExpandMedia>
      </div>

      {/* SECTION 2 */}
      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-8 px-4 sm:px-6 py-12 bg-slate-50">

        {/* LEFT CARD */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative overflow-hidden w-full md:w-1/2 max-w-xl rounded-3xl shadow-xl border group"
        >
          <div className="absolute inset-0 bg-[#f5f5dc] scale-x-0 group-hover:scale-x-100 origin-right transition duration-500" />

          <div className="relative z-10 p-6 sm:p-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Premium Embroidered Kurtis
            </h2>

            <p className="text-base sm:text-lg text-gray-600">
              Premium embroidered kurtis with best pricing — no compromise in quality.
            </p>

            <Link href="/products">
              <button className="mt-5 px-4 py-2 bg-black text-white rounded">
                Shop Now
              </button>
            </Link>
          </div>
        </motion.div>

        {/* RIGHT VIDEO */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-1/2 max-w-xl rounded-3xl overflow-hidden shadow-xl"
        >
          <video
            src="/model2video.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-[250px] sm:h-[350px] md:h-[500px] object-cover"
          />
        </motion.div>

      </div>

      {/* SLIDER */}
      <section>
        <HoverSliderHero />
      </section>

      {/* TESTIMONIALS */}
      <div>
        <TestimonialsSectionDemo />
      </div>

      {/* 🔥 FIXED RESPONSIVE IMAGE SECTION */}
      <div className="w-full relative mt-10">

        <img
          src="/kurtis2.png"
          alt="Kurti Collection"
          className="
            w-full
            h-[250px]
            sm:h-[320px]
            md:h-[500px]
            lg:h-[650px]
            object-cover
          "
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <h2 className="text-white text-lg sm:text-2xl md:text-4xl font-bold">
            New Collection
          </h2>
        </div>

      </div>

      {/* FOOTER */}
      <footer id="contact">
        <FooterDemo />
      </footer>
    </>
  );
};

export default HeroSection;