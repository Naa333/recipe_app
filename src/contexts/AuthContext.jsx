import { createContext, useState, useContext } from 'react'
import PropTypes from 'prop-types'

// Authentication context for JWT token management
export const AuthContext = createContext({
  token: null,
  setToken: () => {},
})

// Auth provider for global authentication state
export const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(null)

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  )
}
AuthContextProvider.propTypes = {
  children: PropTypes.element.isRequired,
}

// Hook to access auth state: [token, setToken]
export function useAuth() {
  const { token, setToken } = useContext(AuthContext)
  return [token, setToken]
}
