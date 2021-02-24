<template>
  <vs-sidebar
    class="items-no-padding log-priview log-sidebar"
    parent="#template-edit"
    :click-not-close="clickNotClose"
    :hidden-background="clickNotClose"
    v-model="active"
    position-right
  >
    <div class="log-priview-header flex itens-center justify-between">
      <p class="karla-bold text-sm color-my-black">{{ $t("preview") }}</p>
      <p class="karla-bold text-sm color-my-black">{{ calcComplateStatus }}</p>
    </div>
    <VuePerfectScrollbar
      class="scroll-area--log-content mt-6 px-3 mb-4"
      :settings="settings"
      ref="pageLists"
    >
      <vx-card class="cursor-pointer" @click.native="viewPage = !viewPage">
        <div slot="no-body" class="px-4 py-3">
          <div class="flex justify-between items-center">
            <div>
              <p class="karla-bold" style="color: #1e1c26">
                {{
                  pages[pageNum].title == ""
                    ? $t("Page Title")
                    : pages[pageNum].title | capitalize
                }}
              </p>
              <p class="karla page-infor">
                {{ $t("page") | capitalize }} {{ pageNum + 1 }} {{ $t("of") }}
                {{ pages.length }}
              </p>
            </div>
            <div class="flex items-center">
              <p class="karla-bold mr-2" style="color: #1e1c26">
                {{ calcPageCompletd }}
              </p>
              <vs-icon
                class="font-bold expand-icon"
                :class="{ on: viewPage, off: !viewPage }"
                icon-pack="feather"
                icon="icon-chevron-down"
              ></vs-icon>
            </div>
          </div>
        </div>
      </vx-card>
      <vx-card class="mt-1 pages-container" v-show="viewPage">
        <div slot="no-body">
          <div
            v-for="(page, index) in pages"
            :key="index"
            class="cursor-pointer p-5 page-item"
            :class="{ active: pageNum == index }"
            @click="pageNum = index"
          >
            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <vs-icon
                  icon-pack="feather"
                  size="18px"
                  class="font-bold"
                  color="primary"
                  icon="icon-check"
                  v-if="index == pageNum"
                />
                <p
                  class="karla-bold truncate"
                  :class="{
                    'ml-4': index == pageNum,
                    'ml-8': index != pageNum,
                  }"
                >
                  {{
                    page.title == ""
                      ? $t("Page Title")
                      : page.title | capitalize
                  }}
                </p>
              </div>
              <p class="karla-bold mr-2" style="color: #1e1c26">
                {{ calcPageCompletd1(index) }}
              </p>
            </div>
          </div>
        </div>
      </vx-card>
      <transition
        v-for="(page, pIndex) in pages"
        :key="pIndex"
        name="custom-classes-transition"
        :enter-active-class="enterClass"
      >
        <div class="w-full mt-4" v-if="pageNum == pIndex">
          <vx-card
            v-for="(question, qIndex) in page.questions"
            :key="qIndex"
            class="mb-4"
          >
            <div slot="no-body" class="px-5 py-4">
              <div class="vx-row items-center mb-2">
                <div class="vx-col w-5/6 p-0">
                  <p class="karla-bold text-primary">
                    {{
                      question.title == ""
                        ? $t("section title")
                        : question.title | capitalize
                    }}
                  </p>
                </div>
                <div class="vx-col w-1/6 p-0">
                  <p class="karla-bold text-right" style="color: #1e1c26">
                    {{ calcQuestionCompletd(pIndex, qIndex) }}
                  </p>
                </div>
              </div>
              <vs-divider position="left" class="m-0 mt-3 mb-2"></vs-divider>
              <div
                v-for="(answer, aIndex) in question.answers"
                :key="aIndex"
                class="mt-5"
              >
                <div class="answer-title karla flex">
                  {{
                    answer.title == ""
                      ? $t("question name")
                      : answer.title | capitalize
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
                      answer.type.tempUnit === undefined
                        ? "℃"
                        : answer.type.tempUnit
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
                      v-for="(content, cIndex) in getTemplateType(
                        answer.type.id
                      ).content"
                      :key="'c' + cIndex"
                    >
                      <div
                        v-if="
                          pages[pIndex].questions[qIndex].answers[aIndex]
                            .loged == content.name
                        "
                        class="flex items-center justify-center border border-solid rounded-lg py-3 cursor-pointer mt-2"
                        :style="`background:${hexToRGB(
                          content.color
                        )}; border-color:${hexToRGB(content.color)};`"
                      >
                        <span
                          class="karla text-white"
                          v-if="
                            getTemplateType(answer.type.id).group == 'global'
                          "
                          >{{ $t(content.name) }}</span
                        >
                        <span class="karla text-white" v-else>{{
                          content.name | capitalize
                        }}</span>
                      </div>
                      <div
                        v-else
                        class="flex items-center justify-center border border-solid rounded-lg py-3 cursor-pointer mt-2"
                        @click="logValue(content.name, pIndex, qIndex, aIndex)"
                      >
                        <span
                          v-if="
                            getTemplateType(answer.type.id).group == 'global'
                          "
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
                          pages[pIndex].questions[qIndex].answers[aIndex].loged
                        "
                        v-on:input="logValue($event, pIndex, qIndex, aIndex)"
                      />
                      <div class="flex items-center">
                        <span
                          @click="
                            logValue(
                              Math.round(
                                pages[pIndex].questions[qIndex].answers[aIndex]
                                  .loged
                              ) + 1,
                              pIndex,
                              qIndex,
                              aIndex
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
                              pages[pIndex].questions[qIndex].answers[aIndex]
                                .loged - 1,
                              pIndex,
                              qIndex,
                              aIndex
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
                          'signaturePad_' + pIndex + '_' + qIndex + '_' + aIndex
                        "
                        class="w-full border border-solid d-theme-border-grey-light"
                        :options="{ onBegin, onEnd }"
                      />
                      <div class="w-full flex justify-between mt-2">
                        <vs-button
                          color="danger"
                          @click="clearSign(pIndex, qIndex, aIndex)"
                          >{{ $t("clear") }}</vs-button
                        >
                        <vs-button
                          color="warning"
                          @click="undoSign(pIndex, qIndex, aIndex)"
                          >{{ $t("undo") }}</vs-button
                        >
                        <vs-button @click="saveSign(pIndex, qIndex, aIndex)">{{
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
                        style="
                          white-space: pre-wrap;
                          font-size: 12px;
                          color: #86848a;
                        "
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
                      :value="
                        pages[pIndex].questions[qIndex].answers[aIndex].loged
                      "
                      v-on:input="logValue($event, pIndex, qIndex, aIndex)"
                    ></vs-checkbox>
                  </template>
                  <template
                    v-else-if="
                      answer.type.id !== undefined &&
                      getTemplateType(answer.type.id) !== undefined &&
                      (getTemplateType(answer.type.id).content == 'paragraph' ||
                        getTemplateType(answer.type.id).content ==
                          'short answer')
                    "
                  >
                    <div class="w-full">
                      <textarea
                        class="my-textarea"
                        :value="
                          pages[pIndex].questions[qIndex].answers[aIndex].loged
                        "
                        @blur="
                          logValue($event.target.value, pIndex, qIndex, aIndex)
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
                          pages[pIndex].questions[qIndex].answers[aIndex].loged
                        "
                        @blur="logValue($event, pIndex, qIndex, aIndex)"
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
                            pages[pIndex].questions[qIndex].answers[aIndex]
                              .loged * -1,
                            pIndex,
                            qIndex,
                            aIndex
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
                          pages[pIndex].questions[qIndex].answers[aIndex].value
                        "
                        @rating-selected="
                          logValue($event, pIndex, qIndex, aIndex)
                        "
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
                        :a="aIndex"
                        :score="
                          pages[pIndex].questions[qIndex].answers[aIndex].loged
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
                          pages[pIndex].questions[qIndex].answers[aIndex].loged
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
                        pages[pIndex].questions[qIndex].answers[aIndex].loged
                      "
                      :p="pIndex"
                      :q="qIndex"
                      :a="aIndex"
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
                            pages[pIndex].questions[qIndex].answers[aIndex]
                              .loged
                          )
                        "
                        @input="logValue($event, pIndex, qIndex, aIndex, true)"
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
                            pages[pIndex].questions[qIndex].answers[aIndex]
                              .loged
                          )
                        "
                        @input="logValue($event, pIndex, qIndex, aIndex, true)"
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
                          pages[pIndex].questions[qIndex].answers[aIndex].loged
                        "
                        @input="logValue($event, pIndex, qIndex, aIndex)"
                        :options="
                          pages[pIndex].questions[qIndex].answers[aIndex].type
                            .dropdown === undefined
                            ? []
                            : pages[pIndex].questions[qIndex].answers[
                                aIndex
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
                          pages[pIndex].questions[qIndex].answers[aIndex].loged
                        "
                        @input="logValue($event, pIndex, qIndex, aIndex)"
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
                          pages[pIndex].questions[qIndex].answers[aIndex].loged
                        "
                        @input="logValue($event, pIndex, qIndex, aIndex)"
                      />
                      <flat-pickr
                        v-else-if="answer.type.dateType == 'Time'"
                        class="flatpickr-input w-full"
                        :config="configTimePicker"
                        :value="
                          pages[pIndex].questions[qIndex].answers[aIndex].loged
                        "
                        @input="logValue($event, pIndex, qIndex, aIndex)"
                      />
                      <flat-pickr
                        v-else-if="answer.type.dateType == 'Date & Time'"
                        class="flatpickr-input w-full"
                        :config="configDateTimePicker"
                        :value="
                          pages[pIndex].questions[qIndex].answers[aIndex].loged
                        "
                        @input="logValue($event, pIndex, qIndex, aIndex)"
                      />
                    </div>
                  </template>
                  <template
                    v-else-if="
                      answer.type.id !== undefined &&
                      getTemplateType(answer.type.id) !== undefined &&
                      getTemplateType(answer.type.id).content ==
                        'automatic user stamp'
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
                            v-for="(image, imageKey) in pages[pIndex].questions[
                              qIndex
                            ].answers[aIndex].loged"
                            :key="imageKey"
                          >
                            <button
                              type="button"
                              class="btn-x-file"
                              @click="
                                removeImage(image.url, pIndex, qIndex, aIndex)
                              "
                            >
                              <i
                                translate="translate"
                                class="material-icons notranslate"
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
                            :indexs="[pIndex, qIndex, aIndex]"
                            @url="uploadSucess"
                          />
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </vx-card>
        </div>
      </transition>
    </VuePerfectScrollbar>
    <div class="log-priview-footer flex justify-between">
      <vs-button
        color="rgba(108, 80, 240, 0.1)"
        text-color="rgba(108, 80, 240)"
        class="ml-2 mr-4 px-4"
        :disabled="pageNum == 0"
        @click="minusPage"
      >
        <span class="karla px-6">{{ $t("back") }}</span>
      </vs-button>
      <vs-button
        :disabled="pageNum >= pages.length - 1"
        color="rgba(108, 80, 240, 1)"
        class="ml-2 mr-4 px-4"
        @click="plusPage"
      >
        <span class="karla px-6">{{ $t("next") }}</span>
      </vs-button>
    </div>
  </vs-sidebar>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import Datepicker from "vuejs-datepicker";
import StarRating from "vue-star-rating";
import VSelect from "vue-select";
import FileUpload from "@/components/file-upload/FileUpload.vue";
import ViewUpload from "@/components/file-upload/ViewUpload.vue";
import ScoreItem from "../tasks/ScoreItem";
import FoodItem from "../tasks/FoodItem";
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
  },
  data() {
    return {
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
  methods: {
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
      console.log("logValue", value, p, q, a);
      value = value === null ? "" : value;
      value = value.target !== undefined ? value.target.value : value;
      value = value.id !== undefined ? value.id : value;

      this.$store.commit("app/LOG_VALUE", {
        val: value,
        index: { page: p, question: q, answer: a },
      });
    },
  },
  computed: {
    calcComplateStatus() {
      var count = 0;
      var _complated = 0;
      this.pages.map((page, p) => {
        page.questions.map((question, q) => {
          question.answers.map((answer, a) => {
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
          question.answers.map((answer) => {
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
        question.answers.map((answer) => {
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
          question.answers.map((answer) => {
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
  },
};
</script>
<style>
.log-priview.log-sidebar .vs-sidebar.vs-sidebar-parent {
  position: absolute !important;
}
.log-priview .vs-sidebar.vs-sidebar-parent {
  width: 375px !important;
  max-width: 375px !important;
  top: 5.7rem;
  background: #ebebf1;
  height: calc(100vh - 9rem) !important;
  /* box-shadow: none; */
  border: 1px solid rgba(113, 102, 237, 0.16);
  border-top: none;
  border-right: none;
  border-bottom: none;
}
</style>

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
