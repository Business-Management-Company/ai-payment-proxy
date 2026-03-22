"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");
    if (accessToken && refreshToken) {
      supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken }).then(({ data }) => {
        if (data.session) router.push("/dashboard");
        else router.push("/login");
      });
    } else {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) router.push("/dashboard");
        else router.push("/login");
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
      <p className="text-white text-lg">Signing you in...</p>
    </div>
  );
}