import { createContext, useEffect, useState } from 'react'
import useNotification from '../hooks/useNotification'
import ApiConnection from '../utils/apiConnection'

const UsersContext = createContext()

const usersTemplate = {
  count: 0,
  next: null,
  previous: null,
  results: [],
}
const userTemplate = {
  title: '',
  summary: '',
  categories: [],
  pdf: '',
  img: '',
}

const UsersProvider = ({ children }) => {
  const { setErrorMessage, setSuccessMessage } = useNotification()
  const [page, setPage] = useState(0)
  const [rows, setRows] = useState(20)
  const [loadingSaveUser, setLoadingSaveUser] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [search, setSearch] = useState('')
  const [isAdmin, setIsAdmin] = useState(-1)
  const [user, setUser] = useState(userTemplate)
  const [users, setUsers] = useState(usersTemplate)

  const getUsersList = async (signal) => {
    setLoadingUsers(true)
    const api = ApiConnection()
    const data = await api.get('/users/list/', {
      params: {
        ordering: 'id',
        limit: 20,
        offset: page * 20,
        search: search,
        isAdmin: isAdmin === -1 ? undefined : isAdmin,
      },
      signal,
    })
    if (api.status < 400) {
      setUsers(data)
      setLoadingUsers(false)
    }
  }

  const getUser = async (user) => {
    const api = ApiConnection()
    const data = await api.get(`/users/list/${user.id}/`)
    if (api.status < 400) {
      setUser(data)
    }
  }

  const deleteUser = async (user) => {
    setLoadingSaveUser(true)
    const api = ApiConnection()
    const data = await api.delete(`/users/list/${user.id}/`)
    if (api.status < 400) {
      setSuccessMessage('Usuario eliminado exitosamente')
      getUsersList()
    } else setErrorMessage('Error al eliminar el usuarioo')
    setLoadingSaveUser(false)
  }

  const saveUser = async () => {
    setLoadingSaveUser(true)
    const api = ApiConnection()
    if (user.id) await api.patch(`/users/list/${user.id}/`, user)
    else await api.post(`/users/list/`, user)

    if (api.status < 400) {
      setSuccessMessage(
        `Usuario ${user.id ? 'modificado' : 'añadido'} exitosamente.`
      )
      setLoadingSaveUser(false)
    } else
      setErrorMessage(`Error al ${user.id ? 'modificar' : 'crear'} el usuario.`)
    setLoadingSaveUser(false)
    setShowModal(false)
  }

  useEffect(() => {
    const controller = new AbortController()
    getUsersList(controller.signal)
    return () => {
      controller.abort()
    }
  }, [page, search, isAdmin, rows])

  useEffect(() => {
    if (!showModal) {
      getUsersList()
      setUser(userTemplate)
    }
  }, [showModal])

  return (
    <UsersContext.Provider
      value={{
        isAdmin,
        setIsAdmin,
        user,
        setUser,
        showModal,
        setShowModal,
        users,
        setUsers,
        loadingUsers,
        setLoadingUsers,
        page,
        setPage,
        getUser,
        setSearch,
        saveUser,
        loadingSaveUser,
        deleteUser,
        rows,
        setRows,
      }}
    >
      {children}
    </UsersContext.Provider>
  )
}

export { UsersProvider }

export default UsersContext
