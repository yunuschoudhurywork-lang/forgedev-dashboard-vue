<template>
  <div class="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-gray-600 font-medium capitalize">
        {{ title }}
      </h3>
      <PercentileBadge v-if="percentile" :value="percentile" />
    </div>
    
    <div 
      :class="[
        'text-5xl font-bold mb-3 transition-colors',
        scoreColorClass
      ]"
    >
      {{ formattedValue }}
    </div>

    <div class="flex items-center gap-2">
      <TrendChart 
        v-if="showTrend" 
        :data="trendData" 
        class="h-12 flex-1"
      />
    
      <div 
        v-else 
        :class="[
          'text-sm font-semibold flex items-center gap-1',
          change >= 0 ? 'text-emerald-600' : 'text-red-600'
        ]"
      >
        <span>{{ change >= 0 ? '↑' : '↓' }}</span>
        <span>{{ Math.abs(change) }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import PercentileBadge from './PercentileBadge.vue'
import TrendChart from './TrendChart.vue'

const props = defineProps({
  title: String,
  value: [Number, String],
  change: { type: Number, default: 0 },
  percentile: { type: Number, default: null },
  trendData: Array,
  showTrend: { type: Boolean, default: false },
  unit: { type: String, default: '' },
  
  color: { type: String, default: null },        
  autoColor: { type: Boolean, default: true }  
})

const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toLocaleString() + props.unit
  }
  return props.value
})
const scoreColorClass = computed(() => {
  if (props.color) return props.color                 
  if (!props.autoColor || typeof props.value !== 'number') return 'text-gray-900'

  if (props.value >= 85) return 'text-emerald-600'
  if (props.value >= 70) return 'text-amber-600'
  return 'text-red-600'
})
</script>