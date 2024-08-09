import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/assets/scss/index.scss'
import Header from './Header'
import Footer from './Footer'
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'

const inter = Inter({ subsets: ['latin'] })
import { AOSInit } from './aosinit'
import Script from 'next/script'
export const metadata: Metadata = {
  title: 'Ayush Shah',
  description: 'Created using NextJs by Ayush Shah',

}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">

      <body className={`${inter.className} dark-mode`}>
        <Script
          id='jsonld'
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Developer Ayush",
              "url": "https://www.developer-ayush.com/",
            }),
          }}
        />
        <GoogleAnalytics gaId="G-8FGDC36TL4" />
        <GoogleTagManager gtmId="GTM-WVCN3W56" />
        <Header />
        <main>
          <div className="container">
            {children}
          </div>
        </main>
        <Footer />
      </body>
      <AOSInit />
    </html>
  )
}
