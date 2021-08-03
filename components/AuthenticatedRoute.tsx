import { useAuth } from 'lib/contexts/auth-context'
import { useRouter } from 'next/router'
import * as React from 'react'

function withAuth<T>(Component: React.ComponentType<T>): React.ReactNode {
  function AuthenticatedRoute(props) {
    const router = useRouter()
    const { state: authState } = useAuth()

    React.useEffect(() => {
      checkAuth()
    }, [])

    function checkAuth(): void {
      if (!authState.authenticated) {
        router.push('/great/login')
      }
    }

    return <Component {...props} />
  }

  return AuthenticatedRoute
}

export default withAuth
