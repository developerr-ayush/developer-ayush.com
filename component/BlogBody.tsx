"use client"
import React, { useEffect } from 'react'
import hljs from 'highlight.js';
import javascript from 'highlight.js/lib/languages/javascript';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import json from 'highlight.js/lib/languages/json';
import typescript from 'highlight.js/lib/languages/typescript';
import scss from 'highlight.js/lib/languages/scss';
import 'highlight.js/styles/stackoverflow-dark.css';
export const BlogBody = ({ content }: any) => {
    useEffect(() => {
        setTimeout(() => {
            hljs.registerLanguage('javascript', javascript);
            hljs.registerLanguage('bash', bash);
            hljs.registerLanguage('css', css);
            hljs.registerLanguage('json', json);
            hljs.registerLanguage('typescript', typescript);
            hljs.registerLanguage('scss', scss);
            hljs.highlightAll();
        }, 100);
    }, [content])
    return (
        <div dangerouslySetInnerHTML={{ __html: content }}></div>
    )
}
