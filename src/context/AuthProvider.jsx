import { useState, useEffect, createContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Session from '../utils/session'



const AuthContext = createContext()
const AuthProvider = ({ children }) => {

  const Navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [auth, setAuth] = useState(false)

  const authenticateUser = async () => {
    const token = Session.token()
    if (!token) {
      setAuth(false)
      setLoading(false)
      Navigate('/')
    }
    else {
      setAuth(true)
      Navigate('/farm')

    }
    setLoading(false)

  }

  useEffect(() => {
    authenticateUser()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        loading,
        auth,
        setAuth,
        setLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export {
  AuthProvider
}

export default AuthContext