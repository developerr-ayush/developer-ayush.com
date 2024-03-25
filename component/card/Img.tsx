import { StaticImport } from 'next/dist/shared/lib/get-img-props'
import Image from 'next/image'
import React from 'react'
import loadingImg from '@/assets/img/loading.gif'
interface img {
    src: StaticImport | string,
    width: number,
    alt: string,
    className?: string
    height?: number
}
const Img = ({ src, width, alt, className, height }: img) => {
    return (
        <div className={`card-img ${className ? className : ""}`}>
            <Image src={src} width={width} alt={alt} height={height} placeholder='blur' blurDataURL="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==" />
        </div>
    )
}

export default Img