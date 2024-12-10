<template>
  <div>
    <!-- Пример использования date-fns для форматирования времени -->
    <div v-if="review" class="review-card">
      <div class="row">
        <div>
          <el-avatar :size="30" :src="attachAvatarLink(review.fullname)" />
        </div>
        <div>{{ review.fullname }}</div>
        <div>
          <el-rate :model-value="review.rating" disabled style="margin-top: -0.5em" />
        </div>
      </div>
      <div class="row">
        {{ review.content }}
      </div>
      <div class="row grey">
        Updated: &nbsp;
        {{ formattedDate }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, computed } from 'vue';
import type { ReviewDto } from '@/interfaces/custom';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

const props = defineProps<{
  review: ReviewDto | null
}>();

const formattedDate = computed(() => {
  if (props.review && props.review.updatedAt) {
    return formatDistanceToNow(new Date(props.review.updatedAt), { locale: ru }) + ' назад';
  }
  return '';
});

const attachAvatarLink = (username?: string) => {
  return `https://avatars.dicebear.com/api/initials/${username}.svg`;
};
</script>

<style scoped>
.row {
  display: flex;
  flex-direction: row;
  margin: 0.5em 0;
  justify-content: flex-start;
}

.row div {
  margin-right: 0.5em !important;
}

.review-card {
  max-width: 100%;
  display: flex;
  flex-direction: column;
  border-bottom: rgba(0, 0, 0, 0.2) solid 1px;
  padding: 0.5em 0;
}

.grey {
  color: gray;
}

.mystar {
  width: 1em;
  color: #ffa500;
}
</style>
