<template>
  <div class="template-new">
    <div class="page-header">
      <div class="page-title flex items-center">
        <p
          class="main-title karla-bold mr-2 cursor-pointer"
          @click="$router.push('/templates')"
        >
          {{ $t("templates") }} >
        </p>
        <p class="sub-title karla-bold">{{ $t("add new template") }}</p>
      </div>
    </div>
    <div class="page-content mt-base">
      <div class="template-type items-grid-view match-height vx-row">
        <div class="vx-col lg:w-1/6 md:w-1/4 sm:w-1/2 w-full sm:px-2 px-0">
          <vx-card class="cursor-pointer" @click.native="createTemplate">
            <div class="text-center my-base">
              <vs-icon
                color="#6c50f0"
                size="40px"
                icon-pack="feather"
                icon="icon-plus"
              />
            </div>
            <p class="template-type-text text-center karla-bold mb-base">
              {{ $t("blank template") }}
            </p>
          </vx-card>
        </div>
        <div
          class="vx-col lg:w-1/6 md:w-1/4 sm:w-1/2 w-full sm:px-2 px-0 mt-4 sm:mt-0"
        >
          <vx-card class="cursor-pointer">
            <div class="text-center my-base">
              <vs-icon
                color="#6c50f0"
                size="40px"
                icon-pack="feather"
                icon="icon-upload"
              />
            </div>
            <p class="template-type-text text-center karla-bold mb-base">
              {{ $t("order template") }}
            </p>
          </vx-card>
        </div>
      </div>
      <div class="popular-templates mt-base">
        <div class="sm:flex items-center justify-between">
          <p class="karla-bold text-lg color-my-black">
            {{ $t("popular templates") }}
          </p>
          <div>
            <div class="flex items-center justify-end">
              <vs-input
                v-model="searchTemplate"
                :placeholder="$t('Search')"
                class="mr-4"
              />
              <v-select
                style="min-width: 200px"
                :options="globalTags"
                v-model="gTags"
                multiple
                label="name"
                class="mr-4"
                :placeholder="$t('tags')"
              >
                <template slot="option" slot-scope="option">
                  <div class="flex items-center">
                    <div
                      class="h-2 w-2 rounded-full mr-2"
                      :style="`background: ${option.color};`"
                    ></div>
                    <span class="karla text-sm">{{
                      option.name | capitalize
                    }}</span>
                  </div>
                </template>
                <template slot="selected-option" slot-scope="option">
                  <div class="flex items-center">
                    <div
                      class="h-2 w-2 rounded-full mr-2"
                      :style="`background: ${option.color};`"
                    ></div>
                    <span class="karla text-sm">{{
                      option.name | capitalize
                    }}</span>
                  </div>
                </template>
              </v-select>
            </div>
          </div>
        </div>
        <div class="vx-row vx-row items-grid-view match-height">
          <div
            class="vx-col lg:w-1/4 md:w-1/3 sm:w-1/2 w-full mt-4"
            v-for="(pTemplate, index) in pTemplates"
            :key="index"
          >
            <vx-card
              class="w-full cursor-pointer"
              @click.native="cloneTemplate(pTemplate)"
            >
              <div slot="no-body" class="pl-4 py-4 pr-3">
                <div class="flex items-center">
                  <img
                    :src="
                      require(`@/assets/images/template_image/${pTemplate.content.templateImage}`)
                    "
                    style="width: 40px; height: 40px"
                  />
                  <div>
                    <p class="karla-bold text-base color-my-black ml-3">
                      {{ pTemplate.content.templateTitle }}
                    </p>
                    <p class="karla ml-3 text-sm">
                      {{ pTemplate.content.templateComment }}
                    </p>
                  </div>
                </div>

                <div
                  class="inline-block template-lable rounded-lg mr-2 mt-3"
                  v-for="(label, lIndex) in pTemplate.content.templateLabel"
                  :key="lIndex"
                  :class="{ hidden: !templateLabelInfo(label) }"
                >
                  <template v-if="templateLabelInfo(label)">
                    <div
                      class="h-2 w-2 rounded-full mr-2 inline-block"
                      :style="`background: ${templateLabelInfo(label).color};`"
                    ></div>
                    <span class="karla text-sm">{{
                      templateLabelInfo(label).name | capitalize
                    }}</span>
                  </template>
                </div>
              </div>
            </vx-card>
          </div>
        </div>
      </div>
    </div>
    <templatemaking-popup
      :open="activeCreateTemplate"
      @close="activeCreateTemplate = false"
      :state="templateState"
    />
  </div>
</template>
<script>
import TemplatemakingPopup from "../template-making/TemplatemakingPopup";
import VSelect from "vue-select";

import firebase from "firebase/app";
import "firebase/auth";

import { db } from "@/firebase/firebaseConfig.js";

export default {
  components: {
    TemplatemakingPopup,
    VSelect,
  },
  data() {
    return {
      gTags: [],
      searchTemplate: "",
      templateState: "",
      activeCreateTemplate: false,
    };
  },
  created() {
    var language = "en-us";
    if (this.$i18n.locale == "gb") {
      language = "en-gb";
    } else if (
      this.$i18n.locale == "fr" ||
      this.$i18n.locale == "es" ||
      this.$i18n.locale == "it"
    ) {
      language = this.$i18n.locale;
    } else {
      language = this.$i18n.locale;
    }

    let dbLabelIds = [];
    db.collection("template_labels")
      .where("group", "==", "global")
      .where("lang", "==", language)
      .get()
      .then((q) => {
        q.forEach((doc) => {
          if (doc.data().trashed) return;
          dbLabelIds.push(doc.id);
        });
        console.log("dbLabelIds: ", dbLabelIds);

        this.$store.dispatch("app/setLabelFiltered", dbLabelIds);
      });
  },
  methods: {
    cloneTemplate(template) {
      this.templateState = "duplicate template";
      var pages = [];
      var questions;
      var answers;
      var loged = "";
      template.content.pages.map((page) => {
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
              action: Array.isArray(answer.action) ? answer.action : [],
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
          teams: [],
          location: [],
          templateTitle: template.content.templateTitle,
          templateComment: template.content.templateComment,
          templateImage: template.content.templateImage,
          templateLabel: template.content.templateLabel,
          templateSD: "bookmarked",
          pages: pages,
        },
      };
      this.$store.commit("app/SET_TEMPTEMPLATE", JSON.stringify(tempTemplate));
      this.activeCreateTemplate = true;
    },
    createTemplate() {
      this.templateState = "create a template";

      var tempTemplate = {
        content: {
          teams: [],
          location: [],
          templateTitle: "",
          templateComment: "",
          templateImage: "1.svg",
          templateLabel: [],
          templateSD: "bookmarked",
          pages: [
            {
              title: "",
              questions: [
                {
                  title: "",
                  answers: [
                    {
                      title: "",
                      type: {},
                      action: [],
                      mandatory: false,
                      score: [],
                      loged: "",
                    },
                  ],
                },
              ],
            },
          ],
        },
      };
      this.$store.commit("app/SET_TEMPTEMPLATE", JSON.stringify(tempTemplate));
      this.activeCreateTemplate = true;
    },
  },
  computed: {
    globalTags() {
      const locale = this.$i18n.locale || "en-gb";
      let labels = this.$store.getters["app/labels"].filter((item) => {
        if (item.group != "global") return false;
        if (!item.lang) {
          if (locale != "en-gb") return false;
        } else {
          if (item.lang != locale) return false;
        }
        return true;
      });

      console.log("globalTags", labels);
      return labels;
    },
    templateInfo() {
      return (id) => {
        return this.$store.getters["app/getTemplateById"](id);
      };
    },
    pTemplates() {
      let templates = this.$store.getters["app/publicTemplates"](
        this.$i18n.locale
      );
      if (this.searchTemplate != "") {
        templates = templates.filter(
          (template) =>
            template.content.templateTitle
              .toLowerCase()
              .indexOf(this.searchTemplate.toLowerCase()) > -1 ||
            template.content.templateComment
              .toLowerCase()
              .indexOf(this.searchTemplate.toLowerCase()) > -1
        );
      }
      if (this.gTags.length > 0) {
        let tags = [];
        this.gTags.map((item) => tags.push(item.id));
        templates = templates.filter((template) =>
          template.content.templateLabel.some((labels) => tags.includes(labels))
        );
      }

      return templates;
    },
    templateLabelInfo() {
      return (id) => {
        return this.$store.getters["app/getLabelById"](id);
      };
    },
  },
};
</script>
<style scoped>
.main-title {
  font-size: 24px;
  color: #1e1c26;
  opacity: 0.54;
}
.sub-title {
  font-size: 24px;
  color: #1e1c26;
}
.template-item {
  width: 200px;
}
.template-type-text {
  font-size: 16px;
  color: #1e1c26;
}
.template-lable {
  background: #ebebf1;
  padding: 3px 6px;
}
</style>