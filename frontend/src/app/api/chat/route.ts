import { openai, createOpenAI } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { GROQ_API_KEY } from '@/lib/constants'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: GROQ_API_KEY,
})

const model = groq('llama3-8b-8192')
// const model = openai('gpt-4-turbo')

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = await streamText({
    model: model,
    messages,
  })

  return result.toAIStreamResponse()
}
