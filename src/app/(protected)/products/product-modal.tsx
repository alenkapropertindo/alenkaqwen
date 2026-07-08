"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { put } from "@vercel/blob";


const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  detail: z.string().optional(),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  kategori: z.string().optional(),
  dpAkad: z.string().min(1, {
    message: "DP+Akad is required.",
  }),
  videoLink: z.string().optional(),
  fee: z.string().min(1, {
    message: "Fee is required.",
  }),
  imageUrl: z.string().optional(),
  lokasi: z.string().optional(),
});

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

export function ProductModal({
  open,
  onOpenChange,
  product,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSave: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      detail: "",
      description: "",
      kategori: "",
      dpAkad: "",
      videoLink: "",
      fee: "",
      imageUrl: "",
      lokasi: "",
    },
  });

  // Reset form when modal opens or product changes
  useEffect(() => {
    if (open) {
      if (product) {
        form.reset({
          title: product.title,
          detail: product.detail || "",
          description: product.description,
          kategori: product.kategori || "",
          dpAkad: product.dpAkad.toString(),
          videoLink: product.videoLink || "",
          fee: product.fee.toString(),
          imageUrl: product.imageUrl || "",
          lokasi: product.lokasi || "",
        });
        setImagePreview(product.imageUrl || null);
      } else {
        form.reset({
          title: "",
          detail: "",
          description: "",
          kategori: "",
          dpAkad: "",
          videoLink: "",
          fee: "",
          imageUrl: "",
          lokasi: "",
        });
        setImagePreview(null);
      }
    }
  }, [open, product, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      // For update, we need to extract just the ID, not the full path
      const url = product ? `/api/products/${product.id}` : "/api/products";
      const method = product ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: values.title,
          detail: values.detail || null,
          description: values.description,
          kategori: values.kategori || null,
          dpAkad: parseInt(values.dpAkad),
          videoLink: values.videoLink || null,
          fee: parseInt(values.fee),
          imageUrl: values.imageUrl || null,
          lokasi: values.lokasi || null,
        }),
      });

      // Check if response is OK before trying to parse JSON
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = "Failed to save product";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If we can't parse JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Try to parse the response
      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error("Invalid response from server");
      }

      // Close the modal and refresh the parent page
      onOpenChange(false);
      toast.success(`Product ${product ? "updated" : "created"} successfully`);
      onSave();
    } catch (error) {
      console.error(
        `Error ${product ? "updating" : "creating"} product:`,
        error
      );
      let errorMessage = `Failed to ${product ? "update" : "create"} product`;
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        // Create FormData object
        const formData = new FormData();
        formData.append("file", file);

        // Upload to our API route which handles Vercel Blob upload
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to upload image");
        }

        const { url } = await response.json();

        setImagePreview(url);
        form.setValue("imageUrl", url);
        toast.success("Image uploaded successfully");
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image: " + (error instanceof Error ? error.message : "Unknown error"));
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] border-none clay-panel max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="clay-text-title font-extrabold text-xl">
            {product ? "Edit Produk" : "Tambah Produk"}
          </DialogTitle>
          <DialogDescription className="clay-text-muted font-bold">
            {product
              ? "Edit detail produk."
              : "Masukkan detail produk baru."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="clay-text-title font-bold">Judul</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Judul produk"
                      {...field}
                      className="clay-panel border-none text-[#1f4f59] focus:ring-2 focus:ring-white/50 h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="detail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="clay-text-title font-bold">Detail</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Detail produk"
                      {...field}
                      className="clay-panel border-none text-[#1f4f59] focus:ring-2 focus:ring-white/50 h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="kategori"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="clay-text-title font-bold">Kategori</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="clay-panel border-none text-[#2b2d35] dark:text-[#e6e8ec] focus:ring-2 focus:ring-white/50 h-12">
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#e6e8ec] dark:bg-[#1e222b] border-white/40 dark:border-white/10 rounded-[20px]">
                      <SelectItem value="Strategis" className="clay-text-title font-bold focus:bg-white/40 focus:text-[#731b31]">Strategis</SelectItem>
                      <SelectItem value="Promo" className="clay-text-title font-bold focus:bg-white/40 focus:text-[#731b31]">Promo</SelectItem>
                      <SelectItem value="Dp_Rendah" className="clay-text-title font-bold focus:bg-white/40 focus:text-[#731b31]">Dp_Rendah</SelectItem>
                      <SelectItem value="DP_Akad_Gratis" className="clay-text-title font-bold focus:bg-white/40 focus:text-[#731b31]">DP Akad Gratis</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lokasi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="clay-text-title font-bold">Lokasi</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Lokasi produk"
                      {...field}
                      className="clay-panel border-none text-[#1f4f59] focus:ring-2 focus:ring-white/50 h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="clay-text-title font-bold">Deskripsi</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Deskripsi produk"
                      {...field}
                      className="clay-panel border-none text-[#1f4f59] focus:ring-2 focus:ring-white/50"
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dpAkad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="clay-text-title font-bold">
                      DP+Akad (Rp)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Nominal DP+Akad"
                        {...field}
                        className="clay-panel border-none text-[#1f4f59] focus:ring-2 focus:ring-white/50 h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="clay-text-title font-bold">
                      Fee Penjualan (Rp)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Nominal fee"
                        {...field}
                        className="clay-panel border-none text-[#1f4f59] focus:ring-2 focus:ring-white/50 h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="videoLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="clay-text-title font-bold">Video Link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/video"
                      {...field}
                      className="clay-panel border-none text-[#1f4f59] focus:ring-2 focus:ring-white/50 h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="clay-text-title font-bold">Image</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={uploading}
                        className="clay-panel border-none text-[#1f4f59] focus:ring-2 focus:ring-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#d64560] file:text-white hover:file:bg-[#731b31] h-auto p-2"
                      />
                      <Input type="hidden" {...field} />
                      {uploading && (
                        <p className="clay-text-muted font-bold text-sm">
                          Sedang mengunggah gambar...
                        </p>
                      )}
                      {imagePreview && (
                        <div className="mt-2">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-[20px] border-4 border-white shadow-sm"
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0 mt-4">
              <Button
                type="button"
                variant="outline"
                className="clay-btn bg-white/40 hover:bg-white text-[#1f4f59] border-none"
                onClick={() => onOpenChange(false)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="clay-btn-primary"
                disabled={isSubmitting || uploading}
              >
                {isSubmitting || uploading
                  ? uploading
                    ? "Sedang mengunggah..."
                    : product
                    ? "Sedang memperbarui..."
                    : "Sedang membuat..."
                  : product
                  ? "Update Produk"
                  : "Tambah Produk"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
