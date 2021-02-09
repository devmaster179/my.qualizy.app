<template>
  <tr v-if="Object.keys(schedule).length > 0">
    <td>
      <div class="flex items-center">
        <img
          :src="applyImage(template.content.templateImage)"
          class="rouned-full mr-2"
          width="50"
          height="50"
        />
        <div>
          <p class="karla-bold text-sm color-my-black">
            {{
              template.content.templateTitle == ""
                ? $t("template name")
                : template.content.templateTitle
            }}
          </p>
          <span
            class="karla-bold text-xs color-my-black"
            style="opacity: 0.54"
            >{{
              template.content.templateComment == ""
                ? $t("+ Add comment")
                : template.content.templateComment
            }}</span
          >
        </div>
      </div>
    </td>
    <td>
      <div class="inline-block items-center">
        <div
          class="bg-clip py-2 px-3 rounded-lg ml-2 inline-block"
          v-if="schedule.location"
        >
          <vs-icon icon-pack="feather" icon="icon-map-pin" class="mr-1" />
          <span class="karla item-text">{{ locaionInfo }}</span>
        </div>
      </div>
    </td>
    <td>
      <div class="inline-block items-center">
        <div
          class="bg-clip py-2 px-3 rounded-lg ml-2 inline-block"
          v-for="(team, i) in teams"
          :class="{ hidden: i != 0 }"
          :key="i"
        >
          <vs-icon icon-pack="feather" icon="icon-users" class="mr-1" />
          <span class="karla item-text">{{ team.name }}</span>
        </div>

        <vs-dropdown
          v-if="teams.length > 1"
          vs-custom-content
          class="cursor-pointer mr-4"
          vs-trigger-click
        >
          <p
            class="karla bg-clip py-2 px-3 rounded-lg ml-2 inline-block cursor-pointer item-text items-center"
          >
            +{{ teams.length - 1 }}
          </p>
          <vs-dropdown-menu class="vx-navbar-dropdown">
            <ul style="min-width: 9rem" class="p-0">
              <li
                class="flex items-center py-1 px-2 my-1 cursor-pointer"
                v-for="(team, lIndex) in teams"
                :key="lIndex"
              >
                <template>
                  <vs-icon icon-pack="feather" icon="icon-users" class="mr-1" />
                  <span class="ml-2 karla">{{ team.name }}</span>
                </template>
              </li>
            </ul>
          </vs-dropdown-menu>
        </vs-dropdown>
      </div>
    </td>
    <td>
      <div class="inline-block items-center">
        <div
          class="bg-clip py-2 px-3 rounded-lg ml-2 inline-block"
          v-for="(team, i) in monitors"
          :class="{ hidden: i != 0 }"
          :key="i"
        >
          <vs-icon icon-pack="feather" icon="icon-users" class="mr-1" />
          <span class="karla item-text">{{ team.name }}</span>
        </div>

        <vs-dropdown
          v-if="monitors.length > 1"
          vs-custom-content
          class="cursor-pointer mr-4"
          vs-trigger-click
        >
          <p
            class="karla bg-clip py-2 px-3 rounded-lg ml-2 inline-block cursor-pointer item-text items-center"
          >
            +{{ teams.length - 1 }}
          </p>
          <vs-dropdown-menu class="vx-navbar-dropdown">
            <ul style="min-width: 9rem" class="p-0">
              <li
                class="flex items-center py-1 px-2 my-1 cursor-pointer"
                v-for="(team, lIndex) in teams"
                :key="lIndex"
              >
                <template>
                  <vs-icon icon-pack="feather" icon="icon-users" class="mr-1" />
                  <span class="ml-2 karla">{{ team.name }}</span>
                </template>
              </li>
            </ul>
          </vs-dropdown-menu>
        </vs-dropdown>
      </div>
    </td>
    <td>
      <div class="flex items-center justify-end">
        <feather-icon
          v-if="role < 3"
          @click="editSchedule"
          icon="Edit2Icon"
          style="width: 20px; height: 20px"
          class="cursor-pointer hover:text-primary mr-4"
        />
        <feather-icon
          v-if="role < 2"
          @click="deleteSchedule"
          icon="Trash2Icon"
          style="width: 20px; height: 20px"
          class="cursor-pointer hover:text-danger mr-4"
        />
      </div>
    </td>
  </tr>
</template>

<script>
export default {
  props: {
    schedule: {
      type: Object,
      default: {},
    },
  },
  computed: {
    locaionInfo() {
      let location = this.$store.getters["app/getLocationById"](
        this.schedule.location[0]
      );
      if (!location || location.deleted) return "";
      return location.name;
    },
    role() {
      var cUser = this.$store.getters["app/currentUser"];
      if (cUser == undefined || cUser.role === undefined) {
        return 4;
      }
      return cUser.role.key;
    },
    template() {
      return this.$store.getters["app/getTemplateById"](this.schedule.template);
    },

    monitors() {
      let teamIDs = this.schedule.monitor || [];
      var teams = [];
      teamIDs.map((item) => {
        let team = this.$store.getters["app/getTeamById"](item);
        if (team !== undefined) teams.push(team);
      });
      return teams;
    },
    teams() {
      let teamIDs = this.schedule.assign;
      var teams = [];
      teamIDs.map((item) => {
        let team = this.$store.getters["app/getTeamById"](item);
        if (team !== undefined) teams.push(team);
      });
      return teams;
    },
  },
  methods: {
    applyImage(image) {
      if (image.indexOf("firebasestorage") > -1) {
        return image;
      }
      return require(`@/assets/images/template_image/${image}`);
    },
    editSchedule() {
      this.$emit("edit", this.schedule.id);
    },
    deleteSchedule() {
      this.$emit("delete", this.schedule.id);
    },
  },
};
</script>

<style scoped>
.bg-clip {
  background: #ebebf1;
}
</style>