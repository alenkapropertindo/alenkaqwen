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
  description: string;
  dpAkad: number;
  videoLink: string | null;
  fee: number;
  imageUrl: string | null;
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

  if (loading) {
    return (
      <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
        <div className="space-y-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Products
          </h1>
        </div>
        <div className="bg-gray-800/50 border border-purple-900/50 rounded-xl p-8 shadow-lg">
          <p className="text-purple-200 text-xl">Loading products...</p>
        </div>
      </div>
    );
  }

  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Products
          </h1>
          {isAdmin && (
            <Button 
              onClick={handleCreateProduct}
              className="bg-purple-600 hover:bg-purple-700 text-white shadow-[0_0_10px_#8b5cf6] hover:shadow-[0_0_15px_#8b5cf6] transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Produk
            </Button>
          )}
        </div>
        <p className="text-purple-200 text-lg">Manage all products</p>
      </div>
      
      <div className="bg-gray-800/50 border border-purple-900/50 rounded-xl overflow-hidden shadow-lg">
        <Table>
          <TableHeader>
            <TableRow className="border-purple-900/50 hover:bg-gray-800">
              <TableHead className="text-purple-200 text-lg font-semibold">Item</TableHead>
              <TableHead className="text-purple-200 text-lg font-semibold">DP+Akad (Rp)</TableHead>
              <TableHead className="text-purple-200 text-lg font-semibold">Deskripsi</TableHead>
              <TableHead className="text-purple-200 text-lg font-semibold">Link Video</TableHead>
              <TableHead className="text-purple-200 text-lg font-semibold">Fee Penjualan (Rp)</TableHead>
              <TableHead className="text-purple-200 text-lg font-semibold">Gambar</TableHead>
              {isAdmin && (
                <TableHead className="text-purple-200 text-lg font-semibold">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="border-purple-900/30 hover:bg-gray-800/50">
                <TableCell className="font-medium text-white py-4">{product.title}</TableCell>
                <TableCell className="text-gray-300 py-4">{formatRupiah(product.dpAkad)}</TableCell>
                <TableCell className="text-gray-300 py-4 max-w-xs truncate">{product.description}</TableCell>
                <TableCell className="text-gray-300 py-4">
                  {product.videoLink ? (
                    <a 
                      href={product.videoLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 underline"
                    >
                      View Video
                    </a>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className="text-gray-300 py-4">{formatRupiah(product.fee)}</TableCell>
                <TableCell className="text-gray-300 py-4">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.title} 
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    "No Image"
                  )}
                </TableCell>
                {isAdmin && (
                  <TableCell className="py-4">
                    <div className="flex space-x-2">
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