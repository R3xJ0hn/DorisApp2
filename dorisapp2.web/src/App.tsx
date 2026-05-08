import heroImg from './assets/hero.png'
import { AdminPortal } from '@/pages/admin-portal'
import { Button } from '@/components/ui/button'
import {
  Heart,
  Search,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  User,
} from 'lucide-react'

function App() {
  const isAdminPath = window.location.pathname.startsWith('/admin')

  return isAdminPath ? <AdminPortal /> : <ShopHome />
}

function ShopHome() {
  const products = [
    {
      name: 'Daily Carry Tote',
      category: 'Bags',
      price: '$68.00',
      tone: 'bg-rose-100 text-rose-900',
    },
    {
      name: 'Soft Knit Set',
      category: 'Apparel',
      price: '$92.00',
      tone: 'bg-emerald-100 text-emerald-900',
    },
    {
      name: 'Ceramic Desk Cup',
      category: 'Home',
      price: '$24.00',
      tone: 'bg-sky-100 text-sky-900',
    },
  ]

  return (
    <main className="min-h-svh bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/75">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:px-6">
          <a href="/" className="flex items-center gap-2 font-semibold">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShoppingBag className="size-4" />
            </span>
            Doris Shop
          </a>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a className="transition-colors hover:text-foreground" href="/">
              New
            </a>
            <a className="transition-colors hover:text-foreground" href="/">
              Collections
            </a>
            <a className="transition-colors hover:text-foreground" href="/">
              Gifts
            </a>
          </nav>
          <div className="ml-auto hidden h-9 w-72 items-center gap-2 rounded-md border bg-muted/30 px-3 text-sm text-muted-foreground lg:flex">
            <Search className="size-4" />
            <span>Search products</span>
          </div>
          <Button variant="ghost" size="icon-sm" aria-label="Account">
            <User />
          </Button>
          <Button size="icon-sm" aria-label="Cart">
            <ShoppingBag />
          </Button>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 md:px-6 lg:grid-cols-[1fr_460px] lg:items-center lg:py-16">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-sm text-muted-foreground">
            <Star className="size-4 fill-current text-amber-500" />
            Curated essentials for everyday living
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-6xl">
            Shop practical pieces with a softer point of view.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
            Doris Shop brings together clean everyday goods, thoughtful home
            objects, and simple wardrobe staples in one calm storefront.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg">Shop new arrivals</Button>
            <Button variant="outline" size="lg">
              View collections
            </Button>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="aspect-[4/3] overflow-hidden rounded-lg bg-muted">
            <img
              src={heroImg}
              className="size-full object-contain p-10"
              alt="Featured Doris shop product"
            />
          </div>
          <div className="mt-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="font-medium">Featured drop</h2>
              <p className="text-sm text-muted-foreground">
                Limited launch edit
              </p>
            </div>
            <span className="rounded-full bg-primary px-3 py-1 text-sm text-primary-foreground">
              New
            </span>
          </div>
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-5 text-sm md:grid-cols-3 md:px-6">
          <div className="flex items-center gap-3">
            <Truck className="size-5 text-muted-foreground" />
            Free shipping over $75
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="size-5 text-muted-foreground" />
            Secure checkout
          </div>
          <div className="flex items-center gap-3">
            <Heart className="size-5 text-muted-foreground" />
            Easy 30-day returns
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              New arrivals
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              A first pass at the shop catalog layout.
            </p>
          </div>
          <Button variant="outline">Browse all</Button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.name}
              className="overflow-hidden rounded-lg border bg-card text-card-foreground"
            >
              <div
                className={`flex aspect-square items-center justify-center ${product.tone}`}
              >
                <ShoppingBag className="size-16" />
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground">
                  {product.category}
                </p>
                <div className="mt-1 flex items-center justify-between gap-3">
                  <h3 className="font-medium">{product.name}</h3>
                  <span className="font-medium">{product.price}</span>
                </div>
                <Button className="mt-4 w-full" variant="outline">
                  Add to cart
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default App
