<template>
  <div class="conditional-logic">
    <div
      class="p-6 pt-3 pb-0 border-t-0 condition-tabs"
      v-if="conditionTabs.length > 0"
    >
      <vs-tabs>
        <vs-tab
          v-for="tab in conditionTabs"
          :key="tab.id"
          :label="tab.title"
        ></vs-tab>
        <vs-tab></vs-tab>
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
            {{ logicCondition }}
          </a>
          <vs-dropdown-menu>
            <vs-dropdown-item
              v-for="(item, index) in conditionList"
              :key="index"
              @click="changeCondition(item.text)"
            >
              {{ item.text }}
            </vs-dropdown-item>
          </vs-dropdown-menu>
        </vs-dropdown>

        <!-- values -->
        <vs-dropdown class="values-list cursor-pointer ml-2" vs-trigger-click>
          <div
            class="closed-answer-item karla-bold"
            :style="`background:${
              hexToRGB(selectedValue.color).bColor
            }; color:${hexToRGB(selectedValue.color).color}`"
          >
            <span v-if="answerTypes.group == 'global'">{{
              selectedValue.name == "" ? $t("Unnamed") : $t(selectedValue.name)
            }}</span>
            <span v-else>{{
              selectedValue.name == ""
                ? $t("Unnamed")
                : selectedValue.name | capitalize
            }}</span>
          </div>

          <vs-dropdown-menu>
            <vs-dropdown-item
              v-for="(item, index) in answerTypes.content"
              :key="index"
              class="answer-item-dropdown"
              @click="changeSelectedValue(item)"
            >
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
            <ul style="min-width: 9rem" class="p-0">
              <li
                class="flex py-1 px-2 my-1 cursor-pointer hover:bg-primary hover:text-white"
              >
                <feather-icon
                  icon="PlusIcon"
                  svgClasses="w-4 h-4"
                ></feather-icon>
                <span class="ml-2 karla">{{ $t("Add another logic") }}</span>
              </li>
              <li
                class="flex py-1 px-2 my-1 cursor-pointer hover:bg-primary hover:text-white"
              >
                <feather-icon
                  icon="Trash2Icon"
                  svgClasses="w-4 h-4"
                ></feather-icon>
                <span class="ml-2 karla">{{ $t("Delete") }}</span>
              </li>
            </ul>
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
            />
          </li>
        </transition-group>
      </draggable>
    </div>
  </div>
</template>

<script>
// import Vue from 'vue';
// Vue.use(Tabs);
import ConditionalAnswerEdit from "./ConditionalAnswerEdit";
import draggable from "vuedraggable";

export default {
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
    parentId: {
      required: true,
    },
  },
  data() {
    return {
      dragStart: false,
      activeTab: 0,
      logicCondition: "is",
      selectedValue: { name: "", color: "" },
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
      console.log("template ", this.$store.getters["app/getTempTemplate"]);
      return this.$store.getters["app/getTempTemplate"];
    },
    conditionTabs() {
      console.log("conditionTabs", this.template.content.conditionTabs);
      if (this.template.content.conditionTabs == undefined) {
        return [];
      }
      return this.template.content.conditionTabs;
    },
    answers: {
      get() {
        console.log(
          "questions",
          this.template.content.pages[this.page].questions
        );
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
    console.log("answerTypes", this.answerTypes);
    console.log("answers", this.answers);
    this.selectedValue = this.answerTypes.content[0];
  },
  methods: {
    changeCondition(conditionText) {
      this.logicCondition = conditionText;
    },
    changeSelectedValue(answer) {
      console.log("changeSelectedValue", answer);
      this.selectedValue = answer;
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
  border: 1px solid rgba(113, 102, 237, 0.16);
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
  border-left: 1px solid rgba(113, 102, 237, 0.16);
  border-right: 1px solid rgba(113, 102, 237, 0.16);

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
</style>
