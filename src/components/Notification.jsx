import { useSocketIO } from '../contexts/SocketIOContext'
import slug from 'slug'
import './Notification.css'

// Notification component to display real-time notifications
export function Notification() {
  // Get notifications array and removal function from Socket.IO context
  const { notifications, removeNotification } = useSocketIO()

  // Don't render anything if no notifications
  if (notifications.length === 0) return null

 
  const handleNotificationClick = (notification) => {
    // Remove notification from display
    removeNotification(notification.id)
    
    // Build URL: /posts/[postId]/[post-title-slug]
    const postId = notification.post.id
    const postSlug = slug(notification.post.title)
    
    // Navigate to the post
    window.location.href = `/posts/${postId}/${postSlug}`
  }

  return (
    <div className='notification-container'>
      {/* Render each notification as a popup */}
      {notifications.map((notification) => (
        <div key={notification.id} className='notification'>
          {/* Clickable notification body - navigates to post */}
          <button
            className='notification-link'
            onClick={() => handleNotificationClick(notification)}
            style={{
              cursor: 'pointer', 
              border: 'none', 
              background: 'none', 
              padding: 0, 
              width: '100%', 
              textAlign: 'left' 
            }}
          >
            <div className='notification-content'>
              {/* Bell icon */}
              <span className='notification-icon'>🔔</span>
              {/* Notification message: "New post: [title]" */}
              <span className='notification-message'>{notification.message}</span>
            </div>
          </button>
          
          {/* Close button (X) - dismisses notification */}
          <button
            className='notification-close'
            onClick={(e) => {
              e.preventDefault()
              removeNotification(notification.id)
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
