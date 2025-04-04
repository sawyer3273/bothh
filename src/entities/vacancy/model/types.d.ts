export interface IVacancyModel {
    items: IVacancy[],
    totalItems: number
  }

  
export interface IVacancy {
  id?: number,
  company?: string,
  name: string
  link: string
  createdAt: date,
  deleted: boolean,
  updateCount: number
}
