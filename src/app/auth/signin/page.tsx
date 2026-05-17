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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center clay-bg"><div className="clay-text-title font-extrabold text-2xl">Loading...</div></div>}>
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
        toast.error("Silahkan hubungi admin untuk meminta akses.", {
          id: "pending-toast"
        });
      });
    }
  }, [searchParams]);

  const onSubmit = async (data: LoginForm) => {
    setIsSubmitting(true);
    try {
      const { data: session, error } = await authClient.signIn.email(data);

      if (error) {
        toast.error(error.message || "Failed to sign in");
        return;
      }

      if (session) {
        if (session.user.role === "PENDING") {
          await authClient.signOut();
          toast.error("Silahkan hubungi admin untuk meminta akses.");
          return;
        }

        toast.success("Signed in successfully");
        router.push("/dashboard"); // Redirect to home page or dashboard
        router.refresh(); // Refresh the page to update the session
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
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
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
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
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-[#d64560] font-bold text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="clay-btn-primary w-full h-12 mt-4 text-lg disabled:opacity-50 flex items-center justify-center"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col pb-6">
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
