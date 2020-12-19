<template>
  <vs-sidebar
    click-not-close
    position-right
    parent="body"
    default-index="1"
    color="primary"
    class="add-new-data-sidebar items-no-padding log-sidebar fooditem-add"
    spacer
    v-model="isSidebarActiveLocal"
  >
    <div class="mt-6 flex items-center justify-between px-6">
      <h4 v-if="!updated">{{$t("add food item") | capitalize}}</h4>
      <h4 v-else-if="duplicateFlag">{{$t("duplicate food item") | capitalize}}</h4>
      <h4 v-else>{{$t("edit food item") | capitalize}}</h4>
      <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>
    <VuePerfectScrollbar class="scroll-area--log-filter pt-4 pb-6 px-4" :settings="settings">
      <div class="fooditem-type mt-4">
        <div
          class="py-2 px-5 inline-block rounded-lg"
          style="background-color: #f5f5fa;  color: #1e1c26;"
        >
          <template v-if="type=='delivered'">
            <vs-icon icon-pack="feather" icon="icon-package" />
            <span class="karla type-text ml-1">{{$t("delivered")}}</span>
          </template>
          <template v-else>
            <div class="flex items-center">
              <vs-icon
                icon="room_service"
                style="font-size: 17px; font-family: 'Material Icons Outlined';"
              ></vs-icon>
              <span class="karla type-text ml-1">{{$t("prepared")}}</span>
            </div>
          </template>
        </div>
      </div>
      <div class="supplier mt-4" v-if="type=='delivered'">
        <p class="field-title">{{$t("supplier")}}</p>
        <supplier :selectedItem="supplier" @chn_supplier="chn_supplier" />
      </div>
      <div class="fooditem-name mt-4">
        <p class="field-title">{{$t('food item name')}}</p>
        <div class="flex items-start justify-between">
          <vue-simple-suggest
            v-if="!updated"
            @select="selectFooditem"
            v-model="fName" 
            :list="fooditems"
            ref="suggestComponent"
            :filter-by-query="true"
            :min-length="3"
             display-attribute="name"
            :styles="autoCompleteStyle"
          >
            <div slot="suggestion-item" slot-scope="scope">
                <div v-html="boldenSuggestion(scope)"></div>
                <div>{{$t('batch number')}}: {{scope.suggestion.batch}}</div>
                <div>{{calcExpire(scope.suggestion)}}</div>
            </div>
          </vue-simple-suggest>
          <vs-input v-else v-model="fName" class="w-full mr-2" :placeholder="$t('food item name')" />
          <span
            class="rounded-lg px-1 pt-3 text-center cursor-pointer download"
            @click="scanEnable=!scanEnable"
          >
            <!-- <vs-icon icon-pack="feather" icon="icon-download" size="16px" /> -->
            <img :src="require('@/assets/images/qr/qr.svg')" />
          </span>
        </div>

        <span class="text-danger text-sm" v-if="error_text!=''">{{error_text}}</span>
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
      <div class="mess vx-row mt-4">
        <div class="vx-col w-full p-0">
          <div class="expiry-date">
            <p class="field-title">{{$t("expiry date")}}</p>
            <div class="no-expiry flex items-center my-3">
              <vs-switch v-model="forever" />
              <span class="ml-2">{{$t("no expiry")}}</span>
            </div>
            <datepicker
              class="w-full"
              v-if="!forever"
              :placeholder="$t('from') | capitalize"
              v-model="e_date"
              :language="languages[$i18n.locale]"
            ></datepicker>
          </div>
        </div>
      </div>
      <div class="batch mt-4" >
        <p class="field-title">{{$t("batch number")}}</p>
        <vs-input v-model="batch" class="w-full" />
      </div>
      <div class="info mt-8">
        <div class="flex items-center justify-center">
          <div class="flex items-center text-primary cursor-pointer" @click="openInfo=!openInfo">
            <p class="karla type-text mr-2">{{$t("add more info")}}</p>
            <vs-icon
              icon="arrow_drop_down"
              size="18px"
              class="collapase-icon"
              :class="{'open':openInfo,'close':!openInfo}"
            />
          </div>
        </div>
        <div class="info-content mt-4" :class="{'open':openInfo,'close':!openInfo}">
          <div class="vx-row w-full">
            <div class="vx-col w-1/2 p-0 pr-2">
              <p class="field-title">{{$t('quantity')}}</p>
              <vs-input v-model="quantity" type="number" min="1" class="w-full" />
            </div>
            <div class="vx-col w-1/2 p-0 pl-2">
              <p class="field-title">{{$t('unit of measure')}}</p>
              <v-select
                :options="['kg' , 'g' ,'lb' , 'oz','cup','pt','q.t','gal','box','pack','pc' , 'litre']"
                v-model="unit"
              />
            </div>
          </div>
          
          <div class="allergens mt-4">
            <p class="field-title mb-3">{{$t("allergens")}}</p>
              <div class="inline-block mt-3" v-for="(allergen,index) in allergens" :key="index" style="min-width: 50%;">
                <vs-checkbox v-model="allergenss" :vs-value="allergen.id">{{$t(allergen.name)}}</vs-checkbox>
              </div>
          </div>
          <div class="note mt-8">
            <p class="field-title">{{$t("note")}}</p>
            <vs-textarea v-model="note" />
          </div>
          <div class="in-fooditem-section" v-if="type!='delivered'" style="padding-bottom:200px;">
            <vs-divider class="mb-0"></vs-divider>

            <p class="karla-bold se-title my-6">{{$t("ingredient")}}</p>
            <div class="in-fooditem">
              <p class="field-title my-6">{{$t("food item name")}}</p>
              <v-select :options="deliveredFooditems" v-model="inFooditems" label="name" />
            </div>
            <div class="mess vx-row mt-4">
              <div class="vx-col w-1/2 p-0 pr-2">
                <p class="field-title">{{$t('quantity')}}</p>
                <vs-input v-model="quantity1" type="number" min="1" class="w-full" />
              </div>
              <div class="vx-col w-1/2 p-0 pl-2">
                <p class="field-title">{{$t('unit of measure')}}</p>

                <v-select
                  :options="['kg' , 'g' ,'lb' , 'oz','cup','pt','q.t','gal','box','pack','pc','litre']"
                  v-model="unit1"
                />
              </div>
            </div>
            <vs-button
              @click="addIng"
              class="karla-bold w-full mt-8"
              type="filled"
              color="rgba(108, 80, 240, 0.1)"
              text-color="#6c50f0"
            >{{$t("add ingredient")}}</vs-button>
            <vs-divider class></vs-divider>
            <div class="ingredients">
              <p class="se-title karla-bold mb-4">{{$t('added ingredients')}}</p>
              <div
                class="ingredient-item flex items-center mb-2 justify-between"
                v-for="(ingredient,iindex) in ingredients"
                :key="iindex"
              >
                <p class="karla-bold w-1/3">{{fooditemInfo(ingredient.id).name}}</p>
                <p class="karla-bold">{{ingredient.quantity}} {{ingredient.unit | capitalize}}</p>
                <vs-icon
                  icon-pack="feather"
                  icon="icon-trash-2"
                  @click="removeIn(ingredient.id)"
                  class="cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </VuePerfectScrollbar>
    <div class="flex flex-wrap items-center justify-center p-6" slot="footer">
      <vs-button
        class="mr-6 karla-bold"
        type="filled"
        color="rgba(108, 80, 240, 0.1)"
        @click="isSidebarActiveLocal=false"
        text-color="#6c50f0"
      >{{$t("cancel")}}</vs-button>
      <vs-button
        class="karla"
        color="#6c50f0"
        @click="addFooditem"
        v-if="duplicateFlag || !updated"
      >{{ $t("add food item") }}</vs-button>
      <vs-button
        v-else
        class="karla"
        color="#6c50f0"
        @click="updateFooditem"
      >{{ $t("update food item") }}</vs-button>
    </div>
  </vs-sidebar>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import VSelect from "vue-select";
import Supplier from "./Supplier";
import Datepicker from "vuejs-datepicker";
import * as lang from "vuejs-datepicker/src/locale";
import { StreamBarcodeReader, ImageBarcodeReader } from "vue-barcode-reader";
import VueSimpleSuggest from 'vue-simple-suggest'
import { db } from "@/firebase/firebaseConfig";
export default {
  props: {
    item: {
      type: Object,
    },
    type: {
      type: String,
      required: true,
    },
    open: {
      type: Boolean,
      default: false,
    },
    duplicateFlag: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    Supplier,
    VuePerfectScrollbar,
    VSelect,
    Datepicker,
    StreamBarcodeReader,
    ImageBarcodeReader,
    VueSimpleSuggest
  },
  data() {
    return {
      autoCompleteStyle: {
        vueSimpleSuggest: "position-absolute mr-2 ",
        inputWrapper: "",
        defaultInput: "p-4 vs-input--input",
        suggestions: "position-absolute list-group z-1000 border border-solid d-theme-border-grey-light border-t-0",
        suggestItem: "list-group-item",
      },
      scanEnable: false,
      ingredients: [],
      inFooditems: null,
      batch: this.generateBath(),
      error_text: "",
      forever: false,
      note: "",
      allergenss: [],
      e_date: new Date(),
      languages: lang,
      openInfo: false,
      unit1: "kg",
      unit: "kg",
      quantity1: 1,
      quantity: 1,
      fName: "",
      supplier: "",
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.6,
      },
    };
  },
  methods: {
    selectFooditem(e) {
      if(e.forever) {
        this.forever = true
      }
      else {
        var now = new Date()
        var created_at = e.created_at.seconds ? e.created_at.toDate(): e.created_at
        var e_date = e.e_date.seconds ? e.e_date.toDate(): e.e_date
        var dayDiff = Math.round((e_date.getTime()-created_at.getTime())/(24*60*60*1000))
        this.e_date = new Date(now.getTime() + dayDiff*24*60*60*1000)
      }
      this.allergenss = e.allergens
      this.batch = e.batch || ''
    },
    boldenSuggestion(scope) {
      if (!scope) return scope;
      const { suggestion, query } = scope;
      let result = this.$refs.suggestComponent.displayProperty(suggestion);
      if (!query) return result;
      const texts = query.split(/[\s-_/\\|.]/gm).filter(t => !!t) || [''];
      return result.replace(new RegExp('(.*?)(' + texts.join('|') + ')(.*?)','gi'), '$1<b>$2</b>$3');
    },
    generateBath() {
      return (
        Math.random()
          .toString(36)
          .replace(/[^a-z]+/g, "")
          .substr(0, 5)
          .toUpperCase() + Math.floor(Math.random() * 100000000)
      );
    },
    onLoaded() {},
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
    onDecode(result) {
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
    removeIn(id) {
      this.ingredients = this.ingredients.filter((item) => item.id !== id);
    },
    addIng() {
      if (this.inFooditems === null) return false;
      if (
        this.ingredients.find((item) => item.id == this.inFooditems) !==
        undefined
      )
        return false;
      this.ingredients.push({
        id: this.inFooditems.id,
        quantity: this.quantity1,
        unit: this.unit1,
      });
      this.inFooditems = null;
      this.unit1 = "Kg";
      this.quantity1 = 1;
    },
    updateFooditem() {
      if (this.fName == "") {
        this.error_text = this.$t("this field is required !");
        return false;
      }
      var cFooditem = this.$store.getters["app/items"].find(
        (item) => item.name == this.fName
      );
      // if (cFooditem !== undefined && cFooditem.id != this.item.id) {
      //   this.error_text = this.$t("the food item is already exist !");
      //   return false;
      // }
      db.collection("fooditems")
        .doc(this.item.id)
        .update({
          type: this.type,
          supplier: this.supplier,
          name: this.fName,
          measure: {
            quantity: this.quantity,
            unit: this.unit,
          },
          ingredients: this.ingredients,
          batch: this.batch,
          e_date: this.e_date,
          forever: this.forever,
          allergens: this.allergenss,
          desc: this.note,
          updated_at: new Date(),
          updated_by: JSON.parse(localStorage.getItem("userInfo")).id,
        });
      this.isSidebarActiveLocal = false;
    },
    addFooditem() {
      if (this.fName == "") {
        this.error_text = this.$t("this field is required !");
        return false;
      }
      // if (
      //   this.$store.getters["app/items"].find(
      //     item => item.name == this.fName
      //   ) !== undefined
      // ) {
      //   this.error_text = this.$t("the food item is already exist !");
      //   return false;
      // }
      db.collection("fooditems").add({
        type: this.type,
        supplier: this.supplier,
        name: this.fName,
        measure: {
          quantity: this.quantity,
          unit: this.unit,
        },
        ingredients: this.ingredients,
        batch: this.batch,
        e_date: this.e_date,
        forever: this.forever,
        allergens: this.allergenss,
        desc: this.note,
        group: JSON.parse(localStorage.getItem("userInfo")).group,
        created_at: new Date(),
        created_by: JSON.parse(localStorage.getItem("userInfo")).id,
        updated_at: new Date(),
        updated_by: JSON.parse(localStorage.getItem("userInfo")).id,
      });

      this.$userflow.track("Create food item" , {
        type: this.type,
        supplier: this.supplier,
        name: this.fName,
        // "expire date": this.e_date,
        forever: this.forever,
        // allergens: this.allergenss,
        group: JSON.parse(localStorage.getItem("userInfo")).group
      })

      window.gist.track("Create food item" , {
        type: this.type,
        supplier: this.supplier,
        name: this.fName,
        // "expire date": this.e_date,
        forever: this.forever,
        // allergens: this.allergenss,
        group: JSON.parse(localStorage.getItem("userInfo")).group
      })

      this.isSidebarActiveLocal = false;
    },
    chn_supplier(val) {
      this.supplier = val;
    },
  },
  computed: {
    calcExpire() {
      return e=> {
        if(e.forever)
          return ''
        var created_at = e.created_at.seconds ? e.created_at.toDate(): e.created_at
        var e_date = e.e_date.seconds ? e.e_date.toDate(): e.e_date
        var dayDiff = Math.round((e_date.getTime()-created_at.getTime())/(24*60*60*1000))
        return `${this.$t('expire in')}: + ${dayDiff} ${this.$t('day(s)')}` ;
      }
    },
    fooditems() {
      return this.$store.getters['app/items']
    },
    isValidCamera() {
      return !(
        navigator &&
        navigator.mediaDevices &&
        "enumerateDevices" in navigator.mediaDevices
      );
    },
    fooditemInfo() {
      return (id) => {
        return this.$store.getters["app/getItemById"](id);
      };
    },
    deliveredFooditems() {
      let fooditems = this.$store.getters["app/items"].filter(
        (item) =>
          item.type !== undefined &&
          item.type == "delivered" &&
          (item.deleted == undefined || !item.deleted)
      );
      return fooditems;
    },
    updated() {
      return this.item.id !== undefined;
    },
    isSidebarActiveLocal: {
      get() {
        return this.open;
      },
      set() {
        this.$emit("close");
      },
    },
    allergens() {
      return this.$store.getters["app/allergens"];
    },
  },
  watch: {
    isSidebarActiveLocal(val) {
      if (val) {
        this.scanEnable = false;
        this.fName = "";
        this.supplier = "";
        this.quantity = 1;
        this.quantity1 = 1;
        this.unit = "kg";
        this.unit1 = "kg";
        this.allergenss = [];
        this.note = "";
        this.error_text = "";
        this.openInfo = false;
        this.forever = false;
        this.batch = this.generateBath();
        this.ingredients = [];

        if (this.updated) {
          this.fName = this.item.name;
          this.supplier = this.item.supplier;
          this.quantity =
            this.item.measure === undefined ? 1 : this.item.measure.quantity;
          this.unit =
            this.item.measure === undefined
              ? "kg"
              : this.item.measure.unit.toLowerCase();
          this.allergenss = this.item.allergens;
          if (!this.duplicateFlag) {
            this.forever = this.item.forever;
            this.e_date = this.item.e_date.toDate();
            this.batch = this.item.batch;
          }

          this.note = this.item.desc;

          if (this.type == "prepared" && this.item.ingredients !== undefined)
            this.ingredients = this.item.ingredients;
        }
      }
    },
  },
};
</script>
<style lang="scss">
@import "@/assets/scss/vuesax/extraComponents/autocomplete.scss";
</style>
<style>
.fooditem-add.log-sidebar .vs-sidebar {
  background: white;
}
</style>
<style lang="scss" scoped>
.add-new-data-sidebar {
  /deep/ .vs-sidebar--background {
    z-index: 52010;
  }

  /deep/ .vs-sidebar {
    z-index: 52010;
    width: 500px;
    max-width: 100vw;
  }
}

.scroll-area--log-filter {
  height: calc(100vh - 11rem);
}
</style>
<style scoped>
.field-title {
  font-size: 14px;
  font-weight: 500;
  opacity: 0.9;
  color: #1e1c26;
}
.type-text {
  font-size: 12px;
}
.download {
  font-size: 20px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  width: 48px;
  height: 48px;
}
.collapase-icon {
  -webkit-transition: all 0.25s ease;
  transition: all 0.25s ease;
}

.collapase-icon.open {
  transform: rotate(180deg);
}
.info-content {
  overflow: hidden;
  -webkit-transition: all 0.25s ease;
  transition: all 2s ease;
}
.info-content.open {
  height: unset;
}
.info-content.close {
  height: 0px;
}
.se-title {
  font-size: 16px;
}
.ingredient-item {
  background: #ebebf1;
  border-radius: 2px;
  padding: 16px;
}
</style>
