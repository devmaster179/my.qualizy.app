<template>
  <vs-sidebar
    position-right
    parent="body"
    default-index="1"
    color="primary"
    class="template-filter items-no-padding"
    spacer
    v-model="isSidebarActiveLocal"
  >
    <div class="mt-6 flex items-center justify-between px-6">
      <h4>{{$t("filters")}}</h4>
      <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>
    <div class="filter-content p-4 mt-4">
      <div class="status-section">
        <label class="text-sm color-my-black font-medium">{{$t('status')}}</label>
        <v-select :options="['Active','Deleted']" v-model="status" />
      </div>
      <div class="location-section"></div>
      <div class="tag-section mt-4">
        <label class="text-sm color-my-black font-medium">{{$t('tags')}}</label>
        <multiselect
          v-model="tag"
          :placeholder="$t('select location')"
          label="name"
          track-by="id"
          :options="tags"
          :option-height="50"
          :show-labels="false"
          :multiple="true"
        >
          <template slot="selection" slot-scope="{ values }">
            <div class="flex items-center">
              <div
                :class="{'hidden': i>1}"
                class="flex items-center selectItem"
                v-for="(value,i) in values"
                :key="i"
              >
                <div class="h-2 w-2 rounded-full mr-1" :style="`background: ${value.color};`"></div>
                <span class="karla">{{value.name}}</span>
                <vs-icon
                  class="cursor-pointer ml-2"
                  icon-pack="feather"
                  icon="icon-x"
                  size="10px"
                  style="padding-top:1px;"
                  @click.native="removeTag(value)"
                />
              </div>
              <div class="flex items-center selectItem" v-if="values.length>2">
                <span class="karla">{{`+ ${values.length-2}`}}</span>
              </div>
            </div>
          </template>
        </multiselect>
      </div>
    </div>
  </vs-sidebar>
</template>

<script>
import VSelect from "vue-select";
import Multiselect from "vue-multiselect";
export default {
  components: {
    VSelect,
    Multiselect,
  },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    templateTag: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      status: "",
    };
  },
  methods: {
    removeTag(val) {
      this.tag = this.tag.filter((item) => item.id != val.id);
    },
  },
  computed: {
    tag: {
      get() {
        return this.tags.filter(
          (item) => this.templateTag.indexOf(item.id) > -1
        );
      },
      set(val) {
        var ids = [];
        val.map((item) => {
          ids.push(item.id);
        });
        this.$emit("filter", { tags: ids });
      },
    },
    tags() {
      return this.$store.getters["app/labels"];
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
.template-filter {
  ::v-deep .vs-sidebar--background {
    z-index: 52000;
  }

  ::v-deep .vs-sidebar {
    z-index: 52000;
    width: 500px;
    max-width: 100vw;
  }
}
</style>
<style scoped>
.selectItem {
  background: #f5f5fa;
  padding: 5px 5px;
  margin-right: 3px;
  font-size: 12px;
  border-radius: 3px;
  color: #1e1c26;
}
</style>