<template>
  <vx-card>
    <div class="p-4" slot="no-body">
      <div class="user-header flex justify-between items-start mb-8">
        <div class="flex items-center">
          <vs-avatar v-if="user.photo && user.photo !=='' " size="50px" :src="user.photo" />
          <vs-avatar v-else size="50px" :src="require('@/assets/images/user.png')" />
          <div class="user-name">
            <p class="karla-bold text-lg color-my-black">{{user.name}}</p>
            <p class="karla text-sm">{{user.email}}</p>
          </div>
        </div>
        <vs-dropdown vs-trigger-click v-if="canEdit">
          <feather-icon icon="MoreVerticalIcon" class="cursor-pointer" />
          <vs-dropdown-menu class="vx-navbar-dropdown">
            <ul style="min-width: 9rem" class="p-0">
              <li
                @click="$emit('edit' , user)"
                class="flex items-center py-1 px-2 my-1 cursor-pointer hover:bg-primary hover:text-white"
              >
                <feather-icon icon="Edit2Icon" class="cursor-pointer w-5" />
                <p class="karla text-base ml-2">{{$t("edit")}}</p>
              </li>
              <li
                @click="$emit('delete' , user)"
                class="flex items-center py-1 px-2 my-1 cursor-pointer hover:bg-primary hover:text-white"
              >
                <feather-icon icon="Trash2Icon" class="cursor-pointer w-5" />
                <p class="karla text-base ml-2">{{$t("delete")}}</p>
              </li>
              <li
                @click="$emit('resend-invite' , user)"
                class="flex items-center py-1 px-2 my-1 cursor-pointer hover:bg-primary hover:text-white"
              >
                <feather-icon icon="SendIcon" class="cursor-pointer w-5" />
                <p class="karla text-base ml-2">{{$t("resend invite")}}</p>
              </li>
            </ul>
          </vs-dropdown-menu>
        </vs-dropdown>
      </div>
      <div class="flex items-center justify-between p-3 infor-item">
        <p class="karla title-text text-sm">{{$t("job title")}}</p>
        <p class="karla title-content">{{user.job_title}}</p>
      </div>

      <div class="flex items-center justify-between p-3 infor-item">
        <p class="karla title-text text-sm">{{$t("phone number")}}</p>
        <p class="karla title-content">{{user.phone}}</p>
      </div>

      <div class="flex items-center justify-between p-3 infor-item">
        <p class="karla title-text text-sm">{{$t("locations")}}</p>
        <vs-dropdown
          v-if="locations(user.location).length>0"
          vs-custom-content
          class="cursor-pointer mr-4"
          vs-trigger-click
        >
          <div class="flex items-center">
            <vs-icon icon="icon-map-pin" icon-pack="feather"></vs-icon>
            <p class="karla title-content ml-1">{{locations(user.location).length}}</p>
          </div>
          <vs-dropdown-menu class="vx-navbar-dropdown">
            <ul style="min-width: 9rem" class="p-0">
              <li
                class="flex items-center py-1 px-2 my-1 cursor-pointer"
                v-for="(location,lIndex) in locations(user.location)"
                :key="lIndex"
              >
                <vs-icon icon-pack="feather" icon="icon-map-pin" class="mr-1" />
                <span class="ml-2 karla">{{location.name}}</span>
              </li>
            </ul>
          </vs-dropdown-menu>
        </vs-dropdown>
      </div>

      <div class="flex items-center justify-between p-3 infor-item">
        <p class="karla title-text text-sm">{{$t("teams")}}</p>
        <vs-dropdown
          v-if="teams(user.team).length>0"
          vs-custom-content
          class="cursor-pointer mr-4"
          vs-trigger-click
        >
          <div class="flex items-center">
            <vs-icon icon="icon-users" icon-pack="feather"></vs-icon>
            <p class="karla title-content ml-1">{{teams(user.team).length}}</p>
          </div>
          <vs-dropdown-menu class="vx-navbar-dropdown">
            <ul style="min-width: 9rem" class="p-0">
              <li
                class="flex items-center py-1 px-2 my-1 cursor-pointer"
                v-for="(team,lIndex) in teams(user.team)"
                :key="lIndex"
              >
                <vs-icon icon-pack="feather" icon="icon-users" class="mr-1" />
                <span class="ml-2 karla">{{team.name}}</span>
              </li>
            </ul>
          </vs-dropdown-menu>
        </vs-dropdown>
      </div>

      <div class="flex items-center justify-between p-3 infor-item">
        <p class="karla title-text text-sm">{{$t("role")}}</p>
        <p class="karla title-content" v-if="user.role">{{$t(user.role.name.toLowerCase()) | capitalize}}</p>
      </div>

      <div class="flex items-center justify-between p-3 infor-item">
        <p class="karla title-text text-sm">{{$t("last login")}}</p>
        <p
          class="karla title-content"
          v-if="user.last_visit!=undefined"
        >{{user.last_visit.toDate() | moment("YYYY, MM DD HH:mm:s ") }}</p>
        <p class="karla title-content" v-else>{{$t("Never connected")}}</p>
      </div>
      <div class="flex items-center justify-between p-3 infor-item">
        <p class="karla title-text text-sm">{{$t("social media")}}</p>
        <div class="flex items-center">
          <a v-if="user.facebook!==undefined" :href="user.facebook">
            <img :src="require('@/assets/images/social/facebook.svg')" class="mr-1" width="35" />
          </a>
          <a v-if="user.twitter!==undefined" :href="user.twitter">
            <img :src="require('@/assets/images/social/twitter.svg')" class="mr-1" width="35" />
          </a>
          <a v-if="user.linkedin!==undefined" :href="user.linkedin">
            <img :src="require('@/assets/images/social/linkedin.svg')" class="mr-1" width="35" />
          </a>
        </div>
      </div>
    </div>
  </vx-card>
</template>

<script>
import { db } from "../../../firebase/firebaseConfig";
import vSelect from "vue-select";
import { VueTelInput } from "vue-tel-input";
import firebase from "firebase/app";
import "@firebase/analytics";
export default {
  components: {
    vSelect,
    VueTelInput,
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      roles: [
        {
          name: "Super admin",
          key: 0,
        },
        {
          name: "Admin",
          key: 1,
        },
        {
          name: "Supervisor",
          key: 2,
        },
        {
          name: "Operator",
          key: 3,
        },
        {
          name: "Auditor",
          key: 4,
        },
      ],
      role: "",
      activeRole: false,
      inputOptions: {
        showDialCode: true,
        tabindex: 0,
      },
      phone: "",
      code: "",
      activePhone: false,
      activeJob: false,
      activeName: false,
      jobTitle: "",
      location: {},
      activeLocation: false,
      activeGroup: false,
      group: [],
      isPhone: false,
      userName: "",
    };
  },
  computed: {
    canEdit() {
      let cRole = this.cUserRole
      if(cRole==0) return true
      var role = 4
      if(this.user.role !== undefined && this.user.role.key != undefined) 
        role = this.user.role.key 
      return cRole <= role
    },
    cUserRole() {
      var cUser = this.$store.getters["app/currentUser"];
      if (cUser.role === undefined) return 4;
      return cUser.role.key;
    },
    status: {
      get() {
        return this.user.status;
      },
      set(val) {
        this.$vs.loading();
        db.collection("users")
          .doc(this.user.id)
          .update({
            status: val,
            updated_at: new Date(),
            updated_by: JSON.parse(localStorage.getItem("userInfo")).group,
          })
          .then(() => {
            this.$vs.loading.close();
            this.$vs.notify({
              title: "Success",
              text: "Stauts is changed successfully!",
              iconPack: "feather",
              icon: "icon-check-circle",
              color: "success",
            });
          })
          .catch((err) => {
            this.$vs.loading.close();
            this.$vs.notify({
              title: "Failed",
              text: err.message,
              iconPack: "feather",
              icon: "icon-alert-circle",
              color: "warning",
            });
          });
      },
    },
    locations() {
      return (ids) => {
        var locations = [];
        if (!Array.isArray(ids)) return [];
        ids.map((id) => {
          let location = this.$store.getters["app/getLocationById"](id);
          if (location === undefined) return;
          locations.push(location);
        });
        return locations;
      };
    },
    teams() {
      return (ids) => {
        var teams = [];
        if (!Array.isArray(ids)) return [];
        ids.map((id) => {
          let team = this.$store.getters["app/getTeamById"](id);
          if (team === undefined) return;
          teams.push(team);
        });
        return teams;
      };
    },
    calcTeam() {
      if (this.user.team == undefined || this.user.team == "") return "";
      var _team = [];
      this.user.team.map((item) => {
        var team = this.$store.getters["app/getTeamById"](item);
        if (team == undefined) return;
        _team.push(team.name);
      });
      return _team.join(", ");
    },
    calcLocation() {
      return (ids) => {
        if (Array.isArray(ids)) {
          var locations = [];
          ids.map((item) => {
            var location = this.$store.getters["app/getLocationById"](item);
            if (
              location === undefined ||
              !location.active ||
              (location.deleted !== undefined && location.deleted)
            )
              return;
            else locations.push(item);
          });
          if (locations.length == 0) {
            return {
              number: 0,
              string: this.$t("location"),
            };
          } else if (locations.length == 1) {
            return {
              number: 1,
              string: this.$t("location"),
            };
          } else {
            return {
              number: locations.length,
              string: this.$t("locations"),
            };
          }
        } else {
          var location = this.$store.getters["app/getLocationById"](ids);
          if (
            location === undefined ||
            !location.active ||
            (location.deleted !== undefined && location.deleted)
          ) {
            return {
              number: 0,
              string: this.$t("location"),
            };
          } else {
            return {
              number: 1,
              string: this.$t("location"),
            };
          }
        }
      };
    },
  },
  watch: {
    activeRole(val) {
      if (val) this.role = this.user.role;
    },
    activePhone(val) {
      if (val) {
        this.phone = this.user.phone;
      }
    },
    activeLocation(val) {
      // if (val)
      //   this.location = this.$store.getters["app/getLocationById"](
      //     this.user.location
      //   );
      if (val) {
        this.location = [];
        var locations = this.user.location;
        if (!Array.isArray(locations))
          locations = locations == "" ? [] : [locations];
        locations.map((item) => {
          var location = this.$store.getters["app/getLocationById"](item);
          if (
            location === undefined ||
            !location.active ||
            (location.deleted !== undefined && location.deleted)
          )
            return;
          else this.location.push(location);
        });
      }
    },
    activeGroup(val) {
      if (val) {
        this.group = [];
        this.user.team.map((team) => {
          var _team = this.$store.getters["app/getTeamById"](team);
          if (_team == undefined) return;
          this.group.push(_team);
        });
      }
    },
    activeJob(val) {
      if (val) {
        if (this.user.job_title === undefined) this.jobTitle = "";
        else this.jobTitle = this.user.job_title;
      }
    },
    activeName(val) {
      if (val) {
        if (this.user.name === undefined) this.userName = "";
        else this.userName = this.user.name;
      }
    },
  },
  methods: {
    chnName() {
      if (this.cUserRole > 1) return false;
      this.$vs.loading();
      db.collection("users")
        .doc(this.user.id)
        .update({
          name: this.userName,
        })
        .then(() => {
          this.$vs.loading.close();
          this.$vs.notify({
            time: 7000,
            color: "success",
            title: "Success",
            text: "The user's name is changed successfully.",
          });
        });
    },
    deleteUser() {
      this.$vs.loading();
      firebase.analytics().logEvent("Deleted a user account", {
        group: JSON.parse(localStorage.getItem("userInfo")).group,
        deletedUserEmail: this.user.email,
      });
      db.collection("users")
        .doc(this.user.id)
        .update({
          deleted: true,
        })
        .then(() => {
          this.$vs.loading.close();
          this.$vs.notify({
            time: 7000,
            color: "success",
            title: "Deleted user",
            text: "The user was successfully deleted",
          });
        });
    },
    deleteConfirm() {
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        acceptText: this.$t("delete"),
        title: `Are you sure?`,
        text: `You might be loss this user and some data .
                           Are you sure deleting this user ? `,
        accept: this.deleteUser,
      });
    },
    chnRole() {
      this.activeRole = false;
      this.$vs.loading();
      db.collection("users")
        .doc(this.user.id)
        .update({
          role: this.role,
          updated_at: new Date(),
          updated_by: JSON.parse(localStorage.getItem("userInfo")).group,
        })
        .then(() => {
          this.$vs.loading.close();
          this.$vs.notify({
            title: "Success",
            text: "Role is changed successfully!",
            iconPack: "feather",
            icon: "icon-check-circle",
            color: "success",
          });
        })
        .catch((err) => {
          this.$vs.loading.close();
          this.$vs.notify({
            title: "Failed",
            text: err.message,
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "warning",
          });
        });
    },
    phoneValidate(formattedNumber, { number, isValid, country }) {
      this.isPhone = isValid;
      this.code = country;
    },
    phoneValidate1() {},
    del() {
      db.collection("users").doc(this.user.id).delete();
    },
    chnPhone() {
      this.activePhone = false;
      this.$vs.loading();
      db.collection("users")
        .doc(this.user.id)
        .update({
          phone: this.phone,
          updated_at: new Date(),
          updated_by: JSON.parse(localStorage.getItem("userInfo")).group,
        });
      setTimeout(() => {
        this.$vs.loading.close();
        this.$vs.notify({
          title: "Success",
          text: "Job Title is changed successfully!",
          iconPack: "feather",
          icon: "icon-check-circle",
          color: "success",
        });
      }, 1000);
    },
    chnJobTitle() {
      this.activeJob = false;
      this.$vs.loading();
      db.collection("users")
        .doc(this.user.id)
        .update({
          job_title: this.jobTitle,
          updated_at: new Date(),
          updated_by: JSON.parse(localStorage.getItem("userInfo")).group,
        });
      setTimeout(() => {
        this.$vs.loading.close();
        this.$vs.notify({
          title: "Success",
          text: "Job Title is changed successfully!",
          iconPack: "feather",
          icon: "icon-check-circle",
          color: "success",
        });
      }, 1000);
    },
    chnGroup() {
      var teams = [];
      this.group.map((item) => {
        teams.push(item.id);
      });
      this.$vs.loading();
      db.collection("users")
        .doc(this.user.id)
        .update({
          team: teams,
          updated_at: new Date(),
          updated_by: JSON.parse(localStorage.getItem("userInfo")).group,
        });
      setTimeout(() => {
        this.$vs.loading.close();
        this.$vs.notify({
          title: "Success",
          text: "Group is changed successfully!",
          iconPack: "feather",
          icon: "icon-check-circle",
          color: "success",
        });
      }, 1000);
    },
    chnLocation() {
      this.activeLocation = false;
      var location = [];
      this.location.map((item) => location.push(item.id));

      this.$vs.loading();
      db.collection("users").doc(this.user.id).update({ location: location });
      setTimeout(() => {
        this.$vs.loading.close();
        this.$vs.notify({
          title: "Success",
          text: "Location is changed successfully!",
          iconPack: "feather",
          icon: "icon-check-circle",
          color: "success",
        });
      }, 1000);
    },
  },

  created() {},
};
</script>

<style>
#teams .vx-card__footer {
  margin: 0;
  padding: 0.5rem !important;
  background: rgba(var(--vs-primary), 0.15);
  border-radius: 5px;
}
</style>
<style scoped>
.hover-pop {
  transition: all 0.25s ease;
}
.hover-pop:hover {
  display: inline-flex;
  transform: translateY(-4px) translateX(4px);
}
.title-text {
  color: #1e1c26;
  opacity: 0.54;
}
.title-content {
  color: #1e1c26;
}
.infor-item {
  border-bottom: 1px solid #1e1c261a;
}
</style>

