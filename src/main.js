import './assets/main.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.min.js';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import axios from 'axios';
import { Toast, Modal } from 'bootstrap';

const app = createApp(App)

app.use(createPinia())
app.use(router)

axios.defaults.withCredentials = true;
app.config.globalProperties.axios = axios;
app.config.globalProperties.Toast = Toast;
app.config.globalProperties.Modal = Modal;
const origin = "http://localhost:8000";
app.config.globalProperties.origin = origin;
app.config.globalProperties.api = origin+"/api/v1";

app.mount('#app')
