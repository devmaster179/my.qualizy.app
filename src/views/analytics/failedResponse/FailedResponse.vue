<template>
  <div id="failed-response">
    <vx-card :title="$t('failed response') | capitalize">
      <!-- CARD ACTION -->
      <template slot="actions">
        <span class="text-medium text-success">{{timeRange}}</span>
      </template>
      <VuePerfectScrollbar class="scroll-area pt-4 pr-2" :settings="settings" ref="pageLists">
        <transition-group tag="ul" name="list">
          <li class="templates" v-for="template in templates" :key="template.id">
            <div
              class="pl-4 py-2 template-item border cursor-pointer border-solid d-theme-border-grey-light border-t-0 border-r-0 border-l-0 flex justify-between items-center"
              @click="showTemplate(template.id)"
            >
              <div class="flex items-center">
                <vs-avatar
                  :src="require(`@/assets/images/template_image/${template.content.templateImage}`)"
                ></vs-avatar>
                <span class="font-medium">{{template.content.templateTitle | truncate(30)}}</span>
                <!-- <vs-chip class="ml-8" color="warning">4</vs-chip> -->
                <vs-chip
                  class="ml-8"
                  :color="countFailedTemplate(template.id)>0? 'danger' : 'success' "
                >{{countFailedTemplate(template.id)}}</vs-chip>
              </div>
              <vs-icon
                icon-pack="feather"
                :class="[{'rotate':showTemplateItem(template.id)}]"
                icon="icon-chevron-right"
              />
            </div>
            <transition-group tag="ul" name="list" v-if="showTemplateItem(template.id)">
              <li
                class="ml-4"
                v-for="(page, pIndex) in template.content.pages"
                :key="'page'+pIndex"
              >
                <div
                  @click="showPage(template.id,pIndex)"
                  class="p-4 pr-0 template-item border cursor-pointer border-solid d-theme-border-grey-light border-t-0 border-r-0 border-l-0 flex justify-between items-center"
                >
                  <div class="flex items-center">
                    <span>{{page.title | truncate(30)}}</span>
                    <vs-chip
                      class="ml-8"
                      :color="countFailedPage(template.id,pIndex)>0?'danger':'success'"
                    >{{countFailedPage(template.id,pIndex)}}</vs-chip>
                  </div>
                  <vs-icon
                    icon-pack="feather"
                    icon="icon-chevron-right"
                    :class="[{'rotate':showPageItem(template.id,pIndex)}]"
                  />
                </div>
                <transition-group tag="ul" name="list" v-if="showPageItem(template.id,pIndex)">
                  <li
                    class="ml-8"
                    v-for="(question , qIndex) in page.questions"
                    :key="'question'+qIndex"
                  >
                    <div
                      class="p-4 border cursor-pointer border-solid d-theme-border-grey-light border-t-0 border-r-0 border-l-0 flex justify-between items-center"
                    >
                      <span>{{question.title | truncate(30)}}</span>
                      <vs-chip
                        class="ml-8"
                        :color="countFailedQuestion(template.id,pIndex,qIndex)>0?'danger':'success'"
                      >{{countFailedQuestion(template.id,pIndex,qIndex)}}</vs-chip>
                    </div>
                  </li>
                </transition-group>
              </li>
            </transition-group>
            <!-- <template-item :template="template"/> -->
          </li>
        </transition-group>
      </VuePerfectScrollbar>
    </vx-card>
  </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
  props: {
    filters: {
      type: Array
    }
  },
  components: {
    VuePerfectScrollbar
  },

  data() {
    return {
      now: "",
      _now: "",
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.5
      },
      viewTemplate: [],
      viewPage: []
    };
  },

  computed: {
    countFailedQuestion() {
      return (tId, p, q) => {
        var count = 0;
        count += this.failedQuestion(tId, p, q);
        return count;
      };
    },
    countFailedPage() {
      return (tID, p) => {
        var count = 0;
        var template = this.$store.getters["app/getTemplateById"](tID);
        var page = template.content.pages[p];
        if (page == undefined) return 0;
        page.questions.map((question, q) => {
          count += this.failedQuestion(tID, p, q);
        });
        return count;
      };
    },
    countFailedTemplate() {
      return tID => {
        var template = this.$store.getters["app/getTemplateById"](tID);
        var count = 0;
        if (template == undefined) return 0;

        template.content.pages.map((page, p) => {
          page.questions.map((question, q) => {
            count += this.failedQuestion(tID, p, q);
          });
        });
        return count;
      };
    },
    showTemplateItem() {
      return id => {
        if (this.viewTemplate.indexOf(id) > -1) return true;
        return false;
      };
    },
    showPageItem() {
      return (id, p) => {
        if (this.viewPage.indexOf(id + "_" + p) > -1) return true;
        return false;
      };
    },
    templates() {
      let templates = this.$store.getters["app/template"];
      return templates.filter(template => !template.trashed);
    },
    timeRange() {
      var timeInfor = this.getTimeInfo();
      return (
        this.$moment(timeInfor.from).format("Do/MM/YYYY") +
        " ~ " +
        this.$moment(timeInfor.to).format("Do/MM/YYYY")
      );
    }
  },
  methods: {
    failedQuestion(tID, p, q) {
      var count = 0;
      var timeInfor = this.getTimeInfo();
      var logs = this.$store.getters["app/logs"];
      if (logs == undefined) return 0;
      logs = logs.filter(
        item =>
          item.updated_at.toDate().getTime() >= timeInfor.from.getTime() &&
          item.updated_at.toDate().getTime() <= timeInfor.to.getTime() &&
          item.templateID == tID
      );
      logs.map(log => {
        var question = log.logs[p].questions[q];
        if (question == undefined) return;
        question.answers.map(answer => {
          var templateType = this.$store.getters["app/getTemplateTypeById"](
            answer.ref.type.id
          );
          if (templateType == undefined) return;
          if (templateType.type == "closed answers") {
            if (answer.ref.action.content == undefined) return;
            if (answer.ref.action.content.name == answer.value) count++;
          } else if (templateType.content == "temperature") {
            if (answer.ref.action.content == undefined) return;
            if (answer.ref.action.condition == "Equal") {
              if (answer.ref.action.content[0] == answer.value) count++;
            } else if (answer.ref.action.condition == "Not Equal") {
              if (answer.ref.action.content[0] != answer.value) count++;
            } else if (answer.ref.action.condition == "Less Than") {
              if (answer.ref.action.content[0] > answer.value) count++;
            } else if (answer.ref.action.condition == "Less Than or Equal") {
              if (answer.ref.action.content[0] >= answer.value) count++;
            } else if (answer.ref.action.condition == "Greater Than") {
              if (answer.ref.action.content[0] < answer.value) count++;
            } else if (answer.ref.action.condition == "Greater Than or Equal") {
              if (answer.ref.action.content[0] <= answer.value) count++;
            } else if (answer.ref.action.condition == "Between") {
              if (
                answer.ref.action.content[0] <= answer.value &&
                answer.ref.action.content[1] >= answer.value
              )
                count++;
            }
          }
        });
      });
      return count;
    },
    showPage(tID, p) {
      if (this.viewPage.indexOf(tID + "_" + p) > -1)
        this.viewPage = this.viewPage.filter(item => item != tID + "_" + p);
      else this.viewPage.push(tID + "_" + p);
    },
    showTemplate(tID) {
      if (this.viewTemplate.indexOf(tID) > -1)
        this.viewTemplate = this.viewTemplate.filter(item => item != tID);
      else this.viewTemplate.push(tID);
    },
    getTimeInfo() {
      var from = this.filters.find(filter => filter.key == "from");
      var to = this.filters.find(filter => filter.key == "to");

      if (from === undefined)
        from = new Date(this._now.getTime() - 10 * 24 * 60 * 60 * 1000);
      else
        from = new Date(
          from.value.getFullYear(),
          from.value.getMonth(),
          from.value.getDate()
        );
      if (to === undefined) to = this._now;
      else
        to = new Date(
          to.value.getFullYear(),
          to.value.getMonth(),
          to.value.getDate()
        );

      return { from: from, to: to };
    }
  },
  created() {
    this.now = new Date();
    this._now = new Date(
      this.now.getFullYear(),
      this.now.getMonth(),
      this.now.getDate(),
      23,
      59,
      59
    );
    setInterval(() => {
      this.now = new Date();
      this._now = new Date(
        this.now.getFullYear(),
        this.now.getMonth(),
        this.now.getDate(),
        23,
        59,
        59
      );
    }, 60 * 60 * 1000);
  }
};
</script>

<style scoped="scoped">
.scroll-area {
  max-height: 350px;
}
.rotate {
  transform: rotate(90deg);
  transition: all 0.3s ease;
}
.template-item,
.templates {
  transition: all 0.3s ease;
}
.template-item:hover {
  -webkit-transform: translateY(-4px);
  transform: translateY(-4px);
}
</style>