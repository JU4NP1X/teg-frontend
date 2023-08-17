import {
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
  'Autoridad',
  'Última Fecha de Entrenamiento',
  'Datos de Entrenamiento Utilizados',
  'Representación de las categorías',
  'Categorías Actualizadas',
  'Categorías Obsoletas',
  'Nuevas Categorías no Entrenadas',
  'Precisión teórica del modelo',
  'Precisión práctica del modelo',
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
}) => {
  return (
    <div className="table-container">
      <TableContainer>
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
    </div>
  )
}

export default AuthoritiesTable
