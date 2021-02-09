<template>
  <div class="analytics-item" v-if="templateInfo">
    <vx-card>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <img :src="applyImage(templateInfo.content.templateImage)" />
          <p class="karla text-2xl ml-2">
            {{ templateInfo.content.templateTitle }}
          </p>
        </div>
        <div class="flex items-center">
          <vs-dropdown vs-custom-content vs-trigger-click>
            <feather-icon
              class="p-2 mr-2 w-10 rounded-lg d-theme-dark-bg cursor-pointer"
              icon="MoreVerticalIcon"
            />
            <vs-dropdown-menu style="min-width: 270px">
              <vs-dropdown-item
                v-for="(option, index) in options"
                :key="index"
                @click="chnOption(option)"
              >
                <feather-icon
                  icon="CircleIcon"
                  :svgClasses="[
                    { 'text-primary fill-current': switchs[option] },
                    'h-5 w-5',
                  ]"
                />
                <span
                  class="ml-3 pb-2 font-semibold text-black"
                  style="font-size: 12px"
                  >{{ $t(option) }}</span
                >
              </vs-dropdown-item>
            </vs-dropdown-menu>
          </vs-dropdown>
        </div>
      </div>
      <AnalyInfo
        :template="template"
        :users="filters.users"
        :completed_tasks="switchs['Completed Tasks']"
        :failed_list="switchs['failed list']"
        :failed_response="switchs['failed response']"
        :teams="filters.teams"
        :completed_on_time="switchs['completed on time']"
        :compliance="switchs.compliance"
        :score="switchs.score"
      />
      <TemperatureSection
        :template="template"
        :date="filters.date"
        v-if="switchs.temperature"
      />
    </vx-card>
  </div>
</template>

<script>
import AnalyInfo from "./AnalyInfo";
import TemperatureSection from "./TemperatureSection";

export default {
  components: {
    AnalyInfo,
    TemperatureSection,
  },
  props: {
    filters: {
      type: Object,
    },
    template: {
      type: String,
    },
  },
  data() {
    return {
      options: [
        "score",
        "compliance",
        "completed on time",
        "failed response",
        "temperature",
        "failed list",
        "Completed Tasks",
      ],
    };
  },
  computed: {
    switchs: {
      get() {
        var list = this.filters.options.find(
          (item) => item.template == this.template
        );
        if (list) {
          return list;
        } else {
          return {
            score: true,
            compliance: true,
            "completed on time": true,
            "failed response": true,
            "failed list": true,
            "Completed Tasks": true,
            temperature: true,
            template: this.template,
          };
        }
      },
      set(val) {},
    },
    templateInfo() {
      return this.$store.getters["app/getTemplateById"](this.template);
    },
  },
  methods: {
    applyImage(image) {
      if (image.indexOf("firebasestorage") > -1) {
        return image;
      }
      return require(`@/assets/images/template_image/${image}`);
    },
    chnOption(key) {
      this.$emit("chnOption", this.switchs, this.template, key);
    },
  },
};
</script>

