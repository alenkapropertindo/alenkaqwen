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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  whatsapp: z.string().min(10, {
    message: "WhatsApp number must be at least 10 characters.",
  }),
});

export function AddCustomerModal({ open, onOpenChange, onCustomerCreated }: { open: boolean; onOpenChange: (open: boolean) => void; onCustomerCreated?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      whatsapp: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      // Create customer in database with default values for komisi and status
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          komisi: 1000000, // Default value
          status: "FOLLOWUP" // Default value
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        toast.error(errorText || "Failed to create customer");
        return;
      }

      // Close the modal and refresh the parent page
      onOpenChange(false);
      
      // Call the callback function to update the customer list
      if (onCustomerCreated) {
        onCustomerCreated();
      }
      
      toast.success("Customer created successfully");
    } catch (error) {
      console.error("Error creating customer:", error);
      toast.error("Failed to create customer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      form.reset({
        name: "",
        whatsapp: "",
      });
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] border-none clay-panel">
        <DialogHeader>
          <DialogTitle className="clay-text-title font-extrabold text-xl">Tambah Customer Baru</DialogTitle>
          <DialogDescription className="clay-text-muted font-bold">
            Masukkan detail customer baru.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="clay-text-title font-bold">Nama</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nama customer"
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
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="clay-text-title font-bold">WhatsApp</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nomor WhatsApp"
                      {...field}
                      className="clay-panel border-none text-[#1f4f59] focus:ring-2 focus:ring-white/50 h-12"
                    />
                  </FormControl>
                  <FormDescription className="clay-text-muted font-bold text-xs mt-1">
                    Sertakan kode negara (misal, 6281234567890)
                  </FormDescription>
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
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sedang menyimpan..." : "Simpan Customer"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
