import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import ShopHomepage from './pages/shop/shop-homepage'
import { AdminPortal } from './pages/admin/admin-portal'
import { LoginPage, RegisterPage } from './pages/auth-pages'
import { AccountPage } from './pages/account-page'
import { isAdmin, loadCurrentUser } from './api/auth'
import { Toaster } from './components/ui/sonner'

function AdminRoute() {
  const [status, setStatus] = useState<'loading' | 'allowed' | 'login' | 'home'>(
    'loading'
  )

  useEffect(() => {
    let isMounted = true

    loadCurrentUser().then((user) => {
      if (!isMounted) {
        return
      }

      if (!user) {
        setStatus('login')
        return
      }

      setStatus(isAdmin() ? 'allowed' : 'home')
    })

    return () => {
      isMounted = false
    }
  }, [])

  if (status === 'loading') {
    return null
  }

  if (status === 'login') {
    return <Navigate to="/login" replace />
  }

  if (status === 'home') {
    return <Navigate to="/" replace />
  }

  return <AdminPortal />
}

function App() {
  return (
    <>
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
      <Toaster />
    </>
  )
}

export default App
