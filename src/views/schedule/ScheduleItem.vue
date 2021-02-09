<template>
  <div
    class="mail__mail-item px-4 py-6 'mail__opened-mail"
    v-if="Object.keys(templateInfo(schedule.template)).length > 0"
  >
    <div class="vx-row">
      <div
        class="vx-col w-full sm:w-10/12 flex sm:items-center sm:flex-row flex-col flex-wrap"
      >
        <div class="flex items-center">
          <vs-avatar
            class="sender__avatar flex-shrink-0 mr-3 border-2 border-solid border-white"
            :src="
              applyImage(templateInfo(schedule.template).content.templateImage)
            "
            size="40px"
          ></vs-avatar>
          <h5 class="mb-1 mr-4 templateTitle">
            {{ templateInfo(schedule.template).content.templateTitle }} -
            {{ $t(schedule._repeat) }}
          </h5>
        </div>
        <div class="todo-tags sm:ml-2 sm:my-0 my-2 flex flex-wrap">
          <vs-chip v-for="(user, index) in schedule.assign" :key="index">
            <div
              class="h-2 w-2 rounded-full mr-1"
              :class="
                userInfo(user) !== undefined && userInfo(user).active
                  ? 'bg-success'
                  : 'bg-warning'
              "
            ></div>
            <span style v-if="userInfo(user) !== undefined">{{
              userInfo(user).name | capitalize
            }}</span>
          </vs-chip>
        </div>
      </div>
      <div class="vx-col w-full sm:w-2/12 ml-auto flex justify-end text-right">
        <vs-switch
          @click.stop="chnActive"
          :disabled="role > 2"
          v-model="active"
          class="ml-4 mt-1"
        />
        <vs-icon
          icon-pack="feather"
          v-if="role < 2"
          icon="icon-trash-2"
          size="22px"
          @click.stop.native="deleteSchedule()"
          class="ml-4 mt-1"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "../../firebase/firebaseConfig";

export default {
  props: {
    schedule: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      active: true,
      user: [],
    };
  },
  watch: {},
  computed: {
    role() {
      var cUser = this.$store.getters["app/currentUser"];
      if (cUser == undefined || cUser.role == undefined) return 5;
      return cUser.role.key;
    },
    userInfo() {
      return (id) => {
        return this.$store.getters["app/getTeamById"](id);
      };
    },
    templateInfo() {
      return (id) => {
        return this.$store.getters["app/getTemplateById"](id);
      };
    },
  },
  created() {
    this.active = this.schedule.active;
  },
  methods: {
    applyImage(image) {
      if (image.indexOf("firebasestorage") > -1) {
        return image;
      }
      return require(`@/assets/images/template_image/${image}`);
    },
    chnActive() {
      this.$vs.loading();
      db.collection("schedules").doc(this.schedule.id).update({
        active: !this.active,
      });
      setTimeout(() => {
        this.$vs.loading.close();
        this.$vs.notify({
          time: 7000,
          title: "Success",
          text: "Status is changed successfully!",
          iconPack: "feather",
          icon: "icon-check-circle",
          color: "success",
        });
      }, 1000);
    },
    deleteSchedule() {
      db.collection("schedules").doc(this.schedule.id).update({
        deleted: true,
      });
    },
  },
};
</script>
<style scoped>
/* .templateTitle{
        float: left;
    } */
/* @media (max-width: 576px){
        .templateTitle{
            float: unset;
        }
    }
    .truncate{
        width: 300px;
    } */
</style>