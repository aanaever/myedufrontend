<template>
  <div class="admin-users-dashboard">
    <el-table :data="users" style="width: 100%">
      <el-table-column prop="id" label="ID" width="180"></el-table-column>
      <el-table-column prop="fullname" label="Полное имя"></el-table-column>
      <el-table-column prop="email" label="Электронная почта"></el-table-column>
      <el-table-column prop="role" label="Роль"></el-table-column>
      <el-table-column prop="createdAt" label="Дата создания"></el-table-column>
      <el-table-column label="Действия">
        <template #default="{ row }">
          <el-button size="mini" @click="editUser(row.id)">Редактировать</el-button>
          <el-button size="mini" type="danger" @click="removeUser(row.id)">Удалить</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import UserService from '@/service/UserService';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const users = ref([]);
    const router = useRouter();

    const getAllUsers = async () => {
      try {
        const { data } = await UserService.getAllUsers();
        users.value = data;
      } catch (error) {
        console.error("Ошибка при получении списка пользователей:", error);
      }
    };

    const removeUser = async (userId) => {
      try {
        await UserService.deleteUser(userId);
        users.value = users.value.filter(user => user.id !== userId);
      } catch (error) {
        console.error("Ошибка при удалении пользователя:", error);
      }
    };

    const editUser = (userId) => {
      router.push({ name: 'EditUser', params: { userId } });
    };

    onMounted(getAllUsers);

    return { users, removeUser, editUser };
  }
};
</script>