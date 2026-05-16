"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HomeIcon, MapPin } from "lucide-react";
import Link from "next/link";

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
  kategori: string | null;
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

  // Format category
  const formatKategori = (kategori: string | null) => {
    if (!kategori) return "Tidak ada kategori";

    switch (kategori) {
      case "Strategis":
        return "Strategis";
      case "Promo":
        return "Promo";
      case "Dp_Rendah":
        return "DP Rendah";
      case "DP_Akad_Gratis":
        return "DP Akad Gratis";
      default:
        return kategori;
    }
  };

  // Get badge variant based on category
  const getBadgeVariant = (kategori: string | null) => {
    switch (kategori) {
      case "Strategis":
        return "strategis";
      case "Promo":
        return "promo";
      case "Dp_Rendah":
        return "dp_rendah";
      case "DP_Akad_Gratis":
        return "dp_akad_gratis";
      default:
        return "outline";
    }
  };

  return (
    <Link href={`/product/${product.id}`} className="block h-full">
      <Card
        className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-purple-500/30 hover:border-gray-300 dark:hover:border-purple-500/60 hover:shadow-md dark:hover:shadow-[0_0_15px_#8b5cf6] transition-all duration-300 overflow-hidden h-full flex flex-col cursor-pointer"
      >
        <div className="relative bg-gray-100 dark:bg-gray-800 border-b mb-1 lg:mb-4 border-gray-200 dark:border-purple-500/20 h-full">
          {isImageUrlValid(product.imageUrl) ? (
            <img
              src={product.imageUrl!}
              alt={product.title}
              className="w-full h-40 lg:h-full md:h-48 object-cover object-top"
            />
          ) : (
            <div className="bg-linear-to-br from-gray-100 dark:from-purple-900/50 to-gray-200 dark:to-pink-900/50 w-full h-40 md:h-48 flex items-center justify-center">
              <HomeIcon className="h-10 w-10 md:h-12 md:w-12 text-gray-400 dark:text-purple-400" />
            </div>
          )}
          {product.kategori && (
            <div className="absolute top-2 right-2">
              <Badge
                variant={getBadgeVariant(product.kategori)}
                className="text-[0.65rem] md:text-xs py-0.5 px-1.5 md:py-1 md:px-2 whitespace-nowrap font-bold shadow-lg transform hover:scale-105 transition-transform duration-200"
              >
                {formatKategori(product.kategori)}
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="flex flex-col flex-1 p-2 lg:p-5">
          <div className="relative mb-2">
            <h3 className="text-sm md:text-lg lg:text-xl font-bold text-gray-900 dark:text-white leading-tight">
              {product.title}
            </h3>
            <div className="absolute top-0 right-0 z-10">
              <span className="inline-flex items-center gap-1.5 text-[10px] md:text-xs font-bold text-gray-800 dark:text-purple-100 bg-white/90 dark:bg-purple-900/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-gray-200 dark:border-purple-400/50 shadow-[0_0_10px_rgba(168,85,247,0.2)] dark:shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                <MapPin className="w-3 h-3 text-purple-600 dark:text-purple-400 animate-bounce" style={{ animationDuration: '2s' }} />
                {product.lokasi || "Kendari"}
              </span>
            </div>
          </div>

          <div className="mb-2 lg:mb-4">
            <div className="flex flex-col bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-purple-500/30 rounded-lg p-2 shadow-sm w-full relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-12 bg-gradient-to-br from-green-400/10 to-transparent rounded-bl-full transition-transform group-hover:scale-110"></div>
              <span className="text-[10px] md:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                Biaya DP / Akad
              </span>
              <div className="flex items-center flex-wrap gap-0">
                <span className="text-lg md:text-xl lg:text-2xl font-extrabold text-gray-900 dark:text-transparent dark:bg-gradient-to-r dark:from-purple-400 dark:to-pink-400 dark:bg-clip-text">
                  {formatCurrency(product.dpAkad)}
                </span>
              </div>
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-2 lg:mb-4 text-xs md:text-sm leading-relaxed line-clamp-3 flex-1">
            {product.detail || product.description}
          </p>
          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-900 hover:text-white dark:text-purple-400 dark:border-purple-500 dark:hover:bg-purple-500/20 dark:hover:text-white dark:hover:border-purple-400 transition-all duration-300 text-sm md:text-base"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open("https://wa.me/6285242049550", "_blank");
              }}
            >
              Tanya Admin
            </Button>
            {product.videoLink && (
              <Button
                variant="outline"
                className="w-full border-gray-300 lg:mb-4 text-gray-700 hover:bg-gray-900 hover:text-white dark:text-pink-400 dark:border-pink-500 dark:hover:bg-pink-500/20 dark:hover:text-white dark:hover:border-pink-400 transition-all duration-300 text-sm md:text-base"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(product.videoLink!, "_blank");
                }}
              >
                Lihat Video
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
