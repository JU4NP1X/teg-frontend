
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { Checkbox, Collapse, Divider, IconButton, List, ListItem, Tooltip } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import PermIdentityIcon from '@mui/icons-material/PermIdentity'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import useSearch from '../../hooks/useSearch'
import { useEffect, useReducer, useState } from 'react'
import ApiConnection from '../../utils/apiConnection'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined'
import StoreIcon from '@mui/icons-material/Store'
import RepeatIcon from '@mui/icons-material/Repeat';
import GroupIcon from '@mui/icons-material/Group'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings'
import SellIcon from '@mui/icons-material/Sell'
import SellOutlinedIcon from '@mui/icons-material/SellOutlined'
import BarChartIcon from '@mui/icons-material/BarChart'
import LockResetIcon from '@mui/icons-material/LockReset'
import EngineeringIcon from '@mui/icons-material/Engineering'
import VisibilityIcon from '@mui/icons-material/Visibility'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import StarOutlineIcon from '@mui/icons-material/StarOutline'
import GradeIcon from '@mui/icons-material/Grade'
import WatchLaterIcon from '@mui/icons-material/WatchLater'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import HandymanIcon from '@mui/icons-material/Handyman'
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined'
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import RepeatOnIcon from '@mui/icons-material/RepeatOn'
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined'
import '../../styles/layout/filters.css'
import { isMobile } from '../../utils/utils'
import Swipe from '../__common/Swipe'

export const Filters = ({ isOpen, resetFilters, setResetFilters, setOpen, user }) => {
	const [_, forceUpdate] = useReducer((x) => x + 1, 0)
	const [companies, setCompanies] = useState([])
	const [categories, setCategories] = useState([])
	const [openList, setOpenList] = useState([])
	const [showBehavior, setShowBehavior] = useState(false)
	const Navigate = useNavigate()
	const {
		categoriesList,
		setCategoriesList,
		companiesList,
		setCompaniesList,
		behaviorList,
		setBehaviorList,
		favFilter,
		setFavFilter,
		recentFilter,
		setRecentFilter,
		constructionFilter,
		setConstructionFilter
	} = useSearch()

	const getCompanies = async () => {
		const api = ApiConnection()
		const companies = await api.get('/companies', { params: { onlyIndexed: true } })
		setCompanies(companies)
	}

	const getCategories = async () => {
		const api = ApiConnection()
		const categories = await api.get('/categories')
		setCategories(categories)
		const categoriesToAdd = categories.map(cat => {
			return [
				cat.catId,
				cat.childs.map(cat => {
					return [
						cat.catId,
						cat.childs.map(cat => cat.catId)
					]
				})
			]
		}).flat(4)
		setCategoriesList(categoriesToAdd)
	}

	useEffect(() => {
		getCompanies()
		getCategories()
	}, [])


	useEffect(() => {
		if (resetFilters) {
			setCompaniesList([])
			setCategoriesList(categories.map(cat => {
				return [
					cat.catId,
					cat.childs.map(cat => {
						return [
							cat.catId,
							cat.childs.map(cat => cat.catId)
						]
					})
				]
			}).flat(4))
			setBehaviorList(['STATIC', 'DYNAMIC'])
		}
		setResetFilters(false)
	}, [resetFilters])

	const addOrRemoveFilter = (element) => {
		if (companiesList.includes(element))
			setCompaniesList(companiesList.filter(e => e !== element))
		else
			setCompaniesList([...companiesList, element])
	}

	const addOrRemoveCategorie = (id) => {
		let newCategoriesList = [...categoriesList.sort((a, b) => {
			return a - b
		})]
		if (newCategoriesList.includes(id)) {
			newCategoriesList = newCategoriesList.filter(e => e !== id)
			newCategoriesList = removeChilds(id, newCategoriesList)
			newCategoriesList = removeParents(id, newCategoriesList)
		} else {
			newCategoriesList.push(id)
			newCategoriesList = addParents(id, newCategoriesList)
			newCategoriesList = addChilds(id, newCategoriesList)
		}

		setCategoriesList(newCategoriesList)
		forceUpdate()
	}

	const addOrRemoveBehavior = async (id) => {
		let newBehaviorList = [...behaviorList]
		if (behaviorList.includes(id)) {
			newBehaviorList = newBehaviorList.filter(e => e !== id)
		} else
			newBehaviorList.push(id)
		setBehaviorList(newBehaviorList)
	}

	const removeParents = (id, newCategoriesList) => {
		const parentCategorie = getCategorie(id, categories)
		let stillHavingChilds = false
		if (parentCategorie.childs)
			parentCategorie.childs.forEach(categorie => {
				if (newCategoriesList.includes(categorie.catId))
					stillHavingChilds = true
			})

		if (!stillHavingChilds) {
			newCategoriesList = newCategoriesList.filter(e => e !== id)
			if (parentCategorie.catFatherId)
				newCategoriesList = removeParents(parentCategorie.catFatherId, newCategoriesList)
		}
		return newCategoriesList
	}

	const addParents = (categorieId, newCategoriesList) => {
		const categorie = getCategorie(categorieId, categories)
		if (categorie.catFatherId && !newCategoriesList.includes(categorie.catFatherId)) {
			newCategoriesList.push(categorie.catFatherId)
			newCategoriesList = addParents(categorie.catFatherId, newCategoriesList)
		}
		return newCategoriesList
	}

	const addChilds = (categorieId, newCategoriesList) => {
		const categorie = getCategorie(categorieId, categories)
		if (categorie.childs) {
			categorie.childs.forEach(categorie => {
				newCategoriesList.push(categorie.catId)
				newCategoriesList = addChilds(categorie.catId, newCategoriesList)
			})
		}
		return newCategoriesList
	}

	const removeChilds = (categorieId, newCategoriesList) => {
		const categorie = getCategorie(categorieId, categories)
		if (categorie.childs) {
			categorie.childs.forEach(categorie => {
				newCategoriesList = newCategoriesList.filter(e => e !== categorie.catId)
				newCategoriesList = removeChilds(categorie.catId, newCategoriesList)
			})
		}
		return newCategoriesList
	}
	const getCategorie = (id, categories) => {
		let categorie
		for (let i = 0; i < categories.length; i++) {
			const potentalCategorie = categories[i]
			if (potentalCategorie.catId === id) {
				categorie = potentalCategorie
				break
			} else if (potentalCategorie.childs) {
				categorie = getCategorie(id, potentalCategorie.childs)
				if (categorie) break
			}
		}
		return categorie
	}

	const addOrRemoveOpenList = (element) => {
		if (openList.includes(element) && isOpen)
			setOpenList(openList.filter(e => e !== element))
		else
			setOpenList([...openList, element])
	}
	return (
		<Swipe onSwipeLeft={() => { setOpen(false) }} style={{ height: 'calc(100vh - 65px)' }}>

			<List style={{ height: '100%' }}>
				<>
					{window.location.pathname === '/farm' ?
						<>

							{companies.map((company => (
								<ListItemButton onClick={() => addOrRemoveFilter(company.cmpId)}>
									<ListItemIcon>
										<img src={`/img/${company.cmpValue}-isotipo.png`} className={companiesList.includes(company.cmpId) ? '' : 'filters-isotipo-unselected'} style={{ height: 'auto', width: '25px' }} />
									</ListItemIcon>
									<ListItemText primary={company.cmpName} />
								</ListItemButton>
							)))}

							<Divider />
							{categories.map(categorie => (
								<>
									<ListItem sx={{ p: 0 }}>

										<ListItemButton onClick={() => addOrRemoveCategorie(categorie.catId)}>
											<ListItemIcon>
												{categorie.catName == 'Compras' ?
													categoriesList.includes(categorie.catId) ? <ShoppingCartIcon /> : <ShoppingCartOutlinedIcon />
													: categorie.catName == 'Ventas' ?
														categoriesList.includes(categorie.catId) ? <SellIcon /> : <SellOutlinedIcon />
														: categorie.catName == 'Logística' ?
															categoriesList.includes(categorie.catId) ? <DirectionsCarFilledIcon /> : <DirectionsCarFilledOutlinedIcon />
															: categorie.catName == 'Finanzas' ?
																categoriesList.includes(categorie.catId) ? <AccountBalanceIcon /> : <AccountBalanceOutlinedIcon />
																: categorie.catName == 'Des. Humano' ?
																	categoriesList.includes(categorie.catId) ? <GroupIcon /> : <GroupOutlinedIcon />
																	: categorie.catName == 'Reposición' ?
																		categoriesList.includes(categorie.catId) ? <RepeatOnIcon /> : <RepeatIcon />
																		: categorie.catName == 'Mercadeo' ?
																			categoriesList.includes(categorie.catId) ? <StoreIcon /> : <StoreOutlinedIcon />

																			: null
												}
											</ListItemIcon>
											<ListItemText primary={categorie.catName} />
										</ListItemButton>
										<IconButton
											aria-label='Desplegar opciones'
											id={'cat-button-' + categorie.catId}
											onClick={() => addOrRemoveOpenList(categorie.catId)}
											style={{ display: isOpen ? 'inherit' : 'none' }}
										>
											{openList.includes(categorie.catId) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
										</IconButton>
									</ListItem>
									<Collapse in={openList.includes(categorie.catId) && isOpen} timeout='auto' unmountOnExit>
										<List component='div' disablePadding>
											{
												categorie.childs.map(categorie => (
													<ListItem sx={{ p: 0, pl: 2 }}>
														<ListItemButton onClick={() => {
															addOrRemoveCategorie(categorie.catId)
														}}>
															<Checkbox
																checked={categoriesList.includes(categorie.catId)}
																sx={{ color: 'rgba(0, 0, 0, 0.40) !important' }}
															/>
															<ListItemText primary={categorie.catName} />
														</ListItemButton>
													</ListItem>
												))

											}
										</List>
									</Collapse>
								</>
							))}

							<Divider />
							<ListItem sx={{ p: 0 }}>
								<ListItemButton onClick={() => {
									setRecentFilter(!recentFilter)
									setFavFilter(false)
									setConstructionFilter(false)
								}}>
									<ListItemIcon
									>
										{recentFilter ? <WatchLaterIcon /> : <AccessTimeIcon />}
									</ListItemIcon>
									<ListItemText primary={'Frecuentes'} />
								</ListItemButton>
							</ListItem>
							<ListItem sx={{ p: 0 }}>
								<ListItemButton onClick={() => {
									setFavFilter(!favFilter)
									setRecentFilter(false)
									setConstructionFilter(false)
								}}>
									<ListItemIcon
									>
										{favFilter ? <GradeIcon /> : <StarOutlineIcon />}
									</ListItemIcon>
									<ListItemText primary={'Favoritos'} />
								</ListItemButton>
							</ListItem>
							<ListItem sx={{ p: 0 }}>
								<ListItemButton onClick={() => {
									setConstructionFilter(!constructionFilter)
									setFavFilter(false)
									setRecentFilter(false)
								}}>
									<ListItemIcon
									>
										{constructionFilter ? <HandymanIcon /> : <HandymanOutlinedIcon />}
									</ListItemIcon>
									<ListItemText primary={'En construcción'} />
								</ListItemButton>
							</ListItem>
							<ListItem sx={{ p: 0 }}>
								<ListItemButton onClick={() => {
									setShowBehavior(!showBehavior)
									setOpen(true)
								}}>
									<ListItemIcon>
										<DisplaySettingsIcon />
									</ListItemIcon>
									<ListItemText primary={'Tipo'} />
								</ListItemButton>
								<IconButton
									aria-label='Desplegar opciones'
									onClick={() => setShowBehavior(!showBehavior)}
									style={{ display: isOpen ? 'inherit' : 'none' }}
								>
									{showBehavior ? <ExpandLessIcon /> : <ExpandMoreIcon />}
								</IconButton>
							</ListItem>
							<Collapse in={showBehavior && isOpen} timeout='auto' unmountOnExit>
								<List component='div' disablePadding>
									<ListItem sx={{ p: 0, pl: 2 }}>
										<ListItemButton onClick={() => {
											addOrRemoveBehavior('STATIC')
										}}>
											<Checkbox
												checked={behaviorList.includes('STATIC')}
												sx={{ color: 'rgba(0, 0, 0, 0.40) !important' }}
											/>
											<ListItemText primary={'Estáticos'} />
										</ListItemButton>
									</ListItem>
									<ListItem sx={{ p: 0, pl: 2 }}>
										<ListItemButton onClick={() => {
											addOrRemoveBehavior('DYNAMIC')
										}}>
											<Checkbox
												checked={behaviorList.includes('DYNAMIC')}
												sx={{ color: 'rgba(0, 0, 0, 0.40) !important' }}
											/>
											<ListItemText primary={'Dinámicos'} />
										</ListItemButton>
									</ListItem>
								</List>
							</Collapse>

							<Divider />
						</>
						: null
					}
				</>
				<ListItem sx={{ pl: 0, pr: 0, mt: 'auto' }}>
					<ListItemButton

						onClick={() => {
							setOpen(true)
							addOrRemoveOpenList(-1)
						}}
					>
						<ListItemIcon>
							<AdminPanelSettingsIcon />
						</ListItemIcon>
						<ListItemText primary={'Administrar'} />
					</ListItemButton>
					<IconButton
						aria-label='Desplegar opciones'
						onClick={() => addOrRemoveOpenList(-1)}
						style={{ display: isOpen ? 'inherit' : 'none' }}
					>
						{openList.includes(-1) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
					</IconButton>
				</ListItem>
				<Collapse in={openList.includes(-1) && isOpen} timeout='auto' unmountOnExit sx={{ pl: 2 }}>
					{user.roles.find(role => role.rolId === 1) ? (<>
						<ListItemButton onClick={() => {
							if (isMobile())
								setOpen(false)
							Navigate('/admin/roles')
						}} selected={window.location.pathname === '/admin/roles'}>
							<ListItemIcon>
								<EngineeringIcon />
							</ListItemIcon>
							<ListItemText primary='Roles' />
						</ListItemButton>
						<ListItemButton onClick={() => {
							if (isMobile())
								setOpen(false)
							Navigate('/admin/users')
						}} selected={window.location.pathname === '/admin/users'}>
							<ListItemIcon>
								<PermIdentityIcon />
							</ListItemIcon>
							<ListItemText primary='Usuarios' />
						</ListItemButton>
						<ListItemButton onClick={() => {
							if (isMobile())
								setOpen(false)
							Navigate('/admin/reports')
						}} selected={window.location.pathname === '/admin/reports'}>
							<ListItemIcon>
								<InsertDriveFileIcon />
							</ListItemIcon>
							<ListItemText primary='Reportes' />
						</ListItemButton>
						<ListItemButton onClick={async () => {
							if (isMobile())
								setOpen(false)
							Navigate('/admin/statistics')
						}} selected={window.location.pathname === '/admin/statistics'}>
							<ListItemIcon>
								<BarChartIcon />
							</ListItemIcon>
							<ListItemText primary='Estadísticas' />
						</ListItemButton>
					</>) : null}

					{/* change password */}
					<ListItemButton onClick={() => {
						if (isMobile())
							setOpen(false)
						Navigate('/admin/visibility')
					}} selected={window.location.pathname === '/admin/visibility'}>
						<ListItemIcon>
							<VisibilityIcon />
						</ListItemIcon>
						<ListItemText primary='Visibilidad' />
					</ListItemButton>
					<ListItemButton onClick={() => {
						if (isMobile())
							setOpen(false)
						Navigate('/admin/config')
					}} selected={window.location.pathname === '/admin/config'}>
						<ListItemIcon>
							<LockResetIcon />
						</ListItemIcon>
						<ListItemText primary='Cambiar Clave' />
					</ListItemButton>
				</Collapse>
				<Divider />
			</List>
		</Swipe>
	)
}
