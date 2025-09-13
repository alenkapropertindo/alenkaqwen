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

    try {
      const res = await authClient.signUp.email({
        name,
        email,
        password,
        whatsapp,
        callbackURL: "/dashboard",
      });

      if (res.error) {
        setError(res.error.message || "Signup failed");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md bg-gray-900 border-purple-500 border-2 shadow-[0_0_15px_#8b5cf6] shadow-purple-500/50">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Buat Akun
          </CardTitle>
          <CardDescription className="text-gray-400">
            Buat akun baru
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">
                Nama
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Masukan nama"
                required
                className="bg-gray-800 border-gray-700 text-white focus-visible:ring-purple-500 focus-visible:ring-2 focus-visible:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Masukan Email"
                required
                className="bg-gray-800 border-gray-700 text-white focus-visible:ring-purple-500 focus-visible:ring-2 focus-visible:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="text-gray-300">
                Whatsupp
              </Label>
              <Input
                id="whatsapp"
                name="whatsapp"
                type="tel"
                placeholder="Masukan Nomor Whatsup"
                required
                className="bg-gray-800 border-gray-700 text-white focus-visible:ring-purple-500 focus-visible:ring-2 focus-visible:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Min 8 Karakter"
                required
                minLength={6}
                className="bg-gray-800 border-gray-700 text-white focus-visible:ring-purple-500 focus-visible:ring-2 focus-visible:border-purple-500"
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
          <div className="mt-4 text-center text-sm text-gray-400">
            Sudah punya akun?{" "}
            <a
              href="/auth/signin"
              className="text-purple-400 hover:text-purple-300 hover:underline"
            >
              Login Disini
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
