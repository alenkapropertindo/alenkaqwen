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

    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
    });

    if (!product) {
      return new NextResponse("product not found", { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// PUT /api/customers/[id] - Update a specific customer
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

    const json = await request.json();
    const { title, description, dpAkad, videoLink, fee, imageUrl } = json;

    const product = await prisma.product.update({
      where: {
        id: id,
      },
      data: {
        title,
        description,
        dpAkad: parseInt(dpAkad),
        videoLink: videoLink || null,
        fee: parseInt(fee),
        imageUrl: imageUrl || null,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[CUSTOMERS_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE /api/product/[id] - Delete a specific product
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
