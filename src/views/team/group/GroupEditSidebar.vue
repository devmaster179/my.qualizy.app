<template>
  <vs-sidebar
    click-not-close
    position-right
    parent="body"
    default-index="1"
    color="primary"
    class="add-new-data-sidebar items-no-padding"
    spacer
    v-model="isSidebarActiveLocal"
  >
    <div class="mt-6 flex items-center justify-between px-6">
      <p class="text-2xl karla">{{title}}</p>
      <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>
    <div class="content p-4">
      <div class="team-name mb-2">
        <p class="karla text-base">{{$t("name")}}</p>
        <vs-input v-model="teamName" class="w-full" />
        <span
          class="text-danger text-sm"
          v-if="existError"
          style
        >{{$t("the team is already exist !")}}</span>
      </div>
      <div class="team-mates mb-2">
        <p class="karla text-base">{{$t("teammates")}}</p>
        <v-select v-model="mates" multiple :options="users" label="name" />
      </div>
      <div class="team-location mb-2">
        <p class="karla text-base">{{$t("locations")}}</p>
        <v-select v-model="teamLocation" multiple :options="locations" label="name" />
      </div>
      <div class="team-active mb-2">
        <vs-checkbox v-model="teamActive">{{$t("desactivate this team")}}</vs-checkbox>
      </div>
    </div>
    <div class="flex flex-wrap items-center justify-center p-6" slot="footer">
      <vs-button
        class="mr-6"
        :disabled="this.teamName.length<3 || existError"
        @click="saveAction"
      >{{$t("save") | capitalize}}</vs-button>
      <vs-button
        type="border"
        color="danger"
        @click="isSidebarActiveLocal = false"
      >{{$t("cancel") | capitalize}}</vs-button>
    </div>
  </vs-sidebar>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import vSelect from "vue-select";
import { db } from "@/firebase/firebaseConfig";
import firebase from "firebase/app";
import "@firebase/analytics";

export default {
  components: {
    VuePerfectScrollbar,
    vSelect
  },
  data() {
    return {
      mate1: [],
      teamName: "",
      teamLocation1: [],
      existError: false,
      teamActive: true
    };
  },
  props: {
    isSidebarActive: {
      type: Boolean
    },
    update: {
      type: Boolean,
      default: false
    },
    team: {
      type: Object
    }
  },
  methods: {
    clear() {
      this.teamName = "";
      this.mate1 = [];
      this.teamLocation1 = [];
    },
    getTeamID(updated_at) {
      return new Promise((resolve, reject) => {
        var id = "";
        var date = "";
        db.collection("teams")
          .where(
            "group",
            "==",
            JSON.parse(localStorage.getItem("userInfo")).group
          )
          .where("updated_at", "==", updated_at)
          .onSnapshot({ includeMetadataChanges: true }, snapshot => {
            snapshot.docChanges().forEach(change => {
              if (change.type === "added") {
                id = change.doc.id;
              }
            });
            if (id != "") resolve(id);
          });
      });
    },
    async save() {
      var updated_at = new Date();
      this.$vs.loading();
      db.collection("teams").add({
        name: this.teamName,
        location: this.teamLocation1,
        active: this.teamActive,
        group: JSON.parse(localStorage.getItem("userInfo")).group,
        created_at: updated_at,
        created_by: JSON.parse(localStorage.getItem("userInfo")).id,
        updated_at: updated_at,
        updated_by: JSON.parse(localStorage.getItem("userInfo")).id
      });
      this.getTeamID(updated_at).then(id => {
        this.$vs.loading.close();
        this.$vs.notify({
          time: 8000,
          title: "Success",
          text: "A team is created successfully !",
          iconPack: "feather",
          icon: "icon-check-circle",
          color: "success"
        });
        

        this.$userflow.track("Add New Team" , {
          name: this.teamName,
          group: JSON.parse(localStorage.getItem("userInfo")).group
        })

        this.mate1.map(item => {
          let user = this.$store.getters["app/getUserById"](item);
          if (user == undefined) return;
          let teams = JSON.parse(JSON.stringify(user)).team;
          if (!Array.isArray(teams)) teams = [];
          teams.push(id);
          db.collection("users")
            .doc(item)
            .update({
              team: teams
            });
        });

        firebase.analytics().logEvent("Added a group", {
          group: JSON.parse(localStorage.getItem("userInfo")).group,
          id: id
        });
        this.$intercom.trackEvent("Added a group", {
          group: JSON.parse(localStorage.getItem("userInfo")).group,
          id: id
        });
        this.clear();
        this.isSidebarActiveLocal = false;
      });
    },
    updateTeam() {
      db.collection("teams")
        .doc(this.team.id)
        .update({
          name: this.teamName,
          location: this.teamLocation1,
          active: this.teamActive,
          updated_by: JSON.parse(localStorage.getItem("userInfo")).id,
          updated_at: new Date()
        });
      let users = this.users;
      users.map(user => {
        if (this.mate1.indexOf(user.id) > -1) {
          if (user.team.indexOf(this.team.id) < 0) {
            let teams = JSON.parse(JSON.stringify(user.team));
            teams.push(this.team.id);
            db.collection("users")
              .doc(user.id)
              .update({
                team: teams
              });
          }
        } else {
          if (user.team.indexOf(this.team.id) > -1) {
            let teams = JSON.parse(JSON.stringify(user)).team.filter(
              item => item != this.team.id
            );
            db.collection("users")
              .doc(user.id)
              .update({
                team: teams
              });
          }
        }
      });
      setTimeout(() => {
        this.$vs.notify({
          time: 8000,
          title: "Success",
          text: "The team is updated successfully !",
          iconPack: "feather",
          icon: "icon-check-circle",
          color: "success"
        });
      }, 100);
      this.isSidebarActiveLocal = false;
    },
    saveAction() {
      if (!this.update) this.save();
      else this.updateTeam();
    }
  },
  computed: {
    teamLocation: {
      get() {
        let locations = [];
        this.teamLocation1.map(item => {
          let location = this.$store.getters["app/getLocationById"](item);
          if (location === undefined) return;
          locations.push(location);
        });
        return locations;
      },
      set(val) {
        this.teamLocation1 = [];
        val.map(item => {
          this.teamLocation1.push(item.id);
        });
      }
    },
    locations() {
      let locations = this.$store.getters["app/locations"].filter(item => {
        return item.active && !item.deleted;
      });
      return locations;
    },
    mates: {
      get() {
        let users = [];
        this.mate1.map(item => {
          let user = this.$store.getters["app/getUserById"](item);
          if (user === undefined) return;
          users.push(user);
        });
        return users;
      },
      set(val) {
        this.mate1 = [];
        val.map(item => {
          this.mate1.push(item.id);
        });
      }
    },
    teams() {
      return this.$store.getters["app/teams"].filter(item => item.active);
    },
    users() {
      let users = this.$store.getters["app/users"];
      return users.filter(item => item.deleted !== true);
    },
    title() {
      if (!this.update) return this.$t("add team");
      return this.$t("update team") + ` (${this.team.name})`;
    },
    isSidebarActiveLocal: {
      get() {
        return this.isSidebarActive;
      },
      set() {
        this.$emit("close");
      }
    }
  },
  watch: {
    teamName(val) {
      if (!this.update) {
        if (
          this.teams.find(
            item => item.name.toLowerCase() == val.toLowerCase()
          ) !== undefined
        )
          this.existError = true;
        else this.existError = false;
      }
    },
    isSidebarActive(val) {
      if (val) {
        if (this.update) {
          this.teamLocation1 =
            this.team.location !== undefined &&
            Array.isArray(this.team.location)
              ? this.team.location
              : [];
          let users = this.$store.getters["app/users"].filter(
            user => user.team.indexOf(this.team.id) > -1
          );
          this.mate1 = [];
          users.map(item => this.mate1.push(item.id));
          this.teamName = this.team.name;
          this.teamActive = this.team.active;
        }
      }
    }
  }
};
</script>


<style lang="scss" scoped>
.add-new-data-sidebar {
  /deep/ .vs-sidebar--background {
    z-index: 52010;
  }

  /deep/ .vs-sidebar {
    z-index: 52010;
    width: 500px;
    max-width: 100vw;

    .img-upload {
      margin-top: 2rem;

      .con-img-upload {
        padding: 0;
      }

      .con-input-upload {
        width: 100%;
        margin: 0;
      }
    }
  }

  ul {
    border-left-width: 3px;
    border-left-style: dashed;
    border-left-color: rgba(var(--vs-primary), 1);
  }
  li {
    padding: 20px 0;
  }
  .active {
    background-color: #7367f024;
  }
}

.scroll-area--log-filter {
  height: calc(100% - 4.3rem);
}
.w-300 {
  width: 170px;
  z-index: 420000;
}
.holamundo {
  min-height: 50%;
}
</style>
