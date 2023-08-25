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
  'Color',
  'Autoridad',
  'Última Fecha de Entrenamiento',
  'Datos de Entrenamiento Disponibles',
  'Representación de las categorías',
  'Categorías Actualizadas',
  'Categorías Obsoletas',
  'Nuevas Categorías no Entrenadas',
  'Precisión teórica del modelo',
  'Precisión práctica del modelo',
  'Estado',
  'Acciones',
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
}) => {
  return (
    <>
      <TableContainer component={Paper}>
        <SimpleBar style={{ height: 'calc(100vh - 230px)' }}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column}
                    align={column === 'Estado' ? 'center' : 'left'}
                  >
                    {column}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading &&
                authorities.results
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((authority) => (
                    <AuthorityRow
                      key={authority.name}
                      authority={authority}
                      handleDeleteAuthority={handleDeleteAuthority}
                      handleReTrain={handleReTrain}
                      handleUpdateAuthority={handleUpdateAuthority}
                    />
                  ))}

              {loading && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    align="center"
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
        component="div"
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
