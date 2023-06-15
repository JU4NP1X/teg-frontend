import { Alert as AlertMui } from "@mui/material";
const Alert = () => {
  return (
    <AlertMui severity='error' >
      ¡Error de conexión!
    </AlertMui>
  );
};

export default Alert;
