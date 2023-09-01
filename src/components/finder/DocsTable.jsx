import { Add, Delete, Edit } from '@mui/icons-material'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
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
import React, { useState } from 'react'
import SimpleBar from 'simplebar-react'
import useClassifier from '../../hooks/useClassifier'

const documentTemplate = {
  title: '',
  summary: '',
  categories: [],
  pdf: '',
  img: '',
}

const titles = [
  { nombre: 'Imagen', align: 'left', width: '20%' },
  { nombre: 'Título', align: 'left', width: '20%' },
  { nombre: 'Resumen', align: 'left', width: '40%' },
  { nombre: 'Autores', align: 'left', width: '10%' },
  { nombre: 'Acciones', align: 'right', width: '10%' },
]

const DocsTable = () => {
  const { docs, loadingDocs, page, setPage, setDoc, setShowTable, getDoc } =
    useClassifier()
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
          <Button
            disabled={disableButtons}
            variant={'outlined'}
            size={'small'}
            color={'primary'}
            onClick={() => {
              setDisableButtons(true)
              setDoc(documentTemplate)
              setShowTable(false)
              setDisableButtons(false)
            }}
          >
            <Add />
          </Button>
        }
      />
      <CardContent style={{ paddingBottom: 0 }}>
        <TableContainer component={Paper}>
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
                          style={{ height: 100, width: 'auto' }}
                        />
                      </TableCell>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>{item.summary}</TableCell>
                      <TableCell>{item.authors}</TableCell>
                      <TableCell align={'right'}>
                        <Button
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
                        >
                          <Edit />
                        </Button>
                        <Button
                          disabled={disableButtons}
                          variant={'outlined'}
                          size={'small'}
                          color={'primary'}
                          sx={{ m: 1 }}
                        >
                          <Delete />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </SimpleBar>
        </TableContainer>
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
