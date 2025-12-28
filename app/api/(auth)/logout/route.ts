import { NextResponse } from "next/server";


export async function GET() {
    try {
        const response = NextResponse.json({
            message: 'logout successful',
            success: true
        });

        response.cookies.set('token', "", {httpOnly: true, expires: new Date(0)}) // clears the cookie

        return response
    } catch (error) {
        console.log("Error in logout: ", error)
        return NextResponse.json({message: 'Error in logout', success: false})
    }
}