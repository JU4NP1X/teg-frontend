import { Button, Card, CardContent, CardHeader } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AuthoritiesTable from '../../components/admin/authorities/AuthoritiesTable'
import AuthorityDialog from '../../components/admin/authorities/AuthorityDialog'
import ConfirmationDialog from '../../components/common/ConfirmationDialog'
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
  const [authority, setAuthority] = useState(authorityTemplate)
  const [authorities, setAuthorities] = useState(authoritiesTemplate)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [loading, setLoading] = useState(true)
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
        },
        signal,
      })
      if (api.status === 200) {
        setAuthorities(data)
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
    try {
      const api = ApiConnection()
      await api.delete(`/categories/authorities/${authorityToDelete.id}/`)
      setAuthorityToDelete(null)
      setOpenConfirmation(false)
      setRefresh(true)
    } catch (error) {
      console.error(error)
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
        <CardHeader title={'Listas de autoridad'} />
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
          <Button
            variant={'contained'}
            color={'primary'}
            onClick={() => setOpenAuthorityModal(true)}
            style={{ marginTop: -70, marginLeft: 4, marginBottom: 0 }}
          >
            Agregar Autoridad
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default Authorities
