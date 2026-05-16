import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HomeIcon, Building2, MapPin, TrendingUp, Users, ArrowRight } from "lucide-react";
import prisma from "@/lib/prisma";
import { ProductFilter } from "@/components/product-filter";

// Define the product type based on Prisma schema
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

export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch products from database
  let products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      lokasi: true,
      detail: true,
      description: true,
      dpAkad: true,
      videoLink: true,
      fee: true,
      imageUrl: true,
      createdAt: true,
      kategori: true,
    },
  });

  // Sort products: Promo category first, then by creation date
  products.sort((a, b) => {
    if ((a.kategori === "Promo") === (b.kategori === "Promo")) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (a.kategori === "Promo") return -1;
    return 1;
  });

  const heroVisual = (
    <>
      {/* Background glowing orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gray-200 dark:bg-purple-600 rounded-full blur-[120px] opacity-70 dark:opacity-20 animate-pulse"></div>

      <div className="relative w-full max-w-md mx-auto">
        {/* Main Image/Card */}
        <div className="relative overflow-hidden rounded-3xl p-[2px] z-0 shadow-2xl cursor-pointer">
          {/* Animated Conic Gradient Border */}
          <div className="absolute top-1/2 left-1/2 h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2 animate-[spin_10s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_60%,#fde047_75%,#ec4899_90%,#a855f7_100%)] opacity-90" />

          <div className="relative z-10 w-full bg-white dark:bg-gray-900 rounded-[22px] overflow-hidden">
            <div className="h-72 bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>

              <img src="/GIB.png" alt="Main Card Image" className="w-full h-full object-cover" />

              <div className="absolute bottom-5 left-5 z-20">
                <div className="text-white font-extrabold text-2xl drop-shadow-md flex items-center gap-3">
                  Cluster Premium
                  {/* Live Indicator */}
                  <span className="flex h-3 w-3 relative mt-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                </div>
                <div className="text-white text-sm flex items-center gap-1.5 mt-1 font-medium opacity-100">
                  <MapPin className="w-4 h-4 text-purple-400 animate-bounce" /> Kendari City
                </div>
              </div>
            </div>

            <div className="p-6 flex justify-between items-center bg-white dark:bg-gray-900 relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-xs text-gray-400 dark:text-gray-500 uppercase font-bold tracking-wider mb-1">Cicilan Mulai</div>
                <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                  Rp 1 Juta-an
                </div>
              </div>

              <Button className="rounded-full w-12 h-12 p-0 bg-gray-900 text-white dark:bg-purple-600 shadow-md relative z-10">
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Stat Card 1 */}
        <div className="absolute -left-2 sm:-left-12 top-16 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white dark:border-gray-700 animate-bounce" style={{ animationDuration: '4s' }}>
          <div className="flex items-center gap-4">
            <div className="bg-green-100 dark:bg-green-900/40 p-2.5 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-lg font-black text-gray-900 dark:text-white">ROI Tinggi</div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Investasi Aman</div>
            </div>
          </div>
        </div>

        {/* Floating Stat Card 2 */}
        <div className="absolute -right-2 sm:-right-8 bottom-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white dark:border-gray-700 animate-bounce" style={{ animationDuration: '5s', animationDelay: '1s' }}>
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/40 p-2.5 rounded-full">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-lg font-black text-gray-900 dark:text-white">Affiliate</div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Komisi Jutaan</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-black dark:text-white transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-purple-500/20 transition-colors duration-300">
        <div className="container mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-2xl font-extrabold text-gray-900 dark:text-transparent dark:bg-gradient-to-r dark:from-purple-400 dark:to-pink-600 dark:bg-clip-text transition-colors">
            <div className="bg-gray-900 dark:bg-purple-600 p-1.5 rounded-lg shadow-md">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            Alenka
          </div>
          <nav className="hidden md:flex space-x-12">
            <Link
              href="/"
              className="hover:text-gray-900 dark:hover:text-purple-400 font-semibold text-gray-500 dark:text-purple-500 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/#products"
              className="hover:text-gray-900 dark:hover:text-purple-400 font-semibold text-gray-500 dark:text-purple-500 transition-colors"
            >
              Lokasi Terbaru
            </Link>
            <a
              href="https://wa.me/6285242049550"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900 dark:hover:text-purple-400 font-semibold text-gray-500 dark:text-purple-500 transition-colors"
            >
              Hubungi Admin
            </a>
          </nav>
          <div className="flex space-x-4">
            <Link href="/auth/signup">
              <Button className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-gradient-to-r dark:from-purple-600 dark:to-pink-600 dark:hover:from-purple-700 dark:hover:to-pink-700 shadow-sm dark:shadow-[0_0_10px_#8b5cf6] transition-all duration-300 rounded-full px-6">
                Freelance
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 md:px-12 pt-12 pb-4 md:py-24 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between relative z-10">
          <div className="lg:w-1/2 mb-4 lg:mb-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-purple-500/10 border border-gray-200 dark:border-purple-500/20 text-sm font-medium text-gray-600 dark:text-purple-400 mb-6 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              Properti Terbaik di Kelasnya
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight text-gray-900 dark:text-white leading-[1.1]">
              Temukan <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-900 dark:from-purple-400 dark:to-pink-600">Rumah Impian</span><br />
              di Kendari
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl mb-10 max-w-lg leading-relaxed">
              Temukan rumah impianmu dikota kendari dengan harga paling terjangkau. atau gabung komunitas digital marketing kami dan mulai hasilkan cuan dari rumah tanpa harus jualan.
            </p>

            {/* Mobile Hero Visual */}
            <div className="flex lg:hidden justify-center relative w-full mb-12 mt-4">
              {heroVisual}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/freelance">
                <Button className="h-12 px-8 rounded-full bg-gray-900 hover:bg-gray-800 text-white dark:bg-gradient-to-r dark:from-purple-600 dark:to-pink-600 dark:hover:from-purple-700 dark:hover:to-pink-700 shadow-lg dark:shadow-[0_0_15px_#8b5cf6] transition-all duration-300 text-base font-semibold w-full sm:w-auto">
                  Gabung Freelance
                </Button>
              </Link>
              <Link href="/#products">
                <Button
                  variant="outline"
                  className="h-12 px-8 rounded-full border-gray-300 text-gray-900 hover:bg-gray-100 hover:text-gray-900 dark:border-0 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 shadow-sm transition-all duration-300 text-base font-semibold backdrop-blur-md w-full sm:w-auto"
                >
                  <HomeIcon className="mr-2 h-5 w-5" />
                  Lihat Properti
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-3">
                <img className="w-10 h-10 rounded-full border-2 border-gray-50 dark:border-black object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-gray-50 dark:border-black object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-gray-50 dark:border-black object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="User" />
                <div className="w-10 h-10 rounded-full border-2 border-gray-50 dark:border-black bg-white dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 shadow-sm">+2k</div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Dipercaya oleh <span className="font-bold text-gray-900 dark:text-white">2,000+</span> pelanggan
              </div>
            </div>
          </div>
          <div className="hidden lg:flex lg:w-1/2 justify-center mt-12 lg:mt-0 relative w-full">
            {heroVisual}
          </div>
        </div>
      </section>

      {/* Product Cards Section */}
      <section id="products" className="container mx-auto px-6 md:px-12 pt-8 pb-12 md:py-20 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white dark:bg-purple-500/10 border border-gray-200 dark:border-purple-500/20 text-sm font-semibold text-gray-600 dark:text-purple-400 mb-4 shadow-sm">
            Eksplorasi Katalog
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
            Properti <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-900 dark:from-purple-400 dark:to-pink-600">Terbaru</span>
          </h2>
        </div>
        <ProductFilter initialProducts={products} />
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-purple-500/20 py-16">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2 text-2xl font-extrabold text-gray-900 dark:text-transparent dark:bg-gradient-to-r dark:from-purple-400 dark:to-pink-600 dark:bg-clip-text">
              <div className="bg-gray-900 dark:bg-purple-600 p-1.5 rounded-lg">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              Alenka
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-purple-400 font-medium transition-colors"
              >
                Home
              </Link>
              <a
                href="/#products"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-purple-400 font-medium transition-colors"
              >
                Lokasi Terbaru
              </a>
              <a
                href="https://wa.me/6285242049550"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-purple-400 font-medium transition-colors"
              >
                Hubungi Admin
              </a>
            </div>
            <div className="text-gray-500 dark:text-gray-500 font-medium text-sm">
              © 2025 Alenka Properti – Hak Cipta Dilindungi
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
