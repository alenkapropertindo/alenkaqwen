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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  dpAkad: z.string().min(1, {
    message: "DP+Akad is required.",
  }),
  videoLink: z.string().optional(),
  fee: z.string().min(1, {
    message: "Fee is required.",
  }),
  imageUrl: z.string().optional(),
});

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

export function ProductModal({ 
  open, 
  onOpenChange, 
  product,
  onSave
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSave: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      dpAkad: "",
      videoLink: "",
      fee: "",
      imageUrl: "",
    },
  });

  // Reset form when modal opens or product changes
  useEffect(() => {
    if (open) {
      if (product) {
        form.reset({
          title: product.title,
          description: product.description,
          dpAkad: product.dpAkad.toString(),
          videoLink: product.videoLink || "",
          fee: product.fee.toString(),
          imageUrl: product.imageUrl || "",
        });
        setImagePreview(product.imageUrl || null);
      } else {
        form.reset({
          title: "",
          description: "",
          dpAkad: "",
          videoLink: "",
          fee: "",
          imageUrl: "",
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
          description: values.description,
          dpAkad: parseInt(values.dpAkad),
          videoLink: values.videoLink || null,
          fee: parseInt(values.fee),
          imageUrl: values.imageUrl || null,
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
    } catch (error: any) {
      console.error(`Error ${product ? "updating" : "creating"} product:`, error);
      toast.error(error.message || `Failed to ${product ? "update" : "create"} product`);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload this to a storage service
      // For now, we'll just create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        form.setValue("imageUrl", result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] border-purple-500/30 bg-gray-900 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-purple-400">
            {product ? "Edit Product" : "Tambah Produk"}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {product 
              ? "Edit the details of the product." 
              : "Enter the details of the new product."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-purple-300">Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Product title"
                      {...field}
                      className="bg-gray-800 border-purple-500/30 text-white"
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
                  <FormLabel className="text-purple-300">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Product description"
                      {...field}
                      className="bg-gray-800 border-purple-500/30 text-white"
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
                    <FormLabel className="text-purple-300">DP+Akad (Rp)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="DP+Akad amount"
                        {...field}
                        className="bg-gray-800 border-purple-500/30 text-white"
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
                    <FormLabel className="text-purple-300">Fee Penjualan (Rp)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Fee amount"
                        {...field}
                        className="bg-gray-800 border-purple-500/30 text-white"
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
                  <FormLabel className="text-purple-300">Video Link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/video"
                      {...field}
                      className="bg-gray-800 border-purple-500/30 text-white"
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
                  <FormLabel className="text-purple-300">Image</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="bg-gray-800 border-purple-500/30 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                      />
                      <Input
                        type="hidden"
                        {...field}
                      />
                      {imagePreview && (
                        <div className="mt-2">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-full h-48 object-cover rounded-lg border border-purple-500/30"
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                className="border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white shadow-[0_0_10px_#8b5cf6] hover:shadow-[0_0_15px_#8b5cf6] transition-all duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? (product ? "Updating..." : "Creating...") 
                  : (product ? "Update Produk" : "Tambah Produk")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}