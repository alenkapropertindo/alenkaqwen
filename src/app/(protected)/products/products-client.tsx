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
import { ProductModal } from "./product-modal";
import { Trash2, Plus, Edit3 } from "lucide-react";

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
  imageUrl2: string | null;
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

  useEffect(() => {
    fetchProducts();
    fetchUser();
  }, []);

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

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
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
      default:
        return kategori;
    }
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 py-8 container mx-auto w-full space-y-8">
        <div className="space-y-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Products
          </h1>
        </div>
        <div className="bg-gray-800/50 border border-purple-900/50 rounded-xl p-6 sm:p-8 shadow-lg">
          <p className="text-purple-200 text-xl">Loading products...</p>
        </div>
      </div>
    );
  }

  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="px-4 sm:px-6 py-8 container mx-auto w-full space-y-8">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Products
          </h1>
          {isAdmin && (
            <Button 
              onClick={handleCreateProduct}
              className="bg-purple-600 hover:bg-purple-700 text-white shadow-[0_0_10px_#8b5cf6] hover:shadow-[0_0_15px_#8b5cf6] transition-all duration-300 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Produk
            </Button>
          )}
        </div>
        <p className="text-purple-200 text-lg">Manage all products</p>
      </div>
      
      <div className="bg-gray-800/50 border border-purple-900/50 rounded-xl overflow-x-auto shadow-lg">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-purple-900/50 hover:bg-gray-800">
              <TableHead className="text-purple-200 text-sm sm:text-lg font-semibold whitespace-nowrap">Item</TableHead>
              <TableHead className="text-purple-200 text-sm sm:text-lg font-semibold">Detail</TableHead>
              <TableHead className="text-purple-200 text-sm sm:text-lg font-semibold">Kategori</TableHead>
              <TableHead className="text-purple-200 text-sm sm:text-lg font-semibold">Lokasi</TableHead>
              <TableHead className="text-purple-200 text-sm sm:text-lg font-semibold whitespace-nowrap">DP+Akad (Rp)</TableHead>
              <TableHead className="text-purple-200 text-sm sm:text-lg font-semibold">Deskripsi</TableHead>
              <TableHead className="text-purple-200 text-sm sm:text-lg font-semibold whitespace-nowrap">Link Video</TableHead>
              <TableHead className="text-purple-200 text-sm sm:text-lg font-semibold whitespace-nowrap">Fee Penjualan (Rp)</TableHead>
              <TableHead className="text-purple-200 text-sm sm:text-lg font-semibold">Gambar</TableHead>
              {isAdmin && (
                <TableHead className="text-purple-200 text-sm sm:text-lg font-semibold text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="border-purple-900/30 hover:bg-gray-800/50">
                <TableCell className="font-medium text-white py-4 max-w-[150px] truncate">{product.title}</TableCell>
                <TableCell className="text-gray-300 py-4 max-w-[150px] truncate">{product.detail || "-"}</TableCell>
                <TableCell className="text-gray-300 py-4">{formatKategori(product.kategori)}</TableCell>
                <TableCell className="text-gray-300 py-4 max-w-[120px] truncate">{product.lokasi || "-"}</TableCell>
                <TableCell className="text-gray-300 py-4 whitespace-nowrap">{formatRupiah(product.dpAkad)}</TableCell>
                <TableCell className="text-gray-300 py-4 max-w-[200px] truncate">{product.description}</TableCell>
                <TableCell className="text-gray-300 py-4 max-w-[120px] truncate">
                  {product.videoLink ? (
                    <a 
                      href={product.videoLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 underline truncate block"
                    >
                      View Video
                    </a>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className="text-gray-300 py-4 whitespace-nowrap">{formatRupiah(product.fee)}</TableCell>
                <TableCell className="text-gray-300 py-4">
                  <div className="flex flex-col gap-2">
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={`${product.title} - Image 1`} 
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : null}
                    {product.imageUrl2 ? (
                      <img 
                        src={product.imageUrl2} 
                        alt={`${product.title} - Image 2`} 
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : null}
                    {!product.imageUrl && !product.imageUrl2 && "No Images"}
                  </div>
                </TableCell>
                {isAdmin && (
                  <TableCell className="py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                        className="border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        disabled={deletingProductId === product.id}
                        className="border-red-500 text-red-400 hover:bg-red-500/10 hover:text-red-300"
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
            <p className="text-gray-400">No products found</p>
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