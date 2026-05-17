import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { kodePromo } = await request.json();

    if (!kodePromo) {
      return NextResponse.json({ error: "Kode promo is required" }, { status: 400 });
    }

    // Find the user with this kodeUnik
    const affiliateUser = await prisma.user.findUnique({
      where: {
        kodeUnik: kodePromo,
      },
    });

    if (!affiliateUser) {
      return NextResponse.json({ error: "Kode promo tidak terdaftar, silahkan periksa kembali." }, { status: 404 });
    }

    return NextResponse.json({ valid: true, affiliateId: affiliateUser.id });
  } catch (error) {
    console.error("Error validating promo code:", error);
    return NextResponse.json({ error: "Failed to validate promo code" }, { status: 500 });
  }
}
