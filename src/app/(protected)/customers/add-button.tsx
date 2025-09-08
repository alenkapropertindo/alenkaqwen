"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import the AddCustomerModal to avoid SSR issues
const AddCustomerModal = dynamic(() => import("./add/modal").then(mod => mod.AddCustomerModal), {
  ssr: false,
  loading: () => <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-[0_0_10px_#8b5cf6] hover:shadow-[0_0_15px_#8b5cf6] transition-all duration-300"><Plus className="mr-2 h-4 w-4" /> Add Customer</Button>
});

export function AddCustomerButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        className="bg-purple-600 hover:bg-purple-700 text-white shadow-[0_0_10px_#8b5cf6] hover:shadow-[0_0_15px_#8b5cf6] transition-all duration-300"
        onClick={() => setIsModalOpen(true)}
      >
        <Plus className="mr-2 h-4 w-4" /> Add Customer
      </Button>
      <AddCustomerModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
