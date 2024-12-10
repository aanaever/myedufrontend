
<template>
  <div class="teacher-course-dashboard">
    <el-table :data="courses" style="width: 100%">
      <el-table-column prop="id" label="ID" width="180"></el-table-column>
      <el-table-column prop="title" label="Название"></el-table-column>
      <el-table-column prop="subtitle" label="Подзаголовок"></el-table-column>
      <el-table-column prop="status" label="Статус"></el-table-column>
      <el-table-column label="Действия">
        <template #default="{ row }">
          <el-button size="mini" @click="editCourse(row.id)">Редактировать</el-button>
          <el-button size="mini" type="danger" @click="removeCourse(row.id)">Удалить</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import CourseService from '@/service/CourseService';
import useStudentStore from '@/stores/modules/studentStore';
import { useRouter } from 'vue-router';

interface Course {
  id: number;
  title: string;
  subtitle: string;
  status: string;
}

const courses = ref<Course[]>([]);
const router = useRouter();
const store = useStudentStore();

const getTeacherCourses = async () => {
  if (store.getIsLoggedIn) {
    try {
      const response = await CourseService.getCoursesByAuthor(store.fullname);
      console.log('Fetched courses:', response.data); // Логирование данных для отладки
      courses.value = response.data as Course[]; // приведение типов, если необходимо
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  }
};

const removeCourse = async (courseId: number) => {
  try {
    await CourseService.deleteCourse(courseId);
    courses.value = courses.value.filter(course => course.id !== courseId);
  } catch (error) {
    console.error("Ошибка при удалении курса:", error);
  }
};

const editCourse = (courseId: number) => {
  router.push({ name: 'TeacherEditCourse', params: { courseId } });
};

onMounted(getTeacherCourses);
</script>

<style scoped>
.teacher-course-dashboard {
  margin: 2rem auto;
  width: 100%;
}
.el-table-column {
  text-align: left;
}
</style>
