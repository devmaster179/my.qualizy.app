<template>
  <div
    class="w-full no-gutter items-center justify-center relative mx-auto px-4"
    id="page-public-template"
    style="max-width:1000px; height: calc(100vh - 92px);"
  >
    <div class="text-right mt-base">
      <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer">
        <span class="cursor-pointer flex i18n-locale">
          <span class="ml-2">{{ setedLang=="all" ? $t('all') : setedLang }}</span>
          <vs-icon icon-pack="feather" icon="icon-chevron-down" />
        </span>
        <vs-dropdown-menu class="w-48 i18n-dropdown vx-navbar-dropdown">
          <vs-dropdown-item @click="setedLang = 'English'">English</vs-dropdown-item>
          <vs-dropdown-item @click="setedLang = 'Français'">Français</vs-dropdown-item>
        </vs-dropdown-menu>
      </vs-dropdown>
    </div>
    <div class="relative bg-white border rounded border-solid d-theme-border-grey-light">
      <vue-simple-suggest
        ref="suggestComponent"
        :styles="autoCompleteStyle"
        v-model="chosen"
        :list="templates"
        display-attribute="content.templateTitle"
        :filter-by-query="true"
      >
        <!-- Filter by input text to only show the matching results -->
        <vs-input
          v-model="chosen1"
          size="large"
          icon-pack="feather"
          placeholder="Search Template"
          class="w-full vs-input-no-border"
        />
        <div
          class="absolute top-0 right-0 py-4 md:px-6 sm:px-2"
          v-if="chosen != '' "
          @click="emptySearchKey"
        >
          <feather-icon icon="XIcon" svgClasses="h-6 w-6 cursor-pointer" />
        </div>
        <div class="absolute top-0 right-0 py-4 md:px-6 px-2" v-else>
          <feather-icon icon="SearchIcon" svgClasses="h-6 w-6 cursor-pointer" />
        </div>
        <div slot="suggestion-item" slot-scope="scope">
          <span v-html="boldenSuggestion(scope)"></span>
        </div>
      </vue-simple-suggest>
    </div>
    <VuePerfectScrollbar class="scroll-area mt-4" :settings="settings" ref="taskListPS">
      <div class="items-grid-view vx-row no-gutter">
        <div
          class="vx-col mt-4 sm:mt-0 md:w-1/3 sm:w-1/2 w-full sm:px-2"
          v-for="template in templates"
          :key="template.id"
        >
          <template-item :item="template">
            <template slot="action-buttons">
              <div class>
                <div
                  class="flex flex-wrap border border-solid d-theme-border-grey-light border-r-0 border-l-0 border-b-0"
                >
                  <div
                    class="item-view-primary-action-btn p-3 flex flex-grow items-center justify-center cursor-pointer"
                    @click="viewTemplate(template)"
                  >
                    <feather-icon icon="EyeIcon" svgClasses="h-5 w-5" />
                    <span class="text-sm font-semibold ml-2">View Template</span>
                  </div>
                  <div
                    class="item-view-secondary-action-btn bg-primary p-3 flex flex-grow items-center justify-center text-white cursor-pointer"
                    @click="useTemplate(template)"
                  >
                    <feather-icon icon="UploadCloudIcon" svgClasses="h-5 w-5" />
                    <span class="text-sm font-semibold ml-2">Use template</span>
                  </div>
                </div>
              </div>
            </template>
          </template-item>
        </div>
      </div>
    </VuePerfectScrollbar>
    <view-template
      :template="selectedTemplate"
      :isSidebarActive="isSidebarActive"
      @closeSidebar="isSidebarActive=false"
    />
  </div>
</template>

<script>
import { db } from "@/firebase/firebaseConfig";
import TemplateItem from "./TemplateItem.vue";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import ViewTemplate from "./ViewTemplate.vue";
import VueSimpleSuggest from "vue-simple-suggest";

export default {
  components: {
    TemplateItem,
    VuePerfectScrollbar,
    ViewTemplate,
    VueSimpleSuggest,
  },
  data() {
    return {
      setedLang: "",
      chosen: "",
      chosen1: "",
      autoCompleteStyle: {
        vueSimpleSuggest: "position-absolute",
        inputWrapper: "",
        defaultInput: "form-control",
        suggestions: "position-absolute list-group z-1000",
        suggestItem: "list-group-item",
      },
      selectedTemplate: {},
      isSidebarActive: false,
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.3,
      },
    };
  },
  watch: {
    chosen(val) {
      this.chosen1 = val;
    },
  },
  computed: {
    templates() {
      var templates = this.$store.state.app.publicTemplates;
      if (this.chosen != "")
        templates = templates.filter(
          (item) =>
            item.content.templateTitle
              .toLowerCase()
              .indexOf(this.chosen.toLowerCase()) > -1
        );
      var lang = "en";
      if (this.setedLang == "Français") lang = "fr";
      templates = templates.filter(
        (item) => item.lang == lang || (lang == "en" && item.lang === undefined)
      );
      return templates;
    },
  },
  methods: {
    useTemplate(template) {
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
          location: template.content.location,
          templateTitle: template.content.templateTitle,
          templateComment: template.content.templateComment,
          templateImage: template.content.templateImage,
          templateLabel: template.content.templateLabel,
          templateSD: template.content.templateSD,
          pages: pages,
        },
      };
      this.$store.commit("app/SET_TEMPTEMPLATE", JSON.stringify(tempTemplate));

      this.$router
        .push({
          name: "template-edit",
          params: { id: template.id, state: "duplicate" },
        })
        .catch(() => {});
    },
    boldenSuggestion(scope) {
      if (!scope) return scope;

      const { suggestion, query } = scope;

      let result = this.$refs.suggestComponent.displayProperty(suggestion);

      if (!query) return result;

      const texts = query.split(/[\s-_/\\|\.]/gm).filter((t) => !!t) || [""];
      return result.replace(
        new RegExp("(.*?)(" + texts.join("|") + ")(.*?)", "gi"),
        "$1<b>$2</b>$3"
      );
    },
    viewTemplate(template) {
      this.selectedTemplate = template;
      this.isSidebarActive = true;
    },
    emptySearchKey() {
      this.chosen = "";
    },
  },
  created() {
    this.$vs.loading();
    db.collection("templates")
      .where("group", "==", "global")
      .onSnapshot((q) => {
        let templates = [];
        q.forEach((doc) => {
          templates.push(Object.assign({}, doc.data(), { id: doc.id }));
        });
        this.$store.dispatch("app/setPublicTemplates", templates);
        this.$vs.loading.close();
      });
    db.collection("template_type").onSnapshot((q) => {
      let types = [];
      q.forEach((doc) => {
        if (doc.data().type === "closed answers") {
          if (doc.data().group !== "global") return;
        }
        types.push(Object.assign({}, doc.data(), { id: doc.id }));
      });
      this.$store.dispatch("app/setTemplateType", types);
    });
    db.collection("template_labels")
      .where("group", "==", "global")
      .onSnapshot((q) => {
        let labels = [];
        q.forEach((doc) =>
          labels.push(Object.assign({}, doc.data(), { id: doc.id }))
        );
        this.$store.dispatch("app/setLabel", labels);
      });
  },
  beforeMount() {
    if (this.$i18n.locale == "en") this.setedLang = "English";
    else if (this.$i18n.locale == "fr") this.setedLang = "Français";
  },
};
</script>


<style lang="scss">
@import "@/assets/scss/vuesax/extraComponents/autocomplete.scss";
</style>
<style scoped>
/* #page-public-template {
} */
.scroll-area {
  height: calc(100vh - 12rem);
}
</style>

