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
      <h4>{{$t("edit user") | capitalize}}({{user.name | capitalize}})</h4>
      <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>
    <VuePerfectScrollbar class="scroll-area--log-filter pt-4 pb-6" :settings="settings">
      <div class="vs-row">
        <div class="vx-col px-base mb-4 mt-base">
          <h5 class="mb-0">{{$t("name") | capitalize}}</h5>

          <vs-input
            class="w-full"
            v-validate="'required|min:3'"
            name="name"
            placeholder="Name"
            v-model="userName"
          />
          <span class="text-danger text-sm">{{ errors.first('name') }}</span>
        </div>
        <div class="vx-col px-base mb-4 mt-base">
          <h5 class="mb-0">{{$t("job title") | capitalize}}</h5>
          <vs-input class="w-full" placeholder="Job Title" v-model="job_title" />
        </div>
        <div class="vx-col px-base mb-4">
          <h5 class="mb-0">{{$t("location") | capitalize}}</h5>
          <v-select label="name" multiple v-model="location" :options="locations" />
        </div>
        <div class="vx-col px-base mb-4">
          <h5 class="mb-0">{{$t("teams") | capitalize}}</h5>
          <v-select label="name" multiple v-model="team" :options="teams" />
        </div>
        <div class="vx-col px-base mb-4">
          <h5 class="mb-0">{{$t("role") | capitalize}}</h5>
          <v-select label="name" v-model="role" :options="roles" />
        </div>
        <div class="vx-col px-base mb-4">
          <vs-checkbox v-model="status">{{$t("desactivate this user") | capitalize}}</vs-checkbox>
        </div>
      </div>
    </VuePerfectScrollbar>
    <div class="flex flex-wrap items-center justify-center p-6" slot="footer">
      <vs-button
        class="mr-6"
        :disabled="this.errors.any() || this.userName == ''"
        @click="save"
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

export default {
  components: {
    VuePerfectScrollbar,
    vSelect,
  },
  data() {
    return {
      status: false,
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
      location: "",
      job_title: "",
      userName: "",
      team: [],
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.6,
      },
    };
  },
  props: {
    user: {
      type: Object,
    },
    isSidebarActive: {
      type: Boolean,
    },
  },
  watch: {
    isSidebarActive(val) {
      if (val) {
        this.userName = this.user.name;
        this.job_title = this.user.job_title;
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
        this.team = [];
        this.user.team.map((item) => {
          var team = this.$store.getters["app/getTeamById"](item);
          if (
            team === undefined ||
            !team.active ||
            (team.deleted !== undefined && team.deleted)
          )
            return;
          else this.team.push(team);
        });

        this.role = "";

        if (this.user.role !== undefined) this.role = this.user.role;
        if (this.user.status === undefined) this.status = true;
        else this.status = this.user.status;
      }
    },
  },
  methods: {
    save() {
      this.isSidebarActiveLocal = false;
      this.$vs.loading();
      // var location = this.location == "" ? "" : this.location.id;
      var location = [];
      this.location.map((item) => location.push(item.id));

      var teams = [];
      this.team.map((item) => teams.push(item.id));
      db.collection("users").doc(this.user.id).update({
        name: this.userName,
        job_title: this.job_title,
        location: location,
        team: teams,
        role: this.role,
        status: this.status,
      });
      setTimeout(() => {
        this.$vs.loading.close();
        this.$vs.notify({
          time: 7000,
          title: "Success in updating",
          text: "User is updated succefully",
          iconPack: "feather",
          icon: "icon-check-circle",
          color: "success",
        });
      }, 1000);
    },
  },
  computed: {
    locations() {
      return this.$store.getters["app/locations"].filter(
        (item) => item.active && !item.deleted
      );
    },
    teams() {
      return this.$store.getters["app/teams"].filter(
        (item) => item.active && !item.deleted
      );
    },
    isSidebarActiveLocal: {
      get() {
        return this.isSidebarActive;
      },
      set(val) {
        if (!val) this.$emit("closeSidebar");
      },
    },
  },
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
