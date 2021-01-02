<template>
  <vs-sidebar
    click-not-close
    position-right
    parent="body"
    default-index="1"
    color="primary"
    class="answer-action items-no-padding"
    spacer
    v-model="isSidebarActiveLocal"
    v-if="!(answer == undefined || answer.type==undefined || answer.type.id === undefined || answerType(answer.type.id) === undefined)"
  >
    <div class="mt-6 flex items-center justify-between px-6">
      <h4>{{$t("notification")}}</h4>
      <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>
    <VuePerfectScrollbar class="scroll-area--data-list-add-new pt-4 pb-6" :settings="settings">

      <div v-for="(action,index) in actions" :key="'action_'+index">
        <div class="answer-action-content p-4">
            <div class="action-name w-full mb-4">
              <p class="karla text-lg">{{$t('notification name')}}</p>
              <vs-input v-model="action.name" class="w-full"/>
            </div>
            <template v-if="answerType(answer.type.id).content=='temperature'">
              <div class="temperature-section">
                <div class="condition-section">
                  <p class="karla text-lg">{{$t('condition') | capitalize}}</p>
                  <v-select :options="conditions" v-model="action.condition" :clearable="false">
                    <template v-slot:option="option">
                      <span>{{$t(option.label)}}</span>
                    </template>
                    <template v-slot:selected-option="option">
                      <span>{{$t(option.label)}}</span>
                    </template>
                  </v-select>

                </div>
                <div class="condition-value-section mt-6">
                  <p class="karla text-lg">{{$t("temperature")}}</p>
                  <div class="flex items-center">
                    <vs-input
                      step=".1"
                      type="number"
                      class="w-full"
                      v-model="action.content[0]"
                      :class="{'pr-2':action.condition=='between'}"
                    />
                    <vs-input
                      step=".1"
                      type="number"
                      class="w-full"
                      v-model="action.content[1]"
                      :class="{'pl-2':action.condition=='between'}"
                      v-if="action.condition=='between'"
                    />
                  </div>
                </div>
              </div>
            </template>
            <template v-if="answerType(answer.type.id).type=='closed answers'">
              <div class="closed-answers-section">
                <p class="karla text-lg">{{$t("if answer is")}} ...</p>
                <v-select :reduce="typeAnswer=>typeAnswer.name" :options="answerType(answer.type.id).content" label="name" v-model="action.content" />
              </div>
            </template>
            <div class="answer-action-team-select mt-5">
              <p class="karla text-lg">{{$t("send a notification to")}} {{$t("teams")}}</p>
              <v-select
                v-model="action.teams"
                :placeholder="$t('select')"
                label="name"
                :options="teams"
                :multiple="true"
                :reduce="team=> team.id"
              ></v-select>
            </div>
            <div class="answer-action-type-select mt-5">
              <p class="karla text-lg">{{$t("notification type")}}</p>
              <v-select :clearable="false" :options="alertTypes" v-model="action.color" >
                  <template v-slot:option="option">
                    <span>{{$t(option.label) | capitalize}}</span>
                  </template>
                  <template v-slot:selected-option="option">
                    <span>{{$t(option.label) | capitalize}}</span>
                  </template>
              </v-select>
            </div>
            <div class="answer-action-message-type-select mt-5">
              <p class="karla text-lg">{{$t("message type")}}</p>
              <v-select multiple :options="messageTypes" v-model="action.types" >
                  <template v-slot:option="option">
                    <span>{{$t(option.label)}}</span>
                  </template>
                  <template v-slot:selected-option="option">
                    <span>{{$t(option.label)}}</span>
                  </template>
              </v-select>
            </div>
            <div class="answer-action-message-description mt-5">
              <p class="karla text-lg">{{$t("message")}}</p>
              <vs-textarea v-model="action.description"/>
            </div>
        </div>
        <div class="flex justify-end mt-2 pr-4">
          <vs-icon icon-pack="feather" icon="icon-trash-2" size="18px" class="cursor-pointer hover:text-danger" v-if="actions.length>1" @click="removeNotification(index)" />          
        </div>
        <vs-divider class="my-4" v-if="actions.length>1"></vs-divider>
      </div>
      <div class="action-add flex justify-end">
        <p class="karla text-lg add-notification cursor-pointer text-primary underline pr-4" @click="addNotification">
          +{{ $t("notification") }}
        </p>
      </div>
    </VuePerfectScrollbar>
    <div class="flex flex-wrap items-center justify-center p-6"  slot="footer">
        <vs-button
          @click="isSidebarActiveLocal=false"
          color="rgba(108, 80, 240, 0.1)"
          text-color="rgba(108, 80, 240)"
          class="kalar ml-2 mr-4"
        >{{$t("cancel")}}</vs-button>
        <vs-button class="kalar ml-2 mr-4" @click="applyaAction">{{$t("save & apply")}}</vs-button>
      </div>
  </vs-sidebar>
</template>

<script>
import VSelect from "vue-select";
import multiselect from "vue-multiselect";
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    answer: {
      type: Object,
    },
  },
  components: {
    VSelect,
    multiselect,
    VuePerfectScrollbar
  },
  data() {
    return {
      messageTypes: ["email", "sms", "app", "chat"],
      conditions: ["equal", "not equal", "less than", "less than or equal", "greater than", "greater than or equal", "between"],
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.6,
      },
      actions: [ 
        {
          notificationName: "",
          alertType: "success",
          messageType: ["app"],
          selectedUser:[],
          tempCondition: 'equal',
          content: [],
          notificationDes: "",
        }
      ],

      tempCondition1: "Equal",
      temp11: 0,
      temp21: 0,
      selectedUser1: [],
      alertTypes: ["success", "warning", "danger"],
      alertType1: "success",
      content: {},
    };
  },
  methods: {
    removeNotification(index) {
      this.actions.splice(index,1)
    },
    addNotification() {
      if (this.answerType(this.answer.type.id).content == "temperature") {
        this.actions.push({
          notificationName: "",
          alertType: "success",
          messageType: ["app"],
          selectedUser:[],
          tempCondition: 'equal',
          content: [0,0],
          notificationDes: "",
        })
      } else  {
        this.actions.push({
          notificationName: "",
          alertType: "success",
          messageType: ["app"],
          selectedUser:[],
          content: '',
          notificationDes: "",
        })
      }
    },
    applyaAction() {
      this.$emit("applyAction", this.actions)
    }
  },
  watch: {
    open(val) {
      if (val) {
        if(Array.isArray(this.answer.action) && this.answer.action.length > 0) {
          this.actions = JSON.parse(JSON.stringify(this.answer.action))
        } else {
          if (this.answerType(this.answer.type.id).content == "temperature") {
            this.actions = [{
              name: "",
              color: "success",
              types: ["app"],
              teams:[],
              condition: 'equal',
              content: [0,0],
              description: "",
            }]
          } else {
            this.actions = [{
              name: "",
              color: "success",
              types: ["app"],
              teams:[],
              content: '',
              description: "",
            }]
          }
        }
      }
    },
  },
  computed: {
    teams() {
      return this.$store.getters["app/teams"];
    },
    answerType() {
      return (id) => {
        return this.$store.getters["app/getTemplateTypeById"](id);
      };
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
.answer-action {
  ::v-deep .vs-sidebar--background {
    z-index: 52000;
  }

  ::v-deep .vs-sidebar {
    z-index: 52000;
    width: 500px;
    max-width: 100vw;
  }
  .scroll-area--data-list-add-new {
    height: calc(100% - 4.3rem);
  }
}
</style>