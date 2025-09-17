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

    // Sort products: Promo category first, then by creation date
    result.sort((a, b) => {
      // If both are Promo or both are not Promo, sort by createdAt (newest first)
      if ((a.kategori === "Promo") === (b.kategori === "Promo")) {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      // If only a is Promo, a comes first
      if (a.kategori === "Promo") return -1;
      // If only b is Promo, b comes first
      return 1;
    });

    setFilteredProducts(result);
  }, [searchTerm, selectedLokasi, selectedKategori, products]);

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="bg-gray-900/50 border border-purple-500/30 rounded-xl p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari properti..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-purple-500/30 text-white placeholder-gray-400"
            />
          </div>

          {/* Lokasi Filter */}
          <Select value={selectedLokasi} onValueChange={setSelectedLokasi}>
            <SelectTrigger className="bg-gray-800 border-purple-500/30 text-white">
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
            <SelectTrigger className="bg-gray-800 border-purple-500/30 text-white">
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Semua Kategori</SelectItem>
              {uniqueKategori.map((kategori) => (
                <SelectItem key={kategori} value={kategori}>
                  {kategori === "Dp_Rendah" ? "DP Rendah" : kategori}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            Tidak ada properti yang sesuai dengan kriteria pencarian.
          </p>
        </div>
      )}
    </div>
  );
}
