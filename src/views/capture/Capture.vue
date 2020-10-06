<template>
  <div class="w-full" id="capture-detail">
    <div v-for="(log,index) in logs" :key="index">
      <log-item class="mb-base" v-if="log !== undefined" :item="log"></log-item>
    </div>
  </div>
</template>

<script>
import LogItem from "../report/LogItem.vue";

export default {
  components: {
    LogItem
  },
  data() {
    return {};
  },
  methods: {},
  computed: {
    logs() {
      var logs = [];
      if (this.$route.params.ids == "") return [];
      var logIDs = this.$route.params.ids.split(",");
      logIDs.map(item => {
        logs.push(this.$store.getters["app/getLogById"](item));
      });
      return logs;
    }
  }
};
</script>