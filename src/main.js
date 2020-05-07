// import Vue from 'vue'
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
// import Highlight from './components/highlight'; 
import App from './App'
import router from './router'
import './style/index.css';
import request from './components/request.js';


// Vue.use(Highlight);
// Vue.use(ElementUI);
Vue.config.productionTip = false
Vue.prototype.request = request;
// Vue.prototype.baseUrl = "http://192.168.1.185:9090";
Vue.prototype.baseUrl = window.location.origin;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

