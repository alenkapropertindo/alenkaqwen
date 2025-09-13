"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Status } from "@/generated/prisma";
import { DeleteButton } from "@/app/(protected)/customers/delete-button";
import { AddCustomerButton } from "@/app/(protected)/customers/add-button";
import { Customer as PrismaCustomer, User } from "@/generated/prisma";

// Define the customer type based on Prisma schema
type Customer = PrismaCustomer & {
  user?: User | null;
};

interface SearchableCustomersTableProps {
  customers: Customer[];
  userRole: string; // UserRole is a string in better-auth
  loading?: boolean;
}

export function SearchableCustomersTable({ customers, userRole, loading }: SearchableCustomersTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [updatingCustomerId, setUpdatingCustomerId] = useState<string | null>(null);
  const [customerList, setCustomerList] = useState<Customer[]>(customers);

  // Update customerList when customers prop changes
  useEffect(() => {
    setCustomerList(customers);
  }, [customers]);

  // Get unique statuses from customers
  const statuses = useMemo(() => {
    const uniqueStatuses = [...new Set(customerList.map(c => c.status))];
    return uniqueStatuses;
  }, [customerList]);

  // Filter customers based on search term and status filter
  const filteredCustomers = useMemo(() => {
    let result = customerList;
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(customer => 
        customer.name.toLowerCase().includes(term) ||
        customer.whatsapp.toLowerCase().includes(term) ||
        (userRole === "ADMIN" && customer.user?.email?.toLowerCase().includes(term))
      );
    }
    
    // Apply status filter
    if (statusFilter !== "ALL") {
      result = result.filter(customer => customer.status === statusFilter);
    }
    
    return result;
  }, [customerList, searchTerm, statusFilter, userRole]);

  // Format status for display
  const formatStatus = (status: Status) => {
    switch (status) {
      case Status.AKAD_KREDIT:
        return "Akad Kredit";
      case Status.PEMBERKASAN:
        return "Pemberkasan";
      case Status.FOLLOWUP:
        return "Follow Up";
      default:
        return status;
    }
  };

  // Get status color class
  const getStatusColorClass = (status: Status) => {
    switch (status) {
      case Status.AKAD_KREDIT:
        return "bg-green-500/20 text-green-400";
      case Status.PEMBERKASAN:
        return "bg-yellow-500/20 text-yellow-400";
      case Status.FOLLOWUP:
        return "bg-blue-500/20 text-blue-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  // Handle status update for admin users
  const handleStatusUpdate = async (customerId: string, newStatus: Status) => {
    if (userRole !== "ADMIN") return;
    
    setUpdatingCustomerId(customerId);
    try {
      const response = await fetch(`/api/customers/${customerId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update status");
      }

      // Update the customer status in the local state
      const updatedCustomer = await response.json();
      
      // Update the customer list with the new status
      setCustomerList(prev => 
        prev.map(customer => 
          customer.id === customerId 
            ? { ...customer, status: updatedCustomer.status } 
            : customer
        )
      );
      
      // Show success message
      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setUpdatingCustomerId(null);
    }
  };

  return (
    <div className="bg-gray-900/50 border border-purple-900/50 rounded-xl p-4 sm:p-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-grow">
          <Input
            placeholder="Cari customer berdasarkan nama, WhatsApp, atau email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-800 border-purple-500/50 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-gray-800 border-purple-500/50 text-white">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Status</SelectItem>
              {statuses.map(status => (
                <SelectItem key={status} value={status}>
                  {formatStatus(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-400">Loading customers...</p>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">
            {searchTerm || statusFilter !== "ALL" 
              ? "Tidak ada customer yang cocok dengan filter" 
              : "Tidak ada customer ditemukan"}
          </p>
          <AddCustomerButton />
        </div>
      ) : (
        <div className="rounded-lg overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-purple-500/30 hover:bg-purple-900/20">
                <TableHead className="text-purple-300 text-sm sm:text-base">
                  Nama Customer
                </TableHead>
                <TableHead className="text-purple-300 text-sm sm:text-base">WhatsApp</TableHead>
                <TableHead className="text-purple-300 text-sm sm:text-base">Status</TableHead>
                {userRole === "ADMIN" && (
                  <TableHead className="text-purple-300 text-sm sm:text-base">Ranger</TableHead>
                )}
                <TableHead className="text-purple-300 text-right text-sm sm:text-base">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow
                  key={customer.id}
                  className="border-purple-500/20 hover:bg-purple-900/10"
                >
                  <TableCell className="font-medium text-white py-4 max-w-[150px] truncate">
                    {customer.name}
                  </TableCell>
                  <TableCell className="text-gray-300 py-4 max-w-[150px] truncate">
                    <a 
                      href={`https://wa.me/${customer.whatsapp.replace(/\D/g, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-green-400 hover:text-green-300 underline"
                    >
                      {customer.whatsapp}
                    </a>
                  </TableCell>

                  <TableCell className="py-4">
                    {userRole === "ADMIN" ? (
                      <Select
                        value={customer.status}
                        onValueChange={(value) => handleStatusUpdate(customer.id, value as Status)}
                        disabled={updatingCustomerId === customer.id}
                      >
                        <SelectTrigger className="bg-gray-800 border-purple-500/50 text-white w-[140px]">
                          {updatingCustomerId === customer.id ? (
                            <span className="text-gray-400">Updating...</span>
                          ) : (
                            <SelectValue />
                          )}
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(Status).map((status) => (
                            <SelectItem key={status} value={status}>
                              {formatStatus(status)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColorClass(customer.status)}`}
                      >
                        {formatStatus(customer.status)}
                      </span>
                    )}
                  </TableCell>
                  
                  {userRole === "ADMIN" && (
                    <TableCell className="text-gray-300 py-4 max-w-[150px] truncate">
                      {customer.user?.email || 'N/A'}
                    </TableCell>
                  )}

                  <TableCell className="text-right py-4">
                    <div className="flex justify-end space-x-2">
                      {(userRole === "ADMIN" || 
                        (userRole !== "ADMIN" && 
                         customer.status !== Status.PEMBERKASAN && 
                         customer.status !== Status.AKAD_KREDIT)) && (
                        <DeleteButton customerId={customer.id} />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}