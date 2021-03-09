<template>
  <div class="answer-edit-section" @click.stop="activeEdit=true" v-click-outside="outside">
    <div
      :id="page + '_' + question + '_' + answer"
      class="vx-row"
      :class="{'edit':activeEdit ,'cursor-pointer':!activeEdit}"
    >
      <div class="answer-item vx-col w-3/5 border-r-0 border-l-0 p-2 pl-6">
        <div class="flex">
          <div style="width:5px;">
            <p class="pt-3 text-danger text-lg font-medium" v-show="answerContent.mandatory">*</p>
          </div>
          <p class="inline-block py-3 pl-2 text-sm" v-if="!activeEdit">{{answerTitle}}</p>
          <vs-input
            :placeholder="$t('question name')"
            v-model="answerTitle"
            v-else
            class="w-full vs-input-no-shdow-focus ml-1"
          />
        </div>
      </div>

      <div class="answer-item vx-col w-2/5 border-r-0 p-2">
        <div class="flex items-center justify-between cursor-pointer" @click.stop="openSelectType">
          <p
            class="py-3"
            v-if="answerContent.type.id===undefined || answerType(answerContent.type.id) === undefined"
          >{{$t("select type of response")}}</p>
          <div
            class="flex items-center pt-2"
            v-else-if="answerType(answerContent.type.id).type=='closed answers'"
          >
            <div
              class="closed-answer-item karla-bold mr-2"
              v-for="(item,index) in answerType(answerContent.type.id).content"
              :key="index"
              :style="`background:${hexToRGB(item.color).bColor}; color:${hexToRGB(item.color).color}`"
            >
              <span
                v-if="answerType(answerContent.type.id).group=='global'"
              >{{item.name==''? $t("Unnamed"): $t(item.name)}}</span>
              <span v-else>{{item.name==''? $t("Unnamed"): item.name | capitalize}}</span>
            </div>
          </div>
          <div class="flex items-center pt-1" v-else>
            <template-type-icon :item="answerContent.type.id" />
            <p
              class="karla-bold ml-2"
            >{{$t(answerType(answerContent.type.id).content) | capitalize}}</p>
          </div>
          <vs-icon icon-pack="feather" icon="icon-chevron-down" />
        </div>
        <div
          class="answer-action mt-2 relative"
          v-if="activeEdit && answerType(answerContent.type.id)!==undefined"
        >
          <template v-if="answerType(answerContent.type.id).content=='instruction'">
            <vs-textarea
              class="bg-white"
              v-model="instruction"
              :placeholder="$t('write instructions')"
            />
          </template>
          <template v-if="answerType(answerContent.type.id).content=='date time'">
            <v-select :options="dateTypes" label="title" v-model="dateTime" />
          </template>
          <template v-if="answerType(answerContent.type.id).content=='drop down'">
            <vs-alert active="true" class="mt-2" icon-pack="feather" icon="icon-info">
              <p class="karla">The value will be separated by comma.</p>
              <p class="karla-bold">Example: apple,orange</p>
            </vs-alert>
            <vs-textarea v-model="dropDown" class="mt-2" />
          </template>
          <template v-if="answerType(answerContent.type.id).content=='temperature'">
            <div class="mt-2">
              <p class="karla mr-2">{{$t("unit")}}:</p>
              <v-select class="w-full" :options="tempUnits" v-model="tempUnit" />
            </div>
            <div class="mt-2">
              <p class="karla mr-2">{{$t("mac address")}}:</p>
              <vs-input
                icon-no-border
                class="w-full"
                icon-pack="feather"
                icon="icon-bluetooth"
                :placeholder="$t('mac address')"
                v-model="macAddress"
              />
            </div>
          </template>
          <template v-if="answerType(answerContent.type.id).type=='closed answers'">
            <p class="karla mt-4">{{$t("failed response")}}:</p>
            <v-select v-model="failedAnswer" :options="failedAnswerLists(answerContent.type.id)">
              <template slot="selected-option" slot-scope="option">
                <span v-if="answerType(answerContent.type.id).group=='global'">{{$t(option.label)}}</span>
                <span v-else>{{option.label | capitalize}}</span>
              </template>
              <template slot="option" slot-scope="option">
                <span v-if="answerType(answerContent.type.id).group=='global'">{{$t(option.label)}}</span>
                <span v-else>{{option.label | capitalize}}</span>
              </template>
            </v-select>
          </template>
        </div>
      </div>
      <div
        class="vx-col w-full py-3 answer-item border-t-0 border-l-0 border-r-0"
        v-if="activeEdit"
      >
        <div class="flex items-center">
          <div class="w-1/6 answer-item border-t-0 border-l-0 border-b-0">
            <vs-checkbox
              v-model="mandatory"
              class="karla"
              style="color:#1e1c26"
              v-if="hasCanMandatory"
            >{{$t("required")}}</vs-checkbox>
          </div>
          <div
            class="w-1/6 flex items-center"
            :class="{'answer-item border-t-0 border-l-0 border-b-0':haveAction(answerContent.type.id)}"
          >
            <p
              class="karla-bold ml-2 cursor-pointer"
              style="color:#6c50f0;"
              v-if="haveAction(answerContent.type.id)"
              @click="openAction"
            >{{$t("notification")}}</p>
            <p
              class="karla-bold mr-2 cursor-pointer"
              style="color:#6c50f0;padding-left: 10px;"
              v-if="haveAction(answerContent.type.id) && hadAction"
              @click="openAction"
            >{{$t("active")}}</p>
          </div>
          <div
            class="w-1/6 flex items-center justify-between"
            :class="{'answer-item border-t-0 border-l-0 border-b-0':haveAction(answerContent.type.id)}"
          >
            <p
              class="karla-bold ml-2 cursor-pointer"
              style="color:#6c50f0;"
              @click="openScore"
              v-if="haveAction(answerContent.type.id)"
            >{{$t("add score")}}</p>
            <p
              class="karla-bold mr-2"
              style="color:#6c50f0;"
              v-if="haveAction(answerContent.type.id) && hadScore"
            >{{$t("active")}}</p>
          </div>
          <div class="w-1/6"></div>
          <div class="w-1/6 answer-item border-t-0 border-b-0">
            <div
              class="flex items-center ml-2 hover:text-danger cursor-pointer"
              v-if="template.content.pages[page].questions[question].answers.length>1"
              @click="deleteAnswer"
            >
              <vs-icon icon-pack="feather" icon="icon-trash-2" />
              <p class="karla ml-2">{{$t("delete")}}</p>
            </div>
          </div>
          <div class="w-1/6">
            <div
              class="flex items-center ml-2 hover:text-primary cursor-pointer"
              @click="duplicateAnswer"
            >
              <vs-icon icon-pack="feather" icon="icon-copy" />
              <p class="karla ml-2">{{$t("duplicate")}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TemplateTypeIcon from "./TemplateTypeIcon.vue";
import VSelect from "vue-select";
export default {
  props: {
    drag: {
      type: Boolean,
      default: false,
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
    target: {
      type: Object,
    },
  },
  components: {
    TemplateTypeIcon,
    VSelect,
  },
  data() {
    return {
      activeAction: false,
      tempUnits: ["℃", "℉"],
      activeEdit: false,
    };
  },
  computed: {
    hadAction() {
      return this.answerContent.action.length > 0;
    },
    hadScore() {
      return (
        this.answerContent.score !== undefined &&
        this.answerContent.score.length > 0
      );
    },
    hasCanMandatory() {
      if (
        this.answerContent.type === undefined ||
        this.answerContent.type.id === undefined
      )
        return false;
      else if (
        this.answerType(this.answerContent.type.id) === undefined ||
        this.answerType(this.answerContent.type.id).content === "instruction"
      )
        return false;
      return true;
    },
    haveAction() {
      return (id) => {
        let answer = this.answerType(id);
        if (answer === undefined) return false;
        if (answer.content == "temperature" || answer.type == "closed answers")
          return true;
        return false;
      };
    },
    mandatory: {
      get() {
        return this.answerContent.mandatory;
      },
      set(val) {
        this.$store.commit("app/CHN_TEMP_TEMPLATE", {
          index: {
            page: this.page,
            question: this.question,
            answer: this.answer,
          },
          target: "answer",
          key: "mandatory",
          val: val,
        });
      },
    },
    failedAnswerLists() {
      return (id) => {
        var failedAnswersList = [];
        let failedAnswers = this.answerType(id).content;
        if (failedAnswers === undefined) return [];
        failedAnswers.map((item) => {
          failedAnswersList.push(item.name);
        });
        return failedAnswersList;
      };
    },
    failedAnswer: {
      get() {
        let answer = this.answerContent;
        if (answer.type === undefined || answer.type.failedAnswer === undefined)
          return "";
        return answer.type.failedAnswer;
      },
      set(val) {
        var value = val;
        if (value === null) value = "";
        this.$store.commit("app/CHN_TEMP_TEMPLATE", {
          index: {
            page: this.page,
            question: this.question,
            answer: this.answer,
          },
          target: "answer",
          key: "failedAnswer",
          val: val,
        });
      },
    },

    macAddress: {
      get() {
        let answer = this.answerContent;
        if (answer.type === undefined || answer.type.macAddress === undefined)
          return "";
        return answer.type.macAddress;
      },
      set(val) {
        this.$store.commit("app/CHN_TEMP_TEMPLATE", {
          index: {
            page: this.page,
            question: this.question,
            answer: this.answer,
          },
          target: "answer",
          key: "macAddress",
          val: val,
        });
      },
    },
    tempUnit: {
      get() {
        let answer = this.answerContent;
        if (answer.type === undefined || answer.type.tempUnit === undefined)
          return "℃";
        return answer.type.tempUnit;
      },
      set(val) {
        if (val === null) return;
        this.$store.commit("app/CHN_TEMP_TEMPLATE", {
          index: {
            page: this.page,
            question: this.question,
            answer: this.answer,
          },
          target: "answer",
          key: "tempUnit",
          val: val,
        });
      },
    },
    dropDown: {
      get() {
        let answer = this.answerContent;
        if (answer.type === undefined || answer.type.dropdown === undefined)
          return "";
        return answer.type.dropdown;
      },
      set(val) {
        this.$store.commit("app/CHN_TEMP_TEMPLATE", {
          index: {
            page: this.page,
            question: this.question,
            answer: this.answer,
          },
          target: "answer",
          key: "dropdown",
          val: val,
        });
      },
    },
    dateTypes() {
      return [
        { key: "Date", title: this.$t("date") },
        { key: "Time", title: this.$t("time") },
        { key: "Date & Time", title: this.$t("date & time") },
      ];
    },
    dateTime: {
      get() {
        let answer = this.answerContent;
        if (answer.type === undefined || answer.type.dateType === undefined)
          return this.dateTypes.find((item) => item.key == "Date");
        return this.dateTypes.find((item) => item.key == answer.type.dateType);
      },
      set(val) {
        this.$store.commit("app/CHN_TEMP_TEMPLATE", {
          index: {
            page: this.page,
            question: this.question,
            answer: this.answer,
          },
          target: "answer",
          key: "date&time",
          val: val.key,
        });
      },
    },
    instruction: {
      get() {
        let answer = this.answerContent;
        if (answer.type === undefined || answer.type.instruction === undefined)
          return "";
        return answer.type.instruction;
      },
      set(val) {
        this.$store.commit("app/CHN_TEMP_TEMPLATE", {
          index: {
            page: this.page,
            question: this.question,
            answer: this.answer,
          },
          target: "answer",
          key: "instruction",
          val: val,
        });
      },
    },
    template() {
      return this.$store.getters["app/getTempTemplate"];
    },
    answerContent() {
      return this.template.content.pages[this.page].questions[this.question]
        .answers[this.answer];
    },
    answerTitle: {
      get() {
        return this.answerContent.title == "" && !this.activeEdit
          ? this.$t("question name")
          : this.answerContent.title;
      },
      set(val) {
        this.$store.commit("app/CHN_TEMP_TEMPLATE", {
          index: {
            page: this.page,
            question: this.question,
            answer: this.answer,
          },
          target: "answer",
          key: "title",
          val: val,
        });
      },
    },
    answerType() {
      return (id) => {
        return this.$store.getters["app/getTemplateTypeById"](id);
      };
    },
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
  },
  methods: {
    openScore() {
      this.$store.commit("app/SET_EDIT_ANSWER_INDEXES", {
        page: this.page,
        question: this.question,
        answer: this.answer,
      });
      this.$store.commit("app/SET_EDIT_SCORE", true);
    },
    openAction() {
      this.$store.commit("app/SET_EDIT_ANSWER_INDEXES", {
        page: this.page,
        question: this.question,
        answer: this.answer,
      });
      this.$store.commit("app/SET_EDIT_ACTION", true);
    },
    openSelectType() {
      this.activeEdit = true;
      this.$store.commit("app/SET_EDIT_ANSWER_INDEXES", {
        page: this.page,
        question: this.question,
        answer: this.answer,
      });
      this.$store.commit("app/SET_EDIT_TYPE", true);
    },
    outside() {
      if (
        !this.$store.getters["app/editType"] &&
        !this.$store.getters["app/editAction"] &&
        !this.$store.getters["app/editScore"]
      )
        this.activeEdit = false;
    },
    deleteAnswer() {
      this.$store.commit("app/CHN_TEMP_TEMPLATE", {
        index: {
          page: this.page,
          question: this.question,
          answer: this.answer,
        },
        target: "answer",
        key: "delete",
      });
    },
    duplicateAnswer() {
      this.$store.commit("app/CHN_TEMP_TEMPLATE", {
        index: {
          page: this.page,
          question: this.question,
          answer: this.answer,
        },
        target: "answer",
        key: "duplicate",
        val: JSON.stringify(this.answerContent),
      });
    },
  },
  watch: {
    drag(val) {
      if (val) {
        this.activeEdit = false;
      }
    },
  },
};
</script>

<style scoped>
.answer-item {
  border: 1px solid rgba(113, 102, 237, 0.16);
}
.answer-item > span {
  opacity: 0.78;
  font-size: 12px;
  font-weight: 500;
  color: #1e1c26;
}
.answer-edit-section .vx-row {
  background: #f4f3fe30;
}
.answer-edit-section .vx-row.edit {
  background: #f4f3fe;
}
.closed-answer-item {
  padding: 5px 10px;
  font-size: 12px;
  border-radius: 4px;
}
</style>
<style>
.answer-edit-section .vs-input--input {
  padding-left: 2px;
}
.answer-edit-section .input-span-placeholder {
  padding-left: 2px;
  transform: none !important;
}
</style>
