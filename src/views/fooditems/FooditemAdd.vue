<!-- =========================================================================================
    File Name: TodoAddNew.vue
    Description: Add new todo component
    ----------------------------------------------------------------------------------------
    Item Name: Vuesax Admin - VueJS Dashboard Admin Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <vs-prompt
    :title="$t('add food item') | capitalize"
    :accept-text="$t('save') | capitalize"
    :cancel-text="$t('cancel') | capitalize"
    button-cancel="border"
    @cancel="clearFields"
    @accept="submitTodo"
    @close="clearFields"
    :is-valid="validateForm"
    :active.sync="activePrompt"
  >
    <VuePerfectScrollbar class="food-new-area pt-4 px-2" :settings="settings">
      <div class="vx-row">
        <div class="vx-col w-full px-1">
          <vs-switch
            icon-pack="feather"
            vs-icon-on="icon-camera"
            vs-icon-off="icon-camera-off"
            v-model="scanEnable"
            class="ml-auto"
          ></vs-switch>
        </div>
        <div class="vx-col w-full px-1" v-if="scanEnable">
          <StreamBarcodeReader
            v-if="isValidCamera"
            @decode="onDecode"
            @error="onError"
            @loaded="onLoaded"
          ></StreamBarcodeReader>
          <ImageBarcodeReader class="mt-4" v-else @decode="onDecode" @error="onError"></ImageBarcodeReader>
        </div>
      </div>
      <div class="vx-row">
        <div class="vx-col w-full px-1">
          <vs-input
            :label-placeholder="$t('food item name')| capitalize"
            v-model="name"
            name="name"
            class="w-full mb-4 mt-5"
            :color="name ? 'success' : 'danger'"
            v-validate="'required'"
            data-vv-validate-on="blur"
          />
        </div>
      </div>
      <div class="op-block px-1 mt-5">
        <vs-divider
          position="left-center"
          :color="dateValidation ? '#999':'rgb(234, 84, 85)'"
        >{{$t("preparation date") | capitalize}} & {{$t("expiry date") | capitalize}}</vs-divider>
        <div class="vx-row">
          <div class="vx-col w-full px-1 mb-4">
            <vs-checkbox v-model="expireForever">{{$t("no expiry date") | capitalize}}</vs-checkbox>
          </div>
          <div class="vx-col w-full px-0" v-if="!expireForever">
            <span>{{$t("expiry date") | capitalize}}</span>
            <datepicker
              v-model="e_date"
              format="dd MMMM yyyy"
              :language="languages[$i18n.locale]"
              :disabledDates="disabledDates"
              required
            ></datepicker>
          </div>
        </div>
      </div>
      <div class="op-block px-1 mt-5">
        <vs-divider
          position="left-center"
          :color="allergens.length ? '#999':'rgb(234, 84, 85)'"
        >{{$t("allergens") | capitalize}}</vs-divider>
        <div class="vx-row">
          <div
            class="vx-col sm:w-1/3 px-0 w-full mb-2"
            v-for="(allergen, index) in allergenLists"
            :key="index"
          >
            <vs-checkbox
              v-model="allergens"
              :vs-value="allergen.id"
            >{{ allergen.name | capitalize }}</vs-checkbox>
          </div>
        </div>
      </div>
      <div class="op-block px-1 mt-5">
        <div class="vx-row">
          <div class="vx-col px-0 w-full">
            <vs-input
              :label-placeholder="$t('batch number') | capitalize"
              v-model="batch"
              class="w-full mb-4 mt-5"
            ></vs-input>
            <vs-textarea :label="$t('descriptions') | capitalize" v-model="desc" />
          </div>
        </div>
      </div>
    </VuePerfectScrollbar>
  </vs-prompt>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { StreamBarcodeReader, ImageBarcodeReader } from "vue-barcode-reader";
import Datepicker from "vuejs-datepicker";
import * as lang from "vuejs-datepicker/src/locale";

import { db } from "../../firebase/firebaseConfig";

import firebase from "firebase/app";
import "@firebase/analytics";

export default {
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    VuePerfectScrollbar,
    Datepicker,
    StreamBarcodeReader,
    ImageBarcodeReader,
  },

  data() {
    return {
      scanEnable: false,
      // isValidCamera:
      //   navigator &&
      //   navigator.mediaDevices &&
      //   "enumerateDevices" in navigator.mediaDevices,
      expireForever: false,
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.7,
      },
      disabledDates: {
        to: new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate()
        ),
      },
      e_date: new Date(),
      languages: lang,
      // language: this.$i18n.locale,
      textarea: "",
      batch: "",
      allergens: [],
      // task fields
      name: "",
      desc: "",
    };
  },
  computed: {
    isValidCamera() {
      return !(
        navigator &&
        navigator.mediaDevices &&
        "enumerateDevices" in navigator.mediaDevices
      );
    },
    role() {
      var cUser = this.$store.getters["app/currentUser"];
      if (cUser.role === undefined) return 5;
      return cUser.role.key;
    },
    allergenLists() {
      return this.$store.getters["app/allergens"];
    },
    dateValidation() {
      return this.expireForever || (!this.expireForever && this.e_date !== "");
    },
    // getLang() {
    // return this.$i18n.locale
    // },
    validateForm() {
      return !this.errors.any() && this.title != "" && this.e_date !== "";
    },
    activePrompt: {
      get() {
        return this.open;
      },
      set() {
        this.$emit("close");
      },
    },
  },
  methods: {
    onError(e) {
      this.$vs.notify({
        time: 10000,
        title: "Varcode Error",
        text: e,
        iconPack: "feather",
        icon: "icon-alert-circle",
        color: "danger",
      });
    },
    onLoaded() {
      // this.$vs.notify({
      //   time: 10000,
      //   title: "Camera loaded",
      //   text: "Camera loaded",
      //   iconPack: "feather",
      //   icon: "icon-alert-circle",
      //   color: "success"
      // });
    },
    onDecode(result) {
      // this.name = result;
      // this.$vs.notify({
      //   time: 10000,
      //   title: "Camera captured",
      //   text: result,
      //   iconPack: "feather",
      //   icon: "icon-alert-circle",
      //   color: "success"
      // });
      result = result.replace(" ", "");
      this.$http
        .get("https://world.openfoodfacts.org/api/v0/product/" + result)
        .then((res) => {
          if (res.data.status == 0) {
            this.$vs.notify({
              time: 10000,
              title: "Varcode Error",
              text: result,
              iconPack: "feather",
              icon: "icon-alert-circle",
              color: "danger",
            });
          } else {
            this.name = res.data.product.product_name;
          }
        })
        .catch(() => {
          this.$vs.notify({
            time: 10000,
            title: "Varcode Error",
            text: result,
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "danger",
          });
        });
    },
    addFooditem() {
      // this.$vs.loading();
      db.collection("fooditems")
        .add({
          name: this.name,
          e_date: new Date(
            this.e_date.getFullYear(),
            this.e_date.getMonth(),
            this.e_date.getDate(),
            23,
            59,
            59
          ),
          forever: this.expireForever,
          allergens: this.allergens,
          desc: this.desc,
          batch: this.batch,
          group: JSON.parse(localStorage.getItem("userInfo")).group,
          created_by: JSON.parse(localStorage.getItem("userInfo")).id,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .then((res) => {
          // this.$vs.loading.close();
          firebase.analytics().logEvent("Added a FoodItem", {
            group: JSON.parse(localStorage.getItem("userInfo")).group,
            id: res.id,
          });
          
        });
      this.clearFields();
    },
    clearFields() {
      // clear all fileds in todo
      this.name = "";
      this.p_date = "";
      this.e_date = new Date();
      this.allergens = [];
      this.expireForever = false;
      this.batch = "";
      this.desc = "";
    },
    submitTodo() {
      this.$validator.validateAll().then((result) => {
        if (result) this.addFooditem();
      });
    },
  },
};
</script>

<style scoped>
.food-new-area {
  height: calc(70vh - 69px);
}
.vx-row {
  margin: 0;
}
@media (max-width: 576px) {
  .vs-dialog-text {
    padding-left: 0px !important;
    padding-right: 0px !important;
  }
}
</style>

