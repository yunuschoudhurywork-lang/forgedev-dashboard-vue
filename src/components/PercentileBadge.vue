<template>
  <span 
    :class="[
      'text-xs font-semibold px-3 py-1.5 rounded-full',
      badgeClasses
    ]"
  >
    Top {{ value }}%
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: { 
    type: Number, 
    required: true 
  }
})

const badgeClasses = computed(() => {
  if (props.value >= 90) return 'bg-emerald-100 text-emerald-700'
  if (props.value >= 75) return 'bg-blue-100 text-blue-700'
  if (props.value >= 60) return 'bg-amber-100 text-amber-700'
  return 'bg-red-100 text-red-700'
})
</script>