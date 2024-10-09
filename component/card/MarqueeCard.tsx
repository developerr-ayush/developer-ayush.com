import React from 'react'
import BasicCard from './BasicCard'
import Marquee from '../Marquee'
const getBlogs = async function () {
    const apiData = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog`, {
        next: {
            revalidate: 3600
        }
    })
    let data = await apiData.json()
    return data
}
interface Article {
    id: string,
    title: string,
    createdAt: Date,
    updatedAt: Date,
    status: string,
    banner: string
    description?: string
    slug: string,
    author: {
        name: string,
    }
}
export const MarqueeCard = async () => {
    const data = await getBlogs()
    return (
        <BasicCard className="card-marquee" >
            <Marquee>
                {data.map((article: Article, i: number) =>
                    i < 3 && (<div key={article.id} className="marquee-item"><a href={`/blog/${article.slug}`}>{article.title}</a></div>)
                )}
            </Marquee>
        </BasicCard>
    )
}
