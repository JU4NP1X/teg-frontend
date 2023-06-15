import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom'

//Components
import Layout from './components/layout/Layout'
import { AuthProvider } from './context/AuthProvider'
import AuthLayout from './components/layout/AuthLayout'

//Pages
import Login from './pages/Login'
import Farm from './pages/Farm'
//import Reports from './pages/Reports'
import UsersAdmin from '../src/pages/UserAdmin'
import RolesAdmin from './pages/RolesAdmin'

import { SearchProvider } from './context/SearchProvider'
import { NotificationProvider } from './context/NotificationProvider'
import './App.css'
import ReportAdmin from './pages/ReportAdmin'
import Statistics from './pages/Statistics'
import CustomRouter from './components/__common/CustomRouter'
import history from './utils/history'
import ChangePasswordForm from './components/usersAdmin/ChangePassword'
import { ReportsProvider } from './context/ReportsProvider'
import Visibility from './pages/Visibility'
import { UsersProvider } from './context/UsersProvider'
import { RolesProvider } from './context/RolesProvider'
import ReportWindow from './pages/ReportWindow'
const env = import.meta.env
function App() {
  return (

    <CustomRouter history={history}>

      <AuthProvider>
        <NotificationProvider>
          <Routes >
            {/* Public Routes */}
            <Route index element={<Login />} />

            {/* Private Routes */}
            <Route element={<SearchProvider><Layout /></SearchProvider>}>
              <Route path='/farm' element={<Farm />} />

              <Route path='/admin/reports' element={<ReportsProvider><ReportAdmin /></ReportsProvider>} />

              <Route path='/admin/users' element={<UsersProvider><UsersAdmin /></UsersProvider>} />
              <Route path='/admin/roles' element={<RolesProvider><RolesAdmin /></RolesProvider>} />
              <Route path='/admin/statistics' element={<Statistics />} />
              <Route path='/admin/visibility' element={<Visibility />} />
              <Route path='/admin/config' element={<ChangePasswordForm />} />
            </Route>
            <Route path='reports/:repType/:repId' element={<ReportWindow />} />

          </Routes>

        </NotificationProvider>
      </AuthProvider>
    </CustomRouter>

  )
}

export default App
