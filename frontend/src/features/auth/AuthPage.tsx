import { useState, type FormEvent } from 'react'
import {
  requestPasswordReset,
  signIn,
  signUp,
} from '../../services/auth.service'

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [isResetRequest, setIsResetRequest] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')
    setIsLoading(true)

    const { error } = isResetRequest
      ? await requestPasswordReset(email)
      : isSignUp
        ? await signUp(email, password, fullName)
        : await signIn(email, password)

    setIsLoading(false)

    if (error) {
      setMessage(error.message)
      return
    }

    if (isResetRequest) {
      setMessage('Check your email for a password reset link.')
    } else {
      setMessage(
        isSignUp
          ? 'Account created. Check your email to confirm your address.'
          : 'Signed in successfully.',
      )
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 dark:bg-slate-950">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-slate-900">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#111827] font-display text-xl font-extrabold text-[#A99AFF]">N</span>
          <div>
            <p className="font-display text-lg font-bold text-slate-900 dark:text-white">Nexora</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">One workspace. Infinite possibilities.</p>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {isResetRequest
            ? 'Reset your password'
            : isSignUp
              ? 'Create your account'
              : 'Welcome back'}
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {isResetRequest
            ? 'Enter your email and we will send you a secure reset link.'
            : isSignUp
              ? 'Sign up to start using Nexora.'
              : 'Sign in to continue to Nexora.'}
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {isSignUp && (
            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Full name
              </span>
              <input
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-[#7967FF] focus:ring-2 focus:ring-[#A99AFF]/30 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
              />
            </label>
          )}

          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Email
            </span>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-[#7967FF] focus:ring-2 focus:ring-[#A99AFF]/30 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          {!isResetRequest && (
            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </span>
              <input
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-[#7967FF] focus:ring-2 focus:ring-[#A99AFF]/30 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                type="password"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={8}
                required
              />
            </label>
          )}

          {message && (
            <p className="text-sm text-slate-700 dark:text-slate-300" role="status">
              {message}
            </p>
          )}

          <button
            className="w-full rounded-lg bg-[#7967FF] px-4 py-2.5 font-semibold text-white hover:bg-[#6856E8] disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isLoading}
          >
            {isLoading
              ? 'Please wait…'
              : isResetRequest
                ? 'Send reset link'
                : isSignUp
                  ? 'Create account'
                  : 'Sign in'}
          </button>
        </form>

        <div className="mt-5 flex flex-col gap-3 text-sm font-medium text-[#7967FF] dark:text-[#A99AFF]">
          {!isResetRequest && (
            <button
              className="hover:text-[#6856E8]"
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setMessage('')
              }}
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : 'New to Nexora? Create an account'}
            </button>
          )}
          <button
            className="hover:text-[#6856E8]"
            type="button"
            onClick={() => {
              setIsResetRequest(!isResetRequest)
              setIsSignUp(false)
              setPassword('')
              setMessage('')
            }}
          >
            {isResetRequest ? 'Back to sign in' : 'Forgot password?'}
          </button>
        </div>
      </section>
    </main>
  )
}