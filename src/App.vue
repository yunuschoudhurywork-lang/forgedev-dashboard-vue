<script setup lang="ts">
import { onMounted, ref } from "vue";
import { RouterView } from "vue-router";
import LoginButton from "./components/LoginButton.vue";

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string | null;
}

const isAuthenticated = ref(false);
const currentUser = ref<AuthUser | null>(null);

onMounted(async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/auth/me`,
      {
        credentials: "include",
      }
    );

    if (response.ok) {
      const user = await response.json();

      currentUser.value = user;
      isAuthenticated.value = true;
    }
  } catch {
    // Authentication failed; user remains unauthenticated.
  }
});
</script>

<template>
  <LoginButton v-if="!isAuthenticated" />
  <RouterView />
</template>