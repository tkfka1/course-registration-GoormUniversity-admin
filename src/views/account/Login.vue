<script setup>
import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';

import { useAuthStore } from '@/stores';



import { useUsersStore } from '@/stores';
const usersStore = useUsersStore();
const { users } = storeToRefs(usersStore);

usersStore.getAll();

const schema = Yup.object().shape({
    adminId: Yup.string().required('교원번호를 입력하세요'),
    password: Yup.string().required('비밀번호를 입력하세요')
});

async function onSubmit(values) {
    console.log(values);
    const authStore = useAuthStore();
    const { adminId, password } = values;
    await authStore.login(adminId, password);
}
</script>

<template>
    <div class="card m-3">
        <h4 class="card-header">구름대학교 수강신청 시스템(admin)</h4>
        <div class="card-body">
            <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors, isSubmitting }">
                <div class="form-group">
                    <label>교원번호</label>
                    <Field name="adminId" type="text" class="form-control" :class="{ 'is-invalid': errors.adminId }" />
                    <div class="invalid-feedback">{{ errors.adminId }}</div>
                </div>
                <div class="form-group">
                    <label>비밀번호</label>
                    <Field name="password" type="password" class="form-control" :class="{ 'is-invalid': errors.password }" />
                    <div class="invalid-feedback">{{ errors.password }}</div>
                </div>
                <div class="form-group">
                    <button class="btn btn-primary" :disabled="isSubmitting">
                        <span v-show="isSubmitting" class="spinner-border spinner-border-sm mr-1"></span>
                        로그인
                    </button>
                    <router-link to="register" class="btn btn-link">회원가입</router-link>
                </div>
            </Form>
        </div>
    </div>






    <h1>학생 목록</h1>
    <router-link to="/users/add" class="btn btn-sm btn-success mb-2">학생 추가</router-link>
    <table class="table table-striped">
        <thead>
            <tr>
                <th>학번</th>
                <th>이름</th>
                <th>학년</th>
                <th>전공</th>
                <th>학점</th>
                <th>이메일</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <template v-if="users.length">
                <tr v-for="user in users" :key="user.id">
                    <td>{{ user.studentId }}</td>
                    <td>{{ user.name }}</td>
                    <td>{{ user.grade  }}</td>
                    <td>{{ user.major.name  }}</td>
                    <td>{{ user.haveCredit }} / {{ user.credit }}</td>
                    <td>{{ user.email }}</td>
                    <td style="white-space: nowrap">
                        <router-link :to="`/users/take/${user.id}`" class="btn btn-sm btn-secondary mr-1">수강목록</router-link>
                        <router-link :to="`/users/edit/${user.id}`" class="btn btn-sm btn-primary mr-1">수정</router-link>
                        <button @click="usersStore.delete(user.id)" class="btn btn-sm btn-danger btn-delete-user" :disabled="user.isDeleting">
                            <span v-if="user.isDeleting" class="spinner-border spinner-border-sm"></span>
                            <span v-else>삭제</span>
                        </button>
                    </td>
                </tr>
            </template>
            <tr v-if="users.loading">
                <td colspan="4" class="text-center">
                    <span class="spinner-border spinner-border-lg align-center"></span>
                </td>
            </tr>
            <tr v-if="users.error">
                <td colspan="4">
                    <div class="text-danger">Error loading users: {{users.error}}</div>
                </td>
            </tr>            
        </tbody>
    </table>


</template>
