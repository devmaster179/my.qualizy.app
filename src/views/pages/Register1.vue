<!-- =========================================================================================
    File Name: Register.vue
    Description: Register Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuesax Admin - VueJS Dashboard Admin Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div
    class="h-screen flex w-full vx-row no-gutter items-center justify-center relative"
    style="margin-top: -61px; padding-top:50px;"
  >
    <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 sm:m-0 m-4">
      <vx-card>
        <div slot="no-body" class="full-page-bg-color">
          <VuePerfectScrollbar class="scroll-area mt-4" :settings="settings" ref="taskListPS">
            <div class="vx-row no-gutter">
              <div class="vx-col hidden sm:hidden md:hidden lg:block lg:w-1/2 mx-auto self-center">
                <img src="@/assets/images/pages/register.jpg" alt="register" class="mx-auto" />
              </div>
              <div class="vx-col sm:w-full md:w-full lg:w-1/2 mx-auto self-center d-theme-dark-bg">
                <div class="p-8">
                  <div class="vx-card__title">
                    <h4 class="mb-4">Create Account</h4>
                    <p>Fill the below form to create a new account.</p>
                  </div>
                  <div class="clearfix">
                    <vs-input
                      v-validate="'min:3'"
                      name="company"
                      data-vv-validate-on="blur"
                      label-placeholder="Company Name"
                      placeholder="Company Name"
                      v-model="companyName"
                      class="w-full"
                    />
                    <span class="text-danger text-sm">{{ errors.first('company') }}</span>

                    <vs-input
                      v-validate="'required|min:3'"
                      data-vv-validate-on="blur"
                      label-placeholder="Username"
                      name="username"
                      placeholder="Username(John Doo)"
                      v-model="username"
                      class="w-full"
                    />
                    <span class="text-danger text-sm">{{ errors.first('username') }}</span>

                    <vs-input
                      v-validate="'required|email'"
                      data-vv-validate-on="blur"
                      name="email"
                      type="email"
                      label-placeholder="Email"
                      placeholder="Email"
                      v-model="email"
                      class="w-full mt-6"
                    />
                    <span class="text-danger text-sm">{{ errors.first('email') }}</span>

                    <vs-input
                      ref="password"
                      type="password"
                      data-vv-validate-on="blur"
                      v-validate="'required|min:6'"
                      name="password"
                      label-placeholder="Password"
                      placeholder="Password"
                      v-model="password"
                      class="w-full mt-6"
                    />
                    <span class="text-danger text-sm">{{ errors.first('password') }}</span>

                    <vs-input
                      type="password"
                      v-validate="'min:6|confirmed:password'"
                      data-vv-validate-on="blur"
                      data-vv-as="password"
                      name="confirm_password"
                      label-placeholder="Confirm Password"
                      placeholder="Confirm Password"
                      v-model="confirm_password"
                      class="w-full mt-6"
                    />
                    <span class="text-danger text-sm">{{ errors.first('confirm_password') }}</span>

                    <vs-checkbox
                      v-model="isTermsConditionAccepted"
                      class="mt-6"
                    >I accept the terms & conditions.</vs-checkbox>
                    <vs-button type="border" @click="login" class="mt-6">Login</vs-button>
                    <vs-button
                      class="float-right mt-6"
                      @click="registerUser"
                      :disabled="!validateForm"
                    >Register</vs-button>
                  </div>
                </div>
              </div>
            </div>
          </VuePerfectScrollbar>
        </div>
      </vx-card>
    </div>
  </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
  components: {
    VuePerfectScrollbar,
  },
  data() {
    return {
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.3,
      },
      username: "",
      companyName: "",
      email: "",
      password: "",
      confirm_password: "",
      isTermsConditionAccepted: true,
    };
  },
  computed: {
    validateForm() {
      return (
        !this.errors.any() &&
        this.username != "" &&
        this.email != "" &&
        this.password != "" &&
        this.confirm_password != "" &&
        this.isTermsConditionAccepted === true
      );
    },
  },
  
  methods: {
    login() {
      this.$router
        .push({
          path: "/pages/login",
          query: { to: this.$route.query.to },
        })
        .catch((err) => {});
    },
    registerUser() {
      if (!this.validateForm) return false;
      if (this.$store.state.auth.isUserLoggedIn()) {
        this.notifyAlreadyLogedIn();
        return;
      }
      this.$vs.loading();

      const payload = {
        userDetails: {
          company: this.companyName,
          email: this.email.charAt(0).toLowerCase() + this.email.substring(1),
          password: this.password,
          username: this.username,
          status: true,
          role: {
            key: 0,
            name: "super admin",
          },
        },
        notify: this.$vs.notify,
        closeAnimation: this.$vs.loading.close,
        intercom: this.$intercom,
        acl: this.$acl,
      };
      this.$store.dispatch("auth/registerUser", payload);
    },
    notifyAlreadyLogedIn() {
      this.$vs.notify({
        title: "Login Attempt",
        text: "You are already logged in!",
        iconPack: "feather",
        icon: "icon-alert-circle",
        color: "warning",
      });
    },
  },
};
</script>
<style scoped>
.scroll-area {
  height: calc(100vh - 8rem);
  max-height: 552px;
}
</style>