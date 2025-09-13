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
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
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
          <h1 className="text-2xl font-bold text-purple-400">
            Not authenticated
          </h1>
          <p className="text-purple-200 mt-2">
            Please log in to view your account
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
          className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
        >
          Account Settings
        </motion.h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800/50 border border-purple-900/50 rounded-xl p-6"
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
                  className="rounded-full border-2 border-purple-500"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-purple-900/50 border-2 border-purple-500 flex items-center justify-center">
                  <User className="h-16 w-16 text-purple-400" />
                </div>
              )}
              <button
                className="absolute bottom-2 right-2 bg-purple-600 hover:bg-purple-700 rounded-full p-2 transition-colors"
                onClick={() => toast.info("Avatar upload coming soon")}
              >
                <Settings className="h-4 w-4 text-white" />
              </button>
            </div>
            <h2 className="text-xl font-semibold mt-4 text-purple-100">
              {name}
            </h2>
            <p className="text-purple-300">{email}</p>
          </div>

          {/* Information Section */}
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-purple-200">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 bg-gray-700/50 border-purple-900/50 text-purple-100 focus:border-purple-500"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-purple-200">
                    Email
                  </Label>
                  <Input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 bg-gray-700/50 border-purple-900/50 text-purple-100 focus:border-purple-500"
                    disabled
                  />
                  <p className="text-xs text-purple-400 mt-1">
                    Email cannot be changed
                  </p>
                </div>

                <div>
                  <Label htmlFor="whatsapp" className="text-purple-200">
                    WhatsApp
                  </Label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-purple-400" />
                    </div>
                    <Input
                      id="whatsapp"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="pl-10 bg-gray-700/50 border-purple-900/50 text-purple-100 focus:border-purple-500"
                      placeholder="+62..."
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="rekening" className="text-purple-200">
                    Nomor Rekening
                  </Label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CreditCard className="h-4 w-4 text-purple-400" />
                    </div>
                    <Input
                      id="rekening"
                      value={rekening}
                      onChange={(e) => setRekening(e.target.value)}
                      className="pl-10 bg-gray-700/50 border-purple-900/50 text-purple-100 focus:border-purple-500"
                      placeholder="cth: 9702345069/BCA"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    onClick={handleSave}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="border-purple-700 text-purple-300 hover:bg-purple-800/50"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-purple-900/50">
                  <div>
                    <h3 className="font-medium text-purple-200">
                      Personal Information
                    </h3>
                    <p className="text-sm text-purple-400">
                      Basic information about you
                    </p>
                  </div>
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Edit Profile
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-purple-400 mr-3" />
                    <div>
                      <p className="text-sm text-purple-400">Name</p>
                      <p className="text-purple-100">{name || "Not set"}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="h-5 w-5 text-purple-400 mr-3 flex items-center">
                      <span className="text-xs">@</span>
                    </div>
                    <div>
                      <p className="text-sm text-purple-400">Email</p>
                      <p className="text-purple-100">{email}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-purple-400 mr-3" />
                    <div>
                      <p className="text-sm text-purple-400">WhatsApp</p>
                      <p className="text-purple-100">{whatsapp || "Not set"}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-purple-400 mr-3" />
                    <div>
                      <p className="text-sm text-purple-400">Rekening Number</p>
                      <p className="text-purple-100">{rekening || "Not set"}</p>
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
