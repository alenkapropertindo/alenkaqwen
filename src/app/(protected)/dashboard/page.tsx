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

  const statCards = [
    {
      title: "Total Komisi",
      value: formatCurrency(totalKomisi),
      description: "Komisi dari customer dengan status akad",
      icon: Wallet,
      color: "purple",
    },
    {
      title: "Menunggu Pembayaran",
      value: formatCurrency(menungguPembayaran),
      description: "Komisi dari status akad & belum dibayar",
      icon: Clock,
      color: "blue",
    },
    {
      title: "Total Customers",
      value: totalCustomers.toString(),
      description: "Jumlah seluruh customer terdaftar",
      icon: Users,
      color: "emerald",
    },
    {
      title: "Followup",
      value: followupCount.toString(),
      description: "Customer dalam tahap followup",
      icon: PhoneCall,
      color: "amber",
    },
    {
      title: "Pemberkasan",
      value: pemberkasanCount.toString(),
      description: "Customer dalam tahap pemberkasan",
      icon: FolderOpen,
      color: "rose",
    },
    {
      title: "Akad",
      value: akadCount.toString(),
      description: "Customer dengan status akad",
      icon: FileCheck,
      color: "teal",
    },
  ];

  if (user.role === UserRole.ADMIN) {
    statCards.push({
      title: "Total Marketing",
      value: totalMarketing.toString(),
      description: "Jumlah user dengan role marketing",
      icon: UserCog,
      color: "violet",
    });
  }

  return (
    <div className="relative min-h-screen px-4 py-8 sm:px-6 lg:px-8 container mx-auto max-w-screen-xl space-y-10 z-0">
      {/* Grand Neon Background Glows for the whole page */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[0%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[150px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/10 blur-[150px] rounded-full mix-blend-screen"></div>
      </div>

      <div className="space-y-2 relative z-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Dashboard
        </h1>
        <p className="text-gray-400 text-lg">
          Ringkasan performa dan data marketing Anda hari ini.
        </p>
      </div>

      {/* Statistic Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 relative z-10">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;

          return (
            <div 
              key={idx} 
              className="relative overflow-hidden rounded-xl sm:rounded-2xl p-[1.5px] sm:p-[2px] z-0 shadow-2xl"
            >
              {/* Animated Conic Gradient Border */}
              <div className="absolute top-1/2 left-1/2 h-[250%] w-[250%] -translate-x-1/2 -translate-y-1/2 animate-[spin_10s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_60%,#fde047_75%,#ec4899_90%,#a855f7_100%)] opacity-90" />
              
              {/* Inner Card Content */}
              <div className="relative z-10 flex flex-col justify-between h-full w-full bg-[#0d041a] rounded-[10px] sm:rounded-[14px] p-3 sm:p-5">
                <div className="flex flex-row items-start sm:items-center justify-between pb-1 sm:pb-2 gap-2">
                  <h3 className="text-[10px] sm:text-sm font-semibold text-gray-200 tracking-wide line-clamp-2">
                    {stat.title}
                  </h3>
                  <div className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl bg-purple-900/30 border border-purple-500/20 shadow-inner flex-shrink-0">
                    <Icon className="h-3 w-3 sm:h-5 sm:w-5 text-pink-400" strokeWidth={2.5} />
                  </div>
                </div>
                <div className="pt-1 sm:pt-2">
                  <div className="text-lg sm:text-3xl font-bold text-white truncate">
                    {stat.value}
                  </div>
                  <p className="text-[9px] sm:text-xs text-gray-400 mt-1 sm:mt-2 font-medium line-clamp-2">
                    {stat.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Customer Chart Section */}
      <div className="mt-10">
        <CustomerCharts customers={customers} />
      </div>
    </div>
  );
}
