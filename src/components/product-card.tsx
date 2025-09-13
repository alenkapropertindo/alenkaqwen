"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HomeIcon } from "lucide-react";

type Product = {
  id: string;
  title: string;
  lokasi: string | null;
  detail: string | null;
  description: string;
  dpAkad: number;
  videoLink: string | null;
  fee: number;
  imageUrl: string | null;
  createdAt: Date;
};

export function ProductCard({ product }: { product: Product }) {
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Check if imageUrl is a data URL (base64) or a regular URL
  const isImageUrlValid = (url: string | null) => {
    if (!url) return false;
    return url.startsWith("http") || url.startsWith("data:image");
  };

  return (
    <Card className="bg-gray-900/50 border-purple-500/30 hover:border-purple-500/60 hover:shadow-[0_0_15px_#8b5cf6] transition-all duration-300 overflow-hidden h-full flex flex-col">
      <div className="bg-gray-800 border-b border-purple-500/20 h-full">
        {isImageUrlValid(product.imageUrl) ? (
          <img
            src={product.imageUrl!}
            alt={product.title}
            className=" h-full "
          />
        ) : (
          <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 w-full h-full flex items-center justify-center">
            <HomeIcon className="h-16 w-16 text-purple-400" />
          </div>
        )}
      </div>
      <CardContent className="p-4 flex flex-col flex-1">
        <h3 className="text-xl font-bold  text-white leading-tight">
          {product.title}
        </h3>
        <p className="text-purple-400 mb-3 text-sm font-medium">
          {product.lokasi || "Lokasi tidak tersedia"}
        </p>
        <div className="mb-3">
          <span className="text-sm text-gray-400">DP/Akad</span>
          <p className="text-2xl font-bold text-purple-400">
            {formatCurrency(product.dpAkad)}
          </p>
        </div>
        <p className="text-gray-300 mb-6 text-sm leading-relaxed line-clamp-3 flex-1">
          {product.detail || product.description}
        </p>
        <div className="flex flex-col gap-3">
          <Button
            variant="outline"
            className="w-full border-purple-500 text-purple-500 hover:bg-purple-500/20 hover:text-white hover:border-purple-400 transition-all duration-300"
            onClick={() => window.open("https://wa.me/6285242049550", "_blank")}
          >
            Tanya Admin
          </Button>
          {product.videoLink && (
            <Button
              variant="outline"
              className="w-full border-pink-500 text-pink-500 hover:bg-pink-500/20 hover:text-white hover:border-pink-400 transition-all duration-300"
              onClick={() => window.open(product.videoLink!, "_blank")}
            >
              Lihat Video
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
