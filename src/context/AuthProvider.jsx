import { useState, useEffect, createContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Session from '../utils/session'



const AuthContext = createContext()
const AuthProvider = ({ children }) => {

  const Navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [auth, setAuth] = useState(false)

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