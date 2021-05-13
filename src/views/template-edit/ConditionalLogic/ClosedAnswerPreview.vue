<template>
  <div>
    <div
      v-for="(content, cIndex) in getTemplateType(answer.type.id).content"
      :key="'c' + cIndex"
    >
      <div
        v-if="
          pages[pIndex].questions[qIndex].answers[aIndex].loged == content.name
        "
        class="flex items-center justify-center border border-solid rounded-lg py-3 cursor-pointer mt-2"
        :style="`background:${hexToRGB(content.color)}; border-color:${hexToRGB(
          content.color
        )};`"
      >
        <span
          class="karla text-white"
          v-if="getTemplateType(answer.type.id).group == 'global'"
          >{{ $t(content.name) }}</span
        >
        <span class="karla text-white" v-else>{{
          content.name | capitalize
        }}</span>
      </div>
      <div
        v-else
        class="flex items-center justify-center border border-solid rounded-lg py-3 cursor-pointer mt-2"
        @click="logClosedAnswerValue(content, pIndex, qIndex, aIndex)"
      >
        <span
          v-if="getTemplateType(answer.type.id).group == 'global'"
          class="karla"
          :style="`color:${hexToRGB(content.color)};`"
          >{{ $t(content.name) }}</span
        >
        <span
          v-else
          class="karla"
          :style="`color:${hexToRGB(content.color)};`"
          >{{ content.name | capitalize }}</span
        >
      </div>
    </div>

    <div
      v-for="(answer, aIndex) in filteredAnswers(getLogicQuestions())"
      :key="aIndex"
      class="mt-5"
    >
      <div class="answer-title karla flex">
        {{
          answer.title == "" ? $t("question name") : answer.title | capitalize
        }}
        <span v-if="answer.mandatory" class="text-danger">*</span>
        <span
          class="text-primary"
          v-if="
            answer.type.id !== undefined &&
            getTemplateType(answer.type.id) !== undefined &&
            getTemplateType(answer.type.id).content == 'temperature'
          "
          >({{
            answer.type.tempUnit === undefined ? "℃" : answer.type.tempUnit
          }})</span
        >
      </div>
      <div class="answer-content">
        <template
          v-if="
            answer.type.id !== undefined &&
            getTemplateType(answer.type.id) !== undefined &&
            getTemplateType(answer.type.id).type == 'closed answers'
          "
        >
          <div
            v-for="(content, cIndex) in getTemplateType(answer.type.id).content"
            :key="'c' + cIndex"
          >
            <div
              v-if="
                pages[pIndex].questions[qIndex].answers[answer.index].loged ==
                content.name
              "
              class="flex items-center justify-center border border-solid rounded-lg py-3 cursor-pointer mt-2"
              :style="`background:${hexToRGB(
                content.color
              )}; border-color:${hexToRGB(content.color)};`"
            >
              <span
                class="karla text-white"
                v-if="getTemplateType(answer.type.id).group == 'global'"
                >{{ $t(content.name) }}</span
              >
              <span class="karla text-white" v-else>{{
                content.name | capitalize
              }}</span>
            </div>
            <div
              v-else
              class="flex items-center justify-center border border-solid rounded-lg py-3 cursor-pointer mt-2"
              @click="logValue(content.name, pIndex, qIndex, answer.index)"
            >
              <span
                v-if="getTemplateType(answer.type.id).group == 'global'"
                class="karla"
                :style="`color:${hexToRGB(content.color)};`"
                >{{ $t(content.name) }}</span
              >
              <span
                v-else
                class="karla"
                :style="`color:${hexToRGB(content.color)};`"
                >{{ content.name | capitalize }}</span
              >
            </div>
          </div>
        </template>
        <template
          v-else-if="
            answer.type.id !== undefined &&
            getTemplateType(answer.type.id) !== undefined &&
            getTemplateType(answer.type.id).content == 'number'
          "
        >
          <div class="w-full flex items-center justify-between">
            <vs-input
              type="number"
              class="w-full mr-2"
              :value="
                pages[pIndex].questions[qIndex].answers[answer.index].loged
              "
              v-on:input="logValue($event, pIndex, qIndex, answer.index)"
            />
            <div class="flex items-center">
              <span
                @click="
                  logValue(
                    Math.round(
                      pages[pIndex].questions[qIndex].answers[answer.index]
                        .loged
                    ) + 1,
                    pIndex,
                    qIndex,
                    answer.index
                  )
                "
                style="
                  font-size: 25px;
                  border: 1px solid rgba(0, 0, 0, 0.2);
                  width: 48px;
                  height: 48px;
                "
                class="rounded-lg px-3 text-center cursor-pointer numBtn mr-2 pt-1 block"
                >+</span
              >
              <span
                @click="
                  logValue(
                    pages[pIndex].questions[qIndex].answers[answer.index]
                      .loged - 1,
                    pIndex,
                    qIndex,
                    answer.index
                  )
                "
                style="
                  font-size: 25px;
                  border: 1px solid rgba(0, 0, 0, 0.2);
                  width: 48px;
                  height: 48px;
                "
                class="rounded-lg px-3 text-center cursor-pointer numBtn block pt-1"
                >-</span
              >
            </div>
          </div>
        </template>
        <template
          v-else-if="
            answer.type.id !== undefined &&
            getTemplateType(answer.type.id) !== undefined &&
            getTemplateType(answer.type.id).content == 'signature'
          "
        >
          <div class="w-full">
            <VueSignaturePad
              height="150px"
              :ref="
                'signaturePad_' + pIndex + '_' + qIndex + '_' + answer.index
              "
              class="w-full border border-solid d-theme-border-grey-light"
              :options="{ onBegin, onEnd }"
            />
            <div class="w-full flex justify-between mt-2">
              <vs-button
                color="danger"
                @click="clearSign(pIndex, qIndex, answer.index)"
                >{{ $t("clear") }}</vs-button
              >
              <vs-button
                color="warning"
                @click="undoSign(pIndex, qIndex, answer.index)"
                >{{ $t("undo") }}</vs-button
              >
              <vs-button @click="saveSign(pIndex, qIndex, answer.index)">{{
                $t("save")
              }}</vs-button>
            </div>
          </div>
        </template>
        <template
          v-else-if="
            answer.type.id !== undefined &&
            getTemplateType(answer.type.id) !== undefined &&
            getTemplateType(answer.type.id).content == 'instruction'
          "
        >
          <div class="w-full">
            <div
              style="white-space: pre-wrap; font-size: 12px; color: #86848a"
              v-html="answer.type.instruction"
            ></div>
          </div>
        </template>
        <template
          v-else-if="
            answer.type.id !== undefined &&
            getTemplateType(answer.type.id) !== undefined &&
            getTemplateType(answer.type.id).content == 'checkbox'
          "
        >
          <vs-checkbox
            color="success"
            :value="pages[pIndex].questions[qIndex].answers[answer.index].loged"
            v-on:input="logValue($event, pIndex, qIndex, answer.index)"
          ></vs-checkbox>
        </template>
        <template
          v-else-if="
            answer.type.id !== undefined &&
            getTemplateType(answer.type.id) !== undefined &&
            (getTemplateType(answer.type.id).content == 'paragraph' ||
              getTemplateType(answer.type.id).content == 'short answer')
          "
        >
          <div class="w-full">
            <textarea
              class="my-textarea"
              :value="
                pages[pIndex].questions[qIndex].answers[answer.index].loged
              "
              @blur="
                logValue($event.target.value, pIndex, qIndex, answer.index)
              "
            />
          </div>
        </template>
        <template
          v-else-if="
            answer.type.id !== undefined &&
            getTemplateType(answer.type.id) !== undefined &&
            getTemplateType(answer.type.id).content == 'temperature'
          "
        >
          <div class="w-full flex justify-between">
            <vs-input
              type="number"
              class="w-full mr-1"
              :value="
                pages[pIndex].questions[qIndex].answers[answer.index].loged
              "
              @blur="logValue($event, pIndex, qIndex, answer.index)"
            />
            <span
              style="
                font-size: 20px;
                border: 1px solid rgba(0, 0, 0, 0.2);
                width: 48px;
              "
              class="rounded-lg px-1 pt-2 text-center cursor-pointer numBtn"
              @click="
                logValue(
                  pages[pIndex].questions[qIndex].answers[answer.index].loged *
                    -1,
                  pIndex,
                  qIndex,
                  answer.index
                )
              "
              >&plus;&#8725;&minus;</span
            >
          </div>
        </template>
        <template
          v-else-if="
            answer.type.id !== undefined &&
            getTemplateType(answer.type.id) !== undefined &&
            getTemplateType(answer.type.id).content == 'star'
          "
        >
          <div class="w-full">
            <!-- inactive-color="#fff"
                      border-color="#999"
                        border-width="3"
                      -->
            <star-rating
              inactive-color="#fff"
              border-color="#999"
              :border-width="3"
              :show-rating="false"
              :star-size="30"
              :star-points="[
                23,
                2,
                14,
                17,
                0,
                19,
                10,
                34,
                7,
                50,
                23,
                43,
                38,
                50,
                36,
                34,
                46,
                19,
                31,
                17,
              ]"
              text-class="text-warning font-medium"
              :rating="
                pages[pIndex].questions[qIndex].answers[answer.index].value
              "
              @rating-selected="logValue($event, pIndex, qIndex, answer.index)"
              :glow="5"
              :increment="0.5"
              :fixed-points="1"
            ></star-rating>
          </div>
        </template>
        <template
          v-else-if="
            answer.type.id !== undefined &&
            getTemplateType(answer.type.id) !== undefined &&
            getTemplateType(answer.type.id).content == 'score'
          "
        >
          <div class="w-full">
            <score-item
              :p="pIndex"
              :q="qIndex"
              :a="answer.index"
              :score="
                pages[pIndex].questions[qIndex].answers[answer.index].loged
              "
              @input="logValue"
            />
          </div>
        </template>
        <template
          v-else-if="
            answer.type.id !== undefined &&
            getTemplateType(answer.type.id) !== undefined &&
            getTemplateType(answer.type.id).content ==
              'automatic date and time stamp'
          "
        >
          <div class="w-full">
            <span
              class
              style="
                font-style: italic;
                color: #1e1c26;
                opacity: 0.54;
                font-size: 12px;
              "
              >{{
                pages[pIndex].questions[qIndex].answers[answer.index].loged
                  | moment("dddd, MMMM Do YYYY - H:mm:ss")
              }}</span
            >
          </div>
        </template>
        <template
          v-else-if="
            answer.type.id !== undefined &&
            getTemplateType(answer.type.id) !== undefined &&
            getTemplateType(answer.type.id).content == 'items'
          "
        >
          <food-item
            :selectedItem="
              pages[pIndex].questions[qIndex].answers[answer.index].loged
            "
            :p="pIndex"
            :q="qIndex"
            :a="answer.index"
            @chnItem="logValue"
          />
        </template>
        <template
          v-else-if="
            answer.type.id !== undefined &&
            getTemplateType(answer.type.id) !== undefined &&
            getTemplateType(answer.type.id).content == 'users'
          "
        >
          <div class="w-full">
            <v-select
              :filterable="false"
              @search="searchUserList"
              :value="
                getUser(
                  pages[pIndex].questions[qIndex].answers[answer.index].loged
                )
              "
              @input="logValue($event, pIndex, qIndex, answer.index, true)"
              :options="userList"
              label="name"
              :placeholder="$t('please type 3 letters at least')"
            ></v-select>
          </div>
        </template>
        <template
          v-else-if="
            answer.type.id !== undefined &&
            getTemplateType(answer.type.id) !== undefined &&
            getTemplateType(answer.type.id).content == 'teams'
          "
        >
          <div class="w-full">
            <v-select
              :value="
                getTeam(
                  pages[pIndex].questions[qIndex].answers[answer.index].loged
                )
              "
              @input="logValue($event, pIndex, qIndex, answer.index, true)"
              :options="teamList"
              label="name"
            ></v-select>
          </div>
        </template>
        <template
          v-else-if="
            answer.type.id !== undefined &&
            getTemplateType(answer.type.id) !== undefined &&
            getTemplateType(answer.type.id).content == 'drop down'
          "
        >
          <div class="w-full">
            <v-select
              :value="
                pages[pIndex].questions[qIndex].answers[answer.index].loged
              "
              @input="logValue($event, pIndex, qIndex, answer.index)"
              :options="
                pages[pIndex].questions[qIndex].answers[answer.index].type
                  .dropdown === undefined
                  ? []
                  : pages[pIndex].questions[qIndex].answers[
                      answer.index
                    ].type.dropdown.split(',')
              "
            ></v-select>
          </div>
        </template>
        <template
          v-else-if="
            answer.type.id !== undefined &&
            getTemplateType(answer.type.id) !== undefined &&
            getTemplateType(answer.type.id).content == 'date'
          "
        >
          <div class="w-full hasClockIcon relative">
            <flat-pickr
              class="flatpickr-input w-full"
              :config="configDatePicker"
              :value="
                pages[pIndex].questions[qIndex].answers[answer.index].loged
              "
              @input="logValue($event, pIndex, qIndex, answer.index)"
            />
          </div>
        </template>
        <template
          v-else-if="
            answer.type.id !== undefined &&
            getTemplateType(answer.type.id) !== undefined &&
            getTemplateType(answer.type.id).content == 'date time'
          "
        >
          <div class="w-full hasClockIcon relative">
            <flat-pickr
              v-if="
                answer.type.dateType === undefined ||
                answer.type.dateType == 'Date'
              "
              class="flatpickr-input w-full"
              :config="configDatePicker"
              :value="
                pages[pIndex].questions[qIndex].answers[answer.index].loged
              "
              @input="logValue($event, pIndex, qIndex, answer.index)"
            />
            <flat-pickr
              v-else-if="answer.type.dateType == 'Time'"
              class="flatpickr-input w-full"
              :config="configTimePicker"
              :value="
                pages[pIndex].questions[qIndex].answers[answer.index].loged
              "
              @input="logValue($event, pIndex, qIndex, answer.index)"
            />
            <flat-pickr
              v-else-if="answer.type.dateType == 'Date & Time'"
              class="flatpickr-input w-full"
              :config="configDateTimePicker"
              :value="
                pages[pIndex].questions[qIndex].answers[answer.index].loged
              "
              @input="logValue($event, pIndex, qIndex, answer.index)"
            />
          </div>
        </template>
        <template
          v-else-if="
            answer.type.id !== undefined &&
            getTemplateType(answer.type.id) !== undefined &&
            getTemplateType(answer.type.id).content == 'automatic user stamp'
          "
        >
          <div class="w-full">
            <span
              style="
                font-style: italic;
                color: #1e1c26;
                opacity: 0.54;
                font-size: 12px;
              "
              >{{ currentUser.name | capitalize }}</span
            >
          </div>
        </template>
        <template
          v-else-if="
            answer.type.id !== undefined &&
            getTemplateType(answer.type.id) !== undefined &&
            (getTemplateType(answer.type.id).content == 'photo' ||
              getTemplateType(answer.type.id).content == 'receipts')
          "
        >
          <div class="sm:pl-4 pl-0 w-full">
            <div class="con-upload">
              <view-upload
                v-if="viewActive"
                :src="viewSrc"
                @closeImage="closeImage"
              />
              <div class="con-img-upload py-0 m-0">
                <div
                  class="img-upload my-2"
                  v-for="(image, imageKey) in pages[pIndex].questions[qIndex]
                    .answers[answer.index].loged"
                  :key="imageKey"
                >
                  <button
                    type="button"
                    class="btn-x-file"
                    @click="
                      removeImage(image.url, pIndex, qIndex, answer.index)
                    "
                  >
                    <i translate="translate" class="material-icons notranslate"
                      >delete</i
                    >
                  </button>
                  <img
                    :src="image.url"
                    style="max-width: none; max-height: 100%"
                    @touchend="viewImage(image.url, $event)"
                    @click="viewImage(image.url, $event)"
                  />
                </div>
                <file-upload
                  :indexs="[pIndex, qIndex, answer.index]"
                  @url="uploadSucess"
                />
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import Datepicker from "vuejs-datepicker";
import StarRating from "vue-star-rating";
import VSelect from "vue-select";
import FileUpload from "@/components/file-upload/FileUpload.vue";
import ViewUpload from "@/components/file-upload/ViewUpload.vue";
import ScoreItem from "../../tasks/ScoreItem";
import FoodItem from "../../tasks/FoodItem";
import ClosedAnswerPreview from "../ConditionalLogic/ClosedAnswerPreview";
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import { storage } from "@/firebase/firebaseStorage";

export default {
  components: {
    VuePerfectScrollbar,
    Datepicker,
    StarRating,
    VSelect,
    FileUpload,
    ViewUpload,
    ScoreItem,
    FoodItem,
    flatPickr,
    ClosedAnswerPreview,
  },
  props: {
    pIndex: {
      type: Number,
      required: true,
    },
    qIndex: {
      type: Number,
      required: true,
    },
    aIndex: {
      type: Number,
      required: true,
    },
    answer: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
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
      selectedAnswer: null,
      signOptions: {
        penColor: "#c0f",
      },
      userList: [],
      viewActive: false,
      viewSrc: "",

      configDateTimePicker: {
        enableTime: true,
        altFormat: "Y/m/d H:i",
        altInput: true,
        dateFormat: "Z",
      },
      configTimePicker: {
        enableTime: true,
        noCalendar: true,
        dateFormat: "Z",
        altFormat: "H:i",
        altInput: true,
      },
      configDatePicker: {
        dateFormat: "Z",
        altFormat: "Y/m/d",
        altInput: true,
      },
      viewPage: false,
      pageNum: 0,
      active: true,
      clickNotClose: true,
      settings: {
        // perfectscrollbar settings
        maxScrollbarLength: 60,
        wheelSpeed: 0.6,
      },
      enterClass: "animated bounceInRight",
    };
  },
  watch: {
    pageNum() {
      this.viewPage = false;
      this.$refs.pageLists.$el.scrollTop = 0;
    },
  },
  computed: {
    calcComplateStatus() {
      var count = 0;
      var _complated = 0;
      this.pages.map((page, p) => {
        page.questions.map((question, q) => {
          this.getLogicQuestions().map((answer, a) => {
            if (answer.mandatory) {
              if (
                this.pages[p].questions[q].answers[a].loged != "" ||
                this.pages[p].questions[q].answers[a].loged.length > 0
              ) {
                _complated++;
              }
              count++;
            }
          });
        });
      });
      if (count == 0) this.complated = 100;
      else this.complated = (_complated / count) * 100;
      return _complated + "/" + count;
    },
    currentUser() {
      return this.$store.getters["app/getUserById"](
        JSON.parse(localStorage.getItem("userInfo")).id
      );
    },
    getTeam() {
      return (id) => {
        if (id === undefined || id == "") return null;
        else {
          let team = this.$store.getters["app/getTeamById"](id);
          if (Object.keys(team).length > 0)
            return { id: team.id, name: team.name };
          else return null;
        }
      };
    },
    teamList() {
      var __teams = [];
      let teams = this.$store.getters["app/teams"].filter(
        (item) => !item.deleted && item.active
      );
      teams.map((item) => {
        __teams.push({ id: item.id, name: item.name });
      });
      return __teams;
    },
    getUser() {
      return (id) => {
        if (id === undefined || id == "") return null;
        else {
          let user = this.$store.getters["app/getUserById"](id);
          if (Object.keys(user).length > 0)
            return { id: user.id, name: user.name };
          else return null;
        }
      };
    },
    hexToRGB() {
      return (h) => {
        if (h.includes("#") !== true) {
          if (h == "primary" || h == "success" || h == "danger" || h == "dark")
            return `rgb(var(--vs-${h}))`;
          else return h;
        } else if (h == "green") {
          return h;
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

          return "rgb(" + +r + "," + +g + "," + +b + ")";
        }
      };
    },
    getTemplateType() {
      return (id) => {
        return this.$store.getters["app/getTemplateTypeById"](id);
      };
    },
    calcQuestionCompletd() {
      return (p, q) => {
        var count = 0;
        var _complated = 0;
        this.pages[p].questions[q].answers.map((answer, a) => {
          if (answer.mandatory) {
            if (answer.mandatory) {
              if (answer.loged != "" || answer.loged.length > 0) _complated++;
            }
            count++;
          }
        });
        return _complated + "/" + count;
      };
    },
    calcPageCompletd1() {
      return (number) => {
        var count = 0;
        var complated = 0;
        this.pages[number].questions.map((question) => {
          this.getLogicQuestions().map((answer) => {
            if (answer.mandatory) {
              complated++;
              if (answer.loged != "" || answer.loged.length > 0) count++;
            }
          });
        });
        return count + "/" + complated;
      };
    },
    calcPageCompletd() {
      var all = 0;
      var completed = 0;
      this.template.content.pages[this.pageNum].questions.map((question) => {
        this.getLogicQuestions().map((answer) => {
          if (answer.mandatory) {
            all++;
            if (answer.loged != "" || answer.loged.length > 0) completed++;
          }
        });
      });
      return `${completed}/${all}`;
    },
    pages() {
      let pages = this.template.content.pages;
      if (this.pageNum >= pages.length) this.pageNum = pages.length - 1;
      return this.template.content.pages;
    },
    completeTaskInfo() {
      var all = 0;
      var completed = 0;
      this.template.content.pages.map((page) => {
        page.questions.map((question) => {
          this.getLogicQuestions().map((answer) => {
            if (answer.mandatory) all++;
          });
        });
      });
      return {
        all: all,
        completed: completed,
      };
    },
    template() {
      return this.$store.getters["app/getTempTemplate"];
    },
    conditionTabs() {
      if (this.template.content.conditionTabs == undefined) {
        return [];
      }
      return this.template.content.conditionTabs.filter(
        (tab) => tab.createdByAnswer == this.answer.id
      );
    },
  },
  mounted() {
    // this.selectedAnswer = this.getTemplateType(this.answer.type.id).content[0];
  },
  methods: {
    getLogicQuestions() {
      const questions = this.$store.getters["app/logicQuestionsByAnswerIdTemp"](
        {
          answerId: this.answer.id,
          pIndex: this.pIndex,
          qIndex: this.qIndex,
          template: this.template,
        }
      );
      return questions;
    },
    filteredAnswers(answers) {
      // get only answers which is matched to tab condition
      let matchingTabs = [];
      if (this.selectedAnswer == null) {
        matchingTabs = this.conditionTabs.filter(
          (tab) => tab.condition.symbol == "not_selected"
        );
      } else {
        matchingTabs = this.conditionTabs.filter((tab) => {
          if (tab.condition.symbol == "selected") {
            return true;
          } else {
            if (
              tab.condition.key == "is" &&
              tab.answers[0].name == this.selectedAnswer.name
            ) {
              return true;
            } else if (
              tab.condition.key == "is_not" &&
              tab.answers[0].name != this.selectedAnswer.name
            ) {
              return true;
            } else if (
              tab.condition.key == "is_one_of" &&
              tab.answers.some(
                (answer) => answer.name == this.selectedAnswer.name
              )
            ) {
              return true;
            } else if (
              tab.condition.key == "is_not_one_of" &&
              tab.answers.some(
                (answer) => answer.name == this.selectedAnswer.name
              )
            ) {
              return false;
            } else {
              return false;
            }
          }
        });
      }

      const filtered = answers.filter((answer) => {
        return matchingTabs.some((tab) => {
          return tab.id == answer.tabId;
        });
      });

      return filtered;
    },
    logClosedAnswerValue(content, p, q, a) {
      this.selectedAnswer = content;

      this.$store.commit("app/LOG_VALUE", {
        val: content.name,
        index: { page: p, question: q, answer: a },
      });
    },
    clearSign(p, q, a) {
      this.$refs[`signaturePad_${p}_${q}_${a}`][0].clearSignature();
    },
    undoSign(p, q, a) {
      this.$refs[`signaturePad_${p}_${q}_${a}`][0].undoSignature();
    },
    saveSign(p, q, a) {
      this.logValue(1, p, q, a);
    },
    onBegin() {},
    onEnd(p) {},
    searchUserList(search, loading) {
      this.userList = [];
      loading(true);
      if (search.length == "") loading(false);
      if (search.length > 2) this.searchUser(loading, search);
    },
    searchUser(loading, search) {
      var __users = [];
      let users = this.$store.getters["app/users"].filter(
        (item) => !item.deleted && item.status
      );
      users = users.filter(
        (user) => user.name.toLowerCase().indexOf(search.toLowerCase()) > -1
      );
      users.map((item) => {
        __users.push({ id: item.id, name: item.name });
      });
      loading(false);
      this.userList = __users;
    },
    minusPage() {
      this.enterClass = "animated bounceInLeft";
      this.pageNum--;
    },
    plusPage() {
      this.enterClass = "animated bounceInRight";
      this.pageNum++;
    },
    closeImage() {
      this.viewActive = false;
    },
    uploadSucess(url, ref, indexs) {
      this.$store.commit("app/LOG_VALUE_IMAGE_ADD", {
        val: { url: url, ref: ref },
        index: { page: indexs[0], question: indexs[1], answer: indexs[2] },
      });
    },
    viewImage(src, evt) {
      var timeout;
      var eventx =
        "ontouchstart" in window ||
        (window.DocumentTouch && document instanceof window.DocumentTouch)
          ? "touchstart"
          : "click";
      if (eventx == "click") {
        this.viewActive = true;
        this.viewSrc = src;
      } else {
        if (evt.type == "touchend") {
          var currentTime = new Date().getTime();
          var tapLength = currentTime - this.lastTap;
          clearTimeout(timeout);
          if (tapLength < 2000 && tapLength > 0) {
            this.viewActive = true;
            this.viewSrc = src;
            event.preventDefault();
          }
          this.lastTap = currentTime;
        }
      }
    },
    removeImage(url, p, q, a) {
      this.$store.commit("app/LOG_VALUE_IMAGE_REMOVE", {
        val: url,
        index: { page: p, question: q, answer: a },
      });
    },
    logValue(value, p, q, a) {
      value = value === null ? "" : value;
      value = value.target !== undefined ? value.target.value : value;
      value = value.id !== undefined ? value.id : value;

      this.$store.commit("app/LOG_VALUE", {
        val: value,
        index: { page: p, question: q, answer: a },
      });
    },
  },
};
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/animate.css@3.5.1");

.my-textarea {
  width: 100%;
  border-radius: 5px;
  min-height: 60px;
  padding: 10px 15px;
  font-family: "Montserrat", Helvetica, Arial, sans-serif;
  line-height: 1.6;
  font-size: 1rem;
  border-color: #cdcdcd;
}
.my-textarea:focus {
  border-color: rgba(var(--vs-primary), 1);
}
.answer-title {
  font-weight: 500;
  color: #1e1c26;
  opacity: 0.9;
}
.page-item.active {
  background: rgba(var(--vs-primary), 0.1);
}
.expand-icon {
  transition: all 0.25s ease;
}
.expand-icon.on {
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg);
}
.expand-icon.off {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
}
.log-priview-header {
  background: white;
  padding: 20px 32px;
}
.log-priview-footer {
  background: white;
  padding: 16px;
}
.scroll-area--log-content {
  height: calc(100vh - 20.5rem) !important;
}
</style>
