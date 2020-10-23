<template>
  <div id="team-tab">
    <div class="flex justify-end w-full mb-4 mt-3 lg:mt-0">
      <feather-icon
        icon="ListIcon"
        @click="currentItemView='item-list-view'"
        class="p-2 mr-2 shadow-drop rounded-lg d-theme-dark-bg cursor-pointer"
        :svgClasses="{'text-primary stroke-current': currentItemView == 'item-list-view'}"
      />
      <feather-icon
        icon="GridIcon"
        @click="currentItemView='item-grid-view'"
        class="p-2 mr-2 shadow-drop rounded-lg d-theme-dark-bg cursor-pointer"
        :svgClasses="{'text-primary stroke-current': currentItemView == 'item-grid-view'}"
      />
      <vs-input
        class="bg-white hidden md:block mr-2"
        v-model="searchKey"
        :placeholder="$t('Search')"
        icon="icon-search"
        icon-pack="feather"
        icon-no-border
      />
      <vs-button class="karla" @click="newTeam">+ {{$t("add team")}}</vs-button>
    </div>
    <vs-input
      class="bg-white block md:hidden mr-2 w-full"
      v-model="searchKey"
      :placeholder="$t('Search')"
      icon="icon-search"
      icon-pack="feather"
      icon-no-border
    />
    <div class="vx-row mt-5" v-if="currentItemView=='item-grid-view'">
      <div
        class="vx-col w-full sm:w-1/2 md:w-1/4 sm:px-2 px-0 mb-base"
        v-for="(team,key) in teams"
        :key="key"
      >
        <group-card :team="team" @edit="editTeam" @deleteTeam="deleteConfirm" />
      </div>
    </div>
    <div class="w-full" v-else>
      <vs-table ref="table" class="w-full" :data="teams">
        <template slot="thead">
          <vs-th>{{$t("team name") | capitalize}}</vs-th>
          <vs-th>{{$t("teammates") | capitalize}}</vs-th>
          <vs-th>{{$t("locations") | capitalize}}</vs-th>
          <vs-th class="text-right" v-if="cUserRole<2">{{$t("action") | capitalize}}</vs-th>
        </template>
        <template slot-scope="{data}">
          <vs-tr :data="team" :key="indextr" v-for="(team, indextr) in data">
            <vs-td>
              <span>{{team.name}}</span>
            </vs-td>
            <vs-td>
              <span>{{usersCount(team.id)}}</span>
            </vs-td>
            <vs-td>
              <div class="inline-block items-center">
                <div
                  class="bg-clip py-2 px-3 rounded-lg ml-2 inline-block"
                  v-for="(location,i) in locations(team.location)"
                  :class="{'hidden':i!=0 }"
                  :key="i"
                >
                  <vs-icon icon-pack="feather" icon="icon-map-pin" class="mr-1" />
                  <span class="karla item-text">{{location.name}}</span>
                </div>

                <vs-dropdown
                  v-if="locations(team.location).length>1"
                  vs-custom-content
                  class="cursor-pointer mr-4"
                  vs-trigger-click
                >
                  <p
                    class="karla bg-clip py-2 px-3 rounded-lg ml-2 inline-block cursor-pointer item-text items-center"
                  >+{{locations(team.location).length-1}}</p>
                  <vs-dropdown-menu class="vx-navbar-dropdown">
                    <ul style="min-width: 9rem" class="p-0">
                      <li
                        class="flex items-center py-1 px-2 my-1 cursor-pointer"
                        v-for="(location,lIndex) in locations(team.location)"
                        :key="lIndex"
                      >
                        <template>
                          <vs-icon icon-pack="feather" icon="icon-users" class="mr-1" />
                          <span class="ml-2 karla">{{location.name}}</span>
                        </template>
                      </li>
                    </ul>
                  </vs-dropdown-menu>
                </vs-dropdown>
              </div>
            </vs-td>
            <vs-td >
              <div class="flex items-center justify-end">
                <feather-icon
                  icon="Edit2Icon"
                  class="mr-2 w-6 cursor-pointer"
                  @click="editTeam(team)"
                />
                <vs-icon
                  icon-pack="feather"
                  icon="icon-trash-2"
                  size="20px"
                  color="danger"
                  @click="deleteConfirm(team)"
                />
              </div>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </div>
    <group-edit-sidebar
      :isSidebarActive="activeEdit"
      @close="activeEdit=false"
      :update="updatedKey"
      :team="selectedTeam"
    />
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
        >{{$t("you are about to delete team")}}</p>
        <p class="karla-bold text-sm text-center mt-4">{{$t('this will delete your team')}}</p>
        <p class="karla-bold text-sm text-center">{{$t("are you sure to delete ?")}}</p>
        <div class="flex items-center justify-center mt-base">
          <vs-button class="ml-2" color="danger" @click="deleteTeam">
            <span class="karla">{{$t("yes, delete team")}}</span>
          </vs-button>
          <vs-button
            @click="deletePrompt=false"
            color="rgba(108, 80, 240, 0.1)"
            text-color="rgba(108, 80, 240)"
            class="kalar ml-2"
          >
            <span class="karla">{{$t("cancel, keep team")}}</span>
          </vs-button>
        </div>
      </div>
    </vs-popup>
  </div>
</template>

<script>
import GroupCard from "./GroupCard.vue";

import GroupEditSidebar from "./GroupEditSidebar";
import { db } from "../../../firebase/firebaseConfig";

import firebase from "firebase/app";
import "@firebase/analytics";

export default {
  components: {
    GroupCard,
    GroupEditSidebar,
  },

  data() {
    return {
      deletePrompt: false,
      searchKey: "",
      openGroup: false,
      name: "",
      currentItemView: "item-grid-view",
      roles: ["Subscriber", "Editor", "Admin"],
      role: "Subscriber",
      activeEdit: false,
      updatedKey: false,
      selectedTeam: {},
      deleteTeamID: "",
    };
  },
  methods: {
    deleteTeam() {
      db.collection("teams").doc(this.deleteTeamID).update({
        deleted: true,
      });
      this.deletePrompt = false;
    },
    deleteConfirm(team) {
      if(!this.auth('user and team settings' , 'delete')) {
        this.roleError('create')
        return false
      }
      this.deletePrompt = true;
      this.deleteTeamID = team.id;
    },
    editTeam(team) {
      if(!this.auth('user and team settings' , 'edit')) {
        this.roleError('create')
        return false
      }
      this.selectedTeam = team;
      this.updatedKey = true;
      this.activeEdit = true;
    },
    newTeam() {
      if(!this.auth('user and team settings' , 'create')) {
        this.roleError('create')
        return false
      }
      this.updatedKey = false;
      this.selectedTeam = {};
      this.activeEdit = true;
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
    locations() {
      return (ids) => {
        if (!Array.isArray(ids)) return [];
        var locations = [];
        ids.map((item) => {
          let location = this.$store.getters["app/getLocationById"](item);
          if (location === undefined) return;
          locations.push(location);
        });
        return locations;
      };
    },
    cUserRole() {
      var cUser = this.$store.getters["app/currentUser"];
      if (cUser.role === undefined) return 5;
      return cUser.role.key;
    },
    // Group : Location, authorisation, chat name
    teams() {
      let locationList = this.$store.getters["app/locationList"]

      let teams = this.$store.getters["app/teams"].filter(team=> {
        if (locationList.length > 0) {
          if(team.location == undefined || !Array.isArray(team.location)) return false
          if(!team.location.some(item => locationList.includes(item))) return false
        }
        return team.active && !team.deleted
      });

      return teams
    },
    usersCount() {
      return (id) => {
        let users = this.$store.getters["app/users"];
        var count = 0;
        users.map((user) => {
          if (user.team !== undefined && user.team.indexOf(id) > -1) count++;
        });
        return count;
      };
    },
  },
};
</script>

<style lang="scss">
#team-tab {
  .vs-con-table {
    .vs-table--header {
      display: flex;
      flex-wrap: wrap-reverse;
      margin-left: 1.5rem;
      margin-right: 1.5rem;
      > span {
        display: flex;
        flex-grow: 1;
      }
    }
    .vs-con-tbody {
      background: transparent;
      border: none;
      .vs-table {
        border-collapse: separate;
        border-spacing: 0 0.8rem;
        padding: 0 1rem;
        min-width: 1300px;

        tr {
          box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.05);
          td {
            font-family: "karla";

            padding: 20px;
            &:first-child {
              border-top-left-radius: 0.5rem;
              border-bottom-left-radius: 0.5rem;
            }
            &:last-child {
              border-top-right-radius: 0.5rem;
              border-bottom-right-radius: 0.5rem;
            }
          }
          td.td-check {
            padding: 20px !important;
          }
        }
      }

      .vs-table--thead {
        th {
          padding-top: 0;
          padding-bottom: 0;

          .vs-table-text {
            // text-transform: uppercase;
            font-weight: 600;
            font-family: "karla";
          }
        }
        th.text-right {
          .vs-table-text {
            justify-content: flex-end;
            padding-right: 15px;
          }
        }
        th.td-check {
          padding: 0 15px !important;
        }
        tr {
          background: none;
          box-shadow: none;
        }
      }
    }
  }
}
</style>

<style scoped>
.bg-clip {
  background: #ebebf1;
}
</style>