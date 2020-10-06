<template>
  <div id="plan">
    <vx-card card-background="linear-gradient(120deg,#91eae4)">
      <div slot="no-body" class="pb-4">
        <img
          src="@/assets/images/pages/plan.jpg"
          alt="content-img"
          class="responsive card-img-top"
          style="opacity:.7;"
        />
        <div class="ml-4 flex flex-wrap absolute plan-option">
          <div class="mr-4">
            <span class="text-black">Pay Frequency:</span>
            <!-- <v-select :options="payMode" v-model="pMode" /> -->
            <vs-select v-model="pMode">
              <vs-select-item
                :key="index"
                :value="item"
                :text="item"
                v-for="(item,index) in payMode"
              />
            </vs-select>
          </div>
          <div>
            <!-- Pay engament:
            <v-select :options="engamentMode" v-model="engament" />-->
            <span class="text-black">Pay Engament:</span>
            <vs-select v-model="engament">
              <vs-select-item
                :key="index"
                :value="item"
                :text="item"
                v-for="(item,index) in engamentMode"
              />
            </vs-select>
          </div>
        </div>
        <div class="vx-row hidden md:block px-4">
          <table class="w-full round-lg my-3">
            <thead>
              <tr>
                <th class="border-solid border-r-0 d-theme-border-grey-light border">
                  <h1>Products</h1>
                </th>
                <th style="background-color:#039be5;">
                  <div>
                    <h1 class="text-white">Free Plan</h1>
                    <p
                      class="text-white my-2"
                      style="font-weight:400;"
                    >Generous limits for hobbyists</p>
                    <h3 class="text-white">Free</h3>
                  </div>
                </th>
                <th class="bg-primary">
                  <div>
                    <h1 class="text-white">Standard Plan</h1>
                    <p style="font-weight:400;" class="text-white my-2">Fixed pricing for start apps</p>
                    <h3
                      class="text-white"
                      v-if="pMode == 'Monthly' && engament == 'Yes'"
                    >${{plans[1].price.my}}/month</h3>
                    <h3
                      class="text-white"
                      v-else-if="pMode == 'Monthly' && engament == 'No'"
                    >${{plans[1].price.mn}}/month</h3>
                    <h3
                      class="text-white"
                      v-else-if="pMode == 'Yearly'"
                    >${{plans[1].price.yearly}}/year</h3>
                  </div>
                </th>
                <th class="bg-dark">
                  <div>
                    <h1 class="text-white">Pro Plan</h1>
                    <p
                      style="font-weight:400;"
                      class="text-white my-2"
                    >Fixed pricing for growing apps</p>
                    <h3
                      class="text-white"
                      v-if="pMode == 'Monthly' && engament == 'Yes'"
                    >${{plans[2].price.my}}/month</h3>
                    <h3
                      class="text-white"
                      v-else-if="pMode == 'Monthly' && engament == 'No'"
                    >${{plans[2].price.mn}}/month</h3>
                    <h3
                      class="text-white"
                      v-else-if="pMode == 'Yearly'"
                    >${{plans[2].price.yearly}}/year</h3>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(list,index) in plans[0].list" :key="'list' + index">
                <td class="border border-solid border-r-0 d-theme-border-grey-light border-t-0">
                  <h3>{{list.key | capitalize}}</h3>
                  <div class="ml-2">
                    <p
                      v-for="(value, vIndex) in list.values"
                      :key="'value'+vIndex"
                      class="mt-2 font-semibold"
                      style="font-weight:400;"
                    >{{value.key|capitalize}}</p>
                  </div>
                </td>
                <td
                  class="text-center border border-solid border-r-0 d-theme-border-grey-light border-t-0"
                >
                  <div class="ml-2 mt-base">
                    <p
                      v-for="(value, vIndex) in list.values"
                      :key="'value'+vIndex"
                      class="mt-2"
                      style="font-weight:400;"
                    >
                      <template v-if="value.type=='boolean'">
                        <vs-icon
                          v-if="value.value"
                          icon-pack="feather"
                          icon="icon-check"
                          color="success"
                          size="20px"
                        ></vs-icon>
                        <vs-icon
                          v-else
                          icon-pack="feather"
                          icon="icon-x"
                          color="danger"
                          size="20px"
                        ></vs-icon>
                      </template>
                      <template v-else>{{value.value|capitalize}}</template>
                    </p>
                  </div>
                </td>
                <td
                  class="text-center border border-solid border-r-0 d-theme-border-grey-light border-t-0"
                >
                  <!-- {{plans[1].list[index].values}} -->
                  <div class="ml-2 mt-base">
                    <p
                      v-for="(value, vIndex) in plans[1].list[index].values"
                      :key="'value'+vIndex"
                      class="mt-2"
                      style="font-weight:400;"
                    >
                      <template v-if="value.type=='boolean'">
                        <vs-icon
                          v-if="value.value"
                          icon-pack="feather"
                          icon="icon-check"
                          color="success"
                          size="20px"
                        ></vs-icon>
                        <vs-icon
                          v-else
                          icon-pack="feather"
                          icon="icon-x"
                          color="danger"
                          size="20px"
                        ></vs-icon>
                      </template>
                      <template v-else>{{value.value|capitalize}}</template>
                    </p>
                  </div>
                </td>
                <td class="text-center border border-solid d-theme-border-grey-light border-t-0">
                  <!-- {{plans[1].list[index].values}} -->
                  <div class="ml-2 mt-base">
                    <p
                      v-for="(value, vIndex) in plans[2].list[index].values"
                      :key="'value'+vIndex"
                      class="mt-2"
                      style="font-weight:400;"
                    >
                      <template v-if="value.type=='boolean'">
                        <vs-icon
                          v-if="value.value"
                          icon-pack="feather"
                          icon="icon-check"
                          color="success"
                          size="20px"
                        ></vs-icon>
                        <vs-icon
                          v-else
                          icon-pack="feather"
                          icon="icon-x"
                          color="danger"
                          size="20px"
                        ></vs-icon>
                      </template>
                      <template v-else>{{value.value|capitalize}}</template>
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th class="border-solid border-r-0 border-t-0 d-theme-border-grey-light border">
                  <h1>Choose Plan</h1>
                </th>
                <th class="py-2" style="background-color:#039be5;">
                  <div>
                    <h1 class="text-white">Free Plan</h1>
                    <h3 class="text-white">Free</h3>
                    <vs-button color="#9ecc38" class="mt-4" type="border">Start Now</vs-button>
                  </div>
                </th>
                <th class="bg-primary">
                  <div>
                    <h1 class="text-white">Standard Plan</h1>
                    <h3
                      class="text-white"
                      v-if="pMode == 'Monthly' && engament == 'Yes'"
                    >${{plans[1].price.my}}/month</h3>
                    <h3
                      class="text-white"
                      v-else-if="pMode == 'Monthly' && engament == 'No'"
                    >${{plans[1].price.mn}}/month</h3>
                    <h3
                      class="text-white"
                      v-else-if="pMode == 'Yearly'"
                    >${{plans[1].price.yearly}}/year</h3>
                    <vs-button
                      color="#9ecc38"
                      class="mt-4"
                      type="border"
                      @click="checkout('standard')"
                    >Select Plan</vs-button>
                  </div>
                </th>
                <th class="bg-dark">
                  <div>
                    <h1 class="text-white">Pro Plan</h1>
                    <h3
                      class="text-white"
                      v-if="pMode == 'Monthly' && engament == 'Yes'"
                    >${{plans[2].price.my}}/month</h3>
                    <h3
                      class="text-white"
                      v-else-if="pMode == 'Monthly' && engament == 'No'"
                    >${{plans[2].price.mn}}/month</h3>
                    <h3
                      class="text-white"
                      v-else-if="pMode == 'Yearly'"
                    >${{plans[2].price.yearly}}/year</h3>
                    <vs-button
                      color="#9ecc38"
                      class="mt-4"
                      @click="checkout('pro')"
                      type="border"
                    >Select Plan</vs-button>
                  </div>
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
        <div class="vx-row md:hidden match-height">
          <div class="vx-col w-full md:w-1/4" v-for="(plan,index) in plans" :key="index">
            <plan-card :plan="plan" :pMode="pMode" :engament="engament"></plan-card>
          </div>
        </div>
        <div class="vx-row pl-4">
          <vs-alert active="true" class="mt-5 mr-4" icon-pack="feather" icon="icon-star">
            If you need more things , please contact with
            <span
              @click="$intercom.show()"
              class="underline cursor-pointer"
            >Support</span>.
          </vs-alert>
        </div>
      </div>
    </vx-card>
    <vs-popup title="Success" background-color-popup="success" :active.sync="paySuccess">
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    </vs-popup>
    <vs-popup title="Canceled" :active.sync="cancel">
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    </vs-popup>
  </div>
</template>
<script>
import PlanCard from "./PlanCard.vue";
import VSelect from "vue-select";
import { StripeCheckout } from "vue-stripe-checkout";
import plan from "@/stripe/stripePlan";
export default {
  components: {
    PlanCard,
    VSelect,
    StripeCheckout,
  },
  data() {
    return {
      paySuccess: false,
      cancel: false,
      id: "",
      stripe: null,
      loading: false,
      engamentMode: ["Yes", "No"],
      engament: "Yes",
      payMode: ["Monthly", "Yearly"],
      pMode: "Monthly",
      plans: [
        {
          planName: "free",
          price: {
            my: 0,
            mn: 0,
            yearly: 0,
          },
          list: [
            {
              key: "template",
              values: [
                {
                  key: "template in use",
                  type: "number",
                  value: 3,
                },
                {
                  key: "personalised template creation",
                  type: "boolean",
                  value: false,
                },
              ],
            },
            {
              key: "report",
              values: [
                {
                  key: "PDF report per month",
                  type: "number",
                  value: 3,
                },
              ],
            },
            {
              key: "food items",
              values: [
                {
                  key: "number of food items",
                  type: "string",
                  value: "unlimited",
                },
              ],
            },
            {
              key: "notifications",
              values: [
                {
                  key: "Expiry dates",
                  type: "boolean",
                  value: false,
                },
                {
                  key: "Failed answers",
                  type: "boolean",
                  value: false,
                },
                {
                  key: "out of range temperatures",
                  type: "boolean",
                  value: false,
                },
                {
                  key: "Issues based on action fields",
                  type: "boolean",
                  value: false,
                },
                {
                  key: "email alerts",
                  type: "boolean",
                  value: false,
                },
                {
                  key: "SMS alerts",
                  type: "boolean",
                  value: false,
                },
              ],
            },
            {
              key: "collaboration",
              values: [
                {
                  key: "locations",
                  type: "number",
                  value: 1,
                },
                {
                  key: "group",
                  type: "number",
                  value: 1,
                },
                {
                  key: "users",
                  type: "number",
                  value: 3,
                },
                {
                  key: "custom user access",
                  type: "boolean",
                  value: false,
                },
                {
                  key: "multi-site visibility",
                  type: "boolean",
                  value: false,
                },
              ],
            },
            {
              key: "data",
              values: [
                {
                  key: "volume",
                  type: "string",
                  value: "10MB per month",
                },
                {
                  key: "data rentention",
                  type: "string",
                  value: "2 weeks",
                },
              ],
            },
          ],
        },
        {
          planName: "standard",
          price: {
            my: 49,
            mn: 59,
            yearly: 390,
          },
          list: [
            {
              key: "template",
              values: [
                {
                  key: "template in use",
                  type: "number",
                  value: 10,
                },
                {
                  key: "personalised template creation",
                  type: "boolean",
                  value: true,
                },
              ],
            },
            {
              key: "report",
              values: [
                {
                  key: "PDF report per month",
                  type: "number",
                  value: 10,
                },
              ],
            },
            {
              key: "food items",
              values: [
                {
                  key: "number of food items",
                  type: "string",
                  value: "unlimited",
                },
              ],
            },
            {
              key: "notifications",
              values: [
                {
                  key: "Expiry dates",
                  type: "boolean",
                  value: true,
                },
                {
                  key: "Failed answers",
                  type: "boolean",
                  value: true,
                },
                {
                  key: "out of range temperatures",
                  type: "boolean",
                  value: true,
                },
                {
                  key: "Issues based on action fields",
                  type: "boolean",
                  value: true,
                },
                {
                  key: "email alerts",
                  type: "boolean",
                  value: true,
                },
                {
                  key: "SMS alerts",
                  type: "boolean",
                  value: false,
                },
              ],
            },
            {
              key: "collaboration",
              values: [
                {
                  key: "locations",
                  type: "number",
                  value: 10,
                },
                {
                  key: "group",
                  type: "number",
                  value: 3,
                },
                {
                  key: "users",
                  type: "number",
                  value: 15,
                },
                {
                  key: "custom user access",
                  type: "boolean",
                  value: true,
                },
                {
                  key: "multi-site visibility",
                  type: "boolean",
                  value: true,
                },
              ],
            },
            {
              key: "data",
              values: [
                {
                  key: "volume",
                  type: "string",
                  value: "20MB per month",
                },
                {
                  key: "data rentention",
                  type: "string",
                  value: "1 year",
                },
              ],
            },
          ],
        },
        {
          planName: "pro",
          price: {
            my: 89,
            mn: 119,
            yearly: 790,
          },
          list: [
            {
              key: "template",
              values: [
                {
                  key: "template in use",
                  type: "number",
                  value: 30,
                },
                {
                  key: "personalised template creation",
                  type: "boolean",
                  value: true,
                },
              ],
            },
            {
              key: "report",
              values: [
                {
                  key: "PDF report per month",
                  type: "number",
                  value: 20,
                },
              ],
            },
            {
              key: "food items",
              values: [
                {
                  key: "number of food items",
                  type: "string",
                  value: "unlimited",
                },
              ],
            },
            {
              key: "notifications",
              values: [
                {
                  key: "Expiry dates",
                  type: "boolean",
                  value: true,
                },
                {
                  key: "Failed answers",
                  type: "boolean",
                  value: true,
                },
                {
                  key: "out of range temperatures",
                  type: "boolean",
                  value: true,
                },
                {
                  key: "Issues based on action fields",
                  type: "boolean",
                  value: true,
                },
                {
                  key: "email alerts",
                  type: "boolean",
                  value: true,
                },
                {
                  key: "SMS alerts",
                  type: "boolean",
                  value: true,
                },
              ],
            },
            {
              key: "collaboration",
              values: [
                {
                  key: "locations",
                  type: "number",
                  value: 50,
                },
                {
                  key: "group",
                  type: "string",
                  value: "unlimited",
                },
                {
                  key: "users",
                  type: "string",
                  value: "unlimited",
                },
                {
                  key: "custom user access",
                  type: "boolean",
                  value: true,
                },
                {
                  key: "multi-site visibility",
                  type: "boolean",
                  value: true,
                },
              ],
            },
            {
              key: "data",
              values: [
                {
                  key: "volume",
                  type: "string",
                  value: "unlimited",
                },
                {
                  key: "data rentention",
                  type: "string",
                  value: "3 years",
                },
              ],
            },
          ],
        },
      ],
    };
  },
  created() {
    this.id = this.$route.params.id;
    if (this.id == "plan") return false;
    if (this.id == "cancel") {
      this.cancel = true;
    } else {
      this.paySuccess = true;
    }
  },
  mounted() {
    this.stripe = Stripe(plan.test.key);
  },
  methods: {
    checkout(method) {
      this.$vs.loading();
      var planItem = "";
      if (
        method == "standard" &&
        this.pMode == "Monthly" &&
        this.engament == "Yes"
      )
        planItem = plan.test.S_M_Y;
      else if (
        method == "standard" &&
        this.pMode == "Monthly" &&
        this.engament == "No"
      )
        planItem = plan.test.S_M_N;
      else if (method == "standard" && this.pMode == "Yearly")
        planItem = plan.test.S_Y;
      else if (
        method == "pro" &&
        this.pMode == "Monthly" &&
        this.engament == "Yes"
      )
        planItem = plan.test.P_M_Y;
      else if (
        method == "pro" &&
        this.pMode == "Monthly" &&
        this.engament == "No"
      )
        planItem = plan.test.P_M_N;
      else planItem = plan.test.P_Y;

      this.$http
        .post(
          "https://us-central1-the-haccp-app-249610.cloudfunctions.net/api/plan",
          {
            mode: "test",
            plan: planItem,
          }
        )
        .then((res) => {
          this.$vs.loading.close();
          this.stripe
            .redirectToCheckout({
              sessionId: res.data.session.id,
            })
            .then((result) => {
              console.log(result.error.message);
              alert(result.error.message);
            })
            .catch((error) => {
              console.log(error);
            });
        });
    },
  },
};
</script>
<style scoped>
.card-img-top {
  height: 200px;
  object-fit: cover;
  object-position: center;
}
table {
  border-spacing: 0px;
}

table tbody td {
  padding: 10px;
}
.plan-option {
  top: 130px;
}
@media (max-width: 430px) {
  .plan-option {
    top: 70px;
  }
}
</style>