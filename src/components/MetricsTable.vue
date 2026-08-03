<template>
  <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
    <!-- Optional Header -->
    <div v-if="title" class="p-6 border-b border-gray-100">
      <h2 class="text-xl font-semibold text-slate-900">{{ title }}</h2>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="bg-slate-50 border-b">
            <th class="p-4 text-left font-medium text-slate-600">Sprint</th>
            <th class="p-4 text-center font-medium text-slate-600">Code Quality</th>
            <th class="p-4 text-center font-medium text-slate-600">Velocity</th>
            <th class="p-4 text-center font-medium text-slate-600">Iteration Quality</th>
            <th class="p-4 text-center font-medium text-slate-600">Communication</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr 
            v-for="row in metrics" 
            :key="row.id"
            class="hover:bg-slate-50 transition-colors"
          >
            <td class="p-4 font-medium text-slate-700">
              #{{ row.sprintNumber || row.id }}
            </td>
            <td class="p-4 text-center font-semibold" :class="getScoreColor(row.codeQuality)">
              {{ row.codeQuality }}
            </td>
            <td class="p-4 text-center font-semibold" :class="getScoreColor(row.velocity)">
              {{ row.velocity }}
            </td>
            <td class="p-4 text-center font-semibold" :class="getScoreColor(row.iterationQuality)">
              {{ row.iterationQuality }}
            </td>
            <td class="p-4 text-center font-semibold" :class="getScoreColor(row.communication)">
              {{ row.communication }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  metrics: { 
    type: Array, 
    required: true 
  },
  title: {
    type: String,
    default: 'Sprint History'
  }
})
const getScoreColor = (score) => {
  if (score >= 85) return 'text-emerald-600'
  if (score >= 70) return 'text-amber-600'
  return 'text-red-600'
}
</script>