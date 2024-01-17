import { StaticImport } from 'next/dist/shared/lib/get-img-props'
import Image from 'next/image'
import React from 'react'
import loadingImg from '@/assets/img/loading.gif'
interface img {
    src: StaticImport,
    width: number,
    alt: string,
    className?: string
}
const Img = ({ src, width, alt, className }: img) => {
    return (
        <div className={`card-img ${className ? className : ""}`}>
            <Image src={src} width={width} alt={alt} />
        </div>
    )
}

export default Img