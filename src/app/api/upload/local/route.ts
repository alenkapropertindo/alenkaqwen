import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { writeFile } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

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
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Generate unique filename
    const fileExtension = file.name.split(".").pop();
    const uniqueFilename = `${randomUUID()}.${fileExtension}`;
    
    // Save file to public/uploads directory
    const path = join(process.cwd(), "public", "uploads", uniqueFilename);
    await writeFile(path, buffer);
    
    // Return the URL where the file can be accessed
    const url = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/uploads/${uniqueFilename}`;
    
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}

export const runtime = "nodejs";