import { Alert } from '@mui/material'
import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector((state) => state.notification)

  if (!notification.message) {
    return null
  }

  const severity = notification.type === 'error' ? 'error' : 'success'

  return (
    <Alert className="error" severity={severity}>
      {notification.message}
    </Alert>
  )
}

export default Notification
