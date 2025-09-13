import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/get-session";
import { NextResponse } from "next/server";

// POST /api/customers - Create a new customer
export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    const user = session?.user;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await request.json();
    const { name, whatsapp, komisi, status } = json;

    // Check if customer with this WhatsApp already exists
    const existingCustomer = await prisma.customer.findUnique({
      where: {
        whatsapp,
      },
    });

    if (existingCustomer) {
      return new NextResponse("Nomor ini sudah terdaftar", { status: 400 });
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        whatsapp,
        komisi: parseInt(komisi as string) || 1000000,
        status: status || "FOLLOWUP",
        userId: user.id,
      },
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.error("[CUSTOMERS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// GET /api/customers - Get all customers for the user
export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    const user = session?.user;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    let customers;
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
    }

    return NextResponse.json(customers);
  } catch (error) {
    console.error("[CUSTOMERS_GET_ALL]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
