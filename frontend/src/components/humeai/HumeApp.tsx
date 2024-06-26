'use client'
import Controls from './Controls'
import Messages from './Messages'
import MessagesDialog from './MessagesDialog'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default function HumeApp({ className = '' }: { className?: string }) {
  return (
    <div className="z-50 float-right flex w-96 flex-col">
      <Card
        className={cn(
          'm-2 flex h-64 w-96 min-w-64 flex-col gap-4 p-4',
          className,
        )}
      >
        <CardContent className="flex flex-col gap-4">
          <Controls />
        </CardContent>
        <MessagesDialog />
      </Card>
      <Messages />
    </div>
  )
}
