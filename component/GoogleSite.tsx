'use client'
import React from 'react'

export const GoogleSite = () => {
    return (
        <script type="application/ld+json" dangerouslySetInnerHTML={{
            __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "Developer Ayush",
                "url": "https://developer-ayush.com/",
                "alternateName": ["Ayush Shah", "Ayush", "Developer Ayush", "DA"],
            })
        }}>

        </script>
    )
}
