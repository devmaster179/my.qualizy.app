<template>
  <div id="template-usage">
    <vx-card :title="$t('template usage') | capitalize">
      <template slot="actions">
        <span class="text-success">{{timeRange}}</span>
      </template>
      <VuePerfectScrollbar
        class="scroll-area md:px-8 pt-4 px-4 sm:px-6"
        :settings="settings"
        ref="pageLists"
      >
        <div v-for="(template, index) in templates" :key="template.id" :class="{'mt-4': index}">
          <div class="flex justify-between">
            <div class="flex flex-col">
              <span class="mb-1">{{ template.content.templateTitle }}</span>
              <h4>{{template.usage}}%</h4>
            </div>
            <div class="flex flex-col text-right">
              <span class="flex -mr-1">
                <!-- <span class="mr-1">30%</span> -->
                <!-- <feather-icon :icon=" browser.comparedResult < 0 ? 'ArrowDownIcon' :
                                'ArrowUpIcon'" :svgClasses="[browser.comparedResult < 0 ? 'text-danger' :
                'text-success' ,'stroke-current h-4 w-4 mb-1 mr-1']"></feather-icon>-->
              </span>
              <!-- <span class="text-grey">{{ browser.time | time(true) }}</span> -->
            </div>
          </div>
          <vs-progress :percent="template.usage"></vs-progress>
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
      },
      now: "",
      _now: ""
    };
  },
  computed: {
    timeRange() {
      var timeInfo = this.getTimeInfo();
      if (timeInfo.from == "" && timeInfo.to == "") return "All Time";
      else if (timeInfo.from != "" && timeInfo.to == "")
        return this.$moment(timeInfo.from).format("DD MMMM , YYYY") + " ~ ";
      else if (timeInfo.to != "" && timeInfo.from == "")
        return " ~ " + this.$moment(timeInfo.to).format("DD MMMM , YYYY");
      else
        return (
          this.$moment(timeInfo.from).format("DD MMMM , YYYY") +
          " ~ " +
          this.$moment(timeInfo.to).format("DD MMMM , YYYY")
        );
    },

    templates() {
      let templates = this.$store.getters["app/template"];
      var _templates = [];
      templates.map(template => {
        _templates.push(
          Object.assign({}, template, {
            usage: this.usage(template.id)
          })
        );
      });

      return _templates.sort((a, b) => b.usage - a.usage);
    }
  },
  methods: {
    usage(id) {
      var timeInfo = this.getTimeInfo();
      var from = timeInfo.from;
      if (from == "") from = 0;
      else from = from.getTime();

      var to = timeInfo.to;
      if (to == "") to = this._now.getTime() + 24 * 60 * 60 * 1000;
      else to = to.getTime();

      var logs = this.$store.getters["app/logs"];

      logs = logs.filter(
        log =>
          log.updated_at.toDate().getTime() >= from &&
          log.updated_at.toDate().getTime() <= to
      );

      if (logs.length == 0) return 0;
      var _logs = logs.filter(log => log.templateID == id);
      return Math.round((_logs.length / logs.length) * 1000) / 10;
    },
    getTimeInfo() {
      var from = this.filters.find(filter => filter.key == "from");
      var to = this.filters.find(filter => filter.key == "to");

      if (from === undefined) from = "";
      else
        from = new Date(
          from.value.getFullYear(),
          from.value.getMonth(),
          from.value.getDate()
        );
      if (to === undefined) to = "";
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
      this.now.getDate()
    );
    setInterval(() => {
      this.now = new Date();
      this._now = new Date(
        this.now.getFullYear(),
        this.now.getMonth(),
        this.now.getDate()
      );
    }, 60 * 60 * 1000);
  }
};
</script>

<style scoped="scoped">
.scroll-area {
  max-height: 350px;
}
</style>