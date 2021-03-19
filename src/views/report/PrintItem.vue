<template>
  <div class="report-content px-base" v-if="Object.keys(this.item).length > 0">
    <table class="w-full" style="border-spacing: 0px">
      <thead>
        <tr>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(logTR, index) in logData"
          :key="index"
          style="border-spacing: 0px"
        >
          <template v-if="logTR.field == 'template'">
            <td>
              <div
                class="mt-base flex flex-wrap justify-between items-center w-full"
              >
                <div class="flex items-center">
                  <div>
                    <vs-avatar
                      class="sender__avatar--single flex-shrink-0 mr-3 border-2 border-solid border-white"
                      :src="
                        applyImage(
                          getTemplateInfo(logTR.data).content.templateImage
                        )
                      "
                      size="65px"
                    ></vs-avatar>
                  </div>
                  <div class="flex flex-col">
                    <h5 class="mb-1">
                      {{
                        getTemplateInfo(logTR.data).content.templateTitle
                          | capitalize
                      }}
                    </h5>
                  </div>
                </div>

                <div class="flex-col" style="margin-left: auto">
                  <div
                    class="flex self-end whitespace-no-wrap"
                    style="width: 150px"
                  >
                    <vs-progress :percent="complated" :color="calcColor()" />
                  </div>
                  <div class="flex sm:mr-0 mr-2 self-end whitespace-no-wrap">
                    {{ calcComplate() }}
                  </div>
                  <div class="mt-2">
                    <span class="text-success">{{
                      item.updated_at.toDate() | moment("DD/MMM/YYYY @ HH[h]mm")
                    }}</span>
                  </div>
                </div>
              </div>
            </td>
          </template>

          <template v-else-if="logTR.field == 'page'">
            <td>
              <h5 class="mt-4 ml-4 text-primary">{{ logTR.data }}</h5>
            </td>
          </template>
          <template v-else-if="logTR.field == 'question'">
            <table
              class="w-full px-base mb-4 questionTable"
              style="border-spacing: 0px"
            >
              <thead>
                <tr>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(questionTR, qIndex) in logTR.data"
                  :key="index + '_' + qIndex"
                >
                  <template v-if="questionTR.field == 'question'">
                    <td colspan="3">
                      <h6 class="bg-success p-3 text-white">
                        {{ questionTR.title }}
                      </h6>
                    </td>
                  </template>
                  <!-- <template
                    v-if="questionTR.field == 'answer' && getType(questionTR.data.ref.type.id).content !='instruction'"
                  >-->
                  <template v-if="questionTR.field == 'answer'">
                    <td
                      width="30%"
                      class="p-2 border border-solid border-r-0 d-theme-border-grey-light border-t-0"
                    >
                      {{ questionTR.data.ref.title }}
                      <span
                        v-if="questionTR.data.ref.type.tempUnit"
                        class="text-success"
                        >({{ questionTR.data.ref.type.tempUnit }})</span
                      >
                      <span
                        v-if="questionTR.data.ref.mandatory"
                        class="text-danger"
                        >*</span
                      >
                    </td>
                    <td
                      class="p-2 border border-solid d-theme-border-grey-light border-t-0"
                    >
                      <span class="text-danger" v-if="!questionTR.data.loged"
                        >---</span
                      >
                      <span
                        v-else-if="
                          getType(questionTR.data.ref.type.id).content ==
                            'automatic date and time stamp' ||
                          getType(questionTR.data.ref.type.id).content == 'date'
                        "
                        >{{
                          convDate(questionTR)
                            | moment("DD MMMM ,YYYY @ HH[h]mm")
                        }}</span
                      >
                      <template
                        v-else-if="
                          getType(questionTR.data.ref.type.id).content ==
                          'date time'
                        "
                      >
                        <span
                          v-if="questionTR.data.ref.type.dateType == 'Date'"
                          >{{
                            questionTR.data.value | moment("DD MMMM ,YYYY")
                          }}</span
                        >
                        <span
                          v-else-if="
                            questionTR.data.ref.type.dateType == 'Time'
                          "
                          >{{ questionTR.data.value | moment("HH:mm") }}</span
                        >
                        <span
                          v-else-if="
                            questionTR.data.ref.type.dateType == 'Date & Time'
                          "
                          >{{
                            questionTR.data.value
                              | moment("DD MMMM ,YYYY @ HH[h]mm")
                          }}</span
                        >
                      </template>
                      <span
                        v-else-if="
                          getType(questionTR.data.ref.type.id).content == 'star'
                        "
                      >
                        <star-rating
                          :star-size="25"
                          :read-only="true"
                          :increment="0.1"
                          :fixed-points="1"
                          :rating="questionTR.data.value"
                        ></star-rating>
                      </span>
                      <span
                        v-else-if="
                          getType(questionTR.data.ref.type.id).content ==
                          'automatic user stamp'
                        "
                        >{{
                          getUserInfo(questionTR.data.value).name | capitalize
                        }}</span
                      >
                      <div
                        v-else-if="
                          getType(questionTR.data.ref.type.id).content ==
                            'short answer' ||
                          getType(questionTR.data.ref.type.id).content ==
                            'paragraph'
                        "
                        class="text-primary"
                        style="font-style: italic; white-space: pre-wrap"
                      >
                        {{ questionTR.data.value }}
                      </div>
                      <vs-checkbox
                        v-else-if="
                          getType(questionTR.data.ref.type.id).content ==
                          'checkbox'
                        "
                        disabled="true"
                        :value="questionTR.data.value"
                      ></vs-checkbox>
                      <template
                        v-else-if="
                          getType(questionTR.data.ref.type.id).content ==
                          'items'
                        "
                      >
                        <span
                          v-if="getItemInfo(questionTR.data.value) != undefined"
                          >{{ getItemInfo(questionTR.data.value).name }}</span
                        >
                      </template>
                      <template
                        v-else-if="
                          getType(questionTR.data.ref.type.id).content ==
                          'users'
                        "
                      >
                        <span
                          v-if="getUserInfo(questionTR.data.value) != undefined"
                          >{{
                            getUserInfo(questionTR.data.value).name | capitalize
                          }}</span
                        >
                      </template>
                      <template
                        v-else-if="
                          getType(questionTR.data.ref.type.id).content ==
                          'teams'
                        "
                      >
                        <span
                          v-if="getTeamInfo(questionTR.data.value) != undefined"
                          >{{
                            getTeamInfo(questionTR.data.value).name | capitalize
                          }}</span
                        >
                      </template>
                      <template
                        v-else-if="
                          getType(questionTR.data.ref.type.id).type ==
                          'attachments'
                        "
                      >
                        <span
                          v-for="(image, iIndex) in questionTR.data.images"
                          :key="'image' + iIndex"
                        >
                          <a :href="image.url" target="_blank">
                            <span v-if="iIndex > 0">,</span>
                            Attachment{{ iIndex }}
                          </a>
                        </span>
                      </template>
                      <div
                        v-else-if="
                          getType(questionTR.data.ref.type.id).content ==
                          'instruction'
                        "
                        class="text-primary"
                        style="font-style: italic; white-space: pre-wrap"
                      >
                        {{ questionTR.data.ref.type.instruction }}
                      </div>
                      <template
                        v-else-if="
                          getType(questionTR.data.ref.type.id).content ==
                          'signature'
                        "
                      >
                        <img
                          :src="questionTR.data.value.url"
                          v-if="
                            questionTR.data.value.url !== undefined &&
                            questionTR.data.value.url != ''
                          "
                        />
                      </template>
                      <template
                        v-else-if="
                          getType(questionTR.data.ref.type.id).type ==
                          'closed answers'
                        "
                      >
                        <span
                          v-if="
                            getType(questionTR.data.ref.type.id).group ==
                            'global'
                          "
                          :class="[
                            {
                              'text-danger':
                                questionTR.data.ref.type.failedAnswer ==
                                questionTR.data.value,
                            },
                          ]"
                          >{{ $t(questionTR.data.value) | capitalize }}</span
                        >
                        <span
                          v-else
                          :class="[
                            {
                              'text-danger':
                                questionTR.data.ref.type.failedAnswer ==
                                questionTR.data.value,
                            },
                          ]"
                          >{{ questionTR.data.value | capitalize }}</span
                        >
                      </template>
                      <span v-else>{{ questionTR.data.value }}</span>
                    </td>
                    <!-- <td
                      class="p-2 border border-solid d-theme-border-grey-light border-t-0"
                      width="30%"
                    ></td>-->
                  </template>
                </tr>
              </tbody>
            </table>
            <!-- 			  
            <td class style="border-top: 10px solid; border-color: transparent;">
              <h6 class="bg-success p-3 text-white">{{logTR.data}}</h6>
            </td>-->
          </template>
          <template v-else-if="logTR.field == 'answer'">
            <!-- <td
              class="p-2 border border-solid border-r-0 d-theme-border-grey-light border-t-0"
            >{{logTR.data.ref.title}}</td>-->
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import StarRating from "vue-star-rating";

export default {
  components: {
    StarRating,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      complated: 0,
    };
  },
  computed: {
    convDate() {
      return (date) => {
        if (date.seconds === undefined) return date;
        return new Date(date.seconds * 1000);
      };
    },
    logData() {
      if (!Object.keys(this.item)) return [];
      var logData = [];
      logData.push({
        field: "template",
        data: this.item.templateID,
        key: this.item.templateID,
      });
      this.item.logs.map((page, pIndex) => {
        logData.push({
          field: "page",
          data: page.title,
          key: "page_" + pIndex,
        });
        page.questions.map((question) => {
          var questionData = [];
          questionData.push({
            field: "question",
            title: question.title,
          });
          question.answers.map((answer) => {
            questionData.push({
              field: "answer",
              data: answer,
            });
          });
          logData.push({
            field: "question",
            data: questionData,
          });
        });
      });
      return logData;
    },
    getTeamInfo() {
      return (id) => {
        return this.$store.getters["app/getTeamById"](id);
      };
    },
    getItemInfo() {
      return (id) => {
        return this.$store.getters["app/getItemById"](id);
      };
    },
    getUserInfo() {
      return (id) => {
        return this.$store.getters["app/getUserById"](id);
      };
    },
    removeInstruction() {
      return (answers) => {
        var instruction = this.$store.getters["app/getTemplateTypeByContent"](
          "instruction"
        );
        answers = answers.filter((item) => {
          return item.ref.type.id != instruction.id;
        });
        return answers;
      };
    },
    getTemplateInfo() {
      return (id) => {
        return this.$store.getters["app/getTemplateById"](id);
      };
    },
    calcColor() {
      return () => {
        if (this.complated < 30) return "danger";
        else if (this.complated < 80) return "warning";
        else return "success";
      };
    },
    getType() {
      return (id) => {
        var type = this.$store.getters["app/getTemplateTypeById"](id);
        return type;
      };
    },
    calcComplate() {
      return () => {
        var count = 0;
        var _complated = 0;
        this.item.logs.map((page, p) => {
          page.questions.map((question, q) => {
            question.answers.map((answer, a) => {
              if (answer.ref.mandatory) {
                if (this.item.logs[p].questions[q].answers[a].loged) {
                  if (
                    answer.ref.type.failedAnswer === undefined ||
                    answer.ref.type.failedAnswer === "" ||
                    this.item.logs[p].questions[q].answers[a].value !=
                      answer.ref.type.failedAnswer
                  )
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
      };
    },
  },
  methods: {
    applyImage(image) {
      if (image.indexOf("firebasestorage") > -1) {
        return image;
      }
      return require(`@/assets/images/template_image/${image}`);
    },
  },
};
</script>

<style >
/* @media print {
  .log-question-content {
    page-break-inside: auto;
  }
  .log-question-content > .vx-col {
    page-break-inside: avoid;
    page-break-after: auto;
  }
} */
</style>