<template>
  <vs-sidebar
    click-not-close
    position-right
    parent="body"
    default-index="1"
    color="primary"
    class="add-new-data-sidebar items-no-padding"
    v-model="isSidebarActiveLocal"
  >
    <div class="mt-6 flex items-center justify-between px-6">
      <h4>{{ $t("select filter") | capitalize }}</h4>
      <feather-icon
        icon="XIcon"
        @click.stop="isSidebarActiveLocal = false"
        class="cursor-pointer"
      ></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>
    <VuePerfectScrollbar
      class="scroll-area--log-filter pt-4 pb-6"
      :settings="settings"
    >
      <div class="vx-row">
        <div class="vx-col pl-base pr-4w-full">
          <h5 class="mb-0">{{ $t("date") | capitalize }}</h5>
        </div>
        <div class="vx-col pl-base pr-4 pb-4 w-full">
          <v-select :options="dates" v-model="date" :clearable="false">
            <template v-slot:option="option">
              <span class="karla">{{ $t(option.label) }}</span>
            </template>
            <template slot="selected-option" slot-scope="option">
              <span class="karla">{{ $t(option.label) }}</span>
            </template>
          </v-select>
        </div>
        <div class="vx-col pl-base pr-4 pb-4 w-full" v-if="date == 'custom'">
          <h5 class="mb-0">{{ $t("from") | capitalize }}</h5>
          <datepicker
            :language="languages[$i18n.locale]"
            :placeholder="$t('to') | capitalize"
            v-model="from"
          ></datepicker>
          <h5 class="mb-0">{{ $t("to") | capitalize }}</h5>
          <datepicker
            :placeholder="$t('to') | capitalize"
            :language="languages[$i18n.locale]"
            v-model="to"
          ></datepicker>
        </div>
        <div class="vx-col pl-base pr-4 pb-4 w-full">
          <h5 class="mb-0">{{ $t("template") | capitalize }}</h5>
          <v-select
            label="name"
            multiple
            :options="templates"
            v-model="template"
          />
        </div>
        <div class="vx-col pl-base pr-4 pb-4 w-full">
          <h5 class="mb-0">{{ $t("users") | capitalize }}</h5>
          <v-select v-model="user" :options="users" label="name" multiple />
        </div>
        <div class="vx-col pl-base pr-4 pb-4 w-full">
          <h5 class="mb-0">{{ $t("teams") | capitalize }}</h5>
          <v-select v-model="team" :options="teams" label="name" multiple />
        </div>
      </div>
    </VuePerfectScrollbar>
    <div class="flex flex-wrap items-center justify-center p-6" slot="footer">
      <vs-button class="mr-6" :disabled="template.length==0" @click="commit">{{ $t("apply") }}</vs-button>
      <vs-button
        type="border"
        color="danger"
        @click="isSidebarActiveLocal = false"
        >{{ $t("cancel") }}</vs-button
      >
    </div>
  </vs-sidebar>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import Datepicker from "vuejs-datepicker";
import * as lang from "vuejs-datepicker/src/locale";
import vSelect from "vue-select";
export default {
  components: {
    VuePerfectScrollbar,
    Datepicker,
    vSelect,
  },

  props: {
    filters: {
      type: Object,
    },
    isSidebarActive: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      date: "",
      dates: [
        "today",
        "this week",
        "this month",
        "this quarter",
        "this year",
        "yesterday",
        "previous week",
        "previous month",
        "previous quarter",
        "previous year",
        "all time",
        "custom",
      ],
      languages: lang,
      to: "",
      from: "",
      template: [],
      user:[],
      team: [],
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.6,
      },
    };
  },
  methods: {
    commit() {
      if (this.date == "custom") {
        this.$emit("chnFilter", {
          date: [this.from, this.to],
          template: this.template,
          users: this.user,
          teams: this.team
        });
      } else {
        this.$emit("chnFilter", { date: this.date, template: this.template, users: this.user, teams: this.team });
      }
    },
  },
  computed: {
    teams() {
      var teams = this.$store.getters["app/teams"];
      var users = this.$store.getters["app/users"]
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
      var __teams = [];
      teams.map((team) => {
        if (
          (team.status !== undefined && !team.status) ||
          (team.deleted !== undefined && team.deleted)
        )
          return;
        if(locationList.length > 0) {
          if(!team.location || !Array.isArray(team.location) || !team.location.some(item=>locationList.includes(item))) {
            return 
          }
        }
        __teams.push({ id: team.id, name: team.name });
      });
      return __teams;
    },
    users() {
        var users = this.$store.getters["app/users"]
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
        var __users = [];
        users.map((user) => {
            if(locationList>0) {
            if(!user.location || !Array.isArray(user.location) || !user.location.some(item=> locationList.includes(item)))
                return
            }
            __users.push({ id: user.id, name: user.name });
        });
        return __users;
    },
    fromDate() {
      return (date) => {
        if (date == "") return new Date();
        return date;
      };
    },
    items() {
      return this.$store.getters["app/items"];
    },
    labels() {
      let labels = this.$store.getters["app/labels"];
      let _labels = [];
      labels.map((label) => {
        _labels.push({ id: label.id, name: label.name });
      });
      return _labels;
    },
    templates() {
      let templates = this.$store.getters["app/template"];
      let _templates = [];
      var cUser = this.$store.getters["app/currentUser"];
      var locationList = this.$store.getters["app/locationList"];
      if (locationList.length == 0) {
        if (
          cUser.role == undefined ||
          cUser.role.key == undefined ||
          cUser.role.key > 0
        ) {
          if (
            cUser.location !== undefined &&
            Array.isArray(cUser.location) &&
            cUser.location.length > 0
          ) {
            locationList = cUser.location;
          } else {
            locationList = ["no"];
          }
        }
      }
      templates.map((template) => {
        if (locationList.length > 0) {
          if (
            template.content.location == undefined ||
            !Array.isArray(template.content.location) ||
            !locationList.some((item) =>
              template.content.location.includes(item)
            )
          )
            return;
        }
        _templates.push({
          name: template.content.templateTitle,
          id: template.id,
        });
      });
      return _templates;
    },
    calcVal() {
      return (key) => {
        var filter = this.filters.find((filter) => filter.key == key);
        if (filter === undefined) return "";
        return filter.value;
      };
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
  watch: {
    isSidebarActiveLocal(val) {
      if (val) {
        var date = this.filters.date;
        if (Array.isArray(date)) {
          this.date = "custom";
          this.from = date[0];
          this.to = date[1];
        } else {
          this.date = date;
          this.to = new Date();
          this.from = new Date(this.to.getTime() - 7 * 24 * 60 * 1000);
        }
        this.template = []
        this.filters.template.map(item=> {
            let template = this.$store.getters['app/getTemplateById'](item)
            if(template) {
                this.template.push({id: template.id , name: template.content.templateTitle})
            }
        })
        this.user = []
        this.filters.users.map(item=> {
            let user = this.$store.getters['app/getUserById'](item)
            if(user) {
                this.user.push({id: user.id , name: user.name})
            }
        })
        this.team = []
        this.filters.teams.map(item=> {
            let team = this.$store.getters['app/getTeamById'](item)
            if(team) {
                this.team.push({id: team.id , name: team.name})
            }
        })
      }
    },
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
