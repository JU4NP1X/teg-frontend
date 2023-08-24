import { ArcElement, Chart } from 'chart.js'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import CustomRouter from './components/common/CustomRouter'
import Layout from './components/layout/Layout'
import { AuthProvider } from './context/AuthProvider'
import { ClassifierProvider } from './context/ClassifierProvider'
import { NotificationProvider } from './context/NotificationProvider'
import Authorities from './pages/admin/Authorities'
import Users from './pages/admin/Users'
import Library from './pages/Library'
import Profile from './pages/Profile'
import TagsFinder from './pages/TagsFinder'
import history from './utils/history'

Chart.register(ArcElement)

function App() {
  return (
    <CustomRouter history={history}>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            <Route element={<Layout />}>
              {/* Public Routes */}
              <Route path={'/'} element={<Library />} />

              {/* Private Routes */}
              <Route
                path={'/classify'}
                element={
                  <ClassifierProvider>
                    <TagsFinder />
                  </ClassifierProvider>
                }
              />
              <Route path={'/admin/profile'} element={<Profile />} />
              <Route path={'/admin/authorities'} element={<Authorities />} />
              <Route path={'/admin/users'} element={<Users />} />
            </Route>
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </CustomRouter>
  )
}

export default App
