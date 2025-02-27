// /api/aurinko/callback

import { exchangeCodeForAccessToken, getAccountDetails } from "@/lib/aurinko"
import { db } from "@/server/db"
import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (req: NextRequest) => {
    const {userId} = await auth()
    if (!userId) 
        return NextResponse.json({message: 'Unauthorized'},{status:401})

    // console.log('userId is',userId)

    const params = req.nextUrl.searchParams 
    const status = params.get('status')
    if (status != 'success')
        return NextResponse.json({message: 'Failed to link account'},{status:400})

    const code = params.get('code')
    if (!code)
        return NextResponse.json({message: 'No code provided'},{status:400})
    
    const token = await exchangeCodeForAccessToken(code as string)

    // console.log('--------------------------------------------------------------------------------------\n\n ')
    // console.log('token is:',token)
    // console.log('---------------------------------------------------------------------------------------\n\n ')


    if (!token) 
        return NextResponse.json({message: 'Failed to exchange code for access token'},{status:400})

    // console.log('---------------------------------------------------------------------------------------\n\n ')
    // console.log('before calling acc details')
    // console.log(token)
    // console.log(token.accessToken)
    // console.log('---------------------------------------------------------------------------------------\n\n ')

    const accountDetails = await getAccountDetails(token.accessToken)
    // console.log(accountDetails)

    await db.account.upsert({
        where: {
            id: token.accountId.toString()
        },
        create: {
            id: token.accountId.toString(),
            userId,
            emailAddress: accountDetails.email,
            provider: 'Aurinko',
            name: accountDetails.name,
            accessToken: token.accessToken,
        },
        update: {
            accessToken: token.accessToken,
        },
    })

    return NextResponse.redirect(new URL ('/mail',req.url))
}