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
        async update(id: number, params: {[key: string]: string}): Promise<void> {
            let result = await VacancyApi.updateRow(id, params)
            if (result) {
                this.updateStore(this.items.map((item: any) => {
                    if (item.id == id) {
                        item = result
                       
                    }
                    return item
            }), this.totalItems - 1)
            }
        },

        updateStore(payload: IVacancy[], total: number): void {
            this.items = [...payload] || []
            this.totalItems = total || 0
          },
    },
})
