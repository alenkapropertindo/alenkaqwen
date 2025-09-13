import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/get-session";
import { NextResponse } from "next/server";

// PUT /api/customers/[id]/paid-status - Update customer paidStatus
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    const user = session?.user;
    const { id } = await params;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Only admins can update paidStatus for any customer
    const json = await request.json();
    const { paidStatus } = json;

    // Validate paidStatus - using string values instead of enum
    const validPaidStatuses = ["PAID", "PENDING"];
    if (!validPaidStatuses.includes(paidStatus)) {
      return new NextResponse("Invalid paidStatus value", { status: 400 });
    }

    // Find the customer
    const customer = await prisma.customer.findUnique({
      where: {
        id: id,
      },
    });

    if (!customer) {
      return new NextResponse("Customer not found", { status: 404 });
    }

    // Check permissions:
    // 1. Admins can update any customer's paidStatus
    // 2. Regular users cannot update paidStatus
    if (user.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Update customer paidStatus
    const updatedCustomer = await prisma.customer.update({
      where: {
        id: id,
      },
      data: {
        paidStatus: paidStatus,
      },
    });

    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error("[CUSTOMERS_PAID_STATUS_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}