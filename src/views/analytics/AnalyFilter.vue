<template>
  <vs-sidebar
    position-right
    parent="body"
    default-index="1"
    color="primary"
    class="add-new-data-sidebar items-no-padding"
    spacer
    v-model="isSidebarActiveLocal"
  >
    <div class="mt-6 flex items-center justify-between px-6">
      <h4>{{$t("select filter") | capitalize}}</h4>
      <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>
    <VuePerfectScrollbar class="scroll-area--log-filter pt-4 pb-6" :settings="settings">
      <div class="vx-row" v-for="(filter,index) in $data._filters" :key="index">
        <div class="vx-col pl-base pr-4w-full">
          <h5 class="mb-0">{{$t(filter.key) | capitalize}}</h5>
        </div>
        <div class="vx-col pl-base pr-4 pb-4 w-full" v-if="filter.key=='from'">
          <datepicker
            :disabledDates="{from: fromDate(calcVal('to'))}"
            :language="languages[$i18n.locale]"
            :placeholder="$t('from') | capitalize"
            :value="calcVal(filter.key)"
            @input="chnFilter($event,'from')"
          ></datepicker>
        </div>
        <div class="vx-col pl-base pr-4 pb-4 w-full" v-else-if="filter.key=='to'">
          <datepicker
            :disabledDates="{to: calcVal('from'),from: new Date() }"
            :placeholder="$t('from') | capitalize"
            :language="languages[$i18n.locale]"
            :value="calcVal(filter.key)"
            @input="chnFilter($event,'to')"
          ></datepicker>
        </div>
        <div class="vx-col pl-base pr-4 pb-4 w-full" v-else-if="filter.key=='template'">
          <v-select
            :value="calcVal(filter.key)"
            label="name"
            multiple
            @input="chnFilter($event,'template')"
            :options="templates"
          />
        </div>
        <div class="vx-col pl-base pr-4 pb-4 w-full" v-else-if="filter.key=='label'">
          <v-select
            :value="calcVal(filter.key)"
            label="name"
            multiple
            @input="chnFilter($event,'label')"
            :options="labels"
          />
        </div>
        <div class="vx-col pl-base pr-4 pb-4 w-full" v-else-if="filter.key=='item'">
          <v-select
            :value="calcVal(filter.key)"
            label="name"
            multiple
            @input="chnFilter($event,'item')"
            :options="items"
          />
        </div>
      </div>
    </VuePerfectScrollbar>
  </vs-sidebar>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import Datepicker from "vuejs-datepicker";
import * as lang from "vuejs-datepicker/src/locale";
import vSelect from "vue-select";
export default {
  components: {
    VuePerfectScrollbar,
    Datepicker,
    vSelect
  },

  props: {
    filters: {
      type: Array
    },
    isSidebarActive: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      languages: lang,
      _filters: [
        { key: "from", value: "" },
        { key: "to", value: "" },
        { key: "template", value: "" },
        { key: "label", value: "" },
        { key: "item", value: "" }
      ],
      from: "",
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.6
      }
    };
  },
  methods: {
    chnFilter(e, key) {
      this.$emit("chnFilter", e, key);
    }
  },
  computed: {
    fromDate() {
      return date => {
        if (date == "") return new Date();
        return date;
      };
    },
    items() {
      return this.$store.getters["app/items"];
    },
    labels() {
      let labels = this.$store.getters["app/labels"];
      let _labels = [];
      labels.map(label => {
        _labels.push({ id: label.id, name: label.name });
      });
      return _labels;
    },
    templates() {
      let templates = this.$store.getters["app/template"];
      let _templates = [];
      templates.map(template => {
        _templates.push({
          name: template.content.templateTitle,
          id: template.id
        });
      });
      return _templates;
    },
    calcVal() {
      return key => {
        var filter = this.filters.find(filter => filter.key == key);
        if (filter === undefined) return "";
        return filter.value;
      };
    },

    isSidebarActiveLocal: {
      get() {
        return this.isSidebarActive;
      },
      set(val) {
        if (!val) {
          this.$emit("closeSidebar");
        }
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
  height: calc(100% - 4.3rem);
}
.w-300 {
  width: 170px;
  z-index: 420000;
}
.holamundo {
  min-height: 50%;
}
</style>
