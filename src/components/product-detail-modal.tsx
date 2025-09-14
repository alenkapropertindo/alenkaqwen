"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

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

export function ProductDetailModal({
  product,
  open,
  onOpenChange,
}: {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
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

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] border-purple-500/30 bg-gray-900 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-purple-400 text-2xl">
                {product.title}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {product.lokasi || "Lokasi tidak tersedia"}
              </DialogDescription>
            </div>
            <Badge
              variant={getBadgeVariant(product.kategori)}
              className="text-sm py-1 px-3 whitespace-nowrap"
            >
              {formatKategori(product.kategori)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* DP/Akad */}
          <div>
            <h3 className="text-sm text-gray-400">DP/Akad</h3>
            <p className="text-2xl font-bold text-purple-400">
              {formatCurrency(product.dpAkad)}
            </p>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Deskripsi</h3>
            <p className="text-gray-300">{product.description}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button
              className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-[0_0_10px_#8b5cf6] hover:shadow-[0_0_15px_#8b5cf6] transition-all duration-300"
              onClick={() =>
                window.open("https://wa.me/6285242049550", "_blank")
              }
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
