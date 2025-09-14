import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HomeIcon } from "lucide-react";
import prisma from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";

// Define the product type based on Prisma schema
type Product = {
  id: string;
  title: string;
  lokasi: string | null;
  description: string;
  dpAkad: number;
  videoLink: string | null;
  fee: number;
  imageUrl: string | null;
  createdAt: Date;
};

export default async function Home() {
  // Fetch products from database
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 4, // Limit to 4 products for the homepage
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-sm border-b border-purple-500/20">
        <div className="container mx-auto px-12 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Alenka Properti
          </div>
          <nav className="hidden md:flex space-x-24 ">
            <Link
              href="/"
              className="hover:text-white font-semibold text-purple-400 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/#products"
              className="hover:text-white font-semibold text-purple-400 transition-colors"
            >
              Lokasi Terbaru
            </Link>
            <a
              href="https://wa.me/6285242049550"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white font-semibold text-purple-400 transition-colors"
            >
              Hubungi Admin
            </a>
          </nav>
          <div className="flex space-x-4">
            <Link href="/auth/signup">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-[0_0_10px_#8b5cf6] hover:shadow-[0_0_15px_#8b5cf6] transition-all duration-300">
                Freelance
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-12 py-20 md:py-32">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="block">Alenka Properti</span>
              <span className="block bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Kendari
              </span>
            </h1>
            <p className="text-gray-300 text-lg mb-8 max-w-lg">
              Temukan rumah impian Anda dengan harga terjangkau di seputar kota
              Kendari. Kami juga menyediakan program affiliate untuk kamu bisa
              hasilkan uang jutaan rupiah tanpa harus jualan
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/freelance">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-[0_0_10px_#8b5cf6] hover:shadow-[0_0_15px_#8b5cf6] transition-all duration-300">
                  Pelajari caranya disini
                </Button>
              </Link>
              <Link href="/#products">
                <Button
                  variant="outline"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-[0_0_10px_#8b5cf6] hover:shadow-[0_0_15px_#8b5cf6] transition-all duration-300"
                >
                  <HomeIcon className="mr-2 h-5 w-5 animate-pulse" />
                  Lihat Properti
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full blur-3xl opacity-30 absolute -top-10 -left-10"></div>
              <div className="relative bg-gray-800 border-2 border-purple-500/30 rounded-2xl overflow-hidden shadow-[0_0_30px_#8b5cf6]">
                <div className="bg-gray-700 border-b border-purple-500/30 p-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="h-48 bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-lg flex items-center justify-center">
                    <HomeIcon className="h-16 w-16 text-purple-400 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 text-right">
          <a
            href="https://wa.me/6285242049550"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
          >
            Hubungi Kami: 0852-4204-9550
            <span className="ml-2 animate-bounce">→</span>
          </a>
        </div>
      </section>

      {/* Product Cards Section */}
      <section id="products" className="container mx-auto px-4 py-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Properti Terbaru
          </span>
        </h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              Belum ada properti yang tersedia saat ini.
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-4 md:mb-0">
              Alenka Properti
            </div>
            <div className="flex space-x-6 mb-4 md:mb-0">
              <Link
                href="/"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                Home
              </Link>
              <a
                href="/#products"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                Lokasi Terbaru
              </a>
              <a
                href="https://wa.me/6285242049550"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                Hubungi Admin
              </a>
            </div>
            <div className="text-gray-500">
              © 2025 Alenka Properti – Semua Hak Dilindungi
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
