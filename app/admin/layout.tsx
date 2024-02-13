
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/assets/scss/index.scss'

const inter = Inter({ subsets: ['latin'] })
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
                <main>
                    <div className="container">
                        {children}
                    </div>
                </main>
            </body>
        </html>
    )
}