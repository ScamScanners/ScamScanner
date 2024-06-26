'use client'
import { useVoice } from '@humeai/voice-react'
import { useEffect } from 'react'
import { ChatBubble } from '../ChatBubble'
export default function Messages() {
  const { messages, mute, unmute } = useVoice()
  useEffect(() => {
    console.log(messages)
  }, [messages])
  return (
    <div>
      {messages.map((msg, index) => {
        if (msg.type === 'user_message' && msg.message) {
          const message = {
            id: String(index),
            role: 'user',
            content: msg.message.content as string,
          }
          if (msg.type === 'user_message' && 'message' in msg) {
            const scores = msg?.models?.prosody?.scores

            return (
              <ChatBubble
                key={msg.type + index}
                message={message}
                scores={scores}
              />
            )
          }

          return null
        } else if (
          msg.type === 'assistant_message' &&
          msg.message &&
          !msg.message.content.includes('Safe Conversation')
        ) {
          unmute()
          const message = {
            id: String(index),
            role: 'ai',
            content: msg.message.content as string,
          }
          if (msg.type === 'assistant_message' && 'message' in msg) {
            const scores = msg?.models?.prosody?.scores

            return (
              <ChatBubble
                key={msg.type + index}
                message={message}
                scores={scores}
              />
            )
          }

          return null
        } else if (
          msg.type === 'assistant_message' &&
          msg.message &&
          !msg.message.content.includes('Safe Conversation')
        ) {
          mute()
        }
      })}
    </div>
  )
}
