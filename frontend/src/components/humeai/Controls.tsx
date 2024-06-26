'use client'
import { Button } from '@/components/ui/button'
import { useVoice, VoiceReadyState } from '@humeai/voice-react'
import { useState, useRef } from 'react'
export default function Controls() {
  const { connect, disconnect, readyState } = useVoice()
  const [recordedUrl, setRecordedUrl] = useState('')
  const [downloadUrl, setDownloadUrl] = useState('')
  const mediaStream = useRef<MediaStream | null>(null)
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const chunks = useRef<BlobPart[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStream.current = stream
      mediaRecorder.current = new MediaRecorder(stream)
      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data)
        }
      }
      mediaRecorder.current.onstop = () => {
        const recordedBlob = new Blob(chunks.current, { type: 'audio/mp3' })
        const url = URL.createObjectURL(recordedBlob)
        setRecordedUrl(url)
        setDownloadUrl(url)
        chunks.current = []
      }
      mediaRecorder.current.start()
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop()
    }
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => {
        track.stop()
      })
    }
  }
  if (readyState === VoiceReadyState.OPEN) {
    return (
      <Button
        onClick={() => {
          disconnect()
          stopRecording()
        }}
      >
        End Session
      </Button>
    )
  }

  return (
    <div className="flex h-full grow flex-col justify-between gap-4">
      {recordedUrl != '' ? <audio controls src={recordedUrl} /> : null}
      <Button
        onClick={() => {
          connect()
            .then(() => {
              startRecording()
            })
            .catch(() => {})
        }}
      >
        Start Session
      </Button>
      {downloadUrl && (
        <Button asChild>
          <a href={downloadUrl} download="recording.mp3">
            Download Recording
          </a>
        </Button>
      )}
    </div>
  )
}
