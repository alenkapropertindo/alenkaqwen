"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import dynamic from "next/dynamic";

// Dynamically import the AddCustomerModal to avoid SSR issues
const AddCustomerModal = dynamic(() => import("./add/modal").then(mod => mod.AddCustomerModal), {
  ssr: false,
  loading: () => <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-[0_0_10px_#8b5cf6] hover:shadow-[0_0_15px_#8b5cf6] transition-all duration-300"><Plus className="mr-2 h-4 w-4" /> Add Customer</Button>
});

export function AddCustomerButton({ 
  hasReachedLimit = false, 
  followupCount = 0 
}: { 
  hasReachedLimit?: boolean; 
  followupCount?: number;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    if (hasReachedLimit) {
      toast.error(
        "Limit customer followup tercapai", 
        {
          description: "Anda telah mencapai batas maksimal 10 customer dengan status followup. Hapus beberapa customer yang kurang berpotensi untuk menambahkan customer baru yang lebih berpotensi membeli.",
          duration: 10000,
        }
      );
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <>
      <Button
        className="bg-purple-600 hover:bg-purple-700 text-white shadow-[0_0_10px_#8b5cf6] hover:shadow-[0_0_15px_#8b5cf6] transition-all duration-300"
        onClick={handleClick}
      >
        <Plus className="mr-2 h-4 w-4" /> Tambah Data
        {followupCount > 0 && followupCount <= 10 && (
          <span className="ml-2 bg-purple-800 text-purple-200 text-xs font-bold px-2 py-1 rounded-full">
            {followupCount}/10
          </span>
        )}
      </Button>
      <AddCustomerModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
