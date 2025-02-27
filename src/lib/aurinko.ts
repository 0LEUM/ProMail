"use server";

import axios from "axios"
import { auth } from "@clerk/nextjs/server";

export const getAurinkoAuthUrl = async (serviceType: "Google" | "Office365") => {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  if (!process.env.AURINKO_CLIENT_ID) {
    throw new Error("Missing AURINKO_CLIENT_ID. Check your environment variables.");
  }

  const params = new URLSearchParams({
    clientId: process.env.AURINKO_CLIENT_ID as string,
    serviceType,
    scopes: 'Mail.Read Mail.ReadWrite Mail.Send Mail.Drafts Mail.All',
    responseType: 'code',
    returnUrl: `${process.env.NEXT_PUBLIC_URL}/api/aurinko/callback`, // FIXED
  });

  // console.log("Generated Auth URL:", `https://api.aurinko.io/v1/auth/authorize?${params.toString()}`);

  return `https://api.aurinko.io/v1/auth/authorize?${params.toString()}`;
};

export const exchangeCodeForAccessToken = async (code: string) => {
  try {

    // console.log('inside exchangeCodeForAccessToken')

    // console.log(code)
    
    const response = await axios.post(`https://api.aurinko.io/v1/auth/token/${code}`, {}, {
      auth: {
        username: process.env.AURINKO_CLIENT_ID as string,
        password: process.env.AURINKO_CLIENT_SECRET as string
      }
    })
    
    // console.log('--------------------------------------------------------------------------------------\n\n ')
    // console.log(response.data)
    // console.log('---------------------------------------------------------------------------------------\n\n ')

    return response.data as {
      accountId: number, 
      accessToken: string,
      userId: string,
      userSession: string,
    }
  } 
  catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data)
    }
    console.log(error)
  }
}

export const getAccountDetails = async (accessToken: string) => {
  try {

    // console.log('---------------------------------------------------------------------------------------\n\n ')
    // console.log('inside getAccountDetails')
    // console.log(accessToken)
    // console.log('---------------------------------------------------------------------------------------\n\n ')

    const response = await axios.get(`https://api.aurinko.io/v1/am/accounts`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })

    // console.log('---------------------------------------------------------------------------------------\n\n ')
    // console.log(response.data)
    // console.log('---------------------------------------------------------------------------------------\n\n ')

    return response.data as {
      email: string,
      name: string
    }
  } 
  catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching account details:', error.response?.data);
    }
    else {
      console.error('Unexpected error fetching account details:', error);
    }
    throw error;
  }
}