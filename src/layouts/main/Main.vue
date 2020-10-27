<!-- =========================================================================================
    File Name: Main.vue
    Description: Main layout
    ----------------------------------------------------------------------------------------
    Item Name: Vuesax Admin - VueJS Dashboard Admin Template
    Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div class="layout--main" :class="[navbarClasses, footerClasses, {'app-page': isAppPage}]">
    <vx-sidebar
      :sidebarItems="sidebarItems"
      :logo="require('@/assets/images/logo/logo.png')"
      title="Vuesax"
      parent=".layout--main"
    />
    <div id="content-area" :class="[contentAreaClass, {'show-overlay': bodyOverlay}]">
      <div id="content-overlay"></div>

      <div class="content-wrapper">
        <the-navbar
          :navbarColor="navbarColor"
          :class="[{'text-white': isNavbarDark && !isThemeDark}, {'text-base': !isNavbarDark && isThemeDark}]"
          class="no-print"
        />

        <div class="router-view">
          <div class="router-content" :class="{'mt-0': navbarType == 'hidden'}">
            <transition :name="routerTransition">
              <div
                class="router-header flex flex-wrap items-center sm:mb-6"
                v-if="$route.meta.breadcrumb || $route.meta.pageTitle"
              >
                <div
                  class="content-area__heading"
                  :class="{'pr-4 border-0 md:border-r border-t-0 border-b-0 border-l-0 border-solid border-grey-light' : $route.meta.breadcrumb}"
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
            <div class="content-area__content">
              <back-to-top bottom="5%" visibleoffset="500" v-if="!hideScrollToTop">
                <vs-button icon-pack="feather" icon="icon-arrow-up" class="shadow-lg" />
              </back-to-top>
              <transition :name="routerTransition" mode="out-in">
                <router-view @changeRouteTitle="changeRouteTitle"></router-view>
              </transition>
            </div>
          </div>
        </div>
      </div>

      <the-footer></the-footer>
    </div>
  </div>
</template>

<script>
import VxSidebar from "@/layouts/components/vx-sidebar/VxSidebar.vue";
import TheNavbar from "../components/TheNavbar.vue";
import TheFooter from "../components/TheFooter.vue";
import themeConfig from "@/../themeConfig.js";
import sidebarItems from "@/layouts/components/vx-sidebar/sidebarItems.js";
import BackToTop from "vue-backtotop";

import firebase from "firebase/app";
import "firebase/auth";

import { db } from "@/firebase/firebaseConfig.js";

// import {fcm} from '@/firebase/cloudMessage.js';
export default {
  data() {
    return {
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
    };
  },
  watch: {
    // idlCalc(val) {
    //   if (this.$store.state.idleVue.isIdle) {
    //     var cUser = this.$store.getters["app/currentUser"];
    //     // this.$router.push("/pages/login");

    //     db.collection("users").doc(cUser.id).update({
    //       chatStatus: "offline",
    //     });
    //     firebase
    //       .auth()
    //       .signOut()
    //       .then(() => {
    //         firebase.analytics().logEvent("sign-out", {
    //           email: cUser.email,
    //         });
    //         this.$intercom.trackEvent("sign-out", {
    //           email: cUser.email,
    //         });
    //         this.$intercom.shutdown();

    //         this.$mixpanel.track("Sign out" , {
    //           distinct_id: cUser.id,
    //           "$email": cUser.email,
    //         })
            
    //         this.$userflow.track("Sign out" , {
    //           email: cUser.email,
    //           group: cUser.email.group
    //         })
    //         this.$userflow.reset()

    //         localStorage.removeItem("userLogin");
    //         localStorage.removeItem("tokenExpiryKey");
    //         localStorage.removeItem("userLogin");

    //         this.$acl.change("public");

    //       });
    //   }
    // },
    $route() {
      this.routeTitle = this.$route.meta.pageTitle;
      var cUser = this.$store.getters["app/currentUser"];
      this.$mixpanel.track("Page View" , {
        distinct_id: cUser.id,
        "URL": window.location.href,
      })
      this.$intercom.trackEvent("Page View", {
        "URL": window.location.href,
      });
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
    setReportSchedule() {
      return new Promise((res,rej)=> {
        db.collection('report_schedule').where('group' , '==' ,  JSON.parse(localStorage.getItem("userInfo")).group).onSnapshot(q=> {
          let schedules = []
          q.forEach(doc=> {
            schedules.push(Object.assign({} , doc.data() , {id: doc.id}))
          })
          this.$store.commit('app/SET_REPORT_SCHEDULE' , schedules)
          res('ok')
        })
      })
    },
    setAuth() {
      return new Promise((resolve,reject) => {
        db.collection("roles").doc(JSON.parse(localStorage.getItem("userInfo")).group).onSnapshot((q)=> {
          var subjects = ['records' , 'templates' , 'schedule' , 'food items' , 'report', 'knowledge base' , 'analytics' , 'user and team settings']
          var auth = {}
          if(!q.exists) {
            subjects.map(item=> {
              auth[item] = {
                admin: {
                  view: true,
                  create: true,
                  edit: true,
                  delete: false
                },
                supervisor: {
                  view: true,
                  create: true,
                  edit: false,
                  delete: false
                },
                operator: {
                  view: true,
                  create: false,
                  edit: false,
                  delete: false
                },
                auditor: {
                  view: true,
                  create: false,
                  edit: false,
                  delete: false
                }
              }
            })
          }else {
            subjects.map(item=> {
              auth[item] = q.data()[item]
            })
          }
            this.$store.commit("app/SET_AUTH" , auth)

          resolve("OK")
        })
      })
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
            ){
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
              users.push(Object.assign({}, doc.data(), { id: doc.id }));
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
      return new Promise((resolve, reject) => {
        db.collection("logs")
          .where(
            "group",
            "==",
            JSON.parse(localStorage.getItem("userInfo")).group
          )
          .onSnapshot((q) => {
            let logs = [];
            q.forEach((doc) => {
              // db.collection("logs")
              //   .doc(doc.id)
              //   .delete();
              logs.push(Object.assign({}, doc.data(), { id: doc.id }));
            });
            this.$store.dispatch("app/setLogs", logs);
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
            )
              return;
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
              )
                return;
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
    // fcm.onMessage((payload) => {
    //     console.log('Message received. ', payload);
    // });

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
        console.log("online");
        // gives Boolean
        // then do what you need like provide a message
      } else {
        console.log("offline");
      }
    },
  },
  components: {
    VxSidebar,
    TheNavbar,
    TheFooter,
    BackToTop,
  },
  mounted() {
    // this.$acl.onChange = newPermission => {
    //   console.log("Has changed to", newPermission);
    // };
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

    // this.$intercom.boot({
    //     user_id: user.id,
    //     name: user.name,
    //     email: user.email,
    //     group: user.group,
    //     location: location,
    //     phone: phone,
    //     role: role,
    //     team: team,
    //     hide_default_launcher: true
    // });
    // window.addEventListener('online',  this.updateStatus('online'));
    // window.addEventListener('offline',  this.updateStatus('offline'));
  },
  async created() {
    var user = JSON.parse(localStorage.getItem("userInfo"));
    if (!this.$userflow.isIdentified()) {
      this.$userflow.identify(user.id)
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

    this.$intercom.boot({
      user_id: user.id,
      name: user.name,
      email: user.email,
      group: user.group,
      location: location,
      phone: phone,
      role: roles[role],
      team: team,
      hide_default_launcher: true,
    });

    this.setSidebarWidth();
    if (this.navbarColor == "#fff" && this.isThemeDark) {
      this.updateNavbarColor("#10163a");
    } else {
      this.updateNavbarColor(this.navbarColor);
    }
    this.$vs.loading();
    this.$store.commit('app/SET_LOCATION_LIST' , [])
    await this.setReportSchedule()
    await this.setAuth();
    await this.setCurrentUser();
    await this.setUser();
    await this.setAllergens();
    await this.setSuppliers();
    await this.setFoodItems();
    await this.setTeams();
    await this.setLocations();
    await this.setTemplateLabels();
    await this.setTemplateTypes();
    await this.setTemplates();
    await this.setPublicTemplates();

    await this.setNotifications();
    await this.setLogs();
    await this.setSchedules();
    await this.setChat();
    await this.setIots();
    await this.setReports();
    await this.setKnowledge();
    this.$vs.loading.close();

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
    //                 console.log('Token refreshed.',refreshedToken);
    //             // Indicate that the new Instance ID token has not yet been sent to the
    //             // app server.
    //             // setTokenSentToServer(false);
    //             // Send Instance ID token to app server.
    //             // sendTokenToServer(refreshedToken);
    //             // ...
    //             }).catch((err) => {
    //                 console.log('Unable to retrieve refreshed token ', err);
    //             // showToken('Unable to retrieve refreshed token ', err);
    //             });
    //         }
    //     })
    // })
  },
};
</script>
<style>
/* @media print{
        .no-print{
            display: none !important;
        }
    } */
</style>
