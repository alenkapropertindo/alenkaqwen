import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/products/lokasi - Get all unique locations
export async function GET() {
  try {
    const session = await getServerSession();

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all unique locations
    const products = await prisma.product.findMany({
      select: {
        lokasi: true,
      },
      distinct: ['lokasi'],
    });

    // Filter out null values and create array of unique locations
    const uniqueLokasi = products
      .map(product => product.lokasi)
      .filter((lokasi): lokasi is string => lokasi !== null)
      .sort();

    return NextResponse.json({ lokasi: uniqueLokasi });
  } catch (error) {
    console.error("Error fetching locations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}