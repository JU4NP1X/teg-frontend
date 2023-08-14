import { Alert, Slide, Snackbar } from '@mui/material'
import { createContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const NotificationContext = createContext()
const NotificationProvider = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [errorMessage, setErrorMessage] = useState('')
  const [warningMessage, setWarningMessage] = useState('')
  const [infoMessage, setInfoMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [anchor] = useState({
    vertical: 'top',
    horizontal: 'center',
  })

  const handleCloseError = (event, reason) => {
    setErrorMessage('')
  }

  const handleCloseWarning = (event, reason) => {
    setWarningMessage('')
  }

  const handleCloseInfo = (event, reason) => {
    setInfoMessage('')
  }

  const handleCloseSuccess = (event, reason) => {
    setSuccessMessage('')
  }

  useEffect(() => {
    console.log(searchParams.keys())
    setErrorMessage(searchParams.get('errorMessage') ?? '')
    setWarningMessage(searchParams.get('warningMessage') ?? '')
    setInfoMessage(searchParams.get('infoMessage') ?? '')
    setSuccessMessage(searchParams.get('successMessage') ?? '')
  }, [searchParams])

  return (
    <NotificationContext.Provider
      value={{
        errorMessage,
        setErrorMessage,
        successMessage,
        setSuccessMessage,
        warningMessage,
        setWarningMessage,
        infoMessage,
        setInfoMessage,
      }}
    >
      <Snackbar
        open={errorMessage !== ''}
        autoHideDuration={5000}
        onClose={handleCloseError}
        TransitionComponent={Slide}
        anchorOrigin={anchor}
      >
        <Alert variant={'filled'} severity={'error'} sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={warningMessage !== ''}
        autoHideDuration={5000}
        onClose={handleCloseWarning}
        TransitionComponent={Slide}
        anchorOrigin={anchor}
      >
        <Alert variant={'filled'} severity={'warning'} sx={{ width: '100%' }}>
          {warningMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={infoMessage !== ''}
        autoHideDuration={5000}
        onClose={handleCloseInfo}
        TransitionComponent={Slide}
        anchorOrigin={anchor}
      >
        <Alert variant={'filled'} severity={'info'} sx={{ width: '100%' }}>
          {infoMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={successMessage !== ''}
        autoHideDuration={5000}
        onClose={handleCloseSuccess}
        TransitionComponent={Slide}
        anchorOrigin={anchor}
      >
        <Alert variant={'filled'} severity={'success'} sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      {children}
    </NotificationContext.Provider>
  )
}

export { NotificationProvider }

export default NotificationContext
