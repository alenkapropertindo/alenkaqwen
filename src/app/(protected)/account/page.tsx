"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Settings, Phone, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

// Define the session type
interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  whatsapp?: string | null;
  rekeningNo?: string | null;
  kodeUnik?: string | null;
}

interface Session {
  user?: User;
}

export default function AccountPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [rekening, setRekening] = useState("");
  const [kodeUnik, setKodeUnik] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch("/api/get-session");
        const result = await response.json();

        if (response.ok && result.session?.user) {
          setSession(result.session);
          setName(result.session.user.name || "");
          setEmail(result.session.user.email || "");
          setWhatsapp(result.session.user.whatsapp || "");
          setRekening(result.session.user.rekeningNo || "");
          setKodeUnik(result.session.user.kodeUnik || "");
          setAvatar(result.session.user.image || "");
        } else {
          // Handle unauthorized case
          setSession(null);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
        toast.error("Failed to load session data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, []);

  const handleSave = async () => {
    try {
      // Update user data
      const response = await fetch("/api/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          whatsapp,
          rekeningNo: rekening,
          kodeUnik: session?.user?.kodeUnik ? undefined : kodeUnik,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update profile");
      }

      // Refresh the session to get updated data
      const sessionResponse = await fetch("/api/get-session");
      const sessionResult = await sessionResponse.json();

      if (sessionResponse.ok && sessionResult.session?.user) {
        setSession(sessionResult.session);
        setName(sessionResult.session.user.name || "");
        setEmail(sessionResult.session.user.email || "");
        setWhatsapp(sessionResult.session.user.whatsapp || "");
        setRekening(sessionResult.session.user.rekeningNo || "");
        setKodeUnik(sessionResult.session.user.kodeUnik || "");
        setAvatar(sessionResult.session.user.image || "");
      }

      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      let errorMessage = "Failed to update profile";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-white/40 rounded w-1/4 mb-8"></div>
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-white/40 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-white/40 rounded"></div>
                  <div className="h-4 bg-white/40 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-extrabold clay-text-title">
            Belum masuk
          </h1>
          <p className="clay-text-muted font-bold mt-2">
            Silahkan masuk untuk melihat akun Anda
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
      <div className="space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-extrabold clay-text-title"
        >
          Pengaturan Akun
        </motion.h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="clay-panel p-6"
      >
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center md:items-start">
            <div className="relative">
              {avatar ? (
                <Image
                  src={avatar}
                  alt="Profile"
                  width={120}
                  height={120}
                  className="rounded-full border-4 border-white shadow-sm"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-[#aae4ee] border-4 border-white shadow-sm flex items-center justify-center">
                  <User className="h-16 w-16 text-[#ffffff]/70" />
                </div>
              )}
              <button
                className="absolute bottom-2 right-2 clay-btn-primary p-2 rounded-full"
                onClick={() => toast.info("Avatar upload coming soon")}
              >
                <Settings className="h-4 w-4" />
              </button>
            </div>
            <h2 className="text-xl font-extrabold mt-4 clay-text-title">
              {name}
            </h2>
            <p className="clay-text-muted font-bold">{email}</p>
          </div>

          {/* Information Section */}
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="name" className="clay-text-title font-bold">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 clay-panel border-none text-[#1f4f59] focus:ring-2 focus:ring-white/50 h-12"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="clay-text-title font-bold">
                    Email
                  </Label>
                  <Input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 clay-panel border-none text-[#1f4f59] focus:ring-2 focus:ring-white/50 h-12 opacity-70"
                    disabled
                  />
                  <p className="text-xs clay-text-muted font-bold mt-1">
                    Email tidak dapat diubah
                  </p>
                </div>

                <div>
                  <Label htmlFor="whatsapp" className="clay-text-title font-bold">
                    WhatsApp
                  </Label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-[#366873]" />
                    </div>
                    <Input
                      id="whatsapp"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="pl-10 clay-panel border-none text-[#1f4f59] focus:ring-2 focus:ring-white/50 h-12"
                      placeholder="+62..."
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="rekening" className="clay-text-title font-bold">
                    Nomor Rekening
                  </Label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CreditCard className="h-4 w-4 text-[#366873]" />
                    </div>
                    <Input
                      id="rekening"
                      value={rekening}
                      onChange={(e) => setRekening(e.target.value)}
                      className="pl-10 clay-panel border-none text-[#1f4f59] focus:ring-2 focus:ring-white/50 h-12"
                      placeholder="cth: 9702345069/BCA"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="kodeUnik" className="clay-text-title font-bold">
                    Kode Unik
                  </Label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="h-4 w-4 text-[#366873] font-bold flex items-center justify-center">#</span>
                    </div>
                    <Input
                      id="kodeUnik"
                      value={kodeUnik}
                      onChange={(e) => setKodeUnik(e.target.value)}
                      className="pl-10 clay-panel border-none text-[#1f4f59] focus:ring-2 focus:ring-white/50 h-12"
                      placeholder="cth: UNIK123"
                      disabled={!!session?.user?.kodeUnik}
                    />
                  </div>
                  {session?.user?.kodeUnik && (
                    <p className="text-xs clay-text-muted font-bold mt-1">
                      Kode unik sudah diatur dan tidak dapat diubah lagi.
                    </p>
                  )}
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    onClick={handleSave}
                    className="clay-btn-primary"
                  >
                    Simpan Perubahan
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="clay-btn bg-white/40 hover:bg-white text-[#1f4f59] border-none"
                  >
                    Batal
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/40">
                  <div>
                    <h3 className="font-extrabold clay-text-title">
                      Informasi Pribadi
                    </h3>
                    <p className="text-sm clay-text-muted font-bold">
                      Informasi dasar tentang Anda
                    </p>
                  </div>
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="clay-btn-primary"
                  >
                    Edit Profil
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-[#366873] mr-3" />
                    <div>
                      <p className="text-sm clay-text-muted font-bold">Nama</p>
                      <p className="clay-text-title font-bold">{name || "Belum diatur"}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="h-5 w-5 text-[#366873] mr-3 flex items-center">
                      <span className="text-xs font-bold">@</span>
                    </div>
                    <div>
                      <p className="text-sm clay-text-muted font-bold">Email</p>
                      <p className="clay-text-title font-bold">{email}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-[#366873] mr-3" />
                    <div>
                      <p className="text-sm clay-text-muted font-bold">WhatsApp</p>
                      <p className="clay-text-title font-bold">{whatsapp || "Belum diatur"}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-[#366873] mr-3" />
                    <div>
                      <p className="text-sm clay-text-muted font-bold">Nomor Rekening</p>
                      <p className="clay-text-title font-bold">{rekening || "Belum diatur"}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="h-5 w-5 text-[#366873] mr-3 flex items-center justify-center font-bold">#</div>
                    <div>
                      <p className="text-sm clay-text-muted font-bold">Kode Unik</p>
                      <p className="clay-text-title font-bold">{kodeUnik || "belum diatur"}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
