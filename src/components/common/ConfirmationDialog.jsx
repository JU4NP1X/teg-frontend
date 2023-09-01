import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import React from 'react'

const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  cancelButtonText,
  confirmButtonText,
  loadingEdition,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loadingEdition}>
          {cancelButtonText}
        </Button>
        <Button
          onClick={onConfirm}
          variant={'contained'}
          color={'error'}
          disabled={loadingEdition}
        >
          {loadingEdition ? <CircularProgress size={20} /> : confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationDialog
