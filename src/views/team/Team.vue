<template>
  <div id="user-management">
    <template v-if="!auth('user and team settings' , 'view')">
      <no-auth/>
    </template>
    <div class="page-header flex items-center justify-between" v-else>
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
          <div
            v-if="cUser.role && cUser.role.key<1"
            class="text-center py-3 px-6 karla"
            :class="{'active': tab=='auth'}"
            @click="tab='auth'"
          >{{$t("authorizations")}}</div>
        </div>
      </div>
    </div>
    <div class="page-content">
      <user-tab v-if=" tab=='users'" />
      <group-tab v-else-if="tab=='teams'" />
      <auth-tab v-else-if="tab='auth'"/>
    </div>
  </div>
</template>
<script>
import UserTab from "./user/UserTab.vue";
import GroupTab from "./group/GroupTab.vue";
import AuthTab from "./auth/Auth.vue"
import NoAuth from "@/components/no-auth/NoAuth";
export default {
  components: {
    UserTab,
    GroupTab,
    AuthTab,
    NoAuth
  },
  data() {
    return {
      tab: "users",
    };
  },
  computed: {
    auth() {
      return (sub,action) => {
        let authList = this.$store.getters['app/auth']
        var cUser = this.$store.getters["app/currentUser"];
        if(cUser == undefined || cUser.role == undefined) return false
        else if(cUser.role.key == 0) 
          return true
        else if(authList[sub][cUser.role.name.toLowerCase()][action])
          return true
        else 
          return false
      }
    },
    cUser() {
      return  this.$store.getters["app/currentUser"];
    }
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
.switch-tab div:nth-child(3) {
  border-left-width: 0;
}
.switch-tab div:last-child {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}
.switch-tab div.active {
  background-color: rgba(108, 80, 240, 0.08);
}
</style>