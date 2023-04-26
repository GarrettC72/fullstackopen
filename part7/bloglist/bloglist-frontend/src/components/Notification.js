import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector((state) => state.notification)

  if (!notification.message) {
    return null
  }

  const style = {
    color: notification.type === 'error' ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  return (
    <div style={style} className="error">
      {notification.message}
    </div>
  )
}

export default Notification