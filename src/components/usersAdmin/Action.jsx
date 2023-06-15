
import { Tooltip, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReplayIcon from "@mui/icons-material/Replay";
import ApiConnection from '../../utils/apiConnection'


import useNotification from '../../hooks/useNotification'
import useUsers from "../../hooks/useUsers";






const Action = ({ data, setData, handleOpenModal }) => {

  const { getUsers } = useUsers()

  const { setErrorMessage, setSuccessMessage } = useNotification()


  const handleResetPassword = async (usrId) => {
    const api = ApiConnection()
    const resetPasword = confirm("¿Está seguro que desea restabler la contraseña del usuario?")
    if (!resetPasword) return

    await api.put('users/reset-password', { usrId })
    if (api.status === 200) {
      setSuccessMessage(api.message ? api.message : 'Usuario restablecido correctamente')
    } else
      setErrorMessage(api.message)
  }
  const handleDeleteUser = async (usrId) => {
    const api = ApiConnection()
    const deleteUser = confirm("¿Está seguro que desea eliminar el usuario?")

    if (!deleteUser) return

    try {
      await api.delete(`/users`, { data: { usrId } });
      if (api.status === 200) {

        setSuccessMessage(api.message ? api.message : 'Usuario eliminado correctamente')
        getUsers()


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
        <Tooltip title='Reestablecer Contraseña'>
          <IconButton
            onClick={() => handleResetPassword(data.usrId)}
            aria-label='Eliminar'
          >
            <ReplayIcon />
          </IconButton>
        </Tooltip>
      </div>
      <div>
        <Tooltip title='Eliminar'>
          <IconButton
            onClick={() => handleDeleteUser(data.usrId)}
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
