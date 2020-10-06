<template>
  <vx-card>
    <div class="sm:p-6 p-4" slot="no-body">
      <div class="team-header flex justify-between items-start mb-8">
        <div class="flex items-center">
          <div class="team-name">
            <p class="karla-bold text-lg color-my-black">{{team.name}}</p>
          </div>
        </div>
        <vs-dropdown vs-trigger-click v-if="cUserRole<2">
          <feather-icon icon="MoreVerticalIcon" class="cursor-pointer" />
          <vs-dropdown-menu class="vx-navbar-dropdown">
            <ul style="min-width: 9rem" class="p-0">
              <li
                @click="$emit('edit' , team)"
                class="flex items-center py-1 px-2 my-1 cursor-pointer hover:bg-primary hover:text-white"
              >
                <feather-icon icon="Edit2Icon" class="cursor-pointer w-5" />
                <p class="karla text-base ml-2">{{$t("edit")}}</p>
              </li>
              <li
                @click="$emit('deleteTeam' , team)"
                class="flex items-center py-1 px-2 my-1 cursor-pointer hover:bg-primary hover:text-white"
              >
                <feather-icon icon="Trash2Icon" class="cursor-pointer w-5" />
                <p class="karla text-base ml-2">{{$t("delete")}}</p>
              </li>
            </ul>
          </vs-dropdown-menu>
        </vs-dropdown>
      </div>
      <div class="flex items-center justify-between p-3 infor-item">
        <p class="karla title-text text-sm">{{$t("teammates")}}</p>
        <p class="karla title-content">{{usersCount}}</p>
      </div>

      <div class="flex items-center justify-between p-3 infor-item">
        <p class="karla title-text text-sm">{{$t("locations")}}</p>
        <vs-dropdown
          v-if="locations(team.location).length>0"
          vs-custom-content
          class="cursor-pointer"
          vs-trigger-click
        >
          <div class="flex items-center">
            <vs-icon icon="icon-map-pin" icon-pack="feather"></vs-icon>
            <p class="karla title-content ml-1">{{locations(team.location).length}}</p>
          </div>
          <vs-dropdown-menu class="vx-navbar-dropdown">
            <ul style="min-width: 9rem" class="p-0">
              <li
                class="flex items-center py-1 px-2 my-1 cursor-pointer"
                v-for="(location,lIndex) in locations(team.location)"
                :key="lIndex"
              >
                <vs-icon icon-pack="feather" icon="icon-map-pin" class="mr-1" />
                <span class="ml-2 karla">{{location.name}}</span>
              </li>
            </ul>
          </vs-dropdown-menu>
        </vs-dropdown>
      </div>
    </div>
  </vx-card>
</template>

<script>
import { db } from "../../../firebase/firebaseConfig";
import VSelect from "vue-select";

export default {
  components: {
    VSelect
  },
  props: {
    team: {
      type: Object
    }
  },

  computed: {
    cUserRole() {
      var cUser = this.$store.getters["app/currentUser"];
      if (cUser.role === undefined) return 5;
      return cUser.role.key;
    },
    usersCount() {
      let users = this.$store.getters["app/users"];
      var count = 0;
      users.map(user => {
        if (user.team !== undefined && user.team.indexOf(this.team.id) > -1)
          count++;
      });
      return count;
    },
    users() {
      return this.$store.getters["app/users"];
    },
    locations() {
      return ids => {
        var locations = [];
        if (!Array.isArray(ids)) return [];
        ids.map(id => {
          let location = this.$store.getters["app/getLocationById"](id);
          if (location === undefined) return;
          locations.push(location);
        });
        return locations;
      };
    }
  }
};
</script>
<style scoped>
.hover-pop {
  transition: all 0.25s ease;
}
.hover-pop:hover {
  display: inline-flex;
  transform: translateY(-4px);
}
.h-100 {
  min-height: 400px;
}
.infor-item {
  border-bottom: 1px solid #1e1c261a;
}
</style>
<style>
#teams .vx-card__footer {
  margin: 0;
  padding: 0.5rem !important;
  background: rgba(var(--vs-primary), 0.15);
  border-radius: 5px;
}
</style>