import { NextRequest, NextResponse } from "next/server";
import {prisma} from '@/lib/prisma'
import { CheckAuth } from "@/lib/checkAuth";

export async function GET(){
try {
    const res = await CheckAuth();
    const userEmail = res?.email
    const deletedUser = await prisma.user.delete({
        where:{
            email: userEmail
        }
    })

    const response = NextResponse.json({deletedUser,message:"user deleted successfully"}, {status: 200})

    response.cookies.set('token', "", {httpOnly: true, expires: new Date(0)}) // clears the cookie
    return response;
} catch (error) {
    console.log("Error in deleting user: ", error);
    return NextResponse.json({message:"Error in deleting user"})
}
}