import React from 'react'
import Card from './Card'
import RedirectAnchor from '../RedirectAnchor'
import star from "@/assets/img/star.png"
import Image from 'next/image'
const CardContact = () => {
    return (
        <Card className='card-contact col-2'>
            <h3 className='card-title'>Let&apos;s</h3>
            <h3 className='card-title'> Work <span className="highlight">Together</span></h3>
            <RedirectAnchor href='/' />
            <Image src={star} width={30} alt='star' className='star' />
        </Card>
    )
}

export default CardContact