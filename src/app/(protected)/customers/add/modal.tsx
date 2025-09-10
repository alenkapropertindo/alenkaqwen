"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

export function AddCustomerModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
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
          status: "followup" // Default value
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        toast.error(errorText || "Failed to create customer");
        return;
      }

      // Close the modal and refresh the parent page
      onOpenChange(false);
      router.refresh();
      toast.success("Customer created successfully");
    } catch (error: any) {
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
      <DialogContent className="sm:max-w-[425px] border-purple-500/30 bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-purple-400">Add New Customer</DialogTitle>
          <DialogDescription className="text-gray-400">
            Enter the details of the new customer.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-purple-300">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Customer name"
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
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-purple-300">WhatsApp</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="WhatsApp number"
                      {...field}
                      className="bg-gray-800 border-purple-500/30 text-white"
                    />
                  </FormControl>
                  <FormDescription className="text-gray-400">
                    Include country code (e.g., 6281234567890)
                  </FormDescription>
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
                {isSubmitting ? "Creating..." : "Create Customer"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
