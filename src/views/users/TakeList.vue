<script setup>
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { useTakeLectureStore } from '@/stores';
import { fetchWrapper } from '@/helpers';
import { ref } from 'vue';


const takeLectureStore = useTakeLectureStore();
const { take } = storeToRefs(takeLectureStore);
takeLectureStore.getAll();


// 현재 강의 id 가져오기 lid
const route = useRoute();
const lid = route.params.lid;

const name = ref("이름");
const studentId = ref("학번");
const credit = ref(0);
const usecredit = ref(0);


fetchWrapper.get(`/api/user/auth/${lid}`).then((res) => {
    name.value = res.name;
    studentId.value = res.studentId;
    credit.value = res.credit;

});



// for (const property in major){
//     console.log(`${property}: ${object[property]}`);
// }



</script>

<template>

    <h1>수강 목록</h1>
    <br>
    <h3>이름 : {{ name }}</h3>
    <h3>학번 : {{ studentId }}</h3>
    <h3>학점 : {{ credit }}</h3>
    <h3>수강가능학점 : {{ usecredit }}</h3>
    <router-link :to="`/users/take/${lid}/add`" class="btn btn-sm btn-success mb-2">학생 추가</router-link>
    <table class="table table-striped">
        <thead>
            <tr>
                <th style="width: 85%">강의이름</th>
                <th style="width: 15%"></th>
            </tr>
        </thead>
        <tbody>
            <template v-if="take.length">
                <tr v-for="user in take" :key="user.id">
                    <td>{{ user.lectureClass.id }}</td>
                    <td style="white-space: nowrap">
                        <router-link :to="`/users/take/${user.id}`" class="btn btn-sm btn-secondary mr-1">강의세부</router-link>
                        <router-link :to="`/users/take/${lid}/edit/${user.id}`" class="btn btn-sm btn-primary mr-1">수정</router-link>
                        <button @click="takeLectureStore.delete(user.id)" class="btn btn-sm btn-danger btn-delete-user" :disabled="user.isDeleting">
                            <span v-if="user.isDeleting" class="spinner-border spinner-border-sm"></span>
                            <span v-else>삭제</span>
                        </button>
                    </td>
                </tr>
            </template>
            <tr v-if="take.loading">
                <td colspan="4" class="text-center">
                    <span class="spinner-border spinner-border-lg align-center"></span>
                </td>
            </tr>
            <tr v-if="take.error">
                <td colspan="4">
                    <div class="text-danger">Error loading take: {{take.error}}</div>
                </td>
            </tr>            
        </tbody>
    </table>

    <table class="table table-striped">
        <thead>
            <tr>
                <th style="width: 85%">강의이름</th>
                <th style="width: 15%"></th>
            </tr>
        </thead>
        <tbody>
            <template v-if="take.length">
                <tr v-for="user in take" :key="user.id">
                    <td>{{ user.lectureClass.id }}</td>
                    <td style="white-space: nowrap">
                        <router-link :to="`/users/take/${user.id}`" class="btn btn-sm btn-secondary mr-1">강의세부</router-link>
                        <router-link :to="`/users/take/${lid}/edit/${user.id}`" class="btn btn-sm btn-primary mr-1">수정</router-link>
                        <button @click="takeLectureStore.delete(user.id)" class="btn btn-sm btn-danger btn-delete-user" :disabled="user.isDeleting">
                            <span v-if="user.isDeleting" class="spinner-border spinner-border-sm"></span>
                            <span v-else>삭제</span>
                        </button>
                    </td>
                </tr>
            </template>
            <tr v-if="take.loading">
                <td colspan="4" class="text-center">
                    <span class="spinner-border spinner-border-lg align-center"></span>
                </td>
            </tr>
            <tr v-if="take.error">
                <td colspan="4">
                    <div class="text-danger">Error loading take: {{take.error}}</div>
                </td>
            </tr>            
        </tbody>
    </table>
</template>
