<template>
  <div class="min-h-screen" id="register-page">
    <div
      class="vx-row w-full min-h-screen"
    >
      <div class="vx-col w-1/3 hidden lg:block pl-6 py-12 course-side" style="height: calc( 100vh ); overflow: auto;">
        <div class="logo ml-8 mt-12">
          <img class="cursor-pointer" :src="require('@/assets/images/logo/logo-text.png')" @click="$router.push('/')" alt="Qualizy" />
        </div>
        <div class="side-section mt-12 ml-8 pt-12">
          <div class="course-item" v-for="(course,index)  in courses" :key="index">
            <div class="course-content flex items-center">
              <div
                class="rounded-full flex items-center justify-center"
                :class="{'current-course':currentPage==index , 'up-course': currentPage<index , 'done-course':currentPage>index}"
              >
                <vs-icon
                  color="white"
                  v-if="currentPage==index"
                  icon-pack="feather"
                  :icon="course.icon"
                  size="20px"
                />
                <vs-icon
                  color="#6c50f0"
                  v-else-if="currentPage<index"
                  icon-pack="feather"
                  :icon="course.icon"
                  size="20px"
                />
                <vs-icon color="white" v-else icon-pack="feather" icon="icon-check" size="20px" />
              </div>
              <div class="course-title ml-3">
                <p class="text-sm font-medium course-name">{{course.name | capitalize}}</p>
                <p class="text-lg font-bold course-content">{{course.title}}</p>
              </div>
            </div>
            <div class="course-line" v-if="index<courses.length-1">
              <div class="course-line-done" :style="calcHeightSucess(index)"></div>
            </div>
          </div>
        </div>
        <div class="flex items-center ml-8 mt-12">
          <p class="">{{$t("already have an account")}} ?</p>
          <p class="text-dark underline font-semibold cursor-pointer ml-4" @click="login">{{$t("login")}}</p>
        </div>
      </div>
      <div class="vx-col lg:w-2/3 w-full bg-white flex justify-center" :class="{'items-center': currentPage<3}" style="height: calc( 100vh ); overflow: auto;">
        <!-- <VuePerfectScrollbar class="scroll-area px-4" :settings="settings" ref="pageLists"> -->
        <transition
          v-for="page in [0,1,2,3]"
          :key="page"
          name="custom-classes-transition"
          :enter-active-class="enterClass"
        >
          <template>
            <div
              class="vx-row py-12 course-content"
              style="max-width:700px;"
              v-if="currentPage==page && currentPage==0"
            >
              <p class="text-center karla-bold text-2xl color-black w-full">{{$t("create account")}}</p>
              <div class="vx-col w-full">
                <label class="caption" for="user_name">{{$t("name")}}</label>
                <!-- regex:^[0-9]+ -->
                <vs-input
                  id="user_name"
                  v-validate="'required|min:3'"
                  data-vv-validate-on="blur"
                  class="w-full"
                  :placeholder="$t('first name and last name')"
                  v-model="userName"
                  name="username"
                />
                <span class="text-danger text-sm">{{ errors.first('username') }}</span>
              </div>
              <div class="vx-col w-full md:mt-base mt-3">
                <label class="caption" for="email">{{$t("email")}}</label>
                <vs-input
                  id="email"
                  v-validate="'required|email'"
                  data-vv-validate-on="blur"
                  name="email"
                  type="email"
                  class="w-full"
                  :placeholder="$t('email')"
                  v-model="userEmail"
                />
                <span class="text-danger text-sm">{{ errors.first('email') }}</span>
              </div>
              <div class="vx-col w-full md:mt-base mt-3">
                <label class="caption" for="password">{{$t("password")}}</label>
                <div class="relative">
                  <vs-input
                    id="password"
                    ref="password"
                    :type="passwordType"
                    data-vv-validate-on="blur"
                    v-validate="'required|min:6'"
                    name="password"
                    :placeholder="$t('password')"
                    v-model="userPassword"
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
              <!-- <div class="vx-col w-full md:mt-base mt-3 flex items-center">
                <vs-checkbox
                  id="terms_condition"
                  v-model="isTermsConditionAccepted"
                ></vs-checkbox>
                <label for="terms_condition">{{$t('I accept the terms & condition')}}</label>
              </div> -->
              <div class="vx-col w-full mt-base">
                <vs-button
                  color="#6C50F0"
                  class="w-full karla-bold"
                  :disabled="pageCheck(0)"
                  @click="plusPage"
                >{{$t("next")}}</vs-button>
              </div>
            </div>
            <div
              v-else-if="currentPage==page && currentPage==1"
              style="max-width:700px;"
              class="vx-row py-12 course-content"
            >
              <div class="vx-col w-full">
                <p
                  class="text-center karla-bold text-2xl color-black mb-3"
                >{{$t("company details")}}</p>
                <p
                  class="text-sm color-black opacity-50 text-center"
                >{{$t("Tell us about your company so that we could customize your experience")}}</p>
              </div>
              <div class="vx-col w-full mt-4">
                <p class="caption mb-2">{{$t("company name")}}</p>
                <vs-input
                  v-validate="'required|min:3'"
                  data-vv-validate-on="blur"
                  class="w-full"
                  :placeholder="$t('company name')"
                  v-model="company"
                  name="companyname"
                />
                <span class="text-danger text-sm">{{ errors.first('companyname') }}</span>
              </div>
              <div class="vx-col w-full mt-4">
                <p class="caption mb-4">{{$t("industry")}}</p>
                <v-select
                  :options="companyTypes"
                  :clearable="false"
                  label="text"
                  v-model="companyType"
                />
              </div>

              <div class="vx-col w-full mt-4">
                <p class="caption mb-4">{{$t("job title")}}</p>
                <v-select
                  :options="industryTypes"
                  :clearable="false"
                  label="text"
                  v-model="industry"
                />
              </div>

              <div class="vx-col w-full mt-4">
                <p class="caption mb-2">{{$t("Number of employees")}}</p>
                <v-select
                  :clearable="false"
                  :options="employeeList"
                  v-model="employee"
                  label="text"
                ></v-select>
              </div>

              <div class="vx-col w-full mt-12 flex items-center justify-between">
                <vs-button
                  color="#ebe8fd"
                  class="w-full mr-4 karla-bold"
                  text-color="#6c50f0"
                  @click="minusPage"
                >{{$t("back")}}</vs-button>
                <vs-button
                  @click="plusPage"
                  color="#6c50f0"
                  :disabled="pageCheck(1)"
                  class="w-full karla-bold"
                >{{$t("next")}}</vs-button>
              </div>
            </div>
            <div
              v-else-if="currentPage==page && currentPage==2"
              class="vx-row py-12 course-content"
              style="max-width:700px;"
            >
              <div class="vx-col w-full">
                <p
                  class="text-center karla-bold text-2xl color-black mb-4"
                >{{$t("Get Qualizy app on the phone")}}</p>
                <p
                  class="text-sm color-black opacity-50 text-center"
                >{{$t("We will send you a link to download Qualizy app")}}</p>
              </div>
              <div class="vx-col w-full mt-4">
                <p class="caption">{{$t("phone number")}}</p>
                <vue-tel-input
                  :inputOptions="inputOptions"
                  validCharactersOnly
                  enabledCountryCode
                  v-model="userPhone"
                  @input="phoneValidate"
                ></vue-tel-input>
              </div>
              <div class="vx-col w-full mt-base flex items-center justify-between">
                <vs-button
                  color="#ebe8fd"
                  class="w-full mr-4 karla-bold"
                  text-color="#6c50f0"
                  @click="minusPage"
                >{{$t("back")}}</vs-button>
                <vs-button
                  @click="plusPage"
                  color="#6c50f0"
                  class="w-full karla-bold"
                  :disabled="!pageCheck(2)"
                >{{$t("next")}}</vs-button>
              </div>
              <div class="absolute skip-item cursor-pointer">
                <div class="flex items-center hover:font-bold" @click="currentPage=3">
                  <span class="text-sm mr-2" style="color: #6C50F0;">{{$t('skip')}}</span>
                  <vs-icon color="#6C50F0" size="20px" icon-pack="feather" icon="icon-arrow-right"></vs-icon>
                </div>
              </div>
            </div>
            <div
              v-else-if="currentPage==page && currentPage==3"
              class="vx-row py-12 course-content mt-4"
              style="max-width:700px;"
            >
              <div class="vx-col w-full">
                <p
                  class="text-center karla-bold text-2xl color-black mb-4"
                >{{$t("Grab a time here with an expert for a FREE 30 -minute training call")}}</p>
                <p
                  class="text-base color-black opacity-50 text-center"
                >{{$t("Rather than spending hours trying out our software and reading documentation, We invite you to spend 30 minutes with our experts getting specific answers to your questions and having a true expert help you customise the product to your specific needs & workflow")}}</p>
              </div>
              <div class="vx-row w-full" style="margin-top:-30px;">
                <vue-calendly :url="calendlyUrl" :height="1000"></vue-calendly>
              </div>
              <div class="vx-col w-full flex items-center justify-between">
                <vs-button
                  color="#ebe8fd"
                  class="w-full mr-4 karla-bold"
                  text-color="#6c50f0"
                  @click="minusPage"
                >{{$t("back")}}</vs-button>
                <vs-button
                  @click="registerUser"
                  color="#6c50f0"
                  class="w-full karla-bold"
                >{{$t("finish")}}</vs-button>
              </div>
              <div class="absolute skip-item cursor-pointer">
                <div class="flex items-center hover:font-bold" @click="registerUser">
                  <span class="text-sm mr-2" style="color: #6C50F0;">{{$t('skip')}}</span>
                  <vs-icon color="#6C50F0" size="20px" icon-pack="feather" icon="icon-arrow-right"></vs-icon>
                </div>
              </div>
            </div>
          </template>
        </transition>
        <!-- </VuePerfectScrollbar> -->
      </div>
    </div>
  </div>
</template>

<script>
import VSelect from "vue-select";
import { VueTelInput } from "vue-tel-input";
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
  components: {
    VSelect,
    VueTelInput,
    VuePerfectScrollbar,
  },
  data() {
    return {
      passwordType: "password",
      industry: {},
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.3,
      },
      isPhone: false,
      inputOptions: {
        showDialCode: true,
        tabindex: 0,
      },
      userPhone: "",
      job: "",
      employee: {},

      company: "",
      companyType: {},

      isTermsConditionAccepted: false,
      userName: "",
      userEmail: "",
      userPassword: "",
      enterClass: "animated bounceInDown",

      currentPage: 0,
    };
  },
  methods: {
    notifyAlreadyLogedIn() {
      this.$vs.notify({
        title: "Login Attempt",
        text: "You are already logged in!",
        iconPack: "feather",
        icon: "icon-alert-circle",
        color: "warning",
      });
    },
    registerUser() {
      if (this.$store.state.auth.isUserLoggedIn()) {
        this.notifyAlreadyLogedIn();
        return;
      }
      this.$vs.loading();

      const payload = {
        userDetails: {
          company: this.company,
          phone: this.userPhone,
          employee: this.employee.value,
          industry: this.companyType.key,
          email:
            this.userEmail.charAt(0).toLowerCase() +
            this.userEmail.substring(1),
          password: this.userPassword,
          username: this.userName,
          status: true,
          locationInfo: this.$store.getters["app/ipInfo"],
          role: {
            key: 0,
            name: "super admin",
          },
          job: this.industry.value,
        },
        notify: this.$vs.notify,
        closeAnimation: this.$vs.loading.close,
        userflow: this.$userflow
      };
      // console.log(payload);
      this.$store.dispatch("auth/registerUser", payload);
    },
    phoneValidate(formattedNumber, { number, isValid, country }) {
      this.userPhone = formattedNumber;
      this.isPhone = isValid;
      if (this.userPhone == "") this.isPhone = true;
    },
    plusPage() {
      this.enterClass = "animated bounceInDown";
      this.currentPage++;
    },
    minusPage() {
      this.enterClass = "animated bounceInUp";
      this.currentPage--;
    },
    login() {
      this.$router
        .push({
          path: "/pages/login",
          query: { to: this.$route.query.to },
        })
        .catch((err) => {});
    },
  },
  computed: {
    industryTypes() {
      return [
        {
          text: this.$t("Business owner"),
          value: "business owner",
        },
        {
          text: this.$t("Manager/director"),
          value: "manager/director",
        },
        {
          text: this.$t("Quality or food safety manager"),
          value: "quality or food safety manager",
        },
      ];
    },
    employeeList() {
      return [
        {
          text: "0 ~ 10",
          value: 5,
        },
        {
          text: "11 ~ 50",
          value: 50,
        },
        {
          text: "51 ~ 200",
          value: 200,
        },
        {
          text: "201 ~ 500",
          value: 500,
        },
        {
          text: "500 +",
          value: -1,
        },
      ];
    },
    companyTypes() {
      return [
        { text: this.$t("Restaurant"), key: "Restaurant" },
        { text: this.$t("Cafe"), key: "Cafe" },
        {
          text: this.$t("Food retail (Butcher, Fishmonger, etc..)"),
          key: "Food retail (Butcher, Fishmonger, etc..)",
        },
        { text: this.$t("Food production"), key: "Food production" },
        { text: this.$t("Caterer"), key: "Caterer" },
        {
          text: this.$t("Collectivity catering"),
          key: "Collectivity catering",
        },
        { text: this.$t("Others"), key: "Others" },
      ];
    },
    courses() {
      return [
        {
          name: this.$t("step") + " 1",
          title: this.$t("create account"),
          icon: "icon-user",
        },
        {
          name: this.$t("step") + " 2",
          title: this.$t("company details"),
          icon: "icon-briefcase",
        },
        {
          name: this.$t("step") + " 3",
          title: this.$t("get link to the app"),
          icon: "icon-phone",
        },
        {
          name: this.$t("step") + " 4",
          title: this.$t("schedule a training"),
          icon: "icon-calendar",
        },
      ];
    },
    calendlyUrl() {
      //  `https://calendly.com/qualizy/training-call-with-a-qualizy-expert-2?hide_event_type_details=1&hide_gdpr_banner=1&primary_color=7367f0`
      if(this.$i18n.locale == 'fr') 
        return `https://calendly.com/qualizy/mise-en-place-gratuite?email=${this.userEmail}&name=${this.userName}&a1=${this.company}&hide_event_type_details=1&hide_gdpr_banner=1&primary_color=7367f0`;
      return `https://calendly.com/qualizy/training-call-with-a-qualizy-expert-2?email=${this.userEmail}&name=${this.userName}&a1=${this.company}&hide_event_type_details=1&hide_gdpr_banner=1&primary_color=7367f0`;
    },
    calcHeightSucess() {
      return (i) => {
        if (this.currentPage > i) return "height: 100%;";
        return "height:0;";
      };
    },
    pageCheck() {
      return (page) => {
        if (page == 0) {
          return (
            this.errors.first("username") ||
            this.errors.first("email") ||
            this.errors.first("password") ||
            this.userName == "" ||
            this.userEmail == "" ||
            this.userPassword == "" 
            // !this.isTermsConditionAccepted
          );
        } else if (page == 1) {
          return this.errors.first("companyname") || this.company == "";
        } else if (page == 2) {
          return this.isPhone;
        }
      };
    },
  },
  watch: {
    currentPage(val) {
      if(val==1) {
        if(!!!this.industry.value)
          this.industry = this.industryTypes[0]
        if(!!!this.companyType.key)
          this.companyType = this.companyTypes[0]
      }
    },
  },
  created() {
    this.employee = this.employeeList[0];
  },
};
</script>
<style  scoped>
@import url("https://cdn.jsdelivr.net/npm/animate.css@3.5.1");
</style>
<style>
#register-page .passIcon {
  position: absolute !important;
  top: 0.6rem;
  right: 0.7rem;
  cursor: pointer;
  color: #585858;
}
.calendly {
  width: 100%;
  min-height: 600px !important;
  height: 100% !important;
}
</style>
<style scoped>
.side-section {
  min-height: calc(100vh - 25rem);
}
.skip-item {
  top: 30px;
  right: 30px;
}
.vx-row > .vx-col {
  padding: 0.5rem;
}
.scroll-area {
  height: calc(100vh - 5rem);
  max-height: 752px;
  max-width: 752px;
}
.color-black {
  color: #1e1c26;
}
.caption {
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  color: #1e1c26;
  opacity: 0.9;
}
.course-name {
  color: #1e1c26;
  text-transform: uppercase;
}
.course-content {
  color: #1e1c26;
  opacity: 0.9;
}
.course-line-done {
  background: #29b648;
  transition: all 0.5s ease;
}
.doing-course {
  border: 2px solid #6c50f0;
  width: 42px;
  height: 42px;
  margin: 8px;
}
.done-course {
  background: #29b648;
  padding: 1.5em;
  margin-left: 10px;
  width: 42px;
  height: 42px;
  position: relative;
  transition: all 0.5s ease;
}
.up-course {
  background: transparent;
  border: 2px solid #6c50f0;
  padding: 1.5em;
  margin-left: 5px;
  width: 42px;
  height: 42px;
  position: relative;
  transition: all 0.5s ease;
  opacity: 0.5;
}
.current-course {
  background: #6c50f0;
  width: 60px;
  height: 60px;
  position: relative;
  transition: all 0.5s ease;
}
.current-course:before {
  border-radius: 50%;
  background: none;
  border: 4px solid #dfe1ec;
  content: "";
  display: block;
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  pointer-events: none;
}

.course-side {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(250px);
}
.course-line {
  background: #6c50f0;
  opacity: 0.5;
  border-radius: 4px;
  width: 4px;
  height: 65px;
  margin: 5px 28px;
}
.course-item {
  max-width: 500px;
}
</style>

