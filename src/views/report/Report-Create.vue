<template>
  <div id="report-create">
    <div class="flex items-center justify-between mb-4">
      <div class="page-title">
        <span
          class="karla-bold main-title cursor-pointer"
          @click="$router.push('/report')"
        >{{$t("report") | capitalize}}</span>
        <span class="karla-bold">&nbsp;> {{$t("New Report")}}</span>
      </div>
      <div class="flex items-center page-action">
        <feather-icon
          icon="FilterIcon"
          class="p-2 shadow-drop mr-2 w-10 rounded-lg d-theme-dark-bg cursor-pointer text-primary"
          @click="reportFilterSidebar=true"
        />

        <vs-button
          color="primary"
          icon-pack="feather"
          icon="icon-file-text"
          type="filled"
          @click="activeSave=true"
          :disabled="filter.template === undefined || filter.template.length == 0"
        >{{$t("save") | capitalize}}</vs-button>
      </div>
    </div>

    <div class="vx-row">
      <vx-card>
        <div class="vx-row w-full" v-if="filteredLogs.length>0">
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
              <h2 class="text-center mb-2 mt-4 font-bold">{{filteredLogs.length}}</h2>
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
        <div class="vx-row w-full" v-if="filteredLogs.length>0">
          <table class="w-full mt-base logStatusTable">
            <thead>
              <tr>
                <th
                  class="py-2 border border-solid d-theme-border-grey-light border-t-0 border-l-0 border-r-0"
                  width="50%"
                >{{$t("check list")}}</th>
                <th
                  class="py-2 border border-solid d-theme-border-grey-light border-t-0 border-l-0 border-r-0"
                  width="20%"
                >{{$t("tasks")}}</th>
                <th
                  class="hidden sm:table-cell py-2 border border-solid d-theme-border-grey-light border-t-0 border-l-0 border-r-0"
                  width="20%"
                >{{$t("status")}}</th>
                <th
                  class="hidden sm:table-cell py-2 border border-solid d-theme-border-grey-light border-t-0 border-l-0 border-r-0"
                  width="10%"
                >{{$t("done")}}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in filteredLogs" :key="log.id">
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
              :src="require('../../assets/images/pages/report/empty-doc.svg')"
              class="mx-auto mb-4 cursor-pointer"
              @click="reportFilterSidebar = true"
            />
            <h3
              class="mt-base text-grey"
            >Select the options from right side bar to generate the report.</h3>
          </div>
        </div>
      </vx-card>
      <template v-if="filteredLogs.length>0">
        <vx-card class="mt-base" v-for="(log,index) in filteredLogs" :key="index">
          <log-item :log="log" :order="index" />
        </vx-card>
      </template>
    </div>
    <report-filter
      :isSidebarActive="reportFilterSidebar"
      @chnFilter="chnFilter"
      @closeSidebar="reportFilterSidebar = false"
    />
    <!-- :is-valid="!this.errors.any() && this.userName != ''" -->
    <vs-prompt
      :is-valid="reportTitle!=''"
      :title="$t('New Report')"
      :accept-text="$t('save') | capitalize"
      :cancel-text="$t('cancel') | capitalize"
      @accept="saveReport"
      :active.sync="activeSave"
    >
      <div class="vx-row">
        <div class="vx-coll w-full mb-4">
          <label class="font-semibold">{{$t("report title")}}</label>
          <vs-input v-model="reportTitle" class="w-full" placeholder="Report Title" />
        </div>
        <div class="vx-coll w-full mb-4">
          <label class="font-semibold">{{$t("descriptions")}}</label>
          <vs-textarea v-model="description" />
        </div>
        <div class="vx-coll w-full">
          <label class="font-semibold">{{$t("visible to")}}</label>
          <div class="flex items-center mt-2">
            <div v-for="(visibleItem,vIndex) in visibles" :key="vIndex">
              <div class="flex items-center ml-4" v-if="visibleItem.key==visible">
                <vs-icon icon="radio_button_checked" size="25px" color="primary" />
                <span class="karla text-primary">{{visibleItem.text}}</span>
              </div>
              <div
                class="flex items-center cursor-pointer ml-4"
                v-else
                @click="visible=visibleItem.key"
              >
                <vs-icon icon="radio_button_unchecked" size="25px" />
                <span class="karla">{{visibleItem.text}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="vx-col w-full mt-4" v-if="visible=='Teams'">
        <label class="font-semibold">{{$t('teams')}}</label>
        <v-select :options="teams" label="name" multiple v-model="team" />
      </div>
      <div class="vx-col w-full mt-4">
        <label class="font-semibold">{{$t('tags')}}</label>
        <v-select :options="tags" label="name" multiple v-model="tag">
          <template slot="option" slot-scope="option">
            <div class="flex items-center">
              <div class="h-2 w-2 rounded-full mr-3" :style="`background:${option.color}`"></div>
              <span class="karla">{{option.name}}</span>
            </div>
          </template>
          <template slot="selected-option" slot-scope="option">
            <div class="flex items-center">
              <div class="h-2 w-2 rounded-full mr-1" :style="`background:${option.color}`"></div>
              <span class="karla">{{option.name}}</span>
            </div>
          </template>
        </v-select>
      </div>
    </vs-prompt>
  </div>
</template>

<script>
import ReportFilter from "./ReportFilter.vue";
import LogItem from "./LogItem.vue";
import VSelect from "vue-select";
import { db } from "@/firebase/firebaseConfig.js";
export default {
  components: {
    ReportFilter,
    LogItem,
    VSelect,
  },
  data() {
    return {
      team: [],
      visible: "Just me",
      description: "",
      reportTitle: "",
      activeSave: false,
      filter: {},
      tag: [],
      wasSidebarOpen: null,
      reportFilterSidebar: true,
    };
  },
  computed: {
    tags() {
      return this.$store.getters["app/labels"];
    },
    teams() {
      return this.$store.getters["app/teams"].filter((item) => item.active);
    },
    getTemplateInfo() {
      return (id) => {
        return this.$store.getters["app/getTemplateById"](id);
      };
    },
    logInfo() {
      return (log) => {
        let templateTitle = this.getTemplateInfo(log.templateID).content
          .templateTitle;
        var total = 0;
        var completed = 0;
        var state, done;
        log.logs.map((page) => {
          page.questions.map((question) => {
            question.answers.map((answer) => {
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
      let logs = this.filteredLogs;
      var scores = 0;
      var score = 0;
      var tasks = 0;
      var complted = 0;
      var ontime = 0;
      var scheduled = 0;
      var ontimeTask = true;
      var checkOnTimeTask = 0;
      logs.map((log) => {
        ontime = 0;
        ontimeTask = true;
        if (log.key === undefined || log.key != "pinned") {
          scheduled++;
          if (log.time === undefined) return;
          ontime = log.time.toDate().getTime();
        }
        log.logs.map((page) => {
          page.questions.map((question) => {
            question.answers.map((answer) => {
              score = 0;
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
    filteredLogs() {
      var filters = this.filter;
      var log = [];
      var logs = this.$store.getters["app/logs"];
      var locations = this.$store.getters["app/locationList"];
      var checkLog = []

      logs = logs.filter((log) => {
        if(log.time && log.time.seconds) {
          if(checkLog.find(check=> check.templateID == log.templateID && check.time == log.time.seconds))
            return false
          checkLog.push({templateID: log.templateID , time: log.time.seconds})
        }
        var template = this.$store.getters["app/getTemplateById"](
          log.templateID
        );

        if (
          locations.length > 0 &&
          (template.content.location !== undefined) &
            (template.content.location.length > 0)
        ) {
          if (
            !locations.some((item) => template.content.location.includes(item))
          )
            return false;
        }
        var filterFrom = true;
        var filterTo = true;
        var filterTemplate = false;
        var userFlag = true;
        var teamFlag = true;
        var filterLabel = true;
        var filterStatus = true;
        if (filters.from !== undefined && filters.from != "")
          filterFrom =
            log.updated_at.toDate().getTime() >= filters.from.getTime();
        if (filters.to !== undefined && filters.to != "")
          filterTo = log.updated_at.toDate().getTime() <= filters.to.getTime();
        if (filters.template !== undefined && filters.template.length > 0) {
          filterTemplate = filters.template.indexOf(log.templateID) > -1;
        }

        if (filters.user !== undefined && filters.user.length > 0) {
          userFlag = false;
          log.logs.map((__log) => {
            if (userFlag) return;
            __log.questions.map((question) => {
              if (userFlag) return;
              question.answers.map((answer) => {
                if (userFlag) return;
                if (!answer.loged) return;
                if (filters.user.indexOf(answer.user) > -1) userFlag = true;
              });
            });
          });
        }

        if (filters.team !== undefined && filters.team.length > 0) {
          teamFlag = false;
          log.logs.map((__log) => {
            if (teamFlag) return;
            __log.questions.map((question) => {
              if (teamFlag) return;
              question.answers.map((answer) => {
                if (teamFlag) return;
                if (!answer.loged) return;
                var team = this.$store.getters["app/users"].find(
                  (item) => item.id == answer.user
                );
                if (team === undefined || team.team === undefined) return;
                team = team.team;
                teamFlag = filters.team.some((item) => team.includes(item));
              });
            });
          });
        }

        if (filters.label !== undefined && filters.label.length > 0) {
          var labels = template.content.templateLabel;
          filterLabel = filters.label.some((item) => labels.includes(item));
        }

        if (filters.status !== undefined && filters.status != "") {
          var falied = false;
          log.logs.map((page) => {
            page.questions.map((question) => {
              question.answers.map((answer) => {
                if (
                  answer.ref.type.failedAnswer &&
                  answer.ref.type.failedAnswer == answer.value
                )
                  falied = true;
              });
            });
          });
          filterStatus =
            (filters.status == "passed" && !falied) ||
            (filters.status != "passed" && falied);
        }

        // console.log("filterFrom=================   ", filterFrom, "\n");
        // console.log("filterTo=================   ", filterTo, "\n");
        // console.log("userFlag=================   ", userFlag, "\n");
        // console.log("teamFlag=================   ", teamFlag, "\n");
        // console.log("filterTemplate=================   ", filterTemplate, "\n");
        // console.log("filterLabel=================   ", filterLabel, "\n");
        // console.log("filterStatus=================   ", filterStatus, "\n");
        // console.log("\n");
        // console.log("\n");

        return (
          filterFrom &&
          filterTo &&
          userFlag &&
          teamFlag &&
          filterTemplate &&
          filterLabel &&
          filterStatus
        );
      });
      return logs;
    },
    visibles() {
      return [
        { text: this.$t("Just me"), key: "Just me" },
        { key: "Public", text: this.$t("public") },
        { key: "Teams", text: this.$t("teams") },
      ];
    },
  },
  methods: {
    saveReport() {
      this.reportFilterSidebar = false;
      var teams = [];
      this.team.map((item) => teams.push(item.id));

      var tags = [];
      this.tag.map((item) => tags.push(item.id));
      var newReport = db.collection('reports').doc()
      newReport.set({
        title: this.reportTitle,
        description: this.description,
        visible: this.visible,
        teams: teams,
        tags: tags,
        filter: this.filter,
        location: this.$store.getters["app/locationList"],
        created_at: new Date(),
        updated_at: new Date(),
        created_by: JSON.parse(localStorage.getItem("userInfo")).id,
        group: JSON.parse(localStorage.getItem("userInfo")).group,
      })
      this.$mixpanel.track("Create Report" , {
        distinct_id: JSON.parse(localStorage.getItem("userInfo")).id,
        id: newReport.id,
        title: this.reportTitle,
        group: JSON.parse(localStorage.getItem("userInfo")).group
      })

      this.$userflow.track("Create Report" , {
        id: newReport.id,
        title: this.reportTitle,
        group: JSON.parse(localStorage.getItem("userInfo")).group
      })
      this.$intercom.trackEvent('Create Log', {
        group: JSON.parse(localStorage.getItem("userInfo")).group,
        email: JSON.parse(localStorage.getItem("userInfo")).email,
        id: newReport.id,
        title: this.reportTitle,
      })
      this.$router.push("/report");
    },
    chnFilter(filters) {
      this.reportFilterSidebar = false;
      this.filter = filters;
    },
  },
};
</script>

<style scoped>
.page-title > span {
  color: #1e1c26;
  font-size: 24px;
}
.page-title > span.main-title {
  opacity: 0.54;
}
</style>


