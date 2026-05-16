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
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-purple-500/20">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link href="/#products">
            <Button variant="ghost" size="icon" className="mr-4 hover:bg-gray-100 dark:hover:bg-purple-900/30">
              <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold truncate flex-1">{product.title}</h1>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl mt-6 px-4">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-purple-500/30 rounded-2xl overflow-hidden shadow-xl">
          {/* Banner Image */}
          <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-800 w-full flex justify-center items-center">
            {isImageUrlValid(product.imageUrl) ? (
              <img
                src={product.imageUrl!}
                alt={product.title}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            ) : (
              <div className="bg-gradient-to-br from-gray-100 dark:from-purple-900/50 to-gray-200 dark:to-pink-900/50 w-full h-64 sm:h-96 flex items-center justify-center">
                <HomeIcon className="h-20 w-20 text-gray-400 dark:text-purple-400" />
              </div>
            )}
            
            {/* Category Badge Floating on Image */}
            {product.kategori && (
              <div className="absolute top-4 right-4 z-10">
                <Badge
                  variant={getBadgeVariant(product.kategori)}
                  className="text-sm py-1 px-3 whitespace-nowrap shadow-lg"
                >
                  {formatKategori(product.kategori)}
                </Badge>
              </div>
            )}
            
            {/* Location Badge Floating on Image */}
            <div className="absolute bottom-4 left-4 z-10">
              <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-800 dark:text-purple-100 bg-white/90 dark:bg-purple-900/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-gray-200 dark:border-purple-400/50 shadow-[0_0_10px_rgba(168,85,247,0.2)] dark:shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400 animate-bounce" style={{ animationDuration: '2s' }} />
                {product.lokasi || "Kendari"}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Title & Location */}
            <div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
                {product.title}
              </h2>
            </div>

            {/* DP/Akad */}
            <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-purple-500/30 rounded-xl p-5 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400/10 to-transparent rounded-bl-full transition-transform group-hover:scale-110"></div>
              <h3 className="text-xs sm:text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Biaya DP / Akad
              </h3>
              <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-transparent dark:bg-gradient-to-r dark:from-purple-400 dark:to-pink-400 dark:bg-clip-text">
                {formatCurrency(product.dpAkad)}
              </p>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                Deskripsi
              </h3>
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4 whitespace-pre-wrap">
                {product.description}
              </div>
            </div>

            {/* Detail section if exists */}
            {product.detail && product.detail !== product.description && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Detail Tambahan
                </h3>
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {product.detail}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
              <a
                href="https://wa.me/6285242049550"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button
                  className="w-full py-6 text-lg bg-purple-600 hover:bg-purple-700 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all duration-300 hover:scale-[1.02]"
                >
                  Tanya Admin Sekarang
                </Button>
              </a>
              {product.videoLink && (
                <a
                  href={product.videoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button
                    variant="outline"
                    className="w-full py-6 text-lg border-pink-500 text-pink-600 hover:bg-pink-500 hover:text-white dark:text-pink-400 dark:border-pink-500 dark:hover:bg-pink-500/20 transition-all duration-300 hover:scale-[1.02]"
                  >
                    Lihat Video Properti
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
