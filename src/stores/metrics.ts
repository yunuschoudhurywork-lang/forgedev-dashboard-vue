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
  notes?: string;
}

export const useMetricsStore = defineStore(STORE_NAMES.METRICS, () => {
  // State
  const metrics = ref<Metric[]>([]);
  const clientMetrics = ref<Metric[]>([]);
  const loading = ref(false);
  const error = ref("");

  // Fetch all metrics (Dashboard)
  async function fetchMetrics() {
    loading.value = true;
    error.value = "";

    try {
      const response = await fetch(API_ENDPOINTS.METRICS);

      if (!response.ok) {
        throw new Error(ERROR_MESSAGES.REQUEST_FAILED || "Request failed");
      }

      metrics.value = await response.json();
    } catch (err) {
      console.error("Fetch metrics error:", err);
      error.value = ERROR_MESSAGES.FETCH_METRICS || "Failed to fetch metrics";
    } finally {
      loading.value = false;
    }
  }

  // Fetch single client metrics
  async function fetchClientMetrics(clientId: string) {
    loading.value = true;
    error.value = "";

    try {
      const response = await fetch(`${API_ENDPOINTS.METRICS}/client/${clientId}`);

      if (!response.ok) {
        throw new Error(ERROR_MESSAGES.REQUEST_FAILED || "Request failed");
      }

      const data: Metric[] = await response.json();

      // Sort by sprint number
      clientMetrics.value = data.sort((a, b) => a.sprintNumber - b.sprintNumber);
    } catch (err) {
      console.error("Fetch client metrics error:", err);
      error.value = ERROR_MESSAGES.FETCH_METRICS || "Failed to fetch client data";
    } finally {
      loading.value = false;
    }
  }

  // Export to CSV 
  function exportToCSV(data: Metric[], filename = "client-metrics") {
  const [firstRow] = data;
  if (!firstRow) return;

  const headers = Object.keys(firstRow).join(","); //data[0] 

  const rows = data
    .map((row) =>
      Object.keys(row)
        .map((key) => {
          const value = row[key as keyof Metric];
          return `"${value ?? ""}"`;
        })
        .join(",")
    )
    .join("\n");

  const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;

  const link = document.createElement("a");
  link.href = encodeURI(csvContent);
  link.download = `${filename}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

  return {
    metrics,
    clientMetrics,
    loading,
    error,
    fetchMetrics,
    fetchClientMetrics,
    exportToCSV,
  };
});