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

export function SearchableCustomersTable({
  customers,
  userRole,
  loading,
}: SearchableCustomersTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [updatingCustomerId, setUpdatingCustomerId] = useState<string | null>(
    null
  );
  const [customerList, setCustomerList] = useState<Customer[]>(customers);

  // Update customerList when customers prop changes
  useEffect(() => {
    setCustomerList(customers);
  }, [customers]);

  // Get unique statuses from customers
  const statuses = useMemo(() => {
    const uniqueStatuses = [...new Set(customerList.map((c) => c.status))];
    return uniqueStatuses;
  }, [customerList]);

  // Filter customers based on search term and status filter
  const filteredCustomers = useMemo(() => {
    let result = customerList;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (customer) =>
          customer.name.toLowerCase().includes(term) ||
          customer.whatsapp.toLowerCase().includes(term) ||
          (userRole === "ADMIN" &&
            customer.user?.email?.toLowerCase().includes(term))
      );
    }

    // Apply status filter
    if (statusFilter !== "ALL") {
      result = result.filter((customer) => customer.status === statusFilter);
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
        return "bg-white/40 text-[#1f4f59] shadow-sm";
      case Status.PEMBERKASAN:
        return "bg-[#fed277]/40 text-[#7c5806] shadow-sm";
      case Status.FOLLOWUP:
        return "bg-[#aae4ee]/40 text-[#1f4f59] shadow-sm";
      default:
        return "bg-white/20 text-gray-500 shadow-sm";
    }
  };

  // Format komisi as Rupiah
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format paidStatus for display
  const formatPaidStatus = (paidStatus: string) => {
    switch (paidStatus) {
      case "PAID":
        return "Paid";
      case "PENDING":
        return "Pending";
      default:
        return paidStatus;
    }
  };

  // Get paidStatus color class
  const getPaidStatusColorClass = (paidStatus: string) => {
    switch (paidStatus) {
      case "PAID":
        return "bg-white/40 text-[#1f4f59] shadow-sm";
      case "PENDING":
        return "bg-[#fed277]/40 text-[#7c5806] shadow-sm";
      default:
        return "bg-white/20 text-gray-500 shadow-sm";
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
      setCustomerList((prev) =>
        prev.map((customer) =>
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

  // Handle komisi update for admin users
  const handleKomisiUpdate = async (customerId: string, newKomisi: string) => {
    if (userRole !== "ADMIN") return;

    setUpdatingCustomerId(customerId);
    try {
      const response = await fetch(`/api/customers/${customerId}/komisi`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ komisi: newKomisi }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update komisi");
      }

      // Update the customer komisi in the local state
      const updatedCustomer = await response.json();

      // Update the customer list with the new komisi
      setCustomerList((prev) =>
        prev.map((customer) =>
          customer.id === customerId
            ? { ...customer, komisi: updatedCustomer.komisi }
            : customer
        )
      );

      // Show success message
      toast.success("Komisi updated successfully");
    } catch (error) {
      console.error("Error updating komisi:", error);
      toast.error("Failed to update komisi");
    } finally {
      setUpdatingCustomerId(null);
    }
  };

  // Handle paidStatus update for admin users
  const handlePaidStatusUpdate = async (
    customerId: string,
    newPaidStatus: string
  ) => {
    if (userRole !== "ADMIN") return;

    setUpdatingCustomerId(customerId);
    try {
      const response = await fetch(`/api/customers/${customerId}/paid-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paidStatus: newPaidStatus }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update paid status");
      }

      // Update the customer paidStatus in the local state
      const updatedCustomer = await response.json();

      // Update the customer list with the new paidStatus
      setCustomerList((prev) =>
        prev.map((customer) =>
          customer.id === customerId
            ? { ...customer, paidStatus: updatedCustomer.paidStatus }
            : customer
        )
      );

      // Show success message
      toast.success("Payment status updated successfully");
    } catch (error) {
      console.error("Error updating paid status:", error);
      toast.error("Failed to update payment status");
    } finally {
      setUpdatingCustomerId(null);
    }
  };

  return (
    <div className="clay-panel p-4 sm:p-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-grow">
          <Input
            placeholder="Cari customer berdasarkan nama, WhatsApp, atau email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="clay-panel border-none text-[#1f4f59] focus:ring-2 focus:ring-white/50 h-12"
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="clay-panel border-none text-[#1f4f59] focus:ring-2 focus:ring-white/50 h-12">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent className="bg-[#aae4ee] border-white/40 rounded-[20px]">
              <SelectItem value="ALL" className="clay-text-title font-bold focus:bg-white/40 focus:text-[#731b31]">Semua Status</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status} value={status} className="clay-text-title font-bold focus:bg-white/40 focus:text-[#731b31]">
                  {formatStatus(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="clay-text-muted font-bold">Loading customers...</p>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="text-center py-12">
          <p className="clay-text-muted font-bold mb-4">
            {searchTerm || statusFilter !== "ALL"
              ? "Tidak ada customer yang cocok dengan filter"
              : "Tidak ada customer ditemukan"}
          </p>
          <AddCustomerButton />
        </div>
      ) : (
        <div className="rounded-[20px] overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-white/40 hover:bg-white/40">
                <TableHead className="clay-text-title text-sm sm:text-base font-extrabold">
                  Nama Customer
                </TableHead>
                <TableHead className="clay-text-title text-sm sm:text-base font-extrabold">
                  WhatsApp
                </TableHead>
                <TableHead className="clay-text-title text-sm sm:text-base font-extrabold">
                  Status
                </TableHead>
                {userRole === "ADMIN" && (
                  <TableHead className="clay-text-title text-sm sm:text-base font-extrabold">
                    Komisi (Rp)
                  </TableHead>
                )}
                {userRole === "ADMIN" && (
                  <TableHead className="clay-text-title text-sm sm:text-base font-extrabold">
                    Payment Status
                  </TableHead>
                )}
                {userRole === "ADMIN" && (
                  <TableHead className="clay-text-title text-sm sm:text-base font-extrabold">
                    Ranger
                  </TableHead>
                )}
                <TableHead className="clay-text-title text-right text-sm sm:text-base font-extrabold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow
                  key={customer.id}
                  className="border-white/40 hover:bg-white/20"
                >
                  <TableCell className="clay-text-title font-bold py-4 max-w-[150px] truncate">
                    {customer.name}
                  </TableCell>
                  <TableCell className="clay-text-muted font-bold py-4 max-w-[150px] truncate">
                    <a
                      href={`https://wa.me/${customer.whatsapp.replace(
                        /\D/g,
                        ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#731b31] hover:text-[#d64560] underline"
                    >
                      {customer.whatsapp}
                    </a>
                  </TableCell>

                  <TableCell className="py-4">
                    {userRole === "ADMIN" ? (
                      <Select
                        value={customer.status}
                        onValueChange={(value) =>
                          handleStatusUpdate(customer.id, value as Status)
                        }
                        disabled={
                          updatingCustomerId === customer.id ||
                          customer.paidStatus === "PAID"
                        }
                      >
                        <SelectTrigger className="bg-white/40 border-white text-[#1f4f59] font-bold focus:ring-[#d64560] rounded-[20px] backdrop-blur-md transition-colors w-[140px] h-10">
                          {updatingCustomerId === customer.id ? (
                            <span className="clay-text-muted font-bold">Updating...</span>
                          ) : (
                            <SelectValue />
                          )}
                        </SelectTrigger>
                        <SelectContent className="bg-[#aae4ee] border-white/40 rounded-[20px]">
                          {Object.values(Status).map((status) => (
                            <SelectItem key={status} value={status} className="clay-text-title font-bold focus:bg-white/40 focus:text-[#731b31]">
                              {formatStatus(status)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColorClass(
                          customer.status
                        )}`}
                      >
                        {formatStatus(customer.status)}
                      </span>
                    )}
                  </TableCell>

                  {userRole === "ADMIN" && (
                    <TableCell className="py-4">
                      <Input
                        type="number"
                        value={customer.komisi}
                        onChange={(e) => {
                          // Update the local state immediately for better UX
                          setCustomerList((prev) =>
                            prev.map((c) =>
                              c.id === customer.id
                                ? {
                                    ...c,
                                    komisi: parseInt(e.target.value) || 0,
                                  }
                                : c
                            )
                          );
                        }}
                        onBlur={(e) =>
                          handleKomisiUpdate(customer.id, e.target.value)
                        }
                        disabled={
                          updatingCustomerId === customer.id ||
                          customer.paidStatus === "PAID"
                        }
                        className="clay-panel border-none text-[#1f4f59] focus:ring-2 focus:ring-white/50 w-[140px] h-10"
                      />
                    </TableCell>
                  )}

                  {userRole === "ADMIN" && (
                    <TableCell className="py-4">
                      <Select
                        value={customer.paidStatus}
                        onValueChange={(value) =>
                          handlePaidStatusUpdate(customer.id, value)
                        }
                        disabled={
                          updatingCustomerId === customer.id ||
                          customer.paidStatus === "PAID"
                        }
                      >
                        <SelectTrigger className="bg-white/40 border-white text-[#1f4f59] font-bold focus:ring-[#d64560] rounded-[20px] backdrop-blur-md transition-colors w-[140px] h-10">
                          {updatingCustomerId === customer.id ? (
                            <span className="clay-text-muted font-bold">Updating...</span>
                          ) : (
                            <SelectValue />
                          )}
                        </SelectTrigger>
                        <SelectContent className="bg-[#aae4ee] border-white/40 rounded-[20px]">
                          <SelectItem value="PENDING" className="clay-text-title font-bold focus:bg-white/40 focus:text-[#731b31]">Pending</SelectItem>
                          <SelectItem value="PAID" className="clay-text-title font-bold focus:bg-white/40 focus:text-[#731b31]">Paid</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  )}

                  {userRole === "ADMIN" && (
                    <TableCell className="clay-text-muted font-bold py-4 max-w-[150px] truncate">
                      {customer.user?.email || "N/A"}
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
