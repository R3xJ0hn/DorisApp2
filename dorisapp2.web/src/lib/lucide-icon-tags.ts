import { iconNames } from "lucide-react/dynamic"
import type { IconName } from "lucide-react/dynamic"

import { formatIconLabel } from "@/lib/utils"

type IconOption = {
  name: IconName
  label: string
  tags: string[]
}

const iconSearchTags: Partial<Record<IconName, string[]>> = {
  apple: ["food", "fruit", "fresh", "grocery", "produce", "organic"],
  banana: ["food", "fruit", "fresh", "grocery", "produce"],
  beef: ["food", "meat", "protein", "butcher", "steak"],
  "beef-off": ["food", "meat", "protein", "butcher"],
  beer: ["drink", "beverage", "alcohol"],
  "beer-off": ["drink", "beverage", "alcohol"],
  cake: ["food", "dessert", "bakery", "sweet"],
  candy: ["food", "dessert", "snack", "sweet"],
  carrot: ["food", "vegetable", "fresh", "grocery", "produce", "organic"],
  cherry: ["food", "fruit", "fresh", "grocery", "produce"],
  cookie: ["food", "dessert", "bakery", "snack", "sweet"],
  croissant: ["food", "bread", "bakery", "pastry"],
  "cup-soda": ["drink", "beverage", "soda", "juice"],
  drumstick: ["food", "meat", "chicken", "protein"],
  egg: ["food", "dairy", "breakfast", "protein"],
  "egg-fried": ["food", "breakfast", "protein"],
  fish: ["food", "seafood", "protein", "fresh"],
  grape: ["food", "fruit", "fresh", "grocery", "produce"],
  ham: ["food", "meat", "protein", "butcher"],
  "ice-cream-bowl": ["food", "dessert", "frozen", "sweet"],
  "ice-cream-cone": ["food", "dessert", "frozen", "sweet"],
  milk: ["food", "dairy", "drink", "beverage"],
  nut: ["food", "snack", "pantry"],
  salad: ["food", "vegetable", "fresh", "healthy", "produce"],
  sandwich: ["food", "meal", "deli", "lunch"],
  soup: ["food", "meal", "pantry"],
  vegan: ["food", "vegetable", "organic", "healthy", "produce"],
  wheat: ["food", "grain", "bread", "bakery", "pantry"],
  "wheat-off": ["food", "grain", "gluten-free", "bakery"],
  baby: ["baby", "child", "infant", "household"],
  bath: ["household", "bathroom", "cleaning", "care", "personal-care", "hygiene"],
  bed: ["home", "household", "bedroom", "sleep"],
  "briefcase-medical": ["care", "health", "medical", "first-aid", "personal-care"],
  brush: ["cleaning", "household", "care", "personal-care"],
  boxes: ["inventory", "products", "stock", "warehouse"],
  bubbles: ["cleaning", "soap", "wash", "hygiene", "household"],
  "circle-help": ["care", "support", "help"],
  cross: ["care", "health", "medical", "first-aid"],
  "chart-no-axes-column-increasing": ["analytics", "reports", "growth"],
  "circle-dollar-sign": ["money", "payment", "price", "revenue", "sale"],
  "credit-card": ["payment", "checkout", "billing"],
  droplet: ["cleaning", "soap", "wash", "water", "care", "hygiene"],
  droplets: ["cleaning", "soap", "wash", "water", "care", "hygiene"],
  "heart-handshake": ["care", "support", "service", "help"],
  "heart-plus": ["care", "health", "medical", "personal-care"],
  home: ["house", "home", "household"],
  house: ["house", "home", "household"],
  "house-plug": ["house", "home", "household", "appliance"],
  "house-plus": ["house", "home", "household"],
  "package-check": ["products", "inventory", "delivery", "order"],
  "package-open": ["products", "inventory", "order"],
  "package-plus": ["products", "inventory", "stock", "household"],
  pill: ["care", "health", "medical", "personal-care"],
  "pill-bottle": ["care", "health", "medical", "personal-care"],
  "shield-check": ["care", "safe", "protection", "health", "household"],
  search: ["find", "lookup", "browse"],
  settings: ["admin", "configuration", "tools"],
  "shopping-bag": ["shop", "cart", "order", "checkout"],
  "shopping-cart": ["shop", "cart", "order", "checkout"],
  "shower-head": ["bath", "bathroom", "cleaning", "care", "hygiene", "household"],
  "soap-dispenser-droplet": ["cleaning", "soap", "wash", "care", "hygiene", "household"],
  "spray-can": ["cleaning", "household"],
  store: ["shop", "market", "retail"],
  tag: ["sale", "discount", "price", "promo"],
  tags: ["sale", "discount", "price", "promo"],
  toilet: ["bathroom", "household", "cleaning", "hygiene"],
  truck: ["delivery", "shipping", "fulfillment"],
  "washing-machine": ["cleaning", "laundry", "household", "appliance"],
  users: ["customers", "accounts", "people"],
  warehouse: ["storage", "household", "inventory", "stock"],
}

const buildIconTags = (name: IconName, label: string) => {
  const nameTokens = name.split("-")
  const labelTokens = label.toLowerCase().split(" ")

  return Array.from(
    new Set([...nameTokens, ...labelTokens, ...(iconSearchTags[name] ?? [])]),
  )
}

const iconOptions: IconOption[] = iconNames
  .map((name) => ({
    name,
    label: formatIconLabel(name),
    tags: buildIconTags(name, formatIconLabel(name)),
  }))
  .sort((a, b) => a.label.localeCompare(b.label))

export { iconOptions, iconSearchTags }
export type { IconOption }
