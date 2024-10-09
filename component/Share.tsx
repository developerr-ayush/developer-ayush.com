"use client"
import React from 'react'
import { FaShare } from 'react-icons/fa'

export const Share = ({ title }: { title: string }) => {
    const [isCopied, setIsCopied] = React.useState(false)
    return (
        <div className="blog-social">
            <button className="social-link" aria-label='share button' onClick={async () => {
                let shareData = {
                    title: title,
                    text: 'Check out this blog',
                    url: window.location.href
                }
                if (navigator.share && navigator.canShare(shareData)) {
                    let data = await navigator.share(shareData)
                }
                else {
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(shareData.url)
                        setIsCopied(true)
                        setTimeout(() => {
                            setIsCopied(false)
                        }, 1000);
                    } else {
                        alert("your browser does not support sharing or copying link")
                    }
                }
            }}>
                {isCopied && <p className="copied">Link copied to clipboard</p>}
                <FaShare size={20} /></button>
        </div>

    )

    return null
}
