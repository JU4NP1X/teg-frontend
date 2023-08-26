import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import React from 'react'
import SimpleBar from 'simplebar-react'
import useClassifier from '../../hooks/useClassifier'

const TagsListCard = () => {
  const { categories, setCategories } = useClassifier()

  const handleToggle = (
    categoryId,
    checked,
    categoriesBranch = [],
    root = true
  ) => {
    if (!categoriesBranch.length) categoriesBranch = [...categories]

    const categoriesUpdated = categoriesBranch.map((category) => {
      if (category.id === categoryId) category.selected = checked

      if (category.child && category.child.length > 0) {
        category.child = handleToggle(
          categoryId,
          checked,
          category.child,
          false
        )
        if (!category.selected && checked)
          category.selected = category.child.some((child) => child.selected)
        if (!category.selected && !checked)
          category.child = category.child.map((child) => {
            child.selected = false
            return child
          })
        category.child = handleToggle(
          categoryId,
          checked,
          category.child,
          false
        )
      }
      return category
    })

    if (!root) return categoriesUpdated

    setCategories(categoriesUpdated)
  }

  const handleExpand = (categoryId) => {
    setCategories((prevCategories) => {
      const updatedCategories = prevCategories.map((category) => {
        if (category.id === categoryId) {
          category.expanded = !category.expanded
        } else if (
          category.child &&
          category.child.some((child) => child.id === categoryId)
        ) {
          category.child = category.child.map((child) => {
            if (child.id === categoryId) {
              child.expanded = !child.expanded
            }
            return child
          })
        }
        return category
      })

      return [...updatedCategories]
    })
  }

  const renderCategories = (categories) =>
    categories.map((category) => (
      <>
        <List key={category.id} disablePadding sx={{ width: '100%' }}>
          <ListItemButton
            onClick={() =>
              category.child && category.child.length
                ? handleExpand(category.id)
                : handleToggle(category.id, !category.selected)
            }
            sx={{ height: 50 }}
          >
            <ListItemIcon>
              <Checkbox
                edge={'start'}
                checked={category.selected}
                tabIndex={-1}
                disableRipple
                onClick={(e) => {
                  e.stopPropagation()
                  handleToggle(category.id, !category.selected)
                }}
              />
            </ListItemIcon>
            <ListItemText primary={category.name} />
            {category.child && category.child.length > 0 && (
              <ListItemIcon>
                {category.expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItemIcon>
            )}
          </ListItemButton>
          <Divider sx={{ ml: 0 }} />
          {category.child && category.child.length > 0 && (
            <List
              sx={{
                pl: 4,
                maxHeight: category.expanded ? 200 : 0,
                overflow: 'hidden',
                transition: 'max-height 0.3s',
              }}
              disablePadding
            >
              {renderCategories(category.child)}
            </List>
          )}
        </List>
      </>
    ))

  return (
    <Card sx={{ w: '100%', h: '100%' }}>
      <CardHeader title={'Categorías'} />
      <CardContent sx={{ height: '100%' }}>
        <SimpleBar
          onTouchStart={(e) => {
            e.stopPropagation()
          }}
          style={{ height: 'calc(100vh - 225px)' }}
        >
          <List disablePadding>{renderCategories(categories)}</List>
        </SimpleBar>
      </CardContent>
    </Card>
  )
}

export default TagsListCard
