<template>
  <div class="break-inside-avoid">
    <div
      id="report-overview"
      style="min-height: 900px"
      class="break-inside-avoid"
    >
      <div class="logo">
        <img
          :src="
            applyImage(getTemplateInfo(log.templateID).content.templateImage)
          "
          height="50"
          width="50"
          ref="tem_img"
        />
        <!-- <img :src="tmpl_logo" alt="template logo" /> -->
      </div>
      <h2 style="margin-top: 15px; font-size: 24px">
        {{ getTemplateInfo(log.templateID).content.templateTitle }}
      </h2>
      <div style="margin-top: 10px; margin-bottom: 10px">
        <div class="flex justify-between">
          <h3 style="font-size: 20px; color: gray">
            {{ new Date(log.updated_at.toDate()) | moment("Do MMM YY") }} /
            {{ this.getUserInfo(this.log.updated_by).name }}
          </h3>
          <p style="font-size: 14px; color: black; text-align: right">
            {{ logInfo.status }}
          </p>
        </div>
      </div>
      <div class="overview-data">
        <div class="flex flex-wrap justify-between overview-data-header">
          <div>
            <span class="float-left">Score</span>
            <span class="float-right">{{ reportInfo.score }}</span>
          </div>
          <div
            style="border-left: 2px solid white; border-right: 2px solid white"
          >
            <span class="float-left">Failed items</span>
            <span class="float-right">{{ logInfo.failed }}</span>
          </div>
          <div>
            <span class="float-left">Actions</span>
            <span class="float-right">{{ 0 }}</span>
          </div>
        </div>
        <div class="overview-data-body">
          <div class="flex justify-between">
            <div>Conducted on</div>
            <div>
              {{
                new Date(log.updated_at.toDate()) | moment("Do MMM YY, hh:mm A")
              }}
            </div>
          </div>
          <div class="flex justify-between">
            <div>Prepared by</div>
            <div>{{ getUserInfo(log.updated_by).name | capitalize }}</div>
          </div>
          <div class="flex justify-between">
            <div>Country</div>
            <div>
              <template
                v-for="(location, index) in getLocationsByNames(oneLog)
                  .locationCountries"
              >
                <span :key="location.key">{{ location.key | capitalize }}</span>
                <span
                  :key="'2' + location.key"
                  v-if="
                    getLocationsByNames(oneLog).locationCountries.length !=
                    index + 1
                  "
                  >,
                </span>
              </template>
            </div>
          </div>
          <div class="flex justify-between">
            <div>Region</div>
            <div>
              <template
                v-for="(location, index) in getLocationsByNames(oneLog)
                  .locationRegions"
              >
                <span :key="location.key">{{ location.key | capitalize }}</span>
                <span
                  :key="'2' + location.key"
                  v-if="
                    getLocationsByNames(oneLog).locationRegions.length !=
                    index + 1
                  "
                  >,
                </span>
              </template>
            </div>
          </div>
          <div class="flex justify-between">
            <div>Area</div>
            <div>
              <template
                v-for="(location, index) in getLocationsByNames(oneLog)
                  .locationAreas"
              >
                <span :key="location.key">{{ location.key | capitalize }}</span>
                <span
                  :key="'2' + location.key"
                  v-if="
                    getLocationsByNames(oneLog).locationAreas.length !=
                    index + 1
                  "
                  >,
                </span>
              </template>
            </div>
          </div>
          <div class="flex justify-between">
            <div>Location</div>
            <div>
              <template
                v-for="(location, index) in getLocationsByNames(oneLog)
                  .locationNames"
              >
                <span :key="location.id">{{ location.name | capitalize }}</span>
                <span
                  :key="'2' + location.id"
                  v-if="
                    getLocationsByNames(oneLog).locationNames.length !=
                    index + 1
                  "
                  >,
                </span>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      id="failed-items "
      class="break-inside-avoid"
      style="min-height: 900px"
      v-if="failedItems.length > 0"
    >
      <div
        class="flex justify-between"
        style="background: #ededed; padding: 7px 10px; font-size: 22px"
      >
        <div>Failed Items</div>
        <div style="font-size: 13px; margin-top: 7px">
          {{ logInfo.failed }} failed
        </div>
      </div>

      <div
        v-for="(answer, index) in failedItems"
        :key="'fi' + index"
        class="flex flex-wrap"
      >
        <div
          style="padding: 7px 10px"
          class="w-full"
          v-if="answer.page.title != ''"
        >
          {{ answer.page.title }}
        </div>
        <div
          style="border-bottom: 1px solid #ededed"
          class="flex justify-between; w-full"
        >
          <div style="padding: 7px 10px; width: 70%">
            {{ answer.ref.title }}
          </div>
          <div
            style="
              padding: 7px 10px;
              text-align: center;
              background: rgb(191 10 10);
              color: white;
              width: 30%;
              display: flex;
              justify-content: center;
              align-items: center;
            "
          >
            <span>{{ answer.value }}</span>
          </div>
        </div>
      </div>
    </div>

    <div id="all-items" style="min-height: 900px" class="break-inside-avoid">
      <div
        v-for="(page, pIndex) in log.logs"
        :key="'page-' + pIndex"
        style="min-height: 900px"
        class="break-inside-avoid"
      >
        <div
          class="flex justify-between background-color-ededed"
          style="background: #ededed; padding: 7px 10px; font-size: 22px"
        >
          <div>{{ page.title }}</div>
          <div style="font-size: 13px; margin-top: 7px">
            {{ failedItemsPerLog(page).length }} failed
          </div>
        </div>
        <template v-for="(question, qIndex) in page.questions">
          <template v-for="(answer, aIndex) in question.answers">
            <div
              class="flex justify-between"
              v-if="
                getType(answer.ref.type.id) !== undefined &&
                answer.ref.isLogicQuestion != true
              "
              :key="'pAnswer' + aIndex + qIndex"
            >
              <div
                style="
                  padding: 7px 10px;
                  border-bottom: 1px solid #ededed;
                  width: 70%;
                "
                v-if="getType(answer.ref.type.id).type != 'attachments'"
              >
                {{ answer.ref.title }}
              </div>
              <div
                :colspan="
                  getType(answer.ref.type.id).type == 'attachments' ? 2 : 0
                "
                v-bind:style="{
                  background: getColor(answer),
                  padding: '7px 10px',
                  'border-bottom': '1px solid #ededed',
                  'font-size': '13px',
                }"
                v-bind:class="{
                  closedAnswerTd:
                    getType(answer.ref.type.id).type == 'closed answers',
                  imgTd: getType(answer.ref.type.id).type == 'attachments',
                  normalAnswerTd:
                    getType(answer.ref.type.id).type != 'closed answers' &&
                    getType(answer.ref.type.id).type != 'attachments',
                }"
              >
                <vs-checkbox
                  v-if="getType(answer.ref.type.id).content == 'checkbox'"
                  disabled="true"
                  :value="answer.value"
                  style="float: right"
                ></vs-checkbox>
                <p
                  v-else-if="!answer.loged"
                  style="color: rgb(191, 10, 10); text-align: right"
                >
                  ---
                </p>
                <span
                  v-else-if="
                    getType(answer.ref.type.id).content ==
                      'automatic date and time stamp' ||
                    getType(answer.ref.type.id).content == 'date'
                  "
                  >{{
                    convDate(answer.value) | moment("DD MMMM ,YYYY @ HH[h]mm")
                  }}</span
                >
                <template
                  v-else-if="getType(answer.ref.type.id).content == 'date time'"
                >
                  <span v-if="answer.ref.type.dateType == 'Date'">{{
                    answer.value | moment("DD MMMM ,YYYY")
                  }}</span>
                  <span v-else-if="answer.ref.type.dateType == 'Time'">{{
                    answer.value | moment("HH:mm")
                  }}</span>
                  <span v-else-if="answer.ref.type.dateType == 'Date & Time'">{{
                    answer.value | moment("DD MMMM ,YYYY @ HH[h]mm")
                  }}</span>
                </template>
                <star-rating
                  v-else-if="getType(answer.ref.type.id).content == 'star'"
                  :star-size="25"
                  :read-only="true"
                  :increment="0.1"
                  :fixed-points="1"
                  :rating="answer.value"
                ></star-rating>
                <span
                  v-else-if="
                    getType(answer.ref.type.id).content ==
                      'automatic user stamp' &&
                    getUserInfo(answer.value) != undefined
                  "
                  >{{ getUserInfo(answer.value).name | capitalize }}</span
                >
                <div
                  v-else-if="
                    getType(answer.ref.type.id).content == 'short answer' ||
                    getType(answer.ref.type.id).content == 'paragraph'
                  "
                  style="
                      color: #7367F0,
                      font-style: italic;
                      white-space: pre-wrap;
                      word-break: break-word;
                    "
                >
                  {{ answer.value }}
                </div>
                <template
                  v-else-if="getType(answer.ref.type.id).content == 'items'"
                >
                  <span v-if="getItemInfo(answer.value) != undefined">{{
                    getItemInfo(answer.value).name
                  }}</span>
                </template>
                <template
                  v-else-if="getType(answer.ref.type.id).content == 'users'"
                >
                  <span v-if="getUserInfo(answer.value) != undefined">{{
                    getUserInfo(answer.value).name | capitalize
                  }}</span>
                </template>
                <template
                  v-else-if="getType(answer.ref.type.id).content == 'teams'"
                >
                  <span v-if="getTeamInfo(answer.value) != undefined">{{
                    getTeamInfo(answer.value).name | capitalize
                  }}</span>
                </template>
                <template
                  v-else-if="getType(answer.ref.type.id).type == 'attachments'"
                >
                  <p
                    style="
                      font-size: 15px;
                      margin-bottom: 7px;
                      text-align: left;
                    "
                  >
                    {{ answer.ref.title }}
                  </p>
                  <div class="flex flex-wrap">
                    <span
                      v-for="(image, imgIndex) in answer.images"
                      :key="'img_' + imgIndex"
                      style="margin-right: 4px"
                    >
                      <img
                        :src="image.url"
                        width="80"
                        height="80"
                        style="border-radius: 7px"
                      />
                    </span>
                  </div>
                </template>
                <div
                  v-else-if="
                    getType(answer.ref.type.id).content == 'instruction'
                  "
                  style="
                    font-size: 12px;
                    color: #86848a;
                    font-weight: normal;
                    white-space: pre-wrap;
                    word-break: break-word;
                  "
                >
                  {{ answer.ref.type.instruction }}
                </div>
                <template
                  v-else-if="
                    getType(answer.ref.type.id).content == 'temperature'
                  "
                >
                  <span
                    :class="
                      calcTemperatureColor(answer.ref.action, answer.value)
                    "
                    v-if="answer.value !== undefined"
                    >{{ answer.value }}</span
                  >
                </template>
                <template
                  v-else-if="getType(answer.ref.type.id).content == 'signature'"
                >
                  <img
                    :src="answer.value.url"
                    v-if="
                      answer.value.url !== undefined && answer.value.url != ''
                    "
                    style="width: 100%"
                  />
                </template>
                <template
                  v-else-if="
                    getType(answer.ref.type.id).type == 'closed answers'
                  "
                >
                  <span
                    v-if="getType(answer.ref.type.id).group == 'global'"
                    class="closed-answer-span"
                    >{{ $t(answer.value) }}</span
                  >
                  <span v-else class="closed-answer-span">{{
                    answer.value | capitalize
                  }}</span>
                </template>
                <span v-else>{{ answer.value }}</span>
              </div>
            </div>
            <template
              v-for="cAnswer in filteredAnswers(question.answers, answer)"
            >
              <div :key="cAnswer.id" class="flex justify-between">
                <div
                  style="
                    padding: 7px 10px;
                    border-bottom: 1px solid #ededed;
                    width: 70%;
                  "
                  v-if="getType(cAnswer.ref.type.id).type != 'attachments'"
                >
                  {{ cAnswer.ref.title }}
                </div>
                <div
                  :colspan="
                    getType(cAnswer.ref.type.id).type == 'attachments' ? 2 : 0
                  "
                  v-bind:style="{
                    background: getColor(cAnswer),
                    padding: '7px 10px',
                    'border-bottom': '1px solid #ededed',
                    'font-size': '13px',
                  }"
                  v-bind:class="{
                    closedAnswerTd:
                      getType(cAnswer.ref.type.id).type == 'closed answers',
                    imgTd: getType(cAnswer.ref.type.id).type == 'attachments',
                    normalAnswerTd:
                      getType(cAnswer.ref.type.id).type != 'closed answers' &&
                      getType(cAnswer.ref.type.id).type != 'attachments',
                  }"
                >
                  <vs-checkbox
                    v-if="getType(cAnswer.ref.type.id).content == 'checkbox'"
                    disabled="true"
                    :value="cAnswer.value"
                    style="float: right"
                  ></vs-checkbox>
                  <p
                    v-else-if="!cAnswer.loged"
                    style="color: rgb(191, 10, 10); text-align: right"
                  >
                    ---
                  </p>
                  <span
                    v-else-if="
                      getType(cAnswer.ref.type.id).content ==
                        'automatic date and time stamp' ||
                      getType(cAnswer.ref.type.id).content == 'date'
                    "
                    >{{
                      convDate(cAnswer.value)
                        | moment("DD MMMM ,YYYY @ HH[h]mm")
                    }}</span
                  >
                  <template
                    v-else-if="
                      getType(cAnswer.ref.type.id).content == 'date time'
                    "
                  >
                    <span v-if="cAnswer.ref.type.dateType == 'Date'">{{
                      cAnswer.value | moment("DD MMMM ,YYYY")
                    }}</span>
                    <span v-else-if="cAnswer.ref.type.dateType == 'Time'">{{
                      cAnswer.value | moment("HH:mm")
                    }}</span>
                    <span
                      v-else-if="cAnswer.ref.type.dateType == 'Date & Time'"
                      >{{
                        cAnswer.value | moment("DD MMMM ,YYYY @ HH[h]mm")
                      }}</span
                    >
                  </template>
                  <star-rating
                    v-else-if="getType(cAnswer.ref.type.id).content == 'star'"
                    :star-size="25"
                    :read-only="true"
                    :increment="0.1"
                    :fixed-points="1"
                    :rating="cAnswer.value"
                  ></star-rating>
                  <span
                    v-else-if="
                      getType(cAnswer.ref.type.id).content ==
                        'automatic user stamp' &&
                      getUserInfo(cAnswer.value) != undefined
                    "
                    >{{ getUserInfo(cAnswer.value).name | capitalize }}</span
                  >
                  <div
                    v-else-if="
                      getType(cAnswer.ref.type.id).content == 'short answer' ||
                      getType(cAnswer.ref.type.id).content == 'paragraph'
                    "
                    class="text-primary"
                    style="
                      font-style: italic;
                      white-space: pre-wrap;
                      word-break: break-word;
                    "
                  >
                    {{ cAnswer.value }}
                  </div>
                  <template
                    v-else-if="getType(cAnswer.ref.type.id).content == 'items'"
                  >
                    <span v-if="getItemInfo(cAnswer.value) != undefined">{{
                      getItemInfo(cAnswer.value).name
                    }}</span>
                  </template>
                  <template
                    v-else-if="getType(cAnswer.ref.type.id).content == 'users'"
                  >
                    <span v-if="getUserInfo(cAnswer.value) != undefined">{{
                      getUserInfo(cAnswer.value).name | capitalize
                    }}</span>
                  </template>
                  <template
                    v-else-if="getType(cAnswer.ref.type.id).content == 'teams'"
                  >
                    <span v-if="getTeamInfo(cAnswer.value) != undefined">{{
                      getTeamInfo(cAnswer.value).name | capitalize
                    }}</span>
                  </template>
                  <template
                    v-else-if="
                      getType(cAnswer.ref.type.id).type == 'attachments'
                    "
                  >
                    <p
                      style="
                        font-size: 15px;
                        margin-bottom: 7px;
                        text-align: left;
                      "
                    >
                      {{ cAnswer.ref.title }}
                    </p>
                    <div class="flex flex-wrap">
                      <span
                        v-for="(image, imgIndex) in cAnswer.images"
                        :key="'img_' + imgIndex"
                        style="margin-right: 4px"
                      >
                        <img
                          :src="image.url"
                          width="80"
                          height="80"
                          style="border-radius: 7px"
                        />
                      </span>
                    </div>
                  </template>
                  <div
                    v-else-if="
                      getType(cAnswer.ref.type.id).content == 'instruction'
                    "
                    style="
                      font-size: 12px;
                      color: #86848a;
                      font-weight: normal;
                      white-space: pre-wrap;
                      word-break: break-word;
                    "
                  >
                    {{ cAnswer.ref.type.instruction }}
                  </div>
                  <template
                    v-else-if="
                      getType(cAnswer.ref.type.id).content == 'temperature'
                    "
                  >
                    <span
                      :class="
                        calcTemperatureColor(cAnswer.ref.action, cAnswer.value)
                      "
                      v-if="cAnswer.value !== undefined"
                      >{{ cAnswer.value }}</span
                    >
                  </template>
                  <template
                    v-else-if="
                      getType(cAnswer.ref.type.id).content == 'signature'
                    "
                  >
                    <img
                      :src="cAnswer.value.url"
                      v-if="
                        cAnswer.value.url !== undefined &&
                        cAnswer.value.url != ''
                      "
                      style="width: 100%"
                    />
                  </template>
                  <template
                    v-else-if="
                      getType(cAnswer.ref.type.id).type == 'closed answers'
                    "
                  >
                    <span
                      v-if="getType(cAnswer.ref.type.id).group == 'global'"
                      class="closed-answer-span"
                      >{{ $t(cAnswer.value) }}</span
                    >
                    <span v-else class="closed-answer-span">{{
                      cAnswer.value | capitalize
                    }}</span>
                  </template>
                  <span v-else>{{ cAnswer.value }}</span>
                </div>
              </div>
            </template>
          </template>
        </template>
      </div>
    </div>

    <div
      v-if="imageItems.length > 0"
      id="images-appendix"
      class="break-inside-avoid"
      style="min-height: 900px"
    >
      <div style="position: relative">
        <div
          class="flex justify-between"
          style="background: #ededed; padding: 7px 10px; font-size: 22px"
        >
          <div>Appendix</div>
        </div>

        <br style="margin-top: 10px; padding: 5px" />
        <div class="flex justify-between">
          <div
            style="
              padding: 5px;
              width: 50%;
              display: inline-block;
              vertical-align: top;
            "
          >
            <template v-for="(image, index) in imageItems">
              <span
                :key="'imageItems_img_' + index"
                style="vertical-align: middle"
                v-if="imageItems.length / 2 >= index + 1"
              >
                <img
                  :key="'imageItems_img_' + index"
                  style="
                    width: 100%;
                    border-radius: 7px;
                    padding: 10px;
                    padding-right: 5px;
                    margin-right: 10px;
                    position: relative;
                  "
                  :src="image.url"
                />
              </span>
            </template>
          </div>
          <div
            style="
              padding: 5px;
              width: 50%;
              display: inline-block;
              vertical-align: top;
            "
          >
            <template v-for="(image, index) in imageItems">
              <span
                :key="'imageItems_img_' + index"
                style="vertical-align: middle"
                v-if="imageItems.length / 2 < index + 1"
              >
                <img
                  :key="'imageItems_img_' + index"
                  style="
                    width: 100%;
                    border-radius: 7px;
                    padding: 10px;
                    padding-left: 5px;
                    margin-right: 10px;
                    position: relative;
                  "
                  :src="image.url"
                />
              </span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StarRating from "vue-star-rating";

export default {
  components: {
    StarRating,
  },
  props: {
    log: {
      required: true,
    },
    ppIndex: {
      required: true,
    },
  },
  data() {
    return {
      tmpl_logo: "",
      oneLog: { locations: [] },
      baseUrl: window.location.protocol + "//" + window.location.host,
      locationDetails: {
        locationCountries: [],
        locationRegions: [],
        locationAreas: [],
        locationNames: [],
      },
    };
  },
  computed: {
    getTemplateInfo() {
      return (id) => {
        return this.$store.getters["app/getTemplateById"](id);
      };
    },
    getType() {
      return (id) => {
        var type = this.$store.getters["app/getTemplateTypeById"](id);
        return type;
      };
    },
    getColor() {
      return (answer) => {
        let type = this.$store.getters["app/getTemplateTypeById"](
          answer.ref.type.id
        );
        if (type.type != "closed answers") {
          return;
        }
        let selected = type.content.find((item) => item.name == answer.value);
        if (selected == undefined) {
          return;
        }

        if (
          answer.ref.type.failedAnswer &&
          answer.ref.type.failedAnswer == answer.value
        ) {
          return "rgb(191, 10, 10)";
        }

        return "rgb(24 146 78)";
      };
    },
    convDate() {
      return (date) => {
        if (date.seconds === undefined) return date;
        return new Date(date.seconds * 1000);
      };
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
    calcTemperatureColor() {
      return (action, e) => {
        if (action === undefined || action.condition === undefined) return "";
        console.log("calcTemperatureColor", action, e);
        if (
          (action.condition == "Equal" && e == action.content[0]) ||
          (action.condition == "Not Equal" && e != action.content[0]) ||
          (action.condition == "Less Than" && e < action.content[0]) ||
          (action.condition == "Less Than or Equal" &&
            e <= action.content[0]) ||
          (action.condition == "Greater Than" && e > action.content[0]) ||
          (action.condition == "Greater Than or Equal" &&
            e >= action.content[0]) ||
          (action.condition == "Between" &&
            e >= action.content[0] &&
            e <= action.content[1])
        ) {
          return "text-" + action.alertType + " font-bold";
        }
      };
    },
    hexToRGB() {
      return (h) => {
        if (h.includes("#") !== true) {
          if (h == "danger") {
            return "rgb(191, 10, 10)";
          } else if (h == "primary") {
            return "#7367F0";
          } else if (h == "success") {
            return "#28C76F";
          } else if (h == "dark") {
            return "#1E1E1E";
          } else {
            return h;
          }
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
    getUserInfo() {
      return (id) => {
        return this.$store.getters["app/getUserById"](id);
      };
    },
    logInfo() {
      let log = this.log;
      let locations = this.$store.getters["app/locationList"];
      let template = this.getTemplateInfo(log.templateID);
      let templateTitle = template.content.templateTitle;
      let total = 0;
      let completed = 0;
      let failed = 0;
      let done;
      let locs = [];
      let tms = [];
      let show = true;

      !log.locations && (log.locations = []);
      !log.teams && (log.teams = []);

      log.logs.map((page) => {
        page.questions.map((question) => {
          question.answers.map((answer) => {
            if (this.getType(answer.ref.type.id).content != "instruction") {
              if (answer.ref.mandatory) {
                total++;
                if (answer.loged) completed++;
              }
              if (
                answer.ref.type.failedAnswer &&
                answer.ref.type.failedAnswer == answer.value
              )
                failed++;
            }
          });
        });
      });
      if (total > 0) {
        status = total == completed ? "Completed" : "Incompleted";
        done = Math.round((completed * 1000) / total) / 10 + "%";
      } else {
        status = "---";
        done = "---";
      }
      let obj = {
        templateTitle: templateTitle,
        tasks: `${completed}/${total}`,
        compliance: `${(((total - failed) / total) * 100).toFixed(2)}%`,
        status: status,
        done: done,
        failed: failed,
        dateUsed: log.updated_at
          ? new Date(log.updated_at.toDate()).toLocaleString()
          : "",
        locations: locs,
        teams: tms,
        show: show,
      };

      console.log("obj", obj);
      return obj;
    },
    failedItems() {
      let failedItems = [];

      this.log.logs.map((page) => {
        page.questions.map((question) => {
          question.answers.map((answer) => {
            if (this.getType(answer.ref.type.id).content != "instruction") {
              if (
                answer.ref.type.failedAnswer &&
                answer.ref.type.failedAnswer == answer.value
              ) {
                answer.page = page;
                answer.question = question;
                failedItems.push(answer);
              }
            }
          });
        });
      });

      return failedItems;
    },
    failedItemsPerLog() {
      return (log) => {
        let failedItems = [];

        log.questions.map((question) => {
          question.answers.map((answer) => {
            if (this.getType(answer.ref.type.id).content != "instruction") {
              if (
                answer.ref.type.failedAnswer &&
                answer.ref.type.failedAnswer == answer.value
              ) {
                answer.question = question;
                failedItems.push(answer);
              }
            }
          });
        });

        return failedItems;
      };
    },
    imageItems() {
      let imageItems = [];

      this.log.logs.map((page) => {
        page.questions.map((question) => {
          question.answers.map((answer) => {
            if (this.getType(answer.ref.type.id).type == "attachments") {
              answer.images.map((image) => imageItems.push(image));
            }
          });
        });
      });

      return imageItems;
    },
    reportInfo() {
      var scores = 0;
      var score = 0;
      var tasks = 0;
      var complted = 0;
      var ontime = 0;
      var scheduled = 0;
      var defaultScore = 0;
      var ontimeTask = true;
      var checkOnTimeTask = 0;

      let log = this.log;
      ontime = 0;
      ontimeTask = true;

      if (log.key === undefined || log.key != "pinned") {
        if (log.time !== undefined) {
          scheduled++;
          ontime = log.time.toDate().getTime();
        }
      }
      log.logs.map((page) => {
        page.questions.map((question) => {
          question.answers.map((answer) => {
            score = 0;
            if (this.getType(answer.ref.type.id).content != "instruction") {
              if (answer.ref.mandatory) {
                tasks++;
                if (answer.loged) complted++;
              }
            }
            if (ontime != 0 && answer.ref.mandatory) {
              ontimeTask =
                ontimeTask &&
                answer.loged &&
                answer.time.toDate().getTime() <= ontime;
            }
            if (answer.loged) {
              if (this.getType(answer.ref.type.id).content == "temperature") {
                if (
                  answer.ref.score === undefined ||
                  !Array.isArray(answer.ref.score)
                ) {
                  score = 10;
                } else {
                  var checkedScore = false;
                  answer.ref.score.map((scoreItem, sindex) => {
                    if (checkedScore) return;
                    if (sindex == 0) defaultScore = scoreItem.score;
                    else {
                      if (scoreItem.condition == "equal") {
                        if (scoreItem.value0 == answer.value) {
                          checkedScore = true;
                          score = scoreItem.score;
                        } else score = defaultScore;
                      } else if (scoreItem.condition == "Nequal") {
                        if (scoreItem.value0 != answer.value) {
                          checkedScore = true;
                          score = scoreItem.score;
                        } else score = defaultScore;
                      } else if (scoreItem.condition == "less") {
                        if (scoreItem.value0 > answer.value) {
                          {
                            checkedScore = true;
                            score = scoreItem.score;
                          }
                        } else score = defaultScore;
                      } else if (scoreItem.condition == "Eless") {
                        if (scoreItem.value0 >= answer.value) {
                          checkedScore = true;
                          score = scoreItem.score;
                        } else score = defaultScore;
                      } else if (scoreItem.condition == "than") {
                        if (scoreItem.value0 < answer.value) {
                          checkedScore = true;
                          score = scoreItem.score;
                        } else score = defaultScore;
                      } else if (scoreItem.condition == "Ethan") {
                        if (scoreItem.value0 <= answer.value) {
                          checkedScore = true;
                          score = scoreItem.score;
                        } else score = defaultScore;
                      } else if (scoreItem.condition == "between") {
                        if (
                          scoreItem.value0 <= answer.value &&
                          scoreItem.value1 >= answer.value
                        ) {
                          checkedScore = true;
                          score = scoreItem.score;
                        } else score = defaultScore;
                      }
                    }
                  });
                }

                scores += Math.round(score * 10) / 10;
              } else if (
                this.getType(answer.ref.type.id).type == "closed answers"
              ) {
                if (
                  answer.ref.score === undefined ||
                  !Array.isArray(answer.ref.score) ||
                  answer.ref.score.length == 0
                ) {
                  score = 10;
                } else {
                  score = answer.ref.score.find(
                    (scoreItem) => scoreItem.key == answer.value
                  ).score;
                }
                scores += Math.round(score * 10) / 10;
              }
            }
          });
        });
      });
      if (ontime != 0 && ontimeTask) checkOnTimeTask++;

      console.log("reportInfo", this.filteredLogs, {
        score: scores,
        tasks: `${complted}/${tasks}`,
        ontime: `${checkOnTimeTask}/${scheduled}`,
      });
      return {
        score: scores,
        tasks: `${complted}/${tasks}`,
        ontime: `${checkOnTimeTask}/${scheduled}`,
      };
    },
    getLocationsByNames() {
      return (log) => {
        let names = log.locations;
        var cUser = this.$store.getters["app/currentUser"];
        var roleKey = 4;
        var userLocation = [];
        if (cUser == undefined || cUser.role == undefined) {
          roleKey = 4;
        } else {
          roleKey = cUser.role.key;
          userLocation = cUser.location || [];
        }
        let locations = this.$store.getters["app/locations"].filter((item) => {
          if (roleKey > 1) {
            if (userLocation.indexOf(item.id) < 0) return false;
          }
          if (item.active && !item.deleted && names.indexOf(item.name) > -1) {
            return true;
          }
          return false;
        });
        var locationCountries = [];
        var locationRegions = [];
        var locationAreas = [];
        var locationNames = [];
        var typedLocations = {
          key: this.$t("all"),
          count: 0,
          items: [],
        };
        var count = 0;
        locations.map((location) => {
          if (location.address.country === undefined) return;
          count++;
          var country, region, area;
          country = typedLocations.items.find(
            (countries) => countries.key == location.address.country
          );

          if (country === undefined) {
            typedLocations.items.push({
              key: location.address.country,
              items: [],
            });
            locationCountries.push({
              key: location.address.country,
              items: [],
            });
          }

          country = typedLocations.items.find(
            (countries) => countries.key == location.address.country
          );

          if (location.region !== undefined && location.region != "") {
            region = country.items.find(
              (regions) => regions.key == location.region
            );
            if (region === undefined) {
              country.items.push({ key: location.region, items: [] });
              locationRegions.push({ key: location.region, items: [] });
            }
            region = country.items.find(
              (regions) => regions.key == location.region
            );

            if (location.area !== undefined && location.area != "") {
              area = region.items.find((areas) => areas.key == location.area);
              if (area === undefined) {
                region.items.push({ key: location.area, items: [] });
                locationAreas.push({ key: location.area, items: [] });
              }
              area = region.items.find((areas) => areas.key == location.area);
              area.items.push({ name: location.name, id: location.id });
              locationNames.push({ name: location.name, id: location.id });
            } else {
              region.items.unshift({ name: location.name, id: location.id });
              locationNames.push({ name: location.name, id: location.id });
            }
          } else {
            country.items.unshift({ name: location.name, id: location.id });
            locationNames.push({ name: location.name, id: location.id });
          }
        });
        typedLocations.count = count;
        var obj = {
          locationCountries,
          locationRegions,
          locationAreas,
          locationNames,
        };

        console.log("getLocationsByNames", names, this.log, log, obj);
        this.locationDetails = obj;
        return obj;
      };
    },
  },
  mounted() {
    console.log(
      "log printreport",
      this.ppIndex,
      this.log,
      this.getTemplateInfo(this.log.templateID)
    );
    this.oneLog = this.log;
  },
  methods: {
    applyImage(image) {
      console.log("applyImage", image);
      if (image.indexOf("firebasestorage") > -1) {
        return image;
      }
      let img = require(`@/assets/images/template_image/${image}`);

      if (image.indexOf("png") > -1) {
        return img;
      }
      return this.baseUrl + img;
    },
    filteredAnswers(answers, parent) {
      if (parent.ref.hasCondLogic != true) {
        return;
      }
      // get only answers which is matched to tab condition
      answers = answers.filter((a) => a.ref.parent == parent.ref.id);
      let selectedAnswer = parent.value;
      let matchingTabs = [];
      if (selectedAnswer == "") {
        matchingTabs = this.conditionTabs(parent.ref.id).filter(
          (tab) => tab.condition.symbol == "not_selected"
        );
      } else {
        matchingTabs = this.conditionTabs(parent.ref.id).filter((tab) => {
          if (tab.condition.symbol == "selected") {
            return true;
          } else {
            if (
              tab.condition.key == "is" &&
              tab.answers[0].name == selectedAnswer
            ) {
              return true;
            } else if (
              tab.condition.key == "is_not" &&
              tab.answers[0].name != selectedAnswer
            ) {
              return true;
            } else if (
              tab.condition.key == "is_one_of" &&
              tab.answers.some((answer) => answer.name == selectedAnswer)
            ) {
              return true;
            } else if (
              tab.condition.key == "is_not_one_of" &&
              tab.answers.some((answer) => answer.name == selectedAnswer)
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
          return tab.id == answer.ref.tabId;
        });
      });

      console.log("filtered ans", filtered);
      return filtered;
    },
    conditionTabs(parentAnswerId) {
      if (
        this.getTemplateInfo(this.log.templateID).content.conditionTabs ==
        undefined
      ) {
        return [];
      }

      return this.getTemplateInfo(
        this.log.templateID
      ).content.conditionTabs.filter(
        (tab) => tab.createdByAnswer == parentAnswerId
      );
    },
    getDataUrl() {
      let img = this.$refs.tem_img;
      // Create canvas
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      // Set width and height
      canvas.width = img.width;
      canvas.height = img.height;
      // Draw the image
      ctx.fillStyle = "white";
      ctx.drawImage(img, 0, 0);
      return canvas.toDataURL("image/jpeg");
    },
  },
};
</script>

<style>
.noPadding {
  padding: 0 !important;
}
.closed-answer-span {
}
.closedAnswerTd {
  text-align: center;
  color: white;
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.imgTd {
  width: 100%;
  text-align: left;
}
.normalAnswerTd {
  text-align: right;
  width: 30%;
}
.break-page {
  page-break-before: always;
}
.vue-star-rating * {
  display: flex !important;
}
</style>

<style lang="scss" scoped>
.overview-data {
  .overview-data-header {
    > div {
      width: 33.333333%;
      background-color: #ededed !important;
      padding: 8px 12px;
    }
  }
  .overview-data-body {
    > div {
      padding: 8px 12px;
      border-bottom: 1px solid #ededed !important;
    }
  }
}
.vue-star-rating {
  .vue-star-rating-star {
    display: flex !important;
  }
}
</style>