<template>
  <div class="vx-row items-grid-view match-height">
    <div class="vx-col md:w-7/12 w-full mt-4 block">
      <vx-card>
        <div class="card-header p-6" slot="no-body">
          <div class="flex justify-between items-center pb-3">
            <h4 class="font-semibold">{{ $t("Billing Details") }}</h4>
            <vs-button @click="billingDetailPopup = true">{{
              $t("Add billing details")
            }}</vs-button>
          </div>
          <vs-alert
            :active="true"
            color="#8E4D00"
            icon="warning"
            class="ek-header-alert"
          >
            <span>
              {{
                $t(
                  "You reached the limit of free logs. Provide billing details to continue using the system."
                )
              }}
            </span>
          </vs-alert>
        </div>

        <div class="">
          <p class="current-log-text pb-5">
            {{ $t("Current logs usage per month") }}
          </p>
          <div>
            <div class="logs-track-bar mt-20 mb-10">
              <div class="main-bar">
                <div class="hight-bars">
                  <div>
                    <div class="log-count absolute left-0">0</div>
                    <div class="hight-bar invisible"></div>
                    <div class="dollar-rate absolute left-0">
                      {{ $t("Free") }}
                    </div>
                  </div>
                  <div
                    v-for="item in logTrackInfos"
                    :key="item.dolars"
                    :style="'margin-left:' + item.width + '%'"
                  >
                    <div class="log-count absolute">{{ item.logs }}</div>
                    <div class="hight-bar"></div>
                    <div class="dollar-rate absolute">
                      {{ "$" + item.dolars }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="scroll-bar">
                <div class="hight-bar">
                  <span class="tooltiptext"
                    ><span> 287 {{ $t("logs") }}</span></span
                  >
                </div>
              </div>
            </div>
          </div>
          <p class="current-log-text pt-5 pb-5">
            {{
              $t("You need to log another") +
              156 +
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
          <p class="text-2xl mb-5 mt-1">
            {{ $t("Accrued amount to be paid this month:") }}
            <span class="font-semibold">$16.78</span>
          </p>
        </div>
      </vx-card>

      <vx-card class="mt-6">
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
              <vs-th sort-key="email"> Email </vs-th>
              <vs-th sort-key="username"> Name </vs-th>
              <vs-th sort-key="id"> Nro </vs-th>
            </template>

            <template slot-scope="{ data }">
              <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                <vs-td :data="data[indextr].email">
                  {{ data[indextr].email }}
                </vs-td>

                <vs-td :data="data[indextr].username">
                  {{ data[indextr].username }}
                </vs-td>

                <vs-td :data="data[indextr].id">
                  {{ data[indextr].id }}
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
              class="w-2/3 h-full"
              :src="require(`@/assets/images/pages/company/no-billings.svg`)"
              alt="no-billings"
            />
          </div>
        </div>
      </vx-card>
    </div>

    <div class="vx-col md:w-12/12 w-full mt-4 mb-20 block">
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
                  <vs-slider v-model="employees" />
                  <div class="hight-bar"></div>
                  <div class="marks flex justify-between">
                    <div>0</div>
                    <div style="position: relative; left: 5px">500</div>
                    <div>100</div>
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
export default {
  components: {
    BillingDetailPopup,
  },
  data() {
    return {
      billingDetailPopup: false,
      dollarPerHour: 30,
      employees: 34,
      units: 60,
      logTrackInfos: [
        {
          width: 7,
          logs: 312,
          dolars: 0.0027,
        },
        {
          width: 9,
          logs: 780,
          dolars: 0.0024,
        },
        {
          width: 9,
          logs: 1300,
          dolars: 0.0023,
        },
        {
          width: 10,
          logs: 2080,
          dolars: 0.0022,
        },
        {
          width: 12,
          logs: 3120,
          dolars: 0.0019,
        },
        {
          width: 15,
          logs: "26k",
          dolars: 0.0016,
        },
        {
          width: 32,
          logs: "260k",
          dolars: 0.0014,
        },
      ],
      billings: [
        {
          id: 1,
          name: "Leanne Graham",
          username: "Bret",
          email: "Sincere@april.biz",
          website: "hildegard.org",
        },
        {
          id: 2,
          name: "Ervin Howell",
          username: "Antonette",
          email: "Shanna@melissa.tv",
          website: "anastasia.net",
        },
        {
          id: 3,
          name: "Clementine Bauch",
          username: "Samantha",
          email: "Nathan@yesenia.net",
          website: "ramiro.info",
        },
        {
          id: 4,
          name: "Patricia Lebsack",
          username: "Karianne",
          email: "Julianne.OConner@kory.org",
          website: "kale.biz",
        },
        {
          id: 5,
          name: "Chelsey Dietrich",
          username: "Kamren",
          email: "Lucio_Hettinger@annie.ca",
          website: "demarco.info",
        },
        {
          id: 6,
          name: "Mrs. Dennis Schulist",
          username: "Leopoldo_Corkery",
          email: "Karley_Dach@jasper.info",
          website: "ola.org",
        },
        {
          id: 7,
          name: "Kurtis Weissnat",
          username: "Elwyn.Skiles",
          email: "Telly.Hoeger@billy.biz",
          website: "elvis.io",
        },
        {
          id: 8,
          name: "Nicholas Runolfsdottir V",
          username: "Maxime_Nienow",
          email: "Sherwood@rosamond.me",
          website: "jacynthe.com",
        },
        {
          id: 9,
          name: "Glenna Reichert",
          username: "Delphine",
          email: "Chaim_McDermott@dana.io",
          website: "conrad.com",
        },
        {
          id: 10,
          name: "Clementina DuBuque",
          username: "Moriah.Stanton",
          email: "Rey.Padberg@karina.biz",
          website: "ambrose.net",
        },
        {
          id: 10,
          name: "Clementina DuBuque",
          username: "Moriah.Stanton",
          email: "Rey.Padberg@karina.biz",
          website: "ambrose.net",
        },
        {
          id: 10,
          name: "Clementina DuBuque",
          username: "Moriah.Stanton",
          email: "Rey.Padberg@karina.biz",
          website: "ambrose.net",
        },
      ],
    };
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
    width: 39px;
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
</style>