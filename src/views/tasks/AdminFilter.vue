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
      <h4>{{$t("filters")}}</h4>
      <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>
    <VuePerfectScrollbar class="scroll-area--log-filter pt-4 pb-6 px-4" :settings="settings">
      <div class="mb-3">
        <p class="karla-bold">{{$t("status")}}</p>
        <v-select :clearable="false" :options="statuss" v-model="status" label="text" />
      </div>
      <div class="mb-3">
        <p class="karla-bold">{{$t("labels")}}</p>
        <v-select multiple :options="tags" v-model="tag" label="name" />
      </div>
      <div class="mb-3">
        <p class="karla-bold">{{$t("teams")}}</p>
        <v-select multiple :options="teams" v-model="team" label="name" />
      </div>
      <div class="mb-3">
        <p class="karla-bold">{{$t("workers")}}</p>
        <v-select multiple :options="workers" v-model="worker" label="name" />
      </div>
      <div class="mb-3">
        <p class="karla-bold">{{$t("due date")}}</p>
        <datepicker
          class="hasDateIcon"
          :placeholder="$t('due date') | capitalize"
          :language="languages[$i18n.locale]"
          v-model="dueDate"
        ></datepicker>
      </div>
      <div class="mb-3">
        <p class="karla-bold">{{$t("last loged in")}}</p>
        <v-select :options="logTimes" label="text" v-model="logTime" />
      </div>
    </VuePerfectScrollbar>
    <div class="flex flex-wrap items-center justify-center p-6" slot="footer">
      <vs-button
        class="mr-6 karla-bold"
        type="filled"
        color="rgba(108, 80, 240, 0.1)"
        @click="clearFilter"
        text-color="#6c50f0"
      >{{$t("clear filters")}}</vs-button>

      <vs-button class="karla" color="#6c50f0" @click="filter">{{ $t("apply filters") }}</vs-button>
    </div>
  </vs-sidebar>
</template>
<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import VSelect from "vue-select";
import Datepicker from "vuejs-datepicker";
import * as lang from "vuejs-datepicker/src/locale";
export default {
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      logTime: null,
      languages: lang,
      dueDate: "",
      worker: null,
      team: null,
      tag: null,
      status: null,
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.6
      }
    };
  },
  components: {
    Datepicker,
    VuePerfectScrollbar,
    VSelect
  },
  computed: {
    logTimes() {
      return [
        { name: "", text: this.$t("all") },
        { name: "today", text: this.$t("today") },
        { name: "yesterday", text: this.$t("yesterday") },
        { name: "dayAgo", text: this.$t("more than day ago") },
        { name: "weekAgo", text: this.$t("more than week ago") }
      ];
    },
    workers() {
      return this.$store.getters["app/users"].filter(item => {
        let filteredLocations = this.$store.getters["app/locationList"]
        if(filteredLocations.length > 0) {
          return (item.status === undefined || item.status) && (!!item.location && item.location.some(location => filteredLocations.includes(location)))
        } else {
          return item.status === undefined || item.status
        }
      });
    },
    teams() {
      return this.$store.getters["app/teams"].filter(item => {
        let filteredLocations = this.$store.getters["app/locationList"]
        if(filteredLocations.length > 0) {
          return (item.active === undefined || item.active) && (!!item.location && item.location.some(location => filteredLocations.includes(location)))
        } else {
          return item.active === undefined || item.active
        }
      });
    },
    tags() {
      const locale = this.$i18n.locale || "en-gb";
      let labels = this.$store.getters["app/labels"].filter((item) => {
        if (item.group != "global") {
          const userInfo = JSON.parse(localStorage.getItem("userInfo"));
          if (userInfo.group != item.group) {
            return false; 
          }
        }
        if (!item.lang) {
          if (locale != "en-gb") return false;
        } else {
          if (item.lang != locale) return false;
        }
        return true;
      });

      return labels;
    },
    statuss() {
      return [
        { name: "", text: this.$t("all") },
        { name: "due", text: this.$t("due tasks") },
        { name: "over", text: this.$t("overdue tasks") },
        { name: "noDue", text: this.$t("no due date") }
      ];
    },
    isSidebarActiveLocal: {
      get() {
        return this.open;
      },
      set(val) {
        this.$emit("closeSidebar", false);
      }
    }
  },
  methods: {
    clearFilter() {
      this.logTime = null;
      this.dueDate = "";
      this.worker = null;
      this.team = null;
      this.tag = null;
      this.status = null;
    },
    filter() {
      var status = this.status == null ? "" : this.status.name;

      var tag, team, worker;
      if (this.tag === null) tag = "";
      else {
        tag = [];
        this.tag.map(item => {
          tag.push(item.id);
        });
      }
      if (this.team === null) team = "";
      else {
        team = [];
        this.team.map(item => {
          team.push(item.id);
        });
      }
      if (this.worker === null) worker = "";
      else {
        worker = [];
        this.worker.map(item => {
          worker.push(item.id);
        });
      }
      var logTime = this.logTime == null ? "" : this.logTime.name;
      this.isSidebarActiveLocal = false;
      this.$emit("filter", {
        status: status,
        tag: tag,
        team: team,
        worker: worker,
        dueDate: this.dueDate,
        logTime: logTime
      });
    }
  }
};
</script>
<style scoped>
.hasDateIcon::after {
  font-family: "feather" !important;
  font-style: normal;
  font-size: 20px;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1.9;
  content: "\e83a";
  position: absolute;
  top: 2px;
  right: 10px;
}
</style>
<style lang="scss" scoped>
.add-new-data-sidebar {
  ::v-deep .vs-sidebar--background {
    z-index: 52010;
  }

  ::v-deep .vs-sidebar {
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
  height: calc(100vh - 11rem);
}
.w-300 {
  width: 170px;
  z-index: 420000;
}
.holamundo {
  min-height: 50%;
}
</style>
