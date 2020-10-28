<template>
  <vs-prompt
    :title="getTitle"
    :accept-text="$t('save') | capitalize"
    button-cancel="border"
    :cancel-text="$t('cancel') | capitalize"
    @cancel="clear"
    @accept="saveSchedule"
    @close="clear"
    :is-valid="validateForm"
    :active.sync="openPopup"
  >
    <VuePerfectScrollbar class="schedule-new-area p-4" :settings="settings">
      <div class="vx-row mb-base">
        <div class="vx-col w-full">
          <p class="text-item">{{$t('select location')}}</p>
          <multiselect
            v-model="location"
            :placeholder="$t('select location')"
            label="name"
            track-by="id"
            :options="locations"
          />
        </div>
      </div>

      <div class="vx-row mb-base">
        <div class="vx-col w-full">
          <p class="text-item">{{$t('Select template')}}</p>
          <multiselect
            v-model="template"
            :placeholder="$t('Select template')"
            label="title"
            track-by="id"
            :options="templates"
          />
        </div>
      </div>

      <div class="vx-row mb-base">
        <div class="vx-col w-full">
          <p class="text-item">{{$t('assignees') | capitalize}}</p>
          <multiselect
            v-model="user"
            :placeholder="$t('select teams')"
            label="name"
            track-by="id"
            :options="users"
            :multiple="true"
            :disabled="location==null"
          />
        </div>
      </div>
      <div class="vx-row mb-base">
        <div class="vx-col w-full">
          <p class="text-item">{{$t('monitoring') | capitalize}}</p>
          <multiselect
            v-model="mUser"
            :placeholder="$t('select teams')"
            label="name"
            track-by="id"
            :options="users"
            :multiple="true"
            :disabled="location==null"
          />
        </div>
      </div>
      <div class="vx-row mb-base">
        <div class="vx-col w-full">
          <p class="text-item">{{$t('Schedule available from')}}</p>
          <datepicker
            placeholder="Available from"
            v-model="aDate"
            :language="languages[$i18n.locale]"
            class="hasDatepickerIcon"
          ></datepicker>
        </div>
      </div>
      <div class="vx-row mb-base">
        <div class="vx-col w-full">
          <p class="text-item">{{$t("frequency") | capitalize}}</p>
          <multiselect
            :placeholder="$t('repeat rule')"
            :options="repeats"
            label="text"
            v-model="repeat1"
          />
        </div>
      </div>
      <div class="vx-row mb-base" v-if="repeat!='No Repeat'">
        <div class="vx-col w-full">
          <p class="text-item">{{$t("every")}} {{calcIntervalText}}</p>
          <v-select :options="[1,2,3,4,5]" v-model="interval" class="w-full" />
        </div>
      </div>
      <div class="vx-row mb-base" v-if="repeat!='No Repeat' && repeat!='Daily'">
        <div class="vx-col w-full" v-if="repeat=='Weekly'">
          <h6>{{$t("repeat days") | capitalize}}</h6>
          <multiselect
            :placeholder="$t('repeat days')"
            :options="week"
            label="key"
            track-by="value"
            v-model="selectedDays1"
            :multiple="true"
          />
        </div>
        <div class="vx-col w-full" v-else-if="repeat=='Monthly'">
          <h6>{{$t("repeat days") | capitalize}}</h6>
          <multiselect
            :placeholder="$t('repeat days')"
            :options="days"
            v-model="selectedDays"
            :multiple="true"
          />
        </div>
      </div>
      <div class="vx-row mb-base">
        <div class="vx-col w-full">
          <h6>{{$t("due time") | capitalize}}</h6>
          <!-- <flat-pickr class="w-full" v-for="(aTime,key) in aTimes" :key=key :value="aTime" :config="configdateTimePicker" placeholder="Available due" /> -->
          <div class="flex justify-between mb-2" v-for="(aTime,key) in aTimes" :key="key">
            <div class="hasClockIcon relative w-full">
              <flat-pickr
                class="w-full"
                v-model="aTime.value"
                :config="configdateTimePicker"
                placeholder="Available due"
              />
            </div>
            <p class="flex items-center pl-4" v-if="aTimes.length>1">
              <vs-icon
                @click.native="removeTime(key)"
                class="cursor-pointer hover:text-danger"
                icon-pack="feather"
                icon="icon-trash-2"
                size="22px"
              />
            </p>
          </div>
        </div>
        <div class="vx-col w-full">
          <h6
            class="text-primary underline cursor-pointer"
            @click="addATime"
          >{{$t("add due time") | capitalize}}</h6>
        </div>
      </div>
    </VuePerfectScrollbar>
  </vs-prompt>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import VSelect from "vue-select";
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.min.css";
import Multiselect from "vue-multiselect";
import Datepicker from "vuejs-datepicker";
import * as lang from "vuejs-datepicker/src/locale";

import { db } from "../../firebase/firebaseConfig";

import firebase from "firebase/app";
import "@firebase/analytics";

export default {
  components: {
    VuePerfectScrollbar,
    VSelect,
    flatPickr,
    Multiselect,
    Datepicker,
  },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    update: {
      type: Boolean,
      default: false,
    },
    schedule: {
      type: Object,
    },
    templateID: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      location: null,
      interval: 1,
      languages: lang,
      template: "",
      user: [],
      mUser: [],
      selectedDays: [],
      repeat: "Daily",
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.3,
      },
      days: [],
      aDate: new Date(),
      // repeats: ,
      aTimes: [{ value: "08:00" }],
      configdateTimePicker: {
        enableTime: true,
        enableSeconds: false,
        noCalendar: true,
      },
    };
  },
  methods: {
    removeTime(index) {
      this.aTimes = this.aTimes.filter((item, id) => {
        return id != index;
      });
    },
    addATime() {
      this.aTimes.push({ value: "08:00" });
    },
    clear() {
      this.location = null
      this.template = "";
      this.user = [];
      this.mUser = [];
      this.repeat = "Daily";
      this.selectedDays = [];
      this.aTimes = [{ value: "08:00" }];
      this.interval = 1;
    },
    saveSchedule() {
      var assignDates = [];
      var from = this.aDate;
      var beforeItem = "";
      this.aTimes.map((item) => {
        if (item.value == beforeItem) return;
        beforeItem = item.value;
        assignDates.push(
          new Date(
            from.getFullYear(),
            from.getMonth(),
            from.getDate(),
            item.value.split(":")[0],
            item.value.split(":")[1]
          )
        );
      });
      var teams = [];
      this.user.map((item) => {
        teams.push(item.id);
      });
      var mUser = []
      this.mUser.map(item=> {
        mUser.push(item.id)
      })
      var the = this;
      var title = this.template.title + " - " + this.$t(this.repeat);

      if (!this.update) {
        this.$vs.loading();
        db.collection("schedules").add({
          location: [this.location.id],
          title: title,
          template: this.template.id,
          assign: teams,
          monitor: mUser,
          _repeat: this.repeat,
          dueTimes: assignDates,
          selectedDays: this.selectedDays,
          group: JSON.parse(localStorage.getItem("userInfo")).group,
          created_by: JSON.parse(localStorage.getItem("userInfo")).id,
          created_at: new Date(),
          updated_by: JSON.parse(localStorage.getItem("userInfo")).id,
          updated_at: new Date(),
          active: true,
          interval: this.interval,
        });
        setTimeout(() => {
          this.$vs.loading.close();
          this.$vs.notify({
            time: 7000,
            title: "Success",
            text: "New schedule is created successfully!",
            iconPack: "feather",
            icon: "icon-check-circle",
            color: "success",
          });
          firebase.analytics().logEvent("Create Schedule", {
            Title: title,
          });
          this.$intercom.trackEvent("Create Schedule", {
            Title: title,
          });
          this.$mixpanel.track("Create Schedule" , {
            distinct_id: JSON.parse(localStorage.getItem("userInfo")).id,
            Title: title,
            group: JSON.parse(localStorage.getItem("userInfo")).group
          })
          this.$userflow.track("Create Schedule" , {
            Title: title,
            group: JSON.parse(localStorage.getItem("userInfo")).group
          })
        }, 1000);
      } else {
        db.collection("schedules")
          .doc(this.schedule.id)
          .update({
            location: [this.location.id],
            title: title,
            template: this.template.id,
            assign: teams,
            monitor: mUser,
            _repeat: this.repeat,
            dueTimes: assignDates,
            selectedDays: this.selectedDays,
            group: JSON.parse(localStorage.getItem("userInfo")).group,
            updated_by: JSON.parse(localStorage.getItem("userInfo")).id,
            updated_at: new Date(),
            interval: this.interval,
          });
        setTimeout(() => {
          this.$vs.loading.close();
          this.$vs.notify({
            time: 7000,
            title: "Success",
            text: "Schedule is updated successfully!",
            iconPack: "feather",
            icon: "icon-check-circle",
            color: "success",
          });
        }, 1000);
      }

      this.clear();
    },
  },
  watch: {
    location(val) {
      this.teams = []
      this.mUser = []
    },
    repeat(val) {
      if (!this.update) this.selectedDays = [];
      else {
        if (val == this.schedule._repeat)
          this.selectedDays = this.schedule.selectedDays;
        else this.selectedDays = [];
      }
    },
    openPopup(val) {
      if (this.templateID != "") {
        this.template = this.templates.find((item) => {
          return item.id == this.templateID;
        });
      }
      if (val && this.update) {
        if(this.schedule.location == undefined) this.location = null
        else {
          var location = this.$store.getters['app/getLocationById'](this.schedule.location[0]) 
          if(location == undefined || location.deleted) this.location = null
          else this.location = location
        }
        this.template = this.templates.find((item) => {
          return item.id == this.schedule.template;
        });
        this.user = [];
        this.mUser = [];
        this.schedule.assign.map((item) => {
          var user = this.users.find((user) => user.id == item);
          if (user !== undefined) this.user.push(user);
        });
        this.schedule.monitor.map((item) => {
          var user = this.users.find((user) => user.id == item);
          if (user !== undefined) this.mUser.push(user);
        });
        this.repeat = this.schedule._repeat;

        this.selectedDays = this.schedule.selectedDays;
        this.aDate = this.schedule.dueTimes[0].toDate();
        this.aTimes = [];
        this.schedule.dueTimes.map((item) => {
          var date = new Date(item.toDate());
          this.aTimes.push({
            value: date.getHours() + ":" + date.getMinutes(),
          });
        });
        this.interval =
          this.schedule.interval !== undefined ? this.schedule.interval : 1;
      }
    },
  },
  computed: {
    locations() {
      var locations = this.$store.getters["app/locationList"]
      var filterLocations = []
      var locations1 = this.$store.getters['app/locations']
      let cUser = this.$store.getters['app/currentUser']

      if(locations.length == 0) {
        if(cUser.role == undefined || cUser.role.key == undefined || cUser.role.key>0) {
          if(cUser.location !== undefined && Array.isArray(cUser.location) && cUser.location.length>0) {
            filterLocations = cUser.location
          } else {
            filterLocations = ['no']
          }
        }
      }
      else
        filterLocations = locations
      if(filterLocations.length == 0 ) {
        return locations1.filter(item=> item.deleted == undefined || !item.deleted)
      }
      return locations1.filter(item=> filterLocations.indexOf(item.id)>-1)
    },
    calcIntervalText() {
      var txt = "";
      if (this.repeat == "Daily") txt = this.$t("day(s)");
      else if (this.repeat == "Weekly") txt = this.$t("week(s)");
      else if (this.repeat == "Monthly") txt = this.$t("month(s)");
      return txt;
    },
    week() {
      return [
        { key: this.$t("Monday"), value: 1 },
        { key: this.$t("Tuesday"), value: 2 },
        { key: this.$t("Wednesday"), value: 3 },
        { key: this.$t("Thursday"), value: 4 },
        { key: this.$t("Friday"), value: 5 },
        { key: this.$t("Saturday"), value: 6 },
        { key: this.$t("SunDay"), value: 0 },
      ];
    },
    repeat1: {
      get() {
        return this.repeats.filter((item) => item.name == this.repeat);
      },
      set(val) {
        if (val !== null) this.repeat = val.name;
      },
    },
    selectedDays1: {
      get() {
        if (this.repeat == "Weekly") {
          var res = [];
          var selected = [];
          this.selectedDays.map((item) => {
            selected.push(item.value);
          });
          // this.selectedDays.map(item => {
          //   selected.push(item.value);
          // });
          this.week.map((item) => {
            if (selected.indexOf(item.value) > -1) res.push(item);
          });
          return res;
        } else if (this.repeat == "Monthly") {
          return this.selectedDays;
        }
      },
      set(val) {
        this.selectedDays = val;
      },
    },
    repeats() {
      return [
        { name: "No Repeat", text: this.$t("No Repeat") },
        { name: "Daily", text: this.$t("Daily") },
        { name: "Weekly", text: this.$t("Weekly") },
        { name: "Monthly", text: this.$t("Monthly") },
      ];
    },
    users() {
      var location = this.location == null ? "" : this.location.id
      var teams = this.$store.getters['app/teams']
      return teams = teams.filter(team=> {
        if(team.active != undefined && !team.active) return false
          var users = this.$store.getters['app/getUsersByTeam'](team.id)
          var teamLocation = []
          users.map(user=> {
            if(user.location !== undefined && Array.isArray(user.location)) {
              user.location.map(ul=> {
                if(teamLocation.indexOf(ul)<0)
                  teamLocation.push(ul)
              })
            }
          })
          if(teamLocation.indexOf(location)<0) return false
          return true
      })
    },
    templates() {
      let filterLocations = []
      // this.$store.getters["app/locationList"]
      
      let templates = this.$store.getters["app/template"].filter(template=> {
        return template.trashed == undefined || !template.trashed
        // if(filterLocations.length > 0)
        //   return template.content.location.some(item=>filterLocations.includes(item))
        // else 
        //   return true
      });

      var __templates = [];
      templates.map((template) => {
        if (
          template.trashed ||
          template.content.templateSD != "schedule this template"
        )
          return;
        __templates.push({
          id: template.id,
          title: template.content.templateTitle,
        });
      });
      return __templates;
    },

    getTitle() {
      if (this.update) return this.$t("Update Schedule");
      else return this.$t("Create a new Schedule");
    },
    openPopup: {
      get() {
        return this.open;
      },
      set(val) {
        this.$emit("close");
      },
    },
    validateForm() {
      if (this.template == "" || this.user.length == 0) return false;
      else {
        if (this.interval === null) return false;
        if (this.repeat == "Weekly" || this.repeat == "Monthly") {
          if (this.selectedDays == "" || this.selectedDays.length == 0)
            return false;
          else return true;
        } else {
          return true;
        }
      }
    },
  },
  created() {
    for (var i = 1; i < 32; i++) {
      this.days.push(i);
    }
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style scoped>
.schedule-new-area {
  height: calc(100vh - 20rem);
}
.text-item {
  opacity: 0.9;
  font-size: 14px;
  font-weight: 500;
  color: #1e1c26;
}
.hasDatepickerIcon::after {
  font-family: "feather" !important;
  font-style: normal;
  font-size: 20px;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1.7;
  content: "\e83a";
  position: absolute;
  top: 2px;
  right: 10px;
}

.hasClockIcon::after {
  font-family: "feather" !important;
  font-style: normal;
  font-size: 20px;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1.7;
  content: "\e84d";
  position: absolute;
  top: 5px;
  right: 10px;
}
</style>
