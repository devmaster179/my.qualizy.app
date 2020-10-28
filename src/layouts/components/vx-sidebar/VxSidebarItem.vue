<!-- =========================================================================================
    File Name: VxSidebarItem.vue
    Description: Sidebar item component. Extends vuesax framework's 'vs-sidebar-item' component
    Component Name: VxSidebarItem
    ----------------------------------------------------------------------------------------
    Item Name: Vuesax Admin - VueJS Dashboard Admin Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div
    :class="[{'vs-sidebar-item-active':activeLink}, {'disabled-item pointer-events-none': isDisabled}]"
    class="vs-sidebar--item"
    v-if="canSee"
  >
    <router-link
      v-if="to"
      :to="to"
      :class="[{'router-link-active': activeLink}]"
      class="block text-center"
      :target="target"
      exact
    >
      <vs-icon
        v-if="!featherIcon"
        size="22px"
        class="mr-0"
        :icon-pack="iconPack"
        :icon="icon"
        style="font-family:'Material Icons Outlined';"
      ></vs-icon>
      <feather-icon :icon="icon" :class="{'w-3 h-3': iconSmall}" class="block mr-0" v-else></feather-icon>
      <slot></slot>
    </router-link>
    <!-- <router-link
      v-else-if="supportButton"
      class="router-link-active support-button cursor-pointer flex justify-center text-primary"
    >
      ddddddd
      <feather-icon icon="InfoIcon" class="block mr-0"></feather-icon>
      <slot></slot>
    </router-link>-->
    <a v-else-if="supportButton" class="cursor-pointer block text-center">
      <feather-icon icon="InfoIcon" class="block mr-0"></feather-icon>
      <slot></slot>
    </a>
  </div>
</template>

<script>
export default {
  name: "VxSidebarItem",
  props: {
    supportButton: {
      type: Boolean,
      default: false,
    },
    icon: {
      default: "",
      type: String,
    },
    iconSmall: {
      default: false,
      type: Boolean,
    },
    iconPack: {
      default: "material-icons",
      type: String,
    },
    href: {
      default: "#",
      type: String,
    },
    to: {
      default: null,
      type: String,
    },
    slug: {
      default: null,
      type: String,
    },
    index: {
      default: null,
      type: [String, Number],
    },
    featherIcon: {
      default: true,
      type: Boolean,
    },
    target: {
      default: "_self",
      type: String,
    },
    isDisabled: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      activeLink: false,
    };
  },
  watch: {
    $route() {
      this.CheckIsActive();
    },
  },
  methods: {
    CheckIsActive() {
      if (this.to) {
        if (
          (this.to == this.$router.path && this.to) ||
          this.$route.meta.parent == this.slug
        )
          this.activeLink = true;
        else this.activeLink = false;
        // if (this.$route.path.slice(1).includes(this.to.slice(1)) && this.to.slice(1)) this.activeLink = true
        // else this.activeLink = false
      }
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
    canSee() {
      if(this.slug == '' || this.slug === null || this.slug == undefined) return true
      return this.auth(this.slug , 'view')
      // this.$acl.check(this.$store.state.userRole);
      // if (this.to) {
      //   if (
      //     this.to == "/templates" ||
      //     this.to == "/schedule" ||
      //     this.to == "/analytics" ||
      //     this.to == "/report" ||
      //     this.to == "/report"
      //   ) {
      //     if (this.role == 3) return false;
      //   } else if (this.to == "/team" && this.role > 1) return false;
      //   else if (this.to == "/company" && this.role > 0) return false;

      //   // var role_text = this.$router.match(this.to).meta.rule;

      //   // return this.$acl.check(this.$router.match(this.to).meta.rule);
      // }
      // return true;
    },
  },
  updated() {
    this.CheckIsActive();
  },
};
</script>

<style scoped>
.support-button {
  background: linear-gradient(
    118deg,
    rgba(var(--vs-success), 1),
    rgba(var(--vs-success), 0.7)
  ) !important;
}
</style>
