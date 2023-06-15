
import { Tooltip, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import ApiConnection from '../../utils/apiConnection'


import useNotification from '../../hooks/useNotification'
import useReports from "../../hooks/useReports";






const Action = ({ data, setData, handleOpenModal, setReportToShow }) => {

  const { getReports } = useReports()

  const { setErrorMessage, setSuccessMessage } = useNotification()


  const handleDeleteReport = async (id) => {


    const deleteReport = confirm("¿Está seguro que desea eliminar el reporte?")

    if (!deleteReport) return

    try {
      const api = ApiConnection()
      await api.delete(`/reports`, { data: { repId: id } });
      if (api.status === 200) {

        setSuccessMessage(api.message ? api.message : 'Reporte eliminado correctamente')
        getReports()


      } else {
        setErrorMessage(api.message)
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='contIcons'>
      <div>
        <Tooltip title='Ver'>
          <IconButton onClick={() => {
            setReportToShow(data)
          }} aria-label='Ver'>
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      </div>
      <div>
        <Tooltip title='Editar'>
          <IconButton
            onClick={() => {
              setData(data)

              handleOpenModal();
            }}
            aria-label='Editar'
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      </div>
      <div>
        <Tooltip title='Eliminar'>
          <IconButton
            onClick={() => handleDeleteReport(data.repId)}
            aria-label='Eliminar'
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

export default Action;
