import { createContext, useReducer, useContext } from 'react'

import { useNotify } from './NotificationContext'
import loginService from './services/login'
import storageService from './services/storage'

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'CLEAR':
      return null
    default:
      return state
  }
}

const LoginContext = createContext()

export const LoginContextProvider = (props) => {
  const [user, dispatch] = useReducer(reducer, null)

  return (
    <LoginContext.Provider value={[user, dispatch]}>
      {props.children}
    </LoginContext.Provider>
  )
}

export const useUserValue = () => {
  const [user] = useContext(LoginContext)
  return user
}

export const useUserInitialize = () => {
  const userAndDispatch = useContext(LoginContext)
  const dispatch = userAndDispatch[1]
  return () => {
    const user = storageService.loadUser()
    dispatch({ type: 'SET', payload: user })
  }
}

export const useLogin = () => {
  const userAndDispatch = useContext(LoginContext)
  const dispatch = userAndDispatch[1]
  const notifyWith = useNotify()
  return async (username, password) => {
    try {
      const user = await loginService.login({ username, password })

      storageService.saveUser(user)
      dispatch({ type: 'SET', payload: user })
      notifyWith(`Logged in as ${user.name}`)
    } catch (exception) {
      notifyWith('wrong username or password', 'error')
    }
  }
}

export const useLogout = () => {
  const userAndDispatch = useContext(LoginContext)
  const dispatch = userAndDispatch[1]
  const notifyWith = useNotify()
  return () => {
    storageService.removeUser()
    dispatch({ type: 'CLEAR' })
    notifyWith('logged out')
  }
}

export default LoginContext
