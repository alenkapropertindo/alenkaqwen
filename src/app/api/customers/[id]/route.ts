import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/get-session";
import { NextResponse } from "next/server";

// GET /api/customers/[id] - Get a specific customer
export async function GET(
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

    const customer = await prisma.customer.findUnique({
      where: {
        id: id,
        userId: user.id,
      },
    });

    if (!customer) {
      return new NextResponse("Customer not found", { status: 404 });
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error("[CUSTOMERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// PUT /api/customers/[id] - Update a specific customer
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

    const json = await request.json();
    const { name, whatsapp, komisi, status } = json;

    // Check if customer with this WhatsApp already exists (but not for this customer)
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        whatsapp,
        NOT: {
          id: id,
        },
      },
    });

    if (existingCustomer) {
      return new NextResponse("Nomor ini sudah terdaftar oleh ranger lain", { status: 400 });
    }

    const customer = await prisma.customer.update({
      where: {
        id: id,
        userId: user.id,
      },
      data: {
        name,
        whatsapp,
        komisi: parseInt(komisi),
        status,
      },
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.error("[CUSTOMERS_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE /api/customers/[id] - Delete a specific customer
export async function DELETE(
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

    const customer = await prisma.customer.delete({
      where: {
        id: id,
        userId: user.id,
      },
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.error("[CUSTOMERS_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}