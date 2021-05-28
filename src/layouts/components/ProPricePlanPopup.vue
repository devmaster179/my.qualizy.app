<template>
  <vs-prompt
    :title="$t('Subscribe to continue') | capitalize"
    :accept-text="$t('Upgrade to pro') | capitalize"
    :cancel-text="$t('cancel') | capitalize"
    :active.sync="activePrompt"
    @accept="showUpgradePro"
    @close="closePreventLogging"
    @cancel="closePreventLogging"
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
  </vs-prompt>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";

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
  methods: {
    showUpgradePro() {
      window.open("https://www.qualizy.app/get-monthly/", "_blank");
    },
    closePreventLogging() {
      this.$store.commit("app/SET_PREVENT_LOGGING", false);
    }
  },
};
</script>