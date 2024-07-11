import React, { Suspense } from 'react'

import { Share } from "@/component/Share";
import Image from "next/image"
import { redirect } from "next/navigation";
import exp from 'constants';
import { metadata } from '@/app/(main)/layout';
interface Article {
    id: string,
    title: string,
    createdAt: Date,
    updatedAt: Date,
    status: string,
    content: string,
    banner: string
    description?: string
    author: {
        name: string,
    }
}

async function getData(slug: string) {
    const res = await fetch(`https://admin-panel-eta-ten.vercel.app/api/blog/${slug}`, {
        next: {
            revalidate: 3600
        },
    })
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
    }
    return res.json()
}

const BlogDetail = async ({ params }: { params: { slug: string } }) => {
    try {
        const data = await getData(params.slug)
        metadata.title = data.title
        metadata.description = data.description
        // metadata.openGraph = {
        //     url: `https://developerayush.com/blog/${params.slug}`,
        //     title: data.title,
        //     description: data.description,
        //     images: [{
        //         url: data.banner,
        //         secureUrl: data.banner,
        //         alt: data.title,
        //         width: 1080,
        //         height: 720
        //     }],
        //     type: 'article',
        // }
        // metadata.twitter = {
        //     card: 'summary_large_image',
        //     title: data.title,
        //     description: data.description,
        //     images: [{
        //         url: data.banner,
        //         secureUrl: data.banner
        //     }],
        //     site: '@developerayush',
        //     creator: '@developerayush',
        // }

        return (
            <Suspense fallback={<div>loading...</div>}>
                <div className="blog-page">
                    <div className="blog-image">
                        <Image src={data.banner} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt="blog-details" width="1920" height="720" />
                    </div>
                    <div className="blog-content">
                        <div className="blog-head">
                            <h3 className="title">{data.title}</h3>
                            <div className="blog-data ">
                                <div className="blog-meta">
                                    <p className="meta meta-date">{new Date(data.updatedAt).toLocaleDateString()}</p>
                                    <p className="meta meta-author">{data.author.name}</p>
                                </div>
                                <Share title={data.title} />
                            </div>
                        </div>
                        <div className="blog-body">
                            <form dangerouslySetInnerHTML={{ __html: data.content }}></form>
                        </div>
                    </div>

                </div>
            </Suspense>
        )
    } catch {
        console.log("error")
        redirect('/404')
    }

}
export default BlogDetail