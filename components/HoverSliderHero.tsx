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
    <HoverSlider className="w-full h-screen px-6 md:px-16 lg:px-24  text-[#3d3929] flex items-center ml-20">
     
      <div className="w-full flex items-center justify-between gap-10">

        {/* LEFT TEXT */}
        <div className="flex flex-col space-y-4 md:space-y-6 w-1/2">
          {SLIDES.map((slide, index) => (
            <TextStaggerHover
              key={slide.title}
              index={index}
              className="cursor-pointer text-5xl md:text-6xl lg:text-6xl font-bold uppercase tracking-tight leading-none"
              text={slide.title}
            />
          ))}
        </div>

        {/* RIGHT IMAGE */}
        <div className="w-1/2 h-full flex items-center justify-center">
          <HoverSliderImageWrap>
            {SLIDES.map((slide, index) => (
              <div key={slide.id} className="w-full h-full flex items-center justify-center">
                <HoverSliderImage
                  index={index}
                  imageUrl={slide.imageUrl}
                  src={slide.imageUrl}
                  alt={slide.title}
                  className="w-full h-[80vh] object-contain"
                  loading="eager"
                  decoding="async"
                />
              </div>
            ))}
          </HoverSliderImageWrap>
        </div>

      </div>

    </HoverSlider>
  )
}