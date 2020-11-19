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
        var log = this.$store.getters["app/getLogById"](item)
        if(log) {
          logs.push(this.$store.getters["app/getLogById"](item));
        }
      });
      if(logs.length>0) {
        if(logs[0].group != JSON.parse(localStorage.getItem('userInfo')).group)
          this.$router.push('/')
      }
      return logs;
    }
  }
};
</script>