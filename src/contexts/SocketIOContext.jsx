import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import PropTypes from 'prop-types'
import { jwtDecode } from 'jwt-decode'
import { useAuth } from './AuthContext'

// Socket.IO context for WebSocket and notifications
const SocketIOContext = createContext(null)

// Socket.IO provider - manages WebSocket connection
export function SocketIOProvider({ children }) {
  const [socket, setSocket] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [token] = useAuth()

  useEffect(() => {
    const socketInstance = io(
      import.meta.env.VITE_SOCKET_HOST || 'http://localhost:3000',
    )

    socketInstance.on('connect', () => {
      console.log('Connected to WebSocket server:', socketInstance.id)
    })

    socketInstance.on('connect_error', (err) => {
      console.error('WebSocket connection error:', err)
    })

    // Create notification when new post is created
    socketInstance.on('post.created', (post) => {
      let currentUserId = null
      if (token) {
        try {
          const decoded = jwtDecode(token)
          currentUserId = decoded.sub
        } catch (err) {
          console.error('Error decoding token:', err)
        }
      }

      // Skip notification if current user is the author
      if (currentUserId && post.author === currentUserId) {
        return
      }

      const notification = {
        id: Date.now(),
        message: `New post by: ${post.authorUsername}`,
        post,
        timestamp: new Date(),
      }
      setNotifications((prev) => [notification, ...prev])

      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== notification.id))
      }, 5000)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [token])

  // Remove notification manually
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <SocketIOContext.Provider
      value={{ socket, notifications, removeNotification }}
    >
      {children}
    </SocketIOContext.Provider>
  )
}

SocketIOProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export function useSocketIO() {
  const context = useContext(SocketIOContext)
  if (!context) {
    throw new Error('useSocketIO must be used within a SocketIOProvider')
  }
  return context
}
