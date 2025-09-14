import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/get-session";
import { NextResponse } from "next/server";

// GET /api/products/[id] - Get a specific product
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

    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// PATCH /api/products/[id] - Update a specific product
export async function PATCH(
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

    // Check if user is admin
    if (user.role !== "ADMIN") {
      return new NextResponse("Forbidden: Admin only", { status: 403 });
    }

    const json = await request.json();
    const { title, detail, description, kategori, dpAkad, videoLink, fee, imageUrl, lokasi } = json;

    const product = await prisma.product.update({
      where: {
        id: id,
      },
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

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCTS_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE /api/products/[id] - Delete a specific product
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

    // Check if user is admin
    if (user.role !== "ADMIN") {
      return new NextResponse("Forbidden: Admin only", { status: 403 });
    }

    const product = await prisma.product.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCTS_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
