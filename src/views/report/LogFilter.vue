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
      <div class="vx-row" v-for="(filter,index) in filters" :key="index">
        <div class="vx-col pl-base pr-4w-full">
          <h5 class="mb-0">{{$t(filter.key) | capitalize}}</h5>
        </div>
        <div class="vx-col pl-base pr-4 pb-4 w-full" v-if="filter.key=='from'">
          <datepicker
            :placeholder="$t('from') | capitalize"
            :value="filter.value"
            :language="languages[$i18n.locale]"
            @input="chnFilter($event,'from')"
          ></datepicker>
        </div>
        <div class="vx-col pl-base pr-4 pb-4 w-full" v-else-if="filter.key=='to'">
          <datepicker
            :placeholder="$t('to') | capitalize"
            :language="languages[$i18n.locale]"
            :value="filter.value"
            @input="chnFilter($event,'to')"
          ></datepicker>
        </div>
        <div class="vx-col pl-base pr-4 pb-4 w-full" v-else-if="filter.key=='template'">
          <v-select
            :value="filter.value"
            label="name"
            multiple
            @input="chnFilter($event,'template')"
            :options="templates"
          />
        </div>
        <div class="vx-col pl-base pr-4 pb-4 w-full" v-else-if="filter.key=='users'">
          <v-select
            :value="filter.value"
            label="name"
            multiple
            @input="chnFilter($event,'users')"
            :options="users"
          />
        </div>
        <div class="vx-col pl-base pr-4 pb-4 w-full" v-else-if="filter.key=='teams'">
          <v-select
            :value="filter.value"
            label="name"
            multiple
            @input="chnFilter($event,'teams')"
            :options="teams"
          />
        </div>
        <div class="vx-col pl-base pr-4 pb-4 w-full" v-else-if="filter.key=='label'">
          <v-select
            :value="filter.value"
            label="name"
            multiple
            @input="chnFilter($event,'label')"
            :options="labels"
          />
        </div>
        <div class="vx-col pl-base pr-4 pb-4 w-full" v-else-if="filter.key=='status'">
          <v-select
            :value="filter.value"
            @input="chnFilter($event,'status')"
            :options="['Passed','Failed']"
          />
        </div>
      </div>
    </VuePerfectScrollbar>
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
    vSelect
  },
  props: {
    isSidebarActive: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      languages: lang,
      from: "",
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.6
      }
    };
  },
  methods: {
    chnFilter(e, key) {
      this.$store.dispatch("app/updateLogFilter", { key: key, value: e });
    }
  },
  computed: {
    labels() {
      const locale = this.$i18n.locale || "en-gb";
      let labels = this.$store.getters["app/labels"].filter((item) => {
        if (item.group != "global") {
          const userInfo = JSON.parse(localStorage.getItem("userInfo"));
          if (userInfo.group != item.group) {
            return false; 
          }
        }
        if (!item.lang) {
          if (!(locale === "en-gb" || locale === "en-us")) return false;
        } else {
          if (item.lang != locale) return false;
        }
        return true;
      });

      let __labels = [];
      labels.map((label) => {
        __labels.push({ id: label.id, name: label.name });
      });

      return __labels;
    },
    templates() {
      let templates = this.$store.getters["app/template"];
      let __templates = [];
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
      templates.map(template => {
        if(template.trashed !== undefined && template.trashed) return
        if(template.content.location) {
          if(locationList.length > 0) {
            if(!locationList.some(ll=>template.content.location.includes(ll))) return
          }
        }
        if(template.location) {

        }
        __templates.push({
          name: template.content.templateTitle,
          id: template.id
        });
      });
      return __templates;
    },
    users() {
      let users = this.$store.getters["app/users"];
      var __users = [];
      users.map(item => {
        // if((item.status !==undefined && !item.status) || (item.deleted !== undefined &&  item.deleted) )
        // return
        __users.push({ id: item.id, name: item.name });
      });
      return __users;
    },
    teams() {
      let teams = this.$store.getters["app/teams"];
      var __teams = [];
      teams.map(item => {
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
      }
    }
  }
};
</script>

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
