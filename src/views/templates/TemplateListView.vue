<template>
  <tr>
    <td>
      <div class="flex items-center">
        <img
          :src="applyImage(template.content.templateImage)"
          class="rouned-full mr-2"
          width="50"
          style="border-radius: 50%"
        />
        <div>
          <p class="template-name karla-bold">
            {{
              template.content.templateTitle == ""
                ? $t("template name")
                : template.content.templateTitle
            }}
          </p>
          <span class="note">{{
            template.content.templateComment == ""
              ? $t("+ Add comment")
              : template.content.templateComment
          }}</span>
        </div>
      </div>
    </td>

    <td>
      <div class="inline-block items-center">
        <div
          class="bg-clip py-2 px-3 rounded-lg inline-block"
          v-for="(location, i) in locations"
          :class="{ hidden: getLocation(location) === undefined || i != 0 }"
          :key="i"
        >
          <vs-icon icon-pack="feather" icon="icon-map-pin" class="mr-1" />
          <span class="karla item-text">{{ getLocation(location).name }}</span>
        </div>

        <vs-dropdown
          v-if="locations.length > 1"
          vs-custom-content
          class="cursor-pointer mr-4"
          vs-trigger-click
        >
          <p
            class="bg-clip py-2 px-3 rounded-lg ml-2 inline-block cursor-pointer"
          >
            +{{ locations.length - 1 }}
          </p>
          <vs-dropdown-menu class="vx-navbar-dropdown">
            <div class="bg-white" style="min-width: 20rem">
              <div
                class="inline-block bg-clip py-2 px-3 rounded-lg ml-2 mb-1 cursor-pointer"
                v-for="(location, lIndex) in locations"
                :key="lIndex"
              >
                <vs-icon icon-pack="feather" icon="icon-map-pin" class="mr-1" />
                <span class="ml-2 karla">{{ getLocation(location).name }}</span>
              </div>
            </div>
          </vs-dropdown-menu>
        </vs-dropdown>
      </div>
    </td>
    <td>
      <div class="inline-block items-center">
        <div
          class="bg-clip py-2 px-3 rounded-lg ml-2 inline-block"
          v-for="(tag, i) in tags"
          :class="{ hidden: getTag(tag) === undefined || i != 0 }"
          :key="i"
        >
          <template v-if="getTag(tag) !== undefined">
            <div
              class="h-2 w-2 rounded-full mr-1 inline-block"
              :style="`background:${getTag(tag).color}`"
            ></div>
            <span class="karla item-text">{{ getTag(tag).name }}</span>
          </template>
        </div>
        <vs-dropdown
          vs-custom-content
          class="cursor-pointer mr-4"
          vs-trigger-click
          v-if="tags.length > 1"
        >
          <p
            class="karla item-text flex items-center bg-clip py-2 px-3 rounded-lg ml-2 cursor-pointer"
          >
            +{{ tags.length - 1 }}
          </p>
          <vs-dropdown-menu class="vx-navbar-dropdown">
            <div class="bg-white" style="min-width: 20rem">
              <div
                class="inline-block bg-clip py-2 px-3 rounded-lg ml-2 cursor-pointer mb-2"
                v-for="(tag, tIndex) in tags"
                :key="tIndex"
              >
                <div
                  class="h-2 w-2 rounded-full inline-block"
                  :style="`background: ${getTag(tag).color};`"
                ></div>
                <span class="ml-2 karla">{{ getTag(tag).name }}</span>
              </div>
            </div>
          </vs-dropdown-menu>
        </vs-dropdown>
      </div>
    </td>
    <td>
      <vs-icon
        icon-pack="feather"
        icon="icon-calendar"
        size="25px"
        v-if="template.content.templateSD == 'schedule this template'"
      />
      <vs-icon
        icon-pack="feather"
        icon="icon-clipboard"
        size="25px"
        v-else-if="template.content.templateSD == 'bookmarked'"
      />
      <vs-icon
        icon-pack="feather"
        icon="icon-alert-octagon"
        size="25px"
        v-else
      />
    </td>
    <td style="text-align: center">
      <vs-dropdown
        vs-custom-content
        class="cursor-pointer mr-4"
        vs-trigger-click
      >
        <feather-icon
          icon="MoreVerticalIcon"
          class="p-2 cursor-pointer"
          style="height: 2.6rem"
        />
        <vs-dropdown-menu class="vx-navbar-dropdown">
          <ul style="min-width: 9rem" class="p-0">
            <li
              class="flex py-1 px-2 my-1 cursor-pointer hover:bg-primary hover:text-white"
              v-if="template.content.templateSD == 'schedule this template'"
              @click="$emit('schedule', template.id)"
            >
              <feather-icon
                icon="CalendarIcon"
                svgClasses="w-4 h-4"
              ></feather-icon>
              <span class="ml-2 karla">{{ $t("new schedule") }}</span>
            </li>
            <li
              class="flex py-1 px-2 my-1 cursor-pointer hover:bg-primary hover:text-white"
              @click="editTemplate"
            >
              <feather-icon
                icon="Edit2Icon"
                svgClasses="w-4 h-4"
              ></feather-icon>
              <span class="ml-2 karla">{{ $t("edit") }}</span>
            </li>
            <li
              class="flex py-1 px-2 my-1 cursor-pointer hover:bg-primary hover:text-white"
              @click="duplicateTemplate"
            >
              <feather-icon icon="CopyIcon" svgClasses="w-4 h-4"></feather-icon>
              <span class="ml-2 karla">{{ $t("duplicate") }}</span>
            </li>

            <li
              class="flex py-1 px-2 my-1 cursor-pointer hover:bg-primary hover:text-white"
              @click="deleteTemplate1"
            >
              <feather-icon
                icon="Trash2Icon"
                svgClasses="w-4 h-4"
              ></feather-icon>
              <span class="ml-2 karla">{{ $t("delete") }}</span>
            </li>
          </ul>
        </vs-dropdown-menu>
      </vs-dropdown>
      <feather-icon
        :svgClasses="[{ 'text-primary fill-current': template.starred }]"
        icon="BookmarkIcon"
        class="p-2"
        :class="{ 'cursor-pointer': role < 3 }"
        style="height: 2.6rem"
        @click="stared"
      />
    </td>
    <!-- <templatemaking-popup
      :open="activeCreateTemplate"
      @close="activeCreateTemplate=false"
      :state="templateState"
      :update="template.id"
    />-->
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
        <p class="karla-bold text-2xl color-my-black text-center pt-base">
          {{ $t("you are about to delete template") }}
        </p>
        <p class="karla-bold text-sm text-center mt-4">
          {{ $t("this will delete your") }} &#10077;{{
            template.content.templateTitle
          }}&#10078; {{ $t("template") }}
        </p>
        <p class="karla-bold text-sm text-center">
          {{ $t("are you sure to delete ?") }}
        </p>
        <div class="flex items-center justify-center mt-base">
          <vs-button class="ml-2" color="danger" @click="deleteTemplate">
            <span class="karla">{{ $t("yes, delete templete") }}</span>
          </vs-button>
          <vs-button
            @click="deletePrompt = false"
            color="rgba(108, 80, 240, 0.1)"
            text-color="rgba(108, 80, 240)"
            class="kalar ml-2"
          >
            <span class="karla">{{ $t("cancel, keep templete") }}</span>
          </vs-button>
        </div>
      </div>
    </vs-popup>
  </tr>
</template>

<script>
import { db } from "@/firebase/firebaseConfig";
// import TemplatemakingPopup from "../template-making/TemplatemakingPopup";
export default {
  props: {
    template: {
      type: Object,
    },
  },
  components: {
    // TemplatemakingPopup
  },
  data() {
    return {
      templateState: "",
      deletePrompt: false,
    };
  },
  computed: {
    auth() {
      return (sub, action) => {
        let authList = this.$store.getters["app/auth"];
        var cUser = this.$store.getters["app/currentUser"];
        if (cUser == undefined || cUser.role == undefined) return false;
        else if (cUser.role.key == 0) return true;
        else if (authList[sub][cUser.role.name.toLowerCase()][action])
          return true;
        else return false;
      };
    },
    role() {
      var cUser = this.$store.getters["app/currentUser"];
      if (cUser == undefined || cUser.role === undefined) {
        return 4;
      }
      return cUser.role.key;
    },
    locations() {
      let locations =
        this.template.content.location === undefined
          ? []
          : this.template.content.location;
      var __locations = [];
      locations.map((item) => {
        let location = this.$store.getters["app/getLocationById"](item);
        if (location == undefined || location.deleted) return;
        __locations.push(item);
      });
      return __locations;
    },
    getLocation() {
      return (id) => {
        return this.$store.getters["app/getLocationById"](id);
      };
    },
    tags() {
      let tags =
        this.template.content.templateLabel === undefined
          ? []
          : this.template.content.templateLabel;
      var __tags = [];
      tags.map((item) => {
        var tag = this.getTag(item);
        if (tag === undefined || tag.group == "global") return;
        __tags.push(item);
      });
      return __tags;
    },
    getTag() {
      return (id) => {
        return this.$store.getters["app/getLabelById"](id);
      };
    },
  },
  methods: {
    applyImage(image) {
      if (image.indexOf("firebasestorage") > -1) {
        return image;
      }
      return require(`@/assets/images/template_image/${image}`);
    },
    roleError(sub, action) {
      this.$vs.notify({
        time: 5000,
        title: "Authorization Error",
        text: `You don't have authorization to ${action} for ${sub}.\n Please contact with your super admin`,
        color: "danger",
        iconPack: "feather",
        icon: "icon-lock",
      });
    },
    deleteTemplate1() {
      if (!this.auth("templates", "delete")) {
        this.roleError("templates", "delete");
        return false;
      }
      this.deletePrompt = true;
    },
    deleteTemplate() {
      this.deletePrompt = false;
      this.$vs.loading();
      db.collection("templates").doc(this.template.id).update({
        trashed: true,
      });
      setTimeout(() => {
        this.$vs.loading.close();
        this.$vs.notify({
          time: 7000,
          title: "Success",
          text: "Template have been deleted!",
          iconPack: "feather",
          icon: "icon-alert-circle",
          color: "success",
        });
      }, 1000);
    },
    acceptDelete() {},
    editTemplate() {
      if (!this.auth("templates", "edit")) {
        this.roleError("templates", "edit");
        return false;
      }
      this.templateState = "update template";
      var pages = [];
      var questions;
      var answers;
      var loged = "";
      this.template.content.pages.map((page) => {
        questions = [];
        page.questions.map((question) => {
          answers = [];
          question.answers.map((answer) => {
            let type = this.$store.getters["app/getTemplateTypeById"](
              answer.type.id
            );
            if (type === undefined) return;
            loged = "";
            if (type.content == "photo" || type.content == "receipts")
              loged = [];
            else if (type.content == "score") loged = 0;
            else if (type.content == "automatic date and time stamp")
              loged = new Date();
            var answerObject = {
              title: answer.title,
              type: answer.type,
              action: Array.isArray(answer.action) ? answer.action : [],
              mandatory: answer.mandatory,
              loged: loged,
              score: answer.score === undefined ? "" : answer.score,
            };
            answers.push(answerObject);
          });
          questions.push({
            title: question.title,
            answers: answers,
          });
        });
        pages.push({
          title: page.title,
          questions: questions,
        });
      });
      let tempTemplate = {
        content: {
          teams: this.template.content.teams || [],
          location: this.template.content.location || [],
          templateTitle: this.template.content.templateTitle,
          templateComment: this.template.content.templateComment,
          templateImage: this.template.content.templateImage,
          templateLabel: this.template.content.templateLabel,
          templateSD: this.template.content.templateSD,
          pages: pages,
        },
      };
      this.$store.commit("app/SET_EDIT_ANSWER_INDEXES", {
        page: 0,
        question: 0,
        answer: 0,
      });
      this.$store.commit("app/SET_TEMPTEMPLATE", JSON.stringify(tempTemplate));
      this.$router.push({
        name: "template-edit",
        params: { id: this.template.id, state: "update" },
      });
    },
    duplicateTemplate() {
      if (!this.auth("templates", "create")) {
        this.roleError("templates", "create");
        return false;
      }
      this.templateState = "duplicate template";
      var pages = [];
      var questions;
      var answers;
      var loged = "";
      this.template.content.pages.map((page) => {
        questions = [];
        page.questions.map((question) => {
          answers = [];
          question.answers.map((answer) => {
            let type = this.$store.getters["app/getTemplateTypeById"](
              answer.type.id
            );
            if (type === undefined) return;
            loged = "";
            if (type.content == "photo" || type.content == "receipts")
              loged = [];
            else if (type.content == "score") loged = 0;
            answers.push({
              title: answer.title,
              type: answer.type,
              action: answer.action,
              mandatory: answer.mandatory,
              score:
                answer.score === undefined || !Array.isArray(answer.score)
                  ? []
                  : answer.score,
              loged: loged,
            });
          });
          questions.push({
            title: question.title,
            answers: answers,
          });
        });
        pages.push({
          title: page.title,
          questions: questions,
        });
      });
      let tempTemplate = {
        content: {
          teams: this.template.content.teams || [],
          location: this.template.content.location,
          templateTitle: this.template.content.templateTitle,
          templateComment: this.template.content.templateComment,
          templateImage: this.template.content.templateImage,
          templateLabel: this.template.content.templateLabel,
          templateSD: this.template.content.templateSD,
          pages: pages,
        },
      };
      this.$store.commit("app/SET_TEMPTEMPLATE", JSON.stringify(tempTemplate));
      this.$router.push({
        name: "template-edit",
        params: { id: this.template.id, state: "duplicate" },
      });
    },
    stared() {
      if (!this.auth("templates", "edit")) {
        this.roleError("templates", "edit");
        return false;
      }
      var star = true;
      if (this.template.starred !== undefined) star = !this.template.starred;
      db.collection("templates").doc(this.template.id).update({
        starred: star,
      });
    },
  },
};
</script>

<style scoped>
.bg-clip {
  background: #ebebf1;
}
.template-name {
  font-size: 14px;
}
.note {
  font-size: 12px;
}
</style>