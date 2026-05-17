import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { affiliateId, name, whatsapp } = await request.json();

    if (!affiliateId || !name || !whatsapp) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Use upsert to avoid unique constraint errors if the whatsapp already exists
    const customer = await prisma.customer.upsert({
      where: { whatsapp: whatsapp },
      update: {
        userId: affiliateId,
        name: name,
        komisi: 50000,
        status: "AFFILIATE",
      },
      create: {
        userId: affiliateId,
        name: name,
        whatsapp: whatsapp,
        komisi: 50000,
        status: "AFFILIATE",
      },
    });

    return NextResponse.json({ success: true, customer });
  } catch (error) {
    console.error("Error creating affiliate customer:", error);
    let errorMessage = "Failed to create affiliate customer";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
