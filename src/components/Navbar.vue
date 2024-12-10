<template>
  <div id="nav">




    <!-- start logo -->
    <el-row :gutter="20" align="middle" justify="space-between">
      
      <div class="logo-text" @click="goToHome">
        MYEdu
      </div>
      <!-- end logo -->



      <!-- start dropdown -->
      <div class="full-only category">
        <el-dropdown>
          <span class="el-dropdown-link custom-dropdown">
            Каталог
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="item in categories" :key="item.id" @click="goToCategory(item.category)">
                {{ item.category }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <!-- end dropdown -->




    <!-- START SEARCH BAR -->
    <div id="searchBar">
        <form @submit.prevent="handleSearch">
          <input
            type="search"
            id="customSearchInput"
            v-model="searchItem"
            placeholder="Чему вы хотите научиться?"
            class="search-input"
          />
        </form>
      </div>
      <!-- end searchbar -->

      
      <!-- START CART ICON -->
      <div class="cartIcon">
        <router-link to="/cart" title="Cart">
          <el-badge v-if="store.cartCount > 0" :value="store.cartCount" class="itemCart">
            <ShoppingCart class="shopping-cart-icon" style="width: 1em" />
          </el-badge>
          <ShoppingCart v-else class="shopping-cart-icon" style="width: 1.7em" title="Cart" />
        </router-link>
      </div>


      
      <!-- IF NOT LOGGED IN -->
      <div class="full-only nav-btns" v-if="!store.loggedIn">
        <router-link to="/login">
          <el-button> Войти </el-button>
        </router-link>
      </div>
      <!-- ELSE -->
      <div class="full-only" v-else>
        <el-dropdown>
          <el-avatar :size="36" style="cursor: pointer" :src="attachAvatarLink(store.fullname)" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item disabled>
                {{ store.fullname }}
              </el-dropdown-item>
              <el-dropdown-item divided />
              <el-dropdown-item v-for="item in navMenuList" :key="item.id" @click="() => router.push(item.url)">
                {{ item.title }}
              </el-dropdown-item>
              <el-dropdown-item @click="logout()">Выйти</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-row>
  </div>
</template>


<script lang="ts" setup>
import { ElNotification } from "element-plus";
import { ShoppingCart, Search, ArrowDown } from "@element-plus/icons-vue";

import Drawer from "./Drawer.vue";
import navMenuListStudent from "@/navmenu.json";
import navMenuListTeacher from "@/teachernavmenu.json";
import navMenuListAdmin from "@/adminnavmenu.json"; 
import { ref, computed, defineProps } from "vue";
import { useStudentStore } from "@/stores";
import { useRouter } from "vue-router";
import type { CategoryDto } from "@/interfaces/custom";
import type { PropType } from 'vue';

const store = useStudentStore();

defineProps({
  categories: {
    type: Array as PropType<CategoryDto[]>,
    required: true
  }
});

const searchItem = ref("");
const router = useRouter();

const attachAvatarLink = (username: string) => {
  return `https://avatars.dicebear.com/api/initials/${username}.svg`;
};

const goToHome = () => {
  router.replace({ path: "/", force: true });
};

function handleSearch() {
  if (!searchItem.value.trim().length) return;
  if (searchItem.value.trim().length < 3) {
    return ElNotification({
      title: "Error",
      type: "error",
      duration: 2000,
      message: "Query too short"
    });
  }
  router.push({
    name: "SearchResults",
    query: { q: encodeURI(searchItem.value.trim()) },
    force: true
  });
}

const logout = async () => {
  await store.logoutUser();
  await store.getLoginStatus();
  window.location.replace("/");
};

function goToCategory(name: string) {
  router.push(`/category/${name}`);
}

// Определение правильного меню в зависимости от роли пользователя
const navMenuList = computed(() => {
  if (store.isAdmin) {
    return navMenuListAdmin;
  } else if (store.isTeacher) {
    return navMenuListTeacher;
  } else {
    return navMenuListStudent;
  }
});
</script>



<style scoped>




#nav el-row {
  padding-left: 0px; /* Добавляем отступ слева всей строке */
}


.search-input {
  width: 100%;
  padding: 9px 15px;
  border: 0.5px solid #ccc;
  border-radius: 12px; /* Кастомизируемый радиус углов */
  outline: none;
  font-size: 16px; /* Размер шрифта */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.search-input:focus {
  border-color: #666; /* Цвет границы при фокусе */
}



button, .btn {
  border: 0.5px solid #ccc;
  border-radius: 12px;
  padding: 18px 15px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  outline: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

button:hover, .btn:hover {
  background-color: lightgrey;
  color: black;
}

.logo-text {
  cursor: pointer;
  font-family: 'Trebuchet MS';
  font-size: 24px;
  font-weight: bold;
  transition: background-color 0.3s, color 0.3s;
  
  padding-left: 30px; /* Добавляем отступ слева, если нужно */
}

.el-dropdown-link {
  font-size: 16px;
  cursor: pointer;
  outline: none;
  
}

.category {

  width: 10%;
  
}

.custom-dropdown {
  border: 0.5px solid #ccc;
  border-radius: 12px;
  padding: 10px 15px;
  display: inline-flex;
  align-items: center;
  transition: background-color 0.3s, color 0.3s;
  outline: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  
}

.custom-dropdown:hover {
  background-color: lightgrey;
  color: black;align-items: middle;
}

.nav-btns {
  display: flex;
  margin-right: 1em;
  flex-direction: row;
}

.cartIcon {
  width: 10%;
  float: right;
  display: flex;
  height: 100%;
  margin-top: 0.4em;
} 

.shopping-cart-icon {
  color: gray;
}



#searchBar {
  width: 30%; /* Увеличенный размер поисковой строки */
}

#nav {
  width: 90%; /* Задаем полную ширину */
  background-color: #ffffff; /* Фоновый цвет навбара */
  border-radius: 20px; /* Закругление углов навбара */
  margin-top: 0;
  right: 0;
  left: 0;
  padding: 1em;
  position: relative;
  z-index: 10;
  box-shadow:  10px 10px 100px #bebebe,
             -10px -10px 100px #ffffff;
  display: block; 
  margin: 0 auto;
}



.itemCart {
  margin-top: 0.4em;
}


@media screen and (max-width: 830px) {
  #searchBar {
    display: none;
  }
}

@media screen and (max-width: 770px) {
  .full-only {
    display: none;
  }
  .logo-area {
    transform: scale(0.7);
    margin-left: 0;
    transition: all ease-in 0.5s;
  }
}

</style>
