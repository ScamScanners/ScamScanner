'use client'
import { useId, useState } from 'react'
import { cn } from '@/lib/utils'

import { Intro, IntroFooter } from '@/components/Intro'
import { StarField } from '@/components/StarField'
import { ThemeToggle } from '@/components/ThemeToggle'
import { PageStatus } from './PageStatus'
import HumeApp from '@/components/humeai/HumeApp'
import { SummaryBubble } from './SummaryBubble'

function Glow() {
  let id = useId()

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-gray-950 lg:right-[calc(max(2rem,50%-38rem)+40rem)] lg:min-w-[32rem]">
      <svg
        className="absolute -bottom-48 left-[-40%] h-[80rem] w-[180%] lg:-right-40 lg:bottom-auto lg:left-auto lg:top-[-40%] lg:h-[180%] lg:w-[80rem]"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={`${id}-desktop`} cx="100%">
            <stop offset="0%" stopColor="rgba(56, 189, 248, 0.3)" />
            <stop offset="53.95%" stopColor="rgba(0, 71, 255, 0.09)" />
            <stop offset="100%" stopColor="rgba(10, 14, 23, 0)" />
          </radialGradient>
          <radialGradient id={`${id}-mobile`} cy="100%">
            <stop offset="0%" stopColor="rgba(56, 189, 248, 0.3)" />
            <stop offset="53.95%" stopColor="rgba(0, 71, 255, 0.09)" />
            <stop offset="100%" stopColor="rgba(10, 14, 23, 0)" />
          </radialGradient>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={`url(#${id}-desktop)`}
          className="hidden lg:block"
        />
        <rect
          width="100%"
          height="100%"
          fill={`url(#${id}-mobile)`}
          className="lg:hidden"
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 right-0 h-px bg-white mix-blend-overlay lg:left-auto lg:top-0 lg:h-auto lg:w-px" />
    </div>
  )
}

function FixedSidebar({
  main,
  footer,
}: {
  main: React.ReactNode
  footer: React.ReactNode
}) {
  return (
    <div className="relative flex-none overflow-hidden px-6 lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex lg:px-0">
      <Glow />
      <div className="relative flex w-full lg:pointer-events-auto lg:mr-[calc(max(2rem,50%-38rem)+40rem)] lg:min-w-[32rem] lg:overflow-y-auto lg:overflow-x-hidden lg:pl-[max(4rem,calc(50%-38rem))]">
        <div className="mx-auto max-w-lg lg:mx-0 lg:flex lg:w-96 lg:max-w-none lg:flex-col lg:before:flex-1 lg:before:pt-6">
          <div className="pb-16 pt-20 sm:pb-20 sm:pt-32 lg:py-20">
            <div className="relative">
              <StarField className="-right-44 top-14" />
              {main}
            </div>
          </div>
          <div className="flex flex-1 items-end justify-center pb-4 lg:justify-start lg:pb-6">
            {footer}
          </div>
        </div>
      </div>
    </div>
  )
}

export function Layout({ children }: { children: React.ReactNode }) {
  // const access Token
  const [hideContent, setHideContent] = useState(false)
  const [status, setStatus] = useState('error')
  const [currentUploadStatus, setCurrentUploadStatus] = useState('false')

  const handleGetStartedClick = () => {
    setHideContent(true)
  }

  const handleState = (data: string) => {
    setStatus(data)
  }

  const handleUploadState = () => {
    setCurrentUploadStatus('true')
  }

  const [summary, setSummary] = useState('')

  const handleSummaryState = (data: string) => {
    setSummary(data)
  }

  const parseSpeakerLines = (summary: string): string[] => {
    // Split the summary by lines
    const lines = summary.split('\n')
    // Filter out empty lines and lines that don't start with "Speaker X"
    const speakerLines = lines.filter((line) =>
      line.trim().startsWith('Speaker'),
    )
    return speakerLines
  }

  const parseEmotionsBySpeaker = (
    emotions: string,
  ): Record<string, string[]> => {
    try {
      // Clean up the emotions string (remove single quotes and spaces)
      const cleanedEmotions = emotions.replace(/'/g, '"').replace(/\s+/g, '')
      return JSON.parse(cleanedEmotions)
    } catch (error) {
      console.error('Error parsing emotions:', error)
      return {}
    }
  }

  const DisplaySummary = ({
    summary,
    className = '',
  }: {
    summary: string
    className?: string
  }) => {
    // Split summary into main content and emotions data
    const summaryParts = summary.split('{')
    const mainContent = summaryParts[0].trim() // Summary text before emotions
    const emotionsData = '{' + summaryParts[1] // Emotions data part including '{' for JSON parsing

    // Parse speaker lines
    const speakerLines = parseSpeakerLines(mainContent)

    // Parse emotions by speaker
    const emotionsBySpeaker = parseEmotionsBySpeaker(emotionsData)

    // Render speaker lines and emotions
    return (
      <div className={cn('mt-4 text-white w-96', className)}>
        <div>
          {speakerLines.map((line, index) =>
            line.includes('Speaker 0')  ? (
              <SummaryBubble message={line} left={true} key={index} className="" />
            ) : (
              <SummaryBubble message={line} key={index} className="" />
            )
          )}
        </div>
        <div>{JSON.stringify(emotionsBySpeaker)}</div>
      </div>
    )
  }

  return (
    <div>
      <FixedSidebar
        main={
          hideContent ? (
            <PageStatus
              status={status}
              uploadStatus={currentUploadStatus}
              uploadSummary={handleSummaryState}
            />
          ) : (
            <Intro
              onGetStartedClick={handleGetStartedClick}
              handleLive={handleState}
              handleUpload={handleUploadState}
            />
          )
        }
        footer={<IntroFooter />}
      />
      <ThemeToggle />
      <main className="space-y-20 py-20 sm:space-y-32 sm:py-32">
        {hideContent ? (
          <>
            {currentUploadStatus === 'true' ? (
              <DisplaySummary summary={summary} className="float-right" />
            ) : (
              <HumeApp className="float-right" />
            )}
          </>
        ) : (
          children
        )}
      </main>
    </div>
  )
}
