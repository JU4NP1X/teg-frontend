import {
  Button,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
} from '@mui/material'
import React, { useState } from 'react'

const Authorities = () => {
  const [authorities, setAuthorities] = useState([])
  const [newAuthority, setNewAuthority] = useState('')
  const [isClassifierUpdated, setIsClassifierUpdated] = useState(false)

  const handleAddAuthority = () => {
    if (newAuthority.trim() !== '') {
      setAuthorities([...authorities, newAuthority])
      setNewAuthority('')
    }
  }

  const handleDeleteAuthority = (authority) => {
    setAuthorities(authorities.filter((item) => item !== authority))
  }

  const handleToggleAuthority = (authority) => {
    // Implementar lógica para activar/desactivar la autoridad
  }

  const handleClassifierUpdate = () => {
    setIsClassifierUpdated(!isClassifierUpdated)
  }

  return (
    <div>
      <TextField
        label="Nueva autoridad"
        value={newAuthority}
        onChange={(e) => setNewAuthority(e.target.value)}
        variant="outlined"
      />
      <Button variant="contained" onClick={handleAddAuthority}>
        Agregar
      </Button>

      <List>
        {authorities.map((authority) => (
          <ListItem key={authority}>
            <ListItemText primary={authority} />
            <ListItemSecondaryAction>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={false} // Implementar lógica para marcar como activa o desactivada
                    onChange={() => handleToggleAuthority(authority)}
                  />
                }
                label="Activa"
              />
              <Button onClick={() => handleDeleteAuthority(authority)}>
                Eliminar
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <FormControlLabel
        control={
          <Checkbox
            checked={isClassifierUpdated}
            onChange={handleClassifierUpdate}
          />
        }
        label="Clasificador actualizado"
      />
    </div>
  )
}

export default Authorities
