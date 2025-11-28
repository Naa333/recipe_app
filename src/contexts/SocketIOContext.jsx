import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import PropTypes from 'prop-types'

const SocketIOContext = createContext(null)

export function SocketIOProvider({ children }) {
  const [socket, setSocket] = useState(null)
  const [notifications, setNotifications] = useState([])

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

    socketInstance.on('post.created', (post) => {
      const notification = {
        id: Date.now(),
        message: `New post: "${post.title}"`,
        post,
        timestamp: new Date(),
      }
      setNotifications((prev) => [notification, ...prev])

      // Auto-remove notification after 5 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== notification.id))
      }, 5000)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [])

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
