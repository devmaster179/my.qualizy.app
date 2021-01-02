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
  >
    <div class="mt-6 flex items-center justify-between px-6">
      <h4>{{$t("history") | capitalize}}</h4>
      <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>
    <VuePerfectScrollbar class="scroll-area--log-filter pt-4 pb-6" :settings="settings">
      <div class="history-contet">
        <div class="history-item mt-2 p-4" v-for="(item , index) in history" :key="index">
          <div class="log-info flex items-center justify-between px-4">
            <div class="flex items-center">
              <vs-icon icon-pack="feather" icon="icon-clock" />
              <p class="log-time karla ml-2">{{item.time | moment("MMM/DD HH:mm")}}</p>
            </div>
            <p class="user-text karla">{{user(item.user).name}}</p>
          </div>
          <div class="content p-4 mt-4">
            <p
              class="template-title karla-bold"
            >{{templateInfo(item.log.templateID).content.templateTitle}}</p>
            <span class="karla complete-info">{{completedInfo(item.log)}}</span>
            <div class="question-section bg-white">
              <table class="w-full">
                <tr v-for="(answer,aIndex) in item.question.answers" :key="aIndex">
                  <template v-if="getType(answer.ref.type.id) !== undefined">
                    <td class="p-2" width="40%">
                      <span class="answer-title">{{answer.ref.title | truncate(15)}}</span>
                      <span
                        v-if="answer.ref.type.tempUnit"
                        class="answer-title"
                      >({{answer.ref.type.tempUnit}})&nbsp;</span>
                    </td>
                    <td class="p-2">
                      <span class="answer-value" v-if="!answer.loged">---</span>
                      <span
                        class="answer-value"
                        v-else-if="getType(answer.ref.type.id).content=='automatic date and time stamp' || getType(answer.ref.type.id).content=='date'"
                      >{{toDate(answer.value) | moment('DD MMMM ,YYYY @ HH[h]mm')}}</span>
                      <template v-else-if="getType(answer.ref.type.id).content=='date time'">
                        <span
                          class="answer-value"
                          v-if="answer.ref.type.dateType=='Date'"
                        >{{answer.value | moment('DD MMMM ,YYYY')}}</span>
                        <span
                          class="answer-value"
                          v-else-if="answer.ref.type.dateType=='Time'"
                        >{{answer.value | moment('HH:mm')}}</span>
                        <span
                          class="answer-value"
                          v-else-if="answer.ref.type.dateType=='Date & Time'"
                        >{{answer.value | moment('DD MMMM ,YYYY @ HH[h]mm')}}</span>
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
                        class="answer-value"
                        v-else-if="getType(answer.ref.type.id).content == 'automatic user stamp'"
                      >{{user(answer.value).name | capitalize}}</span>
                      <span
                        v-else-if="getType(answer.ref.type.id).content=='short answer' || getType(answer.ref.type.id).content=='paragraph'"
                        class="answer-value"
                      >{{answer.value | truncate(40)}}</span>
                      <vs-checkbox
                        v-else-if="getType(answer.ref.type.id).content=='checkbox'"
                        disabled="true"
                        :value="answer.value"
                      ></vs-checkbox>
                      <template v-else-if="getType(answer.ref.type.id).content=='items'">
                        <span
                          class="answer-value"
                          v-if="getItemInfo(answer.value)!=undefined"
                        >{{getItemInfo(answer.value).name}}</span>
                      </template>
                      <template v-else-if="getType(answer.ref.type.id).content=='users'">
                        <span
                          class="answer-value"
                          v-if="user(answer.value)!=undefined"
                        >{{user(answer.value).name | capitalize}}</span>
                      </template>
                      <template v-else-if="getType(answer.ref.type.id).content=='teams'">
                        <span
                          class="answer-value"
                          v-if="getTeamInfo(answer.value)!=undefined"
                        >{{getTeamInfo(answer.value).name | capitalize}}</span>
                      </template>
                      <template v-else-if="getType(answer.ref.type.id).type=='attachments'">
                        <a
                          :href="image.url"
                          target="_blank"
                          v-for="image in answer.images"
                          :key="image.ref"
                          class="ml-1"
                          style="float: left"
                        >
                          <img
                            :src="image.url"
                            style="max-width:50px;max-height:50px;"
                            class="rounded-lg"
                          />
                        </a>
                      </template>
                      <span
                        class="answer-value"
                        v-else-if="getType(answer.ref.type.id).content=='instruction'"
                      >{{answer.ref.type.instruction | truncate(40)}}</span>

                      <template v-else-if="getType(answer.ref.type.id).content=='temperature'">
                        <span class="answer-value" v-if="answer.value!==undefined">{{answer.value}}</span>
                      </template>
                      <template v-else-if="getType(answer.ref.type.id).content=='signature'">
                        <img
                          :src="answer.value.url"
                          v-if="answer.value.url!==undefined && answer.value.url!=''"
                          style="max-width:200px;"
                        />
                      </template>
                      <span v-else class="answer-value">{{answer.value}}</span>
                    </td>
                  </template>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </VuePerfectScrollbar>
  </vs-sidebar>
</template>

<script>
import StarRating from "vue-star-rating";
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
  components: {
    StarRating,
    VuePerfectScrollbar,
  },

  props: {
    id: {
      type: String,
      default: "",
    },
    open: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.6,
      },
    };
  },
  computed: {
    toDate() {
      return (val) => {
        if (val.nanoseconds === undefined) return val;
        return val.toDate();
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
    getType() {
      return (id) => {
        var type = this.$store.getters["app/getTemplateTypeById"](id);
        return type;
      };
    },
    completedInfo() {
      return (log) => {
        var complated = true;
        log.logs.map((page) => {
          page.questions.map((question) => {
            question.answers.map((answer) => {
              if (answer.ref.mandatory && !answer.loged) complated = false;
            });
          });
        });
        return complated ? this.$t("completed") : this.$t("in progress");
      };
    },
    user() {
      return (id) => {
        return this.$store.getters["app/getUserById"](id);
      };
    },
    templateInfo() {
      return (id) => {
        return this.$store.getters["app/getTemplateById"](id);
      };
    },
    history() {
      if (this.id == "") return [];
      var itemLists = [];
      var logs = this.$store.getters["app/logs"];
      logs.map((log) => {
        log.logs.map((page) => {
          page.questions.map((question) => {
            question.answers.map((answer) => {
              if (answer.value == this.id) {
                itemLists.push({
                  template: log.templateID,
                  question: question,
                  time: answer.time.toDate(),
                  user: answer.user,
                  log: log,
                });
              }
            });
          });
        });
      });
      return itemLists.sort((a, b) => b.time.getTime() - a.time.getTime());
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
};
</script>

<style lang="scss" scoped>
.add-new-data-sidebar {
  ::v-deep .vs-sidebar--background {
    z-index: 52010;
  }

  ::v-deep .vs-sidebar {
    z-index: 52010;
    width: 500px;
    max-width: 100vw;
  }
}

.scroll-area--log-filter {
  height: calc(100vh - 8rem);
}
</style>

<style scoped>
.history-item .content {
  border-radius: 4px;
  background-color: #f5f5fa;
}
.log-info p {
  font-size: 14px;
  opacity: 0.54;
  color: #1e1c26;
}
.template-title {
  font-size: 16px;
  color: #1e1c26;
}
.history-item .content .question-section table {
  border-collapse: collapse;
  border-spacing: 0;
  /* border-radius: 4px; */
  /* border: solid 1px rgba(113, 102, 237, 0.16); */
}
.history-item .content .question-section table td {
  border: solid 1px rgba(113, 102, 237, 0.16);
}
.answer-title {
  color: #1e1c26;
  font-weight: 500;
  opacity: 0.54;
  font-size: 12px;
}
.answer-value {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: normal;
  color: #1e1c26;
}
</style>