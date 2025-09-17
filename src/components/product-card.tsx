"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HomeIcon } from "lucide-react";
import { ProductDetailModal } from "@/components/product-detail-modal";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      default:
        return "outline";
    }
  };

  return (
    <>
      <Card
        className="bg-gray-900/50 border-purple-500/30 hover:border-purple-500/60 hover:shadow-[0_0_15px_#8b5cf6] transition-all duration-300 overflow-hidden h-full flex flex-col cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative bg-gray-800 border-b border-purple-500/20 h-full">
          {isImageUrlValid(product.imageUrl) ? (
            <img
              src={product.imageUrl!}
              alt={product.title}
              className="w-full h-40 md:h-48 object-cover"
            />
          ) : (
            <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 w-full h-40 md:h-48 flex items-center justify-center">
              <HomeIcon className="h-10 w-10 md:h-12 md:w-12 text-purple-400" />
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
        <CardContent className="flex flex-col flex-1">
          <h3 className="text-sm md:text-xl font-bold text-white leading-tight ">
            {product.title}
          </h3>
          <p className="text-purple-400 text-xs md:text-sm font-medium ">
            {product.lokasi || "Lokasi tidak tersedia"}
          </p>
          <div className="mb-1">
            <span className="text-xs md:text-sm text-gray-400">DP/Akad</span>
            <p className="text-sm md:text-2xl font-bold text-purple-400">
              {formatCurrency(product.dpAkad)}
            </p>
          </div>
          <p className="text-gray-300 mb-2 text-xs md:text-sm leading-relaxed line-clamp-3 flex-1">
            {product.detail || product.description}
          </p>
          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              className="w-full border-purple-500 text-purple-500 hover:bg-purple-500/20 hover:text-white hover:border-purple-400 transition-all duration-300 text-sm md:text-base"
              onClick={(e) => {
                e.stopPropagation();
                window.open("https://wa.me/6285242049550", "_blank");
              }}
            >
              Tanya Admin
            </Button>
            {product.videoLink && (
              <Button
                variant="outline"
                className="w-full border-pink-500 text-pink-500 hover:bg-pink-500/20 hover:text-white hover:border-pink-400 transition-all duration-300 text-sm md:text-base"
                onClick={(e) => {
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

      <ProductDetailModal
        product={product}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}
