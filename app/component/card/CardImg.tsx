import Image from 'next/image'
import React from 'react'
import profile from "@/assets/img/profile.jpg"
const CardImg = () => {
    return (
        <div className="card card-image row-2">
            <Image src={profile} width={300} alt="profile" />
        </div>
    )
}

export default CardImg