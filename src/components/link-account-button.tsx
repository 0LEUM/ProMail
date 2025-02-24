'use client'

import React from 'react'
import { Button } from './ui/button'
import { getAurinkoAuthUrl } from '@/lib/aurinko'


const LinkAccountButton = () => {
  return (
    <div>
      <Button onClick={async()=>{
        const authUrl = await getAurinkoAuthUrl('Google')
      }}>
        Link Account
      </Button>
    </div>
  )
}

export default LinkAccountButton
