<template>
  <div
    class="closed-answer-edit-content w-full"
    @mouseenter="editable=true"
    @mouseleave="editable=false"
  >
    <div class="relative" :class="{'justify-between flex items-center ':!activeEdit}">
      <p
        class="closed-answer-name karla w-full cursor-pointer"
        v-if="!activeEdit"
        style="padding:.786rem"
        @click="startEdit"
      >{{answerName}}</p>
      <div class="answer-color mr-2" v-if="!activeEdit" :style="`background:${content.color}`"></div>
      <vs-input
        v-model="answerName"
        v-if="activeEdit"
        ref="answerName"
        class="w-full vs-input-no-shdow-focus karla"
        @blur="blurInput"
      />
      <div class="color-picker">
        <swatches
          v-if="activeEdit"
          v-model="color"
          shapes="circles"
          show-border
          popover-to="left"
          row-length="5"
          show-fallback
          :trigger-style="triggerStyle"
          :swatch-style="swatchStyle"
        ></swatches>
      </div>
      <div class="edit-closed-answer-action text-right mt-2 mr-2" v-if="activeEdit">
        <vs-icon
          @click="$store.commit('app/REMOVE_CLOSED_ANSWER' , index)"
          class="hover:text-danger cursor-pointer"
          icon-pack="feather"
          icon="icon-trash-2"
          size="18px"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Swatches from "vue-swatches";

export default {
  components: {
    Swatches
  },
  props: {
    content: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  data() {
    return {
      editable: false,
      activeEdit: false,
      triggerStyle: {
        width: "22px",
        height: "22px"
      },
      swatchStyle: {
        width: "32px",
        height: "32px"
      }
    };
  },
  methods: {
    blurInput() {
      if (!this.editable) this.activeEdit = false;
    },

    startEdit() {
      this.activeEdit = true;
      this.$nextTick(() => {
        this.$refs.answerName.focusInput();
      });
    }
  },
  computed: {
    color: {
      get() {
        return this.content.color;
      },
      set(val) {
        this.$store.commit("app/CHN_CLOSED_ANSWER_COLOR", {
          index: this.index,
          color: val
        });
        this.$nextTick(() => {
          this.$refs.answerName.focusInput();
        });
      }
    },
    answerName: {
      get() {
        let name = this.content.name;
        return name == "" && !this.activeEdit ? this.$t("Unnamed") : name;
      },
      set(val) {
        this.$store.commit("app/CHN_CLOSED_ANSWER_NAME", {
          index: this.index,
          name: val
        });
      }
    }
  }
};
</script>
<style>
.closed-answer-edit-content .color-picker {
  position: absolute;
  right: 7px;
  top: 9px;
}
.closed-answer-edit-content .vs-inputx {
  font-family: "Karla";
  padding-left: 10px;
}
</style>
<style scoped>
.answer-color {
  width: 22px;
  height: 22px;
  border-radius: 50%;
}
</style>