import Link from "next/link";

export default function HeroSection() {
  return (
    <div className="w-full">

      {/* HERO */}
      <section className="relative w-full h-[110vh] bg-[#e5e5e5] overflow-hidden">

        {/* Center model */}
        <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover opacity-95 "
      >
        <source src="/model1video.mp4" type="video/mp4" />
      </video>

        {/* Text */}
        <div className="absolute  top-1/2 -translate-y-1/2 w-full flex justify-between px-10 lg:px-20">
        <div>
           <h1 className="text-[clamp(4rem,10vw,8rem)] leading-[0.9] tracking-[-0.05em] font-bold text-zinc-800">
            Sardi <br /> 
          </h1>

          <p className="text-zinc-600 mt-4 mb-8 max-w-md">
            Discover the latest kurtis & express your style effortlessly.
            Shop exclusive collections with premium designs.
          </p>

        </div>
         
            <div>
           <Link href={"/products"}>
            <button className="bg-zinc-900 text-white px-10 py-3 uppercase tracking-wider font-semibold hover:bg-black transition">
                        Explore now
                      </button></Link>
            </div>
         
        </div>
      </section>

      {/* CATEGORY SECTION */}
      <section className="flex w-full min-h-screen ">

        {/* LEFT BLOCK */}
        <div
          className="w-1/2 relative border-r border-gray-100 bg-cover bg-center pverflow-hidden h-[110vh]"
         
        >
              <img
          src="/model-2.png"
          className="absolute object-cover z-0 w-full h-full"
        />

          <div className="p-12 absolute inset-0">
            <ul className="space-y-2 text-lg font-medium text-zinc-600">
              <li className="hover:text-black cursor-pointer">Kurtis</li>
              <li className="hover:text-black cursor-pointer">Shawls</li>
              <li className="hover:text-black cursor-pointer">Dupattas</li>
              <li className="hover:text-black cursor-pointer">Mufflers</li>
             
            </ul>
          </div>
        </div>

        {/* RIGHT BLOCK */}
        <div
          className="w-1/2 relative bg-cover bg-center overflow-hidden"
        
        >
             <img
          src="/model3.png"
          className="absolute inset-0 w-full h-full object-center object-cover z-0"
        />

          <div className="p-12 flex flex-col items-end text-right h-full absolute inset-0">
           

           <div className="mt-auto pb-12">
            <Link href={"/products"}> 
 <button className="bg-zinc-900 text-white px-10 py-3 uppercase tracking-wider font-semibold hover:bg-black transition">
                        Explore now
                      </button></Link>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}