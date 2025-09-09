"use client";

import { useState, useMemo } from "react";
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
import { UserRole } from "@/generated/prisma";
import { DeleteButton } from "@/app/(protected)/customers/delete-button";
import { AddCustomerButton } from "@/app/(protected)/customers/add-button";

// Define the customer type based on Prisma schema
type Customer = {
  id: string;
  name: string;
  whatsapp: string;
  komisi: number;
  status: string;
  createdAt: Date;
  user?: {
    email: string;
  };
  userId: string;
};

interface SearchableCustomersTableProps {
  customers: Customer[];
  userRole: UserRole;
}

export function SearchableCustomersTable({ customers, userRole }: SearchableCustomersTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Get unique statuses from customers
  const statuses = useMemo(() => {
    const uniqueStatuses = [...new Set(customers.map(c => c.status))];
    return uniqueStatuses;
  }, [customers]);

  // Filter customers based on search term and status filter
  const filteredCustomers = useMemo(() => {
    let result = customers;
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(customer => 
        customer.name.toLowerCase().includes(term) ||
        customer.whatsapp.toLowerCase().includes(term) ||
        (userRole === UserRole.ADMIN && customer.user?.email.toLowerCase().includes(term))
      );
    }
    
    // Apply status filter
    if (statusFilter !== "ALL") {
      result = result.filter(customer => customer.status === statusFilter);
    }
    
    return result;
  }, [customers, searchTerm, statusFilter, userRole]);

  return (
    <div className="bg-gray-900/50 border border-purple-900/50 rounded-xl p-6">
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
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">
            {searchTerm || statusFilter !== "ALL" 
              ? "Tidak ada customer yang cocok dengan filter" 
              : "Tidak ada customer ditemukan"}
          </p>
          <AddCustomerButton />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-purple-500/30 hover:bg-purple-900/20">
              <TableHead className="text-purple-300">
                Nama Customer
              </TableHead>
              <TableHead className="text-purple-300">WhatsApp</TableHead>
              <TableHead className="text-purple-300">Status</TableHead>
              {userRole === UserRole.ADMIN && (
                <TableHead className="text-purple-300">Ranger</TableHead>
              )}
              <TableHead className="text-purple-300 text-right">
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
                <TableCell className="font-medium text-white">
                  {customer.name}
                </TableCell>
                <TableCell className="text-gray-300">
                  <a 
                    href={`https://wa.me/${customer.whatsapp.replace(/\D/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 underline"
                  >
                    {customer.whatsapp}
                  </a>
                </TableCell>

                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      customer.status === "AKAD_KREDIT"
                        ? "bg-green-500/20 text-green-400"
                        : customer.status === "PEMBERKASAN"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {customer.status}
                  </span>
                </TableCell>
                
                {userRole === UserRole.ADMIN && (
                  <TableCell className="text-gray-300">
                    {customer.user?.email || 'N/A'}
                  </TableCell>
                )}

                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <DeleteButton customerId={customer.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}