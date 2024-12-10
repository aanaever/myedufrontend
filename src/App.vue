<template>
  <div class="app-wrapper">
    <Navbar :categories="categories" v-if="!computedHideNavbar" />
    <Drawer v-if="!store.isAdmin" />
    <main class="main-content">
      <router-view />
    </main>
    <Footer v-if="!computedHideFooter" />
  </div>
</template>

<script lang="ts" setup>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import Drawer from "@/components/Drawer.vue";

import CourseService from "@/service/CourseService";
import { useStudentStore } from "@/stores";

import { computed, onMounted, ref } from "vue";
import type { CategoryDto } from "@/interfaces/custom";
import { useRoute } from "vue-router";

const store = useStudentStore();
const categories = ref<CategoryDto[]>([]);
const route = useRoute();

function fetchCartCount() {
  store.getCartCountServer().then(() => {});
}

onMounted(() => {
  store.getLoginStatus().then((loggedIn: boolean) => {
    if (loggedIn) fetchCartCount();
  });
  CourseService.getAllCategories().then(res => (categories.value = res.data));
});

const computedHideNavbar = computed(() => route.meta?.hideNavbar ?? false);
const computedHideFooter = computed(() => route.meta?.hideFooter ?? false);
</script>

<style scoped>
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  margin-top: 5em; 
  flex: 1;
  padding: 20px;
}

.footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0.25em;
  color: white;
  background-color: var(--vt-c-black-soft);
}

.lefty {
  margin-top: 0.5em;
}

.footer-row {
  margin-bottom: 5px;
}

.credit-cards {
  margin-bottom: 0.5em;
}

a {
  color: white !important;
}

a:hover {
  border-bottom: 1px solid white;
}

.credit-cards img {
  margin-right: 0.5em;
}

.righty {
  margin-top: 0.5em;
}

@media screen and (max-width: 770px) {
  .credit-cards {
    display: none;
  }
}
</style>
