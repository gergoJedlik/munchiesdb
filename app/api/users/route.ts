import prisma from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from "bcrypt";

const CORS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
}

async function encryptPass(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(8);
    const hashedPass = await bcrypt.hash(password, salt);
    return hashedPass
}

async function verifyPass(inputPass: string, hashedPass: string) {
    return await bcrypt.compare(inputPass, hashedPass);
}

export async function GET(req: NextRequest): Promise<NextResponse> {
    const userID = req.nextUrl.searchParams.get("userID");

    if (userID) {
        const user = await prisma.user.findUnique({
            where: {
                id: userID
            },
            select: {
                name: true,
                id: true
            }
        });
        return new NextResponse(JSON.stringify(user), { status: 200, headers: CORS })
    }

    // ----- LOGIN ------
    const username = req.nextUrl.searchParams.get("username");
    const password = req.nextUrl.searchParams.get("password");

    if (username && password) {
        const user = await prisma.user.findUnique({
            where: {
                name: username,
            }
        });

        if (!user) {
            return new NextResponse("User not found", {
                status: 404,
                headers: CORS
            })
        }

        if (!await verifyPass(password, user.pass)) {
            return new NextResponse("Password incorrect", {
                status: 404,
                headers: CORS
            })
        }

        return new NextResponse(JSON.stringify({ userID: user.id, username: user.name }), { status: 200, headers: CORS });
    }

    // ----- ALL USERS ----- (deleted)
    return new NextResponse(
        "No query",
        {
            status: 200,
            headers: CORS
        }
    )
}

export async function POST(req: NextRequest) {
    const user = await req.json()
    try {
        await prisma.user.create({
            data: {
                name: user.username,
                pass: await encryptPass(user.password)
            }
        })
    } catch (error) {
        return new NextResponse(JSON.stringify(error), {
            status: 422,
            headers: CORS
        })
    }
    return new NextResponse("No errors during register", {
        status: 201,
        headers: CORS
    })
}

export async function OPTIONS(): Promise<NextResponse> {
    return new NextResponse(null, {
        status: 200,
        headers: CORS,
    });
}
