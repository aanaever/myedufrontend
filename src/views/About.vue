<template>
    <h2 class="cart-header">О нас</h2>
    <div class="main-view" style="height: 70vh">
      <p>Веб приложение для онлайн курсов.</p>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from "vue";
  
  export default defineComponent({
    name: "About",
    setup() {
      document.title = "About | MyEdu";
      return {};
    }
  });
  </script>
  
  <style scoped></style>
  