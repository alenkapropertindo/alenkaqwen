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
import { useRouter, useParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function SignupPage() {
  const router = useRouter();
  const params = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get raw promo/referral code from optional catch-all dynamic route params
  const rawPromo = params?.promo
    ? (Array.isArray(params.promo) ? params.promo[0] : params.promo)
    : "";
  const referralCode = decodeURIComponent(rawPromo).toUpperCase();

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

    if (!kodePromo || kodePromo.trim() === "") {
      setError("pastikan anda memasukan kode promo");
      setIsSubmitting(false);
      return;
    }

    try {
      let affiliateId = undefined;

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
      const res = await authClient.signUp.email({
        name,
        email,
        password,
        whatsapp,
        affiliateId,
      } as any);

      if (res.error) {
        setError(res.error.message || "Pendaftaran gagal");
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

        router.push("/auth/login?registered=true");
      }
    } catch (err) {
      setError("Terjadi kesalahan tidak terduga");
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
                Kode Promo
              </Label>
              <Input
                id="kodePromo"
                name="kodePromo"
                type="text"
                placeholder="Masukan Kode Promo"
                required
                defaultValue={referralCode}
                readOnly={!!referralCode}
                className={`clay-panel border-none text-[#1f4f59] placeholder-[#5394a0] font-medium h-12 focus-visible:ring-2 focus-visible:ring-white/50 uppercase ${referralCode ? "opacity-75 cursor-not-allowed select-none" : ""
                  }`}
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
              {isSubmitting ? "Sedang mendaftar..." : "Daftar"}
            </button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col pb-6">
          <div className="mt-2 text-center text-sm font-bold">
            <a
              href="https://wa.me/6285242049550"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25D366] hover:underline flex items-center justify-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Hubungi Admin
            </a>
          </div>
          <div className="mt-4 text-center text-sm clay-text-muted font-bold">
            Sudah punya akun?{" "}
            <a
              href="/auth/login"
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
