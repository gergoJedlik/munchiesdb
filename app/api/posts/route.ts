
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
                Ratings: true,
                User: {
                    select: {
                        name: true,
                        id: true
                    }
                }
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


export async function POST(req: NextRequest) {
    const post = await req.json()
    try {
        const createdPost = await prisma.post.create({
            data: {
                FoodName: post.foodname,
                Desc: post.description ? post.description : "No description",
                Ingredients: post.ingredients ? post.ingredients : "No ingredients",
                Nutri: post.calories,
                Image: post.imgLink,
                userID: post.user
            }
        })
        await prisma.rating.create({
            data: {
                taste: post.rating.taste,
                simplicity: post.rating.simplicity,
                nutrition: post.rating.nutrition,
                price: post.rating.price,
                texture: 0,
                userID: post.user,
                postID: createdPost.postID
            }
        })
    } catch (error) {
        return new NextResponse(JSON.stringify(error), {
            status: 422,
            headers: CORS
        })
    }
    return new NextResponse(JSON.stringify(post), {
        status: 201,
        headers: CORS
    })
}



async function handleSort(sort: string | null) {
    let data;
    console.log(sort)
    switch (sort) {
        case "alphabet":
            data = await prisma.post.findMany({
                include: {
                    Ratings: true,
                    User: {
                        select: {
                            name: true
                        }
                    }
                },
                orderBy: {
                    FoodName: "asc"
                }
            })
            break;
        case "reverse":
            data = await prisma.post.findMany({
                include: {
                    Ratings: true,
                    User: {
                        select: {
                            name: true
                        }
                    }
                },
                orderBy: {
                    FoodName: "desc"
                }
            })
            break;
        case "popular":
            data = await prisma.post.findMany({
                include: {
                    Ratings: true,
                    User: {
                        select: {
                            name: true
                        }
                    }
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
                    Ratings: true,
                    User: {
                        select: {
                            name: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            })
            break;
        case "oldest":
            data = await prisma.post.findMany({
                include: {
                    Ratings: true,
                    User: {
                        select: {
                            name: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "asc"
                }
            })
            break;
        default:
            data = await prisma.post.findMany({
                include: {
                    Ratings: true,
                    User: {
                        select: {
                            name: true
                        }
                    }
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

