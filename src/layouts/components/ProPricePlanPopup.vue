<template>
  <vs-popup
    classContent="popup-example"
    class="popup-image-upload"
    title="Subscribe to continue"
    :active.sync="activePrompt"
  >
    <VuePerfectScrollbar
      class="scroll-template-making mt-4 pb-6 px-4 log-sidebar"
      :settings="settings"
    >
      <div>
        <p style="font-size: 15px">
          <b>Congratulations,</b> it looks like you are ready to throw away your
          old folders. You have reached the limit of the free plan, please
          update your credit card details to continue working in paperless
          environment
        </p>
      </div>
    </VuePerfectScrollbar>
    <vs-divider />
    <div class="flex items-center justify-end">
      <a href="https://www.qualizy.app/get/" target="_blank">
        <vs-button>Upgrade to pro</vs-button>
      </a>
    </div>
  </vs-popup>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { db } from "@/firebase/firebaseConfig";
import firebase from "firebase";

export default {
  components: {
    VuePerfectScrollbar,
  },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.6,
      },
    };
  },
  computed: {
    activePrompt: {
      get() {
        return this.open;
      },
      set() {
        this.$emit("close");
      },
    },
  },
  methods: {},
};
</script>