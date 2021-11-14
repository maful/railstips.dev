import React from 'react'
import { Provider, Session, User, UserCredentials } from '@supabase/supabase-js'
import { ApiError } from '@supabase/gotrue-js/dist/main/GoTrueApi'
import { useRouter } from 'next/router'
import { basePath } from 'utils/siteConfig'
import { supabase } from 'utils/supabaseClient'

export const SignOut = async (): Promise<void> => {
  await supabase.auth.signOut()
}

export const RequireAuth = (): void => {
  const { user } = useUser()
  const router = useRouter()

  React.useEffect(() => {
    if (!user) {
      router.push('/great/login')
    }
  }, [user, router])
}

export const AuthRedirect = (): void => {
  const { user } = useUser()
  const router = useRouter()

  React.useEffect(() => {
    if (user) {
      router.push('/great/profile')
    }
  }, [user, router])
}

interface SignInReturn {
  session: Session | null
  user: User | null
  provider?: Provider
  url?: string | null
  error: ApiError
}

interface AuthSession {
  user: User | null
  session: Session | null
  signIn: (options: UserCredentials) => Promise<SignInReturn>
  signOut: () => Promise<{ error: ApiError }>
}

export const UserContext = React.createContext<AuthSession>({
  user: null,
  session: null,
  signIn: null,
  signOut: null,
})

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [propName: string]: any
}

export const UserContextProvider = (props: Props): JSX.Element => {
  const [session, setSession] = React.useState<Session | null>(null)
  const [user, setUser] = React.useState<User | null>(null)

  React.useEffect(() => {
    const session = supabase.auth.session()
    setSession(session)
    setUser(session?.user ?? null)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
      }
    )

    return () => {
      authListener?.unsubscribe()
    }
  }, [])

  const value = {
    session,
    user,
    signIn: (options: UserCredentials) =>
      supabase.auth.signIn(options, { redirectTo: basePath }),
    signOut: () => supabase.auth.signOut(),
  }
  return <UserContext.Provider value={value} {...props} />
}

export const useUser = (): AuthSession => {
  const context = React.useContext(UserContext)
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserContextProvider.`)
  }
  return context
}

const AuthUser = (): User => {
  const { user } = useUser()
  return user
}

export default AuthUser
