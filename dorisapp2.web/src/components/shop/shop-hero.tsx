import { useEffect, useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  Leaf,
  PackageCheck,
} from 'lucide-react'
import { DynamicIcon } from 'lucide-react/dynamic'
import type { IconName } from 'lucide-react/dynamic'
import { Link } from 'react-router-dom'

import { getCategories } from '@/api/categories'
import type { ApiCategory } from '@/api/categories'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

type HeroSubcategory = {
  id: number
  name: string
  slug: string
}

type HeroCategory = {
  id: number
  name: string
  slug: string
  iconName: IconName
  count: string
  subcategories: HeroSubcategory[]
}

const grocerySlides = [
  {
    eyebrow: 'Weekend market deal',
    headline: 'Fresh groceries delivered before dinner.',
    description:
      'Build your basket with peak-season produce, bakery favorites, pantry staples, and chilled essentials picked for same-day delivery.',
    cta: 'Shop fresh deals',
    accent: '#a764f5',
    image:
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    stat: '30% off produce bundles',
  },
  {
    eyebrow: 'Organic pantry',
    headline: 'Stock up on cleaner daily essentials.',
    description:
      'Save on grains, sauces, snacks, and breakfast staples from trusted brands with simple ingredients.',
    cta: 'Browse pantry',
    accent: '#db8d48',
    image:
      'https://images.unsplash.com/photo-1543168256-418811576931?auto=format&fit=crop&w=1200&q=80',
    stat: 'Buy 2, save 15%',
  },
  {
    eyebrow: 'Seafood counter',
    headline: 'Chef-ready cuts for easy weeknight meals.',
    description:
      'Order fresh seafood, premium meats, and prepped proteins packed cold and delivered on your schedule.',
    cta: 'Explore proteins',
    accent: '#a764f5',
    image:
      'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&w=1200&q=80',
    stat: 'Free cold-pack delivery',
  },
]

function ShopHero() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [categories, setCategories] = useState<HeroCategory[]>([])
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [focusedCategory, setFocusedCategory] = useState<string | null>(null)
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false)
  const currentSlide = grocerySlides[activeSlide]

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveSlide((slide) => (slide + 1) % grocerySlides.length)
    }, 4500)

    return () => window.clearInterval(intervalId)
  }, [])

  useEffect(() => {
    let isMounted = true

    getCategories()
      .then((apiCategories) => {
        if (!isMounted) {
          return
        }

        setCategories(toHeroCategories(apiCategories))
      })
      .catch(() => {
        if (isMounted) {
          setCategories([])
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingCategories(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="bg-[linear-gradient(180deg,#fff_0%,#fbf8ff_48%,#fff7ed_100%)]">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-4 md:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-stretch">
        <aside className="relative z-10 rounded-2xl border border-(--shop-border) bg-white/95 p-2.5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:h-100">
          <div className="flex items-center justify-between px-2 py-1.5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-normal text-(--shop-secondary-foreground)">
                Shop by category
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-[#a764f5]/10 p-1.5 text-[#a764f5] transition-colors hover:bg-[#a764f5]/15 lg:pointer-events-none"
              aria-label={
                mobileCategoriesOpen
                  ? 'Collapse categories'
                  : 'Expand categories'
              }
              aria-expanded={mobileCategoriesOpen}
              onClick={() => {
                setMobileCategoriesOpen((open) => !open)
                setExpandedCategory(null)
              }}
            >
              <PackageCheck className="size-4" />
              <ChevronDown
                className={cn(
                  'size-4 transition-transform lg:hidden',
                  mobileCategoriesOpen && 'rotate-180',
                )}
              />
            </button>
          </div>

          <nav
            className={cn(
              'mt-2 overflow-hidden transition-all duration-300 lg:block lg:overflow-visible',
              mobileCategoriesOpen
                ? 'max-h-88 overflow-y-auto opacity-100'
                : 'max-h-0 opacity-0 lg:max-h-none lg:opacity-100',
            )}
          >
            <div className="space-y-1">
              {isLoadingCategories && (
                <div className="space-y-1" aria-label="Loading categories">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      className="flex items-center gap-3 rounded-xl px-3 py-2"
                      key={index}
                    >
                      <Skeleton className="size-9 shrink-0 rounded-xl bg-slate-200" />
                      <div className="min-w-0 flex-1 space-y-2">
                        <Skeleton className="h-3.5 w-28 bg-slate-200" />
                        <Skeleton className="h-3 w-16 bg-slate-200" />
                      </div>
                      <Skeleton className="size-4 shrink-0 bg-slate-200" />
                    </div>
                  ))}
                </div>
              )}

              {!isLoadingCategories && categories.length === 0 && (
                <div className="px-3 py-8 text-center text-sm text-(--shop-muted-foreground)">
                  No categories available.
                </div>
              )}

              {categories.map((category) => {
                const isExpanded = expandedCategory === category.name

                return (
                  <div
                    className="group/category relative"
                    key={category.id}
                    onBlur={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget)) {
                        setFocusedCategory(null)
                      }
                    }}
                  >
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#a764f5]/8 hover:shadow-sm focus-visible:bg-[#a764f5]/8"
                      aria-expanded={
                        isExpanded || focusedCategory === category.name
                      }
                      aria-haspopup="true"
                      onFocus={() => setFocusedCategory(category.name)}
                      onKeyDown={(event) => {
                        if (
                          event.key === 'Enter' ||
                          event.key === 'ArrowDown'
                        ) {
                          event.preventDefault()
                          setFocusedCategory(category.name)
                          return
                        }

                        if (event.key === 'Escape') {
                          event.preventDefault()
                          setFocusedCategory(null)
                        }
                      }}
                      onClick={() => {
                        setExpandedCategory(isExpanded ? null : category.name)
                      }}
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#db8d48]/10 text-[#db8d48] transition-colors group-hover/category:bg-[#db8d48]/15">
                        <DynamicIcon
                          name={category.iconName}
                          className="size-5"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-(--shop-foreground)">
                          {category.name}
                        </span>
                        <span className="block text-xs text-(--shop-muted-foreground)">
                          {category.count}
                        </span>
                      </span>
                      {isExpanded ? (
                        <ChevronDown className="size-4 text-[#a764f5] lg:hidden" />
                      ) : (
                        <ChevronRight className="size-4 text-(--shop-muted-foreground) transition-colors group-hover/category:text-[#a764f5]" />
                      )}
                    </button>

                  <div
                    className={cn(
                      'grid overflow-hidden transition-all duration-200 lg:hidden',
                      isExpanded
                        ? 'grid-rows-[1fr] opacity-100'
                        : 'grid-rows-[0fr] opacity-0',
                    )}
                  >
                    <div className="min-h-0">
                      <div className="ml-12 space-y-1 pb-2">
                        {category.subcategories.map((subcategory) => (
                          <Link
                            key={subcategory.id}
                            to={`/categories?category=${category.slug}&subcategory=${subcategory.slug}`}
                            className="block rounded-xl px-3 py-2 text-sm text-(--shop-muted-foreground) transition-colors hover:bg-[#db8d48]/10 hover:text-[#db8d48]"
                          >
                            {subcategory.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div
                    className={cn(
                      'pointer-events-none absolute left-0 top-[calc(100%-0.25rem)] z-30 hidden max-h-80 w-full translate-y-1 overflow-y-auto rounded-2xl border border-(--shop-border) bg-white p-2 opacity-0 shadow-[0_20px_50px_rgba(15,23,42,0.14)] transition-all duration-200 group-hover/category:pointer-events-auto group-hover/category:translate-y-0 group-hover/category:opacity-100 lg:left-[calc(100%-0.375rem)] lg:top-0 lg:block lg:w-60',
                      focusedCategory === category.name &&
                        'lg:pointer-events-auto lg:translate-y-0 lg:opacity-100',
                    )}
                  >
                    <p className="px-3 py-2 text-xs font-semibold uppercase tracking-normal text-[#a764f5]">
                      {category.name}
                    </p>
                    {category.subcategories.map((subcategory) => (
                      <Link
                        key={subcategory.id}
                        to={`/categories?category=${category.slug}&subcategory=${subcategory.slug}`}
                        className="block rounded-xl px-3 py-2 text-sm text-(--shop-muted-foreground) transition-colors hover:bg-[#db8d48]/10 hover:text-[#db8d48]"
                      >
                        {subcategory.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
            </div>
          </nav>
        </aside>

        <div className="relative h-100 overflow-hidden rounded-3xl border border-white/80 bg-[#15111f] shadow-[0_24px_70px_rgba(15,23,42,0.16)]">
          <img
            src={currentSlide.image}
            alt=""
            className="absolute inset-0 size-full object-cover opacity-65 transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,12,24,0.94)_0%,rgba(15,12,24,0.68)_48%,rgba(15,12,24,0.18)_100%)]" />
          <div
            className="absolute right-6 top-6 hidden rounded-2xl bg-white/92 px-4 py-3 text-sm font-semibold text-[#15111f] shadow-xl backdrop-blur md:block"
            style={{ color: currentSlide.accent }}
          >
            {currentSlide.stat}
          </div>

          <div className="relative z-9 flex h-full max-w-2xl flex-col justify-between p-5 text-white sm:p-6 lg:p-7">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 text-sm font-medium ring-1 ring-white/20 backdrop-blur">
                <Leaf className="size-4 text-[#db8d48]" />
                {currentSlide.eyebrow}
              </div>
              <h1 className="mt-3 max-w-xl text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                {currentSlide.headline}
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-6 text-white/82 md:text-base">
                {currentSlide.description}
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="h-11 rounded-xl bg-[#a764f5] px-5 text-white shadow-lg shadow-[#a764f5]/30 hover:bg-[#9652ed]"
                >
                  {currentSlide.cta}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-11 rounded-xl border-white/40 bg-white/10 px-5 text-white backdrop-blur hover:bg-white hover:text-[#15111f]"
                >
                  Build my basket
                </Button>
              </div>
            </div>
          </div>

          <div className="absolute bottom-5 right-5 z-10 flex gap-2">
            {grocerySlides.map((slide, index) => (
              <button
                key={slide.headline}
                type="button"
                className={cn(
                  'h-2.5 rounded-full transition-all duration-300',
                  index === activeSlide
                    ? 'w-9 bg-[#db8d48]'
                    : 'w-2.5 bg-white/55 hover:bg-white',
                )}
                aria-label={`Show ${slide.eyebrow}`}
                aria-current={index === activeSlide}
                onClick={() => setActiveSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function toHeroCategories(categories: ApiCategory[]): HeroCategory[] {
  return categories
    .filter((category) => category.isActive)
    .map((category) => {
      const subcategories = (
        category.subCategories ??
        category.SubCategories ??
        []
      ).filter((subcategory) => subcategory.isActive)

      return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        iconName: (category.iconName || 'package-check') as IconName,
        count: `${subcategories.length} ${
          subcategories.length === 1 ? 'aisle' : 'aisles'
        }`,
        subcategories: subcategories.map((subcategory) => ({
          id: subcategory.id,
          name: subcategory.name,
          slug: subcategory.slug,
        })),
      }
    })
}

export { ShopHero }
