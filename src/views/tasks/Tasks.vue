<template>
  <div class="task-section">
    <tasks-admin v-if="role<2" />
    <tasks-worker v-else />
  </div>
</template>

<script>
import TasksAdmin from "./TasksAdmin.vue";
import TasksWorker from "./TasksWorker.vue";
// import NoAuth from "@/components/no-auth/NoAuth";

export default {
  components: {
    TasksAdmin,
    TasksWorker
    // NoAuth
  },
  computed: {
    role() {
      var cUser = this.$store.getters["app/currentUser"];
      if (cUser == undefined || cUser.role === undefined) {
        return 4;
      }
      return cUser.role.key;
    }
  }
};
</script>