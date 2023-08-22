import { createContext, useEffect, useState } from 'react'
import Session from '../utils/session'

const AuthContext = createContext()
const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [auth, setAuth] = useState(false)
  const [user, setUser] = useState(Session.getAll())

  useEffect(() => {
    setAuth(user.token && true)
    if (user.token) Session.set(user)
    else Session.unset(user)
  }, [user])

  return (
    <AuthContext.Provider
      value={{
        loading,
        auth,
        setAuth,
        setLoading,
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider }

export default AuthContext
