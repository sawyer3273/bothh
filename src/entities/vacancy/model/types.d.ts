export interface IVacancyModel {
    items: IVacancy[],
    totalItems: number
  }

  
export interface IVacancy {
  name: string
  link: string
  createdAt: date
}
