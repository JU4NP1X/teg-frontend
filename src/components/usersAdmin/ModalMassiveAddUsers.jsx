import { Dialog } from '@mui/material'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import fileDownload from 'js-file-download'
import { DropzoneArea } from 'mui-file-dropzone'
import { useState } from 'react'
import ApiConnection from '../../utils/apiConnection'

const props = [
  'Nombre',
  'Apellido',
  'Email',
  'Compañía',
  'Estatus',
  'Rol',
  'Resultado',
]

const csvData = `nombre;apellido;email;empresa;status;rol
Juan;Herrera;juanherrera@prueba.com;Mayoreo;Activo;Administrador
José;Castro;josecastro@prueba.com;Intelix;Activo;Administrador
`
const ModalMassiveAddUsers = ({
  setVisibleMassiveAddUsers,
  visibleMassiveAddUsers,
}) => {
  const [filesState, setFilesState] = useState([])
  const [userNews, setUserNews] = useState([])
  const [showResult, setShowResult] = useState(false)
  const [disabledLoad, setDisabledLoad] = useState(false)

  const downloadFile = () => {
    fileDownload(csvData, 'subida_masiva_usuarios.csv')
  }

  const loaderData = async () => {
    const Api = ApiConnection()
    const file = filesState[0]
    let formData = new FormData()
    formData.append('users', file)
    const response = await Api.post('users/user-massive-creation', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    if (response.status === 200) {
      setDisabledLoad(true)
    }
    setShowResult(true)
    setUserNews(response)
  }
  const OpenResult = () => {
    return showResult ? (
      <>
        <Dialog open={showResult} maxWidth="lg" scroll="paper">
          <DialogContent>
            {console.log(userNews)}
            <Table>
              <TableHead>
                {props.map((cell) => (
                  <TableCell>{cell}</TableCell>
                ))}
              </TableHead>
              <TableBody>
                {userNews.map((u) => (
                  <>
                    <TableRow>
                      <TableCell>{u.nombre}</TableCell>
                      <TableCell>{u.apellido}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.empresa}</TableCell>
                      <TableCell>{u.status}</TableCell>
                      <TableCell>{u.rol}</TableCell>
                      <TableCell>{u.message}</TableCell>
                    </TableRow>
                  </>
                ))}
              </TableBody>
            </Table>
          </DialogContent>
          <DialogActions>
            <Button
              variant={'contained'}
              className={'btn-cancel'}
              onClick={() => setShowResult(false)}
            >
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </>
    ) : null
  }

  return (
    <>
      <Dialog
        open={visibleMassiveAddUsers}
        scroll={'paper'}
        maxWidth={'sm'}
        sx={{ height: 680 }}
      >
        <DialogTitle id={'alert-dialog-title'}>
          Carga Masiva de Usuarios
        </DialogTitle>
        <DialogContent>
          <DropzoneArea
            acceptedFiles={['text/csv']}
            filesLimit={1}
            onChange={(files) => setFilesState(files)}
            previewGridProps={{ container: { spacing: 1, direction: 'row' } }}
            showPreviewsInDropzone={false}
            dropzoneText={
              filesState.length
                ? 'Archivo subido éxito, presione cargar para iniciar el proceso.'
                : 'Haga click o arrastre el archivo a esta área para cargarlo'
            }
            getFileLimitExceedMessage={() =>
              'Se excedió la cantidad máxima permitida de archivos. Solo se permite 1 archivo '
            }
            getFileAddedMessage={() => 'Archivo agregado con éxito'}
            getFileErrorMessage={() => 'Error al agregar el archivo'}
            getFileRemovedMessage={() => 'Archivo eliminado con éxito'}
            getDropRejectMessage={() =>
              'El archivo fue rechazado. Por favor seleccione un archivo con formato .csv'
            }
            onDelete={() => setFilesState([])}
          />
        </DialogContent>
        <DialogActions sx={{ display: 'flex', flexDirection: 'row' }}>
          <Tooltip title={'Descargar csv de ejemplo'}>
            <Button
              variant={'contained'}
              sx={{ marginRight: 'auto' }}
              className={'btn-secondary'}
              onClick={() => downloadFile()}
            >
              Descargar modelo
            </Button>
          </Tooltip>
          <Button
            variant={'contained'}
            disabled={disabledLoad}
            onClick={() => loaderData()}
          >
            Cargar
          </Button>
          <Button
            variant={'contained'}
            className={'btn-cancel'}
            onClick={() => setVisibleMassiveAddUsers(false)}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
      <OpenResult />
    </>
  )
}

export default ModalMassiveAddUsers
