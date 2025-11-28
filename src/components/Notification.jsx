import { useSocketIO } from '../contexts/SocketIOContext'
import './Notification.css'

export function Notification() {
  const { notifications, removeNotification } = useSocketIO()

  if (notifications.length === 0) return null

  return (
    <div className='notification-container'>
      {notifications.map((notification) => (
        <div key={notification.id} className='notification'>
          <div className='notification-content'>
            <span className='notification-icon'>🔔</span>
            <span className='notification-message'>{notification.message}</span>
          </div>
          <button
            className='notification-close'
            onClick={() => removeNotification(notification.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
