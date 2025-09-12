import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { AddCustomerButton } from "@/app/(protected)/customers/add-button";
import { SearchableCustomersTable } from "@/components/searchable-customers-table";
import { Customer as PrismaCustomer, User, Status, PaidStatus } from "@/generated/prisma";

// Define the customer type based on Prisma schema
type Customer = PrismaCustomer & {
  user?: User | null;
};

export default async function CustomersPage() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    return null;
  }

  // Fetch customers based on user role
  let customers: Customer[] = [];
  let followupCount = 0;
  
  if (user.role === "ADMIN") {
    // For admin, fetch all customers with user info
    customers = await prisma.customer.findMany({
      include: {
        user: true,
      },
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
    
    // Count followup customers for regular users
    followupCount = await prisma.customer.count({
      where: {
        userId: user.id,
        status: Status.FOLLOWUP,
      },
    });
  }

  // Check if user has reached the followup limit (10 for regular users)
  const hasReachedLimit = user.role !== "ADMIN" && followupCount >= 10;

  return (
    <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Customers
          </h1>
          <AddCustomerButton 
            hasReachedLimit={hasReachedLimit} 
            followupCount={followupCount}
          />
        </div>

        <SearchableCustomersTable customers={customers} userRole={user.role} />
      </div>
    </div>
  );
}
