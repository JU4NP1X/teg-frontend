
import { Tooltip, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReplayIcon from "@mui/icons-material/Replay";
import ApiConnection from '../../utils/apiConnection'


import useNotification from '../../hooks/useNotification'
import useRoles from "../../hooks/useRoles";






const Action = ({ data, setData, handleOpenModal }) => {

  const { getRoles } = useRoles()

  const { setErrorMessage, setSuccessMessage } = useNotification()

  const handleDeleteRole = async (rolId) => {
    const api = ApiConnection()
    const deleteRole = confirm("¿Está seguro que desea eliminar el rol?")

    if (!deleteRole) return

    try {
      await api.delete(`/roles`, { data: { rolId } });
      if (api.status === 200) {

        setSuccessMessage(api.message ? api.message : 'Rol eliminado correctamente')
        getRoles()


      } else {
        setErrorMessage(api.message)
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='contIcons' >
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
            onClick={() => handleDeleteRole(data.rolId)}
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
