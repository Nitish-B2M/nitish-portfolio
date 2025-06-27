import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const experience = await prisma.experience.findUnique({
      where: {
        id: resolvedParams.id
      }
    });

    if (!experience) {
      return new Response(JSON.stringify({ error: "Experience not found" }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(experience), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error fetching experience:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch experience" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await request.json();
    const experience = await prisma.experience.update({
      where: {
        id: resolvedParams.id,
        userId: session.user.id
      },
      data
    });

    return new Response(JSON.stringify(experience), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error updating experience:", error);
    return new Response(JSON.stringify({ error: "Failed to update experience" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await prisma.experience.delete({
      where: {
        id: resolvedParams.id,
        userId: session.user.id
      }
    });

    return new Response(JSON.stringify({ message: "Experience deleted successfully" }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error deleting experience:", error);
    return new Response(JSON.stringify({ error: "Failed to delete experience" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
