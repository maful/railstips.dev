import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import { useUser } from 'lib/hooks/authUser'
import Input from 'components/ui/Input'
import Button from 'components/ui/Button'
import LoadingDots from 'components/ui/LoadingDots'

export default function Login(): JSX.Element {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', content: '' })
  const router = useRouter()
  const { user, signIn } = useUser()

  async function handleSignin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const { error } = await signIn({ email })
    if (error) {
      setMessage({ type: 'error', content: error.message })
    }
    setMessage({ type: 'note', content: 'Check your email for the magic link.' })
    setLoading(false)
  }

  useEffect(() => {
    if (user) {
      router.replace('/great/account')
    }
  }, [user])

  if (!user)
    return (
      <div className="flex justify-center height-screen-helper">
        <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-80 ">
          <div className="flex flex-col space-y-4">
            {message.content && (
              <div
                className={`${
                  message.type === 'error' ? 'text-pink' : 'text-green'
                } border ${
                  message.type === 'error' ? 'border-pink' : 'border-green'
                } p-3`}
              >
                {message.content}
              </div>
            )}

            <form onSubmit={handleSignin} className="flex flex-col space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={setEmail}
                required
              />
              <Button
                variant="slim"
                type="submit"
                loading={loading}
                disabled={!email.length}
              >
                Send magic link
              </Button>
            </form>
          </div>
        </div>
      </div>
    )

  return (
    <div className="m-6">
      <LoadingDots />
    </div>
  )
}
