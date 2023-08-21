import {
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
  'Datos de Entrenamiento Utilizados',
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
}) => {
  return (
    <>
      <TableContainer component={Paper}>
        <SimpleBar style={{ height: 'calc(100vh - 230px)' }}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column}>{column}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {authorities
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
            </TableBody>
          </Table>
        </SimpleBar>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={authorities.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  )
}

export default AuthoritiesTable
