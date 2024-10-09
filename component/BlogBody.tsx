"use client"
import React, { useEffect } from 'react'
import hljs from 'highlight.js';
import 'highlight.js/styles/stackoverflow-dark.css';
export const BlogBody = ({ content }: any) => {
    useEffect(() => {
        setTimeout(() => {
            hljs.highlightAll();
        }, 100);
    }, [content])
    return (
        <div dangerouslySetInnerHTML={{ __html: content }}></div>
    )
}
