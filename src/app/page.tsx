"use client";
// import LinkAccountButton from "@/components/link-account-button"
import {Button} from "@/components/ui/button"
import { signIn } from "next-auth/react"


export default async function Home() {
  const GoogleLogin = ()=> signIn ('google', {callbackUrl:'http://localhost:3000/home-page'})

  // return <LinkAccountButton/>
  return (
    <Button onClick={GoogleLogin}>Sign in with Google</Button>
  )
}
