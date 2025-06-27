import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { prisma } from '@/lib/prisma';

// GET profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id
      },
      select: {
        id: true,
        name: true,
        email: true,
        imageUrl: true,
        phone: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            bio: true,
            location: true,
            website: true,
            twitter: true,
            github: true,
            linkedin: true
          }
        },
        _count: {
          select: {
            projects: true,
            experiences: true,
            skills: true
          }
        }
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// UPDATE profile
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const user = await prisma.user.update({
      where: {
        id: session.user.id
      },
      data: {
        name: data?.name,
        imageUrl: data?.imageUrl,
        phone: data?.phone,
        profile: {
          upsert: {
            create: {
              bio: data?.profile?.bio,
              website: data?.profile?.website,
              twitter: data?.profile?.twitter,
              github: data?.profile?.github,
              linkedin: data?.profile?.linkedin
            },
            update: {
              bio: data?.profile?.bio,
              website: data?.profile?.website,
              twitter: data?.profile?.twitter,
              github: data?.profile?.github,
              linkedin: data?.profile?.linkedin
            }
          }
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        imageUrl: true,
        phone: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            bio: true,
            location: true,
            website: true,
            twitter: true,
            github: true,
            linkedin: true
          }
        },
        _count: {
          select: {
            projects: true,
            experiences: true,
            skills: true
          }
        }
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
} 