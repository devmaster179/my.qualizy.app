<template>
  <div class="match-height">
    <div class="mt-4"></div>

    <vx-card class="h-full customer-portal-card">
      <div class="card-header p-6" slot="no-body">
        <div class="flex justify-between items-center">
          <h4 class="font-semibold hidden md:block">
            {{ $t("Count of logs you used: ") }} <b>{{ numberOfLogs }}</b>
          </h4>
          <a href="https://www.qualizy.app/get/" target="_blank">
            <vs-button class="w-full md:w-auto">{{
              $t("Upgrade Plan")
            }}</vs-button>
          </a>
        </div>
      </div>
      <div>
        <div v-if="!subscribed">
          <iframe
            class="w-full"
            frameborder="0"
            id="customerPortalIframe"
            :secret="paykickstart_secret"
            scrolling="no"
            src="https://app.paykickstart.com/billing?portal=809LqB6hq3COxnbdKT7V6fqvhqVzFQ4DQTcJZdnz0kml4BXqda"
          ></iframe>
        </div>
        <div v-else>
          <p class="text-center text-lg text-warning">
            Customer Portal will be appear here once you upgrade your Plan.
          </p>
        </div>
      </div>
    </vx-card>
  </div>
</template>

<script>

export default {
  data() {
    return {
      paykickstart_secret: "",
    };
  },
  directives: {},
  computed: {
    subscribed() {
      let subscription = this.$store.getters["app/getSubscription"];
      return subscription.subscribed;
    },
    currBillingDate() {
      let subscription = this.$store.getters["app/getSubscription"];
      return subscription.currBillingDate;
    },
    nextBillingDate() {
      let subscription = this.$store.getters["app/getSubscription"];
      return subscription.nextBillingDate;
    },
    numberOfLogs() {
      let currentPricePlan = this.$store.getters["app/getCurrentPricePlan"];
      return currentPricePlan.numberOfLogs;
    },
    isFreePlan() {
      let currentPricePlan = this.$store.getters["app/getCurrentPricePlan"];
      return currentPricePlan.isFreePlan;
    },
  },
  mounted() {
    this.loginToCustomerPortal();

    console.log("numberOfLogs", this.numberOfLogs);
    let recaptchaScript = document.createElement("script");
    recaptchaScript.setAttribute(
      "src",
      "https://app.paykickstart.com/billing-portal/js/809LqB6hq3COxnbdKT7V6fqvhqVzFQ4DQTcJZdnz0kml4BXqda"
    );
    document.head.appendChild(recaptchaScript);
  },
  methods: {
    loginToCustomerPortal() {
      console.log("loginToCustomerPortal called");
      let url = `${this.$firebaseFunctionUrl}/loginToCustomerPortal`;
      this.$http
        .post(url, {
          email:
            "amayor.lu@gmail.com" ||
            JSON.parse(localStorage.getItem("userInfo")).email,
        })
        .then((res) => {
          console.log("res", res);
          this.paykickstart_secret = res.data.secret;
        });
    },
  },
};
</script>

<style>
#customerPortalIframe {
  height: 1000px;
}

.customer-portal-card .card-header {
  border-bottom: 2px solid #ebebf1;
}
</style>