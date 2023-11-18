import { ArcElement, Chart, Tooltip } from 'chart.js'
import 'moment/locale/es'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import CustomRouter from './components/common/CustomRouter'
import Layout from './components/layout/Layout'
import { AuthProvider } from './context/AuthProvider'
import { AuthoritiesProvider } from './context/AuthoritiesProvider'
import { ClassifierProvider } from './context/ClassifierProvider'
import { LibraryProvider } from './context/LibraryProvider'
import { NotificationProvider } from './context/NotificationProvider'
import Classifier from './pages/Classifier'
import Library from './pages/Library'
import Profile from './pages/Profile'
import Authorities from './pages/admin/Authorities'
import Users from './pages/admin/Users'
import history from './utils/history'
import { UsersProvider } from './context/UsersProvider'

Chart.register([Tooltip])
Chart.register(ArcElement)

function App() {
  return (
    <CustomRouter history={history}>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            <Route element={<Layout />}>
              {/* Public Routes */}
              <Route
                path={'/'}
                element={
                  <LibraryProvider>
                    <Library />
                  </LibraryProvider>
                }
              />

              {/* Private Routes */}
              <Route
                path={'/classify'}
                element={
                  <ClassifierProvider>
                    <Classifier />
                  </ClassifierProvider>
                }
              />
              <Route path={'/admin/profile'} element={<Profile />} />
              <Route
                path={'/admin/authorities'}
                element={
                  <AuthoritiesProvider>
                    <Authorities />
                  </AuthoritiesProvider>
                }
              />
              <Route
                path={'/admin/users'}
                element={
                  <UsersProvider>
                    <Users />
                  </UsersProvider>
                }
              />
            </Route>
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </CustomRouter>
  )
}

export default App
