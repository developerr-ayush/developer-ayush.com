import React from 'react'
import Card from './Card'
import Img from './Img'
import { StaticImport } from 'next/dist/shared/lib/get-img-props'
import Content from './Content'
import RedirectAnchor from '../RedirectAnchor'
interface basicCard {
    img?: {
        src: StaticImport,
        alt: string
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
}
const BasicCard = ({ img, content, children, redirect, className }: basicCard) => {
    return (
        <Card className={className ? className : ""}>
            {img && <Img src={img.src} alt={img.alt} width={500} />}
            {children}
            {content && <Content title={content.title} subTitle={content.subTitle} text={content.text} name={content.name} />}
            {redirect && <RedirectAnchor href={redirect} />}
        </Card>
    )
}

export default BasicCard