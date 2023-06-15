import Dialog from '@mui/material/Dialog'
import { TableCell, Tooltip } from '@mui/material/'
import DeleteIcon from '@mui/icons-material/Delete'
import Checkbox from '@mui/material/Checkbox'
import { useState, useEffect, useRef } from 'react'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import ApiConnection from '../../utils/apiConnection'
import MenuItem from '@mui/material/MenuItem'
import useNotification from '../../hooks/useNotification'
import {
  TextValidator,
  SelectValidator,
  ValidatorForm,
} from 'react-material-ui-form-validator'
import Autocomplete from '@mui/material/Autocomplete'
import { red } from '@mui/material/colors'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import '../../styles/reportsAdmin/editReport.css'
import useReports from '../../hooks/useReports'
import { FormControlLabel, Grid, Typography } from '@mui/material'
import Resizer from 'react-image-file-resizer'
import { Divider, Table, TableBody, TableRow } from '@mui/material'
import moment from 'moment'
import imageCompression from 'browser-image-compression'
import SimpleBar from 'simplebar-react'

function EditReport({ handleCloseModal, modal, setModal }) {
  const { listCompanies, report, rolesList, loadingReport, getReports } =
    useReports()
  const { setErrorMessage, setSuccessMessage } = useNotification()
  const [reportToEdit, setReportToEdit] = useState(report)
  const [tagsList, setTagsList] = useState([])
  const [cancelToken, setCancelToken] = useState(null)
  const [loadingTags, setLoadingTags] = useState(false)
  const [loadingImg, setLoadingImg] = useState(false)
  const [searchTag, setSearchTag] = useState('')
  const [categoriesTree, setCategoriesTree] = useState([])
  const [categoriesList, setCategoriesList] = useState([])
  const [imgReport, setImgReport] = useState(null)
  const fileInputRef = useRef(null)
  const icon = <CheckBoxOutlineBlankIcon fontSize='small' />
  const checkedIcon = <CheckBoxIcon fontSize='small' />


  

  const hanldeClick = () => {
    fileInputRef.current.click()
  }
  const hanldeChangerepImg = async (event, type='file') => {
    setLoadingImg(true)
    let file = type==='file'? event.target.files : event

    await fileToBase64(file[0]).then((data) => {
      setReportToEdit((prevData) => {
        return {
          ...prevData,
          repImg: data,
        }
      })
      setImgReport(data)
    })
    setLoadingImg(false)
  }

  const fileToBase64 = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)

    return new Promise((resolve, reject) => {
      try {

        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1000,
          fileType: 'image/png'
        }
        reader.onload = async () => {
          const image = await imageCompression(file, options)
          resolve(blobToBase64(image))
        }
      } catch (error) {
        reject(error)
      }
    })
  }
  function blobToBase64(blob) {
    return new Promise((resolve, _) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.readAsDataURL(blob)
    });
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setReportToEdit((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }
  const handleChangeSubObject = (event, parentName) => {
    const { name, value } = event.target

    setReportToEdit((prevData) => ({
      ...prevData,
      [parentName]: {
        ...prevData[parentName],
        [name]: value,
      },
    }))
  }

  const handleChangeCheck = (event) => {
    const { name, checked } = event.target
    setReportToEdit((prevData) => ({
      ...prevData,
      [name]: checked,
    }))
  }

  const handleChangeMultivalues = (values, name) => {
    setReportToEdit((prevData) => ({
      ...prevData,
      [name]: values,
    }))
  }

  const handleSubmit = async () => {
    const Api = ApiConnection()

    const data = {
      ...reportToEdit,
      ...reportToEdit.url,
      ...reportToEdit.token,
      categories: reportToEdit.categories.map(({ catId }) => catId),
      roles: reportToEdit.roles.map(({ rolId }) => rolId),
      tags: reportToEdit.tags
        .filter(({ tagId }) => typeof tagId !== 'string')
        .map(({ tagId }) => tagId),
      newTags: reportToEdit.tags
        .filter(({ tagId }) => typeof tagId === 'string')
        .map(({ tagName }) => tagName),
    }

    //editar
    if (report.repId) await Api.put('reports', data)
    else {
      await Api.post('reports', data)
    }

    if (Api.status === 200) {
      setModal(false)
      setSuccessMessage(Api.message)

      setReportToEdit(false)
    } else {
      setErrorMessage(Api.message)
    }
    getReports()
  }

  const getTags = async () => {
    const cancel = new AbortController()
    try {
      setLoadingTags(true)
      if (cancelToken)
        cancelToken.abort()
      setCancelToken(cancel)

      const Api = ApiConnection()

      const tags = await Api.get(`/tags`, {
        params: { search: searchTag, rows: 10 },
        signal: cancel.signal
      })

      if (Api.status !== 200) return

      setCancelToken(null)
      let tagsList = tags.filter(
        (tag) =>
          !reportToEdit.tags.some((reportTag) => reportTag.tagId === tag.tagId)
      ).concat(reportToEdit.tags)

      let tagExist = false
      tags.forEach(({ tagName }) => {
        if (tagName === searchTag) tagExist = true
      })



      tagsList = (searchTag && !tagExist ?
        [{ tagId: `new-${searchTag}`, tagName: searchTag }]
        : []
      ).concat(tagsList)

      setTagsList(tagsList)
      setLoadingTags(false)

    } catch (error) {
      console.log(error)
      setLoadingTags(false)
    }
  }

  const handleSearchTags = async (e, newInputValue) =>
    setSearchTag(newInputValue)

  const getCategories = async () => {
    const Api = ApiConnection()

    const categories = await Api.get('/categories')

    setCategoriesTree(categories)
    setCategoriesList(
      categories
        .map((cat) => [cat, cat.childs.map((cat) => [cat, cat.childs])])
        .flat(4)
    )
  }
  const getParentName = (cat) => {
    const parent = categoriesTree.filter(
      (father) => father.catId === cat.catFatherId
    )[0]
    return parent ? parent.catName : ''
  }

  const handledDeleteImg = () => {
    setImgReport(null)
    setReportToEdit((prevData) => {
      return {
        ...prevData,
        repImg: null,
      }
    })
  }

  const validateJSON = (value) => {
    try {
      JSON.parse(value)
    } catch (e) {
      return false
    }
    return true
  }
  useEffect(() => {
    setReportToEdit(report)
    setImgReport(report.repImg)
  }, [report])

  useEffect(() => {
    getCategories()

    document.onpaste = function(event){
      if(modal) {
      const {items} = (event.clipboardData || event.originalEvent.clipboardData)
      let files = []
      for (let index in items) {
        let item = items[index];
        if (item.kind === 'file') {
          files.push(item.getAsFile())
        }
      }
      hanldeChangerepImg(files, 'paste')
    }
    }
  }, [])

  useEffect(() => {
    getTags()
  }, [searchTag])

  useEffect(() => {
    ValidatorForm.addValidationRule('isValidJSON', validateJSON)
  }, [reportToEdit])

  return (
    !loadingReport &&
    reportToEdit &&
    categoriesList.length > 0 && (
      <>
        <Dialog
          open={modal}
          onClose={handleCloseModal}
          fullWidth={true}
          maxWidth='sm'
        >
          <DialogTitle id='alert-dialog-title' className='layout-not-select'>
            <b>{reportToEdit.isNewReport ? 'Crear Reporte' : 'Editar Reporte'}</b>
          </DialogTitle>

          <DialogContent>
            <ValidatorForm
              className='formValidator'
              onSubmit={() => handleSubmit()}
              onError={(errors) => console.log(errors)}
            >
              <SimpleBar style={{ height: '70vh', overflow: 'auto' }} onTouchEnd={(e) => {e.stopPropagation()}}>
                <Grid container>
                  {!reportToEdit.isNewReport ?
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell><b>Creado por</b></TableCell> <TableCell align='right'>{reportToEdit.createdByUser.usrName ? `${reportToEdit.createdByUser.usrName} ${reportToEdit.createdByUser.usrLastName}` : 'N/A'}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><b>Fecha de creación</b></TableCell> <TableCell align='right'>{moment(reportToEdit.repCreatedAt).format('MMMM D YYYY, hh:mm:ss a')}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><b>Actualizado por</b></TableCell> <TableCell align='right'>{reportToEdit.updatedByUser.usrName ? `${reportToEdit.updatedByUser.usrName} ${reportToEdit.updatedByUser.usrLastName}` : 'N/A'}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><b>Fecha de actualización</b></TableCell> <TableCell align='right'>{moment(reportToEdit.repUpdatedAt).format('MMMM D YYYY, hh:mm:ss a')}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table> : <></>}
                </Grid>
                <br />
                {/* repImg */}
                <Divider />
                <Grid container style={{ textAlign: 'center' }}>
                  <Grid item xs={12}>
                    <img
                      src={imgReport ? imgReport : '/img/no-available.jpg'}
                      style={{ width: 'auto', height: 115, marginTop: 8 }}
                    />
                  </Grid>
                </Grid>
                <Divider />
                <br />
                <Grid container style={{ textAlign: 'right' }}>
                  <Grid item xs={12}>
                    <input
                      ref={fileInputRef}
                      type='file'
                      id='fileInput'
                      accept='image/*'
                      onChange={hanldeChangerepImg}
                    />
                    <Button id='btn-ok' onClick={hanldeClick} sx={{ mr: 1 }} disabled={loadingImg}>
                      {loadingImg ? 'Cargando...' : 'Subir Imagen'}
                    </Button>
                    <Tooltip title='Eliminar la imagen previa del reporte'>
                      <Button id='btn-cancel' onClick={handledDeleteImg} disabled={loadingImg}>
                        Eliminar Imagen
                      </Button>
                    </Tooltip>
                  </Grid>
                </Grid>
                <br />
                {/* repName */}
                <TextValidator
                  margin='dense'
                  name='repName'
                  label='Nombre'
                  fullWidth
                  value={reportToEdit.repName}
                  onChange={handleChange}
                  validators={['required']}
                  errorMessages={['Ingrese un Nombre']}
                />
                {/* repDescription */}
                <TextValidator
                  margin='dense'
                  name='repDescription'
                  label='Descripción'
                  fullWidth
                  value={reportToEdit.repDescription}
                  onChange={handleChange}
                  validators={['required']}
                  errorMessages={['Ingrese una repDescription']}
                />

                {/* company */}
                <SelectValidator
                  className='selectValidator'
                  labelId='cmpId'
                  label='Compañía'
                  name='cmpId'
                  value={reportToEdit.cmpId}
                  defaultValue={'Seleccione una compañia'}
                  onChange={handleChange}
                  validators={['required']}
                  errorMessages={['Seleccione una compañia']}
                >
                  {listCompanies.map((val, index) => (
                    <MenuItem key={index} value={val.cmpId}>
                      {val.cmpName}
                    </MenuItem>
                  ))}
                </SelectValidator>

                {/* behavior */}
                <SelectValidator
                  className='selectValidator'
                  labelId='repBehavior'
                  label='Comportamiento'
                  name='repBehavior'
                  value={reportToEdit.repBehavior}
                  defaultValue={'DYNAMIC'}
                  onChange={handleChange}
                  validators={['required']}
                  errorMessages={['Seleccione un comportamiento']}
                >
                  <MenuItem key={'DYNAMIC'} value={'DYNAMIC'}>
                    Din&aacute;mico
                  </MenuItem>
                  <MenuItem key={'STATIC'} value={'STATIC'}>
                    Est&aacute;tico
                  </MenuItem>
                </SelectValidator>

                {/* Categoria */}
                <Autocomplete
                  className='selectValidator'
                  label='Categorias'
                  value={reportToEdit.categories}
                  multiple
                  options={categoriesList}
                  isOptionEqualToValue={(cat, value) =>
                    cat.catId === value.catId
                  }
                  onChange={(event, value) =>
                    handleChangeMultivalues(value, 'categories')
                  }
                  getOptionLabel={(cat) =>
                    `${getParentName(cat)} - ${cat.catName}`
                  }
                  renderOption={(props, option, { selected }) => (
                    <MenuItem
                      name='categories'
                      {...props}
                      key={option.catId}
                      value={option.catId}
                      disabled={!option.catFatherId}
                    >
                      {!option.catFatherId ? null : (
                        <Checkbox
                          sx={{ color: 'rgba(0, 0, 0, 0.40) !important' }}
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                      )}
                      {props.key}
                    </MenuItem>
                  )}
                  renderInput={(params) => (
                    <TextValidator
                      {...params}
                      label='Seleccione una o varias categorías'
                      placeholder='Categorías'
                      validators={
                        reportToEdit.categories.length ? [] : ['required']
                      }
                      errorMessages={['Seleccione al menos una categoría']}
                    />
                  )}
                />

                {/* method */}
                <SelectValidator
                  className='selectValidator'
                  labelId='repType'
                  name='repType'
                  label='Metodo'
                  value={reportToEdit.repType}
                  defaultValue={'Seleccione un metodo'}
                  onChange={handleChange}
                  validators={['required']}
                  errorMessages={['Seleccione un metodo']}
                >
                  <MenuItem value={'URL'}>{'URL'}</MenuItem>
                  <MenuItem value={'TOKEN'}>{'Token'}</MenuItem>
                </SelectValidator>
                {reportToEdit.repType === 'URL' && (
                  <TextValidator
                    margin='dense'
                    name='ruaUrl'
                    label='URL'
                    fullWidth
                    onChange={(event) =>
                      handleChangeSubObject(event, 'url')
                    }
                    validators={['required']}
                    errorMessages={['Ingrese la URL del reporte en PowerBi']}
                    value={reportToEdit.url.ruaUrl}
                  />
                )}
                {reportToEdit.repType === 'TOKEN' && (
                  <>
                    <TextValidator
                      margin='dense'
                      name='rtaReportId'
                      label='Report ID'
                      fullWidth
                      onChange={(event) =>
                        handleChangeSubObject(event, 'token')
                      }
                      validators={['required']}
                      errorMessages={['Ingrese el Id del reporte en PowerBi']}
                      value={reportToEdit.token.rtaReportId}
                    />
                    <TextValidator
                      margin='dense'
                      name='rtaWorkspaceId'
                      label='Workspace ID'
                      fullWidth
                      onChange={(event) =>
                        handleChangeSubObject(event, 'token')
                      }
                      validators={['required']}
                      errorMessages={[
                        'Ingrese el espacio de trabajo del reporte en Power Bi',
                      ]}
                      value={reportToEdit.token.rtaWorkspaceId}
                    />

                    <TextValidator
                      margin='dense'
                      name='rtaJson'
                      label='JSON para dar acceso al reporte'
                      multiline
                      fullWidth
                      onChange={(event) =>
                        handleChangeSubObject(event, 'token')
                      }
                      validators={['required', 'isValidJSON']}
                      errorMessages={['Ingrese el JSON del reporte en PowerBi', 'El JSON no tiene una estructura válida']}
                      value={reportToEdit.token.rtaJson}
                    />
                  </>
                )}


                {/* estatus */}
                <SelectValidator
                  className='selectValidator'
                  labelId='statusLabel'
                  label='Estatus'
                  name='repStatus'
                  value={reportToEdit.repStatus}
                  defaultValue={reportToEdit.repStatus}
                  onChange={handleChange}
                  validators={['required']}
                  errorMessages={['Seleccione un estatus']}
                >
                  <MenuItem value={1}>Activo</MenuItem>
                  <MenuItem value={0}>Inactivo</MenuItem>
                </SelectValidator>
                <Autocomplete
                  value={reportToEdit.roles ? reportToEdit.roles : []}
                  onChange={(event, value) =>
                    handleChangeMultivalues(value, 'roles')
                  }
                  name='roles'
                  multiple
                  id='roles'
                  options={rolesList}
                  disableCloseOnSelect
                  isOptionEqualToValue={(role, value) =>
                    role.rolId === value.rolId
                  }
                  getOptionLabel={(role) => role.rolName}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}
                      name='roles'>
                      <Checkbox
                        sx={{ color: 'rgba(0, 0, 0, 0.40) !important' }}
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {props.key}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextValidator
                      {...params}
                      label='Seleccione uno o varios roles'
                      placeholder='Roles'
                      validators={reportToEdit.roles.length ? [] : ['required']}
                      errorMessages={['Seleccione al menos un rol']}
                    />
                  )}
                />

                {/* Tags */}

                <Autocomplete
                  value={reportToEdit.tags ? reportToEdit.tags : []}
                  sx={{ color: red }}
                  onInputChange={handleSearchTags}
                  onChange={(event, value) =>
                    handleChangeMultivalues(value, 'tags')
                  }
                  multiple
                  id='tags'
                  options={tagsList}
                  disableCloseOnSelect
                  loading={loadingTags}
                  isOptionEqualToValue={(tag, value) =>
                    tag.tagId === value.tagId
                  }
                  getOptionLabel={(tag) => tag.tagName}
                  renderOption={(props, option, { selected }) => {
                    return (
                      <li {...props}>
                        <Checkbox
                          sx={{ color: 'rgba(0, 0, 0, 0.40) !important' }}
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {props.key}
                      </li>
                    )
                  }}
                  renderInput={(params) => {
                    return (
                      <TextField
                        {...params}
                        label='Seleccione uno o varios tags'
                        placeholder='Tags'
                      />
                    )
                  }}
                />

                {/* Tags */}

                <Grid container style={{ textAlign: 'center' }}>
                  <Grid item xs={6}>
                    <FormControlLabel
                      name='repInConstruction'
                      control={
                        <Checkbox

                          sx={{ color: 'rgba(0, 0, 0, 0.40) !important' }}
                          checked={reportToEdit.repInConstruction && true}
                          onChange={handleChangeCheck}
                        />
                      }
                      label='En construcción'
                      labelPlacement='top'
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      sx={{ width: '50% !important' }}
                      name='repInMaintenance'
                      inputProps={{ 'aria-label': 'uncontrolled' }}
                      control={
                        <Checkbox
                          checked={reportToEdit.repInMaintenance && true}
                          onChange={handleChangeCheck}
                          sx={{ color: 'rgba(0, 0, 0, 0.40) !important' }}
                        />
                      }
                      label='En mantenimiento'
                      labelPlacement='top'
                    />
                  </Grid>
                </Grid>
              </SimpleBar>

              <DialogActions>
                <Button id='btn-ok' type='submit'>
                  Guardar
                </Button>
                <Button id='btn-cancel' onClick={handleCloseModal} autoFocus>
                  Cancelar
                </Button>
              </DialogActions>
            </ValidatorForm>
          </DialogContent>
        </Dialog>
      </>
    )
  )
}

export default EditReport
