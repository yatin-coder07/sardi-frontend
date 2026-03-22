"use client";
import { Footer } from "@/components/ui/modem-animated-footer";
import {
  Phone,
  MessageCircle,
  Mail,
  Instagram,
} from "lucide-react";

export default function FooterDemo() {
  const socialLinks = [
    {
      icon: <Phone className="w-6 h-6" />,
      href: "tel:+918557057500",
      label: "Call",
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      href: "https://wa.me/8557057500",
      label: "WhatsApp",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      href: "https://mail.google.com/mail/?view=cm&fs=1&to=Palash.attri.123@gmail.com",
      label: "Email",
    },
     {
      icon: <Instagram className="w-6 h-6" />,
      href: "https://www.instagram.com/sardi_rv/?hl=en",
      label: "Instagram",
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

