import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HomeIcon, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";

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

export default async function ProductDetailPage(
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const product = await prisma.product.findUnique({
    where: { id: params.id }
  });

  if (!product) {
    return notFound();
  }

  return (
    <div className="min-h-screen clay-bg pb-20 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#c4ebf2]/80 backdrop-blur-md border-b border-white/40 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link href="/#products">
            <Button variant="ghost" size="icon" className="mr-4 hover:bg-white/40">
              <ArrowLeft className="w-5 h-5 clay-text-title" />
            </Button>
          </Link>
          <h1 className="text-xl font-extrabold clay-text-title truncate flex-1">{product.title}</h1>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl mt-6 px-4">
        <div className="clay-card overflow-hidden">
          {/* Banner Image */}
          <div className="relative overflow-hidden bg-[#aae4ee] w-full flex justify-center items-center">
            {isImageUrlValid(product.imageUrl) ? (
              <img
                src={product.imageUrl!}
                alt={product.title}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            ) : (
              <div className="bg-[#aae4ee] w-full h-64 sm:h-96 flex items-center justify-center">
                <HomeIcon className="h-20 w-20 text-[#ffffff]/70" />
              </div>
            )}
            
            {/* Category Badge Floating on Image */}
            {product.kategori && (
              <div className="absolute top-4 right-4 z-10">
                <span className="inline-flex items-center text-xs sm:text-sm font-bold bg-[#ffde7a] text-[#63490b] px-3 py-1 rounded-full shadow-sm">
                  {formatKategori(product.kategori)}
                </span>
              </div>
            )}
            
            {/* Location Badge Floating on Image */}
            <div className="absolute bottom-4 left-4 z-10">
              <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#d64560] bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm">
                <MapPin className="w-4 h-4 text-[#d64560] animate-bounce" style={{ animationDuration: '2s' }} />
                {product.lokasi || "Kendari"}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Title & Location */}
            <div>
              <h2 className="text-2xl sm:text-4xl font-extrabold clay-text-title mb-2">
                {product.title}
              </h2>
            </div>

            {/* DP/Akad */}
            <div className="clay-panel p-5 relative overflow-hidden group">
              <h3 className="text-xs sm:text-sm font-bold clay-text-muted uppercase tracking-wider mb-2">
                Biaya DP / Akad
              </h3>
              <p className="text-3xl sm:text-4xl font-extrabold text-[#d64560] drop-shadow-sm">
                {formatCurrency(product.dpAkad)}
              </p>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xl font-bold clay-text-title mb-4 flex items-center gap-2">
                Deskripsi
              </h3>
              <div className="clay-text-muted font-medium leading-relaxed space-y-4 whitespace-pre-wrap">
                {product.description}
              </div>
            </div>

            {/* Detail section if exists */}
            {product.detail && product.detail !== product.description && (
              <div>
                <h3 className="text-xl font-bold clay-text-title mb-4">
                  Detail Tambahan
                </h3>
                <div className="clay-text-muted font-medium leading-relaxed whitespace-pre-wrap">
                  {product.detail}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-6 border-t border-white/30">
              <a
                href="https://wa.me/6285242049550"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <button
                  className="clay-btn h-14 w-full text-lg flex items-center justify-center"
                >
                  Tanya Admin Sekarang
                </button>
              </a>
              {product.videoLink && (
                <a
                  href={product.videoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <button
                    className="clay-btn-primary h-14 w-full text-lg flex items-center justify-center"
                  >
                    Lihat Video Properti
                  </button>
                </a>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
