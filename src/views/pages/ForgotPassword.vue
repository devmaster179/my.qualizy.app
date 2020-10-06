<!-- =========================================================================================
    File Name: ForgotPassword.vue
    Description: FOrgot Password Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuesax Admin - VueJS Dashboard Admin Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div class="h-screen flex w-full" style="margin-top:-70px;">
    <div class="vx-col w-4/5 sm:w-4/5 md:w-3/5 lg:w-3/4 xl:w-3/5 mx-auto self-center">
      <vx-card>
        <div slot="no-body" class="full-page-bg-color">
          <div class="vx-row">
            <div class="vx-col hidden sm:hidden md:hidden lg:block lg:w-1/2 mx-auto self-center">
              <img src="@/assets/images/pages/forgot-password.png" alt="login" class="mx-auto" />
            </div>
            <div class="vx-col sm:w-full md:w-full lg:w-1/2 mx-auto self-center d-theme-dark-bg">
              <div class="p-8">
                <div class="vx-card__title mb-8">
                  <h4 class="mb-4">Recover your password</h4>
                  <p>Please enter your email address and we'll send you instructions on how to reset your password.</p>
                </div>
                <div class="mb-4">
                  <vs-input
                    v-validate="'required|email|min:3'"
                    data-vv-validate-on="blur"
                    name="email"
                    label-placeholder="Email"
                    v-model="email"
                    class="w-full"
                  />
                  <span class="text-danger text-sm">{{ errors.first('email') }}</span>
                </div>

                <vs-button
                  type="border"
                  to="/pages/login"
                  class="px-4 w-full md:w-auto"
                >Back To Login</vs-button>
                <vs-button
                  :disabled="errors.any() || email==''"
                  class="float-right px-4 w-full md:w-auto mt-3 mb-8 md:mt-0 md:mb-0"
                  @click="resetPassword"
                >Recover Password</vs-button>
              </div>
            </div>
          </div>
        </div>
      </vx-card>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";

import { db } from "@/firebase/firebaseConfig";

export default {
  data() {
    return {
      email: ""
    };
  },
  methods: {
    resetPassword() {
      db.collection("users")
        .where("email", "==", this.email)
        .get()
        .then(q => {
          if (q.empty) {
            this.$vs.notify({
              time: 8000,
              title: "No Email !",
              text: `Email is not exist !
                               Pealse input email again.         
                        `,
              iconPack: "feather",
              icon: "icon-alert-circle",
              color: "warning"
            });
            this.email = "";
          } else {
            this.$vs.notify({
              time: 8000,
              title: "Success",
              text: `Reset password email have been sent !
                               Pealse check your email.         
                        `,
              iconPack: "feather",
              icon: "icon-alert-circle",
              color: "success"
            });
            firebase.auth().sendPasswordResetEmail(this.email);
          }
        });
    }
  }
};
</script>
