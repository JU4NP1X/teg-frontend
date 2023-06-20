import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom'

//Components
import Layout from './components/layout/Layout'
import { AuthProvider } from './context/AuthProvider'

//Pages
import Login from './pages/Login'

import { NotificationProvider } from './context/NotificationProvider'
import './App.css'
import CustomRouter from './components/__common/CustomRouter'
import history from './utils/history'
import TagsFinder from './pages/TagsFinder'
const env = import.meta.env
function App() {
  return (

    <CustomRouter history={history}>

      <AuthProvider>
        <NotificationProvider>
          <Routes >
            {/* Public Routes */}
            <Route path='/login' element={<Login />} />

            {/* Private Routes */}
            <Route element={<Layout />}>
              <Route path='/' element={<TagsFinder />} />
            </Route>

          </Routes>

        </NotificationProvider>
      </AuthProvider>
    </CustomRouter>

  )
}

export default App
