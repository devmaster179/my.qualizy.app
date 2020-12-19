<!-- =========================================================================================
    File Name: VxSidebar.vue
    Description: Sidebar Component
    Component Name: VxSidebar
    ----------------------------------------------------------------------------------------
    Item Name: Vuesax Admin - VueJS Dashboard Admin Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div class="parentx">
    <vs-sidebar
      v-hammer:swipe.left="onSwipeLeft"
      ref="mainSidebar"
      :parent="parent"
      :hiddenBackground="clickNotClose"
      :reduce="reduce"
      default-index="-1"
      class="sidebarx no-print main-menu-sidebar items-no-padding"
      v-model="isSidebarActive"
      :click-not-close="clickNotClose"
    >
      <div @mouseenter="sidebarMouseEntered" @mouseleave="sidebarMouseLeave">
        <div
          class="header-sidebar flex justify-between m-0 mb-4"
          slot="header"
          style="padding:20px; background:#6C50F0;"
        >
          <img
            :src="logo"
            alt="logo"
            class="cursor-pointer"
            v-if="logo"
            width="40px" height="40px"
            @click="$router.push('/').catch(err => {})"
          />
        </div>

        <div class="shadow-bottom" v-show="showShadowBottom"></div>

        <VuePerfectScrollbar
          ref="mainSidebarPs"
          class="scroll-area--main-sidebar pt-2"
          :settings="settings"
          @ps-scroll-y="psSectionScroll"
        >
          <template v-for="(sidebarItem, index) in sidebarItems">
            <!-- GROUP ITEM HEADER -->
            <span
              :key="`header-${index}`"
              v-if="sidebarItem.header && !sidebarItemsMin"
              class="navigation-header truncate"
            >{{ $t(sidebarItem.i18n) || sidebarItem.header | capitalize }}</span>
            <template v-else-if="!sidebarItem.header">
              <!-- IF IT'S SINGLE ITEM -->
              <vx-sidebar-item
                ref="sidebarLink"
                :key="`sidebarItem-${index}`"
                v-if="!sidebarItem.submenu"
                :index="index"
                :to="sidebarItem.slug != 'external' ? sidebarItem.url : ''"
                :href="sidebarItem.slug == 'external' ? sidebarItem.url : ''"
                :icon="sidebarItem.icon"
                :target="sidebarItem.target"
                :featherIcon="sidebarItem.feather===undefined"
                :isDisabled="sidebarDisabled(sidebarItem)"
                :slug="sidebarItem.slug"
              >
                <span
                  v-show="!sidebarItemsMin"
                  class="karla block"
                  style="font-size:10px; white-space: normal;"
                >{{ $t(sidebarItem.i18n) || sidebarItem.name | capitalize }}</span>
                <vs-chip
                  class="ml-auto"
                  :color="sidebarItem.tagColor"
                  v-if="sidebarItem.tag && (isMouseEnter || !reduce)"
                >{{ sidebarItem.tag }}</vs-chip>
              </vx-sidebar-item>

              <!-- IF HAVE SUBMENU / DROPDOWN -->
              <template v-else>
                <vx-sidebar-group
                  ref="sidebarGrp"
                  :key="`group-${index}`"
                  :openHover="openGroupHover"
                  :group="sidebarItem"
                  :groupIndex="index"
                  :open="isGroupActive(sidebarItem)"
                ></vx-sidebar-group>
              </template>
            </template>
          </template>
        </VuePerfectScrollbar>
        <div class="px-4 mt-4">
          <vx-sidebar-item
            @click.native="toggleSupportChat"
            icon="headset_mic"
            :featherIcon="false"
            supportButton
          >
            <span
              v-show="!sidebarItemsMin"
              class="karla block"
              style="font-size:10px; white-space: normal;"
            >{{$t('support') | capitalize}}</span>
          </vx-sidebar-item>
        </div>
      </div>
    </vs-sidebar>
    <div
      v-hammer:swipe.right="onSwipeRightSidebarSwipeArea"
      v-if="!isSidebarActive"
      class="sidebar-swipe-area"
      id="sidebar-swipe-area"
    ></div>
  </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import VxSidebarGroup from "./VxSidebarGroup.vue";
import VxSidebarItem from "./VxSidebarItem.vue";

export default {
  name: "vx-sidebar",
  props: {
    sidebarItems: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
    },
    logo: {
      type: String,
    },
    parent: {
      type: String,
    },
    openGroupHover: {
      type: Boolean,
      default: false,
    },
    reduceNotRebound: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    showSupportChat: false,
    clickNotClose: false, // disable close sidebar on outside click
    reduce: false, // determines if sidebar is reduce - component property
    showCloseButton: false, // show close button in smaller devices
    isMouseEnter: false,
    settings: {
      // perfectscrollbar settings
      maxScrollbarLength: 60,
      wheelSpeed: 1,
      swipeEasing: true,
    },
    windowWidth: window.innerWidth, //width of windows
    showShadowBottom: false,
  }),
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
    sidebarDisabled() {
      return (item) => {
        return false
        // if(item.slug == '') return false
        // return !this.auth(item.slug , 'read')

      //   if (!item.role) return false;

      //   var cUser = this.$store.getters["app/currentUser"];
      //   if (cUser == undefined || cUser.role == undefined) return true;
      //   if (item.role.indexOf(cUser.role.key) > -1) return false;

      //   return true;
      };
    },
    isSidebarActive: {
      get() {
        return this.$store.state.isSidebarActive;
      },
      set(val) {
        this.$store.commit("TOGGLE_IS_SIDEBAR_ACTIVE", val);
      },
    },
    reduceSidebar() {
      return Boolean(this.reduce && this.reduceButton);
    },
    reduceButton: {
      get() {
        return this.$store.state.reduceButton;
      },
      set(val) {
        this.$store.commit("TOGGLE_REDUCE_BUTTON", val);
      },
    },
    sidebarItemsMin() {
      return this.$store.state.sidebarItemsMin;
    },
    isGroupActive() {
      return (sidebarItem) => {
        const router = this.$route;
        const path = this.$route.fullPath;
        let open = false;
        let func = function (sidebarItem) {
          if (sidebarItem.submenu) {
            sidebarItem.submenu.forEach((item) => {
              if (path == item.url || router.meta.parent == item.slug) {
                open = true;
              } else if (item.submenu) {
                func(item);
              }
            });
          }
        };
        func(sidebarItem);
        return open;
      };
    },
  },
  watch: {
    reduce(val) {
      if (val == true) {
        this.$store.dispatch("updateSidebarWidth", "reduced");
      } else {
        this.$store.dispatch("updateSidebarWidth", "default");
      }

      setTimeout(function () {
        window.dispatchEvent(new Event("resize"));
      }, 100);
    },
    reduceButton() {
      this.setSidebarWidth();
    },
    $route() {
      if (this.isSidebarActive && this.showCloseButton)
        this.$store.commit("TOGGLE_IS_SIDEBAR_ACTIVE", false);
    },
  },
  methods: {
    toggleSupportChat() {
      // if(this.showSupportChat){
        window.gist.chat('hideLauncher');
        window.gist.chat('open')
        // this.showSupportChat = false
      // }
      // else {
      //   window.gist.chat('close')
      //   this.showSupportChat = true
      // }
    },
    sidebarMouseEntered() {
      if (this.reduce) this.$store.commit("UPDATE_SIDEBAR_ITEMS_MIN", false);
      this.isMouseEnter = true;
    },
    sidebarMouseLeave() {
      if (this.reduce) {
        this.$store.commit("UPDATE_SIDEBAR_ITEMS_MIN", true);
      }
      this.isMouseEnter = false;
    },
    toggleReduce(val) {
      this.reduceButton = val;
      this.setSidebarWidth();
    },
    handleWindowResize(event) {
      this.windowWidth = event.currentTarget.innerWidth;
      this.setSidebarWidth();
    },
    setSidebarWidth() {
      if (this.windowWidth < 1200) {
        if (this.windowWidth < 992)
          this.$store.commit("UPDATE_WINDOW_BREAKPOINT", "md");
        else this.$store.commit("UPDATE_WINDOW_BREAKPOINT", "lg");

        this.$store.commit("TOGGLE_IS_SIDEBAR_ACTIVE", false);
        if (this.reduceButton) this.reduce = false;
        // this.reduceButton = false;
        this.showCloseButton = true;
        this.clickNotClose = false;
        this.$store.dispatch("updateSidebarWidth", "no-sidebar");
        this.$store.commit("UPDATE_SIDEBAR_ITEMS_MIN", false);
      } else {
        this.$store.commit("UPDATE_WINDOW_BREAKPOINT", "xl");
        if (this.reduceButton) this.reduce = true;
        else this.reduce = false;

        this.$store.commit("TOGGLE_IS_SIDEBAR_ACTIVE", true);
        if (this.reduceButton && !this.isMouseEnter)
          this.$store.commit("UPDATE_SIDEBAR_ITEMS_MIN", true);
        else this.$store.commit("UPDATE_SIDEBAR_ITEMS_MIN", false);

        this.clickNotClose = true;
        this.showCloseButton = false;
        if (this.reduceSidebar)
          this.$store.dispatch("updateSidebarWidth", "reduced");
        else this.$store.dispatch("updateSidebarWidth", "default");
      }
    },
    psSectionScroll() {
      if (this.$refs.mainSidebarPs.$el.scrollTop > 0)
        this.showShadowBottom = true;
      else this.showShadowBottom = false;
    },
    onSwipeLeft() {
      if (this.isSidebarActive && this.showCloseButton)
        this.isSidebarActive = false;
    },
    onSwipeRightSidebarSwipeArea() {
      if (!this.isSidebarActive && this.showCloseButton)
        this.isSidebarActive = true;
    },
  },
  components: {
    VxSidebarGroup,
    VxSidebarItem,
    VuePerfectScrollbar,
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.handleWindowResize);
    });
    this.setSidebarWidth();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleWindowResize);
  },
};
</script>

<style lang="scss">
@import "@/assets/scss/vuesax/components/vxSidebar.scss";
</style>
<style scoped>
.scroll-area--main-sidebar {
  height: calc(100vh - 180px);
}
.main-menu-sidebar {
  max-width: 80px;
}
</style>