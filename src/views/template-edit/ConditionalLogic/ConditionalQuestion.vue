<template>
  <div class="conditional-logic">
    <div
      class="p-6 pt-3 pb-0 border-t-0 condition-tabs"
      v-if="conditionTabs.length > 1"
      :key="forceRender"
    >
      <vs-tabs v-model="logicTab">
        <!-- <vs-tab
          v-for="tab in conditionTabs.filter(
            (tab) => tab.createdByAnswer == this.parentId
          )"
          :key="tab.id"
          :label="tabName(tab)"
          @click="changeTab(tab)"
        ></vs-tab> -->

        <template v-for="tab in conditionTabs">
          <vs-tab :label="tabName(tab)" @click="changeTab(tab)" :key="tab.id">
            <div class="con-tab-ejemplo">
              <slot name="content"></slot>
            </div>
          </vs-tab>
        </template>
      </vs-tabs>
    </div>
    <div
      class="p-10 pt-1 pb-1 pr-0 border-t-0 if-answer-is flex justify-between items-center"
    >
      <div>
        <!-- if answer -->
        <span>{{ $t("If answer") }}</span>

        <!-- conditions -->
        <vs-dropdown class="condition-list ml-2" vs-trigger-click>
          <a class="a-icon" href="#">
            {{ selectedCondition.text }}
          </a>
          <vs-dropdown-menu>
            <vs-dropdown-item
              v-for="(item, index) in conditionList"
              :key="index"
              @click="changeCondition(item)"
            >
              {{ item.text }}
            </vs-dropdown-item>
          </vs-dropdown-menu>
        </vs-dropdown>

        <!-- values -->
        <vs-dropdown
          v-if="showValueDrop"
          class="values-list cursor-pointer ml-2"
          vs-trigger-click
        >
          <div>
            <div
              class="closed-answer-item mr-1 karla-bold"
              v-for="(item, index) in selectedValues"
              :key="index"
              :style="`background:${hexToRGB(item.color).bColor}; color:${
                hexToRGB(item.color).color
              }`"
            >
              <span v-if="answerTypes.group == 'global'">{{
                item.name == "" ? $t("Unnamed") : $t(item.name)
              }}</span>

              <span v-else>{{
                item.name == "" ? $t("Unnamed") : item.name | capitalize
              }}</span>
            </div>
          </div>
          <vs-dropdown-menu>
            <vs-dropdown-item
              v-for="(item, index) in answerTypes.content"
              :key="index"
              class="answer-item-dropdown"
              @click="changeSelectedValues(item)"
            >
              <div class="flex flex-wrap justify-items-start items-center">
                <div
                  v-show="
                    selectedCondition.key == 'is_one_of' ||
                    selectedCondition.key == 'is_not_one_of'
                  "
                >
                  <vs-checkbox
                    v-model="selectedValues"
                    :vs-value="item"
                  ></vs-checkbox>
                </div>
                <div
                  class="closed-answer-item as-value karla-bold"
                  :style="`background:${hexToRGB(item.color).bColor}; color:${
                    hexToRGB(item.color).color
                  }`"
                >
                  <span v-if="answerTypes.group == 'global'">{{
                    item.name == "" ? $t("Unnamed") : $t(item.name)
                  }}</span>
                  <span v-else>{{
                    item.name == "" ? $t("Unnamed") : item.name | capitalize
                  }}</span>
                </div>
              </div>
            </vs-dropdown-item>
          </vs-dropdown-menu>
        </vs-dropdown>
      </div>
      <div>
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
            <vs-dropdown-item @click="addAnotherLogic()">
              <div class="flex items-center">
                <feather-icon
                  icon="PlusIcon"
                  svgClasses="w-4 h-4"
                ></feather-icon>
                <span class="ml-2 karla">{{ $t("Add another logic") }}</span>
              </div>
            </vs-dropdown-item>
            <vs-dropdown-item @click="deleteLogic()">
              <div class="flex items-center">
                <feather-icon
                  icon="Trash2Icon"
                  svgClasses="w-4 h-4"
                ></feather-icon>
                <span class="ml-2 karla">{{ $t("Delete") }}</span>
              </div>
            </vs-dropdown-item>
          </vs-dropdown-menu>
        </vs-dropdown>
      </div>
    </div>
    <div class="question-list">
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
            <!-- <img
            :src="require('@/assets/images/dnd/2.svg')"
            class="column-drag-handle absolute"
            height="24px"
            width="24px"
            style="top: 13px"
          /> -->
            <conditional-answer-edit
              :drag="dragStart"
              :page="page"
              :question="question"
              :answer="index"
              :parentId="parentId"
              :tabId="activeCondTab"
            />
          </li>
        </transition-group>
      </draggable>
      <div style="background: whitesmoke">
        <span
          class="text-sm text-primary cursor-pointer p-3 pl-8 flex items-center"
          style="width: fit-content"
          @click="addLogicQuestion()"
        >
          <feather-icon
            icon="PlusIcon"
            svgClasses="w-4 h-4"
            class="mr-1"
          ></feather-icon>
          {{ $t("Add questions inside this logic") }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
// import Vue from 'vue';
// Vue.use(Tabs);
import ConditionalAnswerEdit from "./ConditionalAnswerEdit";
import draggable from "vuedraggable";
const generateUniqueId = require("generate-unique-id");

export default {
  watch: {
    conditionTabs(val) {
      this.forceRender += 1;
    },
  },
  components: {
    draggable,
    ConditionalAnswerEdit,
  },
  props: {
    answerTypes: {
      type: Object,
      required: true,
    },
    page: {
      type: Number,
      required: true,
    },
    question: {
      type: Number,
      required: true,
    },
    answer: {
      type: Number,
      required: true,
    },
    parentId: {
      required: true,
    },
  },
  data() {
    return {
      forceRender: 1,
      logicTab: 0,
      activeCondTab: 0,
      dragStart: false,
      showValueDrop: true,
      selectedCondition: "is",
      selectedValues: [{ name: "", color: "" }],
      conditionList: [
        { symbol: "=", key: "is", text: "is" },
        { symbol: "≠", key: "is_not", text: "is not" },
        { symbol: "selected", key: "is_selected", text: "is selected" },
        {
          symbol: "not_selected",
          key: "is_not_selected",
          text: "is not selected",
        },
        { symbol: "∈", key: "is_one_of", text: "is one of" },
        { symbol: "∉", key: "is_not_one_of", text: "is not one of" },
      ],
    };
  },
  computed: {
    hexToRGB() {
      return (h) => {
        if (h == "green") {
          return {
            color: `rgb(0,255,0)`,
            bColor: `rgba(0,255,0,0.15)`,
          };
        } else if (h.includes("#") !== true) {
          return {
            color: `rgb(var(--vs-${h}))`,
            bColor: `rgba(var(--vs-${h}),0.15)`,
          };
        } else {
          let r = 0,
            g = 0,
            b = 0;

          // 3 digits
          if (h.length == 4) {
            r = "0x" + h[1] + h[1];
            g = "0x" + h[2] + h[2];
            b = "0x" + h[3] + h[3];

            // 6 digits
          } else if (h.length == 7) {
            r = "0x" + h[1] + h[2];
            g = "0x" + h[3] + h[4];
            b = "0x" + h[5] + h[6];
          }

          return {
            color: "rgb(" + +r + "," + +g + "," + +b + ")",
            bColor: "rgba(" + +r + "," + +g + "," + +b + ",0.15)",
          };
        }
      };
    },
    dragOptions() {
      return {
        animation: 0,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      };
    },
    template() {
      return this.$store.getters["app/getTempTemplate"];
    },
    answerContent() {
      return this.template.content.pages[this.page].questions[this.question]
        .answers[this.answer];
    },
    answerType() {
      return (id) => {
        return this.$store.getters["app/getTemplateTypeById"](id);
      };
    },
    conditionTabs() {
      if (this.template.content.conditionTabs == undefined) {
        return [];
      }
      if (
        this.template.content.conditionTabs.filter(
          (tab) => tab.createdByAnswer == this.parentId
        ).length == 1
      ) {
        this.activeCondTab = this.template.content.conditionTabs[0].id;
      }
      return this.template.content.conditionTabs.filter(
        (tab) => tab.createdByAnswer == this.parentId
      );
    },
    tabName() {
      return (tab) => {
        let title = "";

        if (tab.condition.symbol == "selected") {
          title = "selected";
        } else if (tab.condition.symbol == "not_selected") {
          title = "not selected";
        } else {
          let answerName = "";
          for (let i = 0; i < tab.answers.length; i++) {
            const answer = tab.answers[i];
            answerName += answer.name;
            if (i != tab.answers.length - 1) {
              answerName += ", ";
            }
          }
          title = tab.condition.symbol + " " + answerName;
        }
        return title;
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
  },
  mounted() {
    this.selectedValues = [this.answerTypes.content[0]];
    this.selectedCondition = this.conditionList[0];
    this.activeCondTab =
      this.conditionTabs.length > 0 ? this.conditionTabs[0].id : 0;
  },
  methods: {
    changeTab(tab) {
      if (
        tab.condition.symbol == "selected" ||
        tab.condition.symbol == "not_selected"
      ) {
        this.showValueDrop = false;
      } else {
        this.showValueDrop = true;
      }
      this.activeCondTab = tab.id;
      this.changeCondition(tab.condition, true);
      this.changeSelectedValues(tab.answers, true);
    },
    changeCondition(condition, goToExistingTab) {
      if (
        this.selectedCondition.key == "is_one_of" ||
        this.selectedCondition.key == "is_not_one_of"
      ) {
        if (condition.key != "is_one_of" && condition.key != "is_not_one_of") {
          if (goToExistingTab != true) {
            // when changing condition
            this.selectedValues = [this.answerTypes.content[0]];
            this.$store.commit("app/CHN_TEMP_TEMPLATE", {
              target: "conditionTabs",
              key: "chnAnswers",
              tabId: this.activeCondTab,
              val: this.selectedValues,
            });
          } else {
            // when changing tab
          }
        }
      }

      if (
        condition.symbol == "selected" ||
        condition.symbol == "not_selected"
      ) {
        this.showValueDrop = false;
      } else {
        this.showValueDrop = true;
      }

      this.selectedCondition = condition;
      this.$store.commit("app/CHN_TEMP_TEMPLATE", {
        target: "conditionTabs",
        key: "chnCondition",
        tabId: this.activeCondTab,
        val: condition,
      });
    },
    changeSelectedValues(answer, canUseDirectly) {
      if (canUseDirectly == true) {
        this.selectedValues = answer;
      } else {
        if (
          this.selectedCondition.key == "is_one_of" ||
          this.selectedCondition.key == "is_not_one_of"
        ) {
          const isExists = this.selectedValues.find(
            (item) => item.name == answer.name
          );
          if (isExists == undefined) {
            this.selectedValues = [...this.selectedValues, answer];
          } else if (this.selectedValues.length > 1) {
            this.selectedValues = this.selectedValues.filter(
              (item) => item.name != answer.name
            );
          }
        } else {
          this.selectedValues = [answer];
        }
      }

      this.$store.commit("app/CHN_TEMP_TEMPLATE", {
        target: "conditionTabs",
        key: "chnAnswers",
        tabId: this.activeCondTab,
        val: this.selectedValues,
      });
    },
    addAnotherLogic() {
      let answerId = this.parentId;

      // let condition = this.conditionList.find(c => c.symbol)
      const tabId = generateUniqueId();
      this.$store.commit("app/CHN_TEMP_TEMPLATE", {
        target: "conditionTabs",
        key: "add",
        val: {
          id: tabId,
          condition: this.conditionList[0],
          answers: [this.answerType(this.answerContent.type.id).content[0]],
          createdByAnswer: answerId,
        },
      });
    },
    deleteLogic() {
      const tabs = this.conditionTabs.filter(
        (tab) => tab.createdByAnswer == this.parentId
      );
      const logicTab = this.logicTab;

      this.$store.commit("app/CHN_TEMP_TEMPLATE", {
        target: "conditionTabs",
        key: "delete",
        val: {
          tabId: this.activeCondTab,
        },
      });

      this.answers = this.answers.filter(
        (answer) => answer.tabId != this.activeCondTab
      );

      this.logicTab = 0;
      if (logicTab > 0) {
        this.changeTab(tabs[0]);
      } else {
        if (tabs.length > 1) {
          this.changeTab(tabs[1]);
        }
      }
    },
    addLogicQuestion() {
      this.$store.commit("app/CHN_TEMP_TEMPLATE", {
        index: {
          page: this.page,
          question: this.question,
          answer: this.answer,
        },
        parent: this.parentId,
        tabId: this.activeCondTab,
        target: "answer",
        key: "addLogicQuestion",
      });
    },
  },
};
</script>

<style lang="scss">
.conditional-logic {
  padding-left: 30px;
  border-left: 2px solid orange;
  margin-left: 7px;
}
.background-conditional {
  background-color: rgb(245, 245, 245);
}
.if-answer-is {
  // border-bottom: 1px solid rgba(113, 102, 237, 0.16);
  background-color: rgb(245, 245, 245);
}
.condition-list {
  display: inline-block;
  width: fit-content;
  cursor: pointer;

  .a-icon {
  }
}
.values-list {
}
.condition-tabs {
  background-color: rgb(245, 245, 245);
  // border-left: 1px solid rgba(113, 102, 237, 0.16);
  // border-right: 1px solid rgba(113, 102, 237, 0.16);

  .con-slot-tabs {
    height: 3px;
  }
  .con-vs-tabs {
    .con-slot-tabs {
      border-top: 1px solid lightgray;
      position: relative;
      top: 2px;
    }
  }
  .vs-tabs--li button {
    font-size: 12px;
  }
  button.vs-tabs--btn {
    padding: 8px 13px;
  }
}
.closed-answer-item {
  padding: 5px 10px;
  font-size: 12px;
  border-radius: 4px;
  display: inline-block;
  // &.as-value {
  //   margin: 3px;
  // }
}
.answer-item-dropdown {
  min-width: 150px;
}
.flip-list-move {
  transition: none !important;
}
</style>
