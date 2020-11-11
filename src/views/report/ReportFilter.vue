<template>
  <vs-sidebar
    click-not-close
    position-right
    parent="body"
    default-index="1"
    color="primary"
    class="add-new-data-sidebar items-no-padding"
    spacer
    v-model="isSidebarActiveLocal"
  >
    <div class="mt-6 flex items-center justify-between px-6">
      <h4>{{$t("select filter") | capitalize}}</h4>
      <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>
    <VuePerfectScrollbar class="scroll-area--log-filter pt-4 pb-6" :settings="settings">
      <div class="vx-row">
        <div class="vx-col pl-base pr-4w-full">
          <h5 class="mb-0">{{$t("date") | capitalize}}</h5>
        </div>

        <div class="vx-col pl-base pr-4 pb-4 w-full">
          <v-select :options="dates" label="text" v-model="date" />
        </div>
        <template v-if="date1=='custom'">
          <div class="vx-col pl-base pr-4w-full">
            <h5 class="mb-0">{{$t("from") | capitalize}}</h5>
          </div>
          <div class="vx-col pl-base pr-4 pb-4 w-full">
            <datepicker
              :placeholder="$t('from') | capitalize"
              v-model="from"
              :language="languages[$i18n.locale]"
            ></datepicker>
          </div>

          <div class="vx-col pl-base pr-4w-full">
            <h5 class="mb-0">{{$t("to") | capitalize}}</h5>
          </div>
          <div class="vx-col pl-base pr-4 pb-4 w-full">
            <datepicker
              :placeholder="$t('to') | capitalize"
              :language="languages[$i18n.locale]"
              v-model="to"
            ></datepicker>
          </div>
        </template>
        <div class="vx-col pl-base pr-4w-full">
          <h5 class="mb-0">{{$t("templates") | capitalize}}</h5>
        </div>
        <div class="vx-col pl-base pr-4 pb-4 w-full">
          <v-select v-model="template" label="name" multiple :options="templates" />
        </div>
        <div class="vx-col pl-base pr-4w-full">
          <h5 class="mb-0">{{$t("users") | capitalize}}</h5>
        </div>
        <div class="vx-col pl-base pr-4 pb-4 w-full">
          <v-select v-model="user" :options="users" label="name" multiple />
        </div>
        <div class="vx-col pl-base pr-4w-full">
          <h5 class="mb-0">{{$t("teams") | capitalize}}</h5>
        </div>
        <div class="vx-col pl-base pr-4 pb-4 w-full">
          <v-select label="name" multiple :options="teams" v-model="team" />
        </div>
        <div class="vx-col pl-base pr-4w-full">
          <h5 class="mb-0">{{$t("labels") | capitalize}}</h5>
        </div>
        <div class="vx-col pl-base pr-4 pb-4 w-full">
          <v-select label="name" multiple :options="labels" v-model="tag" />
        </div>
        <div class="vx-col pl-base pr-4w-full">
          <h5 class="mb-0">{{$t("status") | capitalize}}</h5>
        </div>
        <div class="vx-col pl-base pr-4 pb-4 w-full">
          <v-select :options="state" label="text" v-model="status" />
        </div>
      </div>
    </VuePerfectScrollbar>
    <div class="flex flex-wrap items-center justify-center p-6" slot="footer">
      <vs-button class="mr-6" :disabled="checkDisabke" @click="commit">{{$t("apply")}}</vs-button>
      <vs-button type="border" color="danger" @click="isSidebarActiveLocal = false">{{$t("cancel")}}</vs-button>
    </div>
  </vs-sidebar>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import Datepicker from "vuejs-datepicker";
import vSelect from "vue-select";
import * as lang from "vuejs-datepicker/src/locale";
export default {
  components: {
    VuePerfectScrollbar,
    Datepicker,
    vSelect,
  },
  props: {
    filter: {
      default: "",
    },
    isSidebarActive: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      languages: lang,
      from: "",
      to: "",
      template1: [],
      user1: [],
      date1: "",
      label1: [],
      team1: [],
      status1: "",
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.6,
      },
    };
  },
  methods: {
    commit() {
      this.$emit("chnFilter", {
        template: this.template1,
        user: this.user1,
        team: this.team1,
        label: this.label1,
        date: this.date1,
        from: this.from == "" ? "" : new Date(this.from.setHours(0, 0, 0, 0)),
        to: this.to == "" ? "" : new Date(this.to.setHours(23, 59, 59, 999)),
        status: this.status1,
      });
    },
  },
  watch: {
    date1(val) {
      var today = new Date();
      if (val == "custom") {
        this.from = new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000);
        this.to = today;
      } else if (val == "today") {
        this.from = this.to = today;
      } else if (val == "thisW") {
        this.to = today;
        var today1 = new Date();
        var day = today1.getDay();
        var diff = today1.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
        this.from = new Date(today1.setDate(diff));
      } else if (val == "thisM") {
        this.to = today;
        this.from = new Date(today.getFullYear(), today.getMonth(), 1);
      } else if (val == "thisQ") {
        this.to = today;
        this.from = new Date(
          today.getFullYear(),
          Math.floor(today.getMonth() / 3) * 3,
          1
        );
      } else if (val == "thisY") {
        this.to = today;
        this.from = new Date(today.getFullYear(), 0, 1);
      } else if (val == "beforeD") {
        this.to = today;
        this.from = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      } else if (val == "beforeW") {
        var today1 = new Date();
        var day = today1.getDay();
        var diff = today1.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
        this.to = new Date(today1.setDate(diff - 1));
        this.from = new Date(today.setDate(diff - 7));
      } else if (val == "beforeM") {
        this.to = new Date(today.getFullYear(), today.getMonth(), 0);
        this.from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      } else if (val == "beforeQ") {
        this.to = new Date(
          today.getFullYear(),
          Math.floor(today.getMonth() / 3) * 3,
          0
        );
        this.from = new Date(this.to.getFullYear(), this.to.getMonth() - 2, 1);
      } else if (val == "beforeY") {
        this.to = new Date(today.getFullYear(), 0, 0);
        this.from = new Date(today.getFullYear() - 1, 0, 1);
      } else if (val == "all") {
        this.to = this.from = "";
      }
    },
  },
  computed: {
    template: {
      get() {
        return this.templates.filter(
          (item) => this.template1.indexOf(item.id) > -1
        );
      },
      set(val) {
        if (val === null) this.template1 = [];
        else {
          this.template1 = [];
          val.map((item) => {
            this.template1.push(item.id);
          });
        }
      },
    },
    date: {
      get() {
        return this.dates.find((item) => item.key == this.date1);
      },
      set(val) {
        this.date1 = val !== null ? val.key : "";
      },
    },
    user: {
      get() {
        return this.users.filter((item) => this.user1.indexOf(item.id) > -1);
      },
      set(val) {
        if (val === null) this.user1 = [];
        else {
          this.user1 = [];
          val.map((item) => {
            this.user1.push(item.id);
          });
        }
      },
    },
    team: {
      get() {
        return this.teams.filter((item) => this.team1.indexOf(item.id) > -1);
      },
      set(val) {
        this.team1 = [];
        if (val !== null) {
          val.map((item) => {
            this.team1.push(item.id);
          });
        }
      },
    },
    tag: {
      get() {
        return this.labels.filter((item) => this.label1.indexOf(item.id) > -1);
      },
      set(val) {
        this.label1 = [];
        if (val !== null) {
          val.map((item) => {
            this.label1.push(item.id);
          });
        }
      },
    },
    status: {
      get() {
        return this.state.find((item) => item.key == this.status1);
      },
      set(val) {
        this.status1 = val !== null ? val.key : "";
      },
    },
    state() {
      return [
        { key: "passed", text: this.$t("passed") },
        { key: "faild", text: this.$t("faild") },
      ];
    },

    checkDisabke() {
      return !(this.date != "" && this.template.length > 0);
    },
    dates() {
      return [
        { text: this.$t("today"), key: "today" },
        { text: this.$t("this week"), key: "thisW" },
        { text: this.$t("this month"), key: "thisM" },
        { text: this.$t("this quarter"), key: "thisQ" },
        { text: this.$t("this year"), key: "thisY", border: true },
        { text: this.$t("yesterday"), key: "beforeD" },
        { text: this.$t("previous week"), key: "beforeW" },
        { text: this.$t("previous month"), key: "beforeM" },
        { text: this.$t("previous quarter"), key: "beforeQ" },
        { text: this.$t("previous year"), key: "beforeY", border: true },
        { text: this.$t("all time"), key: "all", border: true },
        { text: this.$t("custom") + "...", key: "custom" },
      ];
    },
    labels() {
      let labels = this.$store.getters["app/labels"];
      let __labels = [];
      labels.map((label) => {
        __labels.push({ id: label.id, name: label.name });
      });
      return __labels;
    },
    templates() {
      let templates = this.$store.getters["app/template"];
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
      
      var __templates = [];

      templates.map((template) => {
        if(template.trashed !== undefined && template.trashed) return
        if(template.content.location) {
          if(locationList.length > 0) {
            if(!locationList.some(ll=>template.content.location.includes(ll))) return
          }
        }
        __templates.push({
          name: template.content.templateTitle,
          id: template.id,
        });
      });
      return __templates;
    },
    users() {
      var users = this.$store.getters["app/users"]
      let filteredLocation = this.$store.getters["app/locationList"]
      if(filteredLocation.length > 0)
        users = users.filter(user=> !!user.location && user.location.some(item=> filteredLocation.includes(item)))
      var __users = [];
      users.map((item) => {
        __users.push({ id: item.id, name: item.name });
      });
      return __users;
    },
    teams() {
      var teams = this.$store.getters["app/teams"];
      let filteredLocation = this.$store.getters["app/locationList"]
      if(filteredLocation.length > 0)
        teams = teams.filter(team=>!!team.location && team.location.some(item=>filteredLocation.includes(item)))
      var __teams = [];
      teams.map((item) => {
        if (
          (item.status !== undefined && !item.status) ||
          (item.deleted !== undefined && item.deleted)
        )
          return;
        __teams.push({ id: item.id, name: item.name });
      });
      return __teams;
    },
    filters() {
      return this.$store.getters["app/getLogFiltersAll"];
    },
    isSidebarActiveLocal: {
      get() {
        return this.isSidebarActive;
      },
      set(val) {
        if (!val) {
          this.$emit("closeSidebar");
        }
      },
    },
  },
  beforeMount() {
    if (this.filter !== "") {
      this.date1 = this.filter.date;
      this.template1 = this.filter.template;
      this.user1 = this.filter.user;
      this.team1 = this.filter.team;
      this.status1 = this.filter.status;
      this.label1 = this.filter.label;
    }
  },
};
</script>

<style lang="scss" scoped>
.add-new-data-sidebar {
  /deep/ .vs-sidebar--background {
    z-index: 52010;
  }

  /deep/ .vs-sidebar {
    z-index: 52010;
    width: 500px;
    max-width: 100vw;

    .img-upload {
      margin-top: 2rem;

      .con-img-upload {
        padding: 0;
      }

      .con-input-upload {
        width: 100%;
        margin: 0;
      }
    }
  }

  ul {
    border-left-width: 3px;
    border-left-style: dashed;
    border-left-color: rgba(var(--vs-primary), 1);
  }
  li {
    padding: 20px 0;
  }
  .active {
    background-color: #7367f024;
  }
}

.scroll-area--log-filter {
  height: calc(100% - 4.3rem);
}
.w-300 {
  width: 170px;
  z-index: 420000;
}
.holamundo {
  min-height: 50%;
}
</style>
