import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/get-session";
import { NextResponse } from "next/server";
import { Status } from "@/generated/prisma";

// PUT /api/customers/[id]/status - Update customer status
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

    // Only admins can update status for any customer
    // Regular users can only update their own customers' status to certain values
    const json = await request.json();
    const { status } = json;

    // Validate status
    if (!Object.values(Status).includes(status as Status)) {
      return new NextResponse("Invalid status", { status: 400 });
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
    // 1. Admins can update any customer's status
    // 2. Regular users can only update their own customers' status
    if (user.role !== "ADMIN" && customer.userId !== user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Update customer status
    const updatedCustomer = await prisma.customer.update({
      where: {
        id: id,
      },
      data: {
        status: status as Status,
      },
    });

    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error("[CUSTOMERS_STATUS_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}