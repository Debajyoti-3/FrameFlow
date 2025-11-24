import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@/app/generated/prisma/client";   // importing from '@prisma/client' gives error

const prisma = new PrismaClient()

export async function GET(request: NextRequest){
    try {
        const videos = await prisma.video.findMany({
            orderBy: {createdAt: "desc"}
        })

        return NextResponse.json(videos)
    } catch (error) {
        return NextResponse.json({error: "Error in fetching videos", status: 500})
    } finally{
        await prisma.$disconnect()
    }
}