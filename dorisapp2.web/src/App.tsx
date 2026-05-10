import { useEffect, useState, type ReactNode } from 'react'
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

function ShopRoute({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<'loading' | 'allowed' | 'admin'>(
    'loading'
  )

  useEffect(() => {
    let isMounted = true

    loadCurrentUser().then(() => {
      if (!isMounted) {
        return
      }

      setStatus(isAdmin() ? 'admin' : 'allowed')
    })

    return () => {
      isMounted = false
    }
  }, [])

  if (status === 'loading') {
    return null
  }

  if (status === 'admin') {
    return <Navigate to="/admin" replace />
  }

  return children
}

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <ShopRoute>
              <ShopHomepage />
            </ShopRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ShopRoute>
              <ShopHomepage />
            </ShopRoute>
          }
        />
        <Route
          path="/new-arrivals"
          element={
            <ShopRoute>
              <ShopHomepage />
            </ShopRoute>
          }
        />
        <Route
          path="/sale"
          element={
            <ShopRoute>
              <ShopHomepage />
            </ShopRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ShopRoute>
              <ShopHomepage />
            </ShopRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/account"
          element={
            <ShopRoute>
              <AccountPage />
            </ShopRoute>
          }
        />
        <Route path="/admin/*" element={<AdminRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
