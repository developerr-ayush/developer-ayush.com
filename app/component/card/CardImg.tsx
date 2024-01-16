import { StaticImport } from 'next/dist/shared/lib/get-img-props'
import Image from 'next/image'
import React from 'react'
interface img {
    src: StaticImport,
    alt: string,
    width?: number
}
const CardImg = ({ src, alt, width }: img) => {
    return (
        <div className="card-image row-2">
            <Image src={src} width={width} alt={alt} />
        </div>
    )
}

export default CardImg