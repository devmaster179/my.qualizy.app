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
      <h4>{{$t("filters")}}</h4>
      <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>
    <VuePerfectScrollbar class="scroll-area--log-filter pt-4 pb-6 px-4" :settings="settings">
      <div class="mb-3">
        <p class="karla-bold">{{$t("frequency")}}</p>
        <v-select :options="repeats" v-model="frequency" label="text" />
      </div>
      <div>
        <p class="karla-bold">{{$t("labels")}}</p>
        <v-select multiple :options="tags" v-model="tag" label="name" />
      </div>
    </VuePerfectScrollbar>
    <div class="flex flex-wrap items-center justify-center p-6" slot="footer">
      <vs-button
        class="mr-6 karla-bold"
        type="filled"
        color="rgba(108, 80, 240, 0.1)"
        @click="clearFilter"
        text-color="#6c50f0"
      >{{$t("clear filters")}}</vs-button>

      <vs-button class="karla" color="#6c50f0" @click="filter">{{ $t("apply filters") }}</vs-button>
    </div>
  </vs-sidebar>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import VSelect from "vue-select";
export default {
  components: {
    VuePerfectScrollbar,
    VSelect
  },
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      frequency: null,
      tag: null,
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.6
      }
    };
  },
  methods: {
    clearFilter() {
      this.tag = null;
      this.frequency = null;
    },
    filter() {
      let __frequency = this.frequency === null ? "" : this.frequency.name;
      //   let __tag = this.tag == null ? "" : this.tag.id;
      var __tag = [];
      if (this.tag !== null) {
        this.tag.map(item => {
          __tag.push(item.id);
        });
      } else __tag = "";
      this.isSidebarActiveLocal = false;
      this.$emit("filter", { frequency: __frequency, tag: __tag });
    }
  },
  computed: {
    tags() {
      return this.$store.getters["app/labels"];
    },
    repeats() {
      return [
        { name: "", text: this.$t("all") },
        { name: "No Repeat", text: this.$t("No Repeat") },
        { name: "Daily", text: this.$t("Daily") },
        { name: "Weekly", text: this.$t("Weekly") },
        { name: "Monthly", text: this.$t("Monthly") }
      ];
    },
    isSidebarActiveLocal: {
      get() {
        return this.open;
      },
      set(val) {
        this.$emit("closeSidebar", false);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.add-new-data-sidebar {
  /deep/ .vs-sidebar--background {
    z-index: 52010;
  }

  /deep/ .vs-sidebar {
    z-index: 52010;
    width: 500px;
    max-width: 100vw;

    .img-upload {
      margin-top: 2rem;

      .con-img-upload {
        padding: 0;
      }

      .con-input-upload {
        width: 100%;
        margin: 0;
      }
    }
  }

  ul {
    border-left-width: 3px;
    border-left-style: dashed;
    border-left-color: rgba(var(--vs-primary), 1);
  }
  li {
    padding: 20px 0;
  }
  .active {
    background-color: #7367f024;
  }
}

.scroll-area--log-filter {
  height: calc(100vh - 15rem);
}
.w-300 {
  width: 170px;
  z-index: 420000;
}
.holamundo {
  min-height: 50%;
}
</style>
