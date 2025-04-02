import { http } from '@/shared/api'
import type { ICountry } from '../model/types'

export type fetchCountriesParams = {
  keyword?: string,
  code?: string
}

type ICountryAPI = {
  name: {
    common: string
    official: string
  },
  official: string
  capital?: string[]
  region: string
  subregion: string
  area: number
  population: number
  flag: string,
  cca3: string,
  flags: {
    svg: string
  },
  maps: {
    googleMaps: string
  },
  postalCode: {
    format: string
    regex: string
  }
}

export const fetchData = async (params: fetchCountriesParams): Promise<{ data: ICountry[]; items: number }> => {
  let query: {codes?: string} = {}
  if (params.code) {
    query.codes = params.code
  }
  let result = (await http.get(Object.keys(query).length ? `v3.1/alpha?${new URLSearchParams(query)}` : 'v3.1/all')).data
  result = result.map((item: ICountryAPI) => {
    return {
      common: item.name.common,
      official: item.name.official,
      capital: item.capital ? item.capital[0]: '',
      region: item.region,
      subregion: item.subregion,
      area: item.area,
      population: item.population,
      flag: item.flag,
      flagBig: item.flags.svg,
      cca3: item.cca3,
      postalCode: item.postalCode && item.postalCode.format,
      map: item.maps.googleMaps

    }
  })
  if (params.keyword) {
    result = result.filter((item: ICountry) => {
      for (let key of Object.keys(item)) {
        if (item[key as keyof typeof item] && params.keyword && item[key as keyof typeof item].toString().toLowerCase().includes(params.keyword.toLowerCase())) {
          return true
        }
      }
      return false
    })
  }
  let total = result.length

  return {
    data: result,
    items: total
  }
}


