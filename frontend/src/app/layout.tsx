import { type Metadata } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import clsx from 'clsx'
import {
  HUME_API_KEY,
  HUME_SECRET_KEY,
  NEXT_PUBLIC_SITE_URL,
} from '@/lib/constants'

import { Providers } from '@/app/providers'

import '@/styles/tailwind.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const monaSans = localFont({
  src: '../fonts/Mona-Sans.var.woff2',
  display: 'swap',
  variable: '--font-mona-sans',
  weight: '200 900',
})

export const metadata: Metadata = {
  title: 'Commit - Open-source Git client for macOS minimalists',
  description:
    'Commit is a lightweight Git client you can open from anywhere any time you’re ready to commit your work with a single keyboard shortcut. It’s fast, beautiful, and completely unnecessary.',
  alternates: {
    types: {
      'application/rss+xml': `${NEXT_PUBLIC_SITE_URL}/feed.xml`,
    },
  },
}
import VoiceProvider from '@/components/humeai/VoiceProvider'
import { fetchAccessToken } from '@humeai/voice'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const accessToken = await fetchAccessToken({
    apiKey: String(HUME_API_KEY),
    secretKey: String(HUME_SECRET_KEY),
  })
  return (
    <html
      lang="en"
      className={clsx('h-full antialiased', inter.variable, monaSans.variable)}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-white dark:bg-gray-950">
        <VoiceProvider accessToken={accessToken}>
          <Providers>{children}</Providers>
        </VoiceProvider>
      </body>
    </html>
  )
}
