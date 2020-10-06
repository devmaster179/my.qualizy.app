<!-- =========================================================================================
    File Name: EmailSidebar.vue
    Description: Email Application Sidebar(Filter) (Inbox)
    ----------------------------------------------------------------------------------------
    Item Name: Vuesax Admin - VueJS Dashboard Admin Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div class="email__email-sidebar h-full">
    <div class="m-6 clearfix">
      <vs-button
        class="bg-primary-gradient w-full"
        :disabled="role>2"
        @click="openSchedule=true"
      >{{$t("new schedule") |capitalize}}</vs-button>
    </div>
    <vs-divider></vs-divider>
    <VuePerfectScrollbar class="email-scroll-area" :settings="settings">
      <div class="px-6 pb-2 mt-4 flex flex-col">
        <h5 class="mb-1">{{$t("frequency") | capitalize}}</h5>
        <div
          v-for="(filter,index) in filters"
          :key="index"
          class="flex items-center mt-4 mb-2 cursor-pointer"
          @click="updateFilter(filter)"
          :class="{'text-primary font-bold':selectedFilter == filter}"
        >
          <vs-icon icon-pack="feather" size="15px" icon="icon-circle" />
          <span class="text-lg ml-3">{{$t(filter) | capitalize}}</span>
        </div>
      </div>
      <vs-divider></vs-divider>

      <div class="email__labels px-6 py-4">
        <h5 class="mb-4">{{$t("labels") | capitalize}}</h5>
        <div class="email__lables-list">
          <div
            class="email__label flex items-center mb-4 cursor-pointer"
            v-for="(label, index) in labels"
            :key="index"
            @click="updateLabel(label.id)"
          >
            <div
              class="ml-1 h-3 w-3 rounded-full mr-4 border-2 border-solid"
              :style="'border-color:'+label.color"
            ></div>
            <span
              class="text-lg"
              :class="{'text-primary font-bold': selectedLabel == label.id}"
            >{{ label.name | capitalize }}</span>
          </div>
        </div>
      </div>
      <vs-divider></vs-divider>
      <div class="p-6 pt-2 clearfix w-full">
        <vs-button
          :disabled="selectedLabel=='' && selectedFilter ==''"
          class="bg-primary-gradient w-full"
          @click="clearAll"
        >{{$t("clear filter") | capitalize}}</vs-button>
      </div>
    </VuePerfectScrollbar>
    <schedule-popup :open="openSchedule" @close="openSchedule=false" />
  </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";

import SchedulePopup from "./SchedulePopup.vue";

export default {
  components: {
    VuePerfectScrollbar,
    SchedulePopup
  },
  props: {
    filters: {
      type: Array,
      required: true
    },
    labels: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      openSchedule: false,
      selectedLabel: "",
      selectedFilter: "",
      activePrompt: false,
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.3
      },
      templates: [],
      users: [],
      template: "",
      user: [],

      repeat: "Daily",

      days: [],
      selectedDays: ""
      // aTime:null
    };
  },
  methods: {
    clearAll() {
      this.selectedLabel = "";
      (this.selectedFilter = ""),
        this.$emit("chnFilter", this.selectedFilter, this.selectedLabel);
      this.$emit("closeSidebar", false);
    },
    updateFilter(filterName) {
      this.selectedFilter = filterName;
      this.$emit("chnFilter", this.selectedFilter, this.selectedLabel);
      this.$emit("closeSidebar", false);
    },
    updateLabel(labelName) {
      this.selectedLabel = labelName;
      this.$emit("chnFilter", this.selectedFilter, this.selectedLabel);
      this.$emit("closeSidebar", false);
    },
    // compose mail methods
    clearFields() {}
  },
  computed: {
    role() {
      var cUser = this.$store.getters["app/currentUser"];
      if (cUser == undefined || cUser.role == undefined) return 5;
      return cUser.role.key;
    }
  }
};
</script>
<style>
.email-scroll-area {
  height: calc(100% - 100px) !important;
}
.filterClear {
  position: absolute;
  bottom: 0;
}
.vs-dialog {
  max-width: 600px !important;
  /* max-height: 600px!important; */
}
.schedule-new-area {
  height: calc(80vh - 69px);
}
</style>