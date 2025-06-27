import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { prisma } from '@/lib/prisma';

// GET all experiences
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const experiences = await prisma.experience.findMany({
      where: {
        userId: session.user.id
      },
      select: {
        id: true,
        title: true,
        company: true,
        location: true,
        description: true,
        startDate: true,
        endDate: true,
        isCurrent: true,
        createdAt: true,
        updatedAt: true,
        address: {
          select: {
            street: true,
            city: true,
            state: true,
            country: true,
            postalCode: true
          }
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    });

    return NextResponse.json(experiences);
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return NextResponse.json(
      { error: "Failed to fetch experiences" },
      { status: 500 }
    );
  }
}

// CREATE new experience
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { address, ...experienceData } = data;

    const experience = await prisma.experience.create({
      data: {
        ...experienceData,
        userId: session.user.id,
        address: address ? {
          create: address
        } : undefined
      },
      select: {
        id: true,
        title: true,
        company: true,
        location: true,
        description: true,
        startDate: true,
        endDate: true,
        isCurrent: true,
        createdAt: true,
        updatedAt: true,
        address: {
          select: {
            street: true,
            city: true,
            state: true,
            country: true,
            postalCode: true
          }
        }
      }
    });

    return NextResponse.json(experience);
  } catch (error) {
    console.error("Error creating experience:", error);
    return NextResponse.json(
      { error: "Failed to create experience" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { id, title, company, description, startDate, endDate, isCurrent, address } = body;

    // Update or create address
    let addressData;
    if (address) {
      if (address.id) {
        addressData = {
          update: {
            street: address.street,
            city: address.city,
            state: address.state,
            country: address.country,
            postalCode: address.postalCode,
          },
        };
      } else {
        addressData = {
          create: {
            street: address.street,
            city: address.city,
            state: address.state,
            country: address.country,
            postalCode: address.postalCode,
          },
        };
      }
    }

    const experience = await prisma.experience.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        title,
        company,
        description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        isCurrent,
        address: addressData,
      },
      include: {
        address: true,
      },
    });

    return NextResponse.json(experience);
  } catch (error) {
    console.error('Failed to update experience:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse('Experience ID required', { status: 400 });
    }

    const experience = await prisma.experience.delete({
      where: {
        id,
        userId: session.user.id,
      },
    });

    return NextResponse.json(experience);
  } catch (error) {
    console.error('Failed to delete experience:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 