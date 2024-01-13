import React from 'react'
import Card from './Card'
import RedirectAnchor from '../RedirectAnchor'
import star from "@/assets/img/star.png"
import Image from 'next/image'
const CardContact = () => {
    return (
        <Card className='card-contact '>
            <h3 className='card-title'>Let&apos;s <br /> Work <span className="highlight">Together</span></h3>
            <RedirectAnchor href='/contact' />
            <Image src={star} width={30} alt='star' className='star' />
        </Card>
    )
}

export default CardContact