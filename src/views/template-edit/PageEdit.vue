<template>
  <div class="page-edit-section">
    <div class="flex justify-between items-center">
      <div
        class="flex items-center cursor-pointer py-3"
        @click="activeTitle"
        v-if="!editTitle"
      >
        <p class="page-title karla-bold text-sm">{{ pageTitle }}</p>
        <feather-icon
          icon="Edit2Icon"
          class="ml-4"
          style="width: 15px; height: 15px"
        />
      </div>
      <vs-input
        v-else
        @focus="$event.target.select()"
        v-model="pageTitle"
        ref="pageTitle"
        @blur="editTitle = false"
        class="vs-input-no-shdow-focus w-full edit-page-title"
      />
      <vs-dropdown vs-custom-content class="cursor-pointer" vs-trigger-click>
        <feather-icon
          icon="MoreVerticalIcon"
          class="p-2 cursor-pointer"
          style="height: 2.6rem"
        />
        <vs-dropdown-menu class="vx-navbar-dropdown">
          <ul style="min-width: 9rem" class="p-0">
            <li
              class="flex py-1 px-2 my-1 cursor-pointer hover:bg-primary hover:text-white"
              @click="duplicatePage"
            >
              <feather-icon icon="CopyIcon" svgClasses="w-4 h-4"></feather-icon>
              <span class="ml-2 karla">{{ $t("duplicate page") }}</span>
            </li>
            <li
              class="flex py-1 px-2 my-1 cursor-pointer hover:bg-primary hover:text-white"
              @click="deletePage"
              v-if="template.content.pages.length > 1"
            >
              <feather-icon
                icon="Trash2Icon"
                svgClasses="w-4 h-4"
              ></feather-icon>
              <span class="ml-2 karla">{{ $t("delete page") }}</span>
            </li>
          </ul>
        </vs-dropdown-menu>
      </vs-dropdown>
    </div>
    <vx-card class="mt-4">
      <div slot="no-body" class="pb-2">
        <div
          class="template-question"
          :class="{ 'section-divider': index > 0 }"
          v-for="(question, index) in pageContent.questions"
          :key="index"
        >
          <question-edit :page="page" :question="index" />
        </div>
      </div>
    </vx-card>
    <answer-type-select
      :open="activeSelectType"
      @close="closeEdit('type')"
      @apply="applyAnswer"
    />
    <answer-action-set
      :open="activeAction"
      @close="closeEdit('action')"
      :answer="answerContent"
      @applyAction="applyAction"
    />
    <answer-score-set
      :open="activeScore"
      @close="closeEdit('score')"
      :answer="answerContent"
      @applyScore="applyScore"
    />
  </div>
</template>

<script>
import QuestionEdit from "./QuestionEdit";
import vSelect from "vue-select";
import AnswerTypeSelect from "./AnswerTypeSelect";
import AnswerActionSet from "./AnswerActionSet";
import AnswerScoreSet from "./AnswerScoreSet";

export default {
  components: {
    QuestionEdit,
    vSelect,
    AnswerTypeSelect,
    AnswerActionSet,
    AnswerScoreSet,
  },
  props: {
    page: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      editTitle: false,
      selectedIndex: {
        page: 0,
        question: 0,
        answer: 0,
      },
    };
  },
  methods: {
    closeEdit(type) {
      setTimeout(() => {
        if (type == "type") this.$store.commit("app/SET_EDIT_TYPE", false);
        else if (type == "action")
          this.$store.commit("app/SET_EDIT_ACTION", false);
        else this.$store.commit("app/SET_EDIT_SCORE", false);
      }, 10);
    },
    applyScore(score) {
      this.$store.commit("app/CHN_TEMP_TEMPLATE", {
        index: this.$store.getters["app/editAnswerIndexes"],
        target: "answer",
        key: "score",
        val: score,
      });
      setTimeout(() => {
        this.activeScore = false;
      }, 10);
    },
    applyAction(action) {
      this.$store.commit("app/CHN_TEMP_TEMPLATE", {
        index: this.$store.getters["app/editAnswerIndexes"],
        target: "answer",
        key: "action",
        val: action,
      });
      setTimeout(() => {
        this.$store.commit("app/SET_EDIT_ACTION", false);
      }, 10);
    },
    applyAnswer(id) {
      let template = this.template;
      let index = this.$store.getters["app/editAnswerIndexes"];
      let answer =
        template.content.pages[index.page].questions[index.question].answers[
          index.answer
        ];
      console.log(
        "applyAnswer",
        this.answerType(answer.type.id),
        this.answerType(id)
      );
      if (!answer.type.id || answer.type.id != id) {
        console.log("if called");
        let answerType = this.answerType(id);
        // when answer is changed to other answer from closed answer.
        if (
          answer.hasCondLogic == true &&
          this.answerType(answer.type.id).type == "closed answers" &&
          answerType.type != "closed answers"
        ) {
          this.$store.commit("app/CHN_TEMP_TEMPLATE", {
            index: this.$store.getters["app/editAnswerIndexes"],
            target: "answer",
            key: "disableConditionalLogic",
          });
        }

        this.$store.commit("app/CHN_TEMP_TEMPLATE", {
          index: this.$store.getters["app/editAnswerIndexes"],
          target: "answer",
          key: "type",
          val: id,
          answerType: answerType,
        });
        if (answerType.content == "temperature") {
          this.$store.commit("app/CHN_TEMP_TEMPLATE", {
            index: this.$store.getters["app/editAnswerIndexes"],
            target: "answer",
            key: "tempUnit",
            val: "℃",
          });
        }

        this.applyAction([]);
        this.applyScore([]);
      }

      setTimeout(() => {
        this.$store.commit("app/SET_EDIT_TYPE", false);
      }, 10);
    },
    duplicatePage() {
      let page = JSON.parse(JSON.stringify(this.pageContent));
      this.$store.commit("app/CHN_TEMP_TEMPLATE", {
        target: "page",
        key: "addPage",
        val: page,
      });
    },
    deletePage() {
      this.$store.commit("app/CHN_TEMP_TEMPLATE", {
        target: "page",
        key: "deletePage",
        val: this.page,
      });
    },
    activeTitle() {
      this.editTitle = true;
      this.$nextTick(() => {
        this.$refs.pageTitle.focusInput();
      });
    },
  },

  computed: {
    answerContent() {
      let indexes = this.$store.getters["app/editAnswerIndexes"];
      return this.template.content.pages[indexes.page].questions[
        indexes.question
      ].answers[indexes.answer];
    },
    answerType() {
      return (id) => {
        return this.$store.getters["app/getTemplateTypeById"](id);
      };
    },
    activeScore: {
      get() {
        return this.$store.getters["app/editScore"];
      },
      set() {
        this.$store.commit("app/SET_EDIT_SCORE", false);
      },
    },
    activeAction: {
      get() {
        return this.$store.getters["app/editAction"];
      },
      set() {
        this.$store.commit("app/SET_EDIT_ACTION", false);
      },
    },
    activeSelectType: {
      get() {
        return this.$store.getters["app/editType"];
      },
      set() {
        this.$store.commit("app/SET_EDIT_TYPE", false);
      },
    },
    template() {
      return this.$store.getters["app/getTempTemplate"];
    },
    pageContent() {
      return this.template.content.pages[this.page];
    },
    pageTitle: {
      get() {
        return this.pageContent.title == ""
          ? this.$t("Page Title")
          : this.pageContent.title;
      },
      set(val) {
        this.$store.commit("app/CHN_TEMP_TEMPLATE", {
          index: {
            page: this.page,
          },
          target: "page",
          key: "chnTitle",
          val: val,
        });
      },
    },
  },
};
</script>

<style scoped>
.page-title {
  color: #1e1c26;
  padding: 5px 0 5px 5px;
}
.edit-page-title {
}
.section-divider {
  /* margin-top: 5px; */
  border: 2px solid #3502ff3d;
  border-left: none;
  border-right: none;
  border-bottom: none;
}
</style>

<style>
.edit-page-title input {
  padding: 15px 5px !important;
}
.edit-page-title .input-span-placeholder {
  padding: 0 !important;
}

.edit-page-title.isFocus .input-span-placeholder {
  display: none;
}

.edit-page-title .input-span-placeholder,
.edit-page-title input {
  font-size: 0.875rem !important;
  font-family: "Karla";
  font-weight: bold;
  color: #1e1c26;
  transform: unset !important;
}
</style>