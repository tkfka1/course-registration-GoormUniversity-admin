import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Pagination from 'v-pagination-3';

import App from './App.vue';
import { router } from './router';

// setup fake backend
// import { fakeBackend } from './helpers';
// fakeBackend();

const app = createApp(App);
app.component('pagination', Pagination);

app.use(createPinia());
app.use(router);

app.mount('#app');
