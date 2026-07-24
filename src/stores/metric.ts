import { defineStore } from "pinia";
import { ref } from "vue";

import { STORE_NAMES } from "@/constants/store";
import { API_ENDPOINTS } from "@/constants/api";
import { ERROR_MESSAGES } from "@/constants/messages";

export interface Metric {
  clientId: string;
  clientName: string;

  codeQuality: number;
  velocity: number;
  iterationQuality: number;
  communication: number;

  sprintNumber: number;
}

export const useMetricsStore = defineStore(STORE_NAMES.METRICS, () => {
  const metrics = ref<Metric[]>([]);
  const loading = ref(false);
  const error = ref("");

  async function fetchMetrics() {
    loading.value = true;
    error.value = "";

    try {
      const response = await fetch(API_ENDPOINTS.METRICS);

      if (!response.ok) {
        throw new Error(ERROR_MESSAGES.REQUEST_FAILED);
      }

      metrics.value = await response.json();
    } catch (err) {
      console.error(err);
      error.value = ERROR_MESSAGES.FETCH_METRICS;
    } finally {
      loading.value = false;
    }
  }

  return {
    metrics,
    loading,
    error,
    fetchMetrics,
  };
});