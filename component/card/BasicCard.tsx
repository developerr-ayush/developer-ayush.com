import React from 'react'
import Card from './Card'
import Img from './Img'
import { StaticImport } from 'next/dist/shared/lib/get-img-props'
import Content from './Content'
import RedirectAnchor from '../RedirectAnchor'
interface basicCard {
    img?: {
        src: StaticImport | string,
        alt: string,
        width?: number,
        height?: number
    },
    content?: {
        title?: string,
        subTitle?: string,
        name?: string,
        text?: string
    },
    redirect?: string,
    children?: React.ReactNode,
    className?: string
    redirectTitle?: string,
    blank?: boolean
}
const BasicCard = ({ img, content, children, redirect, className, redirectTitle,blank }: basicCard) => {
    return (
        <Card className={className ? className : ""}>
            {img && <Img src={img.src} alt={img.alt} width={500} height={img.height}/>}
            {children}
            {content && <Content title={content.title} subTitle={content.subTitle} text={content.text} name={content.name} />}
            {redirect && <RedirectAnchor href={redirect} redirectTitle={redirectTitle} blank={blank} />}
        </Card>
    )
}

export default BasicCard