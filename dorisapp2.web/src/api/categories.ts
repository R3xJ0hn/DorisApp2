import type { AxiosRequestConfig } from "axios"

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
}

type CategoryPayload = {
  name: string
  slug: string
  description?: string | null
  iconName?: string | null
  isActive: boolean
}

type SubCategoryPayload = {
  name: string
  slug: string
  description?: string | null
  isActive: boolean
}

async function getCategories(config?: AxiosRequestConfig) {
  const { data } = await api.get<ApiCategory[]>("/Categories", config)

  return data
}

async function createCategory(payload: CategoryPayload) {
  const { data } = await api.post<ApiCategory>("/Categories", payload)

  return data
}

async function updateCategory(id: number, payload: CategoryPayload) {
  const { data } = await api.put<ApiCategory>(`/Categories/${id}`, payload)

  return data
}

async function deleteCategory(id: number) {
  await api.delete(`/Categories/${id}`)
}

async function createSubCategory(
  categoryId: number,
  payload: SubCategoryPayload,
) {
  const { data } = await api.post<ApiSubCategory>(
    `/Categories/${categoryId}/subcategories`,
    payload,
  )

  return data
}

async function deleteSubCategory(categoryId: number, subCategoryId: number) {
  await api.delete(`/Categories/${categoryId}/subcategories/${subCategoryId}`)
}

export {
  createCategory,
  createSubCategory,
  deleteCategory,
  deleteSubCategory,
  getCategories,
  updateCategory,
}
export type { ApiCategory, ApiSubCategory, CategoryPayload, SubCategoryPayload }
