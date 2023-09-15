import { Add, Delete, Edit } from '@mui/icons-material'
import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
} from '@mui/material'
import React, { useState } from 'react'
import SimpleBar from 'simplebar-react'
import useClassifier from '../../hooks/useClassifier'
import Border from '../common/Border'

const titles = [
  { nombre: 'Imagen', align: 'left', width: '20%' },
  { nombre: 'Título', align: 'left', width: '20%' },
  { nombre: 'Resumen', align: 'left', width: '40%' },
  { nombre: 'Autores', align: 'left', width: '10%' },
  { nombre: 'Acciones', align: 'right', width: '10%' },
]

const DocsTable = () => {
  const {
    docs,
    loadingDocs,
    page,
    setPage,
    setDoc,
    setShowTable,
    getDoc,
    setCategories,
    setCategoriesSelected,
  } = useClassifier()
  const [disableButtons, setDisableButtons] = useState(false)
  const getBase64Image = (base64String) => {
    return `data:image/png;base64,${base64String}`
  }

  const isLoading = loadingDocs

  return (
    <Card>
      <CardHeader
        title={'Documentos'}
        action={
          <IconButton
            disabled={disableButtons}
            variant={'outlined'}
            size={'small'}
            color={'primary'}
            onClick={() => {
              setDisableButtons(true)
              setShowTable(false)
              setDisableButtons(false)
            }}
            aria-label="Agregar"
          >
            <Tooltip title="Agregar">
              <Add />
            </Tooltip>
          </IconButton>
        }
      />
      <CardContent style={{ paddingBottom: 0 }}>
        <Border>
          <TableContainer>
            <SimpleBar style={{ height: 'calc(100vh - 230px)' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {titles.map((title, index) => (
                      <TableCell
                        key={index}
                        align={title.align}
                        style={{ width: title.width }}
                      >
                        <b>{title.nombre}</b>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={titles.length}
                        align={'center'}
                        style={{ height: 'calc(100vh - 280px)' }}
                      >
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : (
                    docs.results.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <img
                            src={getBase64Image(item.img)}
                            alt={'Imagen'}
                            style={{
                              maxHeight: 100,
                              width: 'auto',
                              maxWidth: 200,
                              height: 'auto',
                            }}
                          />
                        </TableCell>
                        <TableCell>{item.title}</TableCell>
                        <TableCell>
                          {item.summary.length > 50
                            ? `${item.summary.slice(0, 600)}...`
                            : item.summary}
                        </TableCell>
                        <TableCell>{item.authors}</TableCell>
                        <TableCell align={'right'}>
                          <IconButton
                            disabled={disableButtons}
                            onClick={async () => {
                              setDisableButtons(true)
                              await getDoc(item)
                              setShowTable(false)
                              setDisableButtons(false)
                            }}
                            variant={'outlined'}
                            size={'small'}
                            color={'success'}
                            sx={{ m: 1 }}
                            aria-label={'Editar'}
                          >
                            <Tooltip title={'Editar'}>
                              <Edit />
                            </Tooltip>
                          </IconButton>
                          <IconButton
                            disabled={disableButtons}
                            variant={'outlined'}
                            size={'small'}
                            color={'error'}
                            sx={{ m: 1 }}
                            aria-label="Eliminar"
                          >
                            <Tooltip title="Eliminar">
                              <Delete />
                            </Tooltip>
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </SimpleBar>
          </TableContainer>
        </Border>
        <TablePagination
          component={'div'}
          count={docs.count}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          rowsPerPage={20}
          rowsPerPageOptions={[]}
        />
      </CardContent>
    </Card>
  )
}

export default DocsTable
