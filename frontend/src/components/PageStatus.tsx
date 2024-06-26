import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { BACKEND_API_URL } from '@/lib/constants'

interface PageProps {
  status: string
  uploadStatus: string
  uploadSummary: (data: string) => void
}

const BeginListen = () => (
  <div>
    <div>
      <Link href="/">
        <h1 className="mt-16 font-display text-4xl/tight font-bold text-white">
          Let&apos;s Begin
        </h1>
      </Link>
    </div>
    <h1 className="font-display text-4xl/tight font-light text-white">
      <span className="text-sky-300">We’ll begin listening to your call</span>
    </h1>
  </div>
)

const Fail = () => (
  <div>
    <h1 className="mt-16 font-display text-4xl/tight font-bold text-white">
      Failed: This number has matched government FTC reports to scammers
    </h1>
  </div>
)

const UploadAudio = () => {
  const [file, setFile] = useState(null)
  const [uploadResult, setUploadResult] = useState('true') // State to hold upload result

  const handleFileChange = (event: any) => {
    const selectedFile = event.target.files[0]
    setFile(selectedFile)
  }

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file to upload')
      return
    }
    try {
      const audioFileUrl =
        'https://valorant-crosshairs.s3.us-west-1.amazonaws.com/UC+Berkeley.mp3'

      const response = await fetch(
        `${BACKEND_API_URL}/post_call_transcript_with_emotion`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: audioFileUrl }),
        },
      )

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      setUploadResult(data.summary) // Set the upload result in state

      console.log('Fetch Response Data:', data)
    } catch (error) {
      console.error('Fetch Error:', error)
    }
  }

  return (
    <div>
      <h1 className="mt-16 font-display text-4xl/tight font-bold text-white">
        Upload Audio
      </h1>
      <div className="mt-4 grid w-full max-w-sm items-center gap-1.5">
        <label htmlFor="audio" className="text-white">
          Pick an mp3 file to upload
        </label>
        <input
          id="audio"
          type="file"
          className="mt-2"
          accept="audio/mpeg"
          onChange={handleFileChange}
        />
        <div className="mt-2 flex space-x-4">
          <Button type="button" onClick={handleUpload}>
            Analyze File
          </Button>
          {/* percentage metric */}
        </div>
      </div>
    </div>
  )
}

export function PageStatus({ status, uploadStatus, uploadSummary }: PageProps) {
  const [currentStatus, setCurrentStatus] = useState<string>(status)
  const [currentUploadStatus, setCurrentUploadStatus] =
    useState<string>(uploadStatus)
  const [summary, setSummary] = useState<string>('') // Initialize summary state
  const [secondData, setSecondData] = useState<any>(null) // State to hold second API response data

  useEffect(() => {
    // Fetch data or update statuses as needed
    // For simplicity, I'm assuming `status` and `uploadStatus` are set correctly elsewhere
    const fetchStatus = async () => {
      setCurrentStatus(status)
      setCurrentUploadStatus(uploadStatus)

      try {
        const audioFileUrl =
          'https://valorant-crosshairs.s3.us-west-1.amazonaws.com/Demo+recording.mp3'
        const response = await fetch(
          `${BACKEND_API_URL}/post_call_transcript_with_emotionq`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: audioFileUrl }),
          },
        )

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        if (response.ok) {
          const data = await response.json()
          uploadSummary(data.summary) // Update summary in Layout
          setSummary(data.summary) // Update local summary state

          console.log('Fetch Response Data:', data)

          const secondResponse = await fetch(
            `${BACKEND_API_URL}/post_scam_likely`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ message: audioFileUrl }),
            },
          )

          if (!secondResponse.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
          }

          const secondData = await secondResponse.json()
          setSecondData(secondData)
          console.log(secondData)
        }
      } catch (error) {
        console.error('Fetch Error:', error)
      }
    }

    fetchStatus()
  }, [status, uploadStatus, uploadSummary])

  // Display different components based on status and uploadStatus
  const display = (status: string, uploadStatus: string) => {
    if (status === 'success') {
      return <Fail />
    } else {
      if (uploadStatus === 'true') {
        return (
          <>
            <UploadAudio />
            {/* Display secondData if available */}
            {secondData && (
              <div className="mt-4 text-white">
                <p>
                  Scam Likelihood: <b>{secondData}</b>%
                </p>
              </div>
            )}
          </>
        )
      } else {
        return <BeginListen />
      }
    }
  }

  return <>{display(currentStatus, currentUploadStatus)}</>
}
