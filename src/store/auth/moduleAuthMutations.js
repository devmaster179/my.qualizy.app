/*=========================================================================================
  File Name: moduleAuthMutations.js
  Description: Auth Module Mutations
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

// import authCofig from './authConfig.js'

export default {
  UPDATE_AUTHENTICATED_USER(state, user) {
    localStorage.setItem('userInfo', JSON.stringify(user));
  },
}