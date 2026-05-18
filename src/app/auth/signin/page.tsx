"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
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

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center clay-bg"><div className="clay-text-title font-extrabold text-2xl">Memuat...</div></div>}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      toast.success("Registrasi berhasil! Silahkan login.", {
        id: "registered-toast"
      });
    }
    if (searchParams.get("pending") === "true") {
      authClient.signOut().then(() => {
        setFormError("Silahkan hubungi admin untuk meminta akses.");
      });
    }
  }, [searchParams]);

  const onSubmit = async (data: LoginForm) => {
    setIsSubmitting(true);
    setFormError(null);
    try {
      const { data: session, error } = await authClient.signIn.email(data);

      if (error) {
        setFormError(error.message || "Gagal masuk");
        return;
      }

      if (session) {
        if ((session.user as any).role === "PENDING") {
          await authClient.signOut();
          setFormError("Silahkan hubungi admin untuk meminta akses.");
          return;
        }

        toast.success("Berhasil masuk");
        router.push("/dashboard"); // Redirect to home page or dashboard
        router.refresh(); // Refresh the page to update the session
      }
    } catch (error) {
      setFormError("Terjadi kesalahan tidak terduga");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center clay-bg p-4 transition-colors duration-300">
      <Card className="w-full max-w-md clay-card border-none p-2 sm:p-4">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-extrabold clay-text-title text-center">
            Selamat Datang Kembali
          </CardTitle>
          <CardDescription className="clay-text-muted text-center font-bold">
            Masuk akun anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="clay-text-title font-bold">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Masukan Email"
                className="clay-panel border-none text-[#1f4f59] placeholder-[#5394a0] font-medium h-12 focus-visible:ring-2 focus-visible:ring-white/50"
                {...register("email", {
                  required: "Email wajib diisi",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Alamat email tidak valid",
                  },
                })}
              />
              {errors.email && (
                <p className="text-[#d64560] font-bold text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="clay-text-title font-bold">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Masukan Password"
                className="clay-panel border-none text-[#1f4f59] placeholder-[#5394a0] font-medium h-12 focus-visible:ring-2 focus-visible:ring-white/50"
                {...register("password", {
                  required: "Password wajib diisi",
                  minLength: {
                    value: 6,
                    message: "Password minimal 6 karakter",
                  },
                })}
              />
              {errors.password && (
                <p className="text-[#d64560] font-bold text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            {formError && (
              <div className="text-[#d64560] font-bold text-sm text-center py-2">
                {formError}
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="clay-btn-primary w-full h-12 mt-4 text-lg disabled:opacity-50 flex items-center justify-center"
            >
              {isSubmitting ? "Sedang masuk..." : "Masuk"}
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
            Belum punya akun?{" "}
            <a
              href="/auth/signup"
              className="text-[#d64560] hover:underline"
            >
              Daftar Disini
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
