import React from 'react'
import { redirect } from 'next/navigation'
const page = () => {
    redirect('/admin/login');
    return (
        <div>page</div>
    )
}

export default page