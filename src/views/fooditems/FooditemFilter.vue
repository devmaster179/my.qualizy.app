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
        <div class="vx-col pl-base pr-4 w-full">
          <h5 class="mb-0 filter-text">{{$t("expiry") | capitalize}}</h5>
        </div>
        <div class="vx-col pl-base pr-4 pb-4 w-full">
          <v-select :options="dates" label="text" v-model="date" />
        </div>
        <vs-divider class="mb-0"></vs-divider>
        <div class="vx-col pl-base pr-4 w-full mt-4">
          <h5 class="mb-0 filter-text">{{$t("created") | capitalize}}</h5>
        </div>
        <div class="vx-col pl-base pr-4 pb-4 w-full hasDateIcon relative">
          <datepicker
            :placeholder="$t('created') | capitalize"
            v-model="created"
            :language="languages[$i18n.locale]"
          ></datepicker>
        </div>
        <vs-divider class="mb-0"></vs-divider>
        <div class="vx-col pl-base pr-4 w-full mt-4">
          <h5 class="mb-0 filter-text">{{$t("status") | capitalize}}</h5>
        </div>
        <div class="vx-col pl-base pr-4 pb-4 w-full">
          <div class v-for="(item , index) in status" :key="index">
            <vs-radio :vs-value="item.key" v-model="state" class="my-3">{{item.text}}</vs-radio>
          </div>
        </div>
        <vs-divider class="my-0"></vs-divider>
        <div class="vx-col pl-base pr-4 w-full mt-4">
          <h5 class="mb-0 filter-text">{{$t("allergens") | capitalize}}</h5>
        </div>
        <div class="vx-col pl-base pr-4 w-full mt-4">
          <div class="vx-row p-0 m-0">
            <div class="vx-col w-1/2" v-for="(item,index) in allergensLists" :key="index">
              <vs-checkbox :vs-value="item.id" v-model="allergens" class="my-3">{{item.name}}</vs-checkbox>
            </div>
          </div>
        </div>
        <vs-divider class="my-0"></vs-divider>
        <div class="vx-col pl-base pr-4 w-full mt-4">
          <h5 class="mb-0 filter-text">{{$t("templates") | capitalize}}</h5>
        </div>
        <div class="vx-col pl-base pr-4 w-full mt-4">
          <div class="vx-row p-0 m-0">
            <div
              class="vx-col"
              :class="{'w-1/2': item.content.templateTitle.length<20 , 'w-full': item.content.templateTitle.length>=20}"
              v-for="(item,index) in templatesList"
              :key="index"
            >
              <vs-checkbox
                :vs-value="item.id"
                v-model="templates"
                class="my-3"
              >{{item.content.templateTitle | truncate(30)}}</vs-checkbox>
            </div>
          </div>
        </div>
      </div>
    </VuePerfectScrollbar>
    <div class="flex flex-wrap items-center justify-center p-6" slot="footer">
      <vs-button class="mr-6" @click="filter">{{$t('filters')}}</vs-button>
      <vs-button
        type="border"
        color="danger"
        @click="isSidebarActiveLocal = false"
      >{{$t("cancel") | capitalize}}</vs-button>
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
    activeFilter: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    VuePerfectScrollbar,
    VSelect,
    Datepicker,
  },
  data() {
    return {
      from: "",
      to: "",
      date1: null,
      state: "",
      templates: [],
      allergens: [],
      created: "",
      languages: lang,
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.6,
      },
    };
  },
  computed: {
    templatesList() {
      return this.$store.getters["app/template"].filter(template => {
        let filteredLocations = this.$store.getters["app/locationList"]
        if(filteredLocations.length > 0) {
          return !template.trashed && template.content.location.some(item=> filteredLocations.includes(item))
        } else {
          return !template.trashed
        }
      });
    },
    allergensLists() {
      return this.$store.getters["app/allergens"];
    },
    date: {
      get() {
        return this.dates.find((item) => item.key == this.date1);
      },
      set(val) {
        this.date1 = val !== null ? val.key : "";
      },
    },
    status() {
      return [
        { text: this.$t("all"), key: "" },
        { text: this.$t("no expiry"), key: "no" },
        { text: this.$t("expired"), key: "expired" },
        { text: this.$t("removed"), key: "removed" },
      ];
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
        { text: this.$t("previous year"), key: "beforeY" },
      ];
    },
    isSidebarActiveLocal: {
      get() {
        return this.activeFilter;
      },
      set() {
        this.$emit("close");
      },
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
  methods: {
    filter() {
      this.$emit("filter", {
        expire: { from: this.from, to: this.to },
        created: this.created,
        allergens: this.allergens,
        state: this.state,
        templates: this.templates,
      });
      this.isSidebarActiveLocal = false;
    },
  },
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
  top: 6px;
  right: 20px;
}
.filter-text {
  font-size: 14px;
  font-weight: 500;
}
</style>
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
