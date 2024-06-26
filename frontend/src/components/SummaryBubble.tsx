import { cn } from '@/lib/utils'

type ChatMessageProps = {
  message: string
  left?: boolean
}

export const SummaryBubble: React.FC<
  ChatMessageProps & { className?: string }
> = ({ message, className = '', left = false }) => {
  return (
    <div className={cn('mr-4 flex p-2', !left ? 'justify-end' : '', className)}>
      <div
        className={cn(
          'bg-muted w-fit whitespace-pre-wrap rounded-lg p-2',
          left ? 'text-left' : 'text-right',
        )}
      >
        {message}
      </div>
    </div>
  )
}
