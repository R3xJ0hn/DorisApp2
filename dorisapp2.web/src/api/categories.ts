import api from "@/api/axios"

type ApiSubCategory = {
  id: number
  categoryId: number
  name: string
  slug: string
  description?: string | null
  isActive: boolean
}

type ApiCategory = {
  id: number
  name: string
  slug: string
  description?: string | null
  iconName?: string | null
  isActive: boolean
  subCategories?: ApiSubCategory[]
  SubCategories?: ApiSubCategory[]
}

async function getCategories() {
  const { data } = await api.get<ApiCategory[]>("/Categories")

  return data
}

export { getCategories }
export type { ApiCategory, ApiSubCategory }
