import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import HydrationProvider from '@/components/HydrationProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Image Converter - AVIF & WebP',
  description: 'Convert your images to modern AVIF and WebP formats with high quality compression',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <HydrationProvider>
          <div className="min-h-screen bg-background text-foreground">
            {children}
          </div>
        </HydrationProvider>
      </body>
    </html>
  )
}
