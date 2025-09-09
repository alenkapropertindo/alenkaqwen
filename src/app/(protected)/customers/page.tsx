import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { DeleteButton } from "./delete-button";
import { AddCustomerButton } from "./add-button";

// Define the customer type based on Prisma schema
type Customer = {
  id: string;
  name: string;
  whatsapp: string;
  komisi: number;
  status: string;
  createdAt: Date;
};

export default async function CustomersPage() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    return null;
  }

  // Fetch customers from database
  const customers = await prisma.customer.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Format the komisi value to display as currency
  const formatKomisi = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Format date to display
  const formatDate = (date: Date) => {
    return format(date, "dd MMM yyyy", { locale: id });
  };

  return (
    <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Customers
          </h1>
          <AddCustomerButton />
        </div>

        <div className="bg-gray-900/50 border border-purple-900/50 rounded-xl p-6">
          {customers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">No customers found</p>
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

                  <TableHead className="text-purple-300 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
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
      </div>
    </div>
  );
}
