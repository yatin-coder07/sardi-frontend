import { TestimonialsSection } from "./ui/testimonials-with-marquee"


const testimonials = [
  {
    author: {
      name: "Priya Sharma",
      handle: "@priyasharma",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
    },
    text: "The kurti quality is outstanding. The fabric is soft, colors are vibrant, and stitching is perfect for everyday wear.",
    href: "https://twitter.com/priyasharma"
  },
  {
    author: {
      name: "Priyanshu",
      handle: "@priyanshumehta",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    text: "I love the premium embroidery and design. These kurtis feel premium yet affordable, and I receive compliments every time.",
    href: "https://twitter.com/anjalimehta"
  },
  {
    author: {
      name: "Navya",
      handle: "@rohitpatel",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
    },
    text: "Delivery was fast and the kurti fit is exactly as promised. Great customer service and a beautiful collection of Indian styles.",
    href: "https://twitter.com/rohitpatel"
  }
]

export function TestimonialsSectionDemo() {
  return (
    <TestimonialsSection
      title="Trusted by kurti lovers across India"
      description="Join thousands of happy customers sharing authentic reviews of premium kurtis"
      testimonials={testimonials}
    />
  )}