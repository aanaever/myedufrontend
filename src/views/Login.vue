<template>
  <div align="center" style="height: 80vh">
    <div class="loginContainer">
      <h3 class="loginHeader">Авторизуйся в свой аккаунт</h3>

      <!-- START LOGIN FORM BELOW -->
      <el-form @submit.prevent="handleLogin" status-icon :model="loginForm" :rules="rules" ref="loginFormRef">
        <el-form-item style="margin-top: 10px" prop="email">
          <el-input
            type="email"
            :prefix-icon="Message"
            placeholder="E-mail"
            maxlength="70"
            v-model.trim="loginForm.email"
            class="field"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            placeholder="Password"
            :prefix-icon="Lock"
            v-model.trim="loginForm.password"
            class="field"
            show-password
          ></el-input>
        </el-form-item>

        <div style="margin-top: 8px">
          <el-button class="btn purple" style="font-weight: bold" native-type="submit" :loading="isLoading">
            Войти
          </el-button>
        </div>
      </el-form>
      <!-- END FORM -->

      <div style="margin-top: 20px">
        Нет учетной записи?
        <router-link to="/signup" class="none" style="font-weight: 800"> Регистрация </router-link>
        <br>
        Стать учителем?
        <router-link to="/signup-teacher" class="none" style="font-weight: 800"> Присоединиться </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import AuthService from "@/service/AuthService";
import { ElMessage } from "element-plus";
import { Lock, Message } from "@element-plus/icons-vue";
import { computed, reactive, ref, onMounted, onBeforeUnmount } from "vue";
import { handleApiError } from "@/util/http_util";
import type { FormInstance, FormRules } from "element-plus";
import { useStudentStore } from "@/stores";
import type { LoginRequest, UserDto } from "@/interfaces/custom";
import router from "@/router";

document.title = "Login | MyEdu";

const loginFormRef = ref<FormInstance>();
const store = useStudentStore();

// validation for password
const checkPassword = (rule: any, value: string, callback: (arg?: Error) => void) => {
  if (!value) {
    callback(new Error("Password can't be empty"));
  } else {
    callback();
  }
};

const loginForm = reactive({
  email: "",
  password: "",
  responseToken: ""
});

// rules for the validation
const rules = reactive<FormRules>({
  email: [{ required: true, type: "email", trigger: "blur" }],
  password: [{ validator: checkPassword, trigger: "blur" }]
});

const isLoading = ref(false);
const GOOGLE_CLIENT_ID = computed(() => {
  return import.meta.env.VITE_APP_GOOGLE_CLIENT_ID;
});

const SERVER_ROOT = computed(() => {
  return import.meta.env.VITE_APP_BACKEND_ROOT_URL;
});

async function handleLogin() {
  const isValid = await loginFormRef.value?.validate();
  if (!isValid) return;
  isLoading.value = true;
  console.log("Form is valid, starting login process..."); // Debugging line
  try {
    const res = await submitToServer(loginForm);
    if (res && res.userInfo) {
      const user: UserDto = res.userInfo;
      const token = res.token;

      // Сохранение JWT токена
      localStorage.setItem("jwtToken", token);

      // Обновление состояния пользователя
      store.setUserInfo({
        id: user.id,
        fullname: user.fullname,
        role: user.role,
        loggedIn: true
      });
      await store.getLoginStatus();
      await store.getCartCountServer();

      redirectToHome();
    } else {
      throw new Error("Invalid login response: userInfo or token is missing");
    }
  } catch (err) {
    displayError(err);
  } finally {
    isLoading.value = false;
  }
}

async function submitToServer(payload: LoginRequest) {
  try {
    console.log("Submitting to server with payload:", payload); // Debugging line
    return await AuthService.loginUser(payload);
  } catch (err) {
    throw err;
  }
}

async function redirectToHome() {
  ElMessage.success("Добро пожаловать!");
  router.push('/');
}

function displayError(err: any) {
  handleApiError(err);
}

onMounted(() => {
  const script = document.createElement("script");
  script.src = "https://accounts.google.com/gsi/client";
  script.id = "google_client";
  document.getElementById("g-login")?.appendChild(script);
});

onBeforeUnmount(() => {
  document.getElementById("google_client")?.remove();
});
</script>

<style scoped>
.loginHeader {
  border-bottom: solid 1px #d1d7dc;
  color: var(--color-text);
  display: block;
  font-weight: 700;
  padding: 24px 64px 24px 24px;
}

.loginContainer {
  color: var(--color-text);
  width: 380px;
  text-align: center;
}

@media screen and (max-width: 600px) {
  .loginContainer {
    width: 250px;
  }
}
</style>
