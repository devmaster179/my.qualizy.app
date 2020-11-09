
<template>
  <div
    class="min-h-screen flex w-full vx-row no-gutter items-center justify-center relative"
    id="page-login"
    @keyup.enter="pressEnter"
  >
    <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 sm:m-0 m-4" style="max-width:520px;">
      <vx-card>
        <div slot="no-body" class="sm:p-8 p-4">
          <div class="vx-row no-gutter justify-center items-center">
            <div class="vx-col w-full d-theme-dark-bg">
              <div class="sm:p-8 p-4">
                <div class="vx-card__title sm:mb-8">
                  <h4 class="mb-4 text-2xl text-center karla-bold">{{$t("Log in to Qualizy")}}</h4>
                </div>
                <div class="mt-12">
                  <label class="karla">{{$t('email')}}</label>
                  <vs-input
                    v-validate="'required|email|min:3'"
                    data-vv-validate-on="blur"
                    name="email"
                    ref="email"
                    :placeholder="$t('email')"
                    v-model="email"
                    class="w-full mt-1"
                  />
                  <span class="text-danger text-sm">{{ errors.first('email') }}</span>
                </div>
                <div class="mt-6">
                  <label class="karla">{{$t('password')}}</label>
                  <div class="relative">
                    <vs-input
                      data-vv-validate-on="blur"
                      v-validate="'required|min:6'"
                      :type="passwordType"
                      name="password"
                      ref="password"
                      :placeholder="$t('password')"
                      v-model="password"
                      class="w-full"
                    />
                    <feather-icon
                      icon="EyeIcon"
                      svgClasses="h-6 w-6"
                      class="passIcon"
                      v-if="passwordType=='password'"
                      @click="passwordType='text'"
                    />
                    <feather-icon
                      icon="EyeOffIcon"
                      svgClasses="h-6 w-6"
                      class="passIcon"
                      v-else
                      @click="passwordType='password'"
                    />
                  </div>
                  <span class="text-danger text-sm">{{ errors.first('password') }}</span>
                </div>
                <div class="flex flex-wrap justify-between sm:my-5 my-4">
                  <vs-checkbox v-model="checkbox_remember_me" class="mb-3">{{$t("remember me")}}</vs-checkbox>
                  <router-link to="/pages/forgot-password">{{$t("forgot password")}}?</router-link>
                </div>

                <vs-button
                  class="w-full"
                  ref="loginBtn"
                  :disabled="!validateForm"
                  @click="login"
                  color="#6c50f0"
                >{{$t("login")}}</vs-button>

                <p class="karla text-center sm:my-6 my-4">{{$t("Or connect with")}}</p>
                <!-- <div class="social-login flex flex-wrap justify-between">
                  <div class="social-login-buttons flex flex-wrap items-center">
                    <div
                      class="cursor-pointer mr-4 facebook-btn flex items-center justify-center"
                      @click="loginWithFacebook"
                    >
                      <svg
                        width="9"
                        height="18"
                        viewBox="0 0 9 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M1.96186 18V8.98777H0V6.00044H1.96186V4.19388C1.96186 1.75714 2.74225 0 5.60013 0H9V2.9812H6.60597C5.40711 2.9812 5.13392 3.72492 5.13392 4.50376V6.00044H8.8233L8.31973 8.98777H5.13392V18H1.96186Z"
                          fill="#3B5998"
                        />
                      </svg>
                    </div>

                    <div
                      class="cursor-pointer mr-4 google-btn flex items-center justify-center"
                      @click="loginWithGoogle"
                    >
                      <svg
                        width="24"
                        height="16"
                        viewBox="0 0 24 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M21.3585 6.43134V3.71933H19.4717V6.43134H16.7547V8.36849H19.4717V11.158H21.3585V8.36849H24V6.43134H21.3585ZM7.62264 6.27637V9.37581C7.62264 9.37581 10.5512 9.37178 11.7437 9.37178C11.098 11.3811 10.0939 12.4752 7.62264 12.4752C5.12173 12.4752 3.16982 10.3937 3.16982 7.82609C3.16982 5.25843 5.12173 3.17693 7.62264 3.17693C8.9449 3.17693 9.79888 3.65409 10.5822 4.31915C11.2092 3.67539 11.1568 3.58365 12.7521 2.03695C11.3979 0.771451 9.59803 0 7.62264 0C3.41275 0 0 3.50384 0 7.82609C0 12.1483 3.41275 15.6522 7.62264 15.6522C13.9152 15.6522 15.4533 10.0267 14.9434 6.27637H7.62264Z"
                          fill="#DD4B39"
                        />
                      </svg>
                    </div>

                    <div
                      class="cursor-pointer mr-4 twitter-btn flex items-center justify-center"
                      @click="loginWithGoogle"
                    >
                      <svg
                        width="19"
                        height="16"
                        viewBox="0 0 19 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M15.9997 1.31898C15.2887 0.524827 14.2756 0.0188459 13.1545 0.00051126C11.0018 -0.0346915 9.25632 1.75244 9.25632 3.99202C9.25632 4.30987 9.29081 4.61982 9.35731 4.91737C6.11762 4.71091 3.2453 3.05351 1.32278 0.555173C0.98724 1.15383 0.79496 1.85353 0.79496 2.60306C0.79496 4.02199 1.48314 5.28128 2.52909 6.02482C1.89012 5.9971 1.28905 5.80707 0.763515 5.49531C0.763135 5.51235 0.763135 5.52939 0.763135 5.54673C0.763135 7.52827 2.10681 9.19063 3.89006 9.57787C3.56297 9.66893 3.2186 9.71659 2.86311 9.71427C2.61193 9.71263 2.36768 9.68527 2.12971 9.63613C2.6257 11.2612 4.06524 12.447 5.77106 12.4862C4.43698 13.5742 2.75623 14.2222 0.92986 14.2185C0.61522 14.2179 0.30495 14.1979 0 14.1595C1.7251 15.3224 3.77407 15.9994 5.9754 16C13.1453 16.0018 17.0663 9.87172 17.0663 4.55458C17.0663 4.38013 17.0624 4.20661 17.055 4.03393C17.8166 3.47638 18.4774 2.77734 19 1.9791C18.301 2.28868 17.5496 2.49428 16.7612 2.58052C17.566 2.09394 18.1841 1.31517 18.4751 0.381283C17.7219 0.830062 16.8877 1.1519 15.9997 1.31898Z"
                          fill="#1DA1F2"
                        />
                      </svg>
                    </div>
                  </div>
                  <vs-button
                    @click="digit"
                    icon="icon-command"
                    icon-pack="feather"
                    color="success"
                  >Digit</vs-button>
                </div>-->
                <div class="md:flex items-center justify-between">
                  <vs-button
                    icon-pack="feather"
                    icon="icon-command"
                    color="#f0edfd"
                    text-color="#6c50f0"
                    class="karla-bold w-full md:mr-1 mr-0"
                    @click="digit"
                  >{{$t("Digit code")}}</vs-button>
                  <vs-button
                    color="#f0edfd"
                    text-color="#6c50f0"
                    class="karla-bold w-full md:ml-1 md:mt-0 ml-0 mt-1"
                    @click="loginWithGoogle"
                  >
                    <svg
                      width="24"
                      height="13"
                      viewBox="0 -3 24 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M21.3585 6.43134V3.71933H19.4717V6.43134H16.7547V8.36849H19.4717V11.158H21.3585V8.36849H24V6.43134H21.3585ZM7.62264 6.27637V9.37581C7.62264 9.37581 10.5512 9.37178 11.7437 9.37178C11.098 11.3811 10.0939 12.4752 7.62264 12.4752C5.12173 12.4752 3.16982 10.3937 3.16982 7.82609C3.16982 5.25843 5.12173 3.17693 7.62264 3.17693C8.9449 3.17693 9.79888 3.65409 10.5822 4.31915C11.2092 3.67539 11.1568 3.58365 12.7521 2.03695C11.3979 0.771451 9.59803 0 7.62264 0C3.41275 0 0 3.50384 0 7.82609C0 12.1483 3.41275 15.6522 7.62264 15.6522C13.9152 15.6522 15.4533 10.0267 14.9434 6.27637H7.62264Z"
                        fill="#6c50f0"
                      />
                    </svg>
                    {{$t("Google account")}}
                  </vs-button>
                </div>
                <div class="flex items-center justify-center mt-6">
                  <p class="karla-bold mr-2">{{$t("Don't have an account")}}?</p>
                  <p
                    class="karla-bold text-primary underline cursor-pointer"
                    @click="registerUser"
                  >{{$t("sign up")}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </vx-card>
    </div>
  </div>
</template>

<script>
import { db } from "../../firebase/firebaseConfig";
export default {
  data() {
    return {
      users: {},
      email: "",
      password: "",
      checkbox_remember_me: false,
      passwordType: "password",
    };
  },
  firestore() {
    return {
      users: db.collection("users"),
      allergens: db.collection("allergens"),
    };
  },
  computed: {
    validateForm() {
      return !this.errors.any() && this.email != "" && this.password != "";
    },
  },

  created() {
  },

  methods: {
    pressEnter() {
      this.$nextTick(() => {
        this.$refs.email.$refs.vsinput.focus();
        this.$refs.password.$refs.vsinput.focus();
        if (!this.validateForm) return false;
        else this.login();
      });
    },
    login() {
      this.$vs.loading();
      var email = this.email.charAt(0).toLowerCase() + this.email.substring(1);
      const payload = {
        checkbox_remember_me: this.checkbox_remember_me,
        userDetails: {
          email: email,
          password: this.password
        },
        notify: this.$vs.notify,
        closeAnimation: this.$vs.loading.close,
        intercom: this.$intercom,
        acl: this.$acl,
        mixpanel: this.$mixpanel,
        userflow: this.$userflow
      };
      this.$store.dispatch("auth/loginAttempt", payload);
    },

    loginAuth0() {
      if (this.$store.state.auth.isUserLoggedIn()) {
        this.notifyAlreadyLogedIn();
        return false;
      }
      this.$auth.login({ target: this.$route.query.to });
    },

    // Google login
    loginWithGoogle() {
      this.$store.dispatch("auth/loginWithGoogle", {
        notify: this.$vs.notify,
        intercom: this.$intercom,
        acl: this.$acl,
      });
    },

    // Facebook login
    loginWithFacebook() {
      this.$store.dispatch("auth/loginWithFacebook", {
        notify: this.$vs.notify,
        intercom: this.intercom,
        acl: this.$acl,
      });
    },

    // Twitter login
    loginWithTwitter() {
      this.$store.dispatch("auth/loginWithTwitter", {
        notify: this.$vs.notify,
      });
    },

    // Github login
    loginWithGithub() {
      this.$store.dispatch("auth/loginWithGithub", { notify: this.$vs.notify });
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
    digit() {
      if (this.$store.state.auth.isUserLoggedIn()) {
        this.notifyAlreadyLogedIn();
        return false;
      }
      this.$router
        .push({
          path: "/pages/digit",
          query: { to: this.$route.query.to },
        })
        .catch((err) => {});
    },
    registerUser() {
      if (this.$store.state.auth.isUserLoggedIn()) {
        this.notifyAlreadyLogedIn();
        return false;
      }
      this.$router
        .push({
          path: "/pages/register",
          query: { to: this.$route.query.to },
        })
        .catch((err) => {});
      //   this.$router.push(`/pages/register/${this.$route.query.to}`);
    },
  },
};
</script>

<style lang="scss">
#page-login {
  .passIcon {
    position: absolute !important;
    top: 0.7rem;
    right: 0.7rem;
    cursor: pointer;
  }
  .social-login {
    .facebook-btn {
      background: #ffffff;
      opacity: 0.54;
      border: 1px solid #3b5998;
      box-sizing: border-box;
      border-radius: 3px;
      width: 48px;
      height: 48px;
    }
    .google-btn {
      background: #ffffff;
      border: 1px solid #dd4b39;
      box-sizing: border-box;
      border-radius: 3px;
      width: 48px;
      height: 48px;
    }
    .twitter-btn {
      background: #ffffff;
      opacity: 0.54;
      border: 1px solid #1da1f2;
      box-sizing: border-box;
      border-radius: 3px;
      width: 48px;
      height: 48px;
    }
    .bg-facebook {
      background-color: #1551b1;
    }

    .bg-twitter {
      background-color: #00aaff;
    }
    .bg-google {
      background-color: #4285f4;
    }
    .bg-github {
      background-color: #333;
    }
  }
}
</style>

<style scoped>
</style>
