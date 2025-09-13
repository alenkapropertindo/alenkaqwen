import { getServerSession } from "@/lib/get-session";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ session });
  } catch (error) {
    console.error("Error getting session:", error);
    let errorMessage = "Failed to get session";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}