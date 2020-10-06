<template>
  <div id="user-management">
    <div class="page-header flex items-center justify-between">
      <div class="sm:flex">
        <p class="text-2xl color-my-black karla-bold">{{$t("users management")}}</p>
        <div class="switch-tab flex items-center sm:ml-12 mt-2 sm:mt-0">
          <div
            class="text-center py-3 px-6 karla"
            :class="{'active': tab=='users'}"
            @click="tab='users'"
          >{{$t("users")}}</div>
          <div
            class="text-center py-3 px-6 karla"
            :class="{'active': tab=='teams'}"
            @click="tab='teams'"
          >{{$t("teams")}}</div>
        </div>
      </div>
    </div>
    <div class="page-content">
      <user-tab v-if=" tab=='users'" />
      <group-tab v-else-if="tab=='teams'" />
    </div>
  </div>
</template>
<script>
import UserTab from "./user/UserTab.vue";
import GroupTab from "./group/GroupTab.vue";

export default {
  components: {
    UserTab,
    GroupTab,
  },
  data() {
    return {
      tab: "users",
    };
  },
  created() {},
};
</script>

<style scoped>
.switch-tab div {
  min-width: 100px;
  background: white;
  transition: all, 0.25;
  font-size: 12px;
  color: #6c50f0;
  border: 1px solid #6c50f0;
  cursor: pointer;
}
.switch-tab div:first-child {
  border-right-width: 0;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}
.switch-tab div:last-child {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}
.switch-tab div.active {
  background-color: rgba(108, 80, 240, 0.08);
}
</style>