import { Route, Routes } from 'react-router-dom'

//Components
import Layout from './components/layout/Layout'
import { AuthProvider } from './context/AuthProvider'

//Pages
import Login from './pages/Login'

import './App.css'
import CustomRouter from './components/__common/CustomRouter'
import { NotificationProvider } from './context/NotificationProvider'
import TagsFinder from './pages/TagsFinder'
import history from './utils/history'

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
              <Route path={'/'} element={<TagsFinder />} />
            </Route>
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </CustomRouter>
  )
}

export default App
