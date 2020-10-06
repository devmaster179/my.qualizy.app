<!-- =========================================================================================
    File Name: Email.vue
    Description: Email Application (Inbox)
    ----------------------------------------------------------------------------------------
    Item Name: Vuesax Admin - VueJS Dashboard Admin Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div
    id="email-app"
    class="border border-solid d-theme-border-grey-light rounded relative overflow-hidden"
  >
    <vs-sidebar
      class="items-no-padding"
      parent="#email-app"
      :click-not-close="clickNotClose"
      :hidden-background="clickNotClose"
      v-model="isScheduleSidebarActive"
    >
      <schedule-sidebar
        @chnFilter="chnFilter"
        @closeSidebar="toggleScheduleSidebar"
        :filters="filters"
        :labels="labels"
      />
    </vs-sidebar>

    <div
      :class="{'sidebar-spacer': clickNotClose}"
      class="border border-solid d-theme-border-grey-light border-r-0 border-t-0 border-b-0 schedule-section"
    >
      <!-- SEARCH BAR -->
      <div class="flex border items-center app-search-container">
        <feather-icon
          class="md:inline-flex lg:hidden ml-4 mr-4 cursor-pointer"
          icon="MenuIcon"
          @click.stop="toggleScheduleSidebar(true)"
        ></feather-icon>
        <!-- Filter by input text to only show the matching results -->
        <vue-simple-suggest
          ref="suggestComponent"
          :styles="autoCompleteStyle"
          v-model="chosen"
          :list="templates"
          display-attribute="content.templateTitle"
          :filter-by-query="true"
        >
          <vs-input
            icon="icon-search"
            v-model="chosen1"
            size="large"
            icon-pack="feather"
            :placeholder="$t('Search') + '...'"
            class="vs-input-no-border vs-input-no-shdow-focus w-full no-icon-border"
          />
          <div slot="suggestion-item" slot-scope="scope">
            <span v-html="boldenSuggestion(scope)"></span>
          </div>
        </vue-simple-suggest>
      </div>

      <template v-if="schedules.length<1">
        <no-data />
      </template>

      <VuePerfectScrollbar v-else class="scroll-area" :settings="settings" ref="mailListPS">
        <transition-group name="list-enter-up" class="email__mails" tag="ul" appear>
          <li
            @click="scheduleDetailPopup(schedule)"
            class="cursor-pointer email__mail-item"
            v-for="(schedule, index) in schedules"
            :key="schedule.id"
            :style="{transitionDelay: (index * 0.1) + 's'}"
          >
            <schedule-item :schedule="schedule" />
          </li>
        </transition-group>
      </VuePerfectScrollbar>

      <schedule-popup
        update
        :schedule="selectedSchedule"
        :open="openSchedule"
        @close="openSchedule=false"
      />
    </div>
  </div>
</template>

<script>
import ScheduleSidebar from "./ScheduleSidebar.vue";
import ScheduleItem from "./ScheduleItem.vue";
import SchedulePopup from "./SchedulePopup.vue";
import VueSimpleSuggest from "vue-simple-suggest";
import NoData from "../../components/nodata/NoData.vue";
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
  data() {
    return {
      autoCompleteStyle: {
        vueSimpleSuggest: "position-absolute",
        inputWrapper: "",
        defaultInput: "form-control",
        suggestions: "position-absolute list-group z-1000",
        suggestItem: "list-group-item"
      },
      openSchedule: false,
      selectedFilter: "",
      selectedLabel: "",
      chosen: "",
      chosen1: "",
      isTemplateDetailPopupActive: false,
      filters: ["Daily", "Monthly", "Weekly"],
      selectedTemplates: [],
      isSidebarActive: false,
      showThread: false,
      clickNotClose: true,
      isScheduleSidebarActive: true,
      windowWidth: window.innerWidth,
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.3
      },
      teams: [],
      selectedSchedule: {}
    };
  },
  watch: {
    isSidebarActive(value) {
      if (!value) this.showThread = false;
    },
    chosen(val) {
      this.chosen1 = val;
    }
  },
  computed: {
    templates() {
      var templates = this.$store.getters["app/template"];
      return templates.filter(template => !template.trashed);
    },
    labels() {
      return this.$store.getters["app/labels"];
    },
    schedules() {
      let schedules = this.$store.getters["app/schedules"];
      var _schedules = [];
      schedules.map(schedule => {
        if (schedule.deleted || schedule._repeat === null) return;
        var template = this.$store.getters["app/getTemplateById"](
          schedule.template
        );
        if (template === undefined) return;
        if (this.$store.getters["app/locationList"].length > 0) {
          if (template.content.location === undefined) return;
          if (
            !this.$store.getters["app/locationList"].some(item =>
              template.content.location.includes(item)
            )
          )
            return;
        }
        if (template.trashed) return;
        if (
          this.chosen == "" ||
          template.content.templateTitle
            .toLowerCase()
            .indexOf(this.chosen.toLowerCase()) > -1
        ) {
          if (
            this.selectedLabel == "" ||
            template.content.templateLabel.join().indexOf(this.selectedLabel) >
              -1
          ) {
            if (
              this.selectedFilter == "" ||
              this.selectedFilter == schedule._repeat.toLowerCase()
            )
              _schedules.push(schedule);
          }
        }
      });
      return _schedules;
    },
    selectAllIcon() {
      if (this.selectedTemplates.length == this.templates.length)
        return "icon-check";
      else return "icon-minus";
    },

    selectAllCheckBox: {
      get() {
        // return this.selectedMails.length;
      },
      set(value) {
        // if(value) this.selectedMails = this.mails.map(mail => mail.id)
        // else this.selectedMails = [];
      }
    }
  },
  methods: {
    boldenSuggestion(scope) {
      if (!scope) return scope;

      const { suggestion, query } = scope;

      let result = this.$refs.suggestComponent.displayProperty(suggestion);

      if (!query) return result;

      const texts = query.split(/[\s-_/\\|\.]/gm).filter(t => !!t) || [""];
      return result.replace(
        new RegExp("(.*?)(" + texts.join("|") + ")(.*?)", "gi"),
        "$1<b>$2</b>$3"
      );
    },
    chnFilter(filter, label) {
      this.selectedFilter = filter;
      this.selectedLabel = label;
    },

    handleWindowResize(event) {
      this.windowWidth = event.currentTarget.innerWidth;
      this.setSidebarWidth();
    },
    setSidebarWidth() {
      if (this.windowWidth < 992) {
        this.isScheduleSidebarActive = this.clickNotClose = false;
      } else {
        this.isScheduleSidebarActive = this.clickNotClose = true;
      }
    },
    toggleScheduleSidebar(value = false) {
      if (!value) {
        this.closeMailViewSidebar();
        if (this.clickNotClose) {
          return;
        }
      }
      this.isScheduleSidebarActive = value;
    },
    closeMailViewSidebar() {
      this.isSidebarActive = false;
    },
    scheduleDetailPopup(schedule) {
      var cUser = this.$store.getters["app/currentUser"];
      if (cUser == undefined || cUser.role == undefined) return false;
      if (cUser.role.key > 2) return false;
      this.selectedSchedule = schedule;
      this.openSchedule = true;
    }
  },
  components: {
    ScheduleSidebar,
    VuePerfectScrollbar,
    ScheduleItem,
    SchedulePopup,
    VueSimpleSuggest,
    NoData
  },
  created() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.handleWindowResize);
    });
    this.setSidebarWidth();
  },
  beforeDestroy: function() {
    window.removeEventListener("resize", this.handleWindowResize);
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/vuesax/apps/email.scss";
@import "@/assets/scss/vuesax/extraComponents/autocomplete.scss";
</style>

<style scoped>
.scroll-area {
  height: calc(100% - 50px);
}
.schedule-section {
  height: calc(100vh - 13.5rem);
}
@media (max-width: 576px) {
  .schedule-section {
    height: calc(100vh - 9.1rem);
  }
}
</style>

