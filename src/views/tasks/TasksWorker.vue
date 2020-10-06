<template>
  <div id="tasks" class="px-1">
    <div class="flex justify-between" v-if="!isSidebarActive">
      <div class="flex items-end">
        <p class="karla-bold page-title">{{$t("tasks") | capitalize}}</p>
        <p
          class="karla page-subtitle ml-2 mb-1 hidden md:block"
        >({{tasks('overdue').length+tasks('todo').length}} {{$t("tasks for")}} {{$t("today")}} {{now|moment("DD.MMM.YYYY")}})</p>
      </div>
      <div class="flex justify-end">
        <vs-input
          v-model="search"
          icon-pack="feather"
          icon="icon-search"
          :placeholder="$t('Search')"
          class="is-label-placeholder bg-white mt-0 w-full sm:w-1/4 hidden sm:block"
          icon-no-border
          style="min-width:180px;"
        />
        <feather-icon
          icon="BarChartIcon"
          class="p-2 shadow-drop pl-3 ml-2 rounded-lg d-theme-dark-bg cursor-pointer"
          style="height:40px; width:40px;   transform: rotate(90deg);"
        />

        <feather-icon
          icon="FilterIcon"
          class="ml-2 rounded-lg d-theme-dark-bg cursor-pointer"
          style="height:40px; width:40px; padding:0.8rem;"
          @click="filterActive=true"
        />
        <vs-button
          class="karla ml-2"
          type="filled"
          @click="unscheduleActive=true"
        >+ {{$t("add task")}}</vs-button>
      </div>
    </div>
    <swiper :options="swiperOption" v-if="!isSidebarActive">
      <!-- <div class="vx-row mt-base"> -->
      <swiper-slide>
        <div class="mt-4">
          <div class="pr-4">
            <vx-card class="w-full">
              <div slot="no-body" class="p-4">
                <div class="flex justify-between">
                  <div class="flex items-center">
                    <feather-icon
                      icon="AlertTriangleIcon"
                      class="text-warning inline-flex rounded-full"
                      style="background: rgba(var(--vs-warning),.1); width:24px;height:24px;padding:5px;"
                    ></feather-icon>
                    <span class="karla-bold task-group-text ml-2">Overdue</span>
                  </div>
                  <p class="karla-bold task-group-text">{{tasks('overdue').length}}</p>
                </div>
              </div>
            </vx-card>
          </div>
          <VuePerfectScrollbar :settings="settings" class="scroll-area-task pr-4 mt-3">
            <task-item
              v-for="(task,index) in tasks('overdue')"
              :task="overdue(task)"
              :key="index"
              @click.native="assign(task)"
            ></task-item>
          </VuePerfectScrollbar>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="mt-4">
          <div class="pr-4">
            <vx-card class="w-full">
              <div slot="no-body" class="p-4">
                <div class="flex justify-between">
                  <div class="flex items-center">
                    <feather-icon
                      icon="ClockIcon"
                      class="text-primary inline-flex rounded-full"
                      style="background: rgba(var(--vs-primary),.1); width:24px;height:24px;padding:5px;"
                    ></feather-icon>
                    <p class="karla-bold task-group-text ml-2">In progress</p>
                  </div>
                  <p class="karla-bold task-group-text">{{logs.progress.length}}</p>
                </div>
              </div>
            </vx-card>
          </div>
          <VuePerfectScrollbar :settings="settings" class="scroll-area-task pr-4 mt-3">
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
          <div class="pr-4">
            <vx-card class="w-full">
              <div slot="no-body" class="p-4">
                <div class="flex justify-between">
                  <div class="flex items-center">
                    <feather-icon
                      icon="ClipboardIcon"
                      class="text-black inline-flex rounded-full"
                      style="background: rgba(#000,.1); width:24px;height:24px;padding:5px;"
                    ></feather-icon>
                    <p class="karla-bold task-group-text ml-2">To Do</p>
                  </div>
                  <p class="karla-bold task-group-text">{{tasks('todo').length}}</p>
                </div>
              </div>
            </vx-card>
          </div>
          <VuePerfectScrollbar :settings="settings" class="scroll-area-task pr-4 mt-3">
            <task-item
              v-for="(task,index) in tasks('todo')"
              :pinned="task.time===undefined"
              :task="task"
              :key="index"
              @click.native="assign(task)"
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
                    <p class="karla-bold task-group-text ml-2">Completed</p>
                  </div>
                  <p class="karla-bold task-group-text">{{logs.complated.length}}</p>
                </div>
              </div>
            </vx-card>
          </div>
          <VuePerfectScrollbar :settings="settings" class="scroll-area-task pr-2 mt-3">
            <completed-item
              v-for="(task,index) in logs.complated"
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
    <worker-filter :open="filterActive" @closeSidebar="filterActive=false" @filter="filter" />
  </div>
</template>

<script>
import "swiper/css/swiper.css";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";

import SchedulePopup from "../schedule/SchedulePopup";

import VuePerfectScrollbar from "vue-perfect-scrollbar";
import VSelect from "vue-select";
import TaskItem from "./taskItem.vue";
import CompletedItem from "./completedItem.vue";
import LogSidebar from "./LogSidebar.vue";
import WorkerFilter from "./WorkerFilter";
import UnscheduleSidebar from "./UnscheduleSidebar";
import { db } from "@/firebase/firebaseConfig";

export default {
  components: {
    VSelect,
    TaskItem,
    CompletedItem,
    LogSidebar,
    WorkerFilter,
    VuePerfectScrollbar,
    SchedulePopup,
    Swiper,
    SwiperSlide,
    UnscheduleSidebar,
  },
  data() {
    return {
      search: "",
      frequency: "",
      tag: "",
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
      now: new Date(),
    };
  },
  computed: {
    overdue() {
      return (task) => {
        let log = this.$store.getters["app/getLogByTidTime"](
          task.templateID,
          task.time
        );
        if (log === undefined) return task;
        return log;
      };
    },
    unshceduledTemplates() {
      let templates = this.$store.getters["app/getBookedTemplate"]
        .filter((item) => {
          if (item.trashed !== undefined && item.trashed) return false;

          if (this.$store.getters["app/locationList"].length > 0) {
            if (
              this.$store.getters["app/getTemplateById"](item.id).content
                .location === undefined
            )
              return false;
            if (
              !this.$store.getters["app/locationList"].some((location) =>
                this.$store.getters["app/getTemplateById"](
                  item.id
                ).content.location.includes(location)
              )
            )
              return false;
          }
          if (this.tags != "") {
            if (item.content.templateLabel === undefined) return false;
            if (
              !item.content.templateLabel.some((label) =>
                this.tags.includes(label)
              )
            )
              return false;
          }

          return (
            item.content.templateTitle
              .toLowerCase()
              .indexOf(this.search.toLowerCase()) > -1
          );
        })
        .sort(
          (a, b) =>
            b.updated_at.toDate().getTime() - a.updated_at.toDate().getTime()
        );

      var unshceduledTemplate = [];
      templates.map((template) => {
        unshceduledTemplate.push({ templateID: template.id });
      });

      return unshceduledTemplate;
    },
    logs() {
      var dayFrom = new Date(
        this.now.getFullYear(),
        this.now.getMonth(),
        this.now.getDate()
      );
      var dayTo = new Date(
        this.now.getFullYear(),
        this.now.getMonth(),
        this.now.getDate() + 1,
        0,
        0,
        -1
      );
      var log = this.$store.getters["app/logs"];
      log = log.filter((item) => {
        var template = this.$store.getters["app/getTemplateById"](
          item.templateID
        );
        if (template === undefined) return false;
        if (template.trashed !== undefined && template.trashed) return false;

        if (
          template.content.templateTitle
            .toLowerCase()
            .indexOf(this.search.toLowerCase) < 0 &&
          this.search != ""
        )
          return false;
        if (this.tag != "") {
          if (template.content.templateLabel === undefined) return false;
          if (
            !template.content.templateLabel.some((label) =>
              this.tag.includes(label)
            )
          )
            return false;
          if (
            this.$store.getters["app/getTemplateById"](schedule.template)
              .content.location === undefined
          )
            return false;
          if (this.$store.getters["app/locationList"].length > 0) {
            if (
              !this.$store.getters["app/locationList"].some((item) =>
                this.$store.getters["app/getTemplateById"](
                  schedule.template
                ).content.location.includes(item)
              )
            )
              return false;
          }
        }
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
        if (item.time !== undefined) {
          var taskTime;
          if (item.time.nanoseconds === undefined) taskTime = item.time;
          else taskTime = item.time.toDate();
          if (taskTime.getTime() < this.now.getTime()) return false;
        }
        var completed = this.checkCompleted(item);
        // item.logs.map(page => {
        //   page.questions.map(question => {
        //     question.answers.map(answer => {
        //       if (answer.ref.mandatory && !answer.loged) complated = false;
        //     });
        //   });
        // });
        return !completed.completed && !completed.init;
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
        var teams = this.$store.getters["app/getUserById"](
          JSON.parse(localStorage.getItem("userInfo")).id
        );
        if (teams == undefined || teams.team === undefined) return [];
        var schedules = this.$store.getters["app/getSchedulesByTeam"](
          teams.team
        ).sort(
          (a, b) =>
            b.updated_at.toDate().getTime() - a.updated_at.toDate().getTime()
        );

        schedules = schedules.filter((schedule) => {
          if (schedule.active !== undefined && !schedule.active) return false;

          var template = this.$store.getters["app/getTemplateById"](
            schedule.template
          );
          if (template === undefined) return false;
          if (template.trashed !== undefined && template.trashed) return false;

          if (
            template.content.templateTitle
              .toLowerCase()
              .indexOf(this.search.toLowerCase()) < 0
          )
            return false;
          if (
            this.$store.getters["app/getTemplateById"](schedule.template)
              .content.location === undefined
          )
            return false;
          if (this.$store.getters["app/locationList"].length > 0) {
            return this.$store.getters["app/locationList"].some((item) =>
              this.$store.getters["app/getTemplateById"](
                schedule.template
              ).content.location.includes(item)
            );
          } else return true;
        });
        var taskTime = "";
        var interval = 1;
        var validSchedules = [];
        schedules.map((schedule) => {
          if (schedule.deleted !== undefined && schedule.deleted === true)
            return;
          schedule.dueTimes.map((duetime) => {
            if (duetime.nanoseconds !== undefined) taskTime = duetime.toDate();
            else taskTime = duetime;
            interval = schedule.interval === undefined ? 1 : schedule.interval;
            if (this.frequency != "" && schedule._repeat != this.frequency)
              return;

            if (schedule._repeat == "Weekly" || schedule._repeat == "Monthly") {
              schedule.selectedDays.map((day) => {
                if (
                  this.checkScheule(taskTime, interval, schedule._repeat, day)
                ) {
                  validSchedules.push({
                    templateID: schedule.template,
                    time: new Date(
                      this.now.getFullYear(),
                      this.now.getMonth(),
                      this.now.getDate(),
                      taskTime.getHours(),
                      taskTime.getMinutes()
                    ),
                  });
                }
              });
            } else {
              if (this.checkScheule(taskTime, interval, schedule._repeat)) {
                validSchedules.push({
                  templateID: schedule.template,
                  time: new Date(
                    this.now.getFullYear(),
                    this.now.getMonth(),
                    this.now.getDate(),
                    taskTime.getHours(),
                    taskTime.getMinutes()
                  ),
                });
              }
            }
          });
        });

        validSchedules = validSchedules.filter((task) => {
          return !this.checkLog(task, status);
        });

        if (this.tag == "") return validSchedules;
        else {
          return validSchedules.filter((schedule) => {
            let template = this.$store.getters["app/getTemplateById"](
              schedule.templateID
            );
            if (template.content.templateLabel === undefined) return false;
            return template.content.templateLabel.some((item) =>
              this.tag.includes(item)
            );
          });
        }
      };
    },
    checkCompleted() {
      return (log) => {
        if (log === undefined) return false;
        var completed = true;
        var tasks = 0;
        var imcomplateTasks = 0;
        log.logs.map((page) => {
          page.questions.map((question) => {
            question.answers.map((answer) => {
              if (answer.ref.mandatory) tasks++;
              if (answer.ref.mandatory && !answer.loged) {
                completed = false;
                imcomplateTasks++;
              }
            });
          });
        });
        return { completed: completed, init: tasks == imcomplateTasks };
      };
    },
    checkLog() {
      return (task, status) => {
        let log = this.$store.getters["app/getLogByTidTime"](
          task.templateID,
          task.time
        );
        if (status == "overdue") {
          if (
            this.now.getTime() > task.time.getTime() &&
            !this.checkCompleted(log).completed
          ) {
            return false;
          } else return true;
        } else if (status == "todo") {
          if (log === undefined) {
            return this.now.getTime() > task.time.getTime();
          } else {
            if (
              this.now.getTime() <= task.time.getTime() &&
              this.checkCompleted(log).init
            )
              return false;
            else if (
              this.now.getTime() <= task.time.getTime() &&
              !this.checkCompleted(log).init
            ) {
              return true;
            } else if (this.now.getTime() > task.time.getTime()) return true;
          }
        } else if (status == "task") {
          if (log !== undefined && !log.initial) return true;
          else return false;
        }
      };
    },
    checkScheule() {
      return (duetime, interval, repeat, day = "") => {
        var taskDate = new Date(
          this.now.getFullYear(),
          this.now.getMonth(),
          this.now.getDate()
        );
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
          if (startDate.getTime() > taskDate.getTime()) return false;
          else {
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
  },
  methods: {
    filter(val) {
      this.frequency = val.frequency;
      this.tag = val.tag;
    },
    roleError() {
      this.$vs.notify({
        time: 5000,
        title: "Authorization Error",
        text:
          "You don't have authorization for this case.\n Please contact with your super admin",
        color: "danger",
        iconPack: "feather",
        icon: "icon-lock",
        // position:'bottom-center'
      });
    },
    editLog(log) {
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
    async assign(task, unscheduled = false) {
      var cUser = this.$store.getters["app/currentUser"];
      if (cUser == undefined || cUser.role === undefined) {
        this.roleError();
        return false;
      }
      if (cUser.role.key > 3) {
        this.roleError();
        return false;
      }

      if (!unscheduled) {
        let log = this.$store.getters["app/getLogByTidTime"](
          task.templateID,
          task.time
        );
        if (log !== undefined) {
          this.editLog(log);
          return;
        }
      }

      this.$vs.loading();
      var pages = [];
      let template = this.$store.getters["app/getTemplateById"](
        task.templateID
      );
      template.content.pages.map((page, pIndex) => {
        var questions = [];
        page.questions.map((question, qIndex) => {
          var answers = [];
          question.answers.map((answer, aIndex) => {
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
      var updated_at = new Date();
      if (unscheduled) {
        db.collection("logs").add({
          key: "pinned",
          initial: unscheduled,
          templateID: task.templateID,
          logs: pages,
          updated_at: updated_at,
          updated_by: JSON.parse(localStorage.getItem("userInfo")).id,
          group: JSON.parse(localStorage.getItem("userInfo")).group,
        });
      } else {
        db.collection("logs").add({
          initial: unscheduled,
          time: task.time,
          templateID: task.templateID,
          logs: pages,
          updated_at: updated_at,
          updated_by: JSON.parse(localStorage.getItem("userInfo")).id,
          group: JSON.parse(localStorage.getItem("userInfo")).group,
        });
      }

      that.getLogID(updated_at, task.templateID).then((id) => {
        that.$vs.loading.close();
        that.logID = id;
        that.pages = pages;
        that.template = task.templateID;
        that.isSidebarActive = true;
      });
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
              // var source = snapshot.metadata.fromCache
              //   ? "local cache"
              //   : "server";
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
  },
  mounted() {
    // this.wasSidebarOpen = this.$store.state.reduceButton;
    // this.$store.commit("TOGGLE_REDUCE_BUTTON", true);
  },
  beforeDestroy() {
    // if (!this.wasSidebarOpen) this.$store.commit("TOGGLE_REDUCE_BUTTON", false);
  },
  created() {
    setInterval(() => {
      this.now = new Date();
    }, 1000 * 60);
  },
};
</script>

<style>
#task-admin .vx-card {
  box-shadow: none;
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
  opacity: 0.54;
  font-size: 14px;
  color: #1e1c26;
}
.task-group-text {
  font-size: 14px;
}
.scroll-area-task {
  height: calc(100vh - 20rem);
}
@media (max-width: 576px) {
  .scroll-area-task {
    height: calc(100vh - 18rem);
  }
}
.scroll-area-width {
  min-width: 100%;
}
</style>