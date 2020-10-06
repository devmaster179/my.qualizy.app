<template>
  <div id="analytics">
    <div class="vx-row">
      <vx-card class="mb-base mx-4">
        <div class="vx-row">
          <div
            @click="showFilter"
            class="vx-col w-full rounded-lg flex justify-between items-center vs-inputx vs-input--input py-2 pr-4 pl-4"
          >
            <div class="filter-item flex flex-wrap">
              <div
                class="bg-success p-2 rounded-lg mr-2"
                v-for="(filter,fIndex) in filters"
                :key="fIndex"
              >
                <span
                  class="text-white mr-3"
                  v-if="filter.key=='template' || filter.key=='label' || filter.key=='item' "
                >{{filter.key | capitalize}}: {{filter.value.length}} selected</span>
                <span
                  class="text-white mr-3"
                  v-if="filter.key=='from' || filter.key=='to'"
                >{{filter.key | capitalize}}: {{filter.value | moment('Do/MM,YYYY')}}</span>
                <vs-icon
                  icon-pack="feather"
                  icon="icon-x-circle"
                  color="white"
                  class="cursor-pointer"
                  @click.native.stop="remoteFilterItem(filter.key)"
                />
              </div>
              <input
                type="text"
                class="ml-2 py-2"
                ref="serchBox"
                :placeholder="$t('Search')"
                style="border:none;"
              />
            </div>
            <vs-icon
              icon-pack="feather"
              :icon="filters.length>0 ? 'icon-x' : 'icon-search'"
              :class="[{'cursor-pointer': filters.length>0}]"
              @click.native.stop="removeFlter"
            />
          </div>
        </div>
      </vx-card>
    </div>
    <div class="vx-row">
      <div class="vx-col w-full mb-base">
        <congratulation :filters="filters" />
      </div>
      <!-- <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
				<fooditem-created :filters="filters"/>
			</div>
			<div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
				<fooditem-discard/>
      </div>-->
    </div>

    <div class="vx-row">
      <div class="vx-col w-full md:w-1/2 mb-base">
        <over-tasks :filters="filters" />
      </div>
      <div class="vx-col w-full md:w-1/2 lg:w-1/2 xl:w-1/2 mb-base">
        <task-tracker :filters="filters" />
      </div>
    </div>
    <div class="vx-row">
      <div class="vx-col w-full sm:w-1/2 mb-base">
        <failed-response :filters="filters" />
      </div>
      <div class="vx-col w-full sm:w-1/2 mb-base">
        <template-usage :filters="filters" />
      </div>
      <!-- <div class="vx-col w-full md:w-1/2 xl:w-1/3 mb-base">
				<activity-timeline/>
      </div>-->
    </div>
    <analy-filter
      @chnFilter="chnFilter"
      :filters="filters"
      :isSidebarActive="filterSidebar"
      @closeSidebar="filterSidebar = false"
    />
  </div>
</template>

<script>
import Congratulation from "./Congratulation.vue";
import FooditemCreated from "./FooditemCreated.vue";
import FooditemDiscard from "./FooditemDiscard.vue";
import OverTasks from "./OverTasks.vue";
import TaskTracker from "./TaskTracker.vue";
import FailedResponse from "./failedResponse/FailedResponse.vue";
import TemplateUsage from "./TemplateUsage.vue";
import ActivityTimeline from "./ActivityTimeline.vue";
import AnalyFilter from "./AnalyFilter.vue";
import { db } from "@/firebase/firebaseConfig.js";
export default {
  components: {
    Congratulation,
    FooditemCreated,
    FooditemDiscard,
    OverTasks,
    TaskTracker,
    FailedResponse,
    TemplateUsage,
    ActivityTimeline,
    AnalyFilter
  },
  data() {
    return {
      filterSidebar: false,
      wasSidebarOpen: null,
      filters: [
        {
          key: "from",
          value: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000)
        }
      ]
    };
  },
  methods: {
    chnFilter(value, key) {
      var filter = this.filters.find(filter => filter.key == key);
      if (filter !== undefined)
        this.filters = this.filters.filter(filter => filter.key != key);
      if (
        (key != "template" && key != "label" && key != "item") ||
        value.length > 0
      )
        this.filters.push({ key: key, value: value });
    },
    showFilter() {
      this.filterSidebar = true;
    },
    removeFlter() {
      this.filters = [];
    },
    remoteFilterItem(key) {
      this.filters = this.filters.filter(filter => filter.key != key);
    }
  },
  created() {}
  // mounted() {
  //   this.wasSidebarOpen = this.$store.state.reduceButton;
  //   this.$store.commit("TOGGLE_REDUCE_BUTTON", true);
  // },
  // beforeDestroy() {
  //   if (!this.wasSidebarOpen) this.$store.commit("TOGGLE_REDUCE_BUTTON", false);
  // }
};
</script>

<style lang="scss">
#analytics {
  .greet-user {
    position: relative;
    .decore-left {
      position: absolute;
      left: 0;
      top: 0;
    }
    .decore-right {
      position: absolute;
      right: 0;
      top: 0;
    }
  }

  @media (max-width: 576px) {
    .decore-left,
    .decore-right {
      width: 140px;
    }
  }
}
</style>