"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePageRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.push("/sign-in");
  }, [router]);

  return null;
}
