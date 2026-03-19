import { HoverSliderImage, HoverSliderImageWrap, TextStaggerHover , HoverSlider } from "./ui/animated-slideshow"


  const SLIDES = [
  {
    id: "slide-1",
    title: "premium kurtis",
    imageUrl: "/model6.png",
  },
  {
    id: "slide-2",
    title: "Quality fabrics",
    imageUrl: "/model5.png",
  },
  {
    id: "slide-3",
    title: "Elegant designes",
    imageUrl: "/model3.png",
  },
  {
    id: "slide-4",
    title: "Premium embroidery",
    imageUrl: "/model7.png",
  },
  {
    id: "slide-5",
    title: "Quality Yarn",
    imageUrl: "/model-2.png",
  },
]

export function HoverSliderHero () {
    return (
        <HoverSlider className="min-h-svh place-content-center p-6 md:px-12 bg-[#faf9f5] text-[#3d3929]">
     
      <div className="flex flex-wrap items-center justify-evenly gap-6 md:gap-12">
        <div className="flex  flex-col space-y-2 md:space-y-4   ">
          {SLIDES.map((slide, index) => (
            <TextStaggerHover
              key={slide.title}
              index={index}
              className="cursor-pointer text-4xl font-bold uppercase tracking-tighter"
              text={slide.title}
            />
          ))}
        </div>
        <HoverSliderImageWrap>
          {SLIDES.map((slide, index) => (
            <div key={slide.id} className="  ">
              <HoverSliderImage
                index={index}
                imageUrl={slide.imageUrl}
                src={slide.imageUrl}
                alt={slide.title}
                className="size-full max-h-96 object-contain"
                loading="eager"
                decoding="async"
              />
            </div>
          ))}
        </HoverSliderImageWrap>
      </div>
    </HoverSlider>)
    
}