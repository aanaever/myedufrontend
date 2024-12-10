<template>
  <div class="add-course">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>Добавление нового курса</span>
      </div>
      <el-form :model="course" :rules="rules" ref="courseForm" label-width="150px">
        <el-form-item label="Название" prop="title">
          <el-input v-model="course.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Подзаголовок" prop="subtitle">
          <el-input v-model="course.subtitle" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Автор" prop="author">
          <el-input v-model="course.author" autocomplete="off"></el-input>
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
              @keyup.enter="addObjective" />
            <el-button @click="addObjective" class="add-button">Добавить цель</el-button>
          </div>
          <div v-for="(obj, index) in course.objectives" :key="index" class="objective-item">
            {{ obj }}
            <el-button icon="el-icon-delete" @click="removeObjective(index)" class="delete-button">Удалить</el-button>
          </div>
        </el-form-item>

        <!-- Уроки курса -->
        <el-form-item label="Уроки курса">
          <div class="lesson-inputs">
            <el-input v-model="newLesson.lessonName" placeholder="Название урока" />
            <el-input v-model.number="newLesson.position" type="number" placeholder="Позиция" />
          </div>
          <div class="lesson-inputs">
            <el-input v-model="newLesson.videokey" placeholder="Выберите видео файл" />
          </div>
          <div class="lesson-inputs">
            <input type="file" @change="handleFileUpload" />
          </div>
          <el-button @click="addLesson" class="add-button">Добавить урок</el-button>
          <div v-for="(lesson, index) in course.lessons" :key="index" class="lesson-item">
            {{ lesson.lessonName }} - {{ lesson.videokey }} ({{ lesson.lengthSeconds }} секунд)
            <el-button icon="el-icon-delete" @click="removeLesson(index)" class="delete-button">Удалить</el-button>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="formLoading" class="submit-button">Сохранить курс</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <video ref="videoElement" style="display: none;"></video>
  </div>
</template>


<script>
import CourseService from '@/service/CourseService';

export default {
  name: 'AddCourse',
  data() {
    return {
      course: {
        title: '',
        subtitle: '',
        author: '',
        price: 0,
        category: '',
        thumbUrl: '',
        rating: 0,
        status: 'APPROVED', // Добавлено новое поле статуса
        objectives: [],
        lessons: []
      },
      newObjective: '',
      newLesson: {
        lessonName: '',
        videokey: '',
        lengthSeconds: 0,
        position: 0
      },
      rules: {
        title: [
          { required: true, message: 'Введите название курса', trigger: 'blur' }
        ],
        price: [
          { required: true, type: 'number', message: 'Введите цену курса', trigger: 'blur' }
        ],
        // Добавьте другие правила валидации
      },
      selectedFile: null
    };
  },
  methods: {
    addObjective() {
      if (this.newObjective) {
        this.course.objectives.push(this.newObjective);
        this.newObjective = '';
      }
    },
    removeObjective(index) {
      this.course.objectives.splice(index, 1);
    },
    handleFileUpload(event) {
      this.selectedFile = event.target.files[0];
      if (this.selectedFile) {
        const url = URL.createObjectURL(this.selectedFile);
        const videoElement = this.$refs.videoElement;
        videoElement.src = url;
        videoElement.onloadedmetadata = () => {
          this.newLesson.lengthSeconds = Math.floor(videoElement.duration);
          URL.revokeObjectURL(url);
        };
      }
      console.log('Selected file:', this.selectedFile);
    },
    addLesson() {
      if (this.newLesson.lessonName && (this.newLesson.videokey || this.selectedFile)) {
        if (this.selectedFile) {
          console.log('Uploading video file:', this.selectedFile);
          CourseService.uploadVideo(this.selectedFile)
            .then(response => {
              console.log('Upload response:', response.data);
              this.newLesson.videokey = response.data;
              this.course.lessons.push({ ...this.newLesson });
              this.newLesson = { lessonName: '', videokey: '', lengthSeconds: 0, position: 0 };
              this.selectedFile = null;
            })
            .catch(error => {
              this.$message.error('Ошибка при загрузке видео: ' + error.message);
              console.error('Upload error:', error);
            });
        } else {
          this.course.lessons.push({ ...this.newLesson });
          this.newLesson = { lessonName: '', videokey: '', lengthSeconds: 0, position: 0 };
        }
      }
    },
    removeLesson(index) {
      this.course.lessons.splice(index, 1);
    },
    submitForm() {
      this.$refs.courseForm.validate((valid) => {
        if (valid) {
          const fullCourseData = {
            course: {
              title: this.course.title,
              subtitle: this.course.subtitle,
              author: this.course.author,
              price: this.course.price,
              category: this.course.category,
              thumbUrl: this.course.thumbUrl,
              status: this.course.status // Добавлено новое поле статуса
            },
            objectives: this.course.objectives,
            lessons: this.course.lessons.map(lesson => ({
              lessonName: lesson.lessonName,
              videokey: lesson.videokey,
              lengthSeconds: lesson.lengthSeconds,
              position: lesson.position
            }))
          };

          console.log('Submitting FullCourse Data:', fullCourseData);

          CourseService.createFullCourse(fullCourseData)
            .then(() => {
              this.$message.success('Курс успешно добавлен');
            })
            .catch(error => {
              this.$message.error('Ошибка при добавлении курса: ' + error.message);
              console.error('Error creating course:', error);
            });
        } else {
          console.log('Ошибка валидации!');
          return false;
        }
      });
    }
  }
};
</script>




<style scoped>
.add-course {
  margin: 20px;
  font-family: 'Arial', sans-serif; /* Добавляем шрифт для единообразия */
}

.el-form-item {
  margin-bottom: 20px; /* Добавляем отступы между элементами формы */
}

.el-input,
.el-select,
input[type="file"] {
  width: 100%;
}

.objective-input, .lesson-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.objective-item, .lesson-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  width: 100%;
}

.add-button,
.delete-button,
.submit-button {
  font-size: 14px;
  height: 40px;
  line-height: 40px;
}

.lesson-item .el-input {
  flex-grow: 1;
}
</style>
