import { http } from '@/shared/api'
import type { IVacancy } from '../model/types'

export type fetchVacancyParams = {
  page?: string,
  keyword?: string,
  sortBy?: string,
  sortOrder?: string,
  perPage?: string
}


export const fetchData = async (params: fetchVacancyParams): Promise<{ data: IVacancy[]; total: number }> => {
  let resp = (await http.get(Object.keys(params).length ? `/admin/vacancy?${new URLSearchParams(params)}` : '/admin/vacancy')).data
  let result, total
  if (resp.success) {
    result = resp.data
    total = resp.total
  } else {
    result = []
    total = 0
  }
  return {
    data: result,
    total: total
  }
}


