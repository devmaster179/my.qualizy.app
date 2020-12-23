<template>
  <div id="tasks" class="px-2">
    <div class="flex justify-between" v-if="!isSidebarActive && !logDetailsActive ">
      <div class="flex items-end">
        <p class="karla-bold page-title">{{$t("tasks")}}</p>
        <p
          class="karla page-subtitle ml-2 mb-1 hidden lg:block"
        >({{tasks('task').length}} {{$t("tasks for")}} {{cationDate}} {{new Date()|moment("DD.MMM.YYYY")}})</p>
      </div>
      <div class="flex justify-end">
        <vs-input
          v-model="search"
          icon-pack="feather"
          icon="icon-search"
          :placeholder="$t('Search')"
          class="is-label-placeholder mt-0 w-full sm:w-1/4 hidden lg:block"
          icon-no-border
        />
        <v-select
          :options="ranges"
          label="text"
          v-model="range"
          class="bg-white ml-2 hidden sm:block"
          style="min-width:160px;"
        />
        <div class="flex justify-end items-center">
          <feather-icon
            @click="filterActive=true"
            icon="FilterIcon"
            class="ml-2 rounded-lg d-theme-dark-bg cursor-pointer"
            :class="{'text-primary':filterActive}"
            style="height:40px; width:40px; padding:0.8rem;"
          />
          <vs-button
            @click="activeSchedule = true"
            text-color="#2400d0"
            color="#dedbf0"
            class="karla-bold ml-2 p-3 sm:px-5"
            type="filled"
          >{{$t("schedule")}}</vs-button>
          <vs-button
            class="ml-2 p-3 sm:px-5"
            color="#6c50f0"
            type="filled"
            @click="unscheduleActive=true"
          >
            <div class="flex items-center">
              <vs-icon icon-pack="feather" class="mr-1" icon="icon-plus" />
              <span class="karla">{{$t('add task')}}</span>
            </div>
          </vs-button>
        </div>
      </div>
    </div>
    <v-select
       v-if="!isSidebarActive"
      :options="ranges"
      label="text"
      v-model="range"
      class="bg-white mt-2 block sm:hidden"
      style="min-width:160px;"
    />
    <swiper :options="swiperOption" v-if="!isSidebarActive && !logDetailsActive">
      <swiper-slide>
        <div class="mt-4">
          <div class="pr4">
            <vx-card class="w-full">
              <div slot="no-body" class="p-4">
                <div class="flex justify-between">
                  <div class="flex items-center">
                    <feather-icon
                      icon="ClipboardIcon"
                      class="text-black inline-flex rounded-full"
                      style="background: rgba(30,28,38,.1); width:24px;height:24px; padding:5px;"
                    ></feather-icon>
                    <span class="karla-bold task-group-text ml-2">{{$t("scheduled") | capitalize}}</span>
                  </div>
                  <p class="karla-bold task-group-text">{{tasks('task').length}}</p>
                </div>
              </div>
            </vx-card>
          </div>
          <VuePerfectScrollbar :settings="settings" class="scroll-area-task pr4 mt-3">
            <task-item
              v-for="(task,index) in tasks('task')"
              :task="task"
              :key="index"
              @click.native="assign(task)"
            ></task-item>
          </VuePerfectScrollbar>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="mt-4">
          <div class="pr4">
            <vx-card class="w-full">
              <div slot="no-body" class="p-4">
                <div class="flex justify-between">
                  <div class="flex items-center">
                    <feather-icon
                      icon="BriefcaseIcon"
                      class="text-warning inline-flex rounded-full"
                      style="background: rgba(var(--vs-warning),.1); width:24px;height:24px;padding:5px;"
                    ></feather-icon>
                    <p class="karla-bold task-group-text ml-2">{{$t("unscheduled")}}</p>
                  </div>
                  <p class="karla-bold task-group-text">{{unshceduledTemplates.length}}</p>
                </div>
              </div>
            </vx-card>
          </div>
          <VuePerfectScrollbar :settings="settings" class="scroll-area-task pr4 mt-3">
            <task-item
              pinned
              v-for="(task,index) in unshceduledTemplates"
              :task="task"
              :key="index"
              @click.native="assign(task,true)"
            ></task-item>
          </VuePerfectScrollbar>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="mt-4">
          <div class="pr4">
            <vx-card class="w-full">
              <div slot="no-body" class="p-4">
                <div class="flex justify-between">
                  <div class="flex items-center">
                    <feather-icon
                      icon="ClockIcon"
                      class="text-primary inline-flex rounded-full"
                      style="background: rgba(var(--vs-primary),.1); width:24px;height:24px;padding:5px;"
                    ></feather-icon>
                    <p class="karla-bold task-group-text ml-2">{{$t("in progress")}}</p>
                  </div>
                  <p class="karla-bold task-group-text">{{logs.progress.length}}</p>
                </div>
              </div>
            </vx-card>
          </div>
          <VuePerfectScrollbar :settings="settings" class="scroll-area-task pr4 mt-3">
            <task-item
              v-for="(log,index) in logs.progress"
              :pinned="log.time===undefined"
              :task="log"
              progress
              :key="index"
              @click.native="editLog(log)"
            ></task-item>
          </VuePerfectScrollbar>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="mt-4">
          <div class="pr-1">
            <vx-card class="w-full">
              <div slot="no-body" class="p-4">
                <div class="flex justify-between">
                  <div class="flex items-center">
                    <feather-icon
                      icon="CheckIcon"
                      class="text-success inline-flex rounded-full"
                      style="background: rgba(var(--vs-success),.1); width:24px;height:24px; padding:5px;"
                    ></feather-icon>
                    <p class="karla-bold task-group-text ml-2">{{$t("completed")}}</p>
                  </div>
                  <p class="karla-bold task-group-text">{{logs.complated.length}}</p>
                </div>
              </div>
            </vx-card>
          </div>
          <VuePerfectScrollbar :settings="settings" class="scroll-area-task pr-2 mt-3">
            <completed-item
              v-for="(task,index) in logs.complated"
              :pinned="task.time===undefined"
              :task="task"
              :key="index"
              @click.native="editLog(task)"
            ></completed-item>
          </VuePerfectScrollbar>
        </div>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
      <!-- </div> -->
    </swiper>
    <schedule-popup :open="activeSchedule" @close="activeSchedule=false" />
    <log-details
      parent="#tasks"
      :logID="logID"
      :pages="pages"
      :template="template"
      :isSidebarActive="logDetailsActive"
      @closeSidebar="logDetailsActive=false"
    />
    <log-sidebar
      parent="#tasks"
      :logID="logID"
      :pages="pages"
      :template="template"
      :isSidebarActive="isSidebarActive"
      @closeSidebar="isSidebarActive=false"
    />
    <unschedule-sidebar
      :open="unscheduleActive"
      @closeSidebar="unscheduleActive=false"
      @assginTemplate="assign"
    ></unschedule-sidebar>
    <admin-filter :open="filterActive" @closeSidebar="filterActive=false" @filter="filter" />
  </div>
</template>

<script>
import "swiper/css/swiper.css";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import UnscheduleSidebar from "./UnscheduleSidebar";
import CompletedItem from "./completedItem.vue";
import SchedulePopup from "../schedule/SchedulePopup";
import AdminFilter from "./AdminFilter";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import VSelect from "vue-select";
import TaskItem from "./taskItem.vue";
import LogSidebar from "./LogSidebar.vue";
import LogDetails from "./LogDetails.vue";
import { db } from "@/firebase/firebaseConfig";
import UsereEditSidebarVue from '../team/user/UsereEditSidebar.vue';

export default {
  components: {
    AdminFilter,
    VSelect,
    UnscheduleSidebar,
    TaskItem,
    LogSidebar,
    VuePerfectScrollbar,
    SchedulePopup,
    Swiper,
    SwiperSlide,
    CompletedItem,
    LogDetails
  },
  data() {
    return {
      init: true,
      logDetailsActive: false,
      search: "",
      status: "",
      tags: "",
      teams: "",
      workers: "",
      dueDate: "",
      logTime: "",
      filterActive: false,
      unscheduleActive: false,
      swiperOption: {
        slidesPerView: 1,
        spaceBetween: 10,
        // init: false,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        breakpoints: {
          1300: {
            slidesPerView: 4,
            spaceBetween: 10,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
        },
      },
      pages: [],
      template: "",
      selectedTask: "",
      isSidebarActive: false,
      logID: "",
      rangeDay: "day",
      activeSchedule: false,
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.5,
      },
      wasSidebarOpen: null,
    };
  },
  computed: {
    cationDate() {
      var date = this.$t("today");
      if (this.rangeDay == "week") date = this.$t("this week");
      else if (this.rangeDay == "month") date = this.$t("this month");
      return date;
    },
    unshceduledTemplates() {
      var cUser = this.$store.getters["app/currentUser"]
      var locationList = this.$store.getters['app/locationList']
      if(locationList.length==0) {
        if(cUser.role == undefined || cUser.role.key == undefined || cUser.role.key>0) {
          if(cUser.location !== undefined && Array.isArray(cUser.location) && cUser.location.length>0) {
            locationList = cUser.location
          } else {
            locationList = ['no']
          }
        }
      }

      var userTeam = cUser.team || []
      let templates = this.$store.getters["app/getBookedTemplate"]
        .sort(
          (a, b) =>
            b.updated_at.toDate().getTime() - a.updated_at.toDate().getTime()
        );

      var unshceduledTemplate = [];
      templates.map((template) => {
        if (template.trashed) return 
        if(locationList.length > 0) {
          if(!template.content.location || !Array.isArray(template.content.location)) return 
          if(!locationList.some(ll=> template.content.location.includes(ll))) return 
        }
        if(template.content.teams !== undefined && Array.isArray(template.content.teams) && template.content.teams.length>0) {
          if(!template.content.teams.some(t=> userTeam.includes(t))) return 
        }
        if (this.tags != "") {
          if (template.content.templateLabel === undefined) return 
          if (
            !item.content.templateLabel.some((label) =>
              this.tags.includes(label)
            )
          )
            return false;
        }
        if(this.search !='') {
          if(template.content.templateTitle.toLowerCase().indexOf(this.search.toLowerCase())<0)
            return 
        }

        unshceduledTemplate.push({ templateID: template.id });
      });

      return unshceduledTemplate;
    },
    logs() {
      var userTeam = this.$store.getters["app/currentUser"].team
      var dayFrom = 0;
      var dayTo = 0;
      var today = new Date();
      if (this.rangeDay == "day") {
        dayFrom = today.getDate();
        dayTo = today.getDate();
      } else if (this.rangeDay == "week") {
        var day = today.getDay();
        dayFrom = today.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
        dayTo = dayFrom + 6;
      } else if (this.rangeDay == "month") {
        dayFrom = 1;
        dayTo = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0
        ).getDate();
      }
      dayFrom = new Date(today.getFullYear(), today.getMonth(), dayFrom);
      dayTo = new Date(
        today.getFullYear(),
        today.getMonth(),
        dayTo + 1,
        0,
        0,
        -1
      );
      var log = this.$store.getters["app/logs"];
      var schedule
      var cUser = this.$store.getters["app/currentUser"]
      var locationList = this.$store.getters['app/locationList']
      if(locationList.length==0) {
        if(cUser.role == undefined || cUser.role.key == undefined || cUser.role.key>0) {
          if(cUser.location !== undefined && Array.isArray(cUser.location) && cUser.location.length>0) {
            locationList = cUser.location
          } else {
            locationList = ['no']
          }
        }
      }
      log = log.filter((item) => {
        
        var template = this.$store.getters["app/getTemplateById"](
          item.templateID
        );
        if (!template) return false;
        if (template.trashed) return false;
        if(template.content.templateSD == 'bookmarked') {
          if(template.content.teams!=undefined && Array.isArray(template.content.teams) && template.content.teams.length>0 && !template.content.teams.some(t=> userTeam.includes(t))) return false
          if(locationList.length>0) {
            if(!template.content.location || !Array.isArray(template.content.location)) return false
            if(!locationList.some(ll=> template.content.location.includes(ll))) return false
          }
        } else {
          schedule = this.$store.getters['app/getScheduleById'](item.schedule || '')
          if(schedule == undefined) return false
          if ((schedule.deleted !== undefined && schedule.deleted === true) || (schedule.active !== undefined && !schedule.active)) return false;
          var scheduleTeam = schedule.assign.concat(schedule.monitor || [])
          if(!scheduleTeam.some(t=> userTeam.includes(t))) return false
          if(schedule.location== undefined) return false
          if(locationList.length>0) {
            if(locationList.indexOf(schedule.location[0])<0) return false
          }
        }
        if (this.status == "noDue") {
          if (item.time !== undefined) return false;
        }
        if (
          template.content.templateTitle
            .toLowerCase()
            .indexOf(this.search.toLowerCase()) < 0 &&
          this.search != ""
        )
          return false;
        if (item.initial !== undefined && item.initial) return false;

        if (item.updated_at.nanoseconds === undefined) {
          return (
            item.updated_at.getTime() >= dayFrom.getTime() &&
            item.updated_at.getTime() <= dayTo.getTime()
          );
        } else {
          return (
            item.updated_at.toDate().getTime() >= dayFrom.getTime() &&
            item.updated_at.toDate().getTime() <= dayTo.getTime()
          );
        }
      });

      var progressLogs = [];
      var complatedLogs = [];
      progressLogs = log.filter((item) => {
        let complated = true;
        var tasks = 0;
        var incompleted = 0;
        item.logs.map((page) => {
          page.questions.map((question) => {
            question.answers.map((answer) => {
              if (answer.ref.mandatory) {
                tasks++;
                if (!answer.loged) {
                  complated = false;
                  incompleted++;
                }
              }
            });
          });
        });
        return !complated;
      });
      complatedLogs = log.filter((item) => {
        let complated = true;
        item.logs.map((page) => {
          page.questions.map((question) => {
            question.answers.map((answer) => {
              if (answer.ref.mandatory && !answer.loged) complated = false;
            });
          });
        });
        return complated;
      });
      return {
        progress: progressLogs,
        complated: complatedLogs,
      };
    },
    tasks() {
      return (status) => {
        var dayFrom = 0;
        var dayTo = 0;
        var today = new Date();
        if (this.rangeDay == "day") {
          dayFrom = today.getDate();
          dayTo = today.getDate();
        } else if (this.rangeDay == "week") {
          var day = today.getDay();
          dayFrom = today.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
          dayTo = dayFrom + 6;
        } else if (this.rangeDay == "month") {
          dayFrom = 1;
          dayTo = new Date(
            today.getFullYear(),
            today.getMonth() + 1,
            0
          ).getDate();
        }
        var cUser = this.$store.getters["app/currentUser"]
        var userTeam = cUser.team || []
        if(!Array.isArray(userTeam)) userTeam = []
        var locationList = this.$store.getters['app/locationList']
        if(locationList.length==0) {
          if(cUser.role == undefined || cUser.role.key == undefined || cUser.role.key>0) {
            if(cUser.location !== undefined && Array.isArray(cUser.location) && cUser.location.length>0) {
              locationList = cUser.location
            } else {
              locationList = ['no']
            }
          }
        }
        var schedules = this.$store.getters["app/schedules"]

        schedules = schedules.filter((schedule) => {
          if(schedule.location==undefined) return false
          let scheduleLocation = schedule.location[0] 
          if ((schedule.deleted !== undefined && schedule.deleted === true) || (schedule.active !== undefined && !schedule.active)) return false;
          if(locationList.length>0) {
            if(locationList.indexOf(scheduleLocation)<0) return false
          }
          var template = this.$store.getters["app/getTemplateById"](
            schedule.template
          );
          var scheduleTeam = schedule.assign.concat(schedule.monitor || [])
          if (template === undefined) return false;
          if (template.trashed !== undefined && template.trashed) return false;
          if (template.content.templateSD == 'bookmarked') return false
          if (
            template.content.templateTitle
              .toLowerCase()
              .indexOf(this.search.toLowerCase()) < 0
          )
            return false;

          if (!scheduleTeam.some((item) => userTeam.includes(item))) return false
          if (this.teams != "") {
            if (!scheduleTeam.some((item) => this.teams.includes(item)))
              return false;
          }
          if (this.tags != "") {
            if (template.content.templateLabel === undefined) return false;
            if(!template.content.templateLabel.some((item) => this.tags.includes(item))) return false
          }

          return true;
        });
        var taskTime = "";
        var interval = 1;
        var validSchedules = [];
        for (let i = dayFrom; i <= dayTo; i++) {
          schedules.map((schedule) => {
            schedule.dueTimes.map((duetime) => {
              if (duetime.nanoseconds !== undefined)
                taskTime = duetime.toDate();
              else taskTime = duetime;
              interval =
                schedule.interval === undefined ? 1 : schedule.interval;
              if (
                schedule._repeat == "Weekly" ||
                schedule._repeat == "Monthly"
              ) {
                schedule.selectedDays.map((day) => {
                  if (
                    this.checkScheule(
                      i,
                      taskTime,
                      interval,
                      schedule._repeat,
                      day
                    )
                  )
                    validSchedules.push({
                      schedule: schedule.id,
                      assign: schedule.assign,
                      templateID: schedule.template,
                      time: new Date(
                        today.getFullYear(),
                        today.getMonth(),
                        i,
                        taskTime.getHours(),
                        taskTime.getMinutes()
                      ),
                    });
                });
              } else {
                if (
                  this.checkScheule(i, taskTime, interval, schedule._repeat)
                ) {
                  validSchedules.push({
                    schedule: schedule.id,
                    assign: schedule.assign,
                    templateID: schedule.template,
                    time: new Date(
                      today.getFullYear(),
                      today.getMonth(),
                      i,
                      taskTime.getHours(),
                      taskTime.getMinutes()
                    ),
                  });
                }
              }
            });
          });
        }
        validSchedules = validSchedules.filter((task) => {
          return !this.checkLog(task, status);
        });
        validSchedules = validSchedules.sort(
          (a, b) => a.time.getTime() - b.time.getTime()
        );
        if (this.status != "") {
          validSchedules = validSchedules.filter((item) => {
            if (this.status == "due") {
              return item.time.getTime() >= today.getTime();
            } else if (this.status == "over") {
              return item.time.getTime() < today.getTime();
            } else if (this.status == "noDue") {
              return false;
            }
          });
        }
        return validSchedules
      };
    },
    checkLog() {
      return (task, status) => {
        let log = this.$store.getters["app/getLogByTidTime"](
          task.templateID,
          task.time,
          task.schedule,
          task.assign
        );
        
        if (status == "task") {

          if (log === undefined) return false;
          else return true
          var result = false;
          log.logs.map((page) => {
            page.questions.map((question) => {
              question.answers.map((answer) => {
                if (answer.ref.mandatory && answer.loged) result = true;
              });
            });
          });
          return result;
        }
      };
    },
    checkScheule() {
      return (date, duetime, interval, repeat, day = "") => {
        var today = new Date();
        var taskDate = new Date(today.getFullYear(), today.getMonth(), date);
        var dueDate = new Date(
          duetime.getFullYear(),
          duetime.getMonth(),
          duetime.getDate()
        );

        if (taskDate.getTime() < dueDate.getTime()) {
          return false;
        }
        if (repeat == "No Repeat") {
          if (date == today.getDate()) return true;
          else return false;
        } else if (repeat == "Daily") {
          if (
            ((taskDate.getTime() -
              dueDate.getTime() -
              (taskDate.getTimezoneOffset() - dueDate.getTimezoneOffset()) *
                60 *
                1000) /
              (1000 * 3600 * 24)) %
              interval ==
            0
          )
            return true;
          else return false;
        } else if (repeat == "Weekly") {
          var dayValue = day.value == 0 ? 7 : day.value;
          var dayDueValue = dueDate.getDay() == 0 ? 7 : dueDate.getDay();
          if (dayDueValue > dayValue)
            var startDate = new Date(
              dueDate.getFullYear(),
              dueDate.getMonth(),
              dueDate.getDate() + (7 - (dayDueValue - dayValue))
            );
          else {
            var startDate = new Date(
              dueDate.getFullYear(),
              dueDate.getMonth(),
              dueDate.getDate() - dayDueValue + dayValue
            );
          }

          if (startDate.getTime() > taskDate.getTime()) {
            return false;
          } else {
            if (
              ((taskDate.getTime() -
                startDate.getTime() -
                (taskDate.getTimezoneOffset() - startDate.getTimezoneOffset()) *
                  60 *
                  1000) /
                (1000 * 3600 * 24)) %
                (interval * 7) ==
              0
            )
              return true;
            else return false;
          }
        } else if (repeat == "Monthly") {
          if (dueDate.getDate() > day)
            var startDate = new Date(
              dueDate.getFullYear(),
              dueDate.getMonth() + 1,
              day
            );
          else
            var startDate = new Date(
              dueDate.getFullYear(),
              dueDate.getMonth(),
              day
            );
          if (startDate.getTime() > taskDate.getTime()) return false;
          else {
            if (
              startDate.getDate() == taskDate.getDate() &&
              (taskDate.getFullYear() - startDate.getFullYear()) * 12 +
                ((taskDate.getMonth() - startDate.getMonth()) % interval) ==
                0
            )
              return true;
            else return false;
          }
        }
      };
    },

    range: {
      get() {
        return this.ranges.find((item) => item.value == this.rangeDay);
      },
      set(val) {
        if (val !== null) this.rangeDay = val.value;
        else this.rangeDay = "day";
      },
    },
    ranges() {
      return [
        { text: this.$t("day"), value: "day" },
        { text: this.$t("week"), value: "week" },
        { text: this.$t("month"), value: "month" },
      ];
    },
    // tasks() {
    //   return this.$store.getters["app/template"];
    // }
    auth() {
      return action => {
        let authList = this.$store.getters['app/auth']
        var cUser = this.$store.getters["app/currentUser"];
        if(cUser == undefined || cUser.role == undefined) return false
        else if(cUser.role.key == 0) 
          return true
        else if(authList.records[cUser.role.name.toLowerCase()][action])
          return true
        else 
          return false
      }
    }
  },
  methods: {
    setLog() {
      var dayFrom
      var dayTo
      var today = new Date();
      if (this.rangeDay == "day") {
        dayFrom = today.getDate();
        dayTo = today.getDate();
      } else if (this.rangeDay == "week") {
        var day = today.getDay();
        dayFrom = today.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
        dayTo = dayFrom + 6;
      } else if (this.rangeDay == "month") {
        dayFrom = 1;
        dayTo = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0
        ).getDate();
      }
      dayFrom = new Date(today.getFullYear(), today.getMonth(), dayFrom);
      dayTo = new Date(
        today.getFullYear(),
        today.getMonth(),
        dayTo + 1,
        0,
        0,
        -1
      );
      if(!this.init)
        this.$vs.loading()
      db.collection("logs")
      .where(
        "group",
        "==",
        JSON.parse(localStorage.getItem("userInfo")).group
      ).where('updated_at' , '>' , dayFrom)
      .get().then((q) => {
        if(!this.init) {
          this.$vs.loading.close()
        }
        this.init= false
        let logs = [];
        q.forEach((doc) => {
          logs.push(Object.assign({}, doc.data(), { id: doc.id }));
        });
        this.$store.dispatch("app/setLogs", logs);
      });    
    },
    filter(val) {
      this.status = val.status;
      this.tags = val.tag;
      this.teams = val.team;
      this.workers = val.worker;
      this.dueDate = val.dueDate;
      this.logTiem = val.logTime;
    },
    roleError(action) {
      this.$vs.notify({
        time: 5000,
        title: "Authorization Error",
        text:
          `You don't have authorization for ${action} log.\n Please contact with your super admin`,
        color: "danger",
        iconPack: "feather",
        icon: "icon-lock",
        // position:'bottom-center'
      });
    },
    editLog(log) {
      if(!this.auth('edit'))  {
        this.roleError('edit')
        return false
      }
      if(log.schedule != undefined) {
        var schedule = this.$store.getters['app/getScheduleById'](log.schedule)
        var cUser = this.$store.getters["app/currentUser"];
        var cTeam = cUser.team || []
        if(!Array.isArray(cTeam)) cTeam = []
        if(!cTeam.some(ct=>schedule.assign.includes(ct))) {
          this.logDetailsActive = true
          this.template = log.templateID;
          this.pages = log.logs;
          return false
        }
      }
      this.$vs.loading();
      this.logID = log.id;

      db.collection("logs")
        .doc(this.logID)
        .get()
        .then((doc) => {
          this.$vs.loading.close();
          this.pages = doc.data().logs;
          this.template = log.templateID;
          this.isSidebarActive = true;
        });
    },
    monitorNotify() {
      this.$vs.notify({
        time: 5000,
        title: "Monitor",
        text:
          `You can only monitor this task.`,
        color: "primary",
        iconPack: "feather",
        icon: "icon-info",
        // position:'bottom-center'
      });
    },
    async assign(task, unscheduled = false) {
      if(task.assign != undefined) {
        var cUser = this.$store.getters["app/currentUser"];
        var cTeam = cUser.team || []
        if(!Array.isArray(cTeam)) cTeam = []
        if(!cTeam.some(ct=>task.assign.includes(ct))) {
          var pages = [];
          var template = this.$store.getters["app/getTemplateById"](
            task.templateID
          );
          
          template = JSON.parse(JSON.stringify(template))

          template.content.pages.map((page, pIndex) => {
            var questions = [];
            page.questions.map((question, qIndex) => {
              var answers = [];
              question.answers.map((answer, aIndex) => {
                delete answer.action
                var date = new Date();
                let answerType = this.$store.getters["app/getTemplateTypeById"](
                  answer.type.id
                );
                if (answerType == undefined) return;
                if (
                  (answerType.type == "opened answers" &&
                    answerType.content == "number") ||
                  answerType.content == "temperature" ||
                  answerType.content == "score" ||
                  answerType.content == "star"
                )
                  answers.push({
                    ref: answer,
                    loged: false,
                    value: 0,
                    time: "",
                    user: "",
                  });
                else if (answerType.content == "date")
                  answers.push({
                    ref: answer,
                    loged: false,
                    value: "",
                    time: "",
                    user: "",
                  });
                else if (answerType.content == "automatic date and time stamp")
                  answers.push({
                    ref: answer,
                    loged: true,
                    value: new Date(),
                    time: date,
                    user: JSON.parse(localStorage.getItem("userInfo")).id,
                  });
                else if (answerType.content == "automatic user stamp")
                  answers.push({
                    ref: answer,
                    loged: true,
                    value: JSON.parse(localStorage.getItem("userInfo")).id,
                    time: date,
                    user: JSON.parse(localStorage.getItem("userInfo")).id,
                  });
                else if (answerType.type == "attachments")
                  answers.push({
                    ref: answer,
                    loged: false,
                    images: [],
                    time: "",
                    user: "",
                  });
                else if (answerType.content == "instruction")
                  answers.push({
                    ref: answer,
                    loged: true,
                    value: "",
                    time: date,
                    user: JSON.parse(localStorage.getItem("userInfo")).id,
                  });
                else
                  answers.push({
                    ref: answer,
                    loged: false,
                    value: "",
                    time: "",
                    user: "",
                  });
              });
              questions.push({ answers: answers, title: question.title });
            });
            pages.push({ questions: questions, title: page.title });
          });
          this.pages = pages
          this.template = task.templateID
          this.logDetailsActive = true
          return false
        }
      }
      if(!this.auth('create')) {
        this.roleError('create');
        return false;
      }
      const that = this
      // this.$vs.loading();
      var updated_at = new Date();
      var pages = [];
      var template = this.$store.getters["app/getTemplateById"](
        task.templateID
      );
      template = JSON.parse(JSON.stringify(template))
      if (!unscheduled) {
        let log = this.$store.getters["app/getLogByTidTime"](
          task.templateID,
          task.time
        );
        if (log === undefined) {
          template.content.pages.map((page, pIndex) => {
            var questions = [];
            page.questions.map((question, qIndex) => {
              var answers = [];
              question.answers.map((answer, aIndex) => {
                delete answer.action
                var date = new Date();
                let answerType = this.$store.getters["app/getTemplateTypeById"](
                  answer.type.id
                );
                if (answerType == undefined) return;
                if (
                  (answerType.type == "opened answers" &&
                    answerType.content == "number") ||
                  answerType.content == "temperature" ||
                  answerType.content == "score" ||
                  answerType.content == "star"
                )
                  answers.push({
                    ref: answer,
                    loged: false,
                    value: 0,
                    time: "",
                    user: "",
                  });
                else if (answerType.content == "date")
                  answers.push({
                    ref: answer,
                    loged: false,
                    value: "",
                    time: "",
                    user: "",
                  });
                else if (answerType.content == "automatic date and time stamp")
                  answers.push({
                    ref: answer,
                    loged: true,
                    value: new Date(),
                    time: date,
                    user: JSON.parse(localStorage.getItem("userInfo")).id,
                  });
                else if (answerType.content == "automatic user stamp")
                  answers.push({
                    ref: answer,
                    loged: true,
                    value: JSON.parse(localStorage.getItem("userInfo")).id,
                    time: date,
                    user: JSON.parse(localStorage.getItem("userInfo")).id,
                  });
                else if (answerType.type == "attachments")
                  answers.push({
                    ref: answer,
                    loged: false,
                    images: [],
                    time: "",
                    user: "",
                  });
                else if (answerType.content == "instruction")
                  answers.push({
                    ref: answer,
                    loged: true,
                    value: "",
                    time: date,
                    user: JSON.parse(localStorage.getItem("userInfo")).id,
                  });
                else
                  answers.push({
                    ref: answer,
                    loged: false,
                    value: "",
                    time: "",
                    user: "",
                  });
              });
              questions.push({ answers: answers, title: question.title });
            });
            pages.push({ questions: questions, title: page.title });
          });
          db.collection("logs").add({
            schedule: task.schedule,
            initial: unscheduled,
            time: task.time,
            templateID: task.templateID,
            logs: pages,
            updated_at: updated_at,
            updated_by: JSON.parse(localStorage.getItem("userInfo")).id,
            group: JSON.parse(localStorage.getItem("userInfo")).group,
          });
          that.getLogID(updated_at, task.templateID).then((id) => {
            that.$vs.loading.close();

            that.$userflow.track("Create Log" , {
              id: id
            })

            window.gist.track("Create Log" , {
              id: id
            })

            that.logID = id;
            that.pages = pages;
            that.template = task.templateID;
            that.isSidebarActive = true;
          });
        } else {
          that.getLogID1(log.id).then((data) => {
            that.$vs.loading.close();
            that.logID = log.id;
            that.pages = data.logs;
            that.template = task.templateID;
            that.isSidebarActive = true;
          });
        }
      } else {
        template.content.pages.map((page, pIndex) => {
          var questions = [];
          page.questions.map((question, qIndex) => {
            var answers = [];
            question.answers.map((answer, aIndex) => {
              delete answer.action
              var date = new Date();
              let answerType = this.$store.getters["app/getTemplateTypeById"](
                answer.type.id
              );
              if (answerType == undefined) return;
              if (
                (answerType.type == "opened answers" &&
                  answerType.content == "number") ||
                answerType.content == "temperature" ||
                answerType.content == "score" ||
                answerType.content == "star"
              )
                answers.push({
                  ref: answer,
                  loged: false,
                  value: 0,
                  time: "",
                  user: "",
                });
              else if (answerType.content == "date")
                answers.push({
                  ref: answer,
                  loged: false,
                  value: "",
                  time: "",
                  user: "",
                });
              else if (answerType.content == "automatic date and time stamp")
                answers.push({
                  ref: answer,
                  loged: true,
                  value: new Date(),
                  time: date,
                  user: JSON.parse(localStorage.getItem("userInfo")).id,
                });
              else if (answerType.content == "automatic user stamp")
                answers.push({
                  ref: answer,
                  loged: true,
                  value: JSON.parse(localStorage.getItem("userInfo")).id,
                  time: date,
                  user: JSON.parse(localStorage.getItem("userInfo")).id,
                });
              else if (answerType.type == "attachments")
                answers.push({
                  ref: answer,
                  loged: false,
                  images: [],
                  time: "",
                  user: "",
                });
              else if (answerType.content == "instruction")
                answers.push({
                  ref: answer,
                  loged: true,
                  value: "",
                  time: date,
                  user: JSON.parse(localStorage.getItem("userInfo")).id,
                });
              else
                answers.push({
                  ref: answer,
                  loged: false,
                  value: "",
                  time: "",
                  user: "",
                });
            });
            questions.push({ answers: answers, title: question.title });
          });
          pages.push({ questions: questions, title: page.title });
        });
        var newLogRef = db.collection('logs').doc()
        newLogRef.set({
          key: "pinned",
          initial: unscheduled,
          templateID: task.templateID,
          logs: pages,
          updated_at: updated_at,
          updated_by: JSON.parse(localStorage.getItem("userInfo")).id,
          group: JSON.parse(localStorage.getItem("userInfo")).group,
        })
        this.$vs.loading.close();

        this.$userflow.track("Create Log" , {
          id: newLogRef.id
        })
        window.gist.track("Create Log" , {
          id: newLogRef.id
        })
        this.logID = newLogRef.id;
        this.pages = pages;
        this.template = task.templateID;
        this.isSidebarActive = true;
      }
    },
    getLogID(createdAt, templateID) {
      return new Promise((resolve, reject) => {
        var id = "";
        var date = "";
        db.collection("logs")
          .where(
            "group",
            "==",
            JSON.parse(localStorage.getItem("userInfo")).group
          )
          .where("updated_at", "==", createdAt)
          .onSnapshot({ includeMetadataChanges: true }, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
              if (change.type === "added") {
                if (change.doc.data().updated_at.nanoseconds !== undefined)
                  date = change.doc.data().updated_at.toDate();
                else date = change.doc.data().updated_at;
                if (
                  date.getTime() == createdAt.getTime() &&
                  change.doc.data().templateID == templateID
                )
                  id = change.doc.id;
              }
            });
            if (id != "") resolve(id);
          });
      });
    },

    getLogID1(id) {
      return new Promise((resolve, reject) => {
        db.collection("logs")
          .doc(id)
          .onSnapshot((doc) => {
            resolve(doc.data());
          });
      });
    },
  },
  created() {
    this.setLog()
  },
  watch: {
    rangeDay() {
      this.setLog()
    }
  }
};
</script>
<style>
#task-admin .vx-card {
  box-shadow: none;
}
#task-admin .vs__actions .vs__clear {
  display: none;
}
</style>
<style scoped>
/* #task-admin {
min-height: calc(100vh - 10em);
} */
.page-title {
  font-size: 24px;
  color: #1e1c26;
}
.page-subtitle {
  font-size: 14px;
  color: #1e1c26;
}
.task-group-text {
  font-size: 14px;
}
.scroll-area-task {
  height: calc(100vh - 20rem);
}
/* @media (max-width: 576px) {
  .scroll-area-task {
    height: calc(100vh - 18rem);
  }
} */
.scroll-area-width {
  min-width: 100%;
}
</style>

