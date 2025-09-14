import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { UserRole } from "@/generated/prisma";

// GET /api/products - Get all products
export async function GET(request: Request) {
  try {
    const session = await getServerSession();

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const lokasi = searchParams.get('lokasi') || '';
    const kategori = searchParams.get('kategori') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build where conditions
    const where: any = {};
    
    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { detail: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    // Lokasi filter
    if (lokasi && lokasi !== "__all__") {
      where.lokasi = { contains: lokasi, mode: 'insensitive' };
    }
    
    // Kategori filter
    if (kategori && kategori !== "__all__") {
      where.kategori = kategori;
    }

    // Build orderBy conditions
    let orderBy: any = {};
    switch (sortBy) {
      case 'fee':
        orderBy = { fee: sortOrder };
        break;
      case 'title':
        orderBy = { title: sortOrder };
        break;
      case 'createdAt':
      default:
        orderBy = { createdAt: sortOrder };
        break;
    }

    // Fetch products with filters and sorting
    const products = await prisma.product.findMany({
      where,
      orderBy,
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product
export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (session.user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: "Forbidden: Admin only" },
        { status: 403 }
      );
    }

    const { title, detail, description, kategori, dpAkad, videoLink, fee, imageUrl, lokasi } =
      await request.json();

    // Validate required fields
    if (!title || !description || dpAkad === undefined || fee === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        title,
        detail: detail || null,
        description,
        kategori: kategori || null,
        dpAkad: parseInt(dpAkad),
        videoLink: videoLink || null,
        fee: parseInt(fee),
        imageUrl: imageUrl || null,
        lokasi: lokasi || null,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

