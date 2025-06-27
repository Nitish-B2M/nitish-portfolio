import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { prisma } from "@/lib/prisma";
import { EntityType } from "@prisma/client";

// GET all projects
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // If admin, return all projects
    if (session?.user?.role === "ADMIN") {
      const projects = await prisma.project.findMany({
        where: {
          userId: session.user.id
        },
        include: {
          skills: {
            include: {
              skill: true
            }
          },
          technologies: {
            include: {
              technology: true
            }
          },
          images: true
        }
      });
      return NextResponse.json(projects);
    }

    // For public access, only return published projects
    const publishedProjects = await prisma.project.findMany({
      where: {
        status: "PUBLISHED"
      },
      include: {
        skills: {
          include: {
            skill: true
          }
        },
        technologies: {
          include: {
            technology: true
          }
        },
        images: true
      }
    });

    return NextResponse.json(publishedProjects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// CREATE new project
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // First check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
      console.error('User not found:', session.user.id);
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Validate required fields
    if (!data?.title?.trim()) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    if (!data?.description?.trim()) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    // Use a transaction to ensure all operations succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      // Create the project first
      const project = await tx.project.create({
        data: {
          title: data.title.trim(),
          description: data.description.trim(),
          demoUrl: data.demoUrl?.trim() || null,
          githubUrl: data.githubUrl?.trim() || null,
          category: data.category || "FULLSTACK",
          status: data.status || "DRAFT",
          userId: session.user.id,
        }
      });

      // Handle skills if provided
      if (Array.isArray(data.skills) && data.skills.length > 0) {
        const uniqueSkills = [...new Set(data.skills)].filter((s): s is string => typeof s === 'string').map(s => s.trim());
        
        // Create new skills and get existing ones in a single query
        const skills = await Promise.all(
          uniqueSkills.map(name => 
            tx.skill.upsert({
              where: { name },
              create: { name, userId: session.user.id },
              update: {} // No update needed
            })
          )
        );

        // Create skill connections
        if (skills.length > 0) {
          await tx.entitySkill.createMany({
            data: skills.map((skill) => ({
              projectId: project.id,
              skillId: skill.id,
              entityType: "PROJECT"
            }))
          });
        }
      }

      // Handle technologies if provided
      if (Array.isArray(data.technologies) && data.technologies.length > 0) {
        const uniqueTechs = [...new Set(data.technologies)].filter((t): t is string => typeof t === 'string').map(t => t.trim());
        
        // Create new technologies and get existing ones in a single query
        const technologies = await Promise.all(
          uniqueTechs.map(name => 
            tx.technology.upsert({
              where: { name },
              create: { name, userId: session.user.id },
              update: {} // No update needed
            })
          )
        );

        // Create technology connections
        if (technologies.length > 0) {
          await tx.entityTechnology.createMany({
            data: technologies.map((tech) => ({
              projectId: project.id,
              techId: tech.id,
              entityType: "PROJECT"
            }))
          });
        }
      }

      // Handle images if provided
      if (Array.isArray(data.images) && data.images.length > 0) {
        const validImages = data.images.filter((image: any) => 
          image && typeof image.url === 'string' && image.url.trim() !== ''
        );

        if (validImages.length > 0) {
          await tx.projectImage.createMany({
            data: validImages.map((image: any, index: number) => ({
              url: image.url,
              projectId: project.id,
              caption: image.caption?.trim() || null,
              order: image.order || index,
            }))
          });
        }
      }

      // Return the created project with all relations
      return tx.project.findUnique({
        where: { id: project.id },
        include: {
          skills: {
            include: {
              skill: true
            }
          },
          technologies: {
            include: {
              technology: true
            }
          },
          images: true
        }
      });
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
} 