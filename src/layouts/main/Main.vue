<!-- =========================================================================================
    File Name: Main.vue
    Description: Main layout
    ----------------------------------------------------------------------------------------
    Item Name: Vuesax Admin - VueJS Dashboard Admin Template
    Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div>
    <div v-if="!subscribed" class="banner-non-subscribed">
      <span class="info-badge">Info</span>
      You have reached the limit of your demo account, you can still access everything in Qualizy but will be unable to create records - <a href="https://www.qualizy.app/get-monthly/" target="_blank" class="underline">Unlock an unlimited usage of Qualizy pro </a> for FREE for 7 days today.
    </div>
    <div
      class="layout--main"
      :class="[navbarClasses, footerClasses, { 'app-page': isAppPage, 'layout--main-non-subscribed':!subscribed }]"
    >
      <vx-sidebar
        :sidebarItems="sidebarItems"
        :logo="require('@/assets/images/logo/logo.png')"
        title="Vuesax"
        parent=".layout--main"
      />
      <div
        id="content-area"
        :class="[contentAreaClass, { 'show-overlay': bodyOverlay }]"
      >
        <div id="content-overlay"></div>

        <div class="content-wrapper">
          <the-navbar
            :navbarColor="navbarColor"
            :class="[
              { 'text-white': isNavbarDark && !isThemeDark },
              { 'text-base': !isNavbarDark && isThemeDark },
            ]"
            class="no-print main-layout-navbar"
          />

          <div class="router-view">
            <div
              class="router-content"
              :class="{ 'mt-0': navbarType == 'hidden' }"
            >
              <transition :name="routerTransition">
                <div
                  class="router-header flex flex-wrap items-center"
                  v-if="$route.meta.breadcrumb || $route.meta.pageTitle"
                >
                  <div
                    class="content-area__heading"
                    :class="{
                      'pr-4 border-0 md:border-r border-t-0 border-b-0 border-l-0 border-solid border-grey-light':
                        $route.meta.breadcrumb,
                    }"
                  >
                    <h2 class="mb-1">{{ $t(routeTitle) | capitalize }}</h2>
                  </div>

                  <!-- BREADCRUMB -->
                  <vx-breadcrumb
                    class="ml-4 md:block hidden"
                    v-if="$route.meta.breadcrumb"
                    :route="breadcrumb"
                  />
                  <!-- DROPDOWN -->
                  <!-- <vs-dropdown class="ml-auto md:block hidden cursor-pointer" vs-trigger-click>
                                <vs-button radius icon="icon-settings" icon-pack="feather"></vs-button>

                                <vs-dropdown-menu class="w-32">

                                    <vs-dropdown-item>
                                      <div @click="$router.push('/pages/profile')" class="flex items-center">
                                        <feather-icon icon="UserIcon" class="inline-block mr-2" svgClasses="w-4 h-4" />
                                        <span>Profile</span>
                                      </div>
                                    </vs-dropdown-item>

                                    <vs-dropdown-item>
                                      <div @click="$router.push('/apps/todo')" class="flex items-center">
                                        <feather-icon icon="CheckSquareIcon" class="inline-block mr-2" svgClasses="w-4 h-4" />
                                        <span>Tasks</span>
                                      </div>
                                    </vs-dropdown-item>

                                    <vs-dropdown-item>
                                      <div @click="$router.push('/apps/email')" class="flex items-center">
                                        <feather-icon icon="MailIcon" class="inline-block mr-2" svgClasses="w-4 h-4" />
                                        <span>Inbox</span>
                                      </div>
                                    </vs-dropdown-item>
                                </vs-dropdown-menu>
                </vs-dropdown>-->
                </div>
              </transition>
              <div
                class="video-launcher sm:mb-6"
                v-if="$route.meta.breadcrumb || $route.meta.pageTitle"
              >
                <a href="#" @click="howtoTemplate"
                  >Watch this video to see how it works</a
                >
              </div>
              <div class="content-area__content">
                <back-to-top
                  bottom="5%"
                  visibleoffset="500"
                  v-if="!hideScrollToTop"
                >
                  <vs-button
                    icon-pack="feather"
                    icon="icon-arrow-up"
                    class="shadow-lg"
                  />
                </back-to-top>
                <transition :name="routerTransition" mode="out-in">
                  <router-view
                    @changeRouteTitle="changeRouteTitle"
                  ></router-view>
                </transition>
              </div>
            </div>
          </div>
        </div>
        <div class="hidden">{{ showPreventLoggingModal }}</div>
        <the-footer></the-footer>
      </div>

      <pro-price-plan-popup
        :open="preventLogging"
        class="pro-price-plan-popup"
      />
    </div>
  </div>
</template>

<script>
import VxSidebar from "@/layouts/components/vx-sidebar/VxSidebar.vue";
import TheNavbar from "../components/TheNavbar.vue";
import TheFooter from "../components/TheFooter.vue";
import ProPricePlanPopup from "../components/ProPricePlanPopup.vue";
import themeConfig from "@/../themeConfig.js";
import sidebarItems from "@/layouts/components/vx-sidebar/sidebarItems.js";
import BackToTop from "vue-backtotop";

import firebase from "firebase/app";
import "firebase/auth";

import { db } from "@/firebase/firebaseConfig.js";

// import {fcm} from '@/firebase/cloudMessage.js';

let tempDate = new Date();
tempDate.setFullYear(2000);

export default {
  data() {
    return {
      preventLogging: false,
      navbarType: themeConfig.navbarType || "floating",
      navbarColor: themeConfig.navbarColor || "#fff",
      footerType: themeConfig.footerType || "static",
      routerTransition: themeConfig.routerTransition || "none",
      isNavbarDark: false,
      routeTitle: this.$route.meta.pageTitle,
      sidebarItems: sidebarItems,
      disableCustomizer: themeConfig.disableCustomizer,
      windowWidth: window.innerWidth, //width of windows
      hideScrollToTop: themeConfig.hideScrollToTop,
      disableThemeTour: themeConfig.disableThemeTour,
      // subscribed: false,
      isFreePlan: false,
      numberOfLogs: 0,
      currBillingDate: tempDate,
      nextBillingDate: new Date(),
    };
  },
  watch: {
    $route(to, from) {
      this.routeTitle = this.$route.meta.pageTitle;
    },
    isThemeDark(val) {
      if (this.navbarColor == "#fff" && val) {
        this.updateNavbarColor("#10163a");
      } else {
        this.updateNavbarColor("#fff");
      }
    },
  },
  computed: {
    subscribed() {
      let subscription = this.$store.getters["app/getSubscription"];
      return subscription.subscribed;
    },
    showPreventLoggingModal() {
      this.preventLogging = this.$store.getters["app/getPreventLogging"];
      return this.preventLogging;
    },
    breadcrumb() {
      var route = {
        meta: {
          breadcrumb: [],
        },
      };
      this.$route.meta.breadcrumb.map((item, index) => {
        if (index == 0) route.meta.breadcrumb.push(item);
        else
          route.meta.breadcrumb.push({
            title: this.$t(item.title),
            active: item.active,
            url: item.url === undefined ? false : item.url,
          });
      });
      return route;
    },
    idlCalc() {
      return this.$store.state.idleVue.isIdle;
    },
    isAppPage() {
      if (this.$route.path.includes("/dashboard")) return true;
      else return false;
    },
    isThemeDark() {
      return this.$store.state.theme == "dark";
    },
    sidebarWidth() {
      return this.$store.state.sidebarWidth;
    },
    bodyOverlay() {
      return this.$store.state.bodyOverlay;
    },
    contentAreaClass() {
      if (this.sidebarWidth == "default") return "content-area-default";
      else if (this.sidebarWidth == "reduced") return "content-area-reduced";
      else if (this.sidebarWidth) return "content-area-full";
    },
    navbarClasses() {
      return {
        "navbar-hidden": this.navbarType == "hidden",
        "navbar-sticky": this.navbarType == "sticky",
        "navbar-static": this.navbarType == "static",
        "navbar-floating": this.navbarType == "floating",
      };
    },
    footerClasses() {
      return {
        "footer-hidden": this.footerType == "hidden",
        "footer-sticky": this.footerType == "sticky",
        "footer-static": this.footerType == "static",
      };
    },
  },
  methods: {
    howtoTemplate(event) {
      event.preventDefault();
      this.$userflow.start("2fad2cec-aba7-45ff-9ad1-6c9448700a24");
    },
    deleteTrashedData() {
      // db.collection('fooditems').where('deleted', '==' ,true).get().then(q => {
      //   q.forEach(item=> {
      //     db.collection("fooditems").doc(item.id).delete()
      //   })
      // })
    },
    setAnalytics() {
      return new Promise((res, rej) => {
        db.collection("analytics")
          .where(
            "group",
            "==",
            JSON.parse(localStorage.getItem("userInfo")).group
          )
          .orderBy("updated_at", "desc")
          .orderBy("visible", "desc")
          .onSnapshot((q) => {
            var analytics = [];
            q.forEach((doc) => {
              analytics.push(Object.assign({}, doc.data(), { id: doc.id }));
            });
            this.$store.commit("app/SET_ANALYTICS", analytics);
            res("ok");
          });
      });
    },
    setReportSchedule() {
      return new Promise((res, rej) => {
        db.collection("report_schedule")
          .where(
            "group",
            "==",
            JSON.parse(localStorage.getItem("userInfo")).group
          )
          .onSnapshot((q) => {
            let schedules = [];
            q.forEach((doc) => {
              schedules.push(Object.assign({}, doc.data(), { id: doc.id }));
            });
            this.$store.commit("app/SET_REPORT_SCHEDULE", schedules);
            res("ok");
          });
      });
    },
    setAuth() {
      return new Promise((resolve, reject) => {
        db.collection("roles")
          .doc(JSON.parse(localStorage.getItem("userInfo")).group)
          .onSnapshot((q) => {
            var subjects = [
              "records",
              "templates",
              "schedule",
              "food items",
              "report",
              "knowledge base",
              "analytics",
              "user and team settings",
            ];
            var auth = {};
            if (!q.exists) {
              subjects.map((item) => {
                auth[item] = {
                  admin: {
                    view: true,
                    create: true,
                    edit: true,
                    delete: false,
                  },
                  supervisor: {
                    view: true,
                    create: true,
                    edit: false,
                    delete: false,
                  },
                  operator: {
                    view: true,
                    create: false,
                    edit: false,
                    delete: false,
                  },
                  auditor: {
                    view: true,
                    create: false,
                    edit: false,
                    delete: false,
                  },
                };
              });
            } else {
              subjects.map((item) => {
                auth[item] = q.data()[item];
              });
            }
            this.$store.commit("app/SET_AUTH", auth);
            resolve("OK");
          });
      });
    },
    setCurrentUser() {
      return new Promise((resolve, reject) => {
        db.collection("users")
          .doc(JSON.parse(localStorage.getItem("userInfo")).id)
          .onSnapshot((q) => {
            this.$store.dispatch(
              "app/setCurrentUsesr",
              Object.assign({}, q.data(), { id: q.id })
            );
            let data = q.data();
            if (
              data !== undefined &&
              data.lang !== undefined &&
              !!this.$i18n &&
              !!this.$i18n.locale
            ) {
              this.$i18n.locale = data.lang;
              this.$moment.locale(data.lang);
            }
            resolve("OK");
          });
      });
    },
    setUser() {
      return new Promise((resolve, reject) => {
        db.collection("users")
          .where(
            "group",
            "==",
            JSON.parse(localStorage.getItem("userInfo")).group
          )
          .onSnapshot((q) => {
            let users = [];
            q.forEach((doc) => {
              const data = doc.data();
              if (data.deleted === undefined || data.deleted === false) {
                users.push(Object.assign({}, doc.data(), { id: doc.id }));
              }
            });
            this.$store.dispatch("app/setUsers", users);
            resolve("OK");
          });
      });
    },
    setTeams() {
      return new Promise((resolve, reject) => {
        db.collection("teams")
          .where(
            "group",
            "==",
            JSON.parse(localStorage.getItem("userInfo")).group
          )
          .onSnapshot((q) => {
            let teams = [];
            q.forEach((doc) => {
              teams.push(Object.assign({}, doc.data(), { id: doc.id }));
            });
            this.$store.dispatch("app/setTeams", teams);
            resolve("OK");
          });
      });
    },
    setLocations() {
      return new Promise((resolve, reject) => {
        db.collection("locations")
          .where(
            "group",
            "==",
            JSON.parse(localStorage.getItem("userInfo")).group
          )
          .onSnapshot((q) => {
            let locations = [];
            q.forEach((doc) => {
              locations.push(Object.assign({}, doc.data(), { id: doc.id }));
            });
            this.$store.dispatch("app/setLocations", locations);

            resolve("OK");
          });
      });
    },

    setTemplateLabels() {
      return new Promise((resolve, reject) => {
        db.collection("template_labels")
          .where("group", "in", [
            JSON.parse(localStorage.getItem("userInfo")).group,
            "global",
          ])
          .onSnapshot((q) => {
            let labels = [];
            q.forEach((doc) => {
              labels.push(Object.assign({}, doc.data(), { id: doc.id }));
            });
            this.$store.dispatch("app/setLabel", labels);
            resolve("OK");
          });
      });
    },
    setTemplateTypes() {
      return new Promise((resolve, reject) => {
        db.collection("template_type")
          .where("group", "in", [
            JSON.parse(localStorage.getItem("userInfo")).group,
            "global",
          ])
          .onSnapshot((q) => {
            let types = [];
            let tempType = [];
            q.forEach((doc) => {
              types.push(Object.assign({}, doc.data(), { id: doc.id }));
              if (doc.data().type in tempType === false)
                tempType[doc.data().type] = [];
              tempType[doc.data().type].push(
                Object.assign({}, doc.data(), { id: doc.id })
              );
            });
            this.$store.dispatch("app/setTemplateType", types);
            this.$store.dispatch("app/setTypedTemplateType", tempType);
            resolve("OK");
          });
      });
    },
    setTemplates() {
      return new Promise((resolve, reject) => {
        db.collection("templates")
          .where(
            "group",
            "==",
            JSON.parse(localStorage.getItem("userInfo")).group
          )
          .onSnapshot((q) => {
            let template = [];
            q.forEach((doc) => {
              template.push(Object.assign({}, doc.data(), { id: doc.id }));
            });
            this.$store.dispatch("app/setTemplate", template);
            resolve("OK");
          });
      });
    },
    setPublicTemplates() {
      return new Promise((resolve, reject) => {
        db.collection("templates")
          .where("group", "==", "global")
          .onSnapshot((q) => {
            let publicTemplates = [];
            q.forEach((doc) => {
              publicTemplates.push(
                Object.assign({}, doc.data(), { id: doc.id })
              );
            });

            this.$store.dispatch("app/setPublicTemplates", publicTemplates);
            resolve("OK");
          });
      });
    },
    getRepeatByTemplateTitle(title) {
      var repeat = false;
      var dailyTitles = [
        "Fridge temperature logs",
        "Freezer temperature logs",
        "Opening checks",
        "Closing checks",
        "Daily Cleaning schedule",
        "Dialy internal audit",
        "Personal Hygiene",
      ];
      var weeklyTitles = [
        "Weekly food safety checklist",
        "Weekly internal audit",
      ];
      var monthlyTitles = ["Monthly internal audit", "Thermometer calibration"];
      if (dailyTitles.indexOf(title) > -1) {
        repeat = "Daily";
      } else if (weeklyTitles.indexOf(title) > -1) {
        repeat = "Weekly";
      } else if (monthlyTitles.indexOf(title) > -1) {
        repeat = "Monthly";
      }

      return repeat;
    },
    setFoodItems() {
      return new Promise((resolve, reject) => {
        db.collection("fooditems")
          .where(
            "group",
            "==",
            JSON.parse(localStorage.getItem("userInfo")).group
          )
          .onSnapshot((q) => {
            let items = [];
            q.forEach((doc) => {
              items.push(Object.assign({}, doc.data(), { id: doc.id }));
            });
            this.$store.dispatch("app/setItems", items);
            resolve("OK");
          });
      });
    },
    setNotifications() {
      return new Promise((resolve, reject) => {
        db.collection("notifications")
          .where(
            "group",
            "==",
            JSON.parse(localStorage.getItem("userInfo")).group
          )
          .onSnapshot((q) => {
            var notifications = [];
            q.forEach((doc) => {
              // db.collection("notifications").doc(doc.id).delete();
              notifications.push(Object.assign({}, doc.data(), { id: doc.id }));
            });
            this.$store.dispatch("app/setNotifications", notifications);
            resolve("OK");
          });
      });
    },
    setLogs() {
      var date = new Date();
      return new Promise((resolve, reject) => {
        db.collection("logs")
          .where(
            "group",
            "==",
            JSON.parse(localStorage.getItem("userInfo")).group
          )
          .where("updated_at", ">", date)
          .onSnapshot((q) => {
            let logs = [];
            q.forEach((doc) => {
              this.$store.commit(
                "app/UPDATE_LOG",
                Object.assign({}, doc.data(), { id: doc.id })
              );
            });
            resolve("OK");
          });
      });
    },
    setSchedules() {
      return new Promise((resolve, reject) => {
        db.collection("schedules")
          .where(
            "group",
            "==",
            JSON.parse(localStorage.getItem("userInfo")).group
          )
          .onSnapshot((q) => {
            let schedules = [];
            q.forEach((doc) => {
              schedules.push(Object.assign({}, doc.data(), { id: doc.id }));
            });
            this.$store.dispatch("app/setSchedules", schedules);
            resolve("OK");
          });
      });
    },
    setAllergens() {
      return new Promise((resolve, reject) => {
        db.collection("allergens")
          .orderBy("name", "asc")
          .onSnapshot((q) => {
            let allergens = [];
            q.forEach((doc) => {
              allergens.push(Object.assign({}, doc.data(), { id: doc.id }));
            });
            this.$store.dispatch("app/setAllergens", allergens);
            resolve("OK");
          });
      });
    },
    setChat() {
      return new Promise((resolve, reject) => {
        db.collection("chat")
          .where(
            "group",
            "==",
            JSON.parse(localStorage.getItem("userInfo")).group
          )
          .onSnapshot((q) => {
            let chats = [];
            q.forEach((doc) => {
              if (doc.data().time == undefined || doc.data().time == null) {
                return;
              }
              chats.push(Object.assign({}, doc.data(), { id: doc.id }));
            });
            this.$store.dispatch("app/setChats", chats);
            resolve("OK");
          });
      });
    },
    setIots() {
      return new Promise((resolve, reject) => {
        db.collection("iots").onSnapshot((q) => {
          let iots = [];
          q.forEach((doc) => {
            if (
              doc.data().created_at == undefined ||
              doc.data().created_at == null
            ) {
              return;
            }

            iots.push(Object.assign({}, doc.data(), { id: doc.id }));
          });
          this.$store.dispatch("app/setIots", iots);
          resolve("OK");
        });
      });
    },
    setSuppliers() {
      return new Promise((resolve, reject) => {
        db.collection("suppliers")
          .where(
            "group",
            "==",
            JSON.parse(localStorage.getItem("userInfo")).group
          )
          .onSnapshot((q) => {
            let suppliers = [];
            q.forEach((doc) => {
              if (
                doc.data().created_at == undefined ||
                doc.data().created_at == null
              ) {
                return;
              }

              suppliers.push(Object.assign({}, doc.data(), { id: doc.id }));
            });
            this.$store.dispatch("app/setSuppliers", suppliers);
            resolve("OK");
          });
      });
    },
    setReports() {
      return new Promise((resolve, reject) => {
        db.collection("reports")
          .where(
            "group",
            "==",
            JSON.parse(localStorage.getItem("userInfo")).group
          )
          .onSnapshot((q) => {
            let reports = [];
            q.forEach((doc) => {
              // db.collection("reports")
              //   .doc(doc.id)
              //   .delete();
              reports.push(Object.assign({}, doc.data(), { id: doc.id }));
            });
            this.$store.dispatch("app/setReports", reports);
            resolve("OK");
          });
      });
    },
    setKnowledge() {
      return new Promise((resolve, reject) => {
        db.collection("knowledge")
          .where("group", "in", [
            JSON.parse(localStorage.getItem("userInfo")).group,
            "global",
          ])
          .onSnapshot((q) => {
            var knowledges = [];
            q.forEach((doc) => {
              if (doc.data().trashed) return;
              knowledges.push(Object.assign({}, doc.data(), { id: doc.id }));
            });
            knowledges = knowledges.sort(
              (a, b) => a.updated_at.toDate() - b.updated_at.toDate()
            );
            this.$store.dispatch("app/setKnowledge", knowledges);
            resolve("OK");
          });
      });
    },

    changeRouteTitle(title) {
      this.routeTitle = title;
    },
    updateNavbarColor(val) {
      this.navbarColor = val;
      if (val == "#fff") this.isNavbarDark = false;
      else this.isNavbarDark = true;
    },
    handleWindowResize(event) {
      this.windowWidth = event.currentTarget.innerWidth;
      this.setSidebarWidth();
    },
    setSidebarWidth() {
      if (this.windowWidth < 1200) {
        this.$store.commit("TOGGLE_IS_SIDEBAR_ACTIVE", false);
        this.$store.dispatch("updateSidebarWidth", "no-sidebar");
        this.disableThemeTour = true;
      } else if (this.windowWidth < 1200) {
        this.$store.dispatch("updateSidebarWidth", "reduced");
      } else {
        this.$store.commit("TOGGLE_IS_SIDEBAR_ACTIVE", true);
      }
    },
    toggleHideScrollToTop(val) {
      this.hideScrollToTop = val;
    },
    updateStatus(key) {
      if (navigator.onLine) {
        // console.log("online");
        // gives Boolean
        // then do what you need like provide a message
      } else {
        // console.log("offline");
      }
    },
    checkSubscribed() {
      // GET status of subscription and next billing date
      db.collection("paykickstart_subscriptions")
        // .where("content.buyer_email", "==", "bestsolution2028@gmail.com")
        .where("user_group", "==", JSON.parse(localStorage.getItem("userInfo")).group)
        // .where("content.event", "in", ['subscription-updated', 'subscription-payment', 'subscription-created', 'sales'])
        .orderBy("created_at", "desc")
        .limit(1)
        .onSnapshot(async (snapshot) => {
          if (snapshot.empty) {
            this.$store.dispatch("app/setSubscription", {
              subscribed: false,
              invoiceId: false,
            });
            return;
          }

          let subscription;
          snapshot.forEach((doc) => {
            subscription = doc.data();
          });
          this.$store.dispatch("app/setSubscription", {
            subscribed: subscription.content.event != "subscription-cancelled",
            invoiceId: subscription.content.invoice_id
          });
        })
    },
  },
  components: {
    VxSidebar,
    TheNavbar,
    TheFooter,
    BackToTop,
    ProPricePlanPopup,
  },
  mounted() {
    var user = JSON.parse(localStorage.getItem("userInfo"));
    var role = 4;
    var roles = ["Super admin", "Admin", "Supervisor", "Operator", "Auditor"];
    if (user.role !== undefined) role = user.role.key;

    var location = "";
    if (
      user.location !== undefined &&
      user.location !== null &&
      user.location !== ""
    )
      location = user.location;

    var phone = "";
    if (user.phone !== undefined && user.phone !== null && user.phone !== "")
      phone = user.phone;

    var team = "";
    if (user.team !== undefined && user.team !== null && user.team !== "")
      team = user.team.join();

    // window.addEventListener('online',  this.updateStatus('online'));
    // window.addEventListener('offline',  this.updateStatus('offline'));
  },
  async created() {
    document.addEventListener("gistChatReady", function () {
      window.gist.chat("hideLauncher");
    });
    // this.deleteTrashedData()
    var user = JSON.parse(localStorage.getItem("userInfo"));
    if (!this.$userflow.isIdentified()) {
      this.$userflow.identify(user.id);
    }
    var location = "";
    if (
      user.location !== undefined &&
      user.location !== null &&
      user.location !== ""
    )
      location = user.location;

    var phone = "";
    if (user.phone !== undefined && user.phone !== null && user.phone !== "")
      phone = user.phone;

    var team = "";
    if (user.team !== undefined && user.team !== null && user.team !== "")
      team = user.team.join();

    var role = 4;
    var roles = ["Super admin", "Admin", "Supervisor", "Operator", "Auditor"];
    if (user.role !== undefined) role = user.role.key;

    this.setSidebarWidth();
    if (this.navbarColor == "#fff" && this.isThemeDark) {
      this.updateNavbarColor("#10163a");
    } else {
      this.updateNavbarColor(this.navbarColor);
    }

    await this.checkSubscribed();

    // this.$vs.loading();
    this.$store.commit("app/SET_LOCATION_LIST", []);
    var mDate = new Date().getTime();
    // var  mDate1 = new Date().getTime()
    await this.setReportSchedule();
    // mDate1 = new Date().getTime()
    // console.log((mDate1 - mDate) , 'setReportSchedule')
    // mDate = mDate1
    await this.setAuth();
    // mDate1 = new Date().getTime()
    // console.log((mDate1 - mDate) , 'setAuth')
    // mDate = mDate1
    await this.setCurrentUser();
    // mDate1 = new Date().getTime()
    // console.log((mDate1 - mDate) , 'setCurrentUser')
    // mDate = mDate1
    await this.setUser();
    // mDate1 = new Date().getTime()
    // console.log((mDate1 - mDate) , 'setUser')
    // mDate = mDate1
    await this.setAllergens();
    // mDate1 = new Date().getTime()
    // console.log((mDate1 - mDate) , 'setAllergens')
    // mDate = mDate1
    await this.setSuppliers();
    // mDate1 = new Date().getTime()
    // console.log((mDate1 - mDate) , 'setSuppliers')
    // mDate = mDate1
    await this.setFoodItems();
    // mDate1 = new Date().getTime()
    // console.log((mDate1 - mDate) , 'setFoodItems')
    // mDate = mDate1
    await this.setTeams();
    // mDate1 = new Date().getTime()
    // console.log((mDate1 - mDate) , 'setTeams')
    // mDate = mDate1
    await this.setLocations();
    // mDate1 = new Date().getTime()
    // console.log((mDate1 - mDate) , 'setLocations')
    // mDate = mDate1
    await this.setTemplateLabels();
    // mDate1 = new Date().getTime()
    // console.log((mDate1 - mDate) , 'setTemplateLabels')
    // mDate = mDate1
    await this.setTemplateTypes();
    // mDate1 = new Date().getTime()
    // console.log((mDate1 - mDate) , 'setTemplateTypes')
    // mDate = mDate1
    await this.setTemplates();
    // mDate1 = new Date().getTime()
    // console.log((mDate1 - mDate) , 'setTemplates')
    // mDate = mDate1
    await this.setPublicTemplates();
    // mDate1 = new Date().getTime()
    // console.log((mDate1 - mDate) , 'setPublicTemplates')
    // mDate = mDate1
    await this.setNotifications();
    // // mDate1 = new Date().getTime()
    // // console.log((mDate1 - mDate) , 'setNotifications')
    // // mDate = mDate1
    await this.setLogs();
    // mDate1 = new Date().getTime()
    // console.log((mDate1 - mDate) , 'setLogs')
    // mDate = mDate1
    await this.setSchedules();
    // mDate1 = new Date().getTime()
    // console.log((mDate1 - mDate) , 'setSchedules')
    // mDate = mDate1
    await this.setChat();
    // mDate1 = new Date().getTime()
    // console.log((mDate1 - mDate) , 'setChat')
    // mDate = mDate1
    await this.setIots();
    // mDate1 = new Date().getTime()
    // console.log((mDate1 - mDate) , 'setIots')
    // mDate = mDate1
    await this.setReports();
    // mDate1 = new Date().getTime()
    // console.log((mDate1 - mDate) , 'setReports')
    // mDate = mDate1
    await this.setKnowledge();
    // mDate1 = new Date().getTime()
    // console.log((mDate1 - mDate) , 'setKnowledge')
    await this.setAnalytics();
    // this.$vs.loading.close();

    // db.collection('notifications').where('group', '==', JSON.parse(localStorage.getItem('userInfo')).group).onSnapshot(q => {
    //     q.docChanges().forEach(change => {

    //         if(change.type === 'modified' && change.doc.data().at !== null && change.doc.data().readIds.indexOf(JSON.parse(localStorage.getItem('userInfo')).id) < 0 ) {
    //             this.$vs.notify({
    //                 time: 8000,
    //                 title: change.doc.data().title,
    //                 text: change.doc.data().text,
    //                 iconPack: "feather",
    //                 icon: "icon-alert-circle",
    //                 color: change.doc.data().alertType,
    //             })
    //             messaging.getToken().then((refreshedToken) => {
    //                 // console.log('Token refreshed.',refreshedToken);
    //             // Indicate that the new Instance ID token has not yet been sent to the
    //             // app server.
    //             // setTokenSentToServer(false);
    //             // Send Instance ID token to app server.
    //             // sendTokenToServer(refreshedToken);
    //             // ...
    //             }).catch((err) => {
    //                 // console.log('Unable to retrieve refreshed token ', err);
    //             // showToken('Unable to retrieve refreshed token ', err);
    //             });
    //         }
    //     })
    // })
  },
};
</script>
<style scoped>
.video-launcher {
  font-size: 10px;
  height: 12px;
  color: #844cf5;
}
</style>
<style>

.layout--main-non-subscribed .vs-sidebar {
  top: 32px!important;
}
.layout--main-non-subscribed .main-layout-navbar .vx-navbar-wrapper {
  top: 32px!important;
}
.layout--main-non-subscribed #content-area {
  position: relative;
  top: 32px!important;
}
.banner-non-subscribed {
  background-color: #fffbcc;
  height: 32px;
  padding: 5px;
  text-align: center;
  font-size: 13px;
  position: fixed;
  width: 100%;
  z-index: 100000;
}
.banner-non-subscribed a {
  font-size: 14px;
  font-weight: bold;
}
.info-badge {
  padding: 2px 7px;
  background: orange;
  border-radius: 3px;
  margin-right: 2px;
  color: white;
  font-size: 12px;
}
/* @media print{
        .no-print{
            display: none !important;
        }
    } */
.pro-price-plan-popup .vs-popup--close--icon {
  display: none;
}
</style>
