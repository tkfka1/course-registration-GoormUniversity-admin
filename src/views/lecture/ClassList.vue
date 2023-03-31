<script setup>
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { fetchWrapper } from '@/helpers';
import { ref } from 'vue';

import { useLectureClassStore } from '@/stores';
import { useTakeLectureStore } from '@/stores';

const lectureClassStore = useLectureClassStore();
const { lectureClass } = storeToRefs(lectureClassStore);
lectureClassStore.getAll();

const takeLectureStore = useTakeLectureStore();
const { take } = storeToRefs(takeLectureStore);
takeLectureStore.getAll();

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

function makeweek(week){
    if(week == 1){
        return "월";
    }else if(week == 2){
        return "화";
    }else if(week == 3){
        return "수";
    }else if(week == 4){
        return "목";
    }else if(week == 5){
        return "금";
    }else if(week == 6){
        return "토";
    }else if(week == 7){
        return "일";
    }
}

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
                <th style="width: 15%">강의인원</th>
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
                    <td>{{ user.classMin }}명</td>
                    <td>{{ user.classPeople }} / {{ user.classMax }}</td>
                    <td>{{ makeweek(user.week) }} / {{ user.period }}교시</td>
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
