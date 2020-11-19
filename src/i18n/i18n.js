/*=========================================================================================
  File Name: i18n.js
  Description: i18n configuration file. Imports i18n data.
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import Vue from 'vue'
import VueI18n from 'vue-i18n'
import engb from './en-gb'
import enus from './en-us'
import fr from './fr'
import es from './es'
import it from './it'


Vue.use(VueI18n)

export default new VueI18n({
  locale: 'en-us', // set default locale
  messages: {
    "en-gb": engb,
    "en-us": enus,
    "fr": fr,
    "es": es,
    "it": it
  }
})