import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Card,
  CardContent,
  Checkbox,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'

const TagsListCard = () => {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: 'Electrónica',
      relatedCategories: [2, 3],
      child: [
        {
          id: 4,
          name: 'Televisores',
          relatedCategories: [5],
          child: [
            {
              id: 6,
              name: 'Televisores LCD',
              relatedCategories: [],
              child: [],
              selected: false,
              expanded: false,
            },
          ],
          selected: false,
          expanded: false,
        },
        {
          id: 7,
          name: 'Smartphones',
          relatedCategories: [],
          child: [],
          selected: false,
          expanded: false,
        },
      ],
      selected: false,
      expanded: false,
    },
  ])

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
      <List key={category.id} disablePadding>
        <ListItemButton
          onClick={() =>
            category.child && category.child.length
              ? handleExpand(category.id)
              : handleToggle(category.id, !category.selected)
          }
        >
          <ListItemIcon>
            <Checkbox
              edge="start"
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
        {category.child && category.child.length > 0 && category.expanded && (
          <List sx={{ pl: 4 }} disablePadding>
            {renderCategories(category.child)}
          </List>
        )}
      </List>
    ))

  return (
    <Card sx={{ w: '100%', h: '100%' }}>
      <CardContent sx={{ height: '100%' }}>
        <Typography
          sx={{ fontSize: 14, height: '33%' }}
          color={'text.secondary'}
          gutterBottom
        >
          Categorías:
          <Divider />
          <List disablePadding>{renderCategories(categories)}</List>
        </Typography>
      </CardContent>
    </Card>
  )
}

export default TagsListCard
