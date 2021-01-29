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

// Element UI
// import ElementUI from 'element-ui';
// import './assets/scss/element-ui-variables.scss';
// Vue.use(ElementUI);

// // axios
import axios from 'axios'
Vue.prototype.$http = axios
// Vue.prototype.$gist = gist

// Firebase-kk
import '@/firebase/firebaseInit'
// import '@/firebase/analytics'
// import '@/firebase/cloudMessage'

// import VueFireStore from 'vue-firestore'

// Vue.use(VueFireStore)
// ACL --kk


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
const moment = require('moment')
import VueMoment from 'vue-moment'

import 'moment/locale/fr'
import 'moment/locale/en-gb'

Vue.use(VueMoment, {
  moment
})


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


// import IdleVue from "idle-vue";
// const eventsHub = new Vue();
// Vue.use(IdleVue, {
//   eventEmitter: eventsHub,
//   store,
//   idleTime: 1000 * 60 * 30, // 10min
//   startAtIdle: false
// });

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
  render: h => h(App)
}).$mount('#app')