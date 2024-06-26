'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { BACKEND_API_URL } from '@/lib/constants'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { promise, z } from 'zod'
import { IconLink } from '@/components/IconLink'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'

import { toast } from '@/components/ui/use-toast'

async function fetchData(dataBody: any) {
  try {
    const response = await fetch(`${BACKEND_API_URL}/check_phone_number`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone_number: `${dataBody}`,
      }),
    })
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    console.log('Fetch Response Data:', data) // Add logging here
    return data
  } catch (error) {
    console.error('Fetch Error:', error)
    return { status: 'error' } // Return an error status in case of a fetch error
  }
}

const FormSchema = z.object({
  pin: z.string().min(10, {
    message: 'Must be 10 digits without the international code',
  }),
})

interface ButtonProps {
  doThis: () => void
  doLive: (status: string) => void
  doUpload: () => void
}

function InputOTPForm({ doThis, doLive, doUpload }: ButtonProps) {
  const [state, setState] = useState('error')
  const [upload, setUpload] = useState('false')
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: '',
    },
  })

  // success, not_found
  useEffect(() => {
    console.log('State Updated:', state)
  }, [state])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
    console.log('Number: ', data.pin)

    // Call the fetchData function to initiate the fetch request
    const fetchedData = await fetchData(data.pin)
    console.log('Fetched Data Status:', fetchedData.status) // Add logging here

    setState(fetchedData.status)
    doLive(fetchedData.status)
    doThis()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Please enter the recipient’s phone number 10 digit phone number
              </FormLabel>
              <FormControl>
                <InputOTP maxLength={10} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                    <InputOTPSlot index={6} />
                    <InputOTPSlot index={7} />
                    <InputOTPSlot index={8} />
                    <InputOTPSlot index={9} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-4 flex space-x-4">
          <Button type="submit">Listen To Call</Button>
          <Button type="submit" onClick={doUpload}>
            Upload Voice Call
          </Button>
        </div>
      </form>
    </Form>
  )
}

function GitHubIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" fill="currentColor" {...props}>
      <path d="" />
    </svg>
  )
}

function XIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
    </svg>
  )
}

interface IntroProps {
  onGetStartedClick: () => void // Define the prop here
  handleLive: (status: string) => void
  handleUpload: () => void
}

export function Intro({
  onGetStartedClick,
  handleLive,
  handleUpload,
}: IntroProps) {
  return (
    <>
      <div>
        <Link href="/">
          <h1 className="mt-14 font-display text-4xl/tight font-bold text-white">
            Scam Scanner
          </h1>
        </Link>
      </div>
      <h1 className="font-display text-4xl/tight font-light text-white">
        <span className="whitespace-nowrap">Spotting Scams, Saving Funds</span>
        <br />
        <span className="text-sky-300">AI-Powered Real-Time Call Scanner</span>
      </h1>
      <p className="text-sm/6 text-gray-300">
        Using Hume AI, we analyze calls in real-time to detect and block
        scammers.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-x-1 gap-y-3 sm:gap-x-2 lg:justify-start">
        <InputOTPForm
          doThis={onGetStartedClick}
          doLive={handleLive}
          doUpload={handleUpload}
        />
        <IconLink
          href="https://github.com/Zalinto/UCB-ScamPreventionAI"
          icon={GitHubIcon}
          className="flex-none self-start"
        >
          GitHub
        </IconLink>
      </div>
    </>
  )
}

export function IntroFooter() {
  return (
    <div className="text-[0.8125rem]/6 text-gray-500">
      <p>{`Brought\u00A0to\u00A0you\u00A0by:`}</p>
      <div className="grid grid-cols-2 gap-x-4">
        <IconLink
          href="https://www.linkedin.com/in/jndechave/"
          icon={XIcon}
          compact
        >
          {'Joshua\u00A0De\u00A0Chavez'}
        </IconLink>
        <IconLink
          href="https://www.linkedin.com/in/shubhamshinde245/"
          icon={XIcon}
          compact
        >
          {'Shubham\u00A0Shinde'}
        </IconLink>
        <IconLink
          href="https://www.linkedin.com/in/sophiechance/"
          icon={XIcon}
          compact
        >
          {'Sophie\u00A0Chance'}
        </IconLink>
        <IconLink
          href="https://www.linkedin.com/in/xavierloeraflores/"
          icon={XIcon}
          compact
        >
          {'Xavier\u00A0Flores'}
        </IconLink>
      </div>
    </div>
  )
}
