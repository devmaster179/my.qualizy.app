/*=========================================================================================
  File Name: moduleAuthState.js
  Description: Auth Module State
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


// import auth from "@/auth/authService";
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  isUserLoggedIn: () => {
    let isAuthenticated = false;
    const firebaseCurrentUser = firebase.auth().currentUser

    // get firebase current user
    // const firebaseCurrentUser = firebase.auth().currentUser;

    if (firebaseCurrentUser !== null) isAuthenticated = true
    else isAuthenticated = false

    return (localStorage.getItem('userLogin') && isAuthenticated);
    // return isAuthenticated;
  },
}