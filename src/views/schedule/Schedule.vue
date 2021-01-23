<template>
  <div id="schdules-page" class="px-2">
    <template v-if="!auth('view')">
      <no-auth/>
    </template>
    <template v-else>
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
          <vs-button class="ml-2" @click="newSchedule">
            <span class="karla">{{$t("new schedule")}}</span>
          </vs-button>
        </div>
      </div>
      <div class="video-launcher">
        <a href="#" @click="howtoTemplate">{{ $t("Watch this video to see how it works") }}</a>
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
                class="sm:mx-0 mx-4 mb-4 sm:text-2xl sm:text-1xl d-theme-heading-color"
              >{{$t("You don’t have any tasks scheduled yet")}}, {{$t("would you like to create one")}}?</h5>
              <vs-button v-if="role<2" class="ml-2" @click="newSchedule" >{{$t("new schedule")}}</vs-button>
            </div>
          </div>
        </template>
      </div>
      <schedule-popup :open="activeSchedule" @close="activeSchedule=false" />
    </template>
  </div>
</template>

<script>
import ListView from "./ListView";
import SchedulePopup from "./SchedulePopup";
import NoAuth from "@/components/no-auth/NoAuth";

export default {
  components: {
    ListView,
    SchedulePopup,
    NoAuth
  },
  data() {
    return {
      search: "",
      activeFilter: false,
      activeSchedule: false
    };
  },
  methods: {
    howtoTemplate(event) {
      event.preventDefault();
      this.$userflow.start('00cf7a4c-823b-4978-9b83-b2ca95325477');
    },
    roleError(action) {
      this.$vs.notify({
        time: 5000,
        title: "Authorization Error",
        text:
          `You don't have authorization for ${action}.\n Please contact with your super admin`,
        color: "danger",
        iconPack: "feather",
        icon: "icon-lock",
      });
    },
    newSchedule() {
      if(!this.auth('create')) {
        this.roleError('create')
        return false
      }
      this.activeSchedule=true
    }
  },
  computed: {
    auth() {
      return action=> {
        let authList = this.$store.getters['app/auth']
        var cUser = this.$store.getters["app/currentUser"];
        if(cUser == undefined || cUser.role == undefined) return false
        else if(cUser.role.key == 0) 
          return true
        return authList.schedule[cUser.role.name.toLowerCase()][action]
      }
    },
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
      var teamLocation 
      var tempTeam
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

      schedules.map(schedule => {
        if (schedule.deleted || schedule._repeat === null) return;
        if(locationList.length>0) {
          if(!schedule.location) return
          if(!schedule.location.some(sl=> locationList.includes(sl))) return 
        }
        var template = this.$store.getters["app/getTemplateById"](
          schedule.template
        );
        if (template === undefined || template.content.templateSD=="bookmarked")  return;
        // if (locationList.length > 0) {
        //   if (template.content.location === undefined) return;
        //   if (
        //     !locationList.some(item =>
        //       template.content.location.includes(item)
        //     )
        //   )
        //     return;
        //   teamLocation = []
        //   schedule.assign.map(team=> {
        //     tempTeam = this.$store.getters['app/getTeamById'](team)
        //     if(tempTeam.location == undefined || !Array.isArray(tempTeam.location)) return
        //     tempTeam.location.map(location => {
        //       if(teamLocation.indexOf(location) < 0) 
        //         teamLocation.push(location)
        //     })  
        //   })
        //   if (
        //     !locationList.some(item =>
        //       teamLocation.includes(item)
        //     )
        //   )
        //     return;
        // }
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
<style scoped>
.video-launcher {
  font-size: 10px;
  height: 12px;
  color: #844CF5;
}
</style>