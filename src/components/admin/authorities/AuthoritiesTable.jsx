import {
  CircularProgress,
  Paper,
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
import AuthorityRow from './AuthorityRow'

const columns = [
  { label: 'Color', align: 'center' },
  { label: 'Autoridad', align: 'center' },
  { label: 'Última Fecha de Entrenamiento', align: 'left' },
  { label: 'Datos de Entrenamiento Disponibles', align: 'center' },
  { label: 'Suficiencia de datos para entrenar', align: 'center' },
  { label: 'Categorías Actualizadas', align: 'center' },
  { label: 'Categorías Obsoletas', align: 'center' },
  { label: 'Nuevas Categorías no Entrenadas', align: 'center' },
  { label: 'Precisión teórica del modelo', align: 'center' },
  { label: 'Precisión práctica del modelo', align: 'center' },
  { label: 'Estado', align: 'center' },
  { label: 'Acciones', align: 'center' },
]

const AuthoritiesTable = ({
  authorities,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  handleDeleteAuthority,
  handleReTrain,
  handleUpdateAuthority,
  loading,
  handleSyncAuthority,
  loadingAction,
}) => {
  return (
    <>
      <TableContainer component={Paper}>
        <SimpleBar
          style={{ height: 'calc(100vh - 230px)' }}
          onTouchStart={(e) => {
            e.stopPropagation()
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.label}
                    align={column.align}
                    style={{ fontWeight: 'bold', textAlign: column.align }}
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
                      handleReTrain={handleReTrain}
                      handleUpdateAuthority={handleUpdateAuthority}
                      handleSyncAuthority={handleSyncAuthority}
                      loadingAction={loadingAction}
                    />
                  ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    align={'center'}
                    style={{ height: 'calc(100vh - 310px)' }}
                  >
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </SimpleBar>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component={'div'}
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
