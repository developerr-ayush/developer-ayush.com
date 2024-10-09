"use client";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import BasicCard from "@/component/card/BasicCard";
interface Article {
    id: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    status: string;
    banner: string;
    description?: string;
    slug: string;
    author: {
        name: string;
    };
}
interface apiErr {
    error: string;
}
const getBlogs = async function (page: number): Promise<Article[]> {
    try {
        const apiData = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/blog?p=${page}`,
            {
                next: {
                    revalidate: 3600,
                },
            }
        );
        let data = await apiData.json();
        if (data.error) {
            return [];
        }
        return data;
    } catch (error) {
        console.log("getBlogs", error);
    }
    return [];
};

const MoreBlog = () => {
    const [data, setData] = useState<Article[]>([]);
    const [page, setPage] = useState(2);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const loadMoreData = async () => {
        setLoading(true);
        if (!hasMore) return;
        try {
            const moreData = await getBlogs(page);
            if (moreData.length === 0) {
                setHasMore(false);
                return;
            }
            setData((currentData) => [...currentData, ...moreData]);
            setPage((currentPage) => currentPage + 1);
            if (moreData.length < 10) {
                setHasMore(false);
                return;
            }
        } catch {
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    const onScroll = useCallback(async () => {
        if (
            window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
            !loading
        ) {
            await loadMoreData();
        }
    }, [loading, page]); // Dependencies
    useEffect(() => {
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    });
    return data.map((article: Article) => (
        <div key={article.id}>
            <BasicCard
                img={{
                    src: article.banner,
                    alt: article.title,
                    height: 500,
                }}
                content={{
                    title: article.title,
                    text: article.description,
                }}
                redirect={`/blog/${article.slug}`}
                redirectTitle={article.title}
                className="card-blog card-blog-list"
            />
        </div>
    ));
};

export default MoreBlog;
