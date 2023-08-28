import { Add } from '@mui/icons-material'
import { Button, Card, CardContent, CardHeader } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AuthoritiesTable from '../../components/admin/authorities/AuthoritiesTable'
import AuthorityDialog from '../../components/admin/authorities/AuthorityDialog'
import ConfirmationDialog from '../../components/common/ConfirmationDialog'
import useNotification from '../../hooks/useNotification'
import ApiConnection from '../../utils/apiConnection'

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

const Authorities = () => {
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
          excludeCounts: isRefresh ? true: undefined,
        },
        signal,
      })
      if (api.status === 200) {
        if (isRefresh)
          setAuthorities(
            {...data, results:data.results.map((data, i) => ({ ...data, resume: authorities.results[i].resume }))}
          )
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
      setAuthority(authorityTemplate)
      setOpenAuthorityModal(false)
      if (refresh !== 'NONE') {
        fetchAuthorities(abortController.signal)
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
      setRefresh(true)
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
        setRefresh(true)
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
      setOpenAuthorityModal(false)
      setRefresh(true)
    } catch (error) {
      console.error(error)
    }
  }

  const handleAddAuthority = () => {
    if (authority.id) {
      updateAuthority()
    } else {
      addAuthority()
    }
  }

  const handleDeleteAuthority = (authority) => {
    setAuthorityToDelete(authority)
    setOpenConfirmation(true)
  }

  const handleConfirmDelete = () => {
    deleteAuthority()
  }

  const handleCancelDelete = () => {
    setAuthorityToDelete(null)
    setOpenConfirmation(false)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleUpdateAuthority = (authority) => {
    setAuthority(authority)
    setOpenAuthorityModal(true)
  }

  const handleReTrain = () => {
    // Implementar lógica para activar/desactivar autoridad
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
    <div>
      <Card sx={{ pb: 0 }}>
        <CardHeader
          title={
            <span
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              Listas de autoridad
              <Button
                variant={'outlined'}
                color={'primary'}
                size={'small'}
                onClick={() => setOpenAuthorityModal(true)}
              >
                <Add />
              </Button>
            </span>
          }
        />
        <CardContent style={{ paddingBottom: 0 }}>
          <AuthoritiesTable
            authorities={authorities}
            page={page}
            rowsPerPage={rowsPerPage}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            handleDeleteAuthority={handleDeleteAuthority}
            handleUpdateAuthority={handleUpdateAuthority}
            handleReTrain={handleReTrain}
            loading={loading}
            loadingAction={loadingAction}
            handleSyncAuthority={handleSyncAuthority}
          />

          <ConfirmationDialog
            cancelButtonText={'Cancelar'}
            confirmButtonText={'Eliminar'}
            title={'Confirmar eliminación'}
            message={'¿Estás seguro de que deseas eliminar esta autoridad?'}
            open={openConfirmation}
            onClose={handleCancelDelete}
            onConfirm={handleConfirmDelete}
          />
          <AuthorityDialog
            open={openAuthorityModal}
            onClose={() => {
              setAuthority({})
              setOpenAuthorityModal(false)
            }}
            onSubmit={handleAddAuthority}
            authority={authority}
            setAuthority={setAuthority}
            setLoadingFile={setLoadingFile}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default Authorities
