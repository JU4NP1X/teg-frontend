import { createContext, useEffect, useState } from 'react'
import useNotification from '../hooks/useNotification'
import ApiConnection from '../utils/apiConnection'

const authorityTemplate = {
  name: '',
  color: null,
  active: false,
  disabled: false,
  autoSync: true,
}

const authoritiesTemplate = {
  count: 0,
  next: null,
  previous: null,
  results: [],
}
const systemInfoTemplate = {
  platform: 'Linux',
  ram: {
    total: 0,
    percent: 0,
  },
  cpu: {
    name: 'x86_64',
    percent: 0,
  },
  gpu: {
    name: 'N/A',
    memoryTotal: 0,
    memoryUsed: 0,
    percent: 0,
  },
}
const AuthoritiesContext = createContext()
const AuthoritiesProvider = ({ children }) => {
  const { setSuccessMessage, setErrorMessage } = useNotification()
  const [authority, setAuthority] = useState(authorityTemplate)
  const [systemInfo, setSystemInfo] = useState(systemInfoTemplate)
  const [refreshSys, setRefreshSys] = useState(false)
  const [authorities, setAuthorities] = useState(authoritiesTemplate)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
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
      if (api.status < 400) {
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

  const getSysInfo = async (signal) => {
    const api = ApiConnection()
    const data = await api.get(`/utils/system-info/`, {
      signal,
    })
    if (api.status < 400) setSystemInfo(data)
    setRefreshSys(false)
  }

  const addAuthority = async () => {
    try {
      const api = ApiConnection()
      const data = await api.post('/categories/authorities/', authority)
      if (api.status < 400) {
        setAuthority(authorityTemplate)
        setSuccessMessage('Autoridad creada con éxito')
        getPageData(false)
        setOpenAuthorityModal(false)
      } else {
        if (data.message) setErrorMessage(data.message)
        else setErrorMessage('Error al crear la autoridad.')
      }
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
      if (api.status < 400) {
        setSuccessMessage('Autoridad eliminada.')
        setLoadingAction(false)
      } else {
        setErrorMessage('Error al eliminar la autoridad.')
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
      if (api.status < 400) {
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
    setLoadingAction(true)
    try {
      const api = ApiConnection()
      await api.post(`/categories/train/`, { authorityId: authority.id })
      if (api.status < 400) {
        setSuccessMessage('Autoridad entrenando.')
        getPageData(false)
        setLoadingAction(false)
      } else {
        setErrorMessage('Error al entrenar la autoridad.')
        setLoadingAction(false)
      }
    } catch (error) {
      console.error(error)
      setLoadingAction(false)
    }
  }

  const updateAuthority = async () => {
    setLoadingAction(true)
    try {
      const api = ApiConnection()
      const data = await api.patch(
        `/categories/authorities/${authority.id}/`,
        authority
      )
      if (api.status < 400) {
        setSuccessMessage('Autoridad actualizada con éxito')
        getPageData(false)
        setOpenAuthorityModal(false)
        setLoadingAction(false)
      } else {
        if (data.message) setErrorMessage(data.message)
        else setErrorMessage('Error al actualizar la autoridad.')
        setLoadingAction(false)
      }
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
  const sysInfoSync = () => {
    const controller = new AbortController()
    setAbortController(controller)
    getSysInfo(controller.signal)

    return () => {
      controller.abort()
    }
  }

  useEffect(() => {
    if (refreshSys) return sysInfoSync()
  }, [refreshSys])

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

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRefreshSys(true)
    }, 10000)
    setRefreshSys(true)
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
        systemInfo,
      }}
    >
      {children}
    </AuthoritiesContext.Provider>
  )
}

export { AuthoritiesProvider }

export default AuthoritiesContext
