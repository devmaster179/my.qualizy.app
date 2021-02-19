<template>
  <div class="question-edit-section">
    <div class="question-title-section flex items-center justify-between">
      <div
        class="flex items-center cursor-pointer"
        @click="activeTitle"
        v-if="!editTitle"
      >
        <p class="question-title karla-bold text-sm">{{ questionTitle }}</p>
        <feather-icon
          icon="Edit2Icon"
          class="ml-4"
          style="width: 15px; height: 15px"
        />
      </div>
      <vs-input
        v-else
        @focus="$event.target.select()"
        v-model="questionTitle"
        ref="questionTitle"
        @blur="editTitle = false"
        class="vs-input-no-shdow-focus w-full edit-question-title"
      />
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
              @click="addSection"
            >
              <feather-icon icon="PlusIcon" svgClasses="w-4 h-4"></feather-icon>
              <span class="ml-2 karla">{{ $t("add section") }}</span>
            </li>
            <li
              class="flex py-1 px-2 my-1 cursor-pointer hover:bg-primary hover:text-white"
              @click="duplicateSection"
            >
              <feather-icon icon="CopyIcon" svgClasses="w-4 h-4"></feather-icon>
              <span class="ml-2 karla">{{ $t("duplicate section") }}</span>
            </li>
            <li
              class="flex py-1 px-2 my-1 cursor-pointer hover:bg-primary hover:text-white"
              @click="deleteSection"
              v-if="template.content.pages[page].questions.length > 1"
            >
              <feather-icon
                icon="Trash2Icon"
                svgClasses="w-4 h-4"
              ></feather-icon>
              <span class="ml-2 karla">{{ $t("delete section") }}</span>
            </li>
          </ul>
        </vs-dropdown-menu>
      </vs-dropdown>
    </div>
    <div class="vx-row" style="background-color: rgba(235, 235, 241, 0.2)">
      <div
        class="vx-col w-3/5 border border-solid border-t-0 border-r-0 border-l-0"
        style="border-color: rgba(113, 102, 237, 0.16); padding: 15px"
      >
        <span class="question-header">{{ $t("question") }}</span>
      </div>
      <div
        class="vx-col w-2/5 border border-solid border-t-0 border-r-0"
        style="border-color: rgba(113, 102, 237, 0.16); padding: 15px"
      >
        <span class="question-header">{{ $t("type of response") }}</span>
      </div>
      <!-- <div
        class="vx-col w-1/6 border border-solid border-t-0 border-r-0"
        style="border-color:rgba(113, 102, 237, 0.16);padding: 15px;"
      >
        <span class="question-header">{{$t("action")}}</span>
      </div>
      <div
        class="vx-col w-1/6 border border-solid border-t-0 border-r-0"
        style="border-color:rgba(113, 102, 237, 0.16);padding: 15px;"
      >
        <span class="question-header">{{$t("score")}}</span>
      </div>-->
    </div>
    <draggable
      class="list-group"
      tag="ul"
      @start="dragStart = true"
      @end="dragStart = false"
      v-model="answers"
      v-bind="dragOptions"
      handle=".column-drag-handle"
    >
      <transition-group type="transition" name="flip-list">
        <li
          class="list-group-item relative"
          v-for="(element, index) in answers"
          :key="index"
        >
          <img
            :src="require('@/assets/images/dnd/2.svg')"
            class="column-drag-handle absolute"
            height="24px"
            width="24px"
            style="top: 13px"
          />
          <answer-edit
            :drag="dragStart"
            :page="page"
            :question="question"
            :answer="index"
          />
          <div>Hello world</div>
          <conditional-question />
        </li>
      </transition-group>
    </draggable>

    <draggable
      v-bind="dragOptions"
      tag="div"
      class="item-container"
      v-model="tempData"
    >
      <div class="item-group" :key="index" v-for="(el, index) in tempData">
        <div class="item">{{ el.title }}</div>
        <draggable
          v-bind="dragOptions"
          tag="div"
          class="item-sub"
          v-model="el.items"
        >
          <div class="item-group" :key="index" v-for="(el, index) in el.items">
            <div class="item">{{ el.title }}</div>
          </div>
        </draggable>
      </div>
    </draggable>
    <div class="vx-row p-2">
      <p class="karla-bold text-primary cursor-pointer" @click="addQuestion">
        {{ $t("add question") }}
      </p>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import AnswerEdit from "./AnswerEdit";
import ConditionalQuestion from './ConditionalLogic/ConditionalQuestion.vue';
// import { Container, Draggable } from "vue-smooth-dnd";
export default {
  props: {
    page: {
      type: Number,
      required: true,
    },
    question: {
      type: Number,
      required: true,
    },
  },
  components: {
    AnswerEdit,
    // Container,
    // Draggable,
    draggable,
    ConditionalQuestion,
  },
  data() {
    return {
      dragStart: false,
      targetAnswer: {
        page: -1,
        question: -1,
        answer: -1,
      },
      upperDropPlaceholderOptions: {
        className: "drop-preview",
        animationDuration: "150",
        showOnTop: true,
      },
      editTitle: false,
      tempData: [
        {
          title: "hello",
          items: [
            { title: "sub title" },
            { title: "sub title" },
            { title: "sub title" },
          ],
        },
        {
          title: "hello",
          items: [
            { title: "sub title" },
            { title: "sub title" },
            { title: "sub title" },
          ],
        },
        {
          title: "hello",
          items: [
            { title: "sub title" },
            { title: "sub title" },
            { title: "sub title" },
          ],
        },
      ],
    };
  },
  methods: {
    shouldAcceptDrop(s, p) {
      return true;
    },
    deleteSection() {
      this.$store.commit("app/CHN_TEMP_TEMPLATE", {
        index: {
          page: this.page,
        },
        target: "answer",
        key: "deleteSection",
        val: this.question,
      });
    },
    duplicateSection() {
      this.$store.commit("app/CHN_TEMP_TEMPLATE", {
        index: {
          page: this.page,
        },
        target: "answer",
        key: "duplicateSection",
        val: JSON.stringify(
          this.template.content.pages[this.page].questions[this.question]
        ),
      });
    },
    addSection() {
      this.$store.commit("app/CHN_TEMP_TEMPLATE", {
        index: {
          page: this.page,
        },
        target: "answer",
        key: "addSection",
      });
    },
    addQuestion() {
      this.$store.commit("app/CHN_TEMP_TEMPLATE", {
        index: {
          page: this.page,
          question: this.question,
        },
        target: "answer",
        key: "addQuestion",
      });
    },
    onDrop(e) {
      this.$store.commit("app/CHN_TEMP_TEMPLATE", {
        index: {
          page: this.page,
          question: this.question,
        },
        target: "answer",
        key: "chnAnswerOrder",
        val: e,
      });
    },
    activeTitle() {
      this.editTitle = true;
      this.$nextTick(() => {
        this.$refs.questionTitle.focusInput();
      });
    },
  },
  computed: {
    dragOptions() {
      return {
        animation: 0,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      };
    },
    answers: {
      get() {
        return this.template.content.pages[this.page].questions[this.question]
          .answers;
      },
      set(val) {
        this.$store.commit("app/CHN_TEMP_TEMPLATE", {
          index: {
            page: this.page,
            question: this.question,
          },
          target: "answer",
          key: "chnAnswers",
          val: val,
        });
      },
    },
    template() {
      return this.$store.getters["app/getTempTemplate"];
    },

    questionTitle: {
      get() {
        return this.template.content.pages[this.page].questions[this.question]
          .title == ""
          ? this.$t("section title")
          : this.template.content.pages[this.page].questions[this.question]
              .title;
      },
      set(val) {
        this.$store.commit("app/CHN_TEMP_TEMPLATE", {
          index: {
            page: this.page,
            question: this.question,
          },
          target: "answer",
          key: "chnSectionTitle",
          val: val,
        });
      },
    },
  },
};
</script>
<style scoped>
.column-drag-handle {
  cursor: grab;
}
.question-title-section {
  box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.06);
}
.question-title {
  padding: 20px 0 20px 10px;
  color: #1e1c26;
}
.question-header {
  opacity: 0.8;
  font-size: 12px;
  font-weight: 600;
  color: #1e1c26;
}
</style>
<style>
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
  border: 1px dashed red;
  cursor: grabbing !important;
}
.ghost .column-drag-handle {
  cursor: grabbing !important;
}

.question-edit-section
  .smooth-dnd-container.vertical
  > .smooth-dnd-draggable-wrapper {
  overflow: initial;
  position: relative;
}
.edit-question-title input {
  padding: 20px 0 20px 10px !important;
}
.edit-question-title .input-span-placeholder {
  padding: 0 !important;
}

.edit-question-title.isFocus .input-span-placeholder {
  display: none;
}

.edit-question-title .input-span-placeholder,
.edit-question-title input {
  font-size: 0.875rem !important;
  font-family: "Karla";
  font-weight: 600;
  color: #1e1c26;
  transform: unset !important;
}

.item-container {
  max-width: 20rem;
  margin: 0;
}
.item {
  padding: 1rem;
  border: solid black 1px;
  background-color: #fefefe;
}
.item-sub {
  margin: 0 0 0 1rem;
}
</style>
