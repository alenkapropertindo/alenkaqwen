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
        
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black p-4">
      <Card className="w-full max-w-md bg-white dark:bg-gray-900 border-purple-500 border-2 shadow-[0_0_15px_#8b5cf6] shadow-purple-500/20 dark:shadow-purple-500/50">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-600">
            Buat Akun
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Buat akun baru
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                Nama
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Masukan nama"
                required
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus-visible:ring-purple-500 focus-visible:ring-2 focus-visible:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Masukan Email"
                required
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus-visible:ring-purple-500 focus-visible:ring-2 focus-visible:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="text-gray-700 dark:text-gray-300">
                Whatsupp
              </Label>
              <Input
                id="whatsapp"
                name="whatsapp"
                type="tel"
                placeholder="Masukan Nomor Whatsup"
                required
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus-visible:ring-purple-500 focus-visible:ring-2 focus-visible:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kodePromo" className="text-gray-700 dark:text-gray-300">
                Kode Promo (Opsional)
              </Label>
              <Input
                id="kodePromo"
                name="kodePromo"
                type="text"
                placeholder="Masukan Kode Promo"
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus-visible:ring-purple-500 focus-visible:ring-2 focus-visible:border-purple-500 uppercase"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Min 8 Karakter"
                required
                minLength={6}
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus-visible:ring-purple-500 focus-visible:ring-2 focus-visible:border-purple-500"
              />
            </div>
            {error && (
              <div className="text-red-400 text-sm text-center py-2">
                {error}
              </div>
            )}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-[0_0_10px_#8b5cf6] hover:shadow-[0_0_15px_#8b5cf6] transition-all duration-300 disabled:opacity-50"
            >
              {isSubmitting ? "Signing up..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Sudah punya akun?{" "}
            <a
              href="/auth/signin"
              className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 hover:underline"
            >
              Login Disini
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
