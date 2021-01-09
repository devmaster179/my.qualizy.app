<!-- =========================================================================================
  File Name: FullPage.vue
  Description: Full page layout
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div class="layout--full-page" style="background: #ebebf1;">
    <vs-navbar
      v-if="!path"
      v-model="indexActive"
      :color="colorx"
      text-color="rgba(var(--vs-dark),1)"
      active-text-color="rgba(var(--vs-dark),1)"
      class="myNavbar text-white"
    >
      <div slot="title">
        <vs-navbar-title>
          <img
            class="mt-2"
            @click="$router.push('/').catch(err => {})"
            :src="require('@/assets/images/logo/logo-text.png')"
            alt="Qualizy"
            width="125px" height="50px"
          />
        </vs-navbar-title>
      </div>
        <vs-spacer></vs-spacer>

      <vs-navbar-item index="page-login">
        <span class="cursor-pointer block p-4 pb-1" @click="login">{{$t("sign in")}}</span>
      </vs-navbar-item>

      <vs-navbar-item index="page-register">
        <span class="cursor-pointer block p-4 pb-1" @click="register">{{$t("sign up")}}</span>
      </vs-navbar-item>

      <vs-navbar-item index="page-template">
        <span class="cursor-pointer block p-4 pb-1" @click="template">{{$t("templates")}}</span>
      </vs-navbar-item>
    </vs-navbar>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // indexActive: this.$route.name
      colorx: "rgba(52, 144, 220, 0)",
    };
  },
  computed: {
    path() {
      return (
        this.$route.path.includes("/public-report/") ||
        this.$route.path.includes("/pages/register")
      );
    },
    indexActive: {
      get() {
        return this.$route.name;
      },
      set(val) {},
    },
  },
  methods: {
    login() {
      if (this.indexActive == "page-login") return false;
      else this.$router.push("/pages/login").catch((err) => {});
    },
    register() {
      if (this.indexActive == "page-register") return false;
      else this.$router.push("/pages/register").catch((err) => {});
    },

    template() {
      if (this.indexActive == "page-template") return false;
      else this.$router.push("/pages/public-templates").catch((err) => {});
    },
    getMyIp() {
      return new Promise((resolve, reject) => {
        this.$http
          .get("https://api.ipify.org/")
          .then((res) => {
            resolve(res);
          })
          .catch((e) => reject(e));
      });
    },
    ipInfo(myIp) {
      return new Promise((resolve, reject) => {
        this.$http
          .get(
            `https://api.ipstack.com/${myIp}?access_key=a6fb7682c0eef24e12ddc8aa091ca744`
          )
          .then((res) => resolve(res))
          .catch((e) => reject(e));
      });
    },
  },

  async created() {
    try {
      window.gist.chat("hideLauncher");
    } catch (error) {
      setTimeout(() => {
        window.gist.chat("hideLauncher");
      }, 500);
    }
    let myIp = await this.getMyIp();

    let ipInfo = await this.ipInfo(myIp.data);
    if (!ipInfo.success) {
    }

    this.$store.commit("app/SET_IP_INFO", ipInfo.data);
    let language = "en-us";
    if (!!ipInfo && !!ipInfo.data.country_code) {
      if (ipInfo.data.country_code.toLowerCase() == "gb") language = "en-gb";
      else if (
        ipInfo.data.country_code.toLowerCase() == "fr" ||
        ipInfo.data.country_code.toLowerCase() == "es" ||
        ipInfo.data.country_code.toLowerCase() == "it"
      )
        language = ipInfo.data.country_code.toLowerCase();
      // else if (ipInfo.data.country_code.toLowerCase() == "ru") language = "fr";
    }
    this.$i18n.locale = language;
  },
};
</script>
