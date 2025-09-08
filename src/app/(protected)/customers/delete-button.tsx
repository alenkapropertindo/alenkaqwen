"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function DeleteButton({ customerId }: { customerId: string }) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="border-red-500 text-red-400 hover:bg-red-500/10 hover:text-red-300"
      onClick={async () => {
        if (confirm("Are you sure you want to delete this customer?")) {
          try {
            const response = await fetch(`/api/customers/${customerId}`, {
              method: "DELETE",
            });
            
            if (response.ok) {
              // Refresh the page to show updated data
              window.location.reload();
            } else {
              console.error("Failed to delete customer");
            }
          } catch (error) {
            console.error("Error deleting customer:", error);
          }
        }
      }}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}