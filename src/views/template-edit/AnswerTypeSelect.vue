<template>
  <vs-sidebar
    position-right
    parent="body"
    default-index="1"
    color="primary"
    class="answer-types items-no-padding"
    spacer
    v-model="isSidebarActiveLocal"
  >
    <div class="mt-6 flex items-center justify-between px-6">
      <h4>{{$t("Select Type")}}</h4>
      <!-- <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon> -->
    </div>
    <vs-divider class="mb-0"></vs-divider>
    <VuePerfectScrollbar class="scroll-area-answer-type-list pt-4 pb-6 px-4" :settings="settings">
      <div
        v-for="(group,index) in Object.keys(answerTypes)"
        :key="index"
        class="type-group py-4 mb-4"
      >
        <p class="group-text karla-bold mb-4 ml-4">{{$t(group) | capitalize}}</p>
        <p
          @click="newClosedAnswer"
          class="closed-answer-add-text karla-bold cursor-pointer"
          v-if="group=='closed answers'"
        >+{{$t("add new")}}</p>

        <div
          class="type-list cursor-pointer"
          v-for="type in answerTypes[group]"
          :key="type.id"
          @click="apply(type.id)"
        >
          <template v-if="group=='closed answers'">
            <div class="flex items-center justify-between px-4">
              <div class="closed-answer-group flex">
                <div
                  class="closed-answer-item karla-bold ml-2"
                  v-for="(item,index) in type.content"
                  :key="index"
                  :style="`background:${hexToRGB(item.color).bColor}; color:${hexToRGB(item.color).color}`"
                >
                  <span
                    v-if="type.group=='global'"
                  >{{(item.name==''? $t("Unnamed"): $t(item.name))}}</span>
                  <span v-else>{{(item.name==''? $t("Unnamed"): item.name) | capitalize}}</span>
                </div>
              </div>
              <div class="closed-answer-actions flex items-center" v-if="type.group!='global'">
                <feather-icon
                  icon="Edit2Icon"
                  class="ml-4"
                  style="width:20px; height:20px;"
                  @click.stop="editClosedAnswer(type)"
                />
                <!-- <feather-icon icon="Trash2Icon" class="ml-4" style="width:20px; height:20px;" /> -->
              </div>
            </div>
          </template>
          <template v-else>
            <div class="flex items-center pl-4">
              <template-type-icon :item="type.id" />
              <p class="karla-bold answer-type-text ml-2">{{$t(type.content) | capitalize}}</p>
            </div>
          </template>
        </div>
      </div>
    </VuePerfectScrollbar>
    <closed-answer-edit
      :open="activeClosedAnswerEdit"
      @close="activeClosedAnswerEdit=false"
      :id="selectedClosedAnswer"
      @apply="apply"
    />
  </vs-sidebar>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import TemplateTypeIcon from "./TemplateTypeIcon.vue";
import ClosedAnswerEdit from "./ClosedAnswerEdit";
export default {
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    VuePerfectScrollbar,
    TemplateTypeIcon,
    ClosedAnswerEdit,
  },
  data() {
    return {
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.6,
      },
      activeClosedAnswerEdit: false,
      selectedClosedAnswer: "",
    };
  },
  computed: {
    hexToRGB() {
      return (h) => {
        if (h == "green") {
          return {
            color: `rgb(0,255,0)`,
            bColor: `rgba(0,255,0,0.15)`,
          };
        } else if (h.includes("#") !== true) {
          return {
            color: `rgb(var(--vs-${h}))`,
            bColor: `rgba(var(--vs-${h}),0.15)`,
          };
        } else {
          let r = 0,
            g = 0,
            b = 0;

          // 3 digits
          if (h.length == 4) {
            r = "0x" + h[1] + h[1];
            g = "0x" + h[2] + h[2];
            b = "0x" + h[3] + h[3];

            // 6 digits
          } else if (h.length == 7) {
            r = "0x" + h[1] + h[2];
            g = "0x" + h[3] + h[4];
            b = "0x" + h[5] + h[6];
          }

          return {
            color: "rgb(" + +r + "," + +g + "," + +b + ")",
            bColor: "rgba(" + +r + "," + +g + "," + +b + ",0.15)",
          };
        }
      };
    },
    answerTypes() {
      return this.$store.getters["app/typedTemplateType"];
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
  methods: {
    apply(id) {
      this.$emit("apply", id);
      this.activeClosedAnswerEdit = false;
    },
    newClosedAnswer() {
      this.$store.dispatch("app/chnTempClosedAnswer", [
        { name: "", color: "green" },
      ]);
      this.activeClosedAnswerEdit = true;
    },
    editClosedAnswer(item) {
      this.$store.dispatch("app/chnTempClosedAnswer", item.content);
      this.selectedClosedAnswer = item.id;
      this.activeClosedAnswerEdit = true;
    },
  },
};
</script>


<style lang="scss" scoped>
.answer-types {
  /deep/ .vs-sidebar--background {
    z-index: 52000;
  }

  /deep/ .vs-sidebar {
    z-index: 52000;
    width: 500px;
    max-width: 100vw;
  }
}

.scroll-area-answer-type-list {
  height: calc(100% - 4.3rem);
}
</style>

<style scoped>
.group-text {
  font-size: 14px;
  color: #1e1c26;
}
.closed-answer-item {
  padding: 10px 20px;
  font-size: 12px;
  border-radius: 4px;
}
.type-group {
  border-radius: 8px;
  box-shadow: 0 4px 10px 0 rgba(107, 107, 107, 0.25);
}
.type-list {
  padding: 5px 0;
}
.type-list:hover {
  background: rgba(108, 80, 240, 0.08);
}
.answer-type-text {
  font-size: 14px;
  color: #1e1c26;
}
.closed-answer-add-text {
  color: #6c50f0;
  font-size: 12px;
  margin-left: 2rem;
  margin-bottom: 10px;
}
</style>