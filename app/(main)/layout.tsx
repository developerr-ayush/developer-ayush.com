import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/assets/scss/index.scss'
import Header from './Header'
import Footer from './Footer'

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
