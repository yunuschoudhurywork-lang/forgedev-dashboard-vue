import { createRouter, createWebHistory } from "vue-router"

import MetricsDashboard from "@/pages/MetricsDashboard.vue"
import ClientMetricsDetail from "@/pages/ClientMetricsDetail.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: "/",
      redirect: "/metrics",
    },
    {
      path: "/metrics",
      name: "metrics-dashboard",
      component: MetricsDashboard,
    },
    {
      path: "/metrics/:clientId",
      name: "client-metrics-detail",
      component: ClientMetricsDetail,
      props: true,
    },
  ],
})

export default router