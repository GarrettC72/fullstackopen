import { createContext, useReducer, useContext } from 'react'

const reducer = (state, action) => {
  switch (action.type) {
    case 'DISPLAY':
      return action.payload
    case 'CLEAR':
      return { message: null }
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, dispatch] = useReducer(reducer, { message: null })

  return (
    <NotificationContext.Provider value={[notification, dispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  const [notification] = useContext(NotificationContext)
  return notification
}

export const useNotify = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  const dispatch = notificationAndDispatch[1]
  return (message, type = 'info') => {
    dispatch({ type: 'DISPLAY', payload: { message, type } })
    setTimeout(() => {
      dispatch({ type: 'CLEAR' })
    }, 3000)
  }
}

export default NotificationContext
