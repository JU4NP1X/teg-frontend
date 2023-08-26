import {
  Button,
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
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{cancelButtonText}</Button>
        <Button onClick={onConfirm} variant={'contained'} color={'error'}>
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationDialog
