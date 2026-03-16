"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminGuard({ user, children }) {

  const router = useRouter();

  useEffect(() => {

    if (!user?.is_staff ) {
      router.push("/");
    }

  }, [user]);

  return children;
}