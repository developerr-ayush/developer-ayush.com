import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/assets/scss/index.scss'
import Header from './Header'
import Footer from './Footer'
import { GoogleTagManager } from '@next/third-parties/google'

const inter = Inter({ subsets: ['latin'] })
import { AOSInit } from './aosinit'
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
        {/* <GoogleTagManager gtmId="G-8FGDC36TL4" /> */}
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
