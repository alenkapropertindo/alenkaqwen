"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/product-card";

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

export function ProductFilter({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLokasi, setSelectedLokasi] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("");

  // Get unique locations and categories
  const uniqueLokasi = Array.from(
    new Set(
      initialProducts
        .map((p) => p.lokasi)
        .filter((lokasi): lokasi is string => lokasi !== null)
    )
  ).sort();

  const uniqueKategori = Array.from(
    new Set(
      initialProducts
        .map((p) => p.kategori)
        .filter((kategori): kategori is string => kategori !== null)
    )
  ).sort();

  // Filter products based on search term, location, and category
  useEffect(() => {
    let result = [...products];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term) ||
          (product.detail && product.detail.toLowerCase().includes(term)) ||
          (product.lokasi && product.lokasi.toLowerCase().includes(term))
      );
    }

    // Apply location filter
    if (selectedLokasi && selectedLokasi !== "__all__") {
      result = result.filter((product) => product.lokasi === selectedLokasi);
    }

    // Apply category filter
    if (selectedKategori && selectedKategori !== "__all__") {
      result = result.filter(
        (product) => product.kategori === selectedKategori
      );
    }

    // Sort products: DP_Akad_Gratis first, then Promo, then by creation date (newest first)
    result.sort((a, b) => {
      const getPriority = (kategori: string | null) => {
        if (kategori === "DP_Akad_Gratis") return 2;
        if (kategori === "Promo") return 1;
        return 0;
      };

      const priorityA = getPriority(a.kategori);
      const priorityB = getPriority(b.kategori);

      // If they have different priorities, the one with higher priority comes first
      if (priorityA !== priorityB) {
        return priorityB - priorityA;
      }

      // If priorities are the same, sort by createdAt (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setFilteredProducts(result);
  }, [searchTerm, selectedLokasi, selectedKategori, products]);

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="relative overflow-hidden mb-8">

        <div className="relative z-10 clay-panel p-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="relative clay-card flex items-center px-3 py-1">
              <Search className="text-[#5394a0] h-5 w-5 mr-2" />
              <input
                placeholder="Cari properti..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-none focus:outline-none text-[#2b707d] placeholder-[#5394a0] font-medium py-2"
              />
            </div>

            {/* Lokasi Filter */}
            <Select value={selectedLokasi} onValueChange={setSelectedLokasi}>
              <SelectTrigger className="clay-card border-none text-[#2b707d] font-bold h-12">
                <SelectValue placeholder="Semua Lokasi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Semua Lokasi</SelectItem>
                {uniqueLokasi.map((lokasi) => (
                  <SelectItem key={lokasi} value={lokasi}>
                    {lokasi}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Kategori Filter */}
            <Select value={selectedKategori} onValueChange={setSelectedKategori}>
              <SelectTrigger className="clay-card border-none text-[#2b707d] font-bold h-12">
                <SelectValue placeholder="Semua Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Semua Kategori</SelectItem>
                {uniqueKategori.map((kategori) => (
                  <SelectItem key={kategori} value={kategori}>
                    {kategori === "Dp_Rendah" ? "DP Rendah" : kategori === "DP_Akad_Gratis" ? "DP Akad Gratis" : kategori}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Product Cards */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-8 gap-2">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 clay-panel">
          <p className="clay-text-title font-bold text-lg">
            Tidak ada properti yang sesuai dengan kriteria pencarian.
          </p>
        </div>
      )}
    </div>
  );
}
