<template>
  <div id="templates">
    <template v-if="!auth('templates' , 'view')">
      <no-auth/>
    </template>
    <template v-else>
      <template v-if="widthSupport">
        <div class="page-header sm:flex items-center justify-between">
          <p class="page-title karla-bold">{{$t("templates")}}</p>
          <div class="page-actions items-center hidden sm:flex justify-end">
            <div class="flex justify-end">
              <vs-input
                class="bg-white hidden md:block"
                v-model="search"
                :placeholder="$t('Search')"
                icon="icon-search"
                icon-pack="feather"
                icon-no-border
              />
              <feather-icon
                @click="activeFilter=true"
                icon="FilterIcon"
                class="ml-2 rounded-lg d-theme-dark-bg cursor-pointer"
                style="height:40px; width:40px; padding:.7rem"
              />
              <vs-button
                class="ml-2"
                @click="newTemplate"
              >
                <span class="karla">+ {{$t("add new template")}}</span>
              </vs-button>
            </div>
          </div>
        </div>
        <!-- <vs-input
        class="bg-white block md:hidden w-full my-2"
        v-model="search"
        :placeholder="$t('Search')"
        icon="icon-search"
        icon-pack="feather"
        icon-no-border
        />-->
        <div class="page-content">
          <template v-if="templates.length>0">
            <table class="templates-table w-full">
              <thead>
                <tr>
                  <th>{{$t("template name")}}</th>
                  <th>{{$t("locations")}}</th>
                  <th>{{$t("tags")}}</th>
                  <th>{{$t("status")}}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <list-view
                  v-for="(template,index) in templates"
                  :key="index"
                  :template="template"
                  @schedule="newSchedule"
                />
              </tbody>
            </table>
          </template>
          <template v-else>
            <div class="flex w-full mt-base">
              <div
                class="vx-col flex items-center justify-center flex-col sm:w-1/2 md:w-3/5 lg:w-3/4 xl:w-1/2 mx-auto text-center sm:mt-base mt-0"
              >
                <img
                  :src="require('@/assets/images/pages/report/empty-docs.svg')"
                  class="mx-auto mb-4"
                />
                <h5
                  v-if="role<3"
                  class="sm:mx-0 mx-4 mb-4 sm:text-2xl sm:text-1xl d-theme-heading-color"
                >{{$t("You don’t have any active template yet")}}, {{$t("would you like to create one")}}?</h5>
                <h5 v-else
                  class="sm:mx-0 mx-4 mb-4 sm:text-2xl sm:text-1xl d-theme-heading-color"
                >{{$t("You don’t have any active template yet")}}.</h5>
                <vs-button v-if="role<2" class="ml-2" @click="$router.push('/templates/template-new')" >{{$t("add new template")}}</vs-button>
              </div>
            </div>
          </template>
        </div>
      </template>
      <template v-else>
        <div class="page-header">
          <p class="page-title karla-bold">{{$t("templates")}}</p>
        </div>
        <div class="page-content sm:mt-base mt-4 px-2">
          <vx-card>
            <div style="min-height: calc(100vh - 14rem);">
              <img
                class="mx-auto mt-base"
                :src="require(`@/assets/images/template_image/unsupport.svg`)"
              />
              <p
                class="karla-bold unsupport-title mt-base sm:px-4 text-center"
              >This feature is not available on mobile devices. Try using it on your computer.</p>
              <p
                class="karla unsupport-note text-center mt-base"
              >Or you can send us screenshots of template that you want to create and we will do it for you!</p>
            </div>
          </vx-card>
        </div>
      </template>
      <template-filter
        :templateTag="templateTag"
        @filter="filter"
        :open="activeFilter"
        @close="activeFilter=false"
      />
      <schedule-popup
        :open="activeSchedule"
        @close="activeSchedule=false"
        :templateID="newScheduleTemplateID"
      />
    </template>
  </div>
</template>
<script>
import ListView from "./TemplateListView";
import TemplateFilter from "./TemplateFilter";
import SchedulePopup from "../schedule/SchedulePopup";
import NoAuth from "@/components/no-auth/NoAuth";

export default {
  components: {
    ListView,
    TemplateFilter,
    SchedulePopup,
    NoAuth
  },
  data() {
    return {
      newScheduleTemplateID: "",
      width: window.innerWidth,
      search: "",
      activeFilter: false,
      templateTag: [],
      activeSchedule: false,
    };
  },
  methods: {
    roleError(sub , action) {
      this.$vs.notify({
        time: 5000,
        title: "Authorization Error",
        text:
          `You don't have authorization to ${action} for ${sub}.\n Please contact with your super admin`,
        color: "danger",
        iconPack: "feather",
        icon: "icon-lock",
      });
    },
    newTemplate() {
      if(!this.auth('templates' , 'create')) {
        this.roleError('templates' , 'create')
        return false
      }
      this.$store.commit("app/SET_EDIT_ANSWER_INDEXES", {
        page: 0,
        question: 0,
        answer: 0,
      });
      this.$router.push('/templates/template-new')
    },
    newSchedule(tID) {
      if(!this.auth('schedule' , 'create')) {
        this.roleError('schedule' , 'create')
        return false
      }
      this.newScheduleTemplateID = tID;
      this.activeSchedule = true;
    },
    filter(val) {
      if (val.tags !== undefined) this.templateTag = val.tags;
    },
    onResize() {
      this.width = window.innerWidth;
    },
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
    role() {
      var cUser = this.$store.getters["app/currentUser"];
      if (cUser == undefined || cUser.role === undefined) {
        return 4;
      }
      return cUser.role.key;
    },
    widthSupport() {
      return this.width > 1000;
    },
    templates() {
      var cUser = this.$store.getters["app/currentUser"]
      var locationList = this.$store.getters['app/locationList']
      var locationList1 = []
      if(locationList.length==0) {
        if(cUser.role == undefined || cUser.role.key == undefined || cUser.role.key>0) {
          if(cUser.location !== undefined && Array.isArray(cUser.location) && cUser.location.length>0) {
            locationList1 = cUser.location
          }
        }
      }

      let templates = this.$store.getters["app/template"];
      var __templates = [];
      templates.map((template) => {
        if (template.trashed) return;
        if(locationList.length > 0 ) {
          if(template.content.location!=undefined && Array.isArray(template.content.location) && template.content.location.length>0) {
            if(!template.content.location.some(tl=> locationList.includes(tl))) return
          }
          else  
            return  
        } else {
          if(locationList1.length == 0) {
            if(template.content.location!=undefined && Array.isArray(template.content.location) && template.content.location.length>0) {
              return 
            }
          }else {
            if(template.content.location!=undefined && Array.isArray(template.content.location) && template.content.location.length>0) {
              if(!template.content.location.some(tl=> locationList1.includes(tl))) return
            }
          }
        }
        if (this.search != "") {
          if (
            template.content.templateTitle
              .toLowerCase()
              .indexOf(this.search.toLowerCase()) < 0
          )
            return;
        }
        if (this.templateTag.length > 0) {
          if (
            !template.content.templateLabel.some((item) =>
              this.templateTag.includes(item)
            )
          )
            return;
        }
        __templates.push(template);
      });
      return __templates.sort(
        (a, b) =>
          b.updated_at.toDate().getTime() - a.updated_at.toDate().getTime()
      );
    },
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
    this.onResize();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
};
</script>
<style scoped>
.page-title {
  font-size: 24px;
  color: #1e1c26;
}
</style>
<style>
.templates-table {
  border-collapse: separate;
  border-spacing: 0px 1.3rem;
}
.templates-table thead tr th {
  font-family: "Karla";
  font-size: 14px;
  color: #1e1c26;
  padding-left: 0;
}
.templates-table thead tr th:first-child {
  padding-left: 2rem;
}
.templates-table tbody tr {
  box-shadow: rgba(0, 0, 0, 0.05) 0px 4px 20px 0px;
}
.templates-table tbody tr td {
  padding: 1rem 5px 1rem 0;
  background: white;
  color: 1e1c26;
  font-family: "Karla";
}

.templates-table tbody tr td:first-child {
  padding: 1.5rem 0 1.5rem 2rem;
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
}

.templates-table tbody tr td:last-child {
  border-top-right-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}
.unsupport-title {
  font-size: 18px;
  color: #1e1c26;
}
.unsupport-note {
  font-size: 14px;
  color: #1e1c26;
  opacity: 0.54;
}
</style>