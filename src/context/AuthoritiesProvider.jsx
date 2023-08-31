import { createContext, useEffect, useState } from 'react'
import useNotification from '../hooks/useNotification'
import ApiConnection from '../utils/apiConnection'

const authorityTemplate = {
  name: '',
  color: null,
  active: true,
}

const authoritiesTemplate = {
  count: 0,
  next: null,
  previous: null,
  results: [],
}
const AuthoritiesContext = createContext()
const AuthoritiesProvider = ({ children }) => {
  const { setSuccessMessage, setErrorMessage } = useNotification()
  const [authority, setAuthority] = useState(authorityTemplate)
  const [authorities, setAuthorities] = useState(authoritiesTemplate)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [loading, setLoading] = useState(true)
  const [loadingAction, setLoadingAction] = useState(false)
  const [loadingFile, setLoadingFile] = useState(false)
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const [authorityToDelete, setAuthorityToDelete] = useState(null)
  const [openAuthorityModal, setOpenAuthorityModal] = useState(false)
  const [abortController, setAbortController] = useState(null)
  const [refresh, setRefresh] = useState(false)

  const fetchAuthorities = async (signal, isRefresh = false) => {
    if (!isRefresh) setLoading(true)
    try {
      const api = ApiConnection()
      const limit = rowsPerPage
      const offset = page * rowsPerPage
      const data = await api.get(`/categories/authorities/`, {
        params: {
          limit,
          offset,
          ordering: 'id',
        },
        signal,
      })
      if (api.status === 200) {
        if (false && isRefresh)
          setAuthorities({
            ...data,
            results: data.results.map((data, i) => ({
              ...data,
              resume: authorities.results[i].resume,
            })),
          })
        else setAuthorities(data)
        setLoading(false)
      }
      if (isRefresh) setRefresh(false)
    } catch (error) {
      console.error(error)
    }
  }

  const addAuthority = async () => {
    try {
      const api = ApiConnection()
      await api.post('/categories/authorities/', authority)
      if (api.status === 200) {
        setAuthority(authorityTemplate)
        setSuccessMessage('Autoridad actualizada con éxito')
        getPageData(false)
        setOpenAuthorityModal(false)
      } else setErrorMessage('Error al actualizar la autoridad.')
    } catch (error) {
      console.error(error)
    }
  }

  const deleteAuthority = async () => {
    setLoadingAction(true)
    try {
      const api = ApiConnection()
      await api.delete(`/categories/authorities/${authorityToDelete.id}/`)
      setAuthorityToDelete(null)
      setOpenConfirmation(false)
      getPageData(false)
      if (api.status === 200) {
        setSuccessMessage('Autoridad eliminada.')
        setLoadingAction(false)
      } else {
        setErrorMessage('Error al sincronizar los datos de la autoridad.')
        setLoadingAction(false)
      }
    } catch (error) {
      console.error(error)
      setLoadingAction(false)
    }
  }

  const handleSyncAuthority = async (authority) => {
    setLoadingAction(true)
    try {
      const api = ApiConnection()
      await api.post(`/datasets/sync/`, { authorities: [authority.id] })
      if (api.status === 200) {
        setSuccessMessage('Autoridad sincronizando.')
        getPageData(false)
        setLoadingAction(false)
      } else {
        setErrorMessage('Error al sincronizar los datos de la autoridad.')
        setLoadingAction(false)
      }
    } catch (error) {
      console.error(error)
      setLoadingAction(false)
    }
  }

  const handleTrainAuthority = async (authority) => {
    try {
      const api = ApiConnection()
      await api.post(`/datasets/train/`, { authorities: [authority.id] })
      if (api.status === 200) {
        setSuccessMessage('Autoridad sincronizando.')
        getPageData(false)
        setLoadingAction(false)
      } else {
        setErrorMessage('Error al sincronizar los datos de la autoridad.')
        setLoadingAction(false)
      }
    } catch (error) {
      console.error(error)
      setLoadingAction(false)
    }
  }

  const updateAuthority = async () => {
    try {
      const api = ApiConnection()
      await api.patch(`/categories/authorities/${authority.id}/`, authority)
      if (api.status === 200) {
        setSuccessMessage('Autoridad actualizada con éxito')
        getPageData(false)
        setOpenAuthorityModal(false)
      } else setErrorMessage('Error al actualizar la autoridad.')
    } catch (error) {
      console.error(error)
    }
  }

  const getPageData = (isRefresh = false) => {
    const controller = new AbortController()
    setAbortController(controller)
    fetchAuthorities(controller.signal, isRefresh)

    return () => {
      controller.abort()
    }
  }

  useEffect(() => {
    return getPageData(false)
  }, [page, rowsPerPage])

  useEffect(() => {
    if (!loading && refresh) {
      return getPageData(true)
    }
  }, [refresh, loading])

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRefresh(true)
    }, 10000)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  return (
    <AuthoritiesContext.Provider
      value={{
        deleteAuthority,
        addAuthority,
        authority,
        setAuthority,
        refresh,
        setRefresh,
        abortController,
        setAbortController,
        openAuthorityModal,
        setOpenAuthorityModal,
        authorityToDelete,
        setAuthorityToDelete,
        openConfirmation,
        setOpenConfirmation,
        loadingFile,
        setLoadingFile,
        loadingAction,
        setLoadingAction,
        loading,
        setLoading,
        rowsPerPage,
        setRowsPerPage,
        page,
        setPage,
        authorities,
        setAuthorities,
        handleTrainAuthority,
        handleSyncAuthority,
        updateAuthority,
      }}
    >
      {children}
    </AuthoritiesContext.Provider>
  )
}

export { AuthoritiesProvider }

export default AuthoritiesContext
