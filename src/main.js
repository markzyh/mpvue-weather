import Vue from 'vue'
import App from './App'
//import axios from '@/js/ajax/ajax'
Vue.config.productionTip = false
App.mpType = 'app'
//Vue.prototype.$axios = axios

const app = new Vue(App)
app.$mount()