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
    class="min-h-screen flex w-full vx-row no-gutter items-center justify-center relative"
    style="margin-top: -61px; padding-top:50px;"
  >
    <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 sm:m-0 m-4">
      <vx-card>
        <div slot="no-body" class="full-page-bg-color">
          <div class="vx-row no-gutter">
            <div class="vx-col hidden sm:hidden md:hidden lg:block lg:w-1/2 mx-auto self-center">
              <img src="@/assets/images/pages/lock-screen.png" alt="register" class="mx-auto" />
            </div>
            <div class="vx-col sm:w-full md:w-full lg:w-1/2 mx-auto self-center d-theme-dark-bg">
              <div class="p-8">
                <div class="vx-card__title">
                  <h4 class="mb-4">Login with digit code</h4>
                  <p>Welcome back, please login to your digit account.</p>
                </div>
                <div class="clearfix mt-4">
                  <p>Company</p>

                  <vue-simple-suggest
                    ref="suggestComponent"
                    :styles="autoCompleteStyle"
                    v-model="company"
                    :min-length="3"
                    :list="getList"
                    display-attribute="bussiness"
                    :filter-by-query="true"
                    mode="select"
                  >
                    <vs-input class="w-full mb-4" placeholder="Search here..." v-model="searchKey" />
                    <div
                      class="absolute top-0 right-0 pt-2 pr-2"
                      v-if="company != '' "
                      @click="emptySearchKey"
                    >
                      <feather-icon icon="XIcon" svgClasses="h-6 w-6 cursor-pointer mt-1 mr-2" />
                    </div>
                    <div class="absolute top-0 right-0 pt-2 pr-2" v-else>
                      <feather-icon
                        icon="SearchIcon"
                        svgClasses="h-6 w-6 cursor-pointer mt-0 mr-2"
                      />
                    </div>
                    <div slot="suggestion-item" slot-scope="scope">
                      <span v-html="boldenSuggestion(scope)"></span>
                    </div>
                  </vue-simple-suggest>
                  <!-- <v-select label="bussiness" class="mb-4" v-model="company" :options="comapanies"></v-select> -->
                  <p>User</p>
                  <v-select label="title" v-model="user" :options="users"></v-select>

                  <vs-input
                    type="password"
                    data-vv-validate-on="blur"
                    placeholder="Digit Code"
                    v-model="digit"
                    class="w-full mt-6 mb-6"
                  />

                  <vs-checkbox v-model="checkbox_remember_me" class="mb-3">Remember Me</vs-checkbox>

                  <vs-button type="border" @click="login" class="mt-6">Email&Password</vs-button>
                  <vs-button
                    class="float-right mt-6"
                    @click="digitLogin"
                    :disabled="!validateForm"
                  >Login</vs-button>
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
import vSelect from "vue-select";
import { db } from "@/firebase/firebaseConfig";
import VueSimpleSuggest from "vue-simple-suggest";
import "vue-simple-suggest/dist/styles.css";

export default {
  components: {
    vSelect,
    VueSimpleSuggest,
  },
  data() {
    return {
      searchKey: "",
      autoCompleteStyle: {
        vueSimpleSuggest: "position-absolute",
        inputWrapper: "",
        defaultInput: "form-control",
        suggestions: "position-absolute list-group z-1000",
        suggestItem: "list-group-item",
      },
      chosen: null,
      checkbox_remember_me: false,
      digit: "",
      company: "",
      comapanies: [],
      users: [],
      user: "",
      username: "",
      email: "",
      password: "",
      confirm_password: "",
      isTermsConditionAccepted: true,
    };
  },
  watch: {
    user() {
      this.digit = "";
    },
    company(val) {
      if (!!val) this.searchKey = val.bussiness;
      else {
        this.searchKey = "";
        this.users = [];
        return false;
      }
      this.digit = "";
      this.user = "";

      this.$vs.loading();
      db.collection("users")
        .where("group", "==", val.id)
        .get()
        .then((q) => {
          this.users = [];
          this.$vs.loading.close();

          q.forEach((doc) => {
            if (
              (doc.data().deleted !== undefined && doc.data().deleted) ||
              !doc.data().status
            )
              return;
            this.users.push(
              Object.assign({}, doc.data(), {
                id: doc.id,
                title: doc.data().name + " (" + doc.data().email + ")",
              })
            );
          });
        });
    },
  },
  computed: {
    getList() {
      return this.comapanies;
    },
    validateForm() {
      return (
        this.user != "" &&
        this.user !== null &&
        this.company != "" &&
        this.company !== null &&
        this.digit != ""
      );
    },
  },
  methods: {
    boldenSuggestion(scope) {
      if (!scope) return scope;

      const { suggestion, query } = scope;

      let result = this.$refs.suggestComponent.displayProperty(suggestion);

      if (!query) return result;

      const texts = query.split(/[\s-_/\\|\.]/gm).filter((t) => !!t) || [""];
      return result.replace(
        new RegExp("(.*?)(" + texts.join("|") + ")(.*?)", "gi"),
        "$1<b>$2</b>$3"
      );
    },
    emptySearchKey() {
      this.company = "";
    },
    login() {
      this.$router
        .push({
          path: "/pages/login",
          query: { to: this.$route.query.to },
        })
        .catch((err) => {});
    },
    digitLogin() {
      if (!this.validateForm) return false;
      if (this.$store.state.auth.isUserLoggedIn()) {
        this.notifyAlreadyLogedIn();
        return;
      }
      this.$vs.loading();
      db.collection("users")
        .doc(this.user.id)
        .get()
        .then((q) => {
          if (
            q.data().digit === undefined ||
            q.data().digit == "" ||
            this.digit != q.data().digit
          ) {
            this.$vs.loading.close();
            this.errorLogin();
            return false;
          }
          const payload = {
            userDetails: {
              email: q.data().email,
            },
            checkbox_remember_me: this.checkbox_remember_me,
            notify: this.$vs.notify,
            closeAnimation: this.$vs.loading.close,
          };
          this.$store.dispatch("auth/loginDigit", payload);
        });
    },
    notifyAlreadyLogedIn() {
      this.$vs.notify({
        time: 7000,
        title: "Login Attempt",
        text: "You are already logged in!",
        iconPack: "feather",
        icon: "icon-alert-circle",
        color: "warning",
      });
    },
    errorLogin() {
      this.$vs.notify({
        time: 7000,
        title: "Failed Login with digit code",
        text: `Digit code is incorrect.
                Please input again.`,
        iconPack: "feather",
        icon: "icon-alert-circle",
        color: "danger",
      });
    },
  },
  created() {
    this.$vs.loading();
    db.collection("companies")
      .get()
      .then((q) => {
        this.comapanies = [];
        this.$vs.loading.close();
        q.forEach((doc) => {
          this.comapanies.push(Object.assign({}, doc.data(), { id: doc.id }));
        });
      });
  },
};
</script>
