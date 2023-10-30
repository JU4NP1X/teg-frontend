import {
  CleaningServices,
  Compress,
  FileCopy,
  FilterListOff,
  Save,
} from '@mui/icons-material'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Autocomplete,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import SimpleBar from 'simplebar-react'
import useClassifier from '../../hooks/useClassifier'
import useNotification from '../../hooks/useNotification'
import Border from '../common/Border'
import SeparadorInput from './Separator'

const TagsListCard = (save) => {
  const { setInfoMessage } = useNotification()
  const {
    doc,
    categories,
    setCategories,
    setSearch,
    loadingCategoriesOptions,
    categoriesOptions,
    categoriesSelected,
    setCategoriesSelected,
    setCategoryToAdd,
    loadingCategories,
    saveDocument,
    loadingSaveDocument,
    setShowTable,
    showTable,
  } = useClassifier()
  const [categoriesList, setCategoriesList] = useState(categories)
  const [open, setOpen] = useState(false)
  const [categoriesExpanded, setCategoriesExpanded] = useState([])

  useEffect(() => {
    setCategories(categoriesList)
  }, [save])

  useEffect(() => {
    setCategoriesList([...categories])
  }, [categories])

  const handleExpand = (categoryId) => {
    if (categoriesExpanded.includes(categoryId))
      setCategoriesExpanded(
        categoriesExpanded.filter((id) => id !== categoryId)
      )
    else setCategoriesExpanded([...categoriesExpanded, categoryId])
  }

  const handleSelected = (category) => {
    if (categoriesSelected.includes(category.id)) {
      let newSelectedCategoriesList = categoriesSelected
      if (category.children && category.children.length)
        newSelectedCategoriesList = selectedWithoutChildren(category.children, [
          ...categoriesSelected,
        ])
      setCategoriesSelected(
        newSelectedCategoriesList.filter((id) => id !== category.id)
      )
    } else setCategoriesSelected([...categoriesSelected, category.id])
  }
  const selectedWithoutChildren = (categories, selectedCategories) => {
    categories.forEach(({ id, children }) => {
      if (children && children.length)
        selectedCategories = selectedWithoutChildren(
          children,
          selectedCategories
        )

      selectedCategories = selectedCategories.filter(
        (selectedId) => selectedId !== id
      )
    })
    return selectedCategories
  }
  const checkSelectionTree = (categoriesList) => {
    categoriesList.forEach((category) => {
      if (
        !categoriesSelected.includes(category.id) &&
        category.children &&
        category.children.filter(({ id }) => categoriesSelected.includes(id))
          .length
      )
        setCategoriesSelected([...categoriesSelected, category.id])
      else if (category.children) {
        checkSelectionTree(category.children)
      }
    })
  }

  useEffect(() => {
    checkSelectionTree(categoriesList)
  }, [categoriesSelected])

  const renderCategories = (categories) =>
    categories.map((category) => (
      <>
        <List key={category.id} disablePadding sx={{ width: '100%' }}>
          <ListItemButton
            onClick={() =>
              category.children && category.children.length
                ? handleExpand(category.id)
                : !loadingCategories && handleSelected(category)
            }
            sx={{ height: 50 }}
          >
            <ListItemIcon>
              <Checkbox
                edge={'start'}
                disabled={loadingCategories}
                checked={categoriesSelected.includes(category.id)}
                tabIndex={-1}
                disableRipple
                onClick={(e) => {
                  e.stopPropagation()
                  handleSelected(category)
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary={
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <span
                    className={'dot'}
                    style={{
                      backgroundColor: category.translation.authority.color,
                      marginRight: 10,
                      marginLeft: -20,
                    }}
                  />
                  <div style={{ marginTop: 2 }}>
                    {category.translation
                      ? category.translation.name
                      : category.name}
                    <span style={{ color: 'red' }}>
                      {category.deprecated && ' (Deprecada)'}
                    </span>
                  </div>
                </div>
              }
            />
            <Tooltip title="Copiar nombre">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation()
                  navigator.clipboard.writeText(
                    category.translation
                      ? category.translation.name
                      : category.name
                  )

                  setInfoMessage('Categoría copiada al pisapapeles')
                }}
                size={'small'}
              >
                <FileCopy />
              </IconButton>
            </Tooltip>
            {category.children && category.children.length > 0 && (
              <IconButton sx={{ ml: 'auto' }}>
                {categoriesExpanded.includes(category.id) ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </IconButton>
            )}
          </ListItemButton>
          <Divider sx={{ ml: 0 }} />
          {category.children && category.children.length > 0 && (
            <List
              sx={{
                pl: 4,
                maxHeight: categoriesExpanded.includes(category.id)
                  ? 1000000000000000
                  : 0,
                overflow: 'hidden',
                transition: 'max-height 1s',
              }}
              disablePadding
            >
              {categoriesExpanded.includes(category.id) &&
                renderCategories(category.children)}
            </List>
          )}
        </List>
      </>
    ))

  return (
    <Card sx={{ w: '100%', h: '100%' }}>
      <CardHeader
        title={
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            Categorías del documento
            <div
              style={{
                display: 'flex',
              }}
            >
              <Tooltip title="Comprimir categorías">
                <IconButton
                  onClick={(e) => {
                    setCategoriesExpanded([])
                  }}
                  size={'small'}
                >
                  <Compress />
                </IconButton>
              </Tooltip>
              <Tooltip title="Limpiar categorías no usadas">
                <IconButton
                sx={{ml: 2}}
                  onClick={(e) => {
                    e.stopPropagation()
                    setCategories([
                      ...categoriesList.filter(({ id }) =>
                        categoriesSelected.includes(id)
                      ),
                    ])
                  }}
                  size={'small'}
                >
                  <CleaningServices />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        }
      />
      <CardContent>
        <Border>
          <SimpleBar
            onTouchStart={(e) => {
              e.stopPropagation()
            }}
            style={{ height: 'calc(100vh - 432px)' }}
          >
            <List disablePadding>{renderCategories(categoriesList)}</List>
          </SimpleBar>
        </Border>
        <Typography variant={'h6'} sx={{ fontWeight: 'light', mt: 2 }}>
          Agregar categoría faltante
        </Typography>
        <Autocomplete
          open={open}
          onOpen={() => {
            setOpen(true)
          }}
          onClose={() => {
            setOpen(false)
            setSearch('')
          }}
          onChange={(a, value) => {
            setCategoryToAdd(value)
          }}
          renderOption={(props, { name, authority }) => {
            return (
              <li {...props}>
                <span
                  className={'dot'}
                  style={{ backgroundColor: authority.color, marginTop: -2 }}
                />
                {name}
              </li>
            )
          }}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionLabel={({ name }) => name}
          options={categoriesOptions}
          disabled={loadingCategories}
          loading={loadingCategoriesOptions}
          renderInput={(params) => (
            <TextField
              fullWidth
              {...params}
              label={'Buscar'}
              onChange={(event) => {
                setSearch(event.target.value)
              }}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loadingCategoriesOptions ? (
                      <CircularProgress
                        color={'primary'}
                        size={20}
                        sx={{ mt: -1 }}
                      />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
        />

        <Typography variant={'h6'} sx={{ fontWeight: 'light', mt: 2 }}>
          Copiar cateogrías seleccionadas
        </Typography>

        <SeparadorInput categoriesList={categoriesList} />
      </CardContent>

      <CardActions disableSpacing sx={{ pb: 0 }}>
        <Button
          fullWidth
          variant={'contained'}
          startIcon={<Save />}
          onClick={async () => {
            await saveDocument()
            setShowTable(!showTable)
          }}
          disabled={
            !doc.pdf || categoriesSelected.length === 0 || loadingSaveDocument
          }
        >
          Guardar
          {loadingSaveDocument && (
            <CircularProgress color={'inherit'} size={24} />
          )}
        </Button>
      </CardActions>
    </Card>
  )
}

export default TagsListCard
