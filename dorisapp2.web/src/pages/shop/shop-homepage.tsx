import { Button } from '@/components/ui/button'
import { ShopHero } from '@/components/shop/shop-hero'
import { ShopNavbar } from '@/components/shop/shop-navbar'
import {
  Heart,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from 'lucide-react'

const products = [
  {
    name: "Daily Carry Tote",
    category: "Bags",
    price: "$68.00",
    tone: "bg-rose-100 text-rose-900",
  },
  {
    name: "Soft Knit Set",
    category: "Apparel",
    price: "$92.00",
    tone: "bg-emerald-100 text-emerald-900",
  },
  {
    name: "Ceramic Desk Cup",
    category: "Home",
    price: "$24.00",
    tone: "bg-sky-100 text-sky-900",
  },
];

function ShopHomepage() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <ShopNavbar />
      <ShopHero />

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
  );
}

export default ShopHomepage;
