import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
} from '@mui/material'
import React from 'react'
import SimpleBar from 'simplebar-react'
import useAuthorities from '../../../hooks/useAuthorities'
import { isMobile } from '../../../utils/utils'
import Border from '../../common/Border'
import AuthorityRow from './AuthorityRow'

const columns = [
  {
    label: 'Autoridad',
    tooltip: 'Nombre de la autoridad emisora de las categorías',
    align: 'center',
    width: '6%',
  },
  {
    label: 'Última Fecha de Entrenamiento',
    tooltip:
      'Última vez que se entreno el predictor de categorías. Si no existe un entrenamiento, no podras activar el predictor',
    align: 'left',
    width: '4%',
  },
  {
    label: 'Datos de Entrenamiento Disponibles',
    tooltip: 'Datos de entrenamientos recolectados para entrenar el predictor.',
    align: 'center',
    width: '10%',
  },
  {
    label: 'Suficiencia de datos para entrenar',
    tooltip:
      'Muestra la cantidad de categorías con suficientes datos para entrenar el predictor.',
    align: 'center',
    width: '10%',
  },
  {
    label: 'Categorías Actualizadas',
    tooltip: 'Cantidad de categorías que ya están entrenadas en el predictor',
    align: 'center',
    width: '4%',
  },
  {
    label: 'Categorías Obsoletas',
    tooltip:
      'Categorías en desuso que actualmente siguen siendo parte del predictor.',
    align: 'center',
    width: '4%',
  },
  {
    label: 'Nuevas Categorías no Entrenadas',
    tooltip:
      'Cantidad de categorías que aún no han sido entrenadas, se recomienda entrenar si se ve que este número es diferente de 0.',
    align: 'center',
    width: '5%',
  },
  {
    label: 'Precisión teórica del modelo',
    tooltip:
      'Presición obtenida del predictor durante el proceso entrenamiento',
    align: 'center',
    width: '10%',
  },
  {
    label: 'Precisión práctica del modelo',
    tooltip:
      'Precisión lograda por el modelo durante las predicciones de documentos.',
    align: 'center',
    width: '10%',
  },
  {
    label: 'Estado',
    tooltip: 'Estado actual del modelo.',
    align: 'center',
    width: '8%',
  },
  {
    label: 'Acciones',
    tooltip: 'Acciones que se pueden realizar sobre el modelo',
    align: 'center',
    width: '10%',
  },
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
    setAuthority({
      ...authority,
      practicalPrecision: undefined,
      theoreticalPrecision: undefined,
      percentage: undefined,
      pid: undefined,
      numDocumentsClassified: undefined,
      resume: undefined,
      status: undefined,
    })
    setOpenAuthorityModal(true)
  }
  return (
    <>
      <TableContainer>
        <Border>
          <SimpleBar
            style={{
              height: isMobile()
                ? 'calc(100vh - 135px)'
                : 'calc(100vh - 223px)',
            }}
            onTouchStart={(e) => {
              e.stopPropagation()
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <Tooltip title={column.tooltip}>
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
                    </Tooltip>
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
                      style={{ height: 'calc(100vh - 345px)' }}
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
