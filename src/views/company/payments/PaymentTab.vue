<template>
  <div
    class="vx-row items-grid-view match-height"
    v-bind:class="{ hidden: !allLoaded }"
  >
    <div class="vx-col md:w-7/12 w-full mt-4 flex-wrap">
      <!-- <vs-button
        :disabled="loadingAddBillingDetail"
        @click="addBillingDetail"
        >{{
          loadingAddBillingDetail ? $t("Loading...") : $t("Add billing details")
        }}</vs-button
      > -->
      <vx-card>
        <div class="card-header p-6" slot="no-body">
          <div class="flex justify-between items-center pb-3">
            <h4 class="font-semibold hidden md:block">
              {{ $t("Billing Details") }}
            </h4>
            <vs-button
              :disabled="loadingAddBillingDetail"
              @click="addBillingDetail"
              v-if="!subscribed"
              class="w-full md:w-auto"
              >{{
                loadingAddBillingDetail
                  ? $t("Loading...")
                  : $t("Add billing details")
              }}</vs-button
            >

            <vs-button
              :disabled="loadingManageBillingDetails"
              @click="manageBillingDetails"
              v-if="subscribed"
              >{{
                loadingManageBillingDetails
                  ? $t("Loading...")
                  : $t("Manage billing details")
              }}</vs-button
            >
          </div>
          <vs-alert
            :active="true"
            color="#8E4D00"
            icon="warning"
            class="ek-header-alert"
            v-if="!subscribed && numberOfLogs >= 311"
          >
            <span>
              {{
                $t(
                  "You reached the limit of free logs. Provide billing details to continue using the system."
                )
              }}
            </span>
          </vs-alert>

          <div id="my-subscription" v-if="subscribed && !isFreePlan">
            <p>
              Your monthly payment depends on the number of logs you make during
              a month. Next payment will be billed on
              {{ nextBillingDate | moment("DD/MM/YYYY") }}.
            </p>
          </div>
        </div>

        <div class="">
          <p class="current-log-text pb-5 hidden md:block">
            {{ $t("Current logs usage per month") }}
          </p>
          <div class="hidden md:block">
            <div class="logs-track-bar mt-20 mb-10">
              <div class="main-bar" ref="mainBar">
                <div class="hight-bars">
                  <div>
                    <div class="log-count absolute left-0">0</div>
                    <div class="hight-bar invisible"></div>
                    <div class="dollar-rate absolute left-0">
                      {{ $t("Free") }}
                    </div>
                  </div>
                  <div
                    v-for="(item, index) in logTrackInfos"
                    :key="item.dolars"
                    :style="'margin-left:' + item.width + '%'"
                  >
                    <div v-if="index != 6">
                      <div class="log-count absolute">{{ item.logs }}</div>
                      <div class="hight-bar"></div>
                      <div class="dollar-rate absolute">
                        {{ "$" + item.dolars }}
                      </div>
                    </div>

                    <div v-else>
                      <div class="log-count absolute" style="left: -10px">
                        {{ item.logs }}
                      </div>
                      <div class="hight-bar"></div>
                      <div class="dollar-rate absolute" style="left: -20px">
                        {{ "$" + item.dolars }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="scroll-bar" :style="{ width: scrollNumberOfLogs }">
                <div class="hight-bar">
                  <span class="tooltiptext"
                    ><span> {{ numberOfLogs }} {{ $t("logs") }}</span></span
                  >
                </div>
              </div>
            </div>
          </div>
          <p
            class="current-log-text pt-5"
            v-bind:class="{ hidden: isFreePlan }"
          >
            {{
              $t("You need to log another") +
              numberOfLogsRemained +
              $t("logs to reach a cheaper pricing plan.")
            }}
            <vs-tooltip
              class="inline-block cursor-pointer"
              :text="$t(`Qualizy pricing is based on task logs...`)"
              position="right"
            >
              <vs-icon
                icon="error_outline"
                class="text-2xl"
                style="position: relative; top: 5px"
              ></vs-icon>
            </vs-tooltip>
          </p>
          <p class="text-2xl pb-5 pt-5 mt-1" style="font-size: 20px">
            {{ $t("Accrued amount to be paid this month:") }}
            <span class="font-semibold" style="font-size: 25px"
              >${{ nextPaymentPrice }}</span
            >
          </p>
        </div>
      </vx-card>

      <vx-card class="mt-6 hidden">
        <div class="" slot="no-body">
          <div class="p-6 inline-block w-10/12">
            <h4 class="font-semibold mt-2">
              {{
                $t(
                  "Invite your friends to use Qualizy and get 150 FREE logs each time"
                )
              }}
              <vs-icon
                icon="error_outline"
                class="text-2xl"
                style="position: relative; top: 5px"
              ></vs-icon>
            </h4>
            <p class="current-log-text pb-5 pt-5">
              {{ $t("This referral program resets every month.") }}
            </p>
            <vs-button
              text-color="#2400d0"
              color="#dedbf0"
              class="p-3 sm:px-5"
              type="filled"
              >+ {{ $t("Invite another professional") }}</vs-button
            >
          </div>
          <div class="inline-block w-2/12 star-man-wrapper">
            <img
              class="w-full h-full"
              :src="
                require(`@/assets/images/pages/company/main-with-stars.png`)
              "
              alt="main-with-stars"
            />
          </div>
        </div>
      </vx-card>
    </div>

    <div class="vx-col md:w-5/12 w-full mt-4">
      <vx-card>
        <h4 class="font-semibold mt-2 mb-6">
          {{ $t("Billing history") }}
        </h4>

        <div class="billing-history-table">
          <vs-table
            v-if="billings.length > 0"
            pagination
            :maxItems="10"
            :data="billings"
            hoverFlat
            notSpacer
            description
            :description-items="[10]"
            description-title="Entries"
            description-connector="of"
            description-body="Count"
          >
            <template slot="thead">
              <vs-th sort-key="created"> Date </vs-th>
              <vs-th sort-key="total"> Amount </vs-th>
              <vs-th sort-key="status"> Status </vs-th>
              <vs-th> </vs-th>
            </template>

            <template slot-scope="{ data }">
              <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                <vs-td :data="data[indextr].created">
                  {{ data[indextr].created | moment("DD/MM/YYYY") }}
                </vs-td>

                <vs-td :data="data[indextr].total">
                  $ {{ (data[indextr].total / 100).toFixed(2) }}
                </vs-td>

                <vs-td :data="data[indextr].status">
                  <span
                    v-bind:class="{
                      'text-gray-400': data[indextr].status == 'draft',
                      'text-yellow-300': data[indextr].status == 'pending',
                      'text-yellow-700': data[indextr].status == 'failed',
                      aaa: data[indextr].status == 'paid',
                    }"
                  >
                    {{ data[indextr].status | capitalize }}
                  </span>
                </vs-td>

                <vs-td>
                  <a
                    :href="
                      data[indextr].invoice_pdf ? data[indextr].invoice_pdf : ''
                    "
                  >
                    <img
                      class="w-2/3 h-full"
                      :src="
                        require(`@/assets/images/pages/company/invoice-download.svg`)
                      "
                      alt="invoice-download"
                    />
                  </a>
                </vs-td>
              </vs-tr>
            </template>
          </vs-table>

          <div
            class="no-billings-div flex flex-wrap justify-center justify-items-center relative"
            v-else
          >
            <p class="mt-12 mb-24">
              {{ $t("You have no billing history yet") }}
            </p>
            <img
              class="w-2/3 h-full pb-24"
              :src="require(`@/assets/images/pages/company/no-billings.svg`)"
              alt="no-billings"
            />
          </div>
        </div>
      </vx-card>
    </div>

    <div class="vx-col md:w-12/12 w-full mt-4 mb-20 block hidden">
      <vx-card>
        <h4 class="font-semibold mt-2 mb-6">
          {{
            $t("Estimate how much you are currently saving by using Qualizy")
          }}
        </h4>
        <div class="vx-row items-grid-view match-height">
          <div class="vx-col md:w-7/12 w-full mt-4 block pl-0 pr-8">
            <div class="slider-groups">
              <div class="slider-group mb-10">
                <p class="label">
                  {{ $t("What is your average employee salary?") }}
                  <vs-icon
                    icon="error_outline"
                    class="text-2xl"
                    style="position: relative; top: 5px"
                  ></vs-icon>
                </p>
                <div class="value-input mt-3">
                  <vs-input
                    size="default"
                    type="number"
                    v-model="dollarPerHour"
                  />
                  <span> {{ $t("an hour") }}</span>
                </div>
                <div class="value-slider">
                  <vs-slider v-model="dollarPerHour" />
                  <div class="hight-bar"></div>
                  <div class="marks flex justify-between">
                    <div>0</div>
                    <div style="position: relative; left: 7px">50</div>
                    <div>100</div>
                  </div>
                </div>
              </div>

              <div class="slider-group mb-10">
                <p class="label">
                  {{ $t("How many people do you have on your team?") }}
                </p>
                <div class="value-input mt-3">
                  <vs-input size="default" type="number" v-model="employees" />
                  <span> {{ $t("employees") }}</span>
                </div>
                <div class="value-slider">
                  <vs-slider v-model="employees" :max="1000" />
                  <div class="hight-bar"></div>
                  <div class="marks flex justify-between">
                    <div>0</div>
                    <div style="position: relative; left: 5px">500</div>
                    <div>1000</div>
                  </div>
                </div>
              </div>

              <div class="slider-group mb-6">
                <p class="label">
                  {{ $t("How many fridges/freezers does your business have?") }}
                </p>
                <div class="value-input mt-3">
                  <vs-input size="default" type="number" v-model="units" />
                  <span> {{ $t("units") }}</span>
                </div>
                <div class="value-slider">
                  <vs-slider v-model="units" />
                  <div class="hight-bar"></div>
                  <div class="marks flex justify-between">
                    <div>0</div>
                    <div style="position: relative; left: 7px">50</div>
                    <div>100</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="vx-col md:w-5/12 w-full mt-4 block pl-8 pr-0">
            <div class="dollar-infos">
              <div class="info mb-8">
                <p class="label">
                  {{ $t("Your forecasted expenses using pen and paper") }}
                  <vs-icon
                    icon="error_outline"
                    class="text-2xl"
                    style="position: relative; top: 5px"
                  ></vs-icon>
                </p>
                <h2 class="mt-2 font-bold">$ 2,098</h2>
              </div>
              <div class="info mb-8">
                <p class="label">
                  {{ $t("Expenses on Qualizy") }}
                </p>
                <h2 class="mt-2 font-bold">$ 45</h2>
              </div>
              <div class="info mb-8">
                <p class="label">
                  {{ $t("Current saving") }}
                </p>
                <h1 class="text-4xl font-bold mt-2" style="color: #6c50f0">
                  $ 2,053
                </h1>
              </div>
            </div>

            <p class="label">
              {{ $t(`about_estimate`) }}
            </p>
          </div>
        </div>
      </vx-card>
    </div>

    <billing-detail-popup
      :open="billingDetailPopup"
      @close="billingDetailPopup = false"
    />
  </div>
</template>

<script>
import BillingDetailPopup from "./BillingDetailPopup";
import VxCard from "../../../components/vx-card/VxCard.vue";
import { db } from "@/firebase/firebaseConfig.js";
import firebase from "firebase/app";
import $ from "jquery";

import { loadStripe } from "@stripe/stripe-js";
let tempDate = new Date();
tempDate.setFullYear(2000);
console.log("tempDate", tempDate, tempDate.getFullYear());

export default {
  components: {
    BillingDetailPopup,
  },
  data() {
    return {
      // subscribed: false,
      // isFreePlan: false,
      // currBillingDate: tempDate,
      // nextBillingDate: new Date(),
      // numberOfLogs: 0,
      allLoaded: false,
      functionLocation: "us-central1",
      stripePrice: "price_1IGqz0KotMxlCKnOhC34kaqB",
      sessionId: "",
      customerStripeId: "false",
      mySubscription: "",
      loadingAddBillingDetail: false,
      loadingManageBillingDetails: false,
      billingDetailPopup: false,
      mainBarWidth: 0,
      numberOfLogsRemained: 469,
      dollarPerHour: 30,
      employees: 34,
      units: 60,
      logTrackInfos: [
        {
          width: 7,
          logs: 312,
          dolars: 0.027,
        },
        {
          width: 9,
          logs: 780,
          dolars: 0.024,
        },
        {
          width: 9,
          logs: 1300,
          dolars: 0.023,
        },
        {
          width: 10,
          logs: 2080,
          dolars: 0.022,
        },
        {
          width: 12,
          logs: 3120,
          dolars: 0.019,
        },
        {
          width: 15,
          logs: "26k",
          dolars: 0.016,
        },
        {
          width: 32,
          logs: "260k",
          dolars: 0.014,
        },
      ],
      billings: [],
      upcomingInvoice: {},
      nextPaymentPrice: 0,
    };
  },
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
    scrollNumberOfLogs() {
      let plans = [];
      let scroll = 0;
      let commingPlan = 312;
      let alreadyWidth = 0;
      let stepPercent = 7;
      let currentPlanIndex = 0;

      if (this.numberOfLogs < 312) {
      } else if (this.numberOfLogs < 780) {
        currentPlanIndex = 1;
      } else if (this.numberOfLogs < 1300) {
        currentPlanIndex = 2;
      } else if (this.numberOfLogs < 2080) {
        currentPlanIndex = 3;
      } else if (this.numberOfLogs < 3120) {
        currentPlanIndex = 4;
      } else if (this.numberOfLogs < 26000) {
        currentPlanIndex = 5;
      } else if (this.numberOfLogs < 260000) {
        currentPlanIndex = 6;
      } else if (this.numberOfLogs == 260000) {
        currentPlanIndex = 6;
      } else {
        return this.mainBarWidth;
      }

      let currentPlan = this.logTrackInfos[currentPlanIndex].logs;
      if (currentPlan == "26k") {
        currentPlan = 26000;
      } else if (currentPlan == "260k") {
        currentPlan = 260000;
      }

      let beforePlan = 0;
      if (currentPlanIndex != 0) {
        beforePlan = this.logTrackInfos[currentPlanIndex - 1].logs;
        if (beforePlan == "26k") {
          beforePlan = 26000;
        } else if (beforePlan == "260k") {
          beforePlan = 260000;
        }
      }

      this.numberOfLogsRemained = currentPlan - this.numberOfLogs;

      for (let i = 0; i < currentPlanIndex; i++) {
        alreadyWidth += parseInt(this.logTrackInfos[i].width);
      }

      let percentOfcurrentLogs =
        ((this.numberOfLogs - beforePlan) / (currentPlan - beforePlan)) * 100;
      let partWidth =
        (this.mainBarWidth / 100) * this.logTrackInfos[currentPlanIndex].width;
      scroll =
        eval((partWidth / 100) * percentOfcurrentLogs) +
        eval(
          (this.mainBarWidth / 100) * (alreadyWidth + currentPlanIndex / 3.5)
        );

      // console.log("currentPlan ", currentPlan);
      // console.log("beforePlan ", beforePlan);
      // console.log("diffBySteps ", currentPlan - beforePlan);
      // console.log("percentOfcurrentLogs ", percentOfcurrentLogs);
      // console.log("partWidth ", partWidth);
      // console.log("this.numberOfLogs ", this.numberOfLogs);
      // console.log("this.mainBarWidth ", this.mainBarWidth);
      // console.log(
      //   "alreadyWidth ",
      //   alreadyWidth,
      //   eval((this.mainBarWidth / 100) * alreadyWidth)
      // );
      // console.log(
      //   "[currentPlanIndex].width ",
      //   this.logTrackInfos[currentPlanIndex].width,
      //   eval((partWidth / 100) * percentOfcurrentLogs)
      // );
      // console.log("scroll ", scroll);

      return scroll + "px";
    },
  },
  async mounted() {
    this.$vs.loading();

    // GET customer stripe ID and GET Invoices
    db.collection("customers")
      .doc(JSON.parse(localStorage.getItem("userInfo")).id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          this.customerStripeId = doc.data().stripeId;
          console.log("customer ", this.customerStripeId, doc);
          this.getInvoices();
        } else {
          this.customerStripeId = "invalid";
          this.billings = [];
          this.allLoaded = true;
          this.$vs.loading.close();
        }
      });

    // SET mainBar width (log track bar)
    this.mainBarWidth = $(".logs-track-bar .main-bar").width();
    console.log("this.$refs.mainBar, ", this.mainBarWidth);
  },
  methods: {
    async addBillingDetail() {
      const stripe = await loadStripe(this.$stripePublishableKey);
      this.loadingAddBillingDetail = true;

      // stripe.redirectToCheckout({
      //   sessionId:
      //     "cs_test_c1DlmTPo5S61HnpS8wQYgvikwWevWdmdhM0BGx0suJXSmZpuF6BR39hx9P",
      // });
      // return;

      let customer_url = `${this.$firebaseFunctionUrl}/setupBillingDetail`;
      this.$http
        .get(customer_url, {
          params: {
            uid: JSON.parse(localStorage.getItem("userInfo")).id,
            email: JSON.parse(localStorage.getItem("userInfo")).email,
            success_url: window.location.href,
            cancel_url: window.location.href,
            currentUsageOfLogs: this.numberOfLogs,
          },
        })
        .then((res) => {
          console.log("customer res", res.data.result);
          stripe.redirectToCheckout({
            sessionId: res.data.result.session.id,
          });
        });
    },

    async manageBillingDetails() {
      // Call billing portal function
      this.loadingManageBillingDetails = true;
      const functionRef = firebase
        .app()
        .functions(this.functionLocation)
        .httpsCallable("ext-firestore-stripe-subscriptions-createPortalLink");
      const { data } = await functionRef({ returnUrl: window.location.href });
      window.location.assign(data.url);
      // this.loadingManageBillingDetails = false;
    },

    async getCustomClaimRole() {
      await firebase.auth().currentUser.getIdToken(true);
      const decodedToken = await firebase.auth().currentUser.getIdTokenResult();
      return decodedToken.claims.stripeRole;
    },

    async getInvoices() {
      let invoice_url = `${this.$firebaseFunctionUrl}/getInvoicesByCus`;
      this.$http
        .get(invoice_url, {
          params: {
            customerStripeId: this.customerStripeId,
            startingAfter: null,
            limit: 10,
          },
        })
        .then((res) => {
          console.log("invoices", res.data.invoices);
          this.billings = res.data.invoices;
          this.upcomingInvoice = res.data.upcomingInvoice;
          if (this.upcomingInvoice) {
            this.nextPaymentPrice =
              (this.upcomingInvoice.amount_due -
                this.upcomingInvoice.amount_paid) /
              100;
          }
          console.log("upcomingInvoice", res.data.upcomingInvoice);
          this.allLoaded = true;
          this.$vs.loading.close();
        });
    },
  },
};
</script>

<style lang="scss">
.card-header {
  border-bottom: 2px solid #ebebf1;

  .ek-header-alert {
    height: auto !important;
    background: rgba(234, 164, 1, 0.12) !important;

    .icon-alert {
      color: #eaa401;
    }
  }
}

.current-log-text {
  font-size: 16px;
}

.logs-track-bar {
  .main-bar {
    height: 24px;
    background: #ebebf1;
    border-radius: 2px;

    .hight-bars {
      display: flex;
      position: relative;
      top: -4px;

      > div {
        position: relative;

        .log-count {
          left: -5px;
          margin-top: -30px;
          font-family: Karla;
          font-style: normal;
          font-weight: normal;
          font-size: 14px;
          line-height: 24px;
          color: #1e1c26;
          opacity: 0.56;
        }

        .hight-bar {
          width: 2px;
          height: 32px;
          background: #ebebf1;
          // background: #cc5219;
          border-radius: 1px;
          position: relative;
        }

        .dollar-rate {
          left: -5px;
          margin-top: 10px;
          font-family: Karla;
          font-style: normal;
          font-weight: normal;
          font-size: 14px;
          line-height: 24px;
          color: #1e1c26;
          opacity: 0.56;
        }
      }
    }
  }

  .scroll-bar {
    // width: 39px;
    transition: 0.3s;
    height: 24px;
    background: linear-gradient(90deg, #3b4dee 0%, #6c50f0 100%);
    border-radius: 2px;
    position: absolute;
    margin-top: -24px;

    .hight-bar {
      width: 2px;
      height: 40px;
      background: #6c50f0;
      border-radius: 1px;
      float: right;
      position: relative;
      top: -8px;

      .tooltiptext {
        visibility: visible;
        width: 95px;
        background-color: #555;
        color: #fff;
        text-align: center;
        border-radius: 6px;
        padding: 10px 12px;
        position: absolute;
        z-index: 1;
        bottom: 160%;
        left: 50%;
        margin-left: -47px;
        opacity: 1;
        transition: opacity 0.3s;

        > span {
          font-size: 14px;
          line-height: 24px;
        }
      }

      .tooltiptext::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: #555 transparent transparent transparent;
      }
    }
  }
}

.star-man-wrapper {
  position: absolute;
  width: 19%;
  height: 93%;
  margin-left: -5%;
  margin-top: 2%;
}

.billing-history-table {
  .vs-table--content {
    // border: 2px solid #f8f8f8;

    .vs-con-tbody {
      border: none;
      table {
        width: calc(100% - 1px);
      }
      .vs-table--tbody-table {
        > thead {
          border-bottom: 2px solid #f8f8f8;
        }
        > tr {
          border-left: 2px solid #f8f8f8;
          border-right: 2px solid #f8f8f8;
          border-bottom: 1px solid #f8f8f8;

          > td {
            padding: 12px 10px;
          }

          &:last-child {
            border-bottom: 2px solid #f8f8f8;
          }
        }
      }
    }
  }
  .con-pagination-table {
    padding-left: 0;
    padding-right: 0;
    // margin-top: 20px;
    .vs-row {
      .vs-col {
        padding-left: 0;
        padding-right: 0;
      }
    }
  }

  .no-billings-div {
    //     margin-top: 50%;
    // transform: translate(0, -50%);

    p {
      font-family: Karla;
      font-style: normal;
      font-weight: normal;
      font-size: 24px;
      line-height: 28px;
      display: flex;
      align-items: center;
      text-align: center;
    }
  }
}

.slider-groups {
  .slider-group {
    .label {
    }
    .value-input {
      > .vs-input {
        width: 80px;
        display: inline-block;
        margin-right: 10px;
      }
    }
    .value-slider {
      .con-vs-slider {
        margin-bottom: 0;

        .vs-slider--circle {
          left: 26%;
          border-radius: 0;
          background: #7367f0;

          &::after {
            content: "=";
            display: block;
            transform: rotate(90deg);
            color: white;
            position: relative;
            top: -4px;
            left: -1px;
            font-size: 17px;
          }
        }
      }
      .hight-bar {
        background: #ebebf1;
        position: relative;
        margin-top: -8px;
        width: 2px;
        height: 12px;
        border-radius: 1px;
        left: 50%;
        transform: translate(-50%);
      }
      .marks {
        position: relative;

        > div {
          font-size: 12px;
        }
      }
    }
  }
}
.text-yellow-400 {
  color: rgba(251, 191, 36, 1);
}
.text-yellow-300 {
  color: rgba(252, 211, 77, 1);
}
.text-yellow-700 {
  color: rgba(180, 83, 9, 1);
}
.text-gray-400 {
  color: rgba(156, 163, 175, 1);
}
.font-bold {
  font-weight: bold;
}
</style>