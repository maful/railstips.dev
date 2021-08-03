import * as React from 'react'
import { User } from '@supabase/supabase-js'

interface SigninSuccess {
  type: 'signin';
  user: User;
}

interface SignoutSuccess {
  type: 'signout';
}

type Action = SigninSuccess | SignoutSuccess
type Dispatch = (action: Action) => void
export interface AuthState {
  authenticated: boolean,
  user: User
}
interface AuthProviderProps { children: React.ReactNode }
interface ContextProviderProps {
  state: AuthState;
  dispatch: Dispatch
}

const AuthStateContext = React.createContext<
  ContextProviderProps | undefined
>(undefined)

function authReducer(state: AuthState, action: Action) {
  switch (action.type) {
    case 'signin':
      return {
        ...state,
        authenticated: true,
        user: action.user
      }
    case 'signout':
      return { authenticated: false, user: null }
    default:
      throw new Error(`Unhandled action type`)
  }
}

const initialState: AuthState = {
  authenticated: false,
  user: null
}

function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [state, dispatch] = React.useReducer(authReducer, initialState)
  const value = { state, dispatch }

  return (
    <AuthStateContext.Provider value={value}>
      {children}
    </AuthStateContext.Provider>
  )
}

function useAuth(): ContextProviderProps {
  const context = React.useContext(AuthStateContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider')
  }
  return context
}

export { AuthProvider, useAuth }
