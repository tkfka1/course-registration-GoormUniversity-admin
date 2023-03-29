<script setup>
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { useTakeLectureStore , useLectureClassStore , useAlertStore } from '@/stores';
import { fetchWrapper } from '@/helpers';
import { ref } from 'vue';


const takeLectureStore = useTakeLectureStore();
const { take } = storeToRefs(takeLectureStore);
takeLectureStore.getAll();

const lectureClassStore = useLectureClassStore();
const { lectureClass } = storeToRefs(lectureClassStore);
lectureClassStore.getAll();

const alertStore = useAlertStore();

// 현재 강의 id 가져오기 lid
const route = useRoute();
const lid = route.params.lid;

// 내 정보 가져오기
const name = ref("이름");
const studentId = ref("학번");
const credit = ref(0);
const haveCredit = ref(0);
const majorId = ref(0);

function myinfo(){
    fetchWrapper.get(`/api/user/auth/${lid}`).then((res) => {
    name.value = res.name;
    studentId.value = res.studentId;
    credit.value = res.credit;
    haveCredit.value = res.haveCredit;
    majorId.value = res.major.id;
    });
}
myinfo()

function getUseCredit(num) {
    usecredit.value = usecredit.value - num;
    return num;
}

function findMajorId(){
    return majorId.value;
}


async function takeLectureClass(id,lid,name,cred) {
    var data = new Object();
    var lectureClass = new Object();
    var user = new Object();
    lectureClass.id = String(id);
    user.id = lid;
    data.lectureClass = lectureClass;
    data.user = user;
    data.credit = cred;

    if(credit.value < haveCredit.value + cred){
        alertStore.error("학점이 부족합니다.");
        return;
    }

    try {
        await takeLectureStore.register(data);
        alertStore.success( name + ' 수강 신청 완료');
    } catch (error) {
        if(error == "500"){
            alertStore.error("이미 수강신청된 강의입니다.");
        }else{
            alertStore.error(error);
        }
    }
    takeLectureStore.getAll();
    lectureClassStore.getAll();
    myinfo();
}

async function delLectureClass(id) {
    await takeLectureStore.delete(id)
    myinfo();
}

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
    <h3>이름 : {{ name }}</h3>
    <h3>학번 : {{ studentId }}</h3>
    <h3>최대학점 : {{ credit }}</h3>
    <h3>남은학점 : {{ haveCredit }}</h3>
    <br>
    <h1>수강 목록</h1>
    <table class="table table-striped">
        <thead>
            <tr>
                <th style="width: 28%">강의이름</th>
                <th style="width: 28%">교수이름</th>
                <th style="width: 28%">학점</th>
                <th style="width: 28%">요일/교시</th>
                <th style="width: 16%"></th>
            </tr>
        </thead>
        <tbody>
            <template v-if="take.length">
                <tr v-for="user in take.filter((u) => u.user.id === Number(lid))" :key="user.id">
                    <td>{{ user.lectureClass.lecture.name }}</td>
                    <td>{{ user.lectureClass.professor.name }}</td>
                    <td>{{ user.lectureClass.lecture.credit }}</td>
                    <td>{{ makeweek(user.lectureClass.week) }} / {{ user.lectureClass.period }}교시</td>
                    <td style="white-space: nowrap">
                        <router-link :to="`/users/take/${user.id}`" class="btn btn-sm btn-secondary mr-1">강의세부</router-link>
                        <button @click="delLectureClass(user.id)" class="btn btn-sm btn-danger mr-1" :disabled="user.isDeleting">
                            <span v-if="user.isDeleting" class="spinner-border spinner-border-sm"></span>
                            <span v-else>수강삭제</span>
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

    <br>
    <h1>수강 가능 목록</h1>

    <table class="table table-striped">
        <thead>
            <tr>
                <th style="width: 18%">강의명</th>
                <th style="width: 18%">담당교수</th>
                <th style="width: 18%">학점</th>
                <th style="width: 18%">현재수강/최대인원</th>
                <th style="width: 18%">요일/교시</th>
                <th style="width: 10%"></th>
            </tr>
        </thead>
        <tbody>
            <template v-if="lectureClass.length">
                <tr v-for="user in lectureClass.filter((l) => l.lecture.major.id === findMajorId())" :key="user.id" >
                    <td>{{ user.lecture.name }}</td>
                    <td>{{ user.professor.name }}</td>
                    <td>{{ user.lecture.credit }}</td>
                    <td>{{ user.classPeople }} / {{ user.classMax }}</td>
                    <td>{{ makeweek(user.week) }} / {{ user.period }}교시</td>
                    <td style="white-space: nowrap">
                        <router-link :to="`/lecture/class/${lid}/edit/${user.id}`" class="btn btn-sm btn-secondary mr-1">강의세부</router-link>
                        <button @click="takeLectureClass(user.id, lid, user.lecture.name , user.lecture.credit )" class="btn btn-sm btn-primary mr-1" :disabled="user.isDeleting">
                            <span>수강신청</span>
                        </button>
                    </td>
                </tr>
            </template>
            <tr v-if="lectureClass.loading">
                <td colspan="4" class="text-center">
                    <span class="spinner-border spinner-border-lg align-center"></span>
                </td>
            </tr>         
        </tbody>
    </table>
</template>
