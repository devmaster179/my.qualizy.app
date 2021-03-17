<template>
  <div id="report-view" class="px-1">
   
    <div class="flex items-center justify-between mb-3">
      <div class="page-title flex items-center" style="max-width: 70%;">
        <p
          class="karla-bold main-title cursor-pointer"
          @click="$router.push('/report')"
        >{{$t("reports") | capitalize}}</p>
        <p class="karla-bold hidden sm:block ml-2 truncate">&nbsp;> {{reportTitle |capitalize}}</p>
      </div>
      <div class="flex items-center page-action">
        <vs-dropdown vs-custom-content vs-trigger-click>
          <feather-icon
            class="p-2 shadow-drop mr-2 w-10 rounded-lg d-theme-dark-bg cursor-pointer"
            icon="MoreVerticalIcon"
          />
          <vs-dropdown-menu style="min-width:270px;">
            <vs-dropdown-item @click="activeSchedule = true" class="mr-12 mb-2 mt-2" v-if="auth">
              <vs-icon color="black" icon="icon-calendar" icon-pack="feather" size="16px" />
              <span class="ml-3 font-semibold text-black" style="font-size:12px;">{{$t("scheduled email delivery")}}</span>
            </vs-dropdown-item>

            <vs-dropdown-item @click="activeExport = true" class="mr-12 mb-2 mt-2">
              <vs-icon color="black" icon="icon-download" icon-pack="feather" size="16px" />
              <span class="ml-3 font-semibold text-black" style="font-size:12px;">{{$t("export")}}</span>
            </vs-dropdown-item>

            <vs-dropdown-item
              @click="activeShare = true"
              class="mr-6 mb-2"
              v-if="this.visible == 'Public'"
            >
              <vs-icon color="black" icon="icon-share-2" icon-pack="feather" size="16px" />
              <span class="ml-3 font-semibold text-black" style="font-size:12px;">{{$t("share")}}</span>
            </vs-dropdown-item>
            <vs-dropdown-item v-if="role<2" @click="deleteReport()" class="mr-6 mb-2">
              <vs-icon color="black" icon="icon-trash-2" icon-pack="feather" size="16px" />
              <span class="ml-3 font-semibold text-black" style="font-size:12px;">{{$t("delete")}}</span>
            </vs-dropdown-item>
          </vs-dropdown-menu>
        </vs-dropdown>
        <feather-icon
          v-if="role<3"
          @click="reportFilterSidebar = true"
          class="p-2 shadow-drop mr-2 w-10 rounded-lg d-theme-dark-bg cursor-pointer text-primary"
          icon="FilterIcon"
        />
        <vs-button
          :disabled="filter.template === undefined || filter.template.length == 0  || !auth('report' , 'edit')"
          @click="activeSave = true"
          color="primary"
          icon="icon-file-text"
          icon-pack="feather"
          type="filled"
        >{{ $t("save_report") | capitalize }}</vs-button>
      </div>
    </div>

    <div class="vx-row">
      <vx-card :title="reportTitle">
        <div class="vx-row w-full" v-if="filteredLogs.length > 0">
          <div class="px-2 vx-col md:w-1/5 sm:w-1/2 w-full">
            <div class="rounded-lg border border-solid d-theme-border-grey-light p-4">
              <div class="text-center">
                <feather-icon
                  class="text-primary p-3 inline-flex rounded-full"
                  icon="EyeIcon"
                  style="background: rgba(var(--vs-primary),.15);"
                ></feather-icon>
              </div>
              <h2 class="text-center mt-4 mb-2 font-bold">{{ reportInfo.score }}</h2>
              <p class="text-center">{{$t("general score")}}</p>
            </div>
          </div>
          <div class="px-2 vx-col md:w-1/5 sm:w-1/2 w-full mt-1 sm:mt-0">
            <div class="rounded-lg border border-solid d-theme-border-grey-light p-4">
              <div class="text-center">
                <feather-icon
                  class="p-3 inline-flex rounded-full"
                  icon="ClipboardIcon"
                  style="background: #3980f626; color: #3980F6;"
                ></feather-icon>
              </div>
              <h2 class="text-center mt-4 mb-2 font-bold">{{ reportInfo.tasks }}</h2>
              <p class="text-center">{{$t("tasks")}}</p>
            </div>
          </div>
          <div class="px-2 vx-col md:w-1/5 sm:w-1/2 w-full md:mt-0 mt-1">
            <div class="rounded-lg border border-solid d-theme-border-grey-light p-4">
              <div class="text-center">
                <feather-icon
                    class="text-danger p-3 inline-flex rounded-full"
                    icon="SlashIcon"
                    style="background: rgba(var(--vs-warning),.15)"
                ></feather-icon>
              </div>
              <h2 class="text-center mb-2 mt-4 font-bold">{{ nonCompliantTasksAmount }}</h2>
              <p class="text-center">{{$t("non compliant")}}</p>
            </div>
          </div>
          <div class="px-2 vx-col md:w-1/5 sm:w-1/2 w-full md:mt-0 mt-1">
            <div class="rounded-lg border border-solid d-theme-border-grey-light p-4">
              <div class="text-center">
                <feather-icon
                  class="text-warning p-3 inline-flex rounded-full"
                  icon="ListIcon"
                  style="background: rgba(var(--vs-warning),.15)"
                ></feather-icon>
              </div>
              <h2 class="text-center mb-2 mt-4 font-bold">{{ filteredLogs.length }}</h2>
              <p class="text-center">{{$t("check list")}}</p>
            </div>
          </div>
          <div class="px-2 vx-col md:w-1/5 sm:w-1/2 w-full md:mt-0 mt-1">
            <div class="rounded-lg border border-solid d-theme-border-grey-light p-4">
              <div class="text-center">
                <feather-icon
                  class="text-success p-3 inline-flex rounded-full"
                  icon="CalendarIcon"
                  style="background: rgba(var(--vs-success),.15)"
                ></feather-icon>
              </div>
              <h2 class="text-center mb-2 mt-4 font-bold">{{ reportInfo.ontime }}</h2>
              <p class="text-center">{{$t("completed on time")}}</p>
            </div>
          </div>
        </div>
        <div id="reports" class="vx-row w-full" v-if="filteredLogs.length > 0" style="margin-top: 40px;">
          <b-table
                  :data="filteredRowLogs.length ? filteredRowLogs : filteredLogs"
                  detailed
                  :show-detail-icon="false"
                  class="w-full"
                  icon-pack="fa"
                  sort-icon="chevron-down"
                  default-sort-direction="asc"
          >

            <b-table-column :label="$t('check list')" v-slot="props">
              {{ logInfo(props.row).templateTitle }}
            </b-table-column>

            <b-table-column :label="$t('non compliant')">
              <template v-slot:header="{ column }">
                <span @click="filterRows(0)" :style="{color: nonCompliantColor}" class="cursor-pointer">{{ column.label }}</span>
              </template>
              <template v-slot="props">
                {{ logInfo(props.row).failed }}
              </template>
            </b-table-column>

            <b-table-column :label="$t('compliance')">
              <template v-slot:header="{ column }">
                <span @click="filterRows(1)" :style="{color: compliantColor}" class="cursor-pointer">{{ column.label }}</span>
              </template>
              <template v-slot="props">
                {{ logInfo(props.row).compliance }}
              </template>
            </b-table-column>

            <b-table-column v-slot="props" width="10">
                <b-icon
                        class="cursor-pointer"
                        pack="fa"
                        :icon="props.open ? 'sort-up' : 'sort-down'"
                        @click.native="props.toggleDetails(props.row);"
                ></b-icon>
            </b-table-column>

            <template #detail="props">
              <article class="media">
                <div class="media-content">
                  <div class="content">
                    <b-table
                        :data="[props.row]"
                        detailed
                        :show-detail-icon="false"
                        class="w-full"
                        icon-pack="fa"
                        sort-icon="chevron-down"
                        default-sort-direction="asc"
                    >

                      <b-table-column :visible="logInfo(props.row).show" :label="$t('date_used')" v-slot="props">
                        {{ logInfo(props.row).dateUsed }}
                      </b-table-column>

                      <b-table-column :visible="logInfo(props.row).show" :label="$t('locations')" v-slot="props">
                        {{ props.row.locations ? props.row.locations.join(', ') : '' }}
                      </b-table-column>

                      <b-table-column :visible="logInfo(props.row).show" :label="$t('teams')" v-slot="props">
                        {{ props.row.teams ? props.row.teams.join(', ') : '' }}
                      </b-table-column>

                      <b-table-column :visible="logInfo(props.row).show" :label="$t('tasks')" v-slot="props">
                        {{ logInfo(props.row).tasks }}
                      </b-table-column>

                      <b-table-column :visible="logInfo(props.row).show" v-slot="props" width="10">
                        <b-icon
                            class="cursor-pointer"
                            pack="fa"
                            :icon="props.open ? 'sort-up' : 'sort-down'"
                            @click.native="props.toggleDetails(props.row);"
                        ></b-icon>
                      </b-table-column>

                      <template #detail="props">
                        <article class="media">
                          <div class="media-content">
                            <div class="content">
                              <vx-card class="mb-base">
                                <log-item :log="props.row" :order="props.index" />
                              </vx-card>
                            </div>
                          </div>
                        </article>
                      </template>
                    </b-table>
                  </div>
                </div>
              </article>
            </template>
          </b-table>

        </div>

        <div class="flex w-full mt-base" v-else>
          <div
            class="vx-col flex items-center flex-col sm:w-1/2 md:w-3/5 lg:w-3/4 xl:w-1/2 mx-auto text-center sm:mt-base mt-0"
            style="min-height:500px;"
          >
            <img
              :src="require('../../assets/images/pages/report/empty-doc.svg')"
              @click="reportFilterSidebar = true"
              class="mx-auto mb-4 cursor-pointer"
            />
            <h3
              class="mt-base text-grey"
            >{{$t("select the options from right side bar to generate the report.")}}</h3>
          </div>
        </div>
      </vx-card>

    </div>
    <div class="w-full" id="reprot-print">
      <vx-card id="invoice-container">
        <!-- REPROT METADATA -->
        <div class="p-base flex items-center justify-between">
          <div class="flex items-center">
            <img alt="vuexy-logo" src="@/assets/images/logo/logo.png" style="width:100px;" />
            <h1 class="ml-base text-primary">Qualizy</h1>
          </div>
          <div class="text-right">
            <h1>REPORT</h1>
            <div class="invoice__invoice-detail mt-6">
              <h6 class="mt-4">REPORT DATE</h6>
              <p>{{ new Date() | date(true) }}</p>
            </div>
          </div>
        </div>
        <!-- REPROT CONTENT -->
        <div :key="'print' + log.id" class="items-list-view" v-for="log in filteredLogs">
          <print-item :item="log" />
        </div>
      </vx-card>
    </div>
    <report-filter
      :filter="filter"
      :isSidebarActive="reportFilterSidebar"
      @chnFilter="chnFilter"
      @closeSidebar="reportFilterSidebar = false"
      v-if="filter !== ''"
    />
    <vs-prompt
      :accept-text="$t('update') | capitalize"
      :active.sync="activeSave"
      :cancel-text="$t('cancel') | capitalize"
      :is-valid="reportTitle != ''"
      :title="$t('Update Report')"
      @accept="saveReport"
      v-if="visible != ''"
    >
      <div class="vx-row">
        <div class="vx-coll w-full mb-4">
          <label class="font-semibold">Report Title</label>
          <vs-input class="w-full" placeholder="Report Title" v-model="reportTitle" />
        </div>
        <div class="vx-coll w-full mb-4">
          <label class="font-semibold">Description</label>
          <vs-textarea v-model="description" />
        </div>
        <div class="vx-coll w-full">
          <label class="font-semibold">{{$t("visible to")}}</label>
          <div class="flex items-center mt-2">
            <!-- ['Just me' , 'Public'] -->
            <div v-for="(visibleItem,vIndex) in visibles" :key="vIndex">
              <div class="flex items-center ml-4" v-if="visibleItem.key==visible">
                <vs-icon icon="radio_button_checked" size="25px" color="primary" />
                <span class="karla text-primary">{{visibleItem.text}}</span>
              </div>
              <div
                class="flex items-center cursor-pointer ml-4"
                v-else
                @click="visible=visibleItem.key"
              >
                <vs-icon icon="radio_button_unchecked" size="25px" />
                <span class="karla">{{visibleItem.text}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="vx-col w-full mt-4" v-if="visible=='Teams'">
          <label class="font-semibold">{{$t('teams')}}</label>
          <v-select :options="teams" label="name" multiple v-model="team" />
        </div>
        <div class="vx-col w-full mt-4">
          <label class="font-semibold">{{$t('tags')}}</label>
          <v-select :options="tags" label="name" multiple v-model="tag">
            <template slot="option" slot-scope="option">
              <div class="flex items-center">
                <div class="h-2 w-2 rounded-full mr-3" :style="`background:${option.color}`"></div>
                <span class="karla">{{option.name}}</span>
              </div>
            </template>
            <template slot="selected-option" slot-scope="option">
              <div class="flex items-center">
                <div class="h-2 w-2 rounded-full mr-1" :style="`background:${option.color}`"></div>
                <span class="karla">{{option.name}}</span>
              </div>
            </template>
          </v-select>
        </div>
      </div>
    </vs-prompt>

    <vs-prompt
      :accept-text="$t('share') | capitalize"
      :active.sync="activeShare"
      :cancel-text="$t('cancel') | capitalize"
      :is-valid="reportTitle != ''"
      :title="$t('Share Report')"
      @accept="shareReort"
      v-if="visible != ''"
    >
      <div class="vx-row px-4">
        <div class="vx-coll w-full mt-4">
          <vx-input-group class="mb-base">
            <vs-input v-model="shareUrl" />
            <template slot="append">
              <div class="append-text btn-addon">
                <vs-button @click="copyText(shareUrl)" color="primary">Copy Url</vs-button>
              </div>
            </template>
          </vx-input-group>
          <div class="vx-coll w-full mt-4">
            <h5 class="mb-4">Share with</h5>
            <social-sharing
              :url="shareUrl"
              description="Qualizy Report"
              hashtags="qualizy,report"
              inline-template
              quote="Qualizy Report"
              title="Qualizy Report"
              twitter-user="qualizy"
            >
              <div class="flex">
                <network class="flex-col text-center cursor-pointer" network="facebook">
                  <img :src="require('../../assets/images/social/facebook.svg')" class="block" />
                  <p class="mt-2">Facebook</p>
                </network>
                <network class="flex-col text-center ml-3 cursor-pointer" network="twitter">
                  <img :src="require('../../assets/images/social/twitter.svg')" class="block" />
                  <p class="mt-2">Twitter</p>
                </network>
                <network class="flex-col text-center ml-3 cursor-pointer" network="linkedin">
                  <img :src="require('../../assets/images/social/linkedin.svg')" class="block" />
                  <p class="mt-2">Linkedin</p>
                </network>
              </div>
            </social-sharing>
          </div>
          <div class="vx-coll w-full mt-base">
            <h5 class="mb-4">Share with Badge</h5>
            <vs-textarea v-model="badge" />
            <div class="text-right mt-2">
              <vs-button @click="copyText(badge)">Copy Badge</vs-button>
            </div>
          </div>
        </div>
      </div>
    </vs-prompt>
    <vs-prompt
      :accept-text="$t('export') | capitalize"
      :active.sync="activeExport"
      :cancel-text="$t('cancel') | capitalize"
      :is-valid="selectedFormat != '' && selectedFormat !== null"
      :title="$t('print') | capitalize"
      @accept="exportFunction"
      class="export-options"
    >
      <vs-input class="w-full" placeholder="Enter File Name.." v-model="fileName" />
      <v-select :options="formats" class="my-4" v-model="selectedFormat" />
      <div class="flex">
        <span class="mr-4">{{$t("cell auto width")}}:</span>
        <vs-switch :disabled="selectedFormat == 'pdf'" v-model="cellAutoWidth"></vs-switch>
      </div>
    </vs-prompt>
    <vs-prompt
      class="report-schedule"
      :accept-text="existSchedule ? $t('update'): $t('save') "
      :active.sync="activeSchedule"
      :cancel-text="$t('cancel') | capitalize"
      :is-valid="rTeam.length>0"
      :title="$t('report schedule delivery settings')"
      @accept="scheduleReport"
    >
      <div class="vx-row">
        <div class="vx-col w-full mb-6">
          <h4 class="font-weight-bold">{{ $t('delivery_schedule') }}</h4>
          <p class="text-muted">{{ $t('create_schedule') }}</p>
        </div>
        <div class="vx-col w-full mb-6">
          <label> {{$t('start date')}} </label>
          <datepicker
            placeholder="Available from"
            v-model="sDate"
            :language="languages[$i18n.locale]"
            class="hasDatepickerIcon"
          ></datepicker>
        </div>
        <div class="vx-col w-full mb-6">
          <label>{{$t('repeat evey')}}</label>
          <v-select :clearable="false" :options="['day' , 'week' , 'month' , 'year']" v-model="sRepeat">
            <template #option="{label}">
              <span class="">{{$t(label)}}</span>
            </template>
             <template #selected-option="{ label }">
              <span class="">{{$t(label)}}</span>
             </template>
          </v-select>
        </div>
        <div class="vx-col w-full">
          <div class="flex items-center">
            <label>{{$t('teams')}}</label>
          </div>
          <v-select :options="teams" label="name" multiple v-model="rTeam" class="w-full">
          </v-select> 
          <div class="vx-col v-full mt-6 " v-if="existSchedule">
            <div class="flex items-center cursor-pointer text-primary hover:text-danger" @click="deleteRD">
              <vs-icon icon-pack="feather" size="20px" icon="icon-trash-2" class="mr-2"/>
              <p class="">{{$t('delete shceduled email delivery')}}</p>
            </div>
          </div>
        </div>
      </div>
    </vs-prompt>
  </div>
</template>

<script>
import Vue from 'vue';
import SocialSharing from "vue-social-sharing";
import ReportFilter from "./ReportFilter.vue";
import LogItem from "./LogItem.vue";
import PrintItem from "./PrintItem.vue";

import VSelect from "vue-select";
import { db } from "@/firebase/firebaseConfig.js";
import XLSX from "xlsx";

import Datepicker from "vuejs-datepicker";
import * as lang from "vuejs-datepicker/src/locale";

import { Table, Tag, Tabs, Button, Collapse, Icon } from 'buefy';
Vue.use(Table);
Vue.use(Tag);
Vue.use(Tabs);
Vue.use(Button);
Vue.use(Collapse);
Vue.use(Icon);

export default {
  components: {
    PrintItem,
    ReportFilter,
    LogItem,
    VSelect,
    SocialSharing,
    Datepicker
  },
  data() {
    return {
      rTeam: [],
      sRepeat: 'day',
      sDate: new Date(),
      languages: lang,
      activeSchedule: false,
      selectedFormat: "pdf",
      formats: ["xlsx", "csv", "pdf"],
      cellAutoWidth: true,
      fileName: "",
      activeExport: false,
      shareUrl: "",
      activeShare: false,
      visible: "",
      description: "",
      reportTitle: "",
      activeSave: false,
      filter: "",
      wasSidebarOpen: null,
      reportFilterSidebar: false,
      report: "",
      badge: "",
      team: [],
      tag: [],
      filteredRowLogs: [],
      nonCompliantColor: '#363636',
      compliantColor: '#363636',
    };
  },
  watch: {
    activeSchedule(val) {
      if(val && this.existSchedule) {
        let schedule = this.existSchedule
        this.sDate = schedule.start.toDate()
        this.sRepeat = schedule.__repeat
        this.rTeam = []
        schedule.team.map(id=> {
          this.rTeam.push(this.$store.getters['app/getTeamById'](id))
        })
      }
      else if(val && !this.existSchedule) {
        this.sDate = new Date()
        this.sRepeat = 'day'
        this.rTeam = []
      }
    }
  },
  mounted() {
    // this.wasSidebarOpen = this.$store.state.reduceButton;
    // this.$store.commit("TOGGLE_REDUCE_BUTTON", true);
  },
  beforeDestroy() {
    // if (!this.wasSidebarOpen) this.$store.commit("TOGGLE_REDUCE_BUTTON", false);
  },
  computed: {
    auth() {
      return (sub,action) => {
        let authList = this.$store.getters['app/auth']
        var cUser = this.$store.getters["app/currentUser"];
        if(cUser == undefined || cUser.role == undefined) return false
        else if(cUser.role.key == 0) 
          return true
        else if(authList[sub][cUser.role.name.toLowerCase()][action])
          return true
        else 
          return false
      }
    },
    existSchedule() {
      return this.$store.getters['app/getReportScheduleByID'](this.$route.params.id)
    },
    tags() {
      const locale = this.$i18n.locale || "en-gb";
      let labels = this.$store.getters["app/labels"].filter((item) => {
        if (item.group != "global") {
          const userInfo = JSON.parse(localStorage.getItem("userInfo"));
          if (userInfo.group != item.group) {
            return false; 
          }
        }
        if (!item.lang) {
          if (locale != "en-gb") return false;
        } else {
          if (item.lang != locale) return false;
        }
        return true;
      });

      return labels;
    },
    teams() {
      let locationList = this.$store.getters['app/locationList']
      return this.$store.getters["app/teams"].filter((item) => {
        if(locationList.length>0) {
          if(locationList.indexOf(item.id)< 0 ) return false
        }
        return item.active
      });
    },
    role() {
      var cUser = this.$store.getters["app/currentUser"];
      if (cUser == undefined || cUser.role === undefined) {
        return 4;
      }
      return cUser.role.key;
    },
    logInfo() {
      return (log) => {
        let locations = this.$store.getters['app/locationList'];
        let teams = this.filter.team;
        let template = this.getTemplateInfo(log.templateID);
        let templateTitle = template.content.templateTitle;
        let total = 0;
        let completed = 0;
        let failed = 0;
        let done;
        let locs = [];
        let tms = [];
        let show = true;

        !log.locations && (log.locations = []);
        !log.teams && (log.teams = []);

        log.logs.map((page) => {
          page.questions.map((question) => {
            question.answers.map((answer) => {
              if (
                this.getTemplateType(answer.ref.type.id).content !=
                "instruction"
              ) {
                if (answer.ref.mandatory) {
                  total++;
                  if (answer.loged) completed++;
                }
                if (
                    answer.ref.type.failedAnswer &&
                    answer.ref.type.failedAnswer == answer.value
                )
                  failed++;
              }
            });
          });
        });
        if (total > 0) {
          status = total == completed ? "Completed" : "Incompleted";
          done = Math.round((completed * 1000) / total) / 10 + "%";
        } else {
          status = "---";
          done = "---";
        }
        let obj = {
          templateTitle: templateTitle,
          tasks: `${completed}/${total}`,
          compliance: `${((total - failed) / total * 100).toFixed(2)}%`,
          status: status,
          done: done,
          failed: failed,
          dateUsed: log.updated_at ? new Date(log.updated_at.toDate()).toLocaleString() : '',
          locations: locs,
          teams: tms,
          show: show
        };

        if(locations.length) {
          template.content.location.forEach(loc => {
            if(locations.includes(loc)) {
              locs.push(this.$store.getters["app/getLocationById"](loc).name);
            }
          })
          !locs.length && (show = false);
        } else {
          template.content.location.forEach(loc => {
            db.collection("locations")
                .doc(loc)
                .get()
                .then(snapshot => {
                  locs.push(snapshot.data().name);
                  !log.locations.includes(snapshot.data().name) && log.locations.push(snapshot.data().name);
                })
          });
        }
        if(teams && teams.length) {
          template.content.teams.forEach(team => {
            if(teams.includes(team)) {
              tms.push(this.$store.getters["app/getTeamById"](team).name);
            }
          })
          !tms.length && (show = false);
        } else {
          template.content.teams.forEach(team => {
            db.collection("teams")
                .doc(team)
                .get()
                .then(snapshot => {
                  tms.push(snapshot.data().name);
                  !log.teams.includes(snapshot.data().name) && log.teams.push(snapshot.data().name);
                });
          })

        }
        return obj;
      };
    },
    visibles() {
      return [
        { text: this.$t("Just me"), key: "Just me" },
        { key: "Public", text: this.$t("public") },
        { key: "Teams", text: this.$t("teams") },
      ];
    },

    reportInfo() {
      let logs = this.filteredLogs;
      var scores = 0;
      var score = 0;
      var tasks = 0;
      var complted = 0;
      var ontime = 0;
      var scheduled = 0;
      var defaultScore = 0
      var ontimeTask = true;
      var checkOnTimeTask = 0;
      logs.map((log) => {
        ontime = 0;
        ontimeTask = true;

        if (log.key === undefined || log.key != "pinned") {
          if (log.time !== undefined) {
            scheduled++;
            ontime = log.time.toDate().getTime();
          }
        }
        log.logs.map((page) => {
          page.questions.map((question) => {
            question.answers.map((answer) => {
              score = 0;
              if (
                this.getTemplateType(answer.ref.type.id).content !=
                "instruction"
              ) {
                if (answer.ref.mandatory) {
                  tasks++;
                  if (answer.loged) complted++;
                }
              }
              if (ontime != 0 && answer.ref.mandatory) {
                ontimeTask =
                  ontimeTask &&
                  answer.loged &&
                  answer.time.toDate().getTime() <= ontime;
              }
              if (answer.loged) {
                if (
                  this.getTemplateType(answer.ref.type.id).content ==
                  "temperature"
                ) {
                  if (
                    answer.ref.score === undefined ||
                    !Array.isArray(answer.ref.score)
                  ) {
                    score = 10;
                  } else {
                    var checkedScore = false;
                    answer.ref.score.map((scoreItem, sindex) => {
                      if (checkedScore) return;
                      if (sindex == 0) defaultScore = scoreItem.score;
                      else {
                        if (scoreItem.condition == "equal") {
                          if (scoreItem.value0 == answer.value) {
                            checkedScore = true;
                            score = scoreItem.score;
                          } else score = defaultScore;
                        } else if (scoreItem.condition == "Nequal") {
                          if (scoreItem.value0 != answer.value) {
                            checkedScore = true;
                            score = scoreItem.score;
                          } else score = defaultScore;
                        } else if (scoreItem.condition == "less") {
                          if (scoreItem.value0 > answer.value) {
                            {
                              checkedScore = true;
                              score = scoreItem.score;
                            }
                          } else score = defaultScore;
                        } else if (scoreItem.condition == "Eless") {
                          if (scoreItem.value0 >= answer.value) {
                            checkedScore = true;
                            score = scoreItem.score;
                          } else score = defaultScore;
                        } else if (scoreItem.condition == "than") {
                          if (scoreItem.value0 < answer.value) {
                            checkedScore = true;
                            score = scoreItem.score;
                          } else score = defaultScore;
                        } else if (scoreItem.condition == "Ethan") {
                          if (scoreItem.value0 <= answer.value) {
                            checkedScore = true;
                            score = scoreItem.score;
                          } else score = defaultScore;
                        } else if (scoreItem.condition == "between") {
                          if (
                            scoreItem.value0 <= answer.value &&
                            scoreItem.value1 >= answer.value
                          ) {
                            checkedScore = true;
                            score = scoreItem.score;
                          } else score = defaultScore;
                        }
                      }
                    });
                  }

                  scores += Math.round(score * 10) / 10;

                } else if (
                  this.getTemplateType(answer.ref.type.id).type ==
                  "closed answers"
                ) {
                  if (
                    answer.ref.score === undefined ||
                    !Array.isArray(answer.ref.score) ||
                    answer.ref.score.length == 0
                  ) {
                    score = 10;
                  } else {
                    score = answer.ref.score.find(
                      (scoreItem) => scoreItem.key == answer.value
                    ).score;
                  }
                  scores += Math.round(score * 10) / 10;
                }
              }
            });
          });
        });
        if (ontime != 0 && ontimeTask) checkOnTimeTask++;
      });
      return {
        score: scores,
        tasks: `${complted}/${tasks}`,
        ontime: `${checkOnTimeTask}/${scheduled}`,
      };
    },
    getTemplateType() {
      return (id) => {
        var type = this.$store.getters["app/getTemplateTypeById"](id);
        return type;
      };
    },
    filteredLogs() {
      var filters = this.filter;
      var log = [];
      var cUser = this.$store.getters["app/currentUser"]
      var userTeam = cUser.team || []
      var locationList = this.$store.getters['app/locationList']
      if(locationList.length==0) {
        if(cUser.role == undefined || cUser.role.key == undefined || cUser.role.key>0) {
          if(cUser.location !== undefined && Array.isArray(cUser.location) && cUser.location.length>0) {
            locationList = cUser.location
          } else {
            locationList = ['no']
          }
        }
      }
      var logs = this.$store.getters["app/logs"];
      var checkLog = []
      logs = logs.filter((log) => {
        var template = this.$store.getters["app/getTemplateById"](
          log.templateID
        );
        if(!template) return false

        if(log.time && log.time.seconds) {
          if(checkLog.find(check=> check.templateID == log.templateID && check.time == log.time.seconds))
            return false
          checkLog.push({templateID: log.templateID , time: log.time.seconds})
        }

        var filterFrom = true;
        var filterTo = true;
        var userFlag = true;
        var teamFlag = true;
        var filterLabel = true;
        var filterStatus = true;
        var filterLocation = true
        if (filters.from !== undefined && filters.from != "")
          filterFrom =
            log.updated_at.toDate().getTime() >= filters.from.getTime();
        if (filters.to !== undefined && filters.to != "")
          filterTo = log.updated_at.toDate().getTime() <= filters.to.getTime();

        if (filters.user !== undefined && filters.user.length > 0) {
          userFlag = false;
          log.logs.map((__log) => {
            if (userFlag) return;
            __log.questions.map((question) => {
              if (userFlag) return;
              question.answers.map((answer) => {
                if (userFlag) return;
                if (!answer.loged) return;
                if (filters.user.indexOf(answer.user) > -1) userFlag = true;
              });
            });
          });
        }

        if (filters.team !== undefined && filters.team.length > 0) {
          teamFlag = false;
          log.logs.map((__log) => {
            if (teamFlag) return;
            __log.questions.map((question) => {
              if (teamFlag) return;
              question.answers.map((answer) => {
                if (teamFlag) return;
                if (!answer.loged) return;
                var team = this.$store.getters["app/users"].find(
                  (item) => item.id == answer.user
                );
                if (team === undefined || team.team === undefined) return;
                team = team.team;
                teamFlag = filters.team.some((item) => team.includes(item));
              });
            });
          });
        }

        if (filters.label !== undefined && filters.label.length > 0) {
          var labels = template.content.templateLabel;
          filterLabel = filters.label.some((item) => labels.includes(item));
        }

        if (filters.status !== undefined && filters.status != "") {
          var falied = false;
          log.logs.map((page) => {
            page.questions.map((question) => {
              question.answers.map((answer) => {
                if (
                  answer.ref.type.failedAnswer &&
                  answer.ref.type.failedAnswer == answer.value
                )
                  falied = true;
              });
            });
          });
          filterStatus =
            (filters.status == "passed" && !falied) ||
            (filters.status != "passed" && falied);
        }

        if(template.content.templateSD == 'bookmarked') {
          if(template.content.teams!=undefined && Array.isArray(template.content.teams) && template.content.teams.length>0 && !template.content.teams.some(t=> userTeam.includes(t))) return false
          if(locationList.length>0) {
            if(!template.content.location || !Array.isArray(template.content.location)) return false
            if(!locationList.some(ll=> template.content.location.includes(ll))) return false
          }
        }
        else {
          var schedule = this.$store.getters['app/getScheduleById'](log.schedule || '')
          if(schedule == undefined) return false
          if (schedule.deleted || (schedule.active !== undefined && !schedule.active)) return false;
          var scheduleTeam = schedule.assign.concat(schedule.monitor || [])
          if(!scheduleTeam.some(t=> userTeam.includes(t))) return false
          if(schedule.location== undefined) return false
          if(locationList.length>0) {
            if(locationList.indexOf(schedule.location[0])<0) return false
          }
        }

        return (
          filterFrom &&
          filterTo &&
          userFlag &&
          teamFlag &&
          filterLabel &&
          filterStatus &&
          filterLocation
        );
      });
      return logs.sort(
        (a, b) =>
          b.updated_at.toDate().getTime() - a.updated_at.toDate().getTime()
      );
    },
    getTemplateInfo() {
      return (id) => {
        return this.$store.getters["app/getTemplateById"](id);
      };
    },
    calcComplate() {
      return (item) => {
        var percent = 0;
        var count = 0;
        var complated = 0;
        var starCount = 0;
        var starValue = 0;
        var star = false;
        var score = false;
        var scoreValue = 0;
        item.logs.map((page, p) => {
          page.questions.map((question, q) => {
            question.answers.map((answer, a) => {
              if (answer.ref.mandatory) {
                if (item.logs[p].questions[q].answers[a].loged) {
                  if (
                    answer.ref.type.failedAnswer === undefined ||
                    answer.ref.type.failedAnswer === "" ||
                    item.logs[p].questions[q].answers[a].value !=
                      answer.ref.type.failedAnswer
                  )
                    complated++;
                }
                count++;
              }
            });
          });
        });
        // scoreValue = Math.round(scoreValue * 100) / 100;
        if (count == 0) percent = 100;
        else percent = (complated / count) * 100;
        return {
          percent: percent,
          complated: complated,
          count: count,
          score: score,
          scoreValue: scoreValue,
          star: star,
          starValue: starValue,
        };
      };
    },
    badgeURL() {
      return require("../../assets/images/badge/qualizy-badge-dark.svg");
    },
    nonCompliantTasksAmount() {
      let amount = 0;
      this.filteredLogs.map(el => amount = amount + this.logInfo(el).failed);
      return amount;
    }
  },
  methods: {
    setLogs() {
      if(this.filter.from == '') {
        this.$vs.loading()
        db.collection("logs").where('templateID', 'in', this.filter.template.slice(0,10)).orderBy('updated_at','desc').get().then((q) => {
          this.$vs.loading.close()
        let logs = [];
        q.forEach((doc) => {
          logs.push(Object.assign({}, doc.data(), { id: doc.id }));
        });
        this.$store.dispatch("app/setLogs", logs);
      });    
      } else {
        this.$vs.loading()
        db.collection("logs")
          .where('templateID', 'in', this.filter.template.slice(0,10))
          .where('updated_at' , '>=' , this.filter.from)
          .where('updated_at' , '<=' , this.filter.to)
          .orderBy('updated_at','desc')
          .get().then((q) => {
          this.$vs.loading.close()
          let logs = [];
          q.forEach((doc) => {
            logs.push(Object.assign({}, doc.data(), { id: doc.id }));
          });
          this.$store.dispatch("app/setLogs", logs);
        });    
      }
        
    },
    roleError(action) {
      this.$vs.notify({
        time: 5000,
        title: "Authorization Error",
        text:
          `You don't have authorization for ${action}.\n Please contact with your super admin`,
        color: "danger",
        iconPack: "feather",
        icon: "icon-lock",
      });
    },
    deleteRD() {
      if(!this.auth('report' , 'delete')) {
        this.roleError('delete')
        return false
      }
      db.collection('report_schedule').doc(this.existSchedule.id).delete()
      this.activeSchedule = false
      this.$vs.notify({
          time: 5000,
          title: "Deleted",
          text: 'Schedule report is deleted.',
          color: "success",
          iconPack: "feather",
          icon: "icon-check",
        });
    },
    scheduleReport() {
      let existSchedule = this.existSchedule
      var to = []
      var users = []
      var teams = []
      this.rTeam.map(team=> {
        teams.push(team.id)
        users = this.$store.getters['app/users'].filter(user=> user.team.indexOf(team.id)>-1 && user.status && user.rEmail!=undefined && user.rEmail)
        users.map(user=> {
          if(!to.find(item=> item.email == user.email))
            to.push({
              email: user.email,
              name: user.name || '',
              lang: user.lang || 'en-us',
              title: this.reportTitle,
            })
        })
      })
      
      if(existSchedule) {
        if(!this.auth('report' , 'edit')) {
          this.roleError('edit')
          return false
        }
        db.collection('report_schedule').doc(existSchedule.id).update({
          updated_by: JSON.parse(localStorage.getItem("userInfo")).id,
          updated_at: new Date(),
          start: this.sDate,
          __repeat: this.sRepeat,
          to: to,
          team: teams
        })
        this.$vs.notify({
          time: 5000,
          title: "Updated",
          text: 'Schedule report is updated.',
          color: "success",
          iconPack: "feather",
          icon: "icon-check",
        });
      }else {
        if(!this.auth('report' , 'create')) {
          this.roleError('create')
          return false
        }
        db.collection('report_schedule').add({
          group: JSON.parse(localStorage.getItem("userInfo")).group,
          reportID: this.$route.params.id,
          created_by: JSON.parse(localStorage.getItem("userInfo")).id,
          created_at: new Date(),
          start: this.sDate,
          __repeat: this.sRepeat,
          to: to,
          team: teams
        })
        this.$vs.notify({
          time: 5000,
          title: "Created",
          text: 'Schedule report is created.',
          color: "success",
          iconPack: "feather",
          icon: "icon-check",
        });
      }
    },
    printReprot(file_name) {
      var title = document.title;
      document.title = file_name;
      window.print();
      document.title = title;
    },
    exportExcel(file_name) {
      var logs = this.filteredLogs;

      var formatedLogs = [];

      logs.map((item) => {
        formatedLogs.push([
          "date",
          this.$moment(item.updated_at.toDate()).format("DD/MMM/YYYY @ HH:mm"),
        ]);
        formatedLogs.push([
          "template",
          this.getTemplateInfo(item.templateID).content.templateTitle,
        ]);
        formatedLogs.push([
          "status",
          `${this.calcComplate(item).complated} / ${
            this.calcComplate(item).count
          }`,
        ]);

        item.logs.map((page) => {
          formatedLogs.push(["", "page", page.title]);
          page.questions.map((question) => {
            formatedLogs.push(["", "", "question", question.title]);
            question.answers.map((answer) => {
              var value = "";
              if (
                answer.ref.type.dateType !== undefined &&
                answer.ref.type.dateType == "Time" &&
                answer.value != ""
              ) {
                value = this.$moment(answer.value).format("HH:mm:ss");
              } else if (
                answer.ref.type.dateType !== undefined &&
                answer.ref.type.dateType == "Date" &&
                answer.value != ""
              )
                value = this.$moment(answer.value).format("DD MMMM ,YYYY");
              else if (
                answer.ref.type.dateType !== undefined &&
                answer.ref.type.dateType == "Date & Time" &&
                answer.value != ""
              )
                value = this.$moment(answer.value).format(
                  "DD MMMM ,YYYY @ HH[h]mm"
                );
              else if (
                answer.value !== undefined &&
                answer.value.seconds !== undefined &&
                answer.value != ""
              )
                value = this.$moment(answer.value.toDate()).format(
                  "DD MMMM ,YYYY @ HH[h]mm"
                );
              else if (answer.images !== undefined) {
                var images = [];
                answer.images.map((image) => {
                  images.push(image.url);
                });
                value = images.join(" , ");
              } else value = answer.value;
              var unit = "";
              if (answer.ref.type.tempUnit)
                unit = `(${answer.ref.type.tempUnit})`;
              formatedLogs.push([
                "",
                "",
                "",
                `${answer.ref.title} ${unit}`,
                value,
              ]);
            });
          });
        });
        formatedLogs.push([], []);
      });
      var exprotExcel = XLSX.utils.aoa_to_sheet(formatedLogs);
      var wb = XLSX.utils.book_new(); // make Workbook of Excel
      XLSX.utils.book_append_sheet(wb, exprotExcel, "Report");
      XLSX.writeFile(wb, `${file_name}.${this.selectedFormat}`); // name of the file is 'book.xlsx'
    },
    exportFunction() {
      var fileName1;
      if (this.fileName == "") {
        fileName1 =
          this.$options.filters.capitalize(this.$t("report")) +
          "_" +
          this.$moment(new Date()).format("DD-MM-YYYYTHH-mm");
      } else fileName1 = this.fileName;
      if (this.selectedFormat == "pdf") this.printReprot(fileName1);
      else {
        this.exportExcel(fileName1);
      }
    },
    copyText(text) {
      const thisIns = this;
      this.$copyText(text).then(
        function () {
          thisIns.$vs.notify({
            title: "Success",
            text: "Text copied successfully",
            color: "success",
            iconPack: "feather",
            position: "top-center",
            icon: "icon-check-circle",
          });
        },
        function () {
          thisIns.$vs.notify({
            title: "Failed",
            text: "Error in copying text",
            color: "danger",
            iconPack: "feather",
            position: "top-center",
            icon: "icon-alert-circle",
          });
        }
      );
    },
    shareReort() {},
    deleteReport() {
      this.$vs.dialog({
        color: this.colorAlert,
        title: `Delete`,
        text: `This report will be deleted completely.
                Are you sure?`,
        accept: this.acceptDelete,
      });
    },
    acceptDelete() {
      db.collection("reports").doc(this.$route.params.id).delete();
      this.$router.push("/report");
    },
    saveReport() {
      this.reportFilterSidebar = false;
      var tags = [];
      this.tag.map((item) => {
        tags.push(item.id);
      });
      var teams = [];
      this.team.map((item) => {
        teams.push(item.id);
      });

      db.collection("reports")
        .doc(this.$route.params.id)
        .update({
          title: this.reportTitle,
          description: this.description,
          visible: this.visible,
          teams: teams,
          tags: tags,
          filter: this.filter,
          updated_at: new Date(),
          created_by: JSON.parse(localStorage.getItem("userInfo")).id,
        });
      this.$router.push("/report");
    },
    chnFilter(filters) {
      this.reportFilterSidebar = false;
      this.filter = filters;
    },
    filterRows(num) {
      if(num === 0) { // if selected non compliant tasks
        if(this.filteredRowLogs.length) {
          this.compliantColor = '#363636';
          if(this.logInfo(this.filteredRowLogs[0]).failed > 0) { // if already selected non compliant tasks
            this.filteredRowLogs = [];
            this.nonCompliantColor = '#363636';
          } else { // if selected compliant tasks
            this.filteredRowLogs = this.filteredLogs.filter(el => this.logInfo(el).failed > 0);
            this.nonCompliantColor = 'green';
          }
        } else {
          this.filteredRowLogs = this.filteredLogs.filter(el => this.logInfo(el).failed > 0);
          this.nonCompliantColor = 'green';
        }
      } else { // if selected compliant tasks
        if(this.filteredRowLogs.length) {
          this.nonCompliantColor = '#363636';
          if(this.logInfo(this.filteredRowLogs[0]).failed == 0) { // if already selected compliant tasks
            this.filteredRowLogs = [];
            this.compliantColor = '#363636';
          } else { // if selected non compliant tasks
            this.filteredRowLogs = this.filteredLogs.filter(el => this.logInfo(el).failed == 0);
            this.compliantColor = 'green';
          }
        } else {
          this.filteredRowLogs = this.filteredLogs.filter(el => this.logInfo(el).failed == 0);
          this.compliantColor = 'green';
        }
      }
    }
  },

  created() {
    let reportID = this.$route.params.id;
    this.shareUrl = `https://my.qualizy.app/#/public-report/${reportID}`;
    this.badge = `<a href="https://my.qualizy.app/#/public-report/${reportID}">
<img src="https://my.qualizy.app${this.badgeURL}" class="width: 444px;height: 142px;object-fit: contain;">
</a>`;
    var report = this.$store.getters["app/reportByID"](reportID);
    if(!report || report.group != JSON.parse(localStorage.getItem('userInfo')).group) this.$router.push('/report')
    this.$vs.loading();
    report = db
      .collection("reports")
      .doc(reportID)
      .get()
      .then((doc) => {
        this.$vs.loading.close();
        const filter = doc.data().filter;
        const from = doc.data().filter.from;
        const to = doc.data().filter.to;

        if (from !== "" && from !== undefined) {
          filter._from = new Date(from.seconds * 1000);
          filter._to = new Date(to.seconds * 1000);
        }
        
        this.filter = filter;
        this.reportTitle = doc.data().title;
        this.description = doc.data().description;
        this.visible = doc.data().visible;
        let teams = doc.data().teams || [];
        teams.map((item) => {
          if (this.$store.getters["app/getTeamById"](item))
            this.team.push(this.$store.getters["app/getTeamById"](item));
        });
        let tags = doc.data().tags || [];
        tags.map((item) => {
          if (this.$store.getters["app/getLabelById"](item))
            this.tag.push(this.$store.getters["app/getLabelById"](item));
        });

        var today = new Date();
        if (this.filter.date == "custom") {
          if (this.filter._from !== undefined) {
            this.filter.from = this.filter._from;
            this.filter.to = this.filter._to;
          } else {
            this.filter.from = new Date(
              today.getTime() - 10 * 24 * 60 * 60 * 1000
            );
            this.filter.to = today;
          }
          
        } else if (this.filter.date == "today") {
          this.filter.from = this.filter.to = today;
        } else if (this.filter.date == "thisW") {
          this.filter.to = today;
          var today1 = new Date();
          var day = today1.getDay();
          var diff = today1.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
          this.filter.from = new Date(today1.setDate(diff));
        } else if (this.filter.date == "thisM") {
          this.filter.to = today;
          this.filter.from = new Date(today.getFullYear(), today.getMonth(), 1);
        } else if (this.filter.date == "thisQ") {
          this.filter.to = today;
          this.filter.from = new Date(
            today.getFullYear(),
            Math.floor(today.getMonth() / 3) * 3,
            1
          );
        } else if (this.filter.date == "thisY") {
          this.filter.to = today;
          this.filter.from = new Date(today.getFullYear(), 0, 1);
        } else if (this.filter.date == "beforeD") {
          this.filter.to = today;
          this.filter.from = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        } else if (this.filter.date == "beforeW") {
          var today1 = new Date();
          var day = today1.getDay();
          var diff = today1.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
          this.filter.to = new Date(today1.setDate(diff - 1));
          this.filter.from = new Date(today.setDate(diff - 7));
        } else if (this.filter.date == "beforeM") {
          this.filter.to = new Date(today.getFullYear(), today.getMonth(), 0);
          this.filter.from = new Date(
            today.getFullYear(),
            today.getMonth() - 1,
            1
          );
        } else if (this.filter.date == "beforeQ") {
          this.filter.to = new Date(
            today.getFullYear(),
            Math.floor(today.getMonth() / 3) * 3,
            0
          );
          this.filter.from = new Date(
            this.filter.to.getFullYear(),
            this.filter.to.getMonth() - 2,
            1
          );
        } else if (this.filter.date == "beforeY") {
          this.filter.to = new Date(today.getFullYear(), 0, 0);
          this.filter.from = new Date(today.getFullYear() - 1, 0, 1);
        } else if (this.filter.date == "all") {
          this.filter.to = this.filter.from = "";
        }
        this.filter.from =
          this.filter.from == ""
            ? ""
            : new Date(this.filter.from.setHours(0, 0, 0, 0));
        this.filter.to =
          this.filter.to == ""
            ? ""
            : new Date(this.filter.to.setHours(23, 59, 59, 999));
        this.setLogs()
      });
  },
};
</script>

<style scoped>
.hasDatepickerIcon::after {
  font-family: "feather" !important;
  font-style: normal;
  font-size: 20px;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1.7;
  content: "\e83a";
  position: absolute;
  top: 3px;
  right: 10px;
}
.page-title > p {
  color: #1e1c26;
  font-size: 24px;
}
.page-title > .main-title {
  opacity: 0.54;
}

.logStatusTable {
  border-spacing: 0;
}

.logStatusTable thead th:not(:first-child),
.logStatusTable tbody td:not(:first-child) {
  text-align: right;
  padding-right: 1em;
}

.logStatusTable thead th {
  opacity: 0.6;
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #1e1c26;
}

.logStatusTable tbody td {
  opacity: 0.78;
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #1e1c26;
}
</style>

<style lang="scss">
#reprot-print {
  display: none;
}

#invoice-container {
  visibility: hidden;
}

@media print {
  //   @page {
  //     size: auto;
  //     margin: 20mm 0 10mm 0;
  //   }
  body {
    background: #ffffff !important;
  }
  .export-options {
    visibility: hidden;
  }

  #app {
    * {
      visibility: hidden;
    }

    #reprot-print {
      display: block;
    }

    #content-area {
      margin: 0 !important;
    }

    #invoice-container,
    #invoice-container * {
      visibility: visible;
    }

    #invoice-container {
      -webkit-print-color-adjust: exact;
      position: absolute;
      left: 0;
      top: 0;
      box-shadow: none;
      //   div * {
      //     // page-break-inside: auto;
      //   }
    }

    #invoice-container table.questionTable {
      page-break-inside: avoid;
      page-break-after: avoid;
    }

    // #invoice-container div .vx-row * {
    //   page-break-inside: avoid;
    //   page-break-after: avoid;
    // }
    // #invoice-container .vs-progress--foreground * {
    //   page-break-inside: avoid;
    //   page-break-after: avoid;
    // }
    // #invoice-container h5 {
    //   page-break-inside: avoid;
    //   page-break-after: avoid;
    // }
  }
}
</style>

<style>
  .report-schedule .vs-dialog {
    overflow-y: auto;
    overflow-x: hidden;
  }
</style>
<style lang="scss" src="../analytics/buefy.scss"></style>