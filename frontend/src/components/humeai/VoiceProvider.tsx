import { VoiceProvider } from '@humeai/voice-react'
import { fetchAccessToken } from '@humeai/voice'

export default async function ClientComponent({
  accessToken,
  children,
}: {
  accessToken: string
  children: React.ReactNode
}) {
  // const accessToken2 = await fetchAccessToken({
  //   apiKey: String(process.env.HUME_API_KEY),
  //   secretKey: String(process.env.HUME_SECRET_KEY),
  // })

  return (
    <VoiceProvider
      sessionSettings={{
        systemPrompt:
          'Respond if it sounds like the user is trying to scam. Say "Scam Detected" and describe why. If the user does not sound like they are trying to scam, only say "Safe Conversation" and do not explain why. ',
      }}
      auth={{ type: 'accessToken', value: accessToken }}
    >
      {children}
    </VoiceProvider>
  )
}
