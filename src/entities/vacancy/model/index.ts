import { defineStore } from 'pinia'
import { VacancyApi } from '../index'
import type { IVacancy, IVacancyModel } from './types'
import type { fetchVacancyParams } from '../api'

export const useVacancyModel = defineStore('vacancy', {
    state: () => <IVacancyModel>{ 
        items: [],
        totalItems: 0
    },
    actions: {
        async getData(payload: fetchVacancyParams): Promise<void> {
            this.updateStore([], 0)
            const result = await VacancyApi.fetchData(payload)
            if (result) {
                this.updateStore(result.data, result.total)
            }
        },
        async delete(id: number): Promise<void> {
            let result = await VacancyApi.deleteRow(id)
            if (result) {
                this.updateStore(this.items.filter((item: IVacancy) => item.id !== id), this.totalItems - 1)
            }
        },

        updateStore(payload: IVacancy[], total: number): void {
            this.items = [...payload] || []
            this.totalItems = total || 0
          },
    },
})
