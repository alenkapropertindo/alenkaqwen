"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import dynamic from "next/dynamic";

// Dynamically import the AddCustomerModal to avoid SSR issues
const AddCustomerModal = dynamic(() => import("./add/modal").then(mod => mod.AddCustomerModal), {
  ssr: false,
  loading: () => <Button className="clay-btn-primary"><Plus className="mr-2 h-4 w-4" /> Tambah Data</Button>
});

export function AddCustomerButton({ 
  hasReachedLimit = false, 
  followupCount = 0,
  onCustomerCreated
}: { 
  hasReachedLimit?: boolean; 
  followupCount?: number;
  onCustomerCreated?: () => void;
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
        className="clay-btn-primary"
        onClick={handleClick}
      >
        <Plus className="mr-2 h-4 w-4" /> Tambah Data
        {followupCount > 0 && followupCount <= 10 && (
          <span className="ml-2 bg-[#d64560]/20 text-[#731b31] text-xs font-bold px-2 py-1 rounded-full">
            {followupCount}/10
          </span>
        )}
      </Button>
      <AddCustomerModal open={isModalOpen} onOpenChange={setIsModalOpen} onCustomerCreated={onCustomerCreated} />
    </>
  );
}
