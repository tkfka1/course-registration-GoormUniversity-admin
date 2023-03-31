<script setup>
import { storeToRefs } from 'pinia';
import { fetchWrapper } from '@/helpers';
import { useAuthStore } from '@/stores';
import { ref } from 'vue';


const authStore = useAuthStore();
const { user } = storeToRefs(authStore);


const name = ref("이름");
const adminId = ref("학번");

fetchWrapper.get(`/api/admin/auth/${user._object.user.id}`).then((res) => {
    console.log(res);
    name.value = res.name;
    adminId.value = res.adminId;

});

</script>

<template>
    <div v-if="user">
        <h1>안녕하세요 {{ name }}!</h1>
        <p>구름대학 수강신청에 오신것을 환영합니다.</p>
        <p><router-link to="/users">test1</router-link></p>

        <td>{{ adminId }}</td>
        <td>{{ name }}</td>

                    <p>dsa</p>    

    </div>

  <div>
    <ul>
      <li v-for="item in paginatedItems" :key="item.id">{{ item }}</li>
    </ul>
    <div>
      <button :disabled="currentPage === 1" @click="prevPage">Prev</button>
      <span>Page {{ currentPage }} of {{ pageCount }}</span>
      <button :disabled="currentPage === pageCount" @click="nextPage">Next</button>
    </div>
  </div>



</template>


<script>
export default {
  data() {
    return {
      items: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7', 'Item 8', 'Item 9', 'Item 10'],
      itemsPerPage: 3,
      currentPage: 1
    }
  },
  computed: {
    paginatedItems() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage
      const endIndex = startIndex + this.itemsPerPage
      return this.items.slice(startIndex, endIndex)
    },
    pageCount() {
      return Math.ceil(this.items.length / this.itemsPerPage)
    }
  },
  methods: {
    nextPage() {
      if (this.currentPage < this.pageCount) {
        this.currentPage++
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    }
  }
}
</script>