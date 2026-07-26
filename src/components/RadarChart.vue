<!-- components/RadarChart.vue -->
<template>
  <div class="bg-white rounded-2xl shadow-sm p-6">
    <h3 class="text-slate-600 font-semibold mb-5">
      {{ title }}
    </h3>
    
    <div class="h-80 md:h-96">
      <Radar 
        :data="chartData" 
        :options="chartOptions"
      />
    </div>
  </div>
</template>

<script setup>
import { Radar } from 'vue-chartjs'
import { 
  Chart as ChartJS, 
  RadialLinearScale, 
  PointElement, 
  LineElement, 
  Filler, 
  Tooltip, 
  Legend 
} from 'chart.js'
import { computed } from 'vue'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const props = defineProps({
  title: { 
    type: String, 
    required: true 
  },
  data: { 
    type: Object, 
    required: true 
  },
  height: {
    type: String,
    default: 'h-80 md:h-96'
  }
})

const chartData = computed(() => props.data)

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { 
      position: 'top',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: { size: 13 }
      }
    },
    tooltip: {
      backgroundColor: '#1e2937',
      titleFont: { size: 14 },
      bodyFont: { size: 13 }
    }
  },
  scales: {
    r: {
      min: 0,
      max: 100,
      ticks: { 
        stepSize: 20,
        font: { size: 12 }
      },
      grid: {
        color: '#e2e8f0'
      },
      angleLines: {
        color: '#e2e8f0'
      }
    }
  }
}
</script>