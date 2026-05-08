import { Navigate, Route, Routes } from 'react-router-dom'
import ShopHomepage from './pages/shop/shop-homepage'
import { AdminPortal } from './pages/admin/admin-portal'
import { LoginPage, RegisterPage } from './pages/auth-pages'

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
      <Route path="/admin/*" element={<AdminPortal />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
