import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import Papa from 'papaparse'

export interface TitanicDataRow {
  survived: number
  pclass: number
  sex: 'female' | 'male'
  age: number | null
  body: number | null
}

export const useDashboardStore = defineStore(
  'dashboard',
  () => {
    const titanicData = ref<TitanicDataRow[]>([])
    const loading = ref(true)

    const loadTitanicData = () => {
      Papa.parse('./TitanicDataset.csv', {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          titanicData.value = results.data.filter((row: unknown) => {
            const typedRow = row as { survived: number | null }
            return typedRow.survived !== null
          }) as TitanicDataRow[]
          loading.value = false
        },
        error: (error) => {
          console.error('Error parsing CSV:', error)
          loading.value = false
        },
      })
    }

    const survivalRateData = computed(() => {
      if (!titanicData.value.length) return { labels: [], datasets: [] }
      const survived = titanicData.value.filter((p) => p.survived === 1).length
      const notSurvived = titanicData.value.length - survived
      return {
        labels: ['Survived', 'Did Not Survive'],
        datasets: [
          {
            backgroundColor: ['#41B883', '#E46651'],
            data: [survived, notSurvived],
          },
        ],
      }
    })

    const pclassSurvivalData = computed(() => {
      if (!titanicData.value.length) return { labels: [], datasets: [] }
      const pclassSurvival: { [key: number]: { survived: number; total: number } } = {}

      titanicData.value.forEach((p) => {
        if (!pclassSurvival[p.pclass]) pclassSurvival[p.pclass] = { survived: 0, total: 0 }
        pclassSurvival[p.pclass].total++
        if (p.survived === 1) pclassSurvival[p.pclass].survived++
      })

      const labels = Object.keys(pclassSurvival)
        .sort()
        .map((p) => `Class ${p}`)
      const data = Object.values(pclassSurvival).map((d) => (d.survived / d.total) * 100)

      return {
        labels,
        datasets: [{ label: 'Survival Rate (%)', backgroundColor: '#f87979', data }],
      }
    })

    const sexSurvivalData = computed(() => {
      if (!titanicData.value.length) return { labels: [], datasets: [] }
      const sexSurvival: { [key: string]: { survived: number; total: number } } = {
        female: { survived: 0, total: 0 },
        male: { survived: 0, total: 0 },
      }

      titanicData.value.forEach((p) => {
        if (p.sex) {
          sexSurvival[p.sex].total++
          if (p.survived === 1) sexSurvival[p.sex].survived++
        }
      })

      return {
        labels: ['Female', 'Male'],
        datasets: [
          {
            label: 'Survival Rate (%)',
            backgroundColor: ['#36A2EB', '#FF6384'],
            data: [
              (sexSurvival.female.survived / sexSurvival.female.total) * 100,
              (sexSurvival.male.survived / sexSurvival.male.total) * 100,
            ],
          },
        ],
      }
    })

    const ageDistributionData = computed(() => {
      if (!titanicData.value.length) return { labels: [], datasets: [] }
      const ageRanges = {
        '0-10': { survived: 0, died: 0 },
        '11-20': { survived: 0, died: 0 },
        '21-30': { survived: 0, died: 0 },
        '31-40': { survived: 0, died: 0 },
        '41-50': { survived: 0, died: 0 },
        '51-60': { survived: 0, died: 0 },
        '61-70': { survived: 0, died: 0 },
        '71-80': { survived: 0, died: 0 },
      }

      titanicData.value.forEach((p) => {
        if (p.age === null) return
        let ageRange: keyof typeof ageRanges
        if (p.age <= 10) ageRange = '0-10'
        else if (p.age <= 20) ageRange = '11-20'
        else if (p.age <= 30) ageRange = '21-30'
        else if (p.age <= 40) ageRange = '31-40'
        else if (p.age <= 50) ageRange = '41-50'
        else if (p.age <= 60) ageRange = '51-60'
        else if (p.age <= 70) ageRange = '61-70'
        else if (p.age <= 80) ageRange = '71-80'
        else return

        if (p.survived === 1) {
          ageRanges[ageRange].survived++
        } else {
          ageRanges[ageRange].died++
        }
      })

      return {
        labels: Object.keys(ageRanges),
        datasets: [
          {
            label: 'Survived',
            backgroundColor: '#41B883',
            data: Object.values(ageRanges).map((range) => range.survived),
          },
          {
            label: 'Died',
            backgroundColor: '#E46651',
            data: Object.values(ageRanges).map((range) => range.died),
          },
        ],
      }
    })

    const bodyFoundData = computed(() => {
      if (!titanicData.value.length) return { labels: [], datasets: [] }

      const diedPassengers = titanicData.value.filter((p) => p.survived === 0)

      const bodyFound = diedPassengers.filter((p) => p.body !== null && p.body !== undefined).length
      const bodyNotFound = diedPassengers.filter(
        (p) => p.body === null || p.body === undefined,
      ).length

      return {
        labels: ['Body Found', 'Body Not Found'],
        datasets: [
          {
            backgroundColor: ['#FF9F40', '#C9CBCF'],
            data: [bodyFound, bodyNotFound],
          },
        ],
      }
    })

    const doughnutChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom' as const,
          labels: {
            usePointStyle: true,
            font: {
              size: 12,
            },
            padding: 20,
          },
        },
      },
    }

    const classSurvivalChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 11,
            },
          },
        },
        y: {
          beginAtZero: true,
          max: 100,
          grid: {
            color: '#f5f5f5',
          },
          ticks: {
            font: {
              size: 11,
            },
          },
        },
      },
    }

    const sexSurvivalChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 11,
            },
          },
        },
        y: {
          beginAtZero: true,
          max: 100,
          grid: {
            color: '#f5f5f5',
          },
          ticks: {
            font: {
              size: 11,
            },
          },
        },
      },
    }

    const ageDistributionChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top' as const,
          labels: {
            usePointStyle: true,
            font: {
              size: 12,
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 11,
            },
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: '#f5f5f5',
          },
          ticks: {
            font: {
              size: 11,
            },
          },
        },
      },
    }

    return {
      titanicData,
      loading,
      loadTitanicData,
      survivalRateData,
      pclassSurvivalData,
      sexSurvivalData,
      ageDistributionData,
      bodyFoundData,
      doughnutChartOptions,
      classSurvivalChartOptions,
      sexSurvivalChartOptions,
      ageDistributionChartOptions,
    }
  },
  {
    persist: {
      storage: sessionStorage,
    },
  },
)
