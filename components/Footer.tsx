"use client";
import { Footer } from "@/components/ui/modem-animated-footer";
import {
  Phone,
  MessageCircle,
  Mail,
} from "lucide-react";

export default function FooterDemo() {
  const socialLinks = [
    {
      icon: <Phone className="w-6 h-6" />,
      href: "tel:+919876543210",
      label: "Call",
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      href: "https://wa.me/919876543210",
      label: "WhatsApp",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      href: "mailto:yatins113@gmail.com",
      label: "Email",
    },
  ];

  const navLinks = [
    { label: "Pricing", href: "/" },
    { label: "Products", href: "/products" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "/" },
  ];

  return (
    <Footer
      brandName="SARDI"
      brandDescription="Conatct us for any enquirires we are always happy to help."
      socialLinks={socialLinks}
      navLinks={navLinks}
      creatorName="Palash Attri"
      creatorUrl="yatns113@gmail.com"
     
    />
  );
}

