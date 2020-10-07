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
    v-if="
      !(
        answer == undefined ||
        answer.type == undefined ||
        answer.type.id === undefined ||
        answerType(answer.type.id) === undefined
      )
    "
  >
    <div class="mt-6 flex items-center justify-between px-6">
      <h4>{{ $t("action") }}</h4>
      <feather-icon
        icon="XIcon"
        @click.stop="isSidebarActiveLocal = false"
        class="cursor-pointer"
      ></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>
    <div
      v-for="(action, index) in actions"
      :key="index"
      class="answer-action-content p-4"
    >
      <div class="answer-action-type-select mt-5">
        <p class="karla text-lg">{{ $t("Notification Name") }}</p>
        <vs-input
          :label="$t('') | capitalize"
          v-model="action.notificationName"
        />
      </div>
      <template v-if="answerType(answer.type.id).content == 'temperature'">
        <div class="temperature-section">
          <div class="condition-section">
            <p class="karla text-lg">{{ $t("condition") | capitalize }}</p>
            <v-select
              :options="conditions"
              label="title"
              v-model="action.tempCondition"
            />
          </div>
          <div class="condition-value-section mt-6">
            <p class="karla text-lg">{{ $t("temperature") }}</p>
            <div class="flex items-center">
              <vs-input
                step=".1"
                type="number"
                class="w-full"
                v-model="action.temp1"
                :class="{ 'pr-2': tempCondition.name == 'Between' }"
              />
              <vs-input
                step=".1"
                type="number"
                class="w-full"
                v-model="temp2"
                :class="{ 'pl-2': tempCondition.name == 'Between' }"
                v-if="tempCondition.name == 'Between'"
              />
            </div>
          </div>
        </div>
      </template>
      <template v-if="answerType(answer.type.id).type == 'closed answers'">
        <div class="closed-answers-section mt-5">
          <p class="karla text-lg">{{ $t("if answer is") }} ...</p>
          <v-select
            :options="answerType(answer.type.id).content"
            label="name"
            v-model="action.content"
          />
        </div>
      </template>
      <div class="answer-action-team-select mt-5">
        <p class="karla text-lg">
          {{ $t("send a notification to") }} {{ $t("teams") }}
        </p>
        <multiselect
          v-model="action.selectedUser"
          :placeholder="$t('select')"
          label="name"
          track-by="id"
          :options="teams"
          :multiple="true"
          :show-labels="false"
        ></multiselect>
      </div>
      <div class="answer-action-type-select mt-5">
        <p class="karla text-lg">{{ $t("notification type") }}</p>
        <v-select :options="alertTypes" v-model="action.alertType">
          <template slot="option" slot-scope="option">
            <span>{{ $t(option.label) | capitalize }}</span>
          </template>
          <template slot="selected-option" slot-scope="option">
            <span>{{ $t(option.label) | capitalize }}</span>
          </template>
        </v-select>
      </div>
      <div class="answer-action-type-select mt-5">
        <p class="karla text-lg">{{ $t("Message type") }}</p>
        <v-select :options="messageTypes" v-model="action.messageType" />
      </div>
      <div class="answer-action-type-select mt-5">
        <p class="karla text-lg">{{ $t("Message") }}</p>
        <vs-textarea
          :label="$t('') | capitalize"
          v-model="action.notificationDes"
        />
      </div>
    </div>
    <p class="karla text-lg add-notification" @click="addNotification">
      {{ $t("+Notification") }}
    </p>
    <div class="answer-action-footer mt-base bottom-padding">
      <div class="flex justify-end items-center">
        <vs-button
          @click="isSidebarActiveLocal = false"
          color="rgba(108, 80, 240, 0.1)"
          text-color="rgba(108, 80, 240)"
          class="kalar ml-2 mr-4"
          >{{ $t("cancel") }}</vs-button
        >

        <vs-button class="kalar ml-2 mr-4" @click="applyaAction">{{
          $t("save & apply")
        }}</vs-button>
      </div>
    </div>
  </vs-sidebar>
</template>

<script>
import VSelect from "vue-select";
import multiselect from "vue-multiselect";

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
  },
  data() {
    return {
      tempCondition1: "Equal",
      temp11: 0,
      temp21: 0,
      selectedUser1: [],
      alertTypes: ["success", "warning", "danger"],
      messageTypes: ["Email", "SMS", "In-app"],
      messageType: "Select",
      alertType1: "success",
      content: {},
      actions: [
        {
          alterType1: "success",
          messageType: "Select",
          notificationName: "",
          selectedUser:[],
          tempCondition: {},
          temp1: {},
          content: {},
          alertType: {},
          notificationDes: "",
        },
      ],
    };
  },
  methods: {
    addNotification() {
      this.actions = [
        ...this.actions,
        {
          alterType1: "success",
          messageType: "Select",
          notificationName: "",
          selectedUser:[],
          tempCondition: {},
          temp1: {},
          content: {},
          alertType: {},
          notificationDes: ""
        },
      ];
    },
    applyaAction() {
      if (this.answerType(this.answer.type.id).content == "temperature")
        this.$emit("applyAction", {
          alertType: this.alertType1,
          toUser: this.selectedUser1,
          condition: this.tempCondition1,
          content: [this.temp11, this.temp21],
        });
      else
        this.$emit("applyAction", {
          alertType: this.alertType1,
          toUser: this.selectedUser1,
          content: this.content,
        });
    },
  },
  watch: {
    open(val) {
      if (val) {
        if (this.answer.action.content !== undefined) {
          if (Array.isArray(this.answer.action.content)) {
            this.temp11 = this.answer.action.content[0];
            this.temp21 = this.answer.action.content[1];
          } else this.content = this.answer.action.content;
        }
        if (this.answer.action.condition !== undefined)
          this.tempCondition1 = this.answer.action.condition;
        if (this.answer.action.alertType !== undefined)
          this.alertType1 = this.answer.action.alertType;
        if (this.answer.action.toUser !== undefined)
          this.selectedUser1 = this.answer.action.toUser;
      }
    },
  },
  computed: {
    alertType: {
      get() {
        return this.alertType1;
      },
      set(val) {
        if (val === null) return;
        this.alertType1 = val;
      },
    },
    selectedUser: {
      get() {
        return this.teams.filter(
          (team) => this.selectedUser1.indexOf(team.id) > -1
        );
      },
      set(val) {
        this.selectedUser1 = [];
        val.map((item) => {
          this.selectedUser1.push(item.id);
        });
      },
    },
    teams() {
      return this.$store.getters["app/teams"];
    },
    temp1: {
      get() {
        return this.temp11;
      },
      set(val) {
        this.temp11 = val;
      },
    },
    temp2: {
      get() {
        return this.temp21;
      },
      set(val) {
        this.temp21 = val;
      },
    },
    conditions() {
      return [
        { name: "Equal", title: this.$t("equal") },
        { name: "Not Equal", title: this.$t("not equal") },
        { name: "Less Than", title: this.$t("less than") },
        { name: "Less Than or Equal", title: this.$t("less than or equal") },
        { name: "Greater Than", title: this.$t("greater than") },
        {
          name: "Greater Than or Equal",
          title: this.$t("greater than or equal"),
        },
        { name: "Between", title: this.$t("between") },
      ];
    },
    answerType() {
      return (id) => {
        return this.$store.getters["app/getTemplateTypeById"](id);
      };
    },
    tempCondition: {
      get() {
        return this.conditions.find((item) => item.name == this.tempCondition1);
      },
      set(val) {
        if (val === null) return;
        this.tempCondition1 = val.name;
      },
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
.bottom-padding {
  padding-bottom: 30px;
}
.add-notification {
  text-align: right;
  color: rgb(108, 80, 240);
  padding-right: 20px;
  cursor: pointer;
  font-weight: bold;
}

.answer-action {
  /deep/ .vs-sidebar--background {
    z-index: 52000;
  }

  /deep/ .vs-sidebar {
    z-index: 52000;
    width: 500px;
    max-width: 100vw;
  }

  /deep/ .vs-sidebar--items {
    overflow-y: auto;
  }
}
</style>
