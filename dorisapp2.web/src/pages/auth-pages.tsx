import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  BadgePercent,
  Heart,
  PackageCheck,
  ShoppingBag,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  getAuthErrorMessage,
  login,
  register,
  type LoginRequest,
  type RegisterRequest,
} from "@/api/auth"

type AuthMode = "login" | "register"

const authContent = {
  login: {
    title: "Welcome back",
    description: "Sign in to manage orders, wishlist items, and checkout faster.",
    submitLabel: "Sign in",
    showName: false,
  },
  register: {
    title: "Create an account",
    description: "Join Doris Shop to save favorites and view order updates.",
    submitLabel: "Create account",
    showName: true,
  },
}

function AuthPage({ initialMode }: { initialMode: AuthMode }) {
  const navigate = useNavigate()
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const content = authContent[mode]

  const setAuthMode = (nextMode: AuthMode) => {
    if (isSubmitting) {
      return
    }

    setMode(nextMode)
    setError("")
    navigate(nextMode === "login" ? "/login" : "/register", { replace: true })
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get("email") ?? "").trim()
    const password = String(formData.get("password") ?? "")

    try {
      const auth =
        mode === "login"
          ? await login({ email, password } satisfies LoginRequest)
          : await register({
              fullName: String(formData.get("name") ?? "").trim(),
              email,
              password,
            } satisfies RegisterRequest)

      navigate(auth.role === "Admin" ? "/admin" : "/", { replace: true })
    } catch (authError) {
      setError(getAuthErrorMessage(authError))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="grid min-h-svh bg-(--shop-background) text-(--shop-foreground) lg:grid-cols-[1fr_0.9fr]">
      <section className="flex items-center justify-center px-4 py-10 md:px-6">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-10 flex items-center gap-2 font-semibold">
            <span className="flex size-10 items-center justify-center rounded-xl bg-(--shop-primary) text-(--shop-primary-foreground)">
              <ShoppingBag className="size-4" />
            </span>
            Doris Shop
          </Link>

          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-(--shop-muted-foreground) transition-colors hover:text-(--shop-primary)"
          >
            <ArrowLeft className="size-4" />
            Back to shop
          </Link>

          <div className="mb-8 grid grid-cols-2 rounded-lg border border-(--shop-border) bg-(--shop-muted) p-1">
            <Button
              type="button"
              variant={mode === "login" ? "default" : "ghost"}
              disabled={isSubmitting}
              onClick={() => setAuthMode("login")}
            >
              Sign in
            </Button>
            <Button
              type="button"
              variant={mode === "register" ? "default" : "ghost"}
              disabled={isSubmitting}
              onClick={() => setAuthMode("register")}
            >
              Sign up
            </Button>
          </div>

          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              {content.title}
            </h1>
            <p className="mt-2 text-sm text-(--shop-muted-foreground)">
              {content.description}
            </p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {content.showName && (
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="name">
                  Full name
                </label>
                <Input
                  id="name"
                  name="name"
                  autoComplete="name"
                  disabled={isSubmitting}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={
                  content.showName ? "new-password" : "current-password"
                }
                disabled={isSubmitting}
                maxLength={72}
                minLength={mode === "register" ? 8 : undefined}
                required
              />
            </div>

            {error && (
              <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <Button
              className="w-full"
              size="lg"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Please wait..." : content.submitLabel}
            </Button>
          </form>
        </div>
      </section>

      <aside className="hidden border-l border-(--shop-border) bg-(--shop-secondary) p-10 lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="mt-2 max-w-md">
            <p className="text-sm font-semibold uppercase tracking-wide text-(--shop-secondary-foreground)">
              Your Doris account
            </p>
            <h2 className="mt-3 text-4xl font-semibold leading-tight text-(--shop-secondary-foreground)">
              Make every order easier from the first click to delivery.
            </h2>
            <p className="mt-4 text-base leading-7 text-(--shop-muted-foreground)">
              Save your favorites, keep checkout details ready, and follow each
              purchase without digging through email updates.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-(--shop-border) bg-(--shop-background) p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <BadgePercent className="mt-0.5 size-5 text-(--shop-primary)" />
              <div>
                <p className="font-medium">Unlock member-only offers</p>
                <p className="mt-1 text-sm text-(--shop-muted-foreground)">
                  Get early sale access and checkout-ready promo codes.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-(--shop-border) bg-(--shop-background) p-5 shadow-sm">
              <Heart className="size-5 text-(--shop-primary)" />
              <p className="mt-4 font-medium">Saved favorites</p>
              <p className="mt-1 text-sm text-(--shop-muted-foreground)">
                Build a wishlist as you browse.
              </p>
            </div>
            <div className="rounded-2xl border border-(--shop-border) bg-(--shop-background) p-5 shadow-sm">
              <PackageCheck className="size-5 text-(--shop-primary)" />
              <p className="mt-4 font-medium">Order tracking</p>
              <p className="mt-1 text-sm text-(--shop-muted-foreground)">
                See delivery progress anytime.
              </p>
            </div>
          </div>

          <p className="text-sm text-(--shop-muted-foreground)">
            Join shoppers who use Doris accounts to reorder faster and never
            lose track of the pieces they love.
          </p>
        </div>
      </aside>
    </main>
  )
}

function LoginPage() {
  return <AuthPage initialMode="login" />
}

function RegisterPage() {
  return <AuthPage initialMode="register" />
}

export { LoginPage, RegisterPage }
