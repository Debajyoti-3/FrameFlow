"use client"

import React from 'react'
import { useRouter } from 'next/navigation'

function page() {
  const router = useRouter()
  return (
    <div className='flex items-center pt-3'>
      <h1 className='text-blue-600 text-6xl'>Welcome to Ultimate Saas</h1>
      <button onClick={()=>router.push("/social-share")} className='cursor-pointer bg-amber-600 rounded-[6px] p-1.5'>Social-Share</button>
    </div>
  )
}

export default page
