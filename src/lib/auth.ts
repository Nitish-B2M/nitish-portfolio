import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const requireAdmin = async (req: NextRequest) => {
    const token = req.cookies.get("token")?.value;
    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
        where: { id: token },
    });
if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}


