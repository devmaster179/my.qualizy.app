<template>
  <div class="list-view">
    <table class="schedule-table w-full">
      <thead>
        <tr>
          <th>{{$t("template name")}}</th>
          <th>{{$t("location")}}</th>
          <th>{{$t("teams")}}</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <list-view-item
          :schedule="schedule"
          v-for="(schedule , index) in schedules"
          :key="index"
          @delete="deleteConfirm"
          @edit="editSchedule"
        />
      </tbody>
    </table>
    <vs-popup
      classContent="popup-example"
      :title="$t('are you sure to delete ?')"
      :active.sync="deletePrompt"
    >
      <div class="delete-content">
        <div class="text-center">
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.12"
              d="M0 40C0 17.9086 17.9086 0 40 0C62.0914 0 80 17.9086 80 40C80 62.0914 62.0914 80 40 80C17.9086 80 0 62.0914 0 40Z"
              fill="#EB5743"
            />
            <path
              d="M25 30H28.3333H55"
              stroke="#EB5743"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M33.3308 29.9972V26.6639C33.3308 25.7798 33.682 24.932 34.3071 24.3069C34.9322 23.6818 35.7801 23.3306 36.6641 23.3306H43.3308C44.2149 23.3306 45.0627 23.6818 45.6878 24.3069C46.313 24.932 46.6641 25.7798 46.6641 26.6639V29.9972M51.6641 29.9972V53.3306C51.6641 54.2146 51.313 55.0625 50.6878 55.6876C50.0627 56.3127 49.2149 56.6639 48.3308 56.6639H31.6641C30.7801 56.6639 29.9322 56.3127 29.3071 55.6876C28.682 55.0625 28.3308 54.2146 28.3308 53.3306V29.9972H51.6641Z"
              stroke="#EB5743"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M36.6692 38.3306V48.3306"
              stroke="#EB5743"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M43.3308 38.3306V48.3306"
              stroke="#EB5743"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <p
          class="karla-bold text-2xl color-my-black text-center pt-base"
        >{{$t("you are about to delete schedule")}}</p>
        <p class="karla-bold text-sm text-center mt-4">{{$t('this will delete your schedule')}}</p>
        <p class="karla-bold text-sm text-center">{{$t("are you sure to delete ?")}}</p>
        <div class="flex items-center justify-center mt-base">
          <vs-button class="ml-2" color="danger" @click="deleteSchedule">
            <span class="karla">{{$t("yes, delete schedule")}}</span>
          </vs-button>
          <vs-button
            @click="deletePrompt=false"
            color="rgba(108, 80, 240, 0.1)"
            text-color="rgba(108, 80, 240)"
            class="kalar ml-2"
          >
            <span class="karla">{{$t("cancel, keep schedule")}}</span>
          </vs-button>
        </div>
      </div>
    </vs-popup>
    <schedule-popup
      :open="activeEdit"
      @close="activeEdit=false"
      update
      :schedule="selectedSchedule"
    />
  </div>
</template>
<script>
import ListViewItem from "./ListViewItem";
import SchedulePopup from "./SchedulePopup";

import { db } from "@/firebase/firebaseConfig";
export default {
  props: {
    schedules: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      deletePrompt: false,
      deleteID: "",
      activeEdit: false,
      selectedSchedule: {}
    };
  },
  components: {
    ListViewItem,
    SchedulePopup
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
  },
  methods: {
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
    editSchedule(id) {
      if(!this.auth('edit')) {
        this.roleError('edit')
        return false
      }
      let schedule = this.$store.getters["app/getScheduleById"](id);
      this.selectedSchedule = schedule;
      // this.selectedSchedule = JSON.parse(JSON.stringify(schedule));
      this.activeEdit = true;
    },
    deleteConfirm(id) {
      if(!this.auth('delete')) {
        this.roleError('delete')
        return false
      }
      this.deleteID = id;
      this.deletePrompt = true;
    },
    deleteSchedule() {
      this.deletePrompt = false;
      db.collection("schedules")
        .doc(this.deleteID)
        .delete();
    }
  }
};
</script>
<style>
.schedule-table {
  border-collapse: separate;
  border-spacing: 0px 1.3rem;
}
.schedule-table thead tr th {
  font-family: "Karla";
  font-size: 14px;
  color: #1e1c26;
  padding-left: 0;
}
.schedule-table thead tr th:first-child {
  padding-left: 2rem;
}
.schedule-table tbody tr {
  box-shadow: rgba(0, 0, 0, 0.05) 0px 4px 20px 0px;
}
.schedule-table tbody tr td {
  padding: 1rem 5px 1rem 0;
  background: white;
  color: 1e1c26;
  font-family: "Karla";
}

.schedule-table tbody tr td:first-child {
  padding: 1.5rem 0 1.5rem 2rem;
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
}

.schedule-table tbody tr td:last-child {
  border-top-right-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}
</style>



