"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Factory() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const projects = [
    {
      type: "video",
      media: "/sardi.mp4",
      title: "High-Tech Embroidery Process",
      description:
        "At Sardi, every kurti begins with precision. Using advanced embroidery machines, we craft intricate patterns with perfect detailing and consistency. This technology ensures each piece reflects premium quality while maintaining speed and efficiency in production.",
    },
    {
      type: "image",
      media: "/project1.jpg",
      title: "Skilled Craftsmanship",
      description:
        "Behind every kurti is the expertise of highly skilled artisans. Our team carefully inspects, refines, and perfects each design — ensuring every piece meets our high standards of quality, comfort, and elegance before it reaches you.",
    },
    {
      type: "image",
      media: "/project2.jpg",
      title: "Happy Customers & Trusted Quality",
      description:
        "From production to delivery, our focus is on customer satisfaction. Sardi kurtis are loved for their comfort, durability, and modern style — helping customers feel confident and stylish every day.",
    },
  ];

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", `-${(projects.length - 1) * 100}%`]
  );

  return (
    <section ref={sectionRef} className="relative w-full h-[500vh] ">
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div style={{ x }} className="flex h-full">
          {projects.map((project, index) => (
            <div
              key={index}
              className="w-screen h-screen shrink-0 flex items-center justify-center px-6 md:px-12 lg:px-20"
            >
              <div className="w-full h-[82vh] rounded-[32px] border border-white/10  backdrop-blur-md overflow-hidden">
                <div className="grid h-full grid-cols-1 md:grid-cols-2">
                  
                  {/* LEFT (Media) */}
                  <motion.div
                    initial={{ opacity: 0, x: -80 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: false, amount: 0.4 }}
                    className="relative h-full w-full "
                  >
                    {project.type === "video" ? (
                      <video
                        src={project.media}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <img
                        src={project.media}
                        alt={project.title}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </motion.div>

                  {/* RIGHT (Text) */}
                  <motion.div
                    initial={{ opacity: 0, x: 80 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    viewport={{ once: false, amount: 0.4 }}
                    className="flex h-full items-center text-black px-8 py-10 md:px-12 lg:px-16"
                  >
                    <div className="max-w-xl ">
                     

                      <h2 className="text-3xl md:text-5xl font-semibold leading-tight">
                        {project.title}
                      </h2>

                      <p className="mt-6  md:text-lg leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                  </motion.div>

                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}