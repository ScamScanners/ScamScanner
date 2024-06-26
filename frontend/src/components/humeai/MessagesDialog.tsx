'use client'
import { useVoice } from '@humeai/voice-react'
import { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const MessagesDialog = () => {
  const { messages } = useVoice()
  const [seenMessages, setSeenMessages] = useState<{ [key: string]: any }>({})
  useEffect(() => {
    console.log(messages)
    for (const message of messages) {
      if (
        message.type === 'user_message' &&
        message.message &&
        message.message.content != null &&
        seenMessages[message.message.content] == null
      ) {
        const scores = message?.models?.prosody?.scores
        if (!scores) {
          return
        }

        if (
          scores.Anger > 0.8 ||
          scores.Interest > 0.8 ||
          scores.Determination > 0.8 ||
          scores.Calmness < 0.8
        ) {
          openModal()
          console.log('Scam detected')
          console.error('Scam detected')
        }
      } else {
        if (message.type === 'user_message' && message.message) {
          const newSeenMessages = {
            ...seenMessages,
            [message.message.content]: true,
          }
          setSeenMessages(newSeenMessages)
        }
      }
    }
  }, [messages])
  const [modelHasOpened, setModelHasOpened] = useState(false)
  const [modalIsOpen, setIsOpen] = useState(false)

  function openModal() {
    setModelHasOpened(true)
    if (modelHasOpened === false) {
      setIsOpen(true)
    }
  }

  function afterOpenModal() {}

  function closeModal() {
    setIsOpen(false)
  }
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-15vw, 25vh)',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
  }
  return (
    <Modal
      isOpen={modalIsOpen}
      onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      contentLabel="Example Modal"
      className="float-right w-1/3"
      style={customStyles}
    >
      <Card className="flex flex-col justify-around rounded border">
        <CardHeader>
          <h2>Warning</h2>
        </CardHeader>
        <CardContent>
          <div>This call may or may not be a scam</div>
        </CardContent>
        <CardFooter>
          <Button variant="destructive" onClick={closeModal}>
            close
          </Button>
        </CardFooter>
      </Card>
    </Modal>
  )
}

export default MessagesDialog
