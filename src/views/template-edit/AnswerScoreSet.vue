<!-- =========================================================================================
File Name: AddNewDataSidebar.vue
Description: Add New Data - Sidebar component
----------------------------------------------------------------------------------------
Item Name: Vuesax Admin - VueJS Dashboard Admin Template
Author: Pixinvent
Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <vs-sidebar
    click-not-close
    position-right
    parent="body"
    default-index="1"
    color="primary"
    class="add-new-data-sidebar items-no-padding"
    spacer
    v-model="isSidebarActiveLocal"
    v-if="!(answer == undefined || answer.type==undefined || answer.type.id === undefined || answerType === undefined)"
  >
    <div class="mt-6 flex items-center justify-between px-6">
      <h4>Score</h4>
      <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>
    <VuePerfectScrollbar class="scroll-area--data-list-add-new pt-4 pb-6" :settings="settings">
      <template
        v-if="answerType !==undefined && (answerType.type == 'closed answers' || answerType.content == 'temperature') "
      >
        <div class="p-4" v-if="answerType.type == 'closed answers'">
          <div
            class="vx-row w-full flex items-center mb-2"
            v-for="(content,i) in answerType.content"
            :key="i"
          >
            <div class="vx-col w-1/3">
              <span
                v-if="answerType.group=='global'"
                class="karla"
                :style="`color:${hexToRGB(content.color).color};`"
              >{{$t(content.name)}}:</span>
              <span
                v-else
                class="karla"
                :style="`color:${hexToRGB(content.color).color};`"
              >{{content.name|capitalize}}:</span>
            </div>
            <div class="vx-col w-2/3">
              <vs-input
                class="w-full"
                type="number"
                @input="inputAnswerScore($event,content.name)"
                :value="calcCloseAnswer(content.name)"
              ></vs-input>
            </div>
          </div>
        </div>

        <div class="p-4" v-else-if="answerType.content == 'temperature'">
          <div class="vx-row w-full flex items-center mt-3" v-for="(item,i) in score1" :key="i">
            <template v-if="item.condition=='default'">
              <div class="vx-col w-1/3">{{$t("default")}}</div>
              <div class="vx-col w-2/3">
                <vs-input
                  type="number"
                  class="w-full"
                  :value="item.score"
                  @input="chnDefaultScore($event)"
                />
              </div>
            </template>
            <template v-else>
              <vs-divider position="right">
                <vs-icon
                  @click="removeCondition(i)"
                  v-if="score1.length>2"
                  icon="icon-trash-2"
                  icon-pack="feather"
                  color="danger"
                  class="cursor-pointer"
                />
              </vs-divider>
              <div class="vx-col w-1/3">{{$t("condition")|capitalize}}</div>
              <div class="vx-col w-2/3">
                <v-select
                  :options="conditions"
                  label="title"
                  :value="condition(item.condition)"
                  @input="inputTempScore($event,i)"
                />
              </div>
              <div class="vx-col w-1/3 mt-2">{{$t("temperature")}}</div>
              <div
                class="vx-col mt-2"
                :class="{'w-2/3':item.condition != 'between' , 'w-1/3':item.condition == 'between'}"
              >
                <vs-input
                  type="number"
                  class="w-full"
                  :value="item.value0"
                  @input="chnTemperature($event,0,i)"
                />
              </div>
              <div class="vx-col mt-2 w-1/3" v-if="item.condition == 'between'">
                <vs-input
                  type="number"
                  class="w-full"
                  :value="item.value1"
                  @input="chnTemperature($event,1,i)"
                />
              </div>
              <div class="vx-col w-1/3 mt-2">{{$t("score")}}</div>
              <div class="vx-col w-2/3 mt-2">
                <vs-input
                  type="number"
                  class="w-full"
                  :value="item.score"
                  @input="chnItemScore($event,i)"
                />
              </div>
            </template>
          </div>
          <div class="vx-row mt-4">
            <div
              @click="addCondition"
              class="w-full vx-col text-right cursor-pointer text-primary underline plus-condition"
            >+{{$t("condition")|capitalize}}</div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="p-4 mt-4">
          <span
            class="font-semibold"
            v-if="answerType!== undefined"
          >&#8221; {{answerType.content | capitalize}} &#8221;</span> doesn't support any Score
        </div>
      </template>
    </VuePerfectScrollbar>
    <div class="flex flex-wrap items-center justify-center p-6" slot="footer">
      <vs-button
        @click="isSidebarActiveLocal=false"
        color="rgba(108, 80, 240, 0.1)"
        text-color="rgba(108, 80, 240)"
        class="kalar ml-2 mr-4"
      >{{$t("cancel")}}</vs-button>

      <vs-button
        class="mr-6 karla"
        :disabled="answerType!== undefined && answerType.type !== 'closed answers' && answerType.content !=='temperature'"
        @click="commit"
      >{{$t("save & apply")}}</vs-button>
    </div>
  </vs-sidebar>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import VSelect from "vue-select";

export default {
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    answer: {
      type: Object,
    },
  },
  data() {
    return {
      settings: {
        // perfectscrollbar settings
        maxScrollbarLength: 60,
        wheelSpeed: 0.6,
      },
      score1: [],
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
    calcTemperature() {
      return (i, key) => {
        return this.score1[i].value[key];
      };
    },
    condition() {
      return (name) => {
        return this.conditions.find((item) => item.name == name);
      };
    },
    conditions() {
      return [
        { name: "equal", title: this.$t("equal") },
        { name: "not equal", title: this.$t("not equal") },
        { name: "less than", title: this.$t("less than") },
        { name: "less than or equal", title: this.$t("less than or equal") },
        { name: "greater than", title: this.$t("greater than") },
        {
          name: "greater than or equal",
          title: this.$t("greater than or equal"),
        },
        { name: "between", title: this.$t("between") },
      ];
    },
    calcCloseAnswer() {
      return (key) => {
        let val = this.score1.find((item) => item.key == key);
        if (val === undefined) return 10;
        else return val.score;
      };
    },
    answerType() {
      return this.$store.getters["app/getTemplateTypeById"](
        this.answer.type.id
      );
    },
    teams() {
      return this.$store.getters["app/teams"];
    },
    isSidebarActiveLocal: {
      get() {
        return this.open;
      },
      set() {
        this.$emit("close");
      },
    },
  },

  watch: {
    open(val) {
      if (val) {
        this.score1 = JSON.parse(JSON.stringify(this.answer.score));
        if (this.answer.score.length == 0) {
          if (this.answerType.content == "temperature") {
            this.score1 = [
              { condition: "default", score: 10 },
              { condition: "equal", value0: 0, value1: 0, score: 10 },
            ];
          } else if (this.answerType.type == "closed answers") {
            this.answerType.content.map((item) => {
              this.score1.push({ key: item.name, score: 10 });
            });
          }
        }
      }
    },
  },
  methods: {
    chnItemScore(e, i) {
      this.score1[i].score = e;
    },
    removeCondition(i) {
      this.score1 = this.score1.filter((item, index) => index != i);
    },
    addCondition() {
      this.score1.push({ condition: "equal", value0: 0, value1: 0, score: 10 });
    },
    chnTemperature(e, i, key) {
      if (i == 0) this.score1[key].value0 = e;
      else this.score1[key].value1 = e;
    },
    chnDefaultScore(e) {
      this.score1[0].score = e;
    },
    inputTempScore(e, i) {
      if (e === null) return;
      this.score1[i].condition = e.name;
    },
    inputAnswerScore(e, key) {
      this.score1 = this.score1.filter((item) => item.key != key);
      let scoreItem = { key: key, score: e };
      this.score1.push(scoreItem);
    },
    initValues() {
      // this.type1 = this.type
    },
    commit() {
      this.$emit("applyScore", this.score1);
    },
  },
  components: {
    VuePerfectScrollbar,
    VSelect,
  },
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="scss" scoped>
.add-new-data-sidebar {
  ::v-deep .vs-sidebar--background {
    z-index: 52010;
  }

  ::v-deep .vs-sidebar {
    z-index: 52010;
    width: 500px;
    max-width: 100vw;

    .img-upload {
      margin-top: 2rem;

      .con-img-upload {
        padding: 0;
      }

      .con-input-upload {
        width: 100%;
        margin: 0;
      }
    }
  }

  ul {
    border-left-width: 3px;
    border-left-style: dashed;
    border-left-color: rgba(var(--vs-primary), 1);
  }
  li {
    padding: 20px 0;
  }
}

.scroll-area--data-list-add-new {
  height: calc(100% - 4.3rem);
}
</style>
<style scoped>
.plus-condition:hover {
  font-weight: bold;
  color: red !important;
}
</style>

