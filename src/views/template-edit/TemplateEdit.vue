<template>
  <div id="template-edit" v-if="template.content!==undefined" style="margin-right:385px;">
    <div class="page-header flex items-center justify-between">
      <div class="page-title flex items-center">
        <p
          class="main-title karla-bold mr-2 cursor-pointer"
          @click="$router.push('/templates')"
        >{{$t("templates")}} ></p>
        <p class="sub-title karla-bold">{{$t(pageTitle)}}</p>
      </div>
      <div class="page-action flex items-center">
        <vs-icon
          color="primary"
          icon="undo"
          size="20px"
          class="ml-2 rounded-lg d-theme-dark-bg cursor-pointer"
          :class="{'disableIcon':!canUndo}"
          style="height:40px; width:40px; padding:.7rem"
          @click="undo"
        />
        <vs-icon
          color="primary"
          icon="redo"
          size="20px"
          class="ml-2 rounded-lg d-theme-dark-bg cursor-pointer"
          :class="{'disableIcon':!canRedo}"
          style="height:40px; width:40px; padding:.7rem"
          @click="redo"
        />

        <vs-button class="ml-2" @click.stop="saveTemplate">
          <span class="karla save-text">{{$t("save")}}</span>
        </vs-button>
      </div>
    </div>
    <VuePerfectScrollbar
      class="scroll-area--data-list-add-new mt-base pr-3 pb-6"
      :settings="settings"
    >
      <div class="template-content">
        <div class="template-header">
          <vx-card>
            <div slot="no-body" class="p-4">
              <div class="template-title flex items-start justify-between">
                <div class="template-name-section flex items-start w-full">
                  <img
                    :src="require(`@/assets/images/template_image/${template.content.templateImage}`)"
                    style="width:48px; height:48px;"
                  />
                  <div class="ml-2 w-full">
                    <vs-input
                      @focus="editTemplateName=true, $event.target.select()"
                      @blur="editTemplateName=false"
                      v-model="templateTitle"
                      :class="{'vs-input-no-border':!editTemplateName}"
                      class="vs-input-no-shdow-focus edit-component w-full"
                      size="large"
                      :placeholder="$t('Untitled Template')"
                    />
                    <vs-textarea
                      @focus="kkk"
                      ref="templateComment"
                      @blur="editTemplateComment=false"
                      :class="{'vs-area-no-border': !editTemplateComment}"
                      :placeholder="$t('+ Add comment')"
                      v-model="templateComment"
                      class="edit-component vs-area-no-shdow-focus"
                      style="margin-top: -3px;"
                    />
                  </div>
                </div>
                <div class="template-title-action flex items-center" style="margin-top:5px;">
                  <vs-icon
                    v-if="template.content.templateSD=='bookmarked'"
                    icon-pack="feather"
                    size="20px"
                    icon="icon-clipboard"
                    class="mx-4"
                  />
                  <vs-icon
                    v-else
                    icon-pack="feather"
                    size="20px"
                    icon="icon-calendar"
                    class="mx-4"
                  />
                  <feather-icon
                    icon="Edit2Icon"
                    class="cursor-pointer hover:text-primary"
                    style="width:20px; height:20px;"
                    @click="activeCreateTemplate=true"
                  />
                  <!-- <vs-icon icon-pack="feather" size="20px" icon="icon-edit-2" /> -->
                </div>
              </div>
              <div class="template-locations">
                <div
                  class="tag-item inline-block ml-2"
                  v-for="(location,index) in template.content.location"
                  :key="index"
                  :class="{'hidden':locationInfo(location)===undefined || locationInfo(location).deleted}"
                >
                  <div v-if="locationInfo(location)!==undefined || locationInfo(location).deleted" class="flex items-center">
                    <vs-icon
                      size="10px"
                      icon-pack="feather"
                      icon="icon-map-pin"
                      class="mr-1"
                      style="padding-top:1px;"
                    />
                    <span class="karla map-text">{{locationInfo(location).name}}</span>
                  </div>
                </div>
              </div>
              <div class="template-tags mt-4">
                <div
                  class="tag-item inline-block ml-2"
                  v-for="(tag,index) in template.content.templateLabel"
                  :key="index"
                  :class="{'hidden':tagInfo(tag)===undefined}"
                >
                  <div v-if="tagInfo(tag)!==undefined" class="flex items-center">
                    <div
                      class="h-2 w-2 rounded-full mr-1"
                      :style="`background: ${tagInfo(tag).color};`"
                    ></div>
                    <span class="karla map-text">{{tagInfo(tag).name}}</span>
                  </div>
                </div>
              </div>
            </div>
          </vx-card>
        </div>
        <div
          class="template-pages mt-4"
          v-for="(page,index) in template.content.pages"
          :key="index"
        >
          <page-edit :page="index" />
        </div>
        <div class="page-add-section my-4">
          <span
            @click="addPage"
            class="karla-bold text-primary text-sm cursor-pointer hover:underline"
          >{{$t("add page")}}</span>
        </div>
      </div>
    </VuePerfectScrollbar>
    <log-preview />
    <templatemaking-popup
      :open="activeCreateTemplate"
      @close="activeCreateTemplate=false"
      :state="templateState"
      :showCreat="false"
    />
  </div>
</template>

<script>
import TemplatemakingPopup from "../template-making/TemplatemakingPopup";

import VuePerfectScrollbar from "vue-perfect-scrollbar";
import PageEdit from "./PageEdit.vue";
import LogPreview from "./LogPreview";
import { db } from "@/firebase/firebaseConfig";

import firebase from "firebase/app";
import "@firebase/firestore";

export default {
  components: {
    PageEdit,
    LogPreview,
    VuePerfectScrollbar,
    TemplatemakingPopup
  },
  data() {
    return {
      activeCreateTemplate: false,
      settings: {
        // perfectscrollbar settings
        maxScrollbarLength: 60,
        wheelSpeed: 0.6
      },
      editTemplateComment: false,
      editTemplateName: false
    };
  },

  methods: {
    trackEvents(id) {
      firebase.analytics().logEvent("Created a new template", {
        id: id,
        Title: this.template.templateTitle
      });
      this.$intercom.trackEvent("Created a new template", {
        id: id,
        Title: this.template.templateTitle
      });
      this.$userflow.track("Create Template" , {
        template_id: id,
        group: JSON.parse(localStorage.getItem("userInfo")).group
      })
    },
    updateIot(id, templateID, p, q, a) {
      return new Promise((resolve, reject) => {
        db.collection("iots")
          .doc(id)
          .update({
            templateID: templateID,
            page: p,
            question: q,
            answer: a,
            created_at: firebase.firestore.FieldValue.serverTimestamp()
          });
        resolve("OK");
      });
    },
    saveIot(macAddress, templateID, p, q, a) {
      return new Promise((resolve, reject) => {
        db.collection("iots").add({
          macAddress: macAddress,
          templateID: templateID,
          page: p,
          question: q,
          answer: a,
          created_at: firebase.firestore.FieldValue.serverTimestamp()
        });
        resolve("OK");
      });
    },

    async iotProcess(template, templateID) {
      var the = this;
      template.pages.map((page, p) => {
        page.questions.map((question, q) => {
          question.answers.map(async function(answer, a) {
            if (
              answer.type.macAddress !== undefined &&
              answer.type.macAddress !== ""
            ) {
              var iot = the.$store.getters["app/getIotByMac"](
                answer.type.macAddress
              );
              if (iot == undefined) {
                await the.saveIot(answer.type.macAddress, templateID, p, q, a);
              } else {
                await the.updateIot(iot.id, templateID, p, q, a);
              }
            }
          });
        });
      });
    },
    getTemplateID(updated_at) {
      return new Promise((resolve, reject) => {
        var id = "";
        var date = "";
        db.collection("templates")
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
    async saveTemplate() {
      let template = this.template;
      var answers;
      var questions;
      var pages = [];
      template.content.pages.map(page => {
        questions = [];
        page.questions.map(question => {
          answers = [];
          if (question.answers === undefined) return;
          question.answers.map(answer => {
            if (answer.type.id !== undefined)
              answers.push({
                title: answer.title,
                type: answer.type,
                action: answer.action,
                mandatory: answer.mandatory,
                score: answer.score
              });
          });
          if (answers.length > 0)
            questions.push({
              title: question.title,
              answers: answers
            });
        });
        if (questions.length > 0)
          pages.push({
            title: page.title,
            questions: questions
          });
      });
      if (pages.length == 0) {
        this.$vs.notify({
          time: 8000,
          title: "Empty Template",
          text: "Please check the template content",
          iconPack: "feather",
          icon: "icon-alert-circle",
          color: "warning"
        });
        return false;
      }
      this.$vs.loading();

      var updated_at = new Date();
      var savingTemplate = {
        pages: pages,
        location: template.content.location,
        templateTitle: template.content.templateTitle,
        templateComment: template.content.templateComment,
        templateImage: template.content.templateImage,
        templateLabel: template.content.templateLabel,
        templateSD: template.content.templateSD,
        teams: template.content.teams || []
      };
      if (
        this.$route.params.state == "create" ||
        this.$route.params.state == "duplicate"
      ) {
        db.collection("templates").add({
          content: savingTemplate,
          starred: false,
          trashed: false,
          created_by: JSON.parse(localStorage.getItem("userInfo")).id,
          updated_by: JSON.parse(localStorage.getItem("userInfo")).id,
          created_at: updated_at,
          updated_at: updated_at,
          group: JSON.parse(localStorage.getItem("userInfo")).group
        });

        this.getTemplateID(updated_at).then(id => {
          this.$vs.loading.close();
          this.$vs.notify({
            time: 7000,
            title: "Success",
            text: "Template have been created!",
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "success"
          });
          this.iotProcess(savingTemplate, id);
          this.trackEvents(id);
        });
      } else if (this.$route.params.state == "update") {
        db.collection("templates")
          .doc(this.$route.params.id)
          .update({
            content: savingTemplate,
            updated_by: JSON.parse(localStorage.getItem("userInfo")).id,
            updated_at: updated_at
          });
        this.iotProcess(savingTemplate, this.$route.params.id);
        setTimeout(() => {
          this.$vs.loading.close();
        }, 1000);
        this.$vs.notify({
          time: 7000,
          title: "Success",
          text: "Your template have been updated!",
          iconPack: "feather",
          icon: "icon-alert-circle",
          color: "success"
        });
      }
      this.$router.push(`/templates`).catch(err => {});
    },
    addPage() {
      this.$store.commit("app/CHN_TEMP_TEMPLATE", {
        target: "page",
        key: "addPage",
        val: {
          title: "",
          questions: [
            {
              title: "",
              answers: [
                {
                  title: "",
                  type: {},
                  action: {},
                  mandatory: false,
                  score: [],
                  loged: ""
                }
              ]
            }
          ]
        }
      });
    },
    kkk() {
      this.editTemplateComment = true;
      this.$refs.templateComment.$el.children[0].select();
    }
  },
  computed: {
    templateState() {
      return `${this.$route.params.state} template`;
    },

    tagInfo() {
      return id => {
        return this.$store.getters["app/getLabelById"](id);
      };
    },
    locationInfo() {
      return id => {
        return this.$store.getters["app/getLocationById"](id);
      };
    },
    templateComment: {
      get() {
        return this.template.content.templateComment;
      },
      set(val) {
        this.$store.commit("app/CHN_TEMP_TEMPLATE", {
          target: "template",
          key: "chnComment",
          val: val
        });
      }
    },
    templateTitle: {
      get() {
        return this.template.content.templateTitle;
      },
      set(val) {
        this.$store.commit("app/CHN_TEMP_TEMPLATE", {
          target: "template",
          key: "chnTitle",
          val: val
        });
      }
    },
    template() {
      return this.$store.getters["app/getTempTemplate"];
    },
    pageTitle() {
      if (this.$route.params.state == "create") return "add new template";
      else if (this.$route.params.state == "update") return "update template";
      else if (this.$route.params.state == "duplicate")
        return "duplicate template";
    }
  },
  created() {
    if (this.$store.getters["app/getTempTemplate"].content === undefined)
      this.$router.push("/templates");
  }
};
</script>

<style scoped>
.scroll-area--data-list-add-new {
  height: calc(100vh - 14.5rem);
}
.disableIcon {
  color: #eee !important;
}
.main-title {
  font-size: 24px;
  color: #1e1c26;
  opacity: 0.54;
}
.sub-title {
  font-size: 24px;
  color: #1e1c26;
}
.save-text {
  font-size: 12px;
  color: #ffffff;
}
.template-name {
  font-size: 16px;
  color: #1e1c26;
}
.tag-item {
  background: #f5f5fa;
  padding: 3px 5px;
  border-radius: 4px;
}
.map-text {
  font-size: 12px;
  color: #1e1c26;
}
</style>
