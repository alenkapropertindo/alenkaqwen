import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/get-session";
import { NextResponse } from "next/server";

// PUT /api/customers/[id]/komisi - Update customer komisi
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

    // Only admins can update komisi for any customer
    const json = await request.json();
    const { komisi } = json;

    // Validate komisi
    const komisiValue = parseInt(komisi);
    if (isNaN(komisiValue) || komisiValue < 0) {
      return new NextResponse("Invalid komisi value", { status: 400 });
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
    // 1. Admins can update any customer's komisi
    // 2. Regular users cannot update komisi
    if (user.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Update customer komisi
    const updatedCustomer = await prisma.customer.update({
      where: {
        id: id,
      },
      data: {
        komisi: komisiValue,
      },
    });

    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error("[CUSTOMERS_KOMISI_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}