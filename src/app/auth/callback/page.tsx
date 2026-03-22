"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push("/dashboard");
      } else {
        supabase.auth.onAuthStateChange((event, session) => {
          if (event === "SIGNED_IN" && session) {
            router.push("/dashboard");
          } else {
            router.push("/login");
          }
        });
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
      <p className="text-white text-lg">Signing you in...</p>
    </div>
  );
}