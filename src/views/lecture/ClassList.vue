<script setup>
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useLectureClassStore } from '@/stores';

const lectureClassStore = useLectureClassStore();
const { lectureClass } = storeToRefs(lectureClassStore);

lectureStore.getAll();
const route = useRoute();
const lid = route.params.lid;
console.log(lid)
console.log("list : lectureClass")

</script>

<template>
    <h1>강의 분반</h1>
    <h3>~~~ 전공</h3>
    <h3>~~~ 강의</h3>
    <h3>~~~ 학점</h3>
    <router-link :to="`/lecture/class/${lid}/add`" class="btn btn-sm btn-success mb-2">분반 추가</router-link>
    <table class="table table-striped">
        <thead>
            <tr>
                <th style="width: 20%">교수명</th>
                <th style="width: 20%">최소인원</th>
                <th style="width: 20%">최대인원</th>
                <th style="width: 20%">수강신청인원</th>
                <th style="width: 20%"></th>
            </tr>
        </thead>
        <tbody>
            <template v-if="lecture.length">
                <tr v-for="user in lecture" :key="user.id">
                    <td>{{ user.name }}</td>
                    <td>{{ user.major.name }}</td>
                    <td>{{ user.credit }}</td>
                    <td>{{ user.credit }}</td>
                    <td style="white-space: nowrap">
                        <router-link :to="`/lecture/edit/${user.id}`" class="btn btn-sm btn-primary mr-1">강의세부</router-link>
                        <router-link :to="`/lecture/edit/${user.id}`" class="btn btn-sm btn-primary mr-1">수정</router-link>
                        <button @click="lectureStore.delete(user.id)" class="btn btn-sm btn-danger btn-delete-user" :disabled="user.isDeleting">
                            <span v-if="user.isDeleting" class="spinner-border spinner-border-sm"></span>
                            <span v-else>삭제</span>
                        </button>
                    </td>
                </tr>
            </template>
            <tr v-if="lecture.loading">
                <td colspan="4" class="text-center">
                    <span class="spinner-border spinner-border-lg align-center"></span>
                </td>
            </tr>
            <tr v-if="lecture.error">
                <td colspan="4">
                    <div class="text-danger">Error loading lecture: {{lecture.error}}</div>
                </td>
            </tr>            
        </tbody>
    </table>
</template>
