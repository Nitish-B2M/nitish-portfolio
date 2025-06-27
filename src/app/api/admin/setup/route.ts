import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Create the admin user with the specific ID
    const user = await prisma.user.create({
      data: {
        id: "9496cc50-8e77-4931-bdf8-160c54f53015", // The ID from your session
        name,
        email,
        password: await bcrypt.hash(password, 10),
        role: "ADMIN",
      },
    });

    return NextResponse.json(
      { message: "Admin user created successfully", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { error: "Failed to create admin user" },
      { status: 500 }
    );
  }
} 