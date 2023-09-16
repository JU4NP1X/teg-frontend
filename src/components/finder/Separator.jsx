import { FileCopy } from '@mui/icons-material'
import { FormControl, Grid, IconButton, MenuItem, Tooltip } from '@mui/material'
import React, { useState } from 'react'
import {
  SelectValidator,
  TextValidator,
  ValidatorForm,
} from 'react-material-ui-form-validator'
import useClassifier from '../../hooks/useClassifier'
import useNotification from '../../hooks/useNotification'

function SeparadorInput({ categoriesList }) {
  const { setInfoMessage } = useNotification()
  const { categoriesSelected } = useClassifier()
  const [separador, setSeparador] = useState(',')
  const [separatorText, setSeparadorText] = useState(',')

  const handleSeparadorChange = (event) => {
    setSeparador(event.target.value)
    setSeparadorText(event.target.value !== 'custom' ? event.target.value : '')
  }

  const handleCustomSeparadorChange = (event) => {
    setSeparadorText(event.target.value)
  }

  const copyCategoriesRecursively = (categories) => {
    let copiedCategories = []
    categories.forEach((category) => {
      if (categoriesSelected.includes(category.id)) {
        copiedCategories.push({ ...category })
        if (category.children && category.children.length > 0) {
          copiedCategories = copiedCategories.concat(
            copyCategoriesRecursively(category.children)
          )
        }
      }
    })
    return copiedCategories
  }

  const handleCopyCategories = () => {
    const copiedCategories = copyCategoriesRecursively(categoriesList)
    // Aquí puedes hacer lo que necesites con las categorías copiadas
    const categoryNames = copiedCategories.map((category) =>
      category.translation ? category.translation.name : category.name
    )
    const categoriesString = categoryNames.join(separatorText)
    navigator.clipboard.writeText(categoriesString)
    setInfoMessage('Categorías copiadas al pisapapeles')
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <FormControl
          fullWidth
          style={{ marginTop: 10, display: 'flex', marginBottom: -30 }}
        >
          <ValidatorForm onSubmit={() => {}}>
            <div
              style={{
                display: 'flex',
                width: '100%',
                placeContent: 'space-between',
              }}
            >
              <SelectValidator
                label={'Separador'}
                name={'separador'}
                value={separador}
                onChange={handleSeparadorChange}
                style={{ minWidth: 200 }}
              >
                <MenuItem value={','}>Coma (,)</MenuItem>
                <MenuItem value={';'}>Punto y coma (;)</MenuItem>
                <MenuItem value={'|'}>Barra vertical (|)</MenuItem>
                <MenuItem value={'\t'}>Tabulación</MenuItem>
                <MenuItem value={'\n'}>Salto de línea</MenuItem>
                <MenuItem value={'custom'}>Personalizado</MenuItem>
              </SelectValidator>
              <TextValidator
                label={'Separador personalizado'}
                onChange={handleCustomSeparadorChange}
                disabled={separador !== 'custom'}
                value={separatorText}
              />

              <Tooltip
                title="Copiar todas las categorías seleccionadas"
                sx={{ mt: 2 }}
              >
                <IconButton onClick={handleCopyCategories}>
                  <FileCopy />
                </IconButton>
              </Tooltip>
            </div>
          </ValidatorForm>
        </FormControl>
      </Grid>
    </Grid>
  )
}

export default SeparadorInput
