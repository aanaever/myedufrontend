<template>
  <div class="home">
    <div class="content-container">
      <div id="header-box">
        <h2 class="serif-head">Выберите идеальный курс</h2>
        <h3 class="serif-subtitle">Актуальные темы от профессионалов с опытом</h3>
      </div>
      <div class="banner-image"></div>
    </div>

    <div class="main-body">
      <div v-if="store.getIsLoggedIn" style="margin-bottom: 2em">
        <h3 class="sub-heading">
          Привет {{ getFirst(store.fullname) }}! Продолжите с того места, на котором остановились
          <router-link to="/account/learning">Мое обучение</router-link>
        </h3>
      </div>

      <h2 class="serif-head">Топ категории</h2>
      <h3 class="sub-heading">Самое популярное среди студентов</h3>
      <div class="catArea">
        <div
          class="catSingle"
          v-for="(item, index) in topCategs"
          :key="index"
          @click="goToCategory(item.title)"
        >
          <span class="material-icons">{{ item.icon }}</span>
          <h3>{{ item.title }}</h3>
          <p class="sub-gray">{{ item.description }}</p>
        </div>
      </div>

      <h2 class="serif-head">Рекомендуемые Курсы</h2>
      <el-alert v-if="serverError" :title="serverError" type="error" :closable="false" />
      <div v-loading="isLoadingFeatured" class="course-box">
        <el-space direction="vertical" alignment="center" :size="30">
          <el-space v-if="featuredCourses.length" wrap size="large">
            <el-card
              class="courseCard"
              :body-style="{ padding: '0px' }"
              shadow="hover"
              v-for="course in featuredCourses"
              :key="course.id"
              @click="router.push(`/course/${course.id}`)"
            >
              <img :src="course.thumbUrl ? course.thumbUrl : ''" class="product-img" :alt="course.title" />
              <div style="padding: 14px">
                <div class="card-title">{{ course.title }}</div>
                <div class="card-author">
                  <span>{{ course.author }}</span>
                </div>
                <el-rate
                  v-model="course.rating"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value} рейтинг"
                >
                </el-rate>
                <div>${{ course.price }}</div>
              </div>
            </el-card>
          </el-space>
        </el-space>
      </div>

      <h2 class="serif-head">Учащиеся смотрят</h2>
      <h3 class="sub-heading">Расширьте свои возможности с этими курсами</h3>
      <el-alert v-if="serverError" :title="serverError" type="error" :closable="false" />
      <div v-loading="isLoading" class="course-box">
        <el-space direction="vertical" alignment="center" :size="30">
          <el-space v-if="courses.length" wrap size="large">
            <el-card
              class="courseCard"
              :body-style="{ padding: '0px' }"
              shadow="hover"
              v-for="course in courses"
              :key="course.id"
              @click="router.push(`/course/${course.id}`)"
            >
              <img :src="course.thumbUrl ? course.thumbUrl : ''" class="product-img" :alt="course.title" />
              <div style="padding: 14px">
                <div class="card-title">{{ course.title }}</div>
                <div class="card-author">
                  <span>{{ course.author }}</span>
                </div>
                <el-rate
                  v-model="course.rating"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value} рейтинг"
                >
                </el-rate>
                <div>${{ course.price }}</div>
              </div>
            </el-card>
          </el-space>
        </el-space>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CourseService from "@/service/CourseService";
import type { Course } from "@/interfaces/myedu";
import { ElNotification } from "element-plus";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useStudentStore } from "@/stores";

const router = useRouter();
const store = useStudentStore();

const searchItem = ref("");
const courses = ref<Course[]>([]);
const featuredCourses = ref<Course[]>([]);
const isLoading = ref(true);
const isLoadingFeatured = ref(true);
const topCategs = reactive([
  {
    title: "Разработка",
    description: "Изучите новейшие технологии и языки программирования",
    icon: "code"
  },
  {
    title: "Музыка",
    description: "Узнайте о музыке и музыкальных инструментах",
    icon: "music_note"
  },
  {
    title: "Фото",
    description: "Научитесь делать качественные фото и видео",
    icon: "camera_alt"
  },
  {
    title: "Финансы",
    description: "Узнайте больше о финансах и инвестициях",
    icon: "attach_money"
  }
]);
const serverError = ref("");

function fetchAllCourses() {
  CourseService.getTop()
    .then(res => (courses.value = res.data))
    .catch(error => (serverError.value = error.message))
    .finally(() => (isLoading.value = false));
}

function fetchFeaturedCourses() {
  CourseService.getTop()
    .then(res => (featuredCourses.value = res.data))
    .catch(error => (serverError.value = error.message))
    .finally(() => (isLoadingFeatured.value = false));
}

function handleSearch() {
  if (!searchItem.value) return;
  if (searchItem.value.trim().length < 4) {
    return ElNotification({
      title: "Ошибка",
      type: "error",
      duration: 2000,
      message: "Слишком короткий запрос"
    });
  }
  router.push({
    name: "SearchResults",
    query: { q: encodeURI(searchItem.value.trim()) },
    force: true
  });
}

function getFirst(input: string | null | undefined): string {
  return input?.split(/\s/)[0] ?? "";
}

function goToCategory(name: string) {
  router.push(`/category/${name}`);
}

onMounted(() => {
  document.title = "Главная | MyEdu";
  window.scrollTo(0, 0);
  fetchAllCourses();
  fetchFeaturedCourses();
});
</script>





<style>

.home {
  justify-content: center;
  align-items: center;
}

.content-container {
  display: flex;
  align-items: center;
}

.main-body {
  margin: auto;
  width: 75% !important;
  padding: 1em;
}

.course-box {
  display: flex;
  width: 100%;
  flex-direction: row;
  align-self: center;
  margin: auto;
  align-content: space-around;
  border: 1px solid var(--el-border-color-darker);
  border-radius: 30%;
}

.banner-image {
  height: 30em;
  width: 40em;
  background: url("../assets/main-vector.jpg") center no-repeat;
  background-size: cover;
  overflow-x: hidden;
  overflow-y: hidden;
  border-radius: 50px;
  display: block;
  margin: 0 auto;
}

#header-box {
  text-align: left;
  color: black;
  padding-left: 15%;
  padding-top: 5%;
  width: 20%;
  height: 250px;
}

.courseCard {
  width: min-content;
  height: 20em;
}

.courseCard:hover {
  cursor: pointer;
}

.serif-head {
  font-family: "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
}

.serif-subtitle {
  font-family: "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  color: rgb(245, 148, 29);
  font-weight: 400;
}

.sub-heading {
  color: gray;
}

.sub-gray {
  color: gray;
  font-weight: 400;
  font-size:medium;
}

.catArea {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 95%;
}

.catSingle {
  
  
  font-weight: 800;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2em 7em;
  margin: 2.5em;
  border-radius: 2em;
  box-shadow: 20px 20px 60px #bebebe, -20px -20px 60px #ffffff;
  overflow: hidden;
  transition: transform 0.2s ease;
}

.catSingle span {
  font-size: 3em;
}

.catSingle h3 {
  margin: 0.5em 0;
}

.catSingle p {
  margin: 0;
}

.catSingle:hover {
  transform: scale(1.1);
  background-color: var(--primary);
  cursor: pointer;
  color: var(--vt-c-white-soft);
}

@media screen and (max-width: 770px) {
  #header-box {
    width: 60%;
  }

  .courseCard {
    height: 100%;
  }

  .flex {
    display: block;
  }

  .catArea {
    flex-wrap: nowrap;
    overflow-x: scroll;
  }
}
</style>
