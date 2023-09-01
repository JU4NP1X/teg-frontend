import React, { useContext } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TablePagination,
  Button,
  Card,
  CardHeader,
  CardContent,
} from '@mui/material'
import useClassifier from '../../hooks/useClassifier'
import SimpleBar from 'simplebar-react'
import { Add, Delete, Edit } from '@mui/icons-material'

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
  const { docs, loadingDocs, page, setPage, setDoc, setShowTable } =
    useClassifier()

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
            variant={'outlined'}
            size={'small'}
            color={'primary'}
            onClick={() => {
              setDoc(documentTemplate)
              setShowTable(false)
            }}
          >
            <Add />
          </Button>
        }
      />
      <CardContent>
        <TableContainer component={Paper}>
          <SimpleBar style={{ height: 'calc(100vh - 230px)' }}>
            <Table>
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
                    <TableCell colSpan={6} align={'center'}>
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
                          variant={'outlined'}
                          size={'small'}
                          color={'success'}
                          sx={{ m: 1 }}
                        >
                          <Edit />
                        </Button>
                        <Button
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
          <TablePagination
            component={'div'}
            count={docs.count}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            rowsPerPage={20}
            rowsPerPageOptions={[]}
          />
        </TableContainer>
      </CardContent>
    </Card>
  )
}

export default DocsTable
