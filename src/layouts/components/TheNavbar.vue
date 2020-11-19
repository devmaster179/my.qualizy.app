<!-- =========================================================================================
  File Name: TheNavbar.vue
  Description: Navbar component
  Component Name: TheNavbar
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div class="relative">
    <div class="vx-navbar-wrapper">
      <vs-navbar class="vx-navbar navbar-custom" :color="navbarColor" :class="classObj">
        <!-- SM - OPEN SIDEBAR BUTTON -->
        <feather-icon
          class="sm:inline-flex xl:hidden cursor-pointer mr-1"
          icon="MenuIcon"
          @click.stop="showSidebar"
        ></feather-icon>

        <template>
          <!-- STARRED PAGES - FIRST 10 -->
          <!-- STARRED PAGES MORE -->
          <div
            class="bookmark-container flex items-center cursor-pointer"
            @click.stop="showLocationSelect = true"
          >
            <feather-icon
              icon="MapPinIcon"
              :svgClasses="['text-primary', 'w-6 h-6', {'text-white': navbarColor != '#fff'}]"
              class="p-2 mr-1 rounded-full"
              style="background: rgba(var(--vs-primary),.15);"
            />
            <span
              class="font-semibold text-primary"
              v-if="$store.getters['app/locationList'].length==1"
            >{{$store.getters['app/getLocationById']($store.getters['app/locationList'][0]).name}}</span>
            <span
              class="font-semibold text-primary text-sm sm:text-base"
              v-if="$store.getters['app/locationList'].length>1"
            >{{$store.getters['app/locationList'].length}} {{$t('locations')}}</span>
            <div
              v-click-outside="outside"
              class="absolute bookmark-list w-location sm:w-1/3 xl:w-1/4 mt-base"
              v-if="showLocationSelect"
              style="left:10px;"
            >
              <location-select
                :autoFocus="true"
                inputClassses="w-full"
                show-action
                show-pinned
                @hideLocation="showLocation = false"
                @setLocations="setLocations"
                @removeLocations="removeLocations"
                @addLocations="addLocations"
              />
            </div>
          </div>
        </template>

        <vs-spacer></vs-spacer>

        <div class="knowledge-section hidden sm:block">
          <feather-icon
            icon="InfoIcon"
            class="cursor-pointer mt-1 sm:mr-6 mr-2"
            @click="$router.push('/knowledge-page').catch((err) => {})"
          ></feather-icon>
        </div>
        <div class="knowledge-section hidden sm:block">
          <feather-icon
            icon="MessageSquareIcon"
            class="cursor-pointer mt-1 sm:mr-6 mr-2"
            @click="$router.push('/chat').catch((err) =>{})"
          ></feather-icon>
        </div>

        <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer">
          <span class="cursor-pointer flex i18n-locale">
            <img
              class="h-4 w-5"
              :src="require(`@/assets/images/flags/${$i18n.locale}.png`)"
              :alt="$i18n.locale"
            />
            <span class="hidden sm:block ml-2">{{ getCurrentLocaleData.lang }}</span>
          </span>
          <vs-dropdown-menu class="w-48 i18n-dropdown vx-navbar-dropdown">
            <vs-dropdown-item v-for="locale in locales" :key="locale" @click="updateLocale(locale)">
              <div class="flex items-start">
                <img
                  class="h-4 w-5"
                  :src="require(`@/assets/images/flags/${country(locale).flag}.png`)"
                  :alt="locale"
                />
                <span class="ml-2 karla">{{country(locale).lang}}</span>
              </div>
            </vs-dropdown-item>
          </vs-dropdown-menu>
        </vs-dropdown>

        <!-- NOTIFICATIONS -->
        <!-- <feather-icon
          icon="BellIcon"
          class="cursor-pointer ml-2 sm:mr-6 mr-1"
          :badge="unreadNotifications.length"
        ></feather-icon>-->
        <!-- @click="viewAllNtf(unreadNotifications)" -->
        <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer ml-4">
          <feather-icon
            icon="BellIcon"
            class="cursor-pointer mt-1 sm:mr-6 mr-2"
            :badge="unreadNotifications.length"
          ></feather-icon>
          <vs-dropdown-menu class="notification-dropdown dropdown-custom vx-navbar-dropdown">
            <div class="notification-top text-center p-5 bg-primary text-white">
              <h3 class="text-white karla">{{ unreadNotifications.length }} New</h3>
              <p class="opacity-75 karla">App Notifications</p>
            </div>
            <VuePerfectScrollbar
              ref="mainSidebarPs"
              class="scroll-area--nofications-dropdown p-0 mb-10"
              :settings="settings"
            >
              <ul class="bordered-items">
                <li
                  v-for="ntf in unreadNotifications"
                  :key="ntf.id"
                  class="flex justify-between px-4 py-4 notification cursor-pointer"
                  :style="`background:rgba(var(--vs-${ntf.alertType}), .2) !important`"
                  @click="readNotification(ntf.id)"
                >
                  <div class="flex items-start">
                    <vs-avatar
                      v-if="getTemplateInfo(ntf.templateId)!=undefined"
                      :src="require(`@/assets/images/template_image/${getTemplateInfo(ntf.templateId).content.templateImage}`)"
                    />
                    <!-- <feather-icon :icon="ntf.icon" :svgClasses="[`text-${ntf.category}`, 'stroke-current mr-1 h-6 w-6']"></feather-icon> -->
                    <div class="mx-2">
                      <span
                        class="font-medium block notification-title"
                        :class="[`text-${ntf.alertType}`]"
                      >{{ ntf.title }}</span>
                      <small
                        class="font-light truncate"
                        :class="[`text-${ntf.alertType}`]"
                      >{{ ntf.text }}</small>
                      <!-- <small
                        class="block"
                        v-if="ntf.taskTime"
                      >Task Time: {{ ntf.taskTime.toDate() | moment("HH:ss") }}</small>
                      <small class="block" v-else>Bookmarked</small>-->
                    </div>
                  </div>
                  <small
                    class="mt-1 whitespace-no-wrap karla"
                    :class="[`text-${ntf.alertType}`]"
                  >{{ calcTime(ntf.updated_at.toDate()) | duration('humanize' , true) | shotTimeText }}</small>
                </li>
              </ul>
            </VuePerfectScrollbar>
            <div
              class="checkout-footer fixed bottom-0 rounded-b-lg text-primary w-full p-2 font-semibold text-center border border-b-0 border-l-0 border-r-0 border-solid d-theme-border-grey-light cursor-pointer"
            >
              <span>View All Notifications</span>
            </div>
          </vs-dropdown-menu>
        </vs-dropdown>
        <div class="knowledge-section hidden sm:block">
          <vx-tooltip text="Switch User" position="bottom">
            <feather-icon icon="UserCheckIcon" class="cursor-pointer mt-1 mr-4" @click="logout"></feather-icon>
          </vx-tooltip>
        </div>
        <!-- USER META -->
        <div class="the-navbar__user-meta flex items-center">
          <div class="text-right leading-tight hidden sm:block">
            <p class="font-semibold">{{ user_displayName }}</p>
            <small>{{$t("available")}}</small>
          </div>
          <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer">
            <div class="con-img ml-3">
              <img
                v-if="activeUserImg.startsWith('http')"
                key="onlineImg"
                :src="activeUserImg"
                alt="user-img"
                width="40"
                height="40"
                class="rounded-full shadow-md cursor-pointer block"
              />
              <img
                v-else
                key="localImg"
                :src="require(`@/assets/images/${activeUserImg}`)"
                alt="user-img"
                width="40"
                height="40"
                class="rounded-full shadow-md cursor-pointer block"
              />
            </div>

            <vs-dropdown-menu class="vx-navbar-dropdown">
              <ul style="min-width: 9rem">
                <li
                  class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
                  @click="$router.push('/profile').catch(err => {})"
                >
                  <feather-icon icon="UserIcon" svgClasses="w-4 h-4"></feather-icon>
                  <span class="ml-2">{{$t("profile") | capitalize}}</span>
                </li>
                <!-- <li class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"><feather-icon icon="MailIcon" svgClasses="w-4 h-4"></feather-icon> <span class="ml-2">Inbox</span></li> -->
                <li
                  class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
                  @click="$router.push('/dashboard').catch(err => {})"
                >
                  <feather-icon icon="CheckSquareIcon" svgClasses="w-4 h-4"></feather-icon>
                  <span class="ml-2">{{$t("tasks")}}</span>
                </li>
                <li
                  class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white sm:hidden block"
                  @click="$router.push('/knowledge-page').catch(err => {})"
                >
                  <feather-icon icon="InfoIcon" svgClasses="w-4 h-4"></feather-icon>
                  <span class="ml-2">{{$t("knowledge base")}}</span>
                </li>
                <li
                  class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white sm:hidden block"
                  @click="$router.push('/chat').catch(err => {})"
                >
                  <feather-icon icon="MessageSquareIcon" svgClasses="w-4 h-4"></feather-icon>
                  <span class="ml-2">{{$t("Chat")}}</span>
                </li>
                <vs-divider class="m-1"></vs-divider>
                <li
                  class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
                  @click="logout"
                >
                  <feather-icon icon="LogOutIcon" svgClasses="w-4 h-4"></feather-icon>
                  <span class="ml-2">{{$t("logout") | capitalize}}</span>
                </li>
              </ul>
            </vs-dropdown-menu>
          </vs-dropdown>
        </div>
      </vs-navbar>
    </div>
  </div>
</template>

<script>
import LocationSelect from "@/components/location-select/LocationSelect1.vue";
import VxAutoSuggest from "@/components/vx-auto-suggest/VxAutoSuggest.vue";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import draggable from "vuedraggable";

//================kk===============

import firebase from "firebase/app";
import "@firebase/firestore";
import "firebase/auth";
import "@firebase/analytics";
import { db } from "@/firebase/firebaseConfig.js";
//=================================

export default {
  name: "the-navbar",
  props: {
    navbarColor: {
      type: String,
      default: "#fff",
    },
  },
  data() {
    return {
      locationSearch: "",
      now: new Date(),
      currentUser: "",
      locales: ["en-us", "en-gb", "fr", "es", "it"],

      settings: {
        // perfectscrollbar settings
        maxScrollbarLength: 60,
        wheelSpeed: 0.6,
      },
      showLocationSelect: false,
    };
  },
  watch: {
    $route() {
      if (this.showLocationSelect) this.showLocationSelect = false;
    },
  },
  computed: {
    calcTime() {
      return (time) => {
        return time.getTime() - this.now.getTime();
      };
    },
    getTemplateInfo() {
      return (id) => {
        return this.$store.getters["app/getTemplateById"](id);
      };
    },

    unreadNotifications() {
      return []
      // var cUser = this.$store.getters["app/currentUser"];
      // if (cUser == undefined) return [];
      // var notify = this.$store.getters["app/unreadNotifications"](cUser);
      // return notify.filter(
      //   (item) =>
      //     this.$store.getters["app/getTemplateById"](item.templateId) !==
      //     undefined
      // );
    },
    country() {
      return (locale) => {
        if (locale == "en-us") return { flag: "en-us", lang: "English" };
        else if (locale == "en-gb") return { flag: "en-gb", lang: "English" };
        else if (locale == "pt") return { flag: "pt", lang: "Português" };
        else if (locale == "fr") return { flag: "fr", lang: "Français" };
        else if (locale == "de") return { flag: "de", lang: "Deutsche" };
        else if (locale == "es") return { flag: "es", lang: "Español" };
        else if (locale == "it") return { flag: "it", lang: "Italiano" };
      };
    },
    // HELPER
    sidebarWidth() {
      return this.$store.state.sidebarWidth;
    },
    breakpoint() {
      return this.$store.state.breakpoint;
    },

    // NAVBAR STYLE
    classObj() {
      if (this.sidebarWidth == "default") return "navbar-default";
      else if (this.sidebarWidth == "reduced") return "navbar-reduced";
      else if (this.sidebarWidth) return "navbar-full";
    },

    // PROFILE
    user_displayName() {
      // return "john_doe"
      if (this.currentUser == "") return "";

      return this.currentUser.name;
    },
    activeUserImg() {
      // return this.$store.state.AppActiveUser.img
      if (this.currentUser == "") this.$store.state.AppActiveUser.img;

      return this.currentUser.photo || this.$store.state.AppActiveUser.img;
    },
    getCurrentLocaleData() {
      const locale = this.$i18n.locale;
      if (locale == "en-us" || locale == "en-gb")
        return { flag: "us", lang: "English" };
      else if (locale == "pt") return { flag: "br", lang: "Português" };
      else if (locale == "fr") return { flag: "fr", lang: "Français" };
      else if (locale == "de") return { flag: "de", lang: "Deutsche" };
      else if (locale == "es") return { flag: "es", lang: "Español" };
      else if (locale == "it") return { flag: "it", lang: "Italiano" };
    },
  },
  methods: {
    removeLocations(val) {
      val.map((item) => {
        this.$store.commit("app/REMOVE_LOCATION_LIST", item);
      });
    },
    addLocations(val) {
      val.map((item) => {
        this.$store.commit("app/ADD_LOCATION_LIST", item);
      });
    },
    setLocations(val) {
      this.$store.commit("app/SET_LOCATION_LIST", val);
    },

    viewAllNtf(unreadNtfs) {
      // var logIDs = [];
      // unreadNtfs.map(item => {
      //   this.readNotification(item.id);
      //   if (logIDs.indexOf(item.logID) > -1) return;
      //   logIDs.push(item.logID);
      // });
      // if (logIDs.length == 0) return false;
      // this.$router.push(`/capture/${logIDs}`).catch(err => {});
    },
    readNotification(nID) {
      db.collection("notifications")
        .doc(nID)
        .update({
          readIds: firebase.firestore.FieldValue.arrayUnion(
            JSON.parse(localStorage.getItem("userInfo")).id
          ),
        });
    },
    updateLocale(locale) {
      this.$i18n.locale = locale;
      this.$moment.locale(locale);
    },
    showSidebar() {
      this.$store.commit("TOGGLE_IS_SIDEBAR_ACTIVE", true);
    },

    logout() {
      // if user is logged in via auth0
      // if (this.$auth.profile) this.$auth.logOut();

      // if user is looged in via firebase
      var cUser = this.$store.getters["app/currentUser"];


      firebase
        .auth()
        .signOut()
        .then(() => {
          db.collection("users").doc(cUser.id).update({
            chatStatus: "offline",
          });
          firebase.analytics().logEvent("sign-out", {
            email: cUser.email,
          });

          this.$intercom.trackEvent("sign out", {
            user_id: cUser.id,
            email: cUser.email
          });
          this.$intercom.shutdown();

          this.$userflow.track("Sign out" , {
            email: cUser.email,
            group: cUser.email.group
          })
          this.$userflow.reset()

          localStorage.removeItem("userLogin");
          localStorage.removeItem("tokenExpiryKey");
        });

      // Change role on logout. Same value as initialRole of acj.js
    },
    outside: function () {
      this.showLocationSelect = false;
    },
    // Method for creating dummy notification time
  },

  components: {
    LocationSelect,
    VxAutoSuggest,
    VuePerfectScrollbar,
    draggable,
  },
  created() {
    if (localStorage.getItem("userInfo") !== undefined) {
      var id = JSON.parse(localStorage.getItem("userInfo")).id;
      db.collection("users")
        .doc(id)
        .onSnapshot((q) => {
          this.currentUser = q.data();
        });
    }

    setInterval(() => (this.now = new Date()), 1000 * 60);
  },
};
</script>

<style scoped>
.w-location {
  width: 280px;
}
</style>
