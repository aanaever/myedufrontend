<template>
  <div align="center" style="height: 80vh">
    <div class="signupContainer">
      <h3 class="signupHeader">Присоединяйтесь как учитель</h3>

      <el-form @submit.prevent="handleSignup" status-icon :model="signupForm" :rules="rules" ref="signupFormRef">
        <el-form-item style="margin-top: 10px" prop="fullname">
          <el-input
            type="text"
            :prefix-icon="User"
            placeholder="Full Name"
            maxlength="100"
            v-model.trim="signupForm.fullname"
            class="field"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item prop="email">
          <el-input
            type="email"
            :prefix-icon="Message"
            placeholder="E-mail"
            maxlength="70"
            v-model.trim="signupForm.email"
            class="field"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            placeholder="Password"
            :prefix-icon="Lock"
            v-model.trim="signupForm.password"
            class="field"
            show-password
          ></el-input>
        </el-form-item>

        <el-form-item prop="confirmPass">
          <el-input
            placeholder="Confirm Password"
            :prefix-icon="Lock"
            v-model.trim="signupForm.confirmPass"
            class="field"
            show-password
          ></el-input>
        </el-form-item>

        <div style="margin-top: 8px">
          <el-button class="btn purple" style="font-weight: bold" native-type="submit" :loading="isLoading">
            Register
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import AuthService from "@/service/AuthService";
import { ElMessage } from "element-plus";
import { Lock, Message, User } from "@element-plus/icons-vue";
import { reactive, ref } from "vue";
import { handleApiError } from "@/util/http_util";
import type { FormInstance, FormRules } from "element-plus";
import { useRouter } from "vue-router";
import useStudentStore from "@/stores/modules/studentStore"; // Импортируем store

document.title = "Signup | MyEdu";

const signupFormRef = ref<FormInstance>();
const store = useStudentStore();
const router = useRouter();

const signupForm = reactive({
  fullname: "",
  email: "",
  password: "",
  confirmPass: "",
  responseToken: ""
});

const rules = reactive<FormRules>({
  fullname: [{ required: true, message: "Please enter your full name", trigger: "blur" }],
  email: [{ required: true, type: "email", message: "Please enter a valid email", trigger: "blur" }],
  password: [{ required: true, message: "Please enter your password", trigger: "blur" }],
  confirmPass: [{ required: true, message: "Please confirm your password", trigger: "blur" }]
});

const isLoading = ref(false);

async function handleSignup() {
  const isValid = await signupFormRef.value?.validate();
  if (!isValid) return;
  isLoading.value = true;
  try {
    const res = await submitToServer(signupForm);
    if (res && res.userInfo) {
      const user = res.userInfo;
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
      throw new Error("Invalid signup response: userInfo or token is missing");
    }
  } catch (err) {
    displayError(err);
  } finally {
    isLoading.value = false;
  }
}

function displayError(err: unknown) {
  handleApiError(err);
}

const submitToServer = async (payload: typeof signupForm) => {
  return AuthService.registerTeacher({ ...payload }, payload.responseToken);
};

function redirectToHome() {
  ElMessage.success("Welcome to MyEdu!");
  setTimeout(() => {
    router.replace("/");
    window.location.reload();
  }, 500);
}

</script>

<style scoped>
.signupHeader {
  border-bottom: solid 1px #d1d7dc;
  color: var(--color-text);
  display: block;
  font-weight: 700;
  padding: 24px 64px 24px 24px;
}

.signupContainer {
  color: var(--color-text);
  width: 380px;
  text-align: center;
}

@media screen and (max-width: 600px) {
  .signupContainer {
    width: 250px;
  }
}
</style>
