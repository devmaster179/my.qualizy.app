<template>
  <div class="vx-row items-grid-view match-height">
    <div class="vx-col md:w-7/12 w-full mt-4 block">
      <vx-card>
        <div class="card-header p-6" slot="no-body">
          <div class="flex justify-between items-center pb-3">
            <h4 class="font-semibold">{{ $t("Billing Details") }}</h4>
            <vs-button>{{ $t("Add billing details") }}</vs-button>
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
                    <div class="dollar-rate absolute left-0">Free</div>
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
                  <span class="tooltiptext"><span>287 logs</span></span>
                </div>
              </div>
            </div>
          </div>
          <p class="current-log-text pt-5 pb-5">
            {{
              $t(
                "You need to log another 156 logs to reach a cheaper pricing plan."
              )
            }}
            <vs-icon
              icon="error_outline"
              class="text-2xl"
              style="position: relative; top: 5px"
            ></vs-icon>
          </p>
          <p class="text-2xl mb-5 mt-1">
            Accrued amount to be paid this month:
            <bold class="font-semibold">$16.78</bold>
          </p>
        </div>
      </vx-card>

      <vx-card class="mt-6">
        <div class="" slot="no-body">
          <div class="p-6">
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
            <p class="current-log-text pb-5">
              {{ $t("This referral program resets every month. ") }}
            </p>
            <vs-button
              text-color="#2400d0"
              color="#dedbf0"
              class="p-3 sm:px-5"
              type="filled"
              >{{ $t("Invite another professional ") }}</vs-button
            >
          </div>
        </div>
      </vx-card>
    </div>
    <div class="vx-col md:w-5/12 w-full mt-4">
      <vx-card>
        <div class="sm:flex items-start">Hello</div>
      </vx-card>
    </div>
  </div>
</template>

<script>
import VxCard from "../../../components/vx-card/VxCard.vue";
export default {
  data() {
    return {
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
</style>