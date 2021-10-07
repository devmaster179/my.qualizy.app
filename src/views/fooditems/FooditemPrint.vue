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
    :title="$t('print label') | capitalize"
    :accept-text="$t('print label') | capitalize"
    :cancel-text="$t('cancel')"
    button-cancel="border"
    @accept="printLabel"
    :active.sync="activePrompt"
  >
    <div
      class="vx-row"
      id="foodItemPrintSection"
      ref="foodItemPrintSection"
      v-if="item.id !== undefined"
    >
      <div class="w-full mt-auto mb-auto sm:w-12/12">
        <h6 class="mb-1">{{ $t("name") }} : {{ item.name }}</h6>
        <h6 class="mb-1" v-if="item.forever">
          {{ $t("expire date") | capitalize }} :
          {{ $t("forever") | capitalize }}
        </h6>
        <h6 class="mb-1" v-else>
          {{ $t("expire date") }} :
          {{ item.e_date.toDate() | moment("DD MMMM, YYYY") }}
        </h6>
        <h6 class="mb-1">
          {{ $t("created") | capitalize }} Date :
          {{ item.created_at.toDate() | moment("DD MMMM, YYYY") }}
        </h6>
        <h6 class="mb-1" v-if="user != undefined">
          {{ $t("by") | capitalize }} : {{ user.name | capitalize }}
        </h6>
        <h6>{{ $t("allergens") }} : {{ allergens | capitalize }}</h6>
      </div>
    </div>
  </vs-prompt>
</template>

<script>
import html2canvas from "html2canvas";
import print from "print-js";

//  var jsPdf = require('https://unpkg.com/jspdf@latest/dist/jspdf.min.js');
export default {
  components: {
    VuePerfectScrollbar: () => import("vue-perfect-scrollbar"),
    QrcodeVue: () => import("qrcode.vue"),
  },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      output: null,
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.7,
      },
    };
  },
  computed: {
    activePrompt: {
      get() {
        return this.open;
      },
      set() {
        this.$emit("close");
      },
    },

    allergens() {
      let allergens = [];

      this.item.allergens.map((item) => {
        var allergen = this.$store.getters["app/getAllergenById"](item);
        if (allergen) allergens.push(item);
      });

      if (this.item.ingredients && Array.isArray(this.item.ingredients)) {
        var iFoodItem;
        this.item.ingredients.map((item) => {
          iFoodItem = this.$store.getters["app/getItemById"](item.id);
          if (iFoodItem && iFoodItem.allergens) {
            iFoodItem.allergens.map((al) => {
              if (
                allergens.indexOf(al) < 0 &&
                this.$store.getters["app/getAllergenById"](al)
              )
                allergens.push(al);
            });
          }
        });
      }

      var tempAl = [];
      allergens.map((item) => {
        var allergen = this.$store.getters["app/getAllergenById"](item);
        if (allergen == undefined) return;
        tempAl.push(this.$t(allergen.name));
      });

      return tempAl.join(", ");
    },
    user() {
      return this.$store.getters["app/getUserById"](this.item.created_by);
    },
    get_qrcode() {
      var user = this.$store.getters["app/getUserById"](this.item.created_by);
      if (user == undefined) user = "";
      else user = user.name;
      var expire = "";
      if (this.item.forever) expire = "forever";
      else
        expire = this.$options.filters.moment(
          this.item.e_date.toDate(),
          "DD MMMM , YYYY"
        );
      let allergens = this.allergens;

      var txt = "";
      txt += "Name: " + this.item.name;
      txt += "   By: " + user;
      txt += "   Expiry date: " + expire;
      txt +=
        "   Created Date: " +
        this.$options.filters.moment(
          this.item.created_at.toDate(),
          "DD MMMM , YYYY"
        );
      txt += "   Allergens: " + allergens;
      return txt;
    },
  },
  methods: {
    printLabel() {
      var el = document.querySelector("#foodItemPrintSection");
      const options = {
        type: "dataURL",
      };
      html2canvas(el).then((canvas) => {
        var img = canvas.toDataURL("image/png");
        var link = document.createElement("a");
        link.setAttribute("id", "qrcodeGengerator");
        link.download = this.item.name + ".png";
        link.href = img;
        // link.click();
        printJS({
          printable: img,
          type: "image",
          documentTitle: this.item.name,
          imageStyle: 'margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;',
        });
      });

      this.$userflow.track("Print Food Item", {
        name: this.item.name,
        group: JSON.parse(localStorage.getItem("userInfo")).group,
      });

      window.gist.track("Print Food Item", {
        name: this.item.name,
        group: JSON.parse(localStorage.getItem("userInfo")).group,
      });
    },
  },
};
</script>
<style scoped>
.vs-dialog {
  max-width: 600px !important;
}
#foodItemPrintSection {
  /* width: 340px !important; */
  width: 150px !important;
  height: 100px !important;
  margin: auto;
  word-wrap: break-word;
  border: 1px solid black;
}
#foodItemPrintSection > div > h6 {
  font-size: 8px;
}
/* .food-new-area{
        height:  calc(20vh);
    } */
.vx-row {
  margin: 0;
}
</style>
