<script setup>
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { fetchWrapper } from '@/helpers';
import { ref } from 'vue';

import { useLectureClassStore } from '@/stores';

const lectureClassStore = useLectureClassStore();
const { lectureClass } = storeToRefs(lectureClassStore);
lectureClassStore.getAll();

// 현재 강의 id 가져오기 lid
const route = useRoute();
const lid = route.params.lid;

const lactureName = ref("이름");
const lactureMajor = ref("강의");
const lactureCredit = ref("학점");

fetchWrapper.get(`/api/lecture/auth/${lid}`).then((res) => {
    lactureName.value = res.name;
    lactureMajor.value = res.major.name;
    lactureCredit.value = res.credit;

});

</script>

<template>
    <h1>강의 분반</h1>
    <br>
    <h3>전공 : {{ lactureMajor }}</h3>
    <h3>강의 : {{ lactureName }}</h3>
    <h3>학점 : {{ lactureCredit }} 학점</h3>
    <router-link :to="`/lecture/class/${lid}/add`" class="btn btn-sm btn-success mb-2">분반 추가</router-link>
    <table class="table table-striped">
        <thead>
            <tr>
                <th style="width: 15%">담당교수</th>
                <th style="width: 15%">최소인원</th>
                <th style="width: 15%">최대인원</th>
                <th style="width: 15%">수강인원</th>
                <th style="width: 15%">요일/교시</th>
                <th style="width: 15%">설명</th>
                <th style="width: 10%"></th>
            </tr>
        </thead>
        <tbody>
            <template v-if="lectureClass.length">
                <tr v-for="user in lectureClass.filter((l) => l.lecture.id === Number(lid))" :key="user.id" >
                    <td>{{ user.professor.name }}</td>
                    <td>{{ user.classMin }}</td>
                    <td>{{ user.classMax }}</td>
                    <td>{{ user.id }}</td>
                    <td>{{ user.week }} / {{ user.period }}</td>
                    <td>{{ user.explanation }}</td>
                    <td style="white-space: nowrap">
                        <router-link :to="`/lecture/class/${lid}/edit/${user.id}`" class="btn btn-sm btn-secondary mr-1">강의세부</router-link>
                        <router-link :to="`/lecture/class/${lid}/edit/${user.id}`" class="btn btn-sm btn-primary mr-1">수정</router-link>
                        <button @click="lectureClassStore.delete(user.id)" class="btn btn-sm btn-danger btn-delete-user" :disabled="user.isDeleting">
                            <span v-if="user.isDeleting" class="spinner-border spinner-border-sm"></span>
                            <span v-else>삭제</span>
                        </button>
                    </td>
                </tr>
            </template>
            <tr v-if="lectureClass.loading">
                <td colspan="4" class="text-center">
                    <span class="spinner-border spinner-border-lg align-center"></span>
                </td>
            </tr>
            <tr v-if="lectureClass.error">
                <td colspan="4">
                    <div class="text-danger">Error loading lecture: {{lectureClass.error}}</div>
                </td>
            </tr>            
        </tbody>
    </table>
</template>
