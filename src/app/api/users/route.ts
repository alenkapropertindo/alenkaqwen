import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { UserRole, Status } from "@/generated/prisma";

// GET /api/users - Get all users
export async function GET() {
  try {
    const session = await getServerSession();
    
    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Check if user is admin
    if (session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    // Fetch all users with their customer counts by status
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        whatsapp: true,
        role: true,
        _count: {
          select: {
            customers: {
              where: {
                status: Status.AKAD_KREDIT
              }
            }
          }
        },
        customers: {
          where: {
            status: Status.PEMBERKASAN
          },
          select: {
            id: true
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    
    // Transform the data to match the expected format
    const transformedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      whatsapp: user.whatsapp,
      role: user.role,
      akadKreditCount: user._count.customers,
      pemberkasanCount: user.customers.length
    }));
    
    return NextResponse.json({ users: transformedUsers });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/users - Update user role
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession();
    
    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Check if user is admin
    if (session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    const { userId, role } = await request.json();
    
    // Validate input
    if (!userId || !role) {
      return NextResponse.json({ error: "Missing userId or role" }, { status: 400 });
    }
    
    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        whatsapp: true,
        role: true,
      },
    });
    
    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}