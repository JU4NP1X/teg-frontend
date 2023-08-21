import { ArcElement, Chart } from 'chart.js'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './components/layout/Layout'
import CustomRouter from './components/__common/CustomRouter'
import { AuthProvider } from './context/AuthProvider'
import { NotificationProvider } from './context/NotificationProvider'
import Authorities from './pages/admin/Authorities'
import Users from './pages/admin/Users'
import Library from './pages/Library'
import Login from './pages/Login'
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
            {/* Public Routes */}
            <Route path={'/login'} element={<Login />} />

            {/* Private Routes */}
            <Route element={<Layout />}>
              <Route path={'/'} element={<Library />} />
              <Route path={'/classify'} element={<TagsFinder />} />
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
