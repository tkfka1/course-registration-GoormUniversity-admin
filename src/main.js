import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { router } from './router';
import Paginate from 'vuejs-paginate'

const app = createApp(App);
app.component('paginate', Paginate)
app.use(createPinia());
app.use(router);
app.mount('#app');
