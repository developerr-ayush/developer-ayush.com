"use client"
import React, { useEffect, useState } from 'react'
import CardList from '@/component/card/CardList'
import Title from '@/component/Title'
import BasicCard from '@/component/card/BasicCard'
interface Article {
    id: string,
    title: string,
    createdAt: Date,
    updatedAt: Date,
    status: string,
    banner: string
    description?: string
    author: {
        name: string,
    }
}
interface apiErr {
    error: string
}
const Blog = () => {
    const [data, setData] = useState<apiErr | null | Article[]>(null)
    useEffect(() => {
        const getData = async () => {
            const apiData = await fetch("https://auth-sigma-two.vercel.app/api/blog", { cache: "no-cache" })
            setData(await apiData.json())
        }
        getData()
    }, [])

    if (data == null) return (
        <div>loading...</div>
    )

    if ("error" in data) return (
        <div>No data found</div>
    )
    return (
        <CardList className='grid grid-lg-3 align-start '>
            <div className="col-lg-3">
                <Title>Blogs</Title>
            </div>
            <CardList className='col-lg-3 grid-lg-3 align-start'>
                {data.map((article: Article) =>
                    <div key={article.id}>
                        <BasicCard img={{
                            src: article.banner,
                            alt: article.title,
                            height: 500
                        }}
                            content={{
                                title: article.title,
                                text: article.description
                            }}
                            redirect={`/blog/${article.id}`}
                            className="card-blog" />
                    </div>
                )}
            </CardList>
        </CardList>
    )
}

export default Blog