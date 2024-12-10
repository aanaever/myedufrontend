<template>
  <div class="main-view">
    <h3>{{ singleCourse.title }}</h3>
    <div class="mycontainer">
      <div class="col-1">
        <!-- LEFT PANEL, video frame  -->
        <div class="row-big">
          <youtube-iframe
            v-if="isYoutubeVideo"
            :video-id="videoKey"
            :player-width="850"
            :player-height="478"
            :no-cookie="true"
            @state-change="handleChange"
            :player-parameters="playerParams"
          ></youtube-iframe>
          <video v-else :src="videoUrl" controls width="850" height="478" @error="handleVideoError"></video>
        </div>
        <div class="rowsmall">
          <div>
            <p class="lessonTitle" v-if="videoResponse.lesson?.lessonName">
               {{ videoResponse.lesson?.lessonName }}
              <span>| {{ formatDuration(videoResponse.lesson?.lengthSeconds ?? 0) }}</span>
            </p>
            <p class="full-only">{{ singleCourse.subtitle }}</p>
            <div>
              <el-button type="primary" @click="toggleReviewDialog()">
                {{ myReview.id ? "Редактировать отзыв" : "Оставьте отзыв" }}
                <el-icon>
                  <Edit />
                </el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT PANEL, LESSON PLAYLIST -->
      <div class="col-2">
        <h3>Уроки</h3>
        <el-collapse v-model="activeName">
          <el-collapse-item name="99">
            <div class="lessonlist">
              <div
                class="lesson-item"
                :class="{ bkg: item.id === lessonId }"
                v-for="item in lessonList"
                @click="goToLesson(item.id)"
                :key="item.id"
              >
                <div>
                  <div>{{ item.lesson_name }}</div>
                  <div>
                    <clock class="videolen" />
                    {{ formatDuration(parseInt(item.video_time)) }}
                  </div>
                </div>
                <div>
                  <input type="checkbox" :checked="item.is_watched" disabled />
                </div>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>

    <!-- BEGIN DIALOG FOR REVIEW -->
    <el-dialog v-model="dialogShow" title="Оставьте ваш отзыв">
      <el-form :model="formReview" @submit.prevent="postReview">
        <el-form-item label="Ваш рейтинг">
          <el-rate v-model="formReview.rating" show-text text-color="#000000" />
        </el-form-item>
        <el-form-item label="Content">
          <el-input type="textarea" :rows="3" maxlength="300" show-word-limit v-model="formReview.content" />
        </el-form-item>
        <div style="width: 50%; display: flex; justify-content: center">
          <el-button native-type="submit" :loading="isLoading" type="primary"> Submit Review </el-button>
        </div>
      </el-form>
    </el-dialog>
    <!-- END OF DIALOG -->
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CourseService from '@/service/CourseService';
import EnrollService from '@/service/EnrollService';
import LessonService from '@/service/LessonService';
import ReviewService from '@/service/ReviewService';
import { ElMessage } from 'element-plus';
import { Clock, Edit } from '@element-plus/icons-vue';
import type { AxiosResponse } from 'axios';
import { handleApiError } from '@/util/http_util';
import type { Course, Review } from "@/interfaces/myedu";
import type { CustomLesson, VideoRequest, VideoResponse, WatchStatus } from "@/interfaces/custom";
import { useStudentStore } from "@/stores"; 

const route = useRoute();
const router = useRouter();
const store = useStudentStore();
const activeName = ref("99");
const videoKey = ref("");
const dialogShow = ref(false);
const enrollId = ref(0);
const courseId = ref(0);
const lessonId = ref("");
const videoResponse: Partial<VideoResponse> = reactive({});
const singleCourse: Partial<Course> = reactive({});
const lessonList = ref<CustomLesson[]>([]);
const status: Partial<WatchStatus> = reactive({});
const errorMsg = ref("");
const playerParams: YT.PlayerVars = reactive({ modestbranding: 1, rel: 0 });
const isLoading = ref(false);
const myReview: Partial<Review> = reactive({});
const formReview = reactive({
  id: 0,
  rating: 0,
  content: "",
  courseId: 0
});

const videoUrl = ref("");
const isYoutubeVideo = ref(false);

// Добавляем функцию formatDuration
function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return [hrs, mins, secs]
    .map(v => (v < 10 ? '0' + v : v))
    .filter((v, i) => v !== '00' || i > 0)
    .join(':');
}

function getPlayLink(obj: VideoRequest) {
  EnrollService.buildPlayLink(obj)
    .then(res => {
      Object.assign(videoResponse, res.data);
      setVideoInfo(videoResponse);
      fetchSingleCourse(courseId.value);
      fetchMyLessons(courseId.value, enrollId.value);
    })
    .catch(err => {
      handleApiError(err);
      errorMsg.value = 'Error loading video';
    });
}

function handleVideoError(event: Event) {
  console.error('Error loading video:', event);
  ElMessage.error('Error loading video. Please try again later.');
}

function fetchSingleCourse(courseId: number) {
  CourseService.getById(courseId).then(res => {
    const course = res.data;
    if (course.status !== 'APPROVED' && !store.isAdmin) {
      throw new Error('This course is not available.');
    }
    Object.assign(singleCourse, course);
    document.title = `Lecture | ${singleCourse.title} | Myedu`;
  }).catch(error => {
    errorMsg.value = error.message;
  });
}

function fetchMyLessons(courseId: number, enrollId: number) {
  LessonService.getWatchedList(courseId, enrollId).then(res => (lessonList.value = res.data));
}

function setVideoInfo(response: Partial<VideoResponse>) {
  if (!response || !response.enrollId) return;
  const videoKeyVal = response.lesson?.videokey || "";
  lessonId.value = response.lesson?.id || "";
  enrollId.value = response.enrollId;

  if (videoKeyVal.includes("http") || videoKeyVal.includes("youtube")) {
    isYoutubeVideo.value = true;
    videoKey.value = videoKeyVal;
    videoUrl.value = "";
  } else {
    isYoutubeVideo.value = false;
    videoUrl.value = `http://localhost:9000/videos/${videoKeyVal}`;
  }
}

function handleOKReview(res: AxiosResponse) {
  getMyReview(courseId.value);
  dialogShow.value = false;
  ElMessage.success(res.data.message);
}

function handleChange(e: YT.OnStateChangeEvent) {
  if (e.data === 0) { // e.data === 0 означает, что видео завершилось
    console.log('Video ended, updating watch status...');
    Object.assign(status, {
      enrollId: enrollId.value,
      courseId: singleCourse.id,
      currentLessonId: videoResponse?.lesson?.id || "0"
    });
    updateWatchStatus(status);
  }
}

function postReview() {
  formReview.courseId = courseId.value;
  isLoading.value = true;
  toggleReviewDialog();
  const service = formReview.id ? ReviewService.editMine(formReview.id, formReview) : ReviewService.addNew(formReview);

  service
    .then(res => handleOKReview(res))
    .catch(err => handleApiError(err))
    .finally(() => (isLoading.value = false));
}

async function refreshPlayer(lessonId: string) {
  const link = `/videoplayer/course/${singleCourse.id}/lesson/${lessonId}`;
  await router.push({ path: link, force: true });
  window.location.reload();
}

function toggleReviewDialog() {
  dialogShow.value = !dialogShow.value;
  errorMsg.value = "";
}

function updateWatchStatus(obj: Partial<WatchStatus>) {
  console.log('Updating watch status with:', obj);
  EnrollService.updateStatus(obj)
    .then(res => {
      console.log('Watch status updated:', res.data);
      const nextLessonId: string = res.data.nextLessonId;
      if (!nextLessonId) {
        ElMessage.success(res.data.message);
        router.replace({ name: "MyLearning" });
        return;
      }
      refreshPlayer(nextLessonId);
    })
    .catch(err => {
      console.error('Error updating watch status:', err);
      handleApiError(err);
    });
}

function goToLesson(id: string) {
  lessonId.value = id;
  refreshPlayer(id);
}

function getMyReview(courseId: number) {
  ReviewService.getMineOnCourse(courseId)
    .then(res => Object.assign(myReview, res.data))
    .then(() => Object.assign(formReview, myReview))
    .catch(_err => {});
}

onMounted(() => {
  const { lessonId } = route.params;
  const courseIdParam = route.params.courseId;
  const numCourseId = courseIdParam ? parseInt(courseIdParam.toString()) : 0;
  const req: VideoRequest = {
    courseId: numCourseId,
    lessonId: lessonId.toString()
  };
  courseId.value = numCourseId;
  getPlayLink(req);
  getMyReview(courseId.value);
});

</script>

<style lang="scss" scoped>
.main-view {
  padding: 0 5% !important;
}
.mycontainer {
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 100%;
}
.col-1 {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 70%;
}
.col-2 {
  display: flex;
  flex-direction: column;
  height: auto;
  width: 30%;
}

.row-big {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  height: 0;
}

.row-big iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.rowsmall {
  display: flex;
  flex-direction: row;
  height: 30%;
}
.lessonTitle {
  font-size: 1.5em;
  margin-bottom: 1em;
}
.videolen {
  width: 1em;
  height: 1em;
  margin-right: 0.5em;
}
.lesson-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0.5em 0.5em 1em;
  border-bottom: 1px solid rgba(0, 0, 0, 0.25);
}
.lesson-item:hover {
  background: whitesmoke;
  cursor: pointer;
}
.bkg {
  background: var(--primary);
  font-weight: 700;
  color: white;
}
.bkg:hover {
  background: var(--secondary);
  color: white;
}
.el-dialog {
  width: 30% !important;
}

@media screen and (max-width: 1366px) {
  .col-1 {
    width: 60% !important;
  }
  .col-2 {
    width: 30%;
  }
}
@media screen and (max-width: 1280px) {
  .main-view {
    max-width: 100%;
    padding: 0;
    margin: 0;
  }
  .mycontainer {
    display: block;
    flex-direction: column;
    max-width: 100% !important;
    overflow-x: hidden !important;
    height: 100%;
  }
  div[class="vue-youtube-iframe"] {
    max-width: 100% !important;
    width: 100% !important;
  }
  iframe[id^="vue-youtube-iframe-1"] {
    position: absolute;
    max-width: 100% !important;
    width: 100%;
    height: auto;
  }
  .rowsmall {
    display: block;
    height: fit-content;
  }
  .col-1,
  .col-2 {
    display: block;
    width: 100%;
  }
  .col-1 {
    display: block;
    height: fit-content;
  }

  .el-dialog {
    width: 100% !important;
  }
}
</style>

