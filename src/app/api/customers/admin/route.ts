import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/get-session";
import { NextResponse } from "next/server";

// GET /api/customers/admin - Get all customers with user info (admin only)
export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    const user = session?.user;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user is admin
    if (user.role !== "ADMIN") {
      return new NextResponse("Forbidden: Admin only", { status: 403 });
    }

    const customers = await prisma.customer.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(customers);
  } catch (error) {
    console.error("[CUSTOMERS_ADMIN_GET_ALL]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}