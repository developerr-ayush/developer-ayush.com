"use client"
import React from 'react'
import { FaShare } from 'react-icons/fa'

export const Share = ({ title }: { title: string }) => {
    let shareData = {
        title: title,
        text: 'Check out this blog',
        url: window.location.href
    }
    return (
        <div className="blog-social">
            <button className="social-link" onClick={async () => {
                if (navigator.share && navigator.canShare(shareData)) {

                    let data = await navigator.share(shareData)
                    alert(data)
                }
                else {
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(shareData.url)
                        alert("hello")
                    }
                }
            }}><FaShare size={20} /></button>
        </div>

    )

    return null
}
