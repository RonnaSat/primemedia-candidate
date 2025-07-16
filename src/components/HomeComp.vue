<template>
  <div class="min-h-screen bg-white">
    <header class=" p-6">
      <h1 class="text-xl font-light text-gray-900">Titanic Dashboard</h1>
    </header>

    <main class="p-6">
      <div v-if="dashboardStore.loading" class="text-center text-gray-500 mt-20">
        Loading...
      </div>
      <div v-else class="flex flex-wrap justify-center gap-8 max-w-[1600px] mx-auto">
        <DashboardCard title="Overall Survival Rate">
          <Doughnut :data="dashboardStore.survivalRateData" :options="dashboardStore.doughnutChartOptions" />
        </DashboardCard>
        <DashboardCard title="Survival Rate by Class">
          <Bar :data="dashboardStore.pclassSurvivalData" :options="dashboardStore.classSurvivalChartOptions" />
        </DashboardCard>
        <DashboardCard title="Survival Rate by Sex">
          <Bar :data="dashboardStore.sexSurvivalData" :options="dashboardStore.sexSurvivalChartOptions" />
        </DashboardCard>
        <DashboardCard title="Age Distribution">
          <Bar :data="dashboardStore.ageDistributionData" :options="dashboardStore.ageDistributionChartOptions" />
        </DashboardCard>
        <DashboardCard title="Body Found Rate">
          <Doughnut :data="dashboardStore.bodyFoundData" :options="dashboardStore.doughnutChartOptions" />
        </DashboardCard>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { Doughnut, Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';
import DashboardCard from '@/components/DashboardCardComp.vue';
import { useDashboardStore } from '@/stores/dashboard';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

const dashboardStore = useDashboardStore();

onMounted(() => {
  dashboardStore.loadTitanicData();
});

</script>

<style></style>
