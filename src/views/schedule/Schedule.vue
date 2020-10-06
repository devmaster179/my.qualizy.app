<template>
  <div id="schdules-page">
    <div class="page-header flex items-center justify-between">
      <p class="page-title karla-bold color-my-black text-2xl">{{$t("schedule")}}</p>
      <div class="page-actions items-center flex justify-end">
        <vs-input
          class="bg-white hidden md:block"
          v-model="search"
          :placeholder="$t('Search')"
          icon="icon-search"
          icon-pack="feather"
          icon-no-border
        />
        <!-- <feather-icon
          @click="activeFilter=true"
          icon="FilterIcon"
          class="ml-2 rounded-lg d-theme-dark-bg cursor-pointer"
          style="height:40px; width:40px; padding:.7rem"
        /> -->
        <vs-button :disabled="role>2" class="ml-2" @click="activeSchedule=true">
          <span class="karla">{{$t("new schedule")}}</span>
        </vs-button>
      </div>
    </div>
    <div class="page-content">
      <template v-if="schedules.length>0">
        <list-view :schedules="schedules" />
      </template>
      <template v-else>
        <div class="flex w-full mt-base">
          <div
            class="vx-col flex items-center justify-center flex-col sm:w-1/2 md:w-3/5 lg:w-3/4 xl:w-1/2 mx-auto text-center sm:mt-base mt-0"
          >
            <img
              :src="require('@/assets/images/pages/report/empty-docs.svg')"
              class="mx-auto mb-4"
            />
            <h5
              v-if="role<2"
              class="sm:mx-0 mx-4 mb-4 sm:text-2xl sm:text-1xl d-theme-heading-color"
            >{{$t("You don’t have any tasks scheduled yet")}}, {{$t("would you like to create one")}}?</h5>
            <h5 v-else
              class="sm:mx-0 mx-4 mb-4 sm:text-2xl sm:text-1xl d-theme-heading-color"
            >{{$t("You don’t have any tasks scheduled yet")}}.</h5>
            <vs-button v-if="role<2" class="ml-2" @click="activeSchedule=true" >{{$t("new schedule")}}</vs-button>
          </div>
        </div>
      </template>
    </div>
    <schedule-popup :open="activeSchedule" @close="activeSchedule=false" />
  </div>
</template>

<script>
import ListView from "./ListView";
import SchedulePopup from "./SchedulePopup";

export default {
  components: {
    ListView,
    SchedulePopup
  },
  data() {
    return {
      search: "",
      activeFilter: false,
      activeSchedule: false
    };
  },
  computed: {
    role() {
      var cUser = this.$store.getters["app/currentUser"];
      if (cUser == undefined || cUser.role === undefined) {
        return 4;
      }
      return cUser.role.key;
    },
    schedules() {
      let schedules = this.$store.getters["app/schedules"];
      var __schedules = [];
      schedules.map(schedule => {
        if (schedule.deleted || schedule._repeat === null) return;
        var template = this.$store.getters["app/getTemplateById"](
          schedule.template
        );
        if (template === undefined || template.content.templateSD=="bookmarked")  return;
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
          this.search == "" ||
          template.content.templateTitle
            .toLowerCase()
            .indexOf(this.search.toLowerCase()) > -1
        ) {
          //   if (
          //     this.selectedLabel == "" ||
          //     template.content.templateLabel.join().indexOf(this.selectedLabel) >
          //       -1
          //   ) {
          //     if (
          //       this.selectedFilter == "" ||
          //       this.selectedFilter == schedule._repeat.toLowerCase()
          //     )
          __schedules.push(schedule);
        }
        // }
      });
      return __schedules;
    }
  }
};
</script>