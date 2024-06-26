'use client'
import { VoiceProvider } from '@humeai/voice-react'
import Controls from './Controls'
import Messages from './Messages'
import MessagesDialog from './MessagesDialog'
import { Card, CardContent } from '@/components/ui/card'

export default function ClientComponent({
  accessToken,
}: {
  accessToken: string
}) {
  return (
    <VoiceProvider
      sessionSettings={{
        systemPrompt:
          'Respond if it sounds like the user is trying to scam. Say "Scam Detected" and describe why. If the user does not sound like they are trying to scam, only say "Safe Conversation" and do not explain why. ',
      }}
      auth={{ type: 'accessToken', value: accessToken }}
    >
      <Card className="m-2 flex h-64 w-96 min-w-64 flex-col gap-4 p-4">
        <CardContent className="flex flex-col gap-4">
          <Controls />
        </CardContent>
        <MessagesDialog />
      </Card>
      <Messages />
    </VoiceProvider>
  )
}
