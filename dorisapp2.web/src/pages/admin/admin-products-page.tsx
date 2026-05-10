import { useMemo, useState } from "react"
import {
  AlertTriangle,
  ChevronRight,
  Filter,
  ImagePlus,
  PackagePlus,
  Pencil,
  Search,
  SlidersHorizontal,
  Star,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type ProductStatus = "Active" | "Draft" | "Low stock"

type Product = {
  id: string
  name: string
  sku: string
  category: string
  price: string
  stock: number
  status: ProductStatus
  imageTone: string
  featured: boolean
  description: string
}

const products: Product[] = [
  {
    id: "prod-001",
    name: "Daily Carry Tote",
    sku: "BAG-TOTE-001",
    category: "Bags",
    price: "$68.00",
    stock: 42,
    status: "Active",
    imageTone: "bg-rose-100 text-rose-800",
    featured: true,
    description:
      "Structured everyday tote with reinforced handles and a roomy inner pocket.",
  },
  {
    id: "prod-002",
    name: "Soft Knit Set",
    sku: "APP-KNIT-014",
    category: "Apparel",
    price: "$92.00",
    stock: 18,
    status: "Active",
    imageTone: "bg-emerald-100 text-emerald-800",
    featured: true,
    description:
      "Matching knit top and lounge short set made for easy daily wear.",
  },
  {
    id: "prod-003",
    name: "Ceramic Desk Cup",
    sku: "HME-CUP-008",
    category: "Home",
    price: "$24.00",
    stock: 7,
    status: "Low stock",
    imageTone: "bg-sky-100 text-sky-800",
    featured: false,
    description:
      "Small-batch ceramic cup with a matte exterior and glazed interior.",
  },
  {
    id: "prod-004",
    name: "Market Basket",
    sku: "BAG-BASK-021",
    category: "Bags",
    price: "$54.00",
    stock: 0,
    status: "Draft",
    imageTone: "bg-amber-100 text-amber-800",
    featured: false,
    description:
      "Handwoven storage basket sized for errands, display, or pantry goods.",
  },
]

const statusStyles: Record<ProductStatus, string> = {
  Active: "bg-emerald-50 text-emerald-700",
  Draft: "bg-slate-100 text-slate-600",
  "Low stock": "bg-amber-50 text-amber-700",
}

function AdminProductsPage() {
  const [query, setQuery] = useState("")
  const [selectedId, setSelectedId] = useState(products[0].id)

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return products
    }

    return products.filter((product) =>
      [product.name, product.sku, product.category, product.status].some(
        (value) => value.toLowerCase().includes(normalizedQuery),
      ),
    )
  }, [query])

  const selectedProduct =
    products.find((product) => product.id === selectedId) ?? products[0]

  return (
    <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
      <section className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Products</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Static product management draft for layout review before API wiring.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal className="size-4" />
            View settings
          </Button>
          <Button className="gap-2">
            <PackagePlus className="size-4" />
            New product
          </Button>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <div className="rounded-lg border bg-card text-card-foreground">
          <div className="flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
            <label className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-lg border bg-background px-3 text-sm text-muted-foreground">
              <Search className="size-4" />
              <span className="sr-only">Search products</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by product, SKU, category, or status"
                className="h-full min-w-0 flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none"
              />
            </label>
            <Button variant="outline" className="gap-2">
              <Filter className="size-4" />
              Filter
            </Button>
          </div>

          <div className="divide-y">
            {filteredProducts.map((product) => {
              const isSelected = product.id === selectedProduct.id

              return (
                <button
                  key={product.id}
                  type="button"
                  className={cn(
                    "grid w-full gap-3 p-4 text-left transition-colors hover:bg-muted/60 md:grid-cols-[minmax(0,1.3fr)_120px_100px_110px_24px] md:items-center",
                    isSelected && "bg-muted/80",
                  )}
                  onClick={() => setSelectedId(product.id)}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span
                      className={cn(
                        "flex size-12 shrink-0 items-center justify-center rounded-lg",
                        product.imageTone,
                      )}
                    >
                      <ImagePlus className="size-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2">
                        <span className="truncate font-medium">
                          {product.name}
                        </span>
                        {product.featured && (
                          <Star className="size-4 fill-[#db8d48] text-[#db8d48]" />
                        )}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {product.sku}
                      </span>
                    </span>
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {product.category}
                  </span>
                  <span className="text-sm font-medium">{product.price}</span>
                  <span
                    className={cn(
                      "w-fit rounded-full px-2 py-1 text-xs font-medium",
                      statusStyles[product.status],
                    )}
                  >
                    {product.status}
                  </span>
                  <ChevronRight className="hidden size-4 text-muted-foreground md:block" />
                </button>
              )
            })}

            {filteredProducts.length === 0 && (
              <div className="p-6 text-sm text-muted-foreground">
                No products match this search.
              </div>
            )}
          </div>
        </div>

        <aside className="rounded-lg border bg-card text-card-foreground">
          <div className="border-b p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">
                  Product preview
                </p>
                <h3 className="mt-1 text-xl font-semibold tracking-tight">
                  {selectedProduct.name}
                </h3>
              </div>
              <Button variant="outline" size="icon-sm" aria-label="Edit product">
                <Pencil className="size-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-4 p-4">
            <div
              className={cn(
                "flex aspect-[4/3] items-center justify-center rounded-lg",
                selectedProduct.imageTone,
              )}
            >
              <ImagePlus className="size-16" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border p-3">
                <p className="text-muted-foreground">Price</p>
                <p className="mt-1 font-medium">{selectedProduct.price}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-muted-foreground">Stock</p>
                <p className="mt-1 font-medium">
                  {selectedProduct.stock} units
                </p>
              </div>
            </div>

            {selectedProduct.status === "Low stock" && (
              <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                Inventory is below the draft reorder threshold.
              </div>
            )}

            <div>
              <h4 className="text-sm font-medium">Details</h4>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {selectedProduct.description}
              </p>
            </div>

            <div className="grid gap-3">
              <label className="grid gap-2 text-sm font-medium">
                Product name
                <Input value={selectedProduct.name} readOnly />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                SKU
                <Input value={selectedProduct.sku} readOnly />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Category
                <Input value={selectedProduct.category} readOnly />
              </label>
            </div>
          </div>
        </aside>
      </section>
    </main>
  )
}

export { AdminProductsPage }
