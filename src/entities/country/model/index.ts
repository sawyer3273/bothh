import { defineStore } from 'pinia'
import { CountryApi } from '../index'
import type { ICountry, ICountryModel } from './types'
import type { fetchCountriesParams } from '../api'

export const useCountryModel = defineStore('country', {
    state: () => <ICountryModel>{ 
        items: [],
        totalItems: 0
    },
    actions: {
        async fetchCountries(payload: fetchCountriesParams): Promise<void> {
            this.updateCountries([], 0)
            const result = await CountryApi.fetchData(payload)
            if (result) {
                this.updateCountries(result.data, result.items)
            }
        },

        updateCountries(payload: ICountry[], total: number): void {
            this.items = [...payload] || []
            this.totalItems = total || 0
          },
    },
})