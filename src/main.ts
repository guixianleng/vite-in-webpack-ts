import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { setupStore } from '@/store';

import ElementPlus from 'element-plus';
import { CrfUi } from 'crf-ui';

import 'element-plus/dist/index.css';
import 'crf-ui/dist/css/css/style.css';

const app = createApp(App);
setupStore(app);

app.use(router).use(ElementPlus).use(CrfUi).mount('#app');
