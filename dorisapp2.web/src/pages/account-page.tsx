import { Navigate } from "react-router-dom"

import { ShopNavbar } from "@/components/shop/shop-navbar"
import { getStoredAuthUser, isAuthenticated } from "@/api/auth"

function AccountPage() {
  const user = getStoredAuthUser()

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  return (
    <main className="min-h-svh bg-background text-foreground">
      <ShopNavbar />

      <section className="mx-auto max-w-3xl px-4 py-10 md:px-6">
        <h1 className="text-3xl font-semibold tracking-tight">My Account</h1>
        <div className="mt-6 rounded-lg border bg-card p-5 text-card-foreground shadow-sm">
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-medium text-muted-foreground">Name</dt>
              <dd className="mt-1 text-base">{user?.fullName ?? "Account user"}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Email</dt>
              <dd className="mt-1 text-base">{user?.email ?? "Not available"}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Role</dt>
              <dd className="mt-1 text-base">{user?.role ?? "Customer"}</dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  )
}

export { AccountPage }
