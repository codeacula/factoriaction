import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './sass/animations.scss';

createApp(App).use(router).mount('#app');
