export interface ICountryModel {
    items: ICountry[],
    totalItems: number
  }

  
export interface ICountry {
  common: string
  official: string
  capital: string
  region: string
  subregion: string
  area: number
  population: number
  flag: string,
  flagBig: string,
  cca3: string,
  map: string,
  postalCode: string
}
