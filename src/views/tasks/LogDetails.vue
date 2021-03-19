<template>
  <vs-sidebar
    click-not-close
    :parent="parent"
    :hidden-background="true"
    class="log-sidebar items-no-padding"
    v-model="sidebarActive"
    position-right
  >
    <div class="md:flex items-center hidden">
      <span
        class="karla-bold main-pagetitle cursor-pointer"
        @click="sidebarActive = false"
        >{{
          $t(parent.split("#")[1].replace("-", " ")) | capitalize
        }}&nbsp;</span
      >
      <span class="karla-bold page-title ml-2"
        >>&nbsp;{{ $t("task details") }}</span
      >
    </div>
    <div v-if="template != '' && pages.length > 0">
      <vx-card class="mb-base mx-auto" style="max-width: 700px">
        <log-item :log="log" :order="0" />
      </vx-card>
    </div>
  </vs-sidebar>
</template>

<script>
import LogItem from "../report/LogItem";

export default {
  components: {
    LogItem,
  },
  props: {
    template: {
      type: String,
      required: true,
    },
    parent: {
      type: String,
      default: "",
    },
    isSidebarActive: {
      type: Boolean,
      default: false,
    },
    pages: {
      type: Array,
      default: [],
    },
  },
  computed: {
    log() {
      return {
        templateID: this.template,
        logs: this.pages,
      };
    },
    sidebarActive: {
      get() {
        return this.isSidebarActive;
      },
      set(val) {
        this.$emit("closeSidebar");
      },
    },
  },
};
</script>

<style scoped>
.main-pagetitle {
  font-size: 24px;
  color: #1e1c26;
  opacity: 0.54;
}
.page-title {
  font-size: 24px;
  color: #1e1c26;
}
</style>

