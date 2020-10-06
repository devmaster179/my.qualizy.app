<template>
  <div id="report-page" class="px-2">
    <div class="sm:flex justify-between">
      <div class="page-title">
        <p class="karla-bold">{{$t("report") | capitalize}}</p>
      </div>
      <div class="page-action sm:flex items-center">
        <vs-input
          class="bg-white search-box hidden sm:block"
          icon-no-border
          icon-pack="feather"
          icon="icon-search"
          placeholder="Search"
          v-model="search"
        />
        <vs-button
          :disabled="role>2"
          to="/create-report"
          color="primary"
          icon-pack="feather"
          icon="icon-file-text"
          type="filled"
          class="sm:ml-3 ml-auto"
        >{{ $t("Create Report") | capitalize }}</vs-button>
        <vs-input
          class="bg-white search-box block sm:hidden w-full mt-2"
          icon-no-border
          icon-pack="feather"
          icon="icon-search"
          placeholder="Search"
          v-model="search"
        />
      </div>
    </div>
    <div class="vx-row" :class="{ 'items-grid-view match-height': reports.length > 0 }">
      <div class="flex w-full mt-base" v-if="reports.length < 1">
        <div
          class="vx-col flex items-center justify-center flex-col sm:w-1/2 md:w-3/5 lg:w-3/4 xl:w-1/2 mx-auto text-center sm:mt-base mt-0"
        >
          <img
            :src="require('../../assets/images/pages/report/empty-docs.svg')"
            class="mx-auto mb-4"
          />
          <h5
            class="sm:mx-0 mx-4 mb-4 sm:text-2xl sm:text-1xl d-theme-heading-color"
          >You don’t have any reports, would you like to create one?</h5>
          <vs-button to="/create-report">{{$t("Create Report")}}</vs-button>
        </div>
      </div>
      <div
        v-else
        class="vx-col grid-view-item mt-4 v-full lg:w-1/3 sm:w-1/2 w-full p-0 sm:pl-3 pl-0"
        v-for="report in reports"
        :key="report.id"
      >
        <vx-card>
          <div slot="no-body" class="sm:p-4 p-2">
            <div class="flex justify-between items-center">
              <h4 class="truncate karla-bold" style="font-size:16px;">{{ report.title }}</h4>
              <div style="white-space:nowrap">
                <feather-icon
                  v-if="report.visible == 'Public'"
                  icon="GlobeIcon"
                  class="w-6 h-6 ml-1 cursor-pointer"
                />
                <feather-icon
                  v-else-if="report.visible == 'Just me'"
                  icon="LockIcon"
                  class="w-6 h-6 ml-1 cursor-pointer"
                />
                <feather-icon
                  v-else-if="report.visible == 'Teams'"
                  icon="UsersIcon"
                  class="w-6 h-6 ml-1 cursor-pointer"
                />
                <vs-dropdown>
                  <feather-icon icon="MoreVerticalIcon" class="w-8 h-8 cursor-pointer" />
                  <vs-dropdown-menu>
                    <vs-dropdown-item
                      class="mr-12 mb-2 mt-2"
                      @click="$router.push(`/report-view/${report.id}`)"
                    >
                      <vs-icon icon-pack="feather" color="black" size="16px" icon="icon-eye" />
                      <span
                        class="ml-3 font-semibold text-black"
                        style="font-size:12px;"
                      >{{$t("preview")}}</span>
                    </vs-dropdown-item>
                    <vs-dropdown-item
                      class="mr-6 mb-2"
                      v-if="report.visible == 'Public'"
                      @click="doShare(report.id)"
                    >
                      <vs-icon icon-pack="feather" color="black" size="16px" icon="icon-share-2" />
                      <span
                        class="ml-3 font-semibold text-black"
                        style="font-size:12px;"
                      >{{$t("share")}}</span>
                    </vs-dropdown-item>
                    <vs-dropdown-item
                      v-if="role<2"
                      class="mr-6 mb-2"
                      @click="deleteReport(report.id)"
                    >
                      <vs-icon icon-pack="feather" color="black" size="16px" icon="icon-trash-2" />
                      <span
                        class="ml-3 font-semibold text-black"
                        style="font-size:12px;"
                      >{{$t("delete")}}</span>
                    </vs-dropdown-item>
                  </vs-dropdown-menu>
                </vs-dropdown>
              </div>
            </div>
            <div class="mt-2">
              <span class="text-grey karla" style="font-size:12px;">{{ report.description }}</span>
            </div>
            <div class="mt-2">
              <div
                class="flex items-center"
                v-if="report.visible=='Teams' && getTems(report.teams).length>0"
              >
                <div class="flex items-center px-2 py-1 rounded" style="background:#ebebf1;">
                  <feather-icon class="w-4 h-4 mr-2" icon="UsersIcon" />
                  <span class="karla">{{getTems(report.teams)[0].name}}</span>
                </div>
                <vs-dropdown
                  vs-custom-content
                  class="cursor-pointer mr-4"
                  vs-trigger-click
                  v-if="getTems(report.teams).length>1"
                >
                  <span
                    class="karla item-text py-1 px-3 rounded ml-2 cursor-pointer"
                    style="background:#ebebf1;"
                  >+{{getTems(report.teams).length-1}}</span>
                  <vs-dropdown-menu class="vx-navbar-dropdown">
                    <div class="bg-white">
                      <div
                        class="flex items-center px-2 py-1 rounded mr-2"
                        v-for="(team,tIndex) in getTems(report.teams)"
                        :key="tIndex"
                      >
                        <feather-icon class="w-4 h-4 mr-2" icon="UsersIcon" />
                        <span class="karla">{{team.name}}</span>
                      </div>
                    </div>
                  </vs-dropdown-menu>
                </vs-dropdown>
              </div>
            </div>
            <div class="mt-2">
              <div class="flex items-center" v-if="getTags(report.tags).length>0">
                <div class="flex items-center px-2 py-1 rounded" style="background:#ebebf1;">
                  <div
                    class="w-2 h-2 rounded-full mr-1"
                    :style="`background:${getTags(report.tags)[0].color}`"
                  />
                  <span class="karla">{{getTags(report.tags)[0].name}}</span>
                </div>
                <vs-dropdown
                  vs-custom-content
                  class="cursor-pointer mr-4"
                  vs-trigger-click
                  v-if="getTags(report.tags).length>1"
                >
                  <span
                    class="karla item-text py-1 px-3 rounded ml-2 cursor-pointer"
                    style="background:#ebebf1;"
                  >+{{getTags(report.tags).length-1}}</span>
                  <vs-dropdown-menu class="vx-navbar-dropdown">
                    <div class="bg-white" style="min-width:12rem">
                      <div
                        class="flex items-center px-2 py-1 rounded-lg mr-2"
                        v-for="(tag,tIndex) in getTags(report.tags)"
                        :key="tIndex"
                      >
                        <div class="w-2 h-2 rounded-full mr-1" :style="`background:${tag.color}`" />
                        <span class="karla">{{tag.name}}</span>
                      </div>
                    </div>
                  </vs-dropdown-menu>
                </vs-dropdown>
              </div>
            </div>
          </div>
        </vx-card>
      </div>
    </div>
    <vs-prompt
      :is-valid="reportTitle != ''"
      :title="$t('Share Report')"
      :accept-text="$t('share') | capitalize"
      :cancel-text="$t('cancel') | capitalize"
      @accept="shareReort"
      :active.sync="activeShare"
    >
      <div class="vx-row px-4">
        <div class="vx-coll w-full mt-4">
          <vx-input-group class="mb-base">
            <vs-input v-model="shareUrl" />
            <template slot="append">
              <div class="append-text btn-addon">
                <vs-button color="primary" @click="copyText(shareUrl)">Copy Url</vs-button>
              </div>
            </template>
          </vx-input-group>
          <div class="vx-coll w-full mt-4">
            <h5 class="mb-4">Share with</h5>
            <social-sharing
              :url="shareUrl"
              title="Qualizy Report"
              description="Qualizy Report"
              quote="Qualizy Report"
              hashtags="qualizy,report"
              twitter-user="qualizy"
              inline-template
            >
              <div class="flex">
                <network network="facebook" class="flex-col text-center cursor-pointer">
                  <img :src="require('../../assets/images/social/facebook.svg')" class="block" />
                  <p class="mt-2">Facebook</p>
                </network>
                <network network="twitter" class="flex-col text-center ml-3 cursor-pointer">
                  <img :src="require('../../assets/images/social/twitter.svg')" class="block" />
                  <p class="mt-2">Twitter</p>
                </network>
                <network network="linkedin" class="flex-col text-center ml-3 cursor-pointer">
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
  </div>
</template>

<script>
import { db } from "@/firebase/firebaseConfig.js";

export default {
  data() {
    return {
      reportTitle: "",
      reportFilterSidebar: true,
      search: "",
      selectedID: "",
      activeShare: false,
    };
  },
  methods: {
    shareReort() {},

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
    doShare(id) {
      this.selectedID = id;
      this.activeShare = true;
    },
    deleteReport(id) {
      this.selectedID = id;
      this.$vs.dialog({
        color: this.colorAlert,
        title: `Delete`,
        text: this.$t(`are you sure to delete ?`),
        accept: this.acceptDelete,
      });
    },
    acceptDelete() {
      db.collection("reports").doc(this.selectedID).delete();
      this.selectedID = "";
    },
  },
  computed: {
    getTems() {
      return (ids) => {
        if (!ids) return [];
        var teams = [];
        ids.map((id) => {
          if (
            !!this.$store.getters["app/getTeamById"](id) &&
            this.$store.getters["app/getTeamById"](id).active
          )
            teams.push(this.$store.getters["app/getTeamById"](id));
        });
        return teams;
      };
    },
    getTags() {
      return (ids) => {
        if (!ids) return [];
        var tags = [];
        ids.map((id) => {
          if (!!this.$store.getters["app/getLabelById"](id))
            tags.push(this.$store.getters["app/getLabelById"](id));
        });
        return tags;
      };
    },
    role() {
      var cUser = this.$store.getters["app/currentUser"];
      if (cUser == undefined || cUser.role === undefined) {
        return 4;
      }
      return cUser.role.key;
    },
    badgeURL() {
      return require("../../assets/images/badge/qualizy-badge-dark.svg");
    },
    badge() {
      return `<a href="https://my.qualizy.app/#/public-report/${this.selectedID}">
<img src="https://my.qualizy.app${this.badgeURL}" class="width: 444px;height: 142px;object-fit: contain;">
</a>`;
    },
    shareUrl() {
      return `https://my.qualizy.app/#/public-report/${this.selectedID}`;
    },
    reports() {
      let reports = this.$store.getters["app/reports"]
        .filter(
          (item) =>
            item.title.toLowerCase().indexOf(this.search.toLowerCase()) > -1
        )
        .sort(
          (a, b) =>
            b.updated_at.toDate().getTime() - a.updated_at.toDate().getTime()
        );
      
      let filterLocations = this.$store.getters["app/locationList"]
      if(filterLocations.length == 0)
        return reports
      else 
        return reports.filter(report => !!report.location && report.location.some(item=> filterLocations.includes(item)))
      
    },
  },
};
</script>

<style scoped>
.page-title > p {
  font-size: 24px;
  color: #1e1c26;
}
.grid-view-item {
  transition: 0.35s;
}
.grid-view-item:hover {
  transform: translateY(-5px);
}
@media (min-width: 576px) {
  .search-box {
    max-width: 170px !important;
  }
}
</style>
