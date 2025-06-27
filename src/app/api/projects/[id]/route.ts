import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const project = await prisma.project.findUnique({
      where: {
        id: resolvedParams.id
      },
      include: {
        technologies: {
          include: {
            technology: true
          }
        },
        skills: {
          include: {
            skill: true
          }
        },
        images: true
      }
    });

    if (!project) {
      return new Response(JSON.stringify({ error: "Project not found" }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    console.log(project);

    return new Response(JSON.stringify(project), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch project" }), {
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

    // First, delete all existing images for this project
    await prisma.projectImage.deleteMany({
      where: {
        projectId: resolvedParams.id
      }
    });

    // Then update the project with new data
    const project = await prisma.project.update({
      where: {
        id: resolvedParams.id,
        userId: session.user.id
      },
      data: {
        title: data.title,
        description: data.description,
        githubUrl: data.githubUrl,
        demoUrl: data.demoUrl,
        category: data.category,
        status: data.status,
        userId: session.user.id,
        // Create new images
        images: {
          createMany: {
            data: data.images.map((img: any, index: number) => ({
              url: img.url,
              caption: img.caption || '',
              order: index
            }))
          }
        }
      },
      include: {
        technologies: {
          include: {
            technology: true
          }
        },
        skills: {
          include: {
            skill: true
          }
        },
        images: true
      }
    });

    return new Response(JSON.stringify(project), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return new Response(JSON.stringify({ error: "Failed to update project" }), {
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

    await prisma.project.delete({
      where: {
        id: resolvedParams.id,
        userId: session.user.id
      }
    });

    return new Response(JSON.stringify({ message: "Project deleted successfully" }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return new Response(JSON.stringify({ error: "Failed to delete project" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 