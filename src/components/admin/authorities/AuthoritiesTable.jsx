import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material'
import React from 'react'
import SimpleBar from 'simplebar-react'
import useAuthorities from '../../../hooks/useAuthorities'
import Border from '../../common/Border'
import AuthorityRow from './AuthorityRow'

const columns = [
  { label: 'Autoridad', align: 'center', width: '6%' },
  { label: 'Última Fecha de Entrenamiento', align: 'left', width: '4%' },
  {
    label: 'Datos de Entrenamiento Disponibles',
    align: 'center',
    width: '10%',
  },
  {
    label: 'Suficiencia de datos para entrenar',
    align: 'center',
    width: '10%',
  },
  { label: 'Categorías Actualizadas', align: 'center', width: '4%' },
  { label: 'Categorías Obsoletas', align: 'center', width: '4%' },
  { label: 'Nuevas Categorías no Entrenadas', align: 'center', width: '5%' },
  { label: 'Precisión teórica del modelo', align: 'center', width: '10%' },
  { label: 'Precisión práctica del modelo', align: 'center', width: '10%' },
  { label: 'Estado', align: 'center', width: '8%' },
  { label: 'Acciones', align: 'center', width: '10%' },
]

const AuthoritiesTable = ({}) => {
  const {
    setAuthority,
    setOpenAuthorityModal,
    setAuthorityToDelete,
    setOpenConfirmation,
    loadingAction,
    loading,
    rowsPerPage,
    setRowsPerPage,
    page,
    setPage,
    authorities,
    handleTrainAuthority,
    handleSyncAuthority,
  } = useAuthorities()

  const handleDeleteAuthority = (authority) => {
    setAuthorityToDelete(authority)
    setOpenConfirmation(true)
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
  return (
    <>
      <TableContainer>
        <Border>
          <SimpleBar
            style={{ height: 'calc(100vh - 230px)' }}
            onTouchStart={(e) => {
              e.stopPropagation()
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.label}
                      align={column.align}
                      style={{
                        fontWeight: 'bold',
                        textAlign: column.align,
                        width: column.width,
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {!loading ? (
                  authorities.results
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((authority) => (
                      <AuthorityRow
                        key={authority.name}
                        authority={authority}
                        handleDeleteAuthority={handleDeleteAuthority}
                        handleUpdateAuthority={handleUpdateAuthority}
                        handleSyncAuthority={handleSyncAuthority}
                        handleTrainAuthority={handleTrainAuthority}
                        loadingAction={loadingAction}
                      />
                    ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      align={'center'}
                      style={{ height: 'calc(100vh - 357px)' }}
                    >
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </SimpleBar>
        </Border>
      </TableContainer>
      <TablePagination
        component={'div'}
        rowsPerPageOptions={[rowsPerPage]}
        count={authorities.count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  )
}

export default AuthoritiesTable
