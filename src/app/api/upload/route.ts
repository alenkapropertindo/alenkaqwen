import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    
    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Check if user is admin (only admins can upload product images)
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin only" }, { status: 403 });
    }
    
    // Get the form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    
    // Upload to Vercel Blob with explicit token
    const blob = await put(file.name, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    
    return NextResponse.json(blob);
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}

export const runtime = "nodejs";