import prisma from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';

const CORS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
}

export async function GET(req: NextRequest): Promise<NextResponse> {
    const userID = req.nextUrl.searchParams.get("userID");

    if (userID) {
        const user = await prisma.user.findUnique({
            where: {
                id: userID
            },
            include: {
                Posts: true
            }
        });
        return new NextResponse(JSON.stringify({ user }), { status: 200, headers: CORS })
    }

    const username = req.nextUrl.searchParams.get("username");

    if (username) {
        const user = await prisma.user.findUnique({
            where: {
                name: username,
            }
        });
        const res = new NextResponse(JSON.stringify({ user }), { status: 200, headers: CORS });
        if (user) {
            res.cookies.set("user", user.id);
        }
        return res;
    }
    const users = await prisma.user.findMany();
    return new NextResponse(
        JSON.stringify({ users }),
        {
            status: 200,
            headers: CORS
        }
    )
}