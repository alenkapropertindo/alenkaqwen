"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductModal } from "./product-modal";
import { Trash2, Plus, Edit3, Search } from "lucide-react";

interface Product {
  id: string;
  title: string;
  detail: string | null;
  description: string;
  kategori: string | null;
  dpAkad: number;
  videoLink: string | null;
  fee: number;
  imageUrl: string | null;
  lokasi: string | null;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
}

export default function ProductsClientPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLokasi, setSelectedLokasi] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("");
  const [sortBy, setSortBy] = useState("createdAt"); // Default sort by creation date
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetchProducts();
    fetchUser();
    fetchUniqueLokasi();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 500); // Debounce search input

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedLokasi, selectedKategori, sortBy, sortOrder]);

  const [uniqueLokasi, setUniqueLokasi] = useState<string[]>([]);
  
  const fetchUser = async () => {
    try {
      const response = await fetch("/api/users/me");
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch user");
      }
      
      setUser(data.user);
    } catch (error: any) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchUniqueLokasi = async () => {
    try {
      const response = await fetch("/api/products/lokasi");
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch locations");
      }
      
      setUniqueLokasi(data.lokasi);
    } catch (error: any) {
      console.error("Error fetching locations:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedLokasi && selectedLokasi !== "__all__") params.append('lokasi', selectedLokasi);
      if (selectedKategori && selectedKategori !== "__all__") params.append('kategori', selectedKategori);
      if (sortBy) params.append('sortBy', sortBy);
      if (sortOrder) params.append('sortOrder', sortOrder);
      
      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch products");
      }
      
      setProducts(data.products);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }
    
    try {
      setDeletingProductId(id);
      
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete product");
      }
      
      // Remove the product from the local state
      setProducts(products.filter(product => product.id !== id));
      toast.success("Product deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete product");
    } finally {
      setDeletingProductId(null);
    }
  };

  const handleSaveProduct = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    fetchProducts();
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatKategori = (kategori: string | null) => {
    if (!kategori) return "-";
    
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

  if (loading) {
    return (
      <div className="px-4 sm:px-6 py-8 container mx-auto w-full space-y-8">
        <div className="space-y-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold clay-text-title">
            Products
          </h1>
        </div>
        <div className="clay-panel p-6 sm:p-8">
          <p className="clay-text-muted font-bold text-xl">Memuat daftar produk...</p>
        </div>
      </div>
    );
  }

  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="px-4 sm:px-6 py-8 container mx-auto w-full space-y-8">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold clay-text-title">
            Products
          </h1>
          {isAdmin && (
            <Button 
              onClick={handleCreateProduct}
              className="clay-btn-primary w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Produk
            </Button>
          )}
        </div>
        <p className="clay-text-muted font-bold text-lg">Manage all products</p>
      </div>
      
      {/* Search and Filter Controls */}
      <div className="clay-panel p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#366873] h-4 w-4" />
            <Input
              placeholder="Cari produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 clay-panel border-none text-[#1f4f59] focus:ring-2 focus:ring-white/50 h-12"
            />
          </div>
          
          {/* Lokasi Filter */}
          <Select value={selectedLokasi} onValueChange={setSelectedLokasi}>
            <SelectTrigger className="bg-white/40 border-white text-[#1f4f59] font-bold focus:ring-[#d64560] rounded-[20px] backdrop-blur-md transition-colors h-12">
              <SelectValue placeholder="Semua Lokasi" />
            </SelectTrigger>
            <SelectContent className="bg-[#aae4ee] border-white/40 rounded-[20px]">
              <SelectItem value="__all__" className="clay-text-title font-bold focus:bg-white/40 focus:text-[#731b31]">Semua Lokasi</SelectItem>
              {uniqueLokasi.map((lokasi) => (
                <SelectItem key={lokasi} value={lokasi} className="clay-text-title font-bold focus:bg-white/40 focus:text-[#731b31]">
                  {lokasi}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Kategori Filter */}
          <Select value={selectedKategori} onValueChange={setSelectedKategori}>
            <SelectTrigger className="bg-white/40 border-white text-[#1f4f59] font-bold focus:ring-[#d64560] rounded-[20px] backdrop-blur-md transition-colors h-12">
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent className="bg-[#aae4ee] border-white/40 rounded-[20px]">
              <SelectItem value="__all__" className="clay-text-title font-bold focus:bg-white/40 focus:text-[#731b31]">Semua Kategori</SelectItem>
              <SelectItem value="Strategis" className="clay-text-title font-bold focus:bg-white/40 focus:text-[#731b31]">Strategis</SelectItem>
              <SelectItem value="Promo" className="clay-text-title font-bold focus:bg-white/40 focus:text-[#731b31]">Promo</SelectItem>
              <SelectItem value="Dp_Rendah" className="clay-text-title font-bold focus:bg-white/40 focus:text-[#731b31]">DP Rendah</SelectItem>
              <SelectItem value="DP_Akad_Gratis" className="clay-text-title font-bold focus:bg-white/40 focus:text-[#731b31]">DP Akad Gratis</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Sort By */}
          <Select value={sortBy} onValueChange={(value) => {
            setSortBy(value);
            if (value === "fee") {
              setSortOrder("desc"); // Default to descending for fee
            }
          }}>
            <SelectTrigger className="bg-white/40 border-white text-[#1f4f59] font-bold focus:ring-[#d64560] rounded-[20px] backdrop-blur-md transition-colors h-12">
              <SelectValue placeholder="Urutkan Berdasarkan" />
            </SelectTrigger>
            <SelectContent className="bg-[#aae4ee] border-white/40 rounded-[20px]">
              <SelectItem value="createdAt" className="clay-text-title font-bold focus:bg-white/40 focus:text-[#731b31]">Tanggal Terbaru</SelectItem>
              <SelectItem value="fee" className="clay-text-title font-bold focus:bg-white/40 focus:text-[#731b31]">Fee Penjualan Tertinggi</SelectItem>
              <SelectItem value="title" className="clay-text-title font-bold focus:bg-white/40 focus:text-[#731b31]">Nama Produk (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="clay-panel overflow-x-auto p-4">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-white/40 hover:bg-white/40">
              <TableHead className="clay-text-title text-sm sm:text-lg font-extrabold whitespace-nowrap">Item</TableHead>
              {isAdmin && (
                <TableHead className="clay-text-title text-sm sm:text-lg font-extrabold">Detail</TableHead>
              )}
              <TableHead className="clay-text-title text-sm sm:text-lg font-extrabold">Kategori</TableHead>
              <TableHead className="clay-text-title text-sm sm:text-lg font-extrabold">Lokasi</TableHead>
              <TableHead className="clay-text-title text-sm sm:text-lg font-extrabold whitespace-nowrap">DP+Akad (Rp)</TableHead>
              {isAdmin && (
                <TableHead className="clay-text-title text-sm sm:text-lg font-extrabold">Deskripsi</TableHead>
              )}
              <TableHead className="clay-text-title text-sm sm:text-lg font-extrabold whitespace-nowrap">Link Video</TableHead>
              <TableHead className="clay-text-title text-sm sm:text-lg font-extrabold whitespace-nowrap">Fee Penjualan (Rp)</TableHead>
              <TableHead className="clay-text-title text-sm sm:text-lg font-extrabold">Gambar</TableHead>
              {isAdmin && (
                <TableHead className="clay-text-title text-sm sm:text-lg font-extrabold text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="border-white/40 hover:bg-white/20">
                <TableCell className="clay-text-title font-bold py-4 max-w-[150px] truncate">{product.title}</TableCell>
                {isAdmin && (
                  <TableCell className="clay-text-muted font-bold py-4 max-w-[150px] truncate">{product.detail || "-"}</TableCell>
                )}
                <TableCell className="clay-text-muted font-bold py-4">{formatKategori(product.kategori)}</TableCell>
                <TableCell className="clay-text-muted font-bold py-4 max-w-[120px] truncate">{product.lokasi || "-"}</TableCell>
                <TableCell className="clay-text-muted font-bold py-4 whitespace-nowrap">{formatRupiah(product.dpAkad)}</TableCell>
                {isAdmin && (
                  <TableCell className="clay-text-muted font-bold py-4 max-w-[200px] truncate">{product.description}</TableCell>
                )}
                <TableCell className="clay-text-muted font-bold py-4 max-w-[120px] truncate">
                  {product.videoLink ? (
                    <a 
                      href={product.videoLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#d64560] hover:underline truncate block font-bold"
                    >
                      View Video
                    </a>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className="clay-text-muted font-bold py-4 whitespace-nowrap">{formatRupiah(product.fee)}</TableCell>
                <TableCell className="clay-text-muted font-bold py-4">
                  <div className="flex flex-col gap-2">
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={`${product.title} - Image 1`} 
                        className="w-16 h-16 object-cover rounded-[10px] border-2 border-white shadow-sm"
                      />
                    ) : "No Images"}
                  </div>
                </TableCell>
                {isAdmin && (
                  <TableCell className="py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                        className="clay-btn bg-white/40 hover:bg-white text-[#1f4f59] border-none"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        disabled={deletingProductId === product.id}
                        className="clay-btn bg-[#d64560]/20 hover:bg-[#d64560] text-[#d64560] hover:text-white border-none"
                      >
                        {deletingProductId === product.id ? (
                          "Deleting..."
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="clay-text-muted font-bold">No products found</p>
          </div>
        )}
      </div>
      
      <ProductModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen}
        product={editingProduct}
        onSave={handleSaveProduct}
      />
    </div>
  );
}