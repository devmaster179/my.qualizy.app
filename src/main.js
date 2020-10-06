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

// Vuesax Component Framework
import Vuesax from 'vuesax'
import 'material-icons/iconfont/material-icons.css' //Material Icons
import 'vuesax/dist/vuesax.css'; // Vuesax
Vue.use(Vuesax)


// // axios
import axios from 'axios'
Vue.prototype.$http = axios

// Firebase-kk
import '@/firebase/firebaseInit'
// import '@/firebase/analytics'
// import '@/firebase/cloudMessage'

// import VueFireStore from 'vue-firestore'

// Vue.use(VueFireStore)
// ACL --kk
import acl from '@/acl/acl'


// Theme Configurations
import '../themeConfig.js'





// Styles: SCSS
import './assets/scss/main.scss'


// Tailwind
import '@/assets/css/main.css';


// Vue Router
import router from './router'


// Vuex Store
import store from './store/store'



// VeeValidate -kk
import VeeValidate from 'vee-validate';

Vue.use(VeeValidate);

// VueMoment --kk
const moment = require('moment')
import VueMoment from 'vue-moment'

import 'moment/locale/fr'
import 'moment/locale/en-gb'

Vue.use(VueMoment, {
  moment
})

import VueIntercom from 'vue-intercom';
Vue.use(VueIntercom, {
  language: 'fr',
  appId: 'neav79ns'
});

// import VueMixpanel from "vue-mixpanel"
// Vue.use(VueMixpanel, {
//   token: "ee92027ccac8a7d338ad16ed3cb98709",
// })

import Mixpanel from "mixpanel-browser"

Mixpanel.init("ee92027ccac8a7d338ad16ed3cb98709", { "api_host": "https://api-eu.mixpanel.com" }, "");
Vue.prototype.$mixpanel = Mixpanel

import userflow from 'userflow.js'
userflow.init('ct_5yfuhnvqnna67gd5sqn7jxhijq')
Vue.prototype.$userflow = userflow


// import html2canvas  from 'html2canvas'
// Vue.prototype.html2canvas = html2canvas

// Vue.use(Html2canvas)

import AsyncComputed from 'vue-async-computed'

Vue.use(AsyncComputed);

import i18n from './i18n/i18n.js'

// Vuesax Admin Filters
import './filters/filters'


// Vuejs - Vue wrapper for hammerjs
import {
  VueHammer
} from 'vue2-hammer'
Vue.use(VueHammer)

// Google Maps
import * as VueGoogleMaps from 'vue2-google-maps'
Vue.use(VueGoogleMaps, {
  load: {
    // Add your API key here
    key: 'AIzaSyDBZC72kClDayfBoP-Bz1Ppx1cawcIiYRM',
    libraries: 'places', // This is required if you use the Auto complete plug-in
  },
})

import VuePlaceAutocomplete from 'vue-place-autocomplete';

Vue.use(VuePlaceAutocomplete);


// PrismJS
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
// import { ValueFormatterService } from 'ag-grid-community';


// Feather font icon
require('./assets/css/iconfont.css')

// Karla font icon
require('./assets/css/karla.css')


import IdleVue from "idle-vue";
const eventsHub = new Vue();
Vue.use(IdleVue, {
  eventEmitter: eventsHub,
  store,
  idleTime: 1000 * 60 * 30, // 10min
  startAtIdle: false
});

// Clipboard
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard);

import VueSignaturePad from 'vue-signature-pad';

Vue.use(VueSignaturePad);


import SocialSharing from 'vue-social-sharing';
Vue.use(SocialSharing);

// Undo Redo Plugin

import VuexUndoRedo from "./undoRedoPlugin"
Vue.use(VuexUndoRedo)

import VueCalendly from "vue-calendly";
Vue.use(VueCalendly);

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

new Vue({
  router,
  store,
  i18n,
  acl,
  render: h => h(App)
}).$mount('#app')