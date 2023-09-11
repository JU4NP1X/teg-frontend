import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Autocomplete,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  CircularProgress,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import SimpleBar from 'simplebar-react'
import useClassifier from '../../hooks/useClassifier'

const TagsListCard = (save) => {
  const {
    categories,
    setCategories,
    setSearch,
    loadingCategoriesOptions,
    categoriesOptions,
  } = useClassifier()
  const [categoriesList, setCategoriesList] = useState(categories)
  const [open, setOpen] = useState(false)
  const [categoriesExpanded, setCategoriesExpanded] = useState([])
  const [categoriesSelected, setCategoriesSelected] = useState([])

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
                : handleSelected(category)
            }
            sx={{ height: 50 }}
          >
            <ListItemIcon>
              <Checkbox
                edge={'start'}
                checked={categoriesSelected.includes(category.id)}
                tabIndex={-1}
                disableRipple
                onClick={(e) => {
                  e.stopPropagation()
                  handleSelected(category)
                }}
              />
            </ListItemIcon>
            <ListItemText primary={category.translation.name} />
            {category.children && category.children.length > 0 && (
              <ListItemIcon>
                {categoriesExpanded.includes(category.id) ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </ListItemIcon>
            )}
          </ListItemButton>
          <Divider sx={{ ml: 0 }} />
          {category.children && category.children.length > 0 && (
            <List
              sx={{
                pl: 4,
                maxHeight: categoriesExpanded.includes(category.id) ? 1000 : 0,
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
      <CardHeader title={'Categorías'} />
      <CardContent sx={{ height: '100%' }}>
        <div style={{ border: '1px solid #ccc', borderRadius: 4 }}>
          <SimpleBar
            onTouchStart={(e) => {
              e.stopPropagation()
            }}
            style={{ height: 'calc(100vh - 367px)' }}
          >
            <List disablePadding>{renderCategories(categoriesList)}</List>
          </SimpleBar>
        </div>

        <Autocomplete
          id={'asynchronous-demo'}
          open={open}
          onOpen={() => {
            setOpen(true)
          }}
          onClose={() => {
            setOpen(false)
            setSearch('')
          }}
          onChange={() => {
            console.log("hla")
          }}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionLabel={({ name }) => name}
          options={categoriesOptions}
          loading={loadingCategoriesOptions}
          renderInput={(params) => (
            <TextField
              fullWidth
              {...params}
              label={'Buscar categoría faltante'}
              onKeyDown={(event) => {
                setSearch(event.target.value)
              }}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loadingCategoriesOptions ? (
                      <CircularProgress color={'inherit'} size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
        />
      </CardContent>
    </Card>
  )
}

export default TagsListCard
