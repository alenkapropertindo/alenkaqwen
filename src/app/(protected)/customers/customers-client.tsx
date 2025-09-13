"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { AddCustomerButton } from "@/app/(protected)/customers/add-button";
import { SearchableCustomersTable } from "@/components/searchable-customers-table";
import { Customer as PrismaCustomer, User, Status } from "@/generated/prisma";

// Define the customer type based on Prisma schema
type Customer = PrismaCustomer & {
  user?: User | null;
};

interface CustomersClientPageProps {
  initialCustomers: Customer[];
  userRole: string;
  hasReachedLimit: boolean;
  followupCount: number;
}

export default function CustomersClientPage({ 
  initialCustomers, 
  userRole, 
  hasReachedLimit: initialHasReachedLimit,
  followupCount: initialFollowupCount
}: CustomersClientPageProps) {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [loading, setLoading] = useState(false);

  // Calculate followup count and limit status
  const { followupCount, hasReachedLimit } = useMemo(() => {
    if (userRole === "ADMIN") {
      return { followupCount: 0, hasReachedLimit: false };
    }
    
    const count = customers.filter(customer => customer.status === "FOLLOWUP").length;
    return { followupCount: count, hasReachedLimit: count >= 10 };
  }, [customers, userRole]);

  // Fetch customers from API
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = userRole === "ADMIN" 
        ? await fetch("/api/customers/admin")
        : await fetch("/api/customers");
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch customers");
      }
      
      setCustomers(data);
    } catch (error) {
      let errorMessage = "Failed to fetch customers";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle customer creation
  const handleCustomerCreated = () => {
    // Refresh the customer list
    fetchCustomers();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Customers
        </h1>
        <AddCustomerButton 
          hasReachedLimit={hasReachedLimit} 
          followupCount={followupCount}
          onCustomerCreated={handleCustomerCreated}
        />
      </div>

      <SearchableCustomersTable 
        customers={customers} 
        userRole={userRole} 
        loading={loading}
      />
    </div>
  );
}