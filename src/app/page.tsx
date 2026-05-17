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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-white rounded-full blur-[120px] opacity-70 animate-pulse"></div>

      <div className="relative w-full max-w-md mx-auto clay-panel p-4">
        {/* Main Image/Card */}
        <div className="relative overflow-hidden rounded-[28px] z-0 cursor-pointer clay-card">

          <div className="relative z-10 w-full rounded-[28px] overflow-hidden">
            <div className="h-72 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>

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
                  <MapPin className="w-4 h-4 text-white animate-bounce" /> Kendari City
                </div>
              </div>
            </div>

            <div className="p-5 flex justify-between items-center relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-xs clay-text-muted uppercase font-bold tracking-wider mb-1">Cicilan Mulai</div>
                <div className="text-2xl font-extrabold clay-text-title">
                  Rp 1 Juta-an
                </div>
              </div>

              <button className="clay-btn-primary w-12 h-12 flex items-center justify-center relative z-10">
                <ArrowRight className="w-5 h-5 text-[#1f4d36]" />
              </button>
            </div>
          </div>
        </div>

        {/* Floating Stat Card 1 */}
        <div className="absolute -left-2 sm:-left-12 top-16 clay-card-pink p-4 animate-bounce" style={{ animationDuration: '4s' }}>
          <div className="flex items-center gap-4">
            <div className="bg-white/40 p-2.5 rounded-full">
              <TrendingUp className="w-6 h-6 text-[#6a2835]" />
            </div>
            <div>
              <div className="text-lg font-black text-[#6a2835]">ROI Tinggi</div>
              <div className="text-xs font-bold text-[#6a2835]/80">Investasi Aman</div>
            </div>
          </div>
        </div>

        {/* Floating Stat Card 2 */}
        <div className="absolute -right-2 sm:-right-8 bottom-20 clay-card-yellow p-4 animate-bounce" style={{ animationDuration: '5s', animationDelay: '1s' }}>
          <div className="flex items-center gap-4">
            <div className="bg-white/40 p-2.5 rounded-full">
              <Users className="w-6 h-6 text-[#63490b]" />
            </div>
            <div>
              <div className="text-lg font-black text-[#63490b]">Affiliate</div>
              <div className="text-xs font-bold text-[#63490b]/80">Komisi Jutaan</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen clay-bg transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#c4ebf2]/80 backdrop-blur-md transition-colors duration-300 border-b border-white/40 shadow-sm">
        <div className="container mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-2xl font-extrabold clay-text-title transition-colors">
            <div className="clay-card-yellow p-1.5 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[#63490b]" />
            </div>
            Alenka
          </div>
          <nav className="hidden md:flex space-x-12">
            <Link
              href="/"
              className="hover:text-[#d64560] font-bold clay-text-muted transition-colors"
            >
              Home
            </Link>
            <Link
              href="/#products"
              className="hover:text-[#d64560] font-bold clay-text-muted transition-colors"
            >
              Lokasi Terbaru
            </Link>
            <a
              href="https://wa.me/6285242049550"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#d64560] font-bold clay-text-muted transition-colors"
            >
              Hubungi Admin
            </a>
          </nav>
          <div className="flex space-x-4">
            <Link href="/auth/signup">
              <button className="clay-btn-primary px-6 py-2.5">
                Freelance
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 md:px-12 pt-12 pb-4 md:py-24 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between relative z-10">
          <div className="lg:w-1/2 mb-4 lg:mb-0">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full clay-card-yellow text-sm font-bold text-[#63490b] mb-6">
              <span className="flex h-2 w-2 rounded-full bg-white animate-pulse"></span>
              Properti Terbaik di Kelasnya
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight clay-text-title leading-[1.1]">
              Temukan <span className="text-[#d64560] drop-shadow-sm">Rumah Impianmu</span><br />
              di Kota Kendari
            </h1>


            {/* Mobile Hero Visual */}
            <div className="flex lg:hidden justify-center relative w-full mb-12 mt-4">
              {heroVisual}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/freelance">
                <button className="clay-btn-primary h-14 px-8 text-base w-full sm:w-auto flex items-center justify-center">
                  Gabung Freelance
                </button>
              </Link>
              <Link href="/#products">
                <button
                  className="clay-btn h-14 px-8 text-base w-full sm:w-auto flex items-center justify-center"
                >
                  <HomeIcon className="mr-2 h-5 w-5" />
                  Lihat Properti
                </button>
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-3">
                <img className="w-12 h-12 rounded-full border-4 border-[#c4ebf2] object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="User" />
                <img className="w-12 h-12 rounded-full border-4 border-[#c4ebf2] object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" alt="User" />
                <img className="w-12 h-12 rounded-full border-4 border-[#c4ebf2] object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="User" />
                <div className="w-12 h-12 rounded-full border-4 border-[#c4ebf2] clay-card-pink flex items-center justify-center text-xs font-bold text-[#6a2835]">+2k</div>
              </div>
              <div className="text-sm font-medium clay-text-muted">
                Dipercaya oleh <span className="font-bold clay-text-title">2,000+</span> pelanggan
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
          <div className="inline-block px-5 py-2 rounded-full clay-card-pink text-[#6a2835] text-sm font-bold mb-6">
            Eksplorasi Katalog
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold clay-text-title">
            Properti <span className="text-[#d64560]">Terbaru</span>
          </h2>
        </div>
        <ProductFilter initialProducts={products} />
      </section>

      {/* Footer */}
      <footer className="bg-[#aae4ee] py-16 mt-12 rounded-t-[40px] shadow-[inset_0_8px_16px_rgba(120,190,205,0.6)]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2 text-2xl font-extrabold clay-text-title">
              <div className="clay-card-yellow p-1.5 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-[#63490b]" />
              </div>
              Alenka
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              <Link
                href="/"
                className="font-bold clay-text-title hover:text-[#d64560] transition-colors"
              >
                Home
              </Link>
              <a
                href="/#products"
                className="font-bold clay-text-title hover:text-[#d64560] transition-colors"
              >
                Lokasi Terbaru
              </a>
              <a
                href="https://wa.me/6285242049550"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold clay-text-title hover:text-[#d64560] transition-colors"
              >
                Hubungi Admin
              </a>
            </div>
            <div className="clay-text-title font-bold text-sm">
              © 2025 Alenka Properti – Hak Cipta Dilindungi
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
