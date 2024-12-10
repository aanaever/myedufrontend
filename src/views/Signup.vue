<template>
  <div align="center" style="height: 80vh">
      <div class="loginContainer">
          <h3 class="loginHeader">Зарегистрируйся и начни свое обучение!</h3>

          <!-- GOOGLE SIGN UP  -->
          <!-- https://developers.google.com/identity/gsi/web/guides/display-button -->
          <div
              id="g_id_onload"
              :data-client_id="GOOGLE_CLIENT_ID"
              data-context="signup"
              data-ux_mode="popup"
              :data-login_uri="SERVER_ROOT + '/oauth2/authorization/google'"
              data-auto_prompt="false"
          ></div>

          <div
              class="g_id_signin"
              data-type="standard"
              data-shape="rectangular"
              data-theme="outline"
              data-text="signup_with"
              data-size="large"
              data-logo_alignment="left"
          ></div>
          <!-- END OF GOOGLE BUTTON -->

          <!-- START SIGNUP FORM -->
          <el-form @submit.prevent="handleSignup" status-icon :model="signupForm" :rules="rules" ref="signupFormRef">
              <el-form-item style="margin-top: 10px" prop="fullname" required>
                  <el-input
                      placeholder="Name"
                      v-model="signupForm.fullname"
                      :prefix-icon="User"
                      maxlength="70"
                      class="field"
                      clearable
                  >
                  </el-input>
              </el-form-item>

              <el-form-item prop="email" required>
                  <el-input
                      placeholder="E-mail"
                      v-model.trim="signupForm.email"
                      maxlength="70"
                      :prefix-icon="Message"
                      class="field"
                      type="email"
                      clearable
                  ></el-input>
              </el-form-item>

              <el-form-item prop="password" required>
                  <el-input
                      type="password"
                      placeholder="Password"
                      v-model.trim="signupForm.password"
                      :prefix-icon="Lock"
                      maxlength="80"
                      class="field"
                      show-password
                  ></el-input>
              </el-form-item>

              <el-form-item prop="confirmPass" required>
                  <el-input
                      placeholder="Re-Enter Password"
                      v-model.trim="signupForm.confirmPass"
                      :prefix-icon="Lock"
                      maxlength="80"
                      class="field"
                      show-password
                  ></el-input>
              </el-form-item>

              <el-form-item style="margin-top: 8px">
                  <el-button class="btn purple" style="font-weight: bold" :loading="isLoading" native-type="submit">
                      Зарегистрироваться
                  </el-button>
              </el-form-item>
          </el-form>

          <div style="margin-top: 13px">
              Уже зарегистрированы?
              <router-link to="/login" style="font-weight: 800"> Войти </router-link>
          </div>
      </div>
  </div>
</template>

<script lang="ts" setup>
import AuthService from "@/service/AuthService";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import { Lock, User, Message } from "@element-plus/icons-vue";
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { handleApiError } from "@/util/http_util";
import { useRouter } from "vue-router";
import useStudentStore from "@/stores/modules/studentStore";

document.title = "SignUp | MyEdu";

const signupFormRef = ref<FormInstance>();
const router = useRouter();
const store = useStudentStore();
const responseToken = ref("");

/* validation for fullname */
const checkName = (rule: any, value: string, callback: (arg?: Error) => void) => {
const reg = /[^ \p{Script=Han}0-9a-zA-Z_.'-]/u;
if (!value) {
  return callback(new Error("Name can't be empty"));
}
setTimeout(() => {
  if (value.length < 2) {
    callback(new Error("Name is too short"));
  } else if (reg.test(signupForm.fullname)) {
    callback(new Error("Name contains illegal characters"));
  } else {
    callback();
  }
}, 100);
};

// validation for password
const checkPassword = (rule: any, value: string, callback: (arg?: Error) => void) => {
const passwordReg = /^(?=.*[0-9])(?=.*[a-zA-Z]).*([a-zA-Z0-9]+?)?$/gi;
if (!value) {
  callback(new Error("Password can't be empty"));
} else if (value.length < 8) {
  return callback(new Error("Minimum length is 8 characters"));
} else if (!passwordReg.test(value)) {
  callback(new Error("Required at least 1 digit and 1 letter"));
} else {
  callback();
}
};

// validation for confirm password
const checkRepeatPass = (rule: any, value: string, callback: (arg?: Error) => void) => {
if (!value) {
  callback(new Error("Re-enter the password"));
} else if (value !== signupForm.password) {
  callback(new Error("Passwords don't match!"));
} else {
  callback();
}
};

const signupForm = reactive({
fullname: "",
email: "",
password: "",
confirmPass: ""
});

// rules for the validation
const rules = reactive<FormRules>({
fullname: [{ validator: checkName, trigger: "blur" }],
email: [{ required: true, type: "email", trigger: "blur" }],
password: [{ validator: checkPassword, trigger: "blur" }],
confirmPass: [{ validator: checkRepeatPass, trigger: "blur" }]
});

const isLoading = ref(false);

const GOOGLE_CLIENT_ID = computed(() => {
return import.meta.env.VITE_APP_GOOGLE_CLIENT_ID;
});
const SERVER_ROOT = computed(() => {
return import.meta.env.VITE_APP_BACKEND_ROOT_URL;
});

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
return AuthService.registerUser({ ...payload }, responseToken.value);
};

function redirectToHome() {
ElMessage.success("Добро пожаловать в MyEdu!");
setTimeout(() => {
  router.replace("/");
  window.location.reload();
}, 500);
}

onMounted(() => {
//attach GoogleAuth script
const scripta = document.createElement("script");
scripta.src = "https://accounts.google.com/gsi/client";
scripta.id = "google_client";
document.getElementById("g-login")?.appendChild(scripta); //see index.html
});

onBeforeUnmount(() => {
//detach above script
document.getElementById("google_client")?.remove();
});
</script>

<style>
.loginHeader {
border-bottom: solid 1px #d1d7dc;
color: #1c1d1f;
display: block;
font-weight: 700;
padding: 24px 64px 24px 24px;
}

.loginContainer {
color: #1c1d1f;
width: 380px;
text-align: center;
}

@media screen and (max-width: 600px) {
.loginContainer {
  width: 250px;
}
}
</style>
