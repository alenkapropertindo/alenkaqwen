import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRole } from "@/generated/prisma";
import {
  Wallet,
  Clock,
  Users,
  PhoneCall,
  FileCheck,
  FolderOpen,
  UserCog,
} from "lucide-react";
import { CustomerCharts } from "@/components/customer-charts";

// Define types
type Customer = {
  id: string;
  name: string;
  whatsapp: string;
  komisi: number;
  status: string;
  paidStatus: string;
  createdAt: Date;
};

type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export default async function DashboardPage() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) return null;

  // Fetch customers based on user role
  let customers = [];
  if (user.role === UserRole.ADMIN) {
    // For admin, fetch all customers
    customers = await prisma.customer.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  } else {
    // For regular users, fetch only their own customers
    customers = await prisma.customer.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // Fetch all users (for admin only)
  let allUsers: User[] = [];
  if (user.role === UserRole.ADMIN) {
    allUsers = await prisma.user.findMany();
  }

  // Calculate statistics
  // Total Komisi (sum of komisi where status = AKAD_KREDIT)
  const totalKomisi = customers
    .filter((customer) => customer.status === "AKAD_KREDIT")
    .reduce((sum, customer) => sum + customer.komisi, 0);

  // Menunggu Pembayaran (sum of komisi from customers with status = AKAD_KREDIT and paidStatus = "PENDING")
  const menungguPembayaran = customers
    .filter(
      (customer) =>
        customer.status === "AKAD_KREDIT" && customer.paidStatus === "PENDING"
    )
    .reduce((sum, customer) => sum + customer.komisi, 0);

  // Customers (total count)
  const totalCustomers = customers.length;

  // Followup (count of customers with status = FOLLOWUP)
  const followupCount = customers.filter(
    (customer) => customer.status === "FOLLOWUP"
  ).length;

  // Akad (count of customers with status = AKAD_KREDIT)
  const akadCount = customers.filter(
    (customer) => customer.status === "AKAD_KREDIT"
  ).length;

  // Pemberkasan (count of customers with status = PEMBERKASAN)
  const pemberkasanCount = customers.filter(
    (customer) => customer.status === "PEMBERKASAN"
  ).length;

  // Total Marketing (count of users with role = marketing)
  const totalMarketing = allUsers.filter(
    (u) => u.role === UserRole.USER
  ).length;

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 container mx-auto max-w-screen-xl space-y-8">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
      </div>

      {/* Statistic Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Komisi Card */}
        <Card className="bg-gradient-to-br pb-4 from-purple-50 to-indigo-50 border border-purple-200 shadow-lg shadow-purple-200/50 hover:shadow-purple-300/50 transition-all duration-300 transform hover:-translate-y-1 dark:from-purple-900/50 dark:to-indigo-900/50 dark:border-purple-500/50 dark:shadow-lg dark:shadow-purple-500/20 dark:hover:shadow-purple-500/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2 dark:text-white">
              <Wallet className="h-5 w-5" />
              Total Komisi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(totalKomisi)}
            </div>
            <p className="text-xs text-gray-500 mt-1 dark:text-white/80">
              Komisi dari customer dengan status akad
            </p>
          </CardContent>
        </Card>

        {/* Menunggu Pembayaran Card */}
        <Card className="bg-gradient-to-br pb-4 from-blue-50 to-cyan-50 border border-blue-200 shadow-lg shadow-blue-200/50 hover:shadow-blue-300/50 transition-all duration-300 transform hover:-translate-y-1 dark:from-blue-900/50 dark:to-cyan-900/50 dark:border-blue-500/50 dark:shadow-lg dark:shadow-blue-500/20 dark:hover:shadow-blue-500/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800 flex items-center gap-2 dark:text-white">
              <Clock className="h-5 w-5" />
              Menunggu Pembayaran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(menungguPembayaran)}
            </div>
            <p className="text-xs text-blue-600 mt-1 dark:text-white/80">
              Komisi dari customer dengan status akad dan belum dibayar
            </p>
          </CardContent>
        </Card>

        {/* Customers Card */}
        <Card className="bg-gradient-to-br pb-4 from-emerald-50 to-green-50 border border-emerald-200 shadow-lg shadow-emerald-200/50 hover:shadow-emerald-300/50 transition-all duration-300 transform hover:-translate-y-1 dark:from-emerald-900/50 dark:to-green-900/50 dark:border-emerald-500/50 dark:shadow-lg dark:shadow-emerald-500/20 dark:hover:shadow-emerald-500/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-800 flex items-center gap-2 dark:text-white">
              <Users className="h-5 w-5" />
              Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {totalCustomers}
            </div>
            <p className="text-xs text-emerald-600 mt-1 dark:text-white/80">
              Total semua customer
            </p>
          </CardContent>
        </Card>

        {/* Followup Card */}
        <Card className="bg-gradient-to-br pb-4 from-amber-50 to-orange-50 border border-amber-200 shadow-lg shadow-amber-200/50 hover:shadow-amber-300/50 transition-all duration-300 transform hover:-translate-y-1 dark:from-amber-900/50 dark:to-orange-900/50 dark:border-amber-500/50 dark:shadow-lg dark:shadow-amber-500/20 dark:hover:shadow-amber-500/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-800 flex items-center gap-2 dark:text-white">
              <PhoneCall className="h-5 w-5" />
              Followup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {followupCount}
            </div>
            <p className="text-xs text-amber-600 mt-1 dark:text-white/80">
              Customer dalam tahap followup
            </p>
          </CardContent>
        </Card>

        {/* Akad Card */}
        <Card className="bg-gradient-to-br pb-4 from-teal-50 to-cyan-50 border border-teal-200 shadow-lg shadow-teal-200/50 hover:shadow-teal-300/50 transition-all duration-300 transform hover:-translate-y-1 dark:from-teal-900/50 dark:to-cyan-900/50 dark:border-teal-500/50 dark:shadow-lg dark:shadow-teal-500/20 dark:hover:shadow-teal-500/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-teal-800 flex items-center gap-2 dark:text-white">
              <FileCheck className="h-5 w-5" />
              Akad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {akadCount}
            </div>
            <p className="text-xs text-teal-600 mt-1 dark:text-white/80">
              Customer dengan status akad
            </p>
          </CardContent>
        </Card>

        {/* Pemberkasan Card */}
        <Card className="bg-gradient-to-br  pb-4 from-rose-50 to-pink-50 border border-rose-200 shadow-lg shadow-rose-200/50 hover:shadow-rose-300/50 transition-all duration-300 transform hover:-translate-y-1 dark:from-rose-900/50 dark:to-pink-900/50 dark:border-rose-500/50 dark:shadow-lg dark:shadow-rose-500/20 dark:hover:shadow-rose-500/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-rose-800 flex items-center gap-2 dark:text-white">
              <FolderOpen className="h-5 w-5" />
              Pemberkasan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {pemberkasanCount}
            </div>
            <p className="text-xs text-rose-600 mt-1 dark:text-white/80">
              Customer dalam tahap pemberkasan
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Only Extra Card */}
      {user.role === UserRole.ADMIN && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 bg-gradient-to-br pb-2 from-violet-50 to-fuchsia-50 border border-violet-200 shadow-lg shadow-violet-200/50 hover:shadow-violet-300/50 transition-all duration-300 transform hover:-translate-y-1 dark:from-violet-900/50 dark:to-fuchsia-900/50 dark:border-violet-500/50 dark:shadow-lg dark:shadow-violet-500/20 dark:hover:shadow-violet-500/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-violet-800 flex items-center gap-2 dark:text-white">
                <UserCog className="h-5 w-5" />
                Total Marketing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {totalMarketing}
              </div>
              <p className="text-xs text-violet-600 my-1 dark:text-white/80">
                Jumlah user dengan role marketing
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Customer Chart Section */}
      <div className="mt-8">
        <CustomerCharts customers={customers} />
      </div>
    </div>
  );
}
