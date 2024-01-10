import React from 'react'
import Card from './Card'
import RedirectAnchor from '../RedirectAnchor'
import Image from 'next/image'
import blog from "@/assets/img/gfonts.png"

const CardBlog = () => {
    return (
        <Card className="card-blog">
            <div className="card-image">
                <Image src={blog} width={240} alt="mywork" />
            </div>
            <div className="card-content">
                <p className="card-sub-title"> Blog</p>
                <h3 className="card-title">GFonts</h3>
            </div>
            <RedirectAnchor href="/" />
        </Card>
    )
}

export default CardBlog