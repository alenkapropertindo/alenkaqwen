"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function SignupPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const whatsapp = formData.get("whatsapp") as string;
    const kodePromo = formData.get("kodePromo") as string;

    try {
      let affiliateId = undefined;

      // Validate Promo Code if provided
      if (kodePromo) {
        const checkRes = await fetch("/api/check-promo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kodePromo }),
        });

        const checkData = await checkRes.json();

        if (!checkRes.ok) {
          setError(checkData.error || "Kode promo tidak terdaftar, silahkan periksa kembali.");
          setIsSubmitting(false);
          return;
        }

        affiliateId = checkData.affiliateId;
      }
      const res = await authClient.signUp.email({
        name,
        email,
        password,
        whatsapp,
        affiliateId,
      });

      if (res.error) {
        setError(res.error.message || "Signup failed");
      } else {
        // If affiliateId exists, register the customer
        if (affiliateId) {
          try {
            const customerRes = await fetch("/api/register-affiliate-customer", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ affiliateId, name, whatsapp }),
            });
            if (!customerRes.ok) {
              const customerError = await customerRes.json();
              console.error("Failed to create customer:", customerError);
            }
          } catch (e) {
            console.error("Error calling register customer API:", e);
          }
        }
        
        // Sign out right after signup because default role is PENDING
        await authClient.signOut();
        
        router.push("/auth/signin?registered=true");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center clay-bg p-4 transition-colors duration-300">
      <Card className="w-full max-w-md clay-card border-none p-2 sm:p-4">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-extrabold clay-text-title text-center">
            Buat Akun
          </CardTitle>
          <CardDescription className="clay-text-muted text-center font-bold">
            Buat akun baru
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="clay-text-title font-bold">
                Nama
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Masukan nama"
                required
                className="clay-panel border-none text-[#1f4f59] placeholder-[#5394a0] font-medium h-12 focus-visible:ring-2 focus-visible:ring-white/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="clay-text-title font-bold">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Masukan Email"
                required
                className="clay-panel border-none text-[#1f4f59] placeholder-[#5394a0] font-medium h-12 focus-visible:ring-2 focus-visible:ring-white/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="clay-text-title font-bold">
                Whatsupp
              </Label>
              <Input
                id="whatsapp"
                name="whatsapp"
                type="tel"
                placeholder="Masukan Nomor Whatsup"
                required
                className="clay-panel border-none text-[#1f4f59] placeholder-[#5394a0] font-medium h-12 focus-visible:ring-2 focus-visible:ring-white/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kodePromo" className="clay-text-title font-bold">
                Kode Promo (Opsional)
              </Label>
              <Input
                id="kodePromo"
                name="kodePromo"
                type="text"
                placeholder="Masukan Kode Promo"
                className="clay-panel border-none text-[#1f4f59] placeholder-[#5394a0] font-medium h-12 focus-visible:ring-2 focus-visible:ring-white/50 uppercase"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="clay-text-title font-bold">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Min 8 Karakter"
                required
                minLength={6}
                className="clay-panel border-none text-[#1f4f59] placeholder-[#5394a0] font-medium h-12 focus-visible:ring-2 focus-visible:ring-white/50"
              />
            </div>
            {error && (
              <div className="text-[#d64560] font-bold text-sm text-center py-2">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="clay-btn-primary w-full h-12 mt-4 text-lg disabled:opacity-50 flex items-center justify-center"
            >
              {isSubmitting ? "Signing up..." : "Sign Up"}
            </button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col pb-6">
          <div className="mt-4 text-center text-sm clay-text-muted font-bold">
            Sudah punya akun?{" "}
            <a
              href="/auth/signin"
              className="text-[#d64560] hover:underline"
            >
              Login Disini
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
