"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HomeIcon, MapPin, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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
  const [isLoading, setIsLoading] = useState(false);

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
    <Link
      href={`/product/${product.id}`}
      className="block h-full transition-transform hover:scale-[1.02]"
      onClick={() => setIsLoading(true)}
    >
      <div className="relative overflow-hidden clay-card h-full flex flex-col cursor-pointer">
        {isLoading && (
          <div className="absolute inset-0 z-50 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-[inherit]">
            <Loader2 className="w-10 h-10 text-[#d64560] dark:text-[#ff8fa3] animate-spin mb-2" />
            <span className="text-sm font-bold text-[#d64560] dark:text-[#ff8fa3] animate-pulse">Memuat...</span>
          </div>
        )}
        <div className="relative bg-muted/20 mb-1 lg:mb-4 overflow-hidden rounded-[20px] mx-3 mt-3 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.06)]">
          {isImageUrlValid(product.imageUrl) ? (
            <img
              src={product.imageUrl!}
              alt={product.title}
              className="w-full h-40 lg:h-48 object-cover object-top"
            />
          ) : (
            <div className="w-full h-40 md:h-48 flex items-center justify-center bg-muted/10">
              <HomeIcon className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground/30" />
            </div>
          )}
          {product.kategori && (
            <div className="absolute top-2 right-2">
              <Badge
                variant={getBadgeVariant(product.kategori)}
                className="text-[0.65rem] md:text-xs py-0.5 px-1.5 md:py-1 md:px-2 whitespace-nowrap font-bold shadow-md"
              >
                {formatKategori(product.kategori)}
              </Badge>
            </div>
          )}
        </div>
        <div className="flex flex-col flex-1 p-3 lg:p-5">
          <div className="relative mb-2">
            <h3 className="text-sm md:text-lg lg:text-xl font-extrabold clay-text-title leading-tight pr-16">
              {product.title}
            </h3>
            <div className="absolute top-0 right-0 z-10">
              <span className="inline-flex items-center gap-1 text-[10px] md:text-xs font-bold text-foreground bg-background/80 backdrop-blur-md px-2 py-1 rounded-[8px] shadow-sm border border-white/10">
                <MapPin className="w-3 h-3 text-[#d64560] dark:text-[#ff8fa3] animate-bounce" style={{ animationDuration: '2s' }} />
                {product.lokasi || "Kendari"}
              </span>
            </div>
          </div>
 
          <div className="mb-1 lg:mb-4">
            <div className="flex flex-col clay-panel rounded-[16px] sm:rounded-[20px] px-3.5 py-2 w-full relative overflow-hidden group">
              <span className="text-[10px] md:text-xs font-bold clay-text-muted uppercase tracking-wider mb-0.5">
                Biaya DP / Akad
              </span>
              <div className="flex items-center flex-wrap gap-0">
                <span className="text-lg md:text-xl lg:text-2xl font-extrabold text-[#d64560] dark:text-[#ff8fa3] drop-shadow-sm">
                  {formatCurrency(product.dpAkad)}
                </span>
              </div>
            </div>
          </div>
          <p className="clay-text-muted font-medium mb-1 lg:mb-5 text-xs md:text-sm leading-relaxed line-clamp-1 md:line-clamp-3 flex-1">
            {product.detail || product.description}
          </p>
          <div className="flex flex-col gap-3">
            <button
              className="clay-btn w-full py-1.5 text-sm md:text-base flex items-center justify-center"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open("https://wa.me/6285242049550", "_blank");
              }}
            >
              Tanya Admin
            </button>
            {product.videoLink && (
              <button
                className="clay-btn-dark w-full py-1.5 lg:mb-2 text-sm md:text-base flex items-center justify-center"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(product.videoLink!, "_blank");
                }}
              >
                Lihat Video
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
