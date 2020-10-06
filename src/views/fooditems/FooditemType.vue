<template>
  <vs-popup class="holamundo" :title="$t('choose the type')" :active.sync="popupActive">
    <div class="sm:p-4 p-0 flex items-center justify-center">
      <vs-button
        @click="$emit('selectType','delivered')"
        color="rgba(108, 80, 240, 0.1)"
        @close="popupActive=false"
        text-color="rgba(108, 80, 240)"
      >
        <vs-icon icon-pack="feather" icon="icon-package"></vs-icon>
        <span class="karla ml-2">{{$t("delivered")}}</span>
      </vs-button>
      <vs-button
        @click="$emit('selectType','prepared')"
        class="ml-4 py-0"
        color="rgba(108, 80, 240, 0.1)"
        @close="popupActive=false"
        text-color="rgba(108, 80, 240)"
        style="padding:.6rem 2rem!important;"
      >
        <div class="items-center flex p-0">
          <vs-icon
            icon="room_service"
            style="font-size: 20px; font-family: 'Material Icons Outlined';"
          ></vs-icon>
          <span class="karla ml-2">{{$t("prepared")}}</span>
        </div>
      </vs-button>
    </div>
  </vs-popup>
</template>

<script>
export default {
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    popupActive: {
      get() {
        return this.open;
      },
      set() {
        this.$emit("close");
      },
    },
  },
  methods: {
    select() {},
  },
};
</script>