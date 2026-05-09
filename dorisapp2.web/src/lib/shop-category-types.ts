import type { IconName } from "lucide-react/dynamic"

type ShopSubcategory = {
  id: string
  name: string
  slug: string
  productCount: number
}

type ShopCategory = {
  id: string
  name: string
  slug: string
  description: string
  itemCount: number
  isActive: boolean
  iconName: IconName
  subcategories: ShopSubcategory[]
}

export type { ShopCategory, ShopSubcategory }
