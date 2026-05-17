import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, whatsapp, rekeningNo, kodeUnik } = await request.json();

    const updateData: any = {
      name,
      whatsapp,
      rekeningNo,
    };

    // Only allow setting kodeUnik if it hasn't been set yet
    if (kodeUnik && !session.user.kodeUnik) {
      updateData.kodeUnik = kodeUnik;
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: updateData,
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    let errorMessage = "Failed to update profile";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}