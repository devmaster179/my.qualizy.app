<template>
  <div id="over-tasks">
    <vx-card>
      <div class="vx-row flex-col-reverse lg:flex-row">
        <!-- LEFT COL -->
        <div class="vx-col w-full">
          <div>
            <h4 class="mb-1 font-bold">{{$t("most common overdue tasks") | capitalize}}</h4>
            <!-- <span class="font-medium">{{dateRange}}</span> -->
            <p class="mt-2 text-xl font-medium">
              {{$t("duration") | capitalize}}:
              <span class="text-success">{{dateRange}}</span>
            </p>
          </div>
        </div>
      </div>
      <vs-divider class="my-6"></vs-divider>
      <VuePerfectScrollbar class="scroll-area pt-4 pr-2" :settings="settings" ref="pageLists">
        <div class="vx-row">
          <div class="vx-col w-full sm:w-1/2 mb-3" v-for="template in templates" :key="template.id">
            <p>
              {{template.content.templateTitle | truncate(25)}}:
              {{calcPercent(template.id)}}%
            </p>
            <vs-progress
              class="block mt-1"
              :percent="calcPercent(template.id)"
              :color="calcColor(calcPercent(template.id))"
            ></vs-progress>
          </div>
        </div>
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
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.5
      }
    };
  },
  computed: {
    calcColor() {
      return val => {
        if (val > 80) return "danger";
        if (val > 60) return "warning";
        if (val > 30) return "primary";
        return "success";
      };
    },
    calcPercent() {
      return templateId => {
        var from = this.filters.find(filter => filter.key == "from");
        var to = this.filters.find(filter => filter.key == "to");
        if (from === undefined) from = 0;
        else {
          from = new Date(
            from.value.getFullYear(),
            from.value.getMonth(),
            from.value.getDate()
          ).getTime();
        }
        if (to === undefined) to = new Date().getTime() + 24 * 60 * 60 * 1000;
        else
          to = new Date(
            to.value.getFullYear(),
            to.value.getMonth(),
            to.value.getDate()
          ).getTime();

        var logs = this.$store.getters["app/logs"];
        logs = logs.filter(
          log =>
            log.updated_at.toDate().getTime() >= from &&
            log.updated_at.toDate().getTime() <= to &&
            log.templateID == templateId &&
            log.time !== undefined
        );
        var _logs = [];
        logs.map(log => {
          var loged = true;
          log.logs.map(page => {
            if (!loged) return;
            page.questions.map(question => {
              question.answers.map(answer => {
                if (!loged) return;
                if (answer.ref.mandatory && !answer.loged) loged = false;
              });
            });
          });

          if (loged) _logs.push(log);
        });
        var count = 0;
        var isOverdue = 0;
        _logs.map(log => {
          count++;
          if (log.updated_at.toDate().getTime() > log.time.toDate().getTime()) {
            isOverdue++;
          }
        });
        if (count == 0) return 0;
        else return Math.round((isOverdue / count) * 10000) / 100;
      };
    },
    dateRange() {
      let from = this.filters.find(filter => filter.key == "from");
      let to = this.filters.find(filter => filter.key == "to");
      if (from === undefined && to === undefined) return "(All Times)";
      else if (from !== undefined && to == undefined)
        return "(" + this.$moment(from.value).format("Do/MM/YYYY") + "~ )";
      else if (from !== undefined && to !== undefined)
        return (
          "(" +
          this.$moment(from.value).format("Do/MM/YYYY") +
          " ~ " +
          this.$moment(to.value).format("Do/MM/YYYY") +
          ")"
        );
      else if (from === undefined && to !== undefined)
        return "( ~ " + this.$moment(to.value).format("Do/MM/YYYY") + ")";
    },
    templates() {
      return this.$store.getters["app/template"].filter(item => !item.trash);
    }
  }
};
</script>

<style scoped>
.scroll-area {
  max-height: 220px;
}
</style>