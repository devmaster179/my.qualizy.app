<template>
  <div id="analytics">
    <div class="page-header sm:flex items-center justify-between mb-base">
      <div class="flex items-end">
        <p class="karla-bold text-3xl" style="color:#1e1c26;">{{$t('analytics') | capitalize}}</p>
        <p class="karla text-lg mb-1 ml-2" style="color:#1e1c26;">({{dateFilterDisp}})</p>
      </div>
      <div class="flex items-center justify-end">
        <v-select v-model="analytic" :options="analytics" label="name" class="mr-2" style="min-width: 200px; background:white;"/>
        <feather-icon
          @click="showFilter"
          class="p-2 shadow-drop w-10 rounded-lg d-theme-dark-bg cursor-pointer text-primary mr-2"
          icon="FilterIcon"
        />
        <vs-button @click="saveAnalyticsActive=true" :disabled="filters.template.length==0 && canSave">{{$t('save')}}</vs-button>
      </div>
    </div>
    <div class="page-content">
      <template v-if="templates.length==0">
        <vx-card>
          <div class="flex w-full mt-base">
          <div
            class="vx-col flex items-center flex-col sm:w-1/2 md:w-3/5 lg:w-3/4 xl:w-1/2 mx-auto text-center sm:mt-base mt-0"
            style="min-height:500px;"
          >
            <img
              :src="require('../../assets/images/pages/report/empty-doc.svg')"
              class="mx-auto mb-4 cursor-pointer"
              @click="showFilter"
            />
            <h3
              class="mt-base text-grey"
            >Select the options from right side bar to generate the analytics.</h3>
          </div>
        </div>
        </vx-card>
      </template>
      <template v-else>
        <div class="mb-4" v-for="(template,index) in templates" :key="index">
          <AnalyticsItem :template="template" :filters="filters" @chnOption="chnOption"/>
        </div>
        
      </template>
    </div>
    <analy-filter
      @chnFilter="chnFilter"
      :filters="filters"
      :isSidebarActive="filterSidebar"
      @closeSidebar="filterSidebar = false"
    />
    <vs-prompt
      :is-valid="analyticsName!=''"
      :title="$t('save analytics')"
      :accept-text="$t('save') | capitalize"
      :cancel-text="$t('cancel') | capitalize"
      @accept="saveAnalytics"
      :active.sync="saveAnalyticsActive"
    >
      <VuePerfectScrollbar class="p-0 mb-10" :settings="settings" style="height:20rem;">
        <div class="vx-row">
          <div class="vx-col w-full mb-4" v-if="analytic!=null">
            <vs-switch v-model="updateFlag">
              <span slot="on">{{$t('update')}}</span>
              <span slot="off">{{$t('save')}}</span>
            </vs-switch>
          </div>
          <div class="vx-col w-full mb-4">
            <label class="font-semibold">{{$t("name")}}</label>
            <vs-input v-model="analyticsName" class="w-full" placeholder="name" />
          </div>
          <div class="vx-col w-full">
            <label class="font-semibold">{{$t("visible to")}}</label>
            <div class="flex items-center mt-2">
              <div v-for="(visibleItem,vIndex) in visibles" :key="vIndex">
                <div class="flex items-center ml-4 cursor-pointer" @click="visible=visibleItem.key">
                  <vs-icon icon="radio_button_checked" size="25px" color="primary" v-if="visibleItem.key==visible"/>
                  <vs-icon icon="radio_button_unchecked" size="25px" v-else />
                  <span class="karla" :class="{'text-primary':visibleItem.key==visible}">{{$t(visibleItem.text)}}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="vx-col w-full mt-4" v-if="visible==1">
            <label class="font-semibold">{{$t('teams')}}</label>
            <v-select :reduce="teamItem=>teamItem.id" :options="teams" label="name" multiple v-model="team" />
          </div>
        </div>
      </VuePerfectScrollbar>
    </vs-prompt>
  </div>
</template>

<script>
import AnalyFilter from "./AnalyFilter";
import AnalyticsItem from "./AnalyticsItem"
import VSelect from "vue-select"
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import { db } from "@/firebase/firebaseConfig.js";

export default {
  components: {
    AnalyFilter,
    AnalyticsItem,
    VSelect,
    VuePerfectScrollbar
  },
  data() {
    return {
      init: true,
      saved: false,
      team: [],
      visible: 0,
      visibles: [
        {key:0, text: 'public'},
        {key:1, text: 'teams'},
        {key:2, text: 'Just me'}
      ],
      updateFlag: false,
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.6,
      },
      analyticsName: "",
      saveAnalyticsActive: false,
      analytic: null,
      from: "",
      to: "",
      filterSidebar: false,
      date: '',
      filters: {
        date: "today",
        template: [],
        users: [],
        teams: [],
        options: [],
      }
    };
  },
  methods: {
    updateAnalytics() {
      db.collection('analytics').doc(this.analytic.id).update({
        locations: this.$store.getters['app/locationList'],
        name: this.analyticsName,
        filters: this.filters,
        updated_at: new Date(),
        updated_by: JSON.parse(localStorage.getItem('userInfo')).id,
        visible: this.visible,
        teams: this.team
      })
    },  
    saveAnalytics() {
      this.saved = true
      if(this.updateFlag) {
        this.updateAnalytics()
      }
      else {
        const that = this
        var newAnanlytics = db.collection('analytics').doc()
        newAnanlytics.set({
          locations: this.$store.getters['app/locationList'],
          filters: this.filters,
          name: this.analyticsName,
          visible: this.visible,
          teams: this.team,
          updated_at: new Date(),
          updated_by: JSON.parse(localStorage.getItem('userInfo')).id,
          group: JSON.parse(localStorage.getItem('userInfo')).group,
        }).then(()=> {
         that.analytic = {
            id: newAnanlytics.id,
            name: that.analyticsName
          }
        })
      }
    },
    chnOption(options,template,key) {
      var temp = options
      temp.template = template
      temp[key] = !temp[key]
      let index = this.filters.options.findIndex(item=> item.template == template)
      if( index>-1 ) {
        this.filters.options[index] = temp
      }
      else {
        this.filters.options.push(temp)
      }
    },

    setLog() {
      var today = new Date();
      var val = this.filters.date
      if(!val) val = ""
      if (Array.isArray(val)) {
        this.from = val[0].seconds ? val[0].toDate(): val[0];
        this.to = val[1].seconds ? val[1].toDate(): val[1];
      } else if (val == "today") {
        this.from = this.to = new Date();
      } else if (val == "this week") {
        this.to = today;
        var today1 = new Date();
        var day = today1.getDay();
        var diff = today1.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
        this.from = new Date(today1.setDate(diff));
      } else if (val == "this month") {
        this.to = today;
        this.from = new Date(today.getFullYear(), today.getMonth(), 1);
      } else if (val == "this quarter") {
        this.to = today;
        this.from = new Date(
          today.getFullYear(),
          Math.floor(today.getMonth() / 3) * 3,
          1
        );
      } else if (val == "this year") {
        this.to = today;
        this.from = new Date(today.getFullYear(), 0, 1);
      } else if (val == "yesterday") {
        this.to = today;
        this.from = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      } else if (val == "previous week") {
        var today1 = new Date();
        var day = today1.getDay();
        var diff = today1.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
        this.to = new Date(today1.setDate(diff - 1));
        this.from = new Date(today.setDate(diff - 7));
      } else if (val == "previous month") {
        this.to = new Date(today.getFullYear(), today.getMonth(), 0);
        this.from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      } else if (val == "previous quarter") {
        this.to = new Date(
          today.getFullYear(),
          Math.floor(today.getMonth() / 3) * 3,
          0
        );
        this.from = new Date(this.to.getFullYear(), this.to.getMonth() - 2, 1);
      } else if (val == "previous year") {
        this.to = new Date(today.getFullYear(), 0, 0);
        this.from = new Date(today.getFullYear() - 1, 0, 1);
      } else if (val == "all time" || val == "") {
        this.to = this.from = "";
      }

      if(this.from =='') this.from= new Date(0)
      if(this.to =='') this.to= new Date()

      this.$vs.loading()
      db.collection("logs").where('templateID', 'in' , this.filters.template)
        .where('updated_at' , '>=' , this.from)
        .where('updated_at' , '<=' , this.to)
        .get().then((q) => {
        this.$vs.loading.close()
        let logs = [];
        q.forEach((doc) => {
          logs.push(Object.assign({}, doc.data(), { id: doc.id }));
        });
        this.$store.dispatch("app/setLogs", logs);
      });    
      db.collection('sensorDatas').where('templateID', 'in', this.filters.template).where('time', '>=' , this.from).where('time','<=' , this.to).orderBy('time','asc').get().then(q=> {
        let sensorDatas = []
        q.forEach(doc=> {
          sensorDatas.push(Object.assign({}, doc.data(), {id: doc.id}))
        })
        this.$store.commit('app/SET_SENSOR_DATA', sensorDatas)
      })

    },
    chnFilter(filter) {
      this.filters.date = filter.date
      var ft = []
      filter.template.map(ftt=> {
        ft.push(ftt.id)
      })
      this.filters.template = ft
      var ft = []
      filter.users.map(ftt=> {
        ft.push(ftt.id)
      })
      this.filters.users = ft
      var ft = []
      filter.teams.map(ftt=> {
        ft.push(ftt.id)
      })
      this.filters.teams = ft
      this.filterSidebar = false;
      this.setLog()
    },
    showFilter() {
      this.filterSidebar = true;
    },
    removeFlter() {
      this.filters = {
        date: "today",
        template: []
      };
    },
  },
  watch: {
    saveAnalyticsActive(val) {
      if(val) {
        if(this.analytic == null) {
          this.visible = 0
          this.team = []
          this.analyticsName = ""
          if(!this.init) {
            this.filters = {
              date: "today",
              template: [],
              users: [],
              teams: [],
              options: [],
            }
          }
          
        } else {
          let analytic = JSON.parse(JSON.stringify(this.$store.getters['app/getAnalyticsByID'](this.analytic.id)))
          this.analyticsName = analytic.name
          this.visible = analytic.visible,
          this.team = analytic.teams
        }
      }
    },
    analytic(val) {
      if(val == null) {
        this.init = true
        this.visible = 0
        this.team = []
        this.analyticsName = ""
        this.filters = {
          date: "today",
          template: [],
          users: [],
          teams: [],
          options: [],
        }
      }
      else {
        let analytic = JSON.parse(JSON.stringify(this.$store.getters['app/getAnalyticsByID'](this.analytic.id)))
        var cUser = this.$store.getters["app/currentUser"]
        var locationList = []
        var savedLocationList = analytic.locations || []
        if(cUser.role == undefined || cUser.role.key == undefined || cUser.role.key>0) {
          if(cUser.location !== undefined && Array.isArray(cUser.location) && cUser.location.length>0) {
            locationList = cUser.location.filter(lo => savedLocationList.includes(sl=>sl == lo))
          } else {
            locationList = []
          }
        } else {
          locationList = savedLocationList
        }
        if(!this.saved)
          this.$store.commit('app/SET_LOCATION_LIST' , locationList)
        this.init = false

        this.filters = analytic.filters
        this.analyticsName = analytic.name
        this.visible = analytic.visible,
        this.team = analytic.teams
        if(!this.saved) this.setLog()
        else this.saved = false
      }
    }
  },
  computed: {
    canSave() {
      return true
    },
    templates() {
      var templates = []
      var cUser = this.$store.getters["app/currentUser"]
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

      this.filters.template.map(item => {
        var template = this.$store.getters['app/getTemplateById'](item)
        if(!template) return false
        if(locationList.length > 0) {
          if(!template.content.location || !Array.isArray(template.content.location) || !template.content.location.some(lo=>locationList.includes(lo))) return 
        }
        templates.push(item)
      })
      return templates
    },
    teams() {
      var cUser = this.$store.getters["app/currentUser"]
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
      let teams = this.$store.getters["app/teams"].filter(team=> {
        if (locationList.length > 0) {
          if(team.location == undefined || !Array.isArray(team.location)) return false
          if(!team.location.some(item => locationList.includes(item))) return false
        }
        return team.active && !team.deleted
      });

      return teams
    },
    analytics() {
      let analytics =  this.$store.getters['app/analytics']
      var analytics1 = []
      var cUser = this.$store.getters["app/currentUser"]

      analytics.map(item=> {
        if(item.visible == 1) {
          if(!cUser.team.some(ut=> item.teams.includes(ut))) return 
        }
        else if (item.visible == 2) {
          if(cUser.id != item.updated_by) return 
        }

        analytics1.push({id: item.id, name: item.name})
      })
      return analytics1
    },
    dateFilterDisp() {
      var value = this.filters.date
        if(Array.isArray(value)) {
          return `${this.$t('date')}: ${this.$t('from')}: ${this.$moment(value[0]).format("Do/MM/YYYY")} ~ ${this.$t('to')}: ${this.$moment(value[1]).format("Do/MM/YYYY")}`
        } else {
          return `${this.$t('date')}: ${this.$t(value)}`
        }
    }
  },
};
</script>
