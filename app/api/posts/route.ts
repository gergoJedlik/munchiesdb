
import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

const CORS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
}

export async function GET(req: NextRequest): Promise<NextResponse> {

    const postID = req.nextUrl.searchParams.get("postID");

    if (postID) {
        const data = await prisma.post.findUnique({
            where: {
                postID: postID
            },
            include: {
                Ratings: true
            }
        });
        return new NextResponse(
            JSON.stringify({ data }),
            {
                status: 200,
                headers: CORS,
            }
        );
    }

    const sort = req.nextUrl.searchParams.get("sort");
    const data = await handleSort(sort);
    const response = new NextResponse(
        JSON.stringify({ data }),
        {
            status: 200,
            headers: CORS,
        }
    );

    return response;
}

export async function OPTIONS(): Promise<NextResponse> {
    return new NextResponse(null, {
        status: 200,
        headers: CORS,
    });
}

async function handleSort(sort: string | null) {
    let data;
    console.log(sort)
    switch (sort) {
        case "basic":
            data = await prisma.post.findMany({
                include: {
                    Ratings: true
                },
                orderBy: {
                    postID: "asc"
                }
            })
            break;
        case "reverse":
            data = await prisma.post.findMany({
                include: {
                    Ratings: true
                },
                orderBy: {
                    postID: "desc"
                }
            })
        case "popular":
            data = await prisma.post.findMany({
                include: {
                    Ratings: true
                },
                orderBy: {
                    Ratings: {
                        _count: "desc"
                    }
                }
            })
            break;
        case "newest":
            data = await prisma.post.findMany({
                include: {
                    Ratings: true
                },
                orderBy: {
                    createdAt: "desc"
                }
            })
            break;
        case "oldest":
            data = await prisma.post.findMany({
                include: {
                    Ratings: true
                },
                orderBy: {
                    createdAt: "asc"
                }
            })
            break;
        default:
            data = await prisma.post.findMany({
                include: {
                    Ratings: true
                }
            })
            break;
    }
    return data;
}
/*
export async function POST(req: NextRequest): Promise<NextResponse> {
    const formData = await req.formData()
    const [foodname, desc, ingredients, nutri, userID] = [formData.get("name"), formData.get("desc"), formData.get("ingredients"), formData.get("nutri"), formData.get("userID")];
    if (foodname && desc && ingredients && nutri) {
        prisma.post.create({
            data: {
                FoodName: foodname.toString(),
                Desc: desc.toString(),
                Ingredients: ingredients.toString(),
                Nutri: parseInt(nutri.toString()),
            }
        });
    }

}
*/

