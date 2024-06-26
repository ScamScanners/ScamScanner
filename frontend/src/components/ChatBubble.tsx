import { cn } from '@/lib/utils'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import {
  Card,
  CardHeader,
  CardFooter,
  CardContent,
  CardTitle,
} from '@/components/ui/card'
type ChatMessageProps = {
  message: ChatMessage
  scores?: any
}
type ChatMessage = {
  id: string
  role: string
  content: string
}

export const ChatBubble: React.FC<
  ChatMessageProps & { className?: string }
> = ({ message, className = '', scores }) => {
  const getTopFivePairs = (obj: Record<string, number>): [string, number][] => {
    const pairs = Object.entries(obj)
    pairs.sort((a, b) => b[1] - a[1])
    return pairs.slice(0, 5)
  }
  let bestScores: any[] = []
  if (scores) {
    bestScores = getTopFivePairs(scores)
  }
  return (
    <HoverCard>
      <HoverCardTrigger>
        <div
          className={cn(
            'm-4 flex',
            message.role == 'user' ? 'justify-end' : '',
            className,
          )}
        >
          <div
            className={cn(
              'w-fit whitespace-pre-wrap p-2',
              message.role == 'user' ? 'bg-muted rounded-lg text-right' : '',
              message.content.includes('Scam Detected')
                ? 'bg-destructive rounded-lg text-right'
                : '',
            )}
          >
            <b>{message.role === 'user' ? 'User: ' : 'AI: '}</b>
            {message.content}
          </div>
        </div>
      </HoverCardTrigger>
      {scores != null ? (
        <HoverCardContent>
          <Card>
            <CardHeader>
              <CardTitle>Emotional Scores</CardTitle>
            </CardHeader>
            <CardContent>
              {bestScores.map((score, idx) => {
                return (
                  <div key={idx}>
                    {' '}
                    {score[0]} {Math.round(score[1] * 100)}%
                  </div>
                )
              })}
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
        </HoverCardContent>
      ) : null}
    </HoverCard>
  )
}
