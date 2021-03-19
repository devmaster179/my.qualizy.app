<template>
  <vs-sidebar
    click-not-close
    v-if="Object.keys(template).length > 0"
    position-right
    parent="body"
    default-index="1"
    color="primary"
    class="template-details items-no-padding"
    spacer
    v-model="isSidebarActiveLocal"
  >
    <div class="mt-6 flex items-center justify-between px-6">
      <h4 class="karla">Template Details</h4>
      <feather-icon
        icon="XIcon"
        @click.stop="isSidebarActiveLocal = false"
        class="cursor-pointer"
      ></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>
    <VuePerfectScrollbar
      class="scroll-area--data-list-add-new pt-4 pb-6"
      :settings="settings"
    >
      <div class="p-4">
        <div class="flex items-center">
          <vs-avatar
            size="50px"
            :src="applyImage(template.content.templateImage)"
          />
          <h5 class="truncate karla">{{ template.content.templateTitle }}</h5>
        </div>
        <vx-card
          :title="page.title"
          title-color="success"
          class="mt-4 karla"
          v-for="(page, pIndex) in template.content.pages"
          :key="'page_' + pIndex"
        >
          <div
            v-for="(question, qIndex) in page.questions"
            :key="'question_' + qIndex"
          >
            <h6
              class="text-lg text-primary karla"
              :class="{ 'mt-base': qIndex > 0 }"
            >
              {{ question.title }}
            </h6>
            <table class="w-full mb-8 mt-2 table table-bordered">
              <thead>
                <tr class="karla">
                  <th width="50%">Answer</th>
                  <th>Type</th>
                  <th width="10%">Failed</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  class="karla"
                  v-for="(answer, aIndex) in question.answers"
                  :key="'answer_' + aIndex"
                >
                  <td>{{ answer.title }}</td>
                  <td>
                    <template v-if="answerType(answer.type.id) != undefined">
                      <p
                        v-if="
                          answerType(answer.type.id).type != 'closed answers'
                        "
                        class="flex items-center"
                      >
                        <template-type-icon
                          :item="answer.type.id"
                          v-if="answer.type.id !== undefined"
                        />
                        <span class="ml-2">{{
                          answerType(answer.type.id).content
                            | capitalize
                            | truncate(15)
                        }}</span>
                      </p>
                      <span v-else>
                        <vs-chip
                          v-for="(chip, chip_key) in answerType(answer.type.id)
                            .content"
                          :key="chip_key"
                          :color="chip.color"
                          >{{ chip.name | capitalize }}</vs-chip
                        >
                      </span>
                    </template>
                    <template v-else>
                      <span>None</span>
                    </template>
                  </td>
                  <td class="text-center">
                    <span
                      class="text-sm text-danger"
                      v-if="answer.type.failedAnswer"
                      >{{ answer.type.failedAnswer }}</span
                    >
                    <span v-else>---</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </vx-card>
      </div>
    </VuePerfectScrollbar>
    <div
      class="flex flex-wrap items-center justify-center p-6"
      slot="footer"
      style="backgroud: aliceblue"
    >
      <vs-button class="mr-6" @click="useTemplate">Use template</vs-button>
      <vs-button
        type="border"
        color="danger"
        @click="isSidebarActiveLocal = false"
        >Cancel</vs-button
      >
    </div>
  </vs-sidebar>
</template>
<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import TemplateTypeIcon from "../../template-edit/TemplateTypeIcon";
export default {
  components: {
    VuePerfectScrollbar,
    TemplateTypeIcon,
  },
  props: {
    isSidebarActive: {
      type: Boolean,
      required: true,
    },
    template: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.3,
      },
    };
  },
  methods: {
    applyImage(image) {
      if (image.indexOf("firebasestorage") > -1) {
        return image;
      }
      return require(`@/assets/images/template_image/${image}`);
    },
    useTemplate() {
      this.$emit("closeSidebar");
      var pages = [];
      var questions;
      var answers;
      var loged = "";
      this.template.content.pages.map((page) => {
        questions = [];
        page.questions.map((question) => {
          answers = [];
          question.answers.map((answer) => {
            let type = this.$store.getters["app/getTemplateTypeById"](
              answer.type.id
            );
            loged = "";
            if (type.content == "photo" || type.content == "receipts")
              loged = [];
            else if (type.content == "score") loged = 0;
            answers.push({
              title: answer.title,
              type: answer.type,
              action: answer.action,
              mandatory: answer.mandatory,
              hasCondLogic:
                answer.hasCondLogic !== undefined ? answer.hasCondLogic : false,
              score: answer.score,
              loged: loged,
            });
          });
          questions.push({
            title: question.title,
            answers: answers,
          });
        });
        pages.push({
          title: page.title,
          questions: questions,
        });
      });
      let tempTemplate = {
        content: {
          teams: this.template.content.teams || [],
          location: this.template.content.location,
          templateTitle: this.template.content.templateTitle,
          templateComment: this.template.content.templateComment,
          templateImage: this.template.content.templateImage,
          templateLabel: this.template.content.templateLabel,
          templateSD: this.template.content.templateSD,
          pages: pages,
        },
      };
      this.$store.commit("app/SET_TEMPTEMPLATE", JSON.stringify(tempTemplate));

      setTimeout(() => {
        this.$router.push({
          name: "template-edit",
          params: { id: this.template.id, state: "duplicate" },
        });
      }, 100);
    },
  },
  computed: {
    answerType() {
      return (templateTypeId) => {
        return this.$store.getters["app/getTemplateTypeById"](templateTypeId);
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
      },
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped>
.template-details {
  ::v-deep .vs-sidebar--background {
    z-index: 52010;
  }

  ::v-deep .vs-sidebar {
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
  ::v-deep .vs-sidebar-position-right {
    .vs-sidebar--items,
    .vs-sidebar--footer {
      background: aliceblue;
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

.scroll-area--data-list-add-new {
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

<style scoped>
.table {
  border-collapse: collapse;
  border-spacing: 0;
}
.table > thead > tr > th {
  font-size: 1em;
  background: aliceblue;
  vertical-align: bottom;
  border-bottom: 2px solid #ddd;
}

.table > thead:first-child > tr:first-child > td,
.table > thead:first-child > tr:first-child > th {
  border-top: 0;
}
.table > tbody > tr > td {
  padding: 7px 0;
  vertical-align: bottom;
  border-bottom: 1px solid #ddd;
}
</style>
