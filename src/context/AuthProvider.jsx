import { createContext, useState } from 'react'

const AuthContext = createContext()
const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [auth, setAuth] = useState(false)

  return (
    <AuthContext.Provider
      value={{
        loading,
        auth,
        setAuth,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider }

export default AuthContext
