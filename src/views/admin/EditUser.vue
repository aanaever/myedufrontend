<template>
  <div class="edit-user">
    <el-form :model="user" @submit.prevent="updateUser">
      <el-form-item label="Полное имя">
        <el-input v-model="user.fullname" />
      </el-form-item>
      <el-form-item label="Электронная почта">
        <el-input v-model="user.email" />
      </el-form-item>
      <el-button type="primary" :loading="formLoading" native-type="submit">Сохранить изменения</el-button>
    </el-form>
  </div>
</template>

<script>
import UserService from '@/service/UserService';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();
    const formLoading = ref(false);
    const user = ref({ id: null, fullname: '', email: '' });

    const fetchUser = () => {
      UserService.getUserById(route.params.userId)
        .then(response => {
          user.value = response.data;
        })
        .catch(error => {
          ElMessage.error('Не удалось получить данные пользователя: ' + error.message);
        });
    };

    const updateUser = () => {
      formLoading.value = true;
      UserService.updateUser(user.value.id, user.value)
        .then(() => {
          ElMessage.success('Пользователь успешно обновлен');
          // Здесь можно добавить любой маршрут, на который вы хотите перейти после успешного обновления
          // router.push('/some-route');
        })
        .catch(error => {
          ElMessage.error('Не удалось обновить пользователя: ' + error.message);
        })
        .finally(() => {
          formLoading.value = false;
        });
    };

    fetchUser();

    return { user, updateUser, formLoading };
  }
};
</script>

<style scoped>
.edit-user {
  margin: 2rem auto;
  width: 90%;
  max-width: 500px;
}

.el-form-item {
  margin-bottom: 1rem;
}

.el-button {
  margin-top: 1rem;
}
</style>
