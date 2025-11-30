import { Outlet } from 'react-router-dom'
import { Notification } from './Notification.jsx'

// Layout wrapper component that includes notifications
export function Layout() {
  return (
    <>
      <Notification />
      <Outlet />
    </>
  )
}
