import ClientComponent from '@/components/humeai/ClientComponent'
import { fetchAccessToken } from '@humeai/voice'
import { HUME_API_KEY, HUME_SECRET_KEY } from '@/lib/constants'

export default async function Page() {
  const accessToken = await fetchAccessToken({
    apiKey: String(HUME_API_KEY),
    secretKey: String(HUME_SECRET_KEY),
  })

  if (!accessToken) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Welcome to Hume AI</h1>
      <ClientComponent accessToken={accessToken} />
    </div>
  )
}
