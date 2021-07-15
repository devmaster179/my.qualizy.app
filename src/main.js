/*=========================================================================================
  File Name: main.js
  Description: main vue(js) file
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import Vue from 'vue'
import App from './App.vue'

import './registerServiceWorker'

import './gist'
// Vuesax Component Framework
import Vuesax from 'vuesax'
import 'material-icons/iconfont/material-icons.css' //Material Icons
import 'vuesax/dist/vuesax.css'; // Vuesax
Vue.use(Vuesax)


// // axios
import axios from 'axios'
Vue.prototype.$http = axios
// Vue.prototype.$gist = gist

// SET firebase functions URL
// Vue.prototype.$firebaseFunctionUrl = "http://localhost:5001/the-haccp-app-249610/us-central1"
Vue.prototype.$firebaseFunctionUrl = "https://us-central1-the-haccp-app-249610.cloudfunctions.net"

// SET stripe global values
Vue.prototype.$stripePublishableKey = "pk_test_6dCN5HWGN4mXJVOHuF6NDjbq";

// Firebase-kk
import '@/firebase/firebaseInit'

// Theme Configurations
import '../themeConfig.js'


// Styles: SCSS
import './assets/scss/main.scss'


// Tailwind
import '@/assets/css/main.css';


// Vue Router
import router from './router'


import VueGtm from 'vue-gtm';

Vue.use(VueGtm, {
  id: 'GTM-TMSFKHD', // Your GTM single container ID or array of container ids ['GTM-xxxxxx', 'GTM-yyyyyy']
  defer: false, // defaults to false. Script can be set to `defer` to increase page-load-time at the cost of less accurate results (in case visitor leaves before script is loaded, which is unlikely but possible)
  enabled: true, // defaults to true. Plugin can be disabled by setting this to false for Ex: enabled: !!GDPR_Cookie (optional)
  debug: false, // Whether or not display console logs debugs (optional)
  loadScript: true, // Whether or not to load the GTM Script (Helpful if you are including GTM manually, but need the dataLayer functionality in your components) (optional)
  vueRouter: router, // Pass the router instance to automatically sync with router (optional)
  ignoredViews: [], // Don't trigger events for specified router names (case insensitive) (optional)
  trackOnNextTick: false, // Whether or not call trackView in Vue.nextTick
});

// Vuex Store
import store from './store/store'



// VeeValidate -kk
import VeeValidate from 'vee-validate';

Vue.use(VeeValidate);

// VueMoment --kk
import VueMoment from 'vue-moment'
import moment from 'moment-timezone'

import 'moment/locale/fr'
import 'moment/locale/en-gb'

Vue.use(VueMoment, {
  moment
})


import userflow from 'userflow.js'
userflow.init('ct_5yfuhnvqnna67gd5sqn7jxhijq')
Vue.prototype.$userflow = userflow


import i18n from './i18n/i18n.js'

// Vuesax Admin Filters
import './filters/filters'

// Feather font icon
require('./assets/css/iconfont.css')

// Karla font icon
require('./assets/css/karla.css')

// Globally Registered Components
import './globalComponents.js'

Vue.directive(
  "click-outside", {
  bind: function (el, binding) {
    const bubble = binding.modifiers.bubble;
    const handler = e => {
      if (bubble || (!el.contains(e.target) && el !== e.target)) {
        binding.value(e);
      }
    };
    el.__vueClickOutside__ = handler;
    document.addEventListener("click", handler);
  },

  unbind: function (el) {
    document.removeEventListener("click", el.__vueClickOutside__);
    el.__vueClickOutside__ = null;
  }
}
),

  Vue.config.productionTip = false

import "./connectionCronWorker"

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')