<template>
  <div>
    <div @click="launch = true" class="drawer">
      <img src="@/assets/menu.png" alt="More" class="hamburger" />
    </div>
    <el-drawer v-model="launch" direction="ltr" size="60%" class="demo-drawer">
      <div class="auth-buttons" v-if="!store.getIsLoggedIn">
        <router-link to="/login">
          <el-button class="btn purple">{{ loginText }}</el-button> <!-- Используем локализованный текст -->
        </router-link>
        &nbsp; &nbsp;
        <router-link to="/signup">
          <el-button class="btn white">{{ signupText }}</el-button> <!-- Используем локализованный текст -->
        </router-link>
      </div>

      <div style="margin: 1em" v-else>
        <el-avatar :src="attachAvatarLink(store.fullname)" :size="36"> </el-avatar>
        <span style="margin-left: 10px">{{ store.fullname }}</span>
        <div style="margin-top: 2em">
          <!-- Применим классы для элементов меню -->
          <el-row v-for="item in navMenuList" :key="item.id" @click="() => router.push(item.url)" class="menu-item">
            {{ item.title }}
            <el-divider />
          </el-row>
          <el-row @click="logout()">{{ logoutText }}</el-row> <!-- Используем локализованный текст -->
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useI18n } from 'vue-i18n';
import navMenuListStudent from "@/navmenu.json";
import navMenuListTeacher from "@/teachernavmenu.json";
import navMenuListAdmin from "@/adminnavmenu.json"; // Импортируем меню администратора
import { useStudentStore } from "@/stores";
import { useRouter } from "vue-router";

const store = useStudentStore();
const launch = ref(false); // Определение свойства launch
const router = useRouter();
const { t } = useI18n(); // Инициализируйте useI18n

const loginText = t('login');
const signupText = t('signup');
const logoutText = t('logout');

const attachAvatarLink = (username: string) => {
  return `https://avatars.dicebear.com/api/initials/${username}.svg`;
};

const logout = async () => {
  await store.logoutUser();
  await store.getLoginStatus();
  window.location.replace("/");
};

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
.drawer {
  width: 30px;
  height: 30px;
  margin-top: 0.25em;
  z-index: 30; /* Убедитесь, что триггер Drawer над другими элементами */
}

.hamburger {
  width: 100%;
  height: 100%;
}

.auth-buttons {
  width: 70%;
  margin: 0 auto;
  text-align: center;
}

@media screen and (min-width: 780px) {
  .drawer {
    display: none;
  }

  .demo-drawer {
    z-index: 50; /* Убедитесь, что Drawer над другими элементами при открытии */
  }
}
</style>
