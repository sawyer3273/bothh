export interface IVacancyModel {
    items: IVacancy[],
    totalItems: number
  }

  
export interface IVacancy {
  id?: number,
  name: string
  link: string
  createdAt: date,
  deleted: boolean,
  updateCount: number
}
