import { getServerSession } from "@/lib/get-session";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ session });
  } catch (error: any) {
    console.error("Error getting session:", error);
    return NextResponse.json({ error: error.message || "Failed to get session" }, { status: 500 });
  }
}