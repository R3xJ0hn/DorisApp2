import { Navigate, Route, Routes } from 'react-router-dom'
import ShopHomepage from './pages/shop/shop-homepage'
import { AdminPortal } from './pages/admin/admin-portal'
import { LoginPage, RegisterPage } from './pages/auth-pages'
import { AccountPage } from './pages/account-page'
import { isAdmin, isAuthenticated } from './api/auth'

function AdminRoute() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin()) {
    return <Navigate to="/" replace />
  }

  return <AdminPortal />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<ShopHomepage />} />
      <Route path="/categories" element={<ShopHomepage />} />
      <Route path="/new-arrivals" element={<ShopHomepage />} />
      <Route path="/sale" element={<ShopHomepage />} />
      <Route path="/about" element={<ShopHomepage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/account" element={<AccountPage />} />
      <Route path="/admin/*" element={<AdminRoute />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
