<template>
  <div class="edit-title w-full">
    <h3
      v-show="!edit"
      class="cursor-pointer"
      @click="editTitle"
      :class="[calClass,color!==''?color:'']"
      :style="[icon!==''?{'float':'left'}:{}]"
    >
      <!-- <h3 v-show="!edit" class="cursor-pointer"  @click="editTitle" :class="size==='lg' ? 'font-lg' : 'font-sm mt-1'" :style="[icon!==''?{'float':'left'}:{}]"> -->
      {{ titleText | shortText(short) }}
    </h3>
    <vs-icon
      v-show="icon!=='' && !edit"
      :icon="icon"
      :class="color!==''? color:'text-gray'"
      class="cursor-pointer ml-2 mt-1"
      :size="size=='lg'? '20px' : '15px'"
    ></vs-icon>
    <vs-input
      ref="title"
      v-show="edit"
      @blur="titleText=title1"
      @keyup.enter="titleText=title1"
      :size="size==='lg' ? 'large' : ''"
      :placeholder="placeholder"
      class="w-full"
      v-model="title1"
    />
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String
    },
    title: {
      type: String
    },
    size: {
      type: String
    },
    icon: {
      type: String
    },
    short: {
      type: String,
      default: "0"
    },
    color: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      edit: false,
      title1: ""
    };
  },

  computed: {
    calClass() {
      if (this.size == "lg") return "font-lg";
      else if (this.size == "md") return "font-md";
      else if (this.size == "sm") return "font-sm";
    },
    titleText: {
      get() {
        if (this.title === "") return this.placeholder;
        else {
          // this.title1 = this.title
          return this.title;
        }
      },
      set(val) {
        this.edit = false;
        if (val === "") val = this.placeholder;
        this.$emit("input", val);
      }
    }
  },
  watch: {
    title(val) {
      if (val == "") val = this.placeholder;
      this.title1 = val;
    }
  },
  methods: {
    editTitle() {
      this.edit = true;
      this.title1 = this.title;
      if (this.title1 == this.placeholder) this.title1 = "";
      this.$nextTick(() => {
        this.$refs.title.$refs.vsinput.focus();
      });
    }
  }
};
</script>

<style scoped>
.edit-title h3:hover {
  color: inherit;
}
.edit-title h3 {
  word-break: break-word;
}
.edit-title h3 > * {
  -webkit-transition: -webkit-transform 0.25s ease;
  transition: -webkit-transform 0.25s ease;
  transition: transform 0.25s ease;
  transition: transform 0.25s ease, -webkit-transform 0.25s ease;
}

.edit-title h3:hover > * {
  transform: translateY(-5px);
  cursor: pointer;
}

.edit-title h4 > * {
  -webkit-transition: -webkit-transform 0.25s ease;
  transition: -webkit-transform 0.25s ease;
  transition: transform 0.25s ease;
  transition: transform 0.25s ease, -webkit-transform 0.25s ease;
}

.edit-title h4:hover > * {
  transform: translateY(-5px);
  cursor: pointer;
}
.font-sm {
  padding-top: 5px;
  font-size: 1em;
  font-weight: 400;
}
.font-md {
  font-size: 1.2em;
  font-weight: 450;
}
</style>