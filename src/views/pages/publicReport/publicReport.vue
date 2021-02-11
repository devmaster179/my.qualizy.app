<template>
  <div id="public-report" style="background-color:#E5E5E5">
    <div class="vx-row pt-base full-height">
      <div class="vx-col mx-auto sm:mt-base w-full" style="max-width:1200px;">
        <vx-card class="w-full" remove-card-action>
          <div class="vx-row pb-base" slot="no-body">
            <div class="vx-col w-full md:w-1/2 pl-12">
              <img :src="require('@/assets/images/logo/logo-text.png')" width="112px" />
              <p
                class="banner-text karla my-base"
              >How to score 5 Stars in Food Safety Without a single piece of paperwork...</p>
              <router-link to="/" class="underline">
                <p class="banner-text karla">Checkout our website</p>
              </router-link>
            </div>
            <div class="vx-col w-1/2 hidden relative md:block">
              <img
                :src="require('@/assets/images/banner/banner.svg')"
                class="absolute"
                style="top:-70px"
              />
            </div>
          </div>
        </vx-card>
      </div>
      <div class="vx-col mx-auto sm:mt-base w-full" style="max-width:1200px;">
        <div class="flex items-center flex-row md:mt-base mb-4">
          <vs-avatar size="70px" class="mr-4" :src="companyImage" />
          <div>
            <h4 class>{{company.bussiness}}</h4>
            <span class="font-medium mb-2 mt-4 sm:mt-0">{{company.address}}</span>
          </div>
        </div>
        <vx-card :title="report.reportTitle" class="mb-base">
          <div class="vx-row w-full" v-if="logs.length>0">
            <div class="px-2 vx-col md:w-1/4 sm:w-1/2 w-full">
              <div class="rounded-lg border border-solid d-theme-border-grey-light p-4">
                <div class="text-center">
                  <feather-icon
                    icon="EyeIcon"
                    class="text-primary p-3 inline-flex rounded-full"
                    style="background: rgba(var(--vs-primary),.15);"
                  ></feather-icon>
                </div>
                <h2 class="text-center mt-4 mb-2 font-bold">{{reportInfo.score}}</h2>
                <p class="text-center">General Score</p>
              </div>
            </div>
            <div class="px-2 vx-col md:w-1/4 sm:w-1/2 w-full mt-1 sm:mt-0">
              <div class="rounded-lg border border-solid d-theme-border-grey-light p-4">
                <div class="text-center">
                  <feather-icon
                    icon="ClipboardIcon"
                    class="p-3 inline-flex rounded-full"
                    style="background: #3980f626; color: #3980F6;"
                  ></feather-icon>
                </div>
                <h2 class="text-center mt-4 mb-2 font-bold">{{reportInfo.tasks}}</h2>
                <p class="text-center">Tasks</p>
              </div>
            </div>
            <div class="px-2 vx-col md:w-1/4 sm:w-1/2 w-full md:mt-0 mt-1">
              <div class="rounded-lg border border-solid d-theme-border-grey-light p-4">
                <div class="text-center">
                  <feather-icon
                    icon="ListIcon"
                    class="text-warning p-3 inline-flex rounded-full"
                    style="background: rgba(var(--vs-warning),.15)"
                  ></feather-icon>
                </div>
                <h2 class="text-center mb-2 mt-4 font-bold">{{logs.length}}</h2>
                <p class="text-center">Check List</p>
              </div>
            </div>
            <div class="px-2 vx-col md:w-1/4 sm:w-1/2 w-full md:mt-0 mt-1">
              <div class="rounded-lg border border-solid d-theme-border-grey-light p-4">
                <div class="text-center">
                  <feather-icon
                    icon="CalendarIcon"
                    class="text-success p-3 inline-flex rounded-full"
                    style="background: rgba(var(--vs-success),.15)"
                  ></feather-icon>
                </div>
                <h2 class="text-center mb-2 mt-4 font-bold">{{reportInfo.ontime}}</h2>
                <p class="text-center">Completed on time</p>
              </div>
            </div>
          </div>
          <div class="vx-row w-full" v-if="logs.length>0">
            <table class="w-full mt-base logStatusTable">
              <thead>
                <tr>
                  <th
                    width="50%"
                    class="py-2 border border-solid d-theme-border-grey-light border-t-0 border-l-0 border-r-0"
                  >Checklists</th>
                  <th
                    width="20%"
                    class="py-2 border border-solid d-theme-border-grey-light border-t-0 border-l-0 border-r-0"
                  >Tasks</th>
                  <th
                    width="20%"
                    class="hidden sm:table-cell py-2 border border-solid d-theme-border-grey-light border-t-0 border-l-0 border-r-0"
                  >Status</th>
                  <th
                    width="10%"
                    class="hidden sm:table-cell py-2 border border-solid d-theme-border-grey-light border-t-0 border-l-0 border-r-0"
                  >Done</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="log in logs" :key="log.id">
                  <td
                    class="py-5 pl-3 border border-solid d-theme-border-grey-light border-t-0 border-l-0 border-r-0"
                  >{{logInfo(log).templateTitle}}</td>
                  <td
                    class="py-5 border border-solid d-theme-border-grey-light border-t-0 border-l-0 border-r-0"
                  >{{logInfo(log).tasks}}</td>
                  <td
                    class="hidden sm:table-cell py-5 border border-solid d-theme-border-grey-light border-t-0 border-l-0 border-r-0"
                  >{{logInfo(log).status}}</td>
                  <td
                    class="hidden sm:table-cell py-5 border border-solid d-theme-border-grey-light border-t-0 border-l-0 border-r-0"
                  >{{logInfo(log).done}}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="flex w-full mt-base" v-else>
            <div
              class="vx-col flex items-center flex-col sm:w-1/2 md:w-3/5 lg:w-3/4 xl:w-1/2 mx-auto text-center sm:mt-base mt-0"
              style="min-height:500px;"
            >
              <img
                :src="require('../../../assets/images/pages/report/empty-doc.svg')"
                class="mx-auto mb-4 cursor-pointer"
                @click="reportFilterSidebar = true"
              />
              <h3
                class="mt-base text-grey"
              >Select the options from right side bar to generate the report.</h3>
            </div>
          </div>
        </vx-card>
        <template v-if="logs.length>0">
          <h5
            class="mt-6 mb-4"
            style="font-size: 18px;  font-weight: bold;  color: #1e1c26;"
          >More Details</h5>
          <vx-card class="mb-base" v-for="(log,index) in logs" :key="index">
            <log-item :log="log" :order="index" v-if="log.logs!==undefined" />
          </vx-card>
        </template>
      </div>
    </div>
    <div class="footer p-4 bg-white w-full">
      <div class="mx-auto" style="max-width:1200px">
        <div
          class="flex items-center justify-between border border-solid d-theme-border-grey-light border-t-0 border-r-0 border-l-0 pb-3"
        >
          <img src="../../../assets/images/logo/logo-text.png" style="max-width:100px;" />
          <div>
            <img
              class="mr-8"
              src="../../../assets/images/social/facebook.svg"
              style="max-width:30px"
            />
            <img src="../../../assets/images/social/twitter.svg" style="max-width:30px" />
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div class="vs-con-items">
            <li class="vs-navbar--item">
              <a href="#" class="text-primary font-semibold">Privacy Note</a>
            </li>
            <li class="vs-navbar--item">
              <a href="#" class="text-primary font-semibold">Blog</a>
            </li>
            <li class="vs-navbar--item">
              <a href="#">Support</a>
            </li>
          </div>
          <p>Qualizy© 2020 All rights reserved</p>
        </div>
      </div>
    </div>
    <back-to-top bottom="5%" visibleoffset="500" v-if="!hideScrollToTop">
      <vs-button icon-pack="feather" icon="icon-arrow-up" class="shadow-lg" />
    </back-to-top>
  </div>
</template>
<script>
import LogItem from "../../report/LogItem.vue";
import BackToTop from "vue-backtotop";
import themeConfig from "@/../themeConfig.js";

import { db } from "@/firebase/firebaseConfig";
export default {
  components: {
    LogItem,
    BackToTop,
  },
  data() {
    return {
      company: "",
      report: {},
      filter: {},
      logs: [],
      hideScrollToTop: themeConfig.hideScrollToTop,
    };
  },
  computed: {
    getTemplateInfo() {
      return (id) => {
        return this.$store.getters["app/getTemplateById"](id);
      };
    },
    logInfo() {
      return (log) => {
        if (this.getTemplateInfo(log.templateID) === undefined) return {};
        let templateTitle = this.getTemplateInfo(log.templateID).content
          .templateTitle;
        var total = 0;
        var completed = 0;
        var state, done;
        log.logs.map((page) => {
          page.questions.map((question) => {
            question.answers.map((answer) => {
              if (this.getTemplateType(answer.ref.type.id) === undefined)
                return;
              if (
                this.getTemplateType(answer.ref.type.id).content !=
                "instruction"
              ) {
                if (answer.ref.mandatory) {
                  total++;
                  if (answer.loged) completed++;
                }
              }
            });
          });
        });
        if (total > 0) {
          status = total == completed ? "Completed" : "Incompleted";
          done = Math.round((completed * 1000) / total) / 10 + "%";
        } else {
          status = "---";
          done = "---";
        }
        return {
          templateTitle: templateTitle,
          tasks: `${completed}/${total}`,
          status: status,
          done: done,
        };
      };
    },
    reportInfo() {
      let logs = this.logs;
      var scores = 0;
      var score = 0;
      var tasks = 0;
      var complted = 0;
      var ontime = 0;
      var scheduled = 0;
      var ontimeTask = true;
      var checkOnTimeTask = 0;
      logs.map((log) => {
        if(!log.templateID){
          return;
        } 
        var template = this.$store.getters['app/getTemplateById'](log.templateID);
        if(!template) return
        ontime = 0;
        ontimeTask = true;

        if (log.key === undefined || log.key != "pinned") {
          if (log.time !== undefined) {
            scheduled++;
            ontime = log.time.toDate().getTime();
          }
        }
        log.logs.map((page) => {
          page.questions.map((question) => {
            question.answers.map((answer) => {
              score = 0;
              if (this.getTemplateType(answer.ref.type.id) === undefined)
                return;
              if (
                this.getTemplateType(answer.ref.type.id).content !=
                "instruction"
              ) {
                if (answer.ref.mandatory) {
                  tasks++;
                  if (answer.loged) complted++;
                }
              }
              if (ontime != 0 && answer.ref.mandatory) {
                ontimeTask =
                  ontimeTask &&
                  answer.loged &&
                  answer.time.toDate().getTime() <= ontime;
              }
              if (answer.loged) {
                if (
                  this.getTemplateType(answer.ref.type.id).content ==
                  "temperature"
                ) {
                  if (
                    answer.ref.score === undefined ||
                    !Array.isArray(answer.ref.score)
                  ) {
                    score = 10;
                  } else {
                    var checkedScore = false;
                    answer.ref.score.map((scoreItem, sindex) => {
                      if (checkedScore) return;
                      if (sindex == 0) var defaultScore = scoreItem.score;
                      else {
                        if (scoreItem.condition == "equal") {
                          if (scoreItem.value0 == answer.value) {
                            checkedScore = true;
                            score = scoreItem.score;
                          } else score = defaultScore;
                        } else if (scoreItem.condition == "Nequal") {
                          if (scoreItem.value0 != answer.value) {
                            checkedScore = true;
                            score = scoreItem.score;
                          } else score = defaultScore;
                        } else if (scoreItem.condition == "less") {
                          if (scoreItem.value0 > answer.value) {
                            {
                              checkedScore = true;
                              score = scoreItem.score;
                            }
                          } else score = defaultScore;
                        } else if (scoreItem.condition == "Eless") {
                          if (scoreItem.value0 >= answer.value) {
                            checkedScore = true;
                            score = scoreItem.score;
                          } else score = defaultScore;
                        } else if (scoreItem.condition == "than") {
                          if (scoreItem.value0 < answer.value) {
                            checkedScore = true;
                            score = scoreItem.score;
                          } else score = defaultScore;
                        } else if (scoreItem.condition == "Ethan") {
                          if (scoreItem.value0 <= answer.value) {
                            checkedScore = true;
                            score = scoreItem.score;
                          } else score = defaultScore;
                        } else if (scoreItem.condition == "between") {
                          if (
                            scoreItem.value0 <= answer.value &&
                            scoreItem.value1 >= answer.value
                          ) {
                            checkedScore = true;
                            score = scoreItem.score;
                          } else score = defaultScore;
                        }
                      }
                    });
                  }

                  scores += Math.round(score * 10) / 10;
                } else if (
                  this.getTemplateType(answer.ref.type.id).type ==
                  "closed answers"
                ) {
                  if (
                    answer.ref.score === undefined ||
                    !Array.isArray(answer.ref.score) ||
                    answer.ref.score.length == 0
                  ) {
                    score = 10;
                  } else {
                    score = answer.ref.score.find(
                      (scoreItem) => scoreItem.key == answer.value
                    ).score;
                  }
                  scores += Math.round(score * 10) / 10;
                }
              }
            });
          });
        });
        if (ontime != 0 && ontimeTask) checkOnTimeTask++;
      });
      return {
        score: scores,
        tasks: `${complted}/${tasks}`,
        ontime: `${checkOnTimeTask}/${scheduled}`,
      };
    },
    getTemplateType() {
      return (id) => {
        var type = this.$store.getters["app/getTemplateTypeById"](id);
        return type;
      };
    },
    companyImage() {
      if (this.company != "" && this.company.logo !== "")
        return this.company.logo;
      else return require("../../../assets/images/logo/logo.png");
    },
  },
  methods: {
    getLogs(filter) {
      new Promise((resolve, reject) => {
        var today = new Date();
        if (this.filter.date == "custom") {
          this.filter.from = new Date(
            today.getTime() - 10 * 24 * 60 * 60 * 1000
          );
          this.filter.to = today;
        } else if (this.filter.date == "today") {
          this.filter.from = this.filter.to = today;
        } else if (this.filter.date == "thisW") {
          this.filter.to = today;
          var today1 = new Date();
          var day = today1.getDay();
          var diff = today1.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
          this.filter.from = new Date(today1.setDate(diff));
        } else if (this.filter.date == "thisM") {
          this.filter.to = today;
          this.filter.from = new Date(today.getFullYear(), today.getMonth(), 1);
        } else if (this.filter.date == "thisQ") {
          this.filter.to = today;
          this.filter.from = new Date(
            today.getFullYear(),
            Math.floor(today.getMonth() / 3) * 3,
            1
          );
        } else if (this.filter.date == "thisY") {
          this.filter.to = today;
          this.filter.from = new Date(today.getFullYear(), 0, 1);
        } else if (this.filter.date == "beforeD") {
          this.filter.to = today;
          this.filter.from = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        } else if (this.filter.date == "beforeW") {
          var today1 = new Date();
          var day = today1.getDay();
          var diff = today1.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
          this.filter.to = new Date(today1.setDate(diff - 1));
          this.filter.from = new Date(today.setDate(diff - 7));
        } else if (this.filter.date == "beforeM") {
          this.filter.to = new Date(today.getFullYear(), today.getMonth(), 0);
          this.filter.from = new Date(
            today.getFullYear(),
            today.getMonth() - 1,
            1
          );
        } else if (this.filter.date == "beforeQ") {
          this.filter.to = new Date(
            today.getFullYear(),
            Math.floor(today.getMonth() / 3) * 3,
            0
          );
          this.filter.from = new Date(
            this.filter.to.getFullYear(),
            this.filter.to.getMonth() - 2,
            1
          );
        } else if (this.filter.date == "beforeY") {
          this.filter.to = new Date(today.getFullYear(), 0, 0);
          this.filter.from = new Date(today.getFullYear() - 1, 0, 1);
        } else if (this.filter.date == "all") {
          this.filter.to = this.filter.from = "";
        }
        this.filter.from =
          this.filter.from == ""
            ? 0
            : new Date(this.filter.from.setHours(0, 0, 0, 0)).getTime();
        this.filter.to =
          this.filter.to == ""
            ? Infinity
            : new Date(this.filter.to.setHours(23, 59, 59, 999)).getTime();
        var logs = [];
        db.collection("logs")
          .where("templateID", "in", this.filter.template)
          .get()
          .then((docs) => {
            docs.forEach((doc) => {
              var date =
                doc.data().updated_at.seconds === undefined
                  ? doc.data().updated_at
                  : doc.data().updated_at.toDate();
              if (
                date.getTime() > this.filter.to ||
                date.getTime() < this.filter.from
              )
                return;
              logs.push(Object.assign({}, { id: doc.id }, doc.data()));
            });
            this.logs = logs.sort(
              (a, b) =>
                b.updated_at.toDate().getTime() -
                a.updated_at.toDate().getTime()
            );
            resolve("OK");
          });
      });
    },
    getReport(id) {
      return new Promise((resolve, reject) => {
        db.collection("reports")
          .doc(id)
          .get()
          .then((doc) => {
            this.report = Object.assign({}, { id: doc.id }, doc.data());
            resolve("OK");
          });
      });
    },
    setTemplates() {
      return new Promise((resolve, reject) => {
        db.collection("templates")
          .where("group", "==", this.report.group)
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
    setTemplateTypes() {
      return new Promise((resolve, reject) => {
        db.collection("template_type").onSnapshot((q) => {
          let types = [];
          q.forEach((doc) => {
            if (doc.data().type === "closed answers") {
              if (
                doc.data().group != "global" &&
                doc.data().group != this.report.group
              )
                return;
            }
            types.push(Object.assign({}, doc.data(), { id: doc.id }));
          });
          this.$store.dispatch("app/setTemplateType", types);
          resolve("OK");
        });
      });
    },
    setCompany() {
      return new Promise((resolve, reject) => {
        db.collection("companies")
          .doc(this.report.group)
          .get()
          .then((doc) => {
            this.company = Object.assign({}, { id: doc.id }, doc.data());
            resolve("OK");
          });
      });
    },
    setUser() {
      return new Promise((resolve, reject) => {
        db.collection("users")
          .where("group", "==", this.report.group)
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
          .where("group", "==", this.report.group)
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
  },
  async created() {
    let reportID = this.$route.params.id;
    this.$vs.loading();
    await this.setTemplateTypes();
    await this.getReport(reportID);
    this.filter = this.report.filter;
    await this.setTemplates();
    await this.setCompany();
    await this.getLogs();
    await this.setUser();
    await this.setTeams();

    this.$vs.loading.close();
  },
};
</script>
<style scoped>
#public-report .full-height {
  min-height: calc(100vh);
}
.footer {
  bottom: 0;
}
.banner-text {
  font-size: 16px;
}
</style>