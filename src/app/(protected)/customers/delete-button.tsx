"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export function DeleteButton({ customerId }: { customerId: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        toast.error("Failed to delete customer");
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("Error deleting customer");
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="clay-btn bg-[#d64560]/20 hover:bg-[#d64560] text-[#d64560] hover:text-white border-none"
        onClick={() => setIsOpen(true)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="border-none clay-panel">
          <AlertDialogHeader>
            <AlertDialogTitle className="clay-text-title font-extrabold text-xl">
              Peringatan
            </AlertDialogTitle>
            <AlertDialogDescription className="clay-text-muted font-bold">
              Pastikan anda menghapus customer yang kurang potensial.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="clay-btn bg-white/40 hover:bg-white text-[#1f4f59] border-none">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              className="clay-btn bg-[#d64560] hover:bg-[#b0304a] text-white border-none"
              onClick={handleDelete}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
