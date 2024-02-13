import React from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
const page = async () => {
    const session = await auth()
    console.log()
    if (session) {
        redirect('/admin/login');
    }
    return (
        <div>{JSON.stringify(session)}</div>
    )
}

export default page