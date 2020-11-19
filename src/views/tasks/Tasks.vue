<template>
  <div class="task-section">
    <template v-if="!auth">
      <no-auth/>
    </template>
    <template v-else>
      <tasks-admin/>
      <!-- <tasks-worker/> -->
    </template>
  </div>
</template>

<script>
import TasksAdmin from "./TasksAdmin.vue";
import TasksWorker from "./TasksWorker.vue";
import NoAuth from "@/components/no-auth/NoAuth";

import { db } from "@/firebase/firebaseConfig.js";

export default {
  components: {
    TasksAdmin,
    TasksWorker,
    NoAuth
  },
  computed: {
    auth() {
      let authList = this.$store.getters['app/auth']
      if(this.role.key==0) return true
      if(Object.keys(authList).length == 0) return false
      else if(!authList.records[this.role.name.toLowerCase()].view)
        return false
      return true
    },
    role() {
      var cUser = this.$store.getters["app/currentUser"]
      if (cUser == undefined || cUser.role === undefined) {
        return {
          name: 'auditor',
          key:4
        };
      }
      return cUser.role;
    }
  },
};
</script>