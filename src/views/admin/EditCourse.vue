<template>
  <div class="edit-course">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>Редактирование курса</span>
      </div>
      <el-form :model="course" :rules="rules" ref="courseForm" label-width="150px">
        <!-- Основная информация о курсе -->
        <el-form-item label="Название" prop="title">
          <el-input v-model="course.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Подзаголовок" prop="subtitle">
          <el-input v-model="course.subtitle" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Автор" prop="author">
          <el-input v-model="course.author" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Цена" prop="price">
          <el-input type="number" v-model.number="course.price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Категория" prop="category">
          <el-input v-model="course.category" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="URL миниатюры" prop="thumbUrl">
          <el-input v-model="course.thumbUrl" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Статус курса" prop="status">
          <el-select v-model="course.status" placeholder="Выберите статус">
            <el-option label="Ожидает рассмотрения" value="PENDING_REVIEW"></el-option>
            <el-option label="Одобрен" value="APPROVED"></el-option>
            <el-option label="Отклонен" value="REJECTED"></el-option>
          </el-select>
        </el-form-item>

        <!-- Цели курса -->
        <el-form-item label="Цели курса">
          <div class="objective-input">
            <el-input
              placeholder="Введите цель курса"
              v-model="newObjective"
              @keyup.enter="addObjective"
              size="large" />
            <el-button @click="addObjective">Добавить цель</el-button>
          </div>
          <div v-for="(obj, index) in course.objectives" :key="index" class="objective-item">
            <el-input v-model="course.objectives[index]" size="large" class="objective-input" />
            <el-button 
              type="primary" 
              @click="saveObjective(index)" 
              size="mini">
              Сохранить
            </el-button>
            <el-button 
              type="danger" 
              @click="removeObjective(index)" 
              size="mini">
              Удалить
            </el-button>
          </div>
        </el-form-item>

        <!-- Уроки курса -->
        <el-form-item label="Уроки курса">
          <div v-for="(lesson, index) in course.lessons" :key="index" class="lesson-item">
            <el-form-item label="Название урока">
              <el-input v-model="lesson.lessonName" placeholder="Название урока" />
            </el-form-item>
            <el-form-item label="Ключ видео или URL видео">
              <el-input v-model="lesson.videokey" placeholder="Ключ видео или URL видео" />
            </el-form-item>
            <el-form-item label="Загрузить новое видео">
              <input type="file" @change="handleFileUpload($event, index)" />
              <el-button @click="uploadVideo(index)" type="primary" size="mini">Загрузить видео</el-button>
            </el-form-item>
            <el-form-item label="Позиция">
              <el-input v-model.number="lesson.position" type="number" placeholder="Позиция" />
            </el-form-item>
            <el-button type="danger" icon="el-icon-delete" @click="removeLesson(index)">Удалить урок</el-button>
          </div>
        </el-form-item>

        <!-- Сохранить изменения -->
        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="formLoading">Сохранить изменения</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <video ref="videoElement" style="display: none;"></video>
  </div>
</template>

<script>
import CourseService from '@/service/CourseService';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();
    const formLoading = ref(false);
    const course = ref({
      id: null,
      title: '',
      subtitle: '',
      author: '',
      price: 0,
      category: '',
      thumbUrl: '',
      status: 'PENDING_REVIEW',
      objectives: [],
      lessons: []
    });

    const newObjective = ref('');
    const selectedFiles = ref([]);

    const rules = ref({
      title: [
        { required: true, message: 'Введите название курса', trigger: 'blur' }
      ],
      price: [
        { required: true, type: 'number', message: 'Введите цену курса', trigger: 'blur' }
      ]
    });

    const fetchCourse = () => {
      CourseService.getFullCourse(route.params.courseId)
        .then(response => {
          const data = response.data;
          if (data.course) {
            course.value = {
              id: data.course.id,
              title: data.course.title,
              subtitle: data.course.subtitle,
              author: data.course.author,
              price: data.course.price,
              category: data.course.category,
              thumbUrl: data.course.thumbUrl,
              status: data.course.status || 'PENDING_REVIEW',
              objectives: data.objectives || [],
              lessons: data.lessons || []
            };
          } else {
            ElMessage.error('Не удалось загрузить детали курса: данные отсутствуют');
          }
        })
        .catch(error => {
          ElMessage.error('Не удалось загрузить детали курса: ' + error.message);
        });
    };

    const addObjective = () => {
      if (newObjective.value.trim() !== '') {
        course.value.objectives.push(newObjective.value);
        newObjective.value = '';
      }
    };

    const removeObjective = (index) => {
      course.value.objectives.splice(index, 1);
    };

    const saveObjective = (index) => {
      ElMessage.success('Цель сохранена');
    };

    const handleFileUpload = (event, index) => {
      const file = event.target.files[0];
      if (file) {
        selectedFiles.value[index] = file;
        const url = URL.createObjectURL(file);
        const videoElement = document.createElement('video');
        videoElement.src = url;
        videoElement.onloadedmetadata = () => {
          course.value.lessons[index].lengthSeconds = Math.floor(videoElement.duration);
          URL.revokeObjectURL(url);
        };
      }
    };

    const uploadVideo = async (index) => {
      const file = selectedFiles.value[index];
      if (file) {
        try {
          const response = await CourseService.uploadVideo(file);
          course.value.lessons[index].videokey = response.data; // Ensure you are correctly setting the videokey from response
          ElMessage.success(`Видео для урока ${index + 1} успешно загружено`);
        } catch (error) {
          ElMessage.error(`Ошибка при загрузке видео для урока ${index + 1}: ` + error.message);
        }
      } else {
        ElMessage.error(`Пожалуйста, выберите файл для урока ${index + 1}`);
      }
    };

    const removeLesson = (index) => {
      course.value.lessons.splice(index, 1);
    };

    const submitForm = () => {
      formLoading.value = true;

      const fullCourseData = {
        course: {
          id: course.value.id,
          title: course.value.title,
          subtitle: course.value.subtitle,
          author: course.value.author,
          price: course.value.price,
          category: course.value.category,
          thumbUrl: course.value.thumbUrl,
          status: course.value.status,
        },
        objectives: course.value.objectives.length > 0 ? course.value.objectives : [],
        lessons: course.value.lessons.length > 0 ? course.value.lessons.map(lesson => ({
          lessonName: lesson.lessonName,
          videokey: lesson.videokey,
          lengthSeconds: lesson.lengthSeconds,
          position: lesson.position
        })) : []
      };

      console.log('Отправляемые данные:', fullCourseData);

      CourseService.updateFullCourse(course.value.id, fullCourseData)
        .then(() => {
          ElMessage.success('Курс успешно обновлен');
          router.push('/admin/courses');
        })
        .catch(error => {
          ElMessage.error('Не удалось обновить курс: ' + error.message);
          console.error('Ошибка при обновлении курса:', error);
        })
        .finally(() => {
          formLoading.value = false;
        });
    };

    onMounted(() => {
      fetchCourse();
    });

    return {
      course,
      newObjective,
      addObjective,
      removeObjective,
      saveObjective,
      handleFileUpload,
      uploadVideo,
      removeLesson,
      rules,
      formLoading,
      submitForm
    };
  }
};
</script>

<style scoped>
.edit-course {
  margin: 20px;
}

.objective-input {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.objective-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  width: 100%;
}

.objective-item .el-input {
  flex-grow: 1;
}

.lesson-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
}

.lesson-inputs {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
