import { Add, Delete, Edit } from '@mui/icons-material'
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  IconButton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
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
    deleteDoc,
    setShowTable,
    getDoc,
    searchDocument,
    setSearchDocument,
    authoritiesListFilter,
    setAuthorityFilter,
    authorityFilter,
    loadingAuthorities,
    loadingCategoriesOptions,
    categoriesListFilter,
    categoryFilter,
    setCategoryFilter,
    setSearchCategoryFilter,
    setOnlyCategoriesDeprecad,
    onlyCategoriesDeprecad,
  } = useClassifier()
  const [disableButtons, setDisableButtons] = useState(false)
  const getBase64Image = (base64String) => {
    return `data:image/png;base64,${base64String}`
  }

  const isLoading = loadingDocs

  return (
    <Card>
      <CardHeader
        title={
          <div style={{ display: 'flex' }}>
            Documentos
            <Box sx={{ display: { lg: 'none', xl: 'flex' }, width: '100%' }}>
              <FormGroup sx={{ ml: 'auto' }}>
                <FormControlLabel
                  control={
                    <Switch
                      value={onlyCategoriesDeprecad}
                      onChange={(e, val) => {
                        setOnlyCategoriesDeprecad(val)
                      }}
                    />
                  }
                  labelPlacement={'top'}
                  label={'Solo deprecados'}
                />
              </FormGroup>
              <Autocomplete
                sx={{ ml: 2 }}
                getOptionLabel={({ name }) => name}
                renderOption={(props, { name, color }) => {
                  return (
                    <li {...props}>
                      <span
                        className={'dot'}
                        style={{ backgroundColor: color, marginTop: -2 }}
                      />
                      {name}
                    </li>
                  )
                }}
                options={authoritiesListFilter}
                value={authorityFilter}
                loading={loadingAuthorities}
                onChange={(event, value) => {
                  setAuthorityFilter(value)
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={'Lista de autoridad'}
                    validators={['required']}
                    errorMessages={['Este campo es requerido']}
                    sx={{ ml: 'auto', minWidth: 200 }}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingAuthorities ? (
                            <CircularProgress
                              color={'inherit'}
                              size={24}
                              sx={{ mt: '-10px' }}
                            />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                    value={authorityFilter ? authorityFilter.name : ''} // Mostrar solo el nombre del valor seleccionado
                  />
                )}
              />
              <Autocomplete
                sx={{ mx: 2 }}
                getOptionLabel={({ name }) => name}
                renderOption={(props, { name, authority }) => {
                  return (
                    <li {...props}>
                      <span
                        className={'dot'}
                        style={{
                          backgroundColor: authority.color,
                          marginTop: -2,
                        }}
                      />
                      {name}
                    </li>
                  )
                }}
                options={categoriesListFilter}
                value={categoryFilter}
                loading={loadingCategoriesOptions}
                onChange={(event, value) => {
                  setCategoryFilter(value)
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={'Categorías'}
                    validators={['required']}
                    errorMessages={['Este campo es requerido']}
                    sx={{ minWidth: 300 }}
                    onChange={(event, value) => {
                      setSearchCategoryFilter(event.target.value)
                    }}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingCategoriesOptions ? (
                            <CircularProgress
                              color={'inherit'}
                              size={24}
                              sx={{ mt: '-10px' }}
                            />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                    value={authorityFilter ? authorityFilter.name : ''} // Mostrar solo el nombre del valor seleccionado
                  />
                )}
              />
              <TextField
                sx={{ mr: 'auto', minWidth: 350 }}
                label={'Buscar'}
                variant={'outlined'}
                value={searchDocument}
                onChange={(e) => setSearchDocument(e.target.value)}
              />
            </Box>
          </div>
        }
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
            <SimpleBar
              onTouchStart={(e) => {
                e.stopPropagation()
              }}
              style={{ height: 'calc(100vh - 230px)' }}
            >
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
                            onClick={async () => {
                              setDisableButtons(true)
                              await deleteDoc(item)
                              setDisableButtons(false)
                            }}
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
