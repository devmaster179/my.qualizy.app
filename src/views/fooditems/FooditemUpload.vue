<template>
  <vs-prompt
    :title="$t('bulk upload') | capitalize"
    :accept-text="$t('done') | capitalize"
    :cancel-text="$t('cancel') | capitalize"
    button-cancel="border"
    @accept="upload"
    :is-valid="validate"
    :active.sync="activePrompt"
  >
    <import-excel :onSuccess="loadDataInTable" v-if="results.length==0" />
    <VuePerfectScrollbar class="scroll-area-add-fooditems mt-4 pb-6 px-4" :settings="settings">
      <div class="imported-items px-2 mt-4" v-if="results.length>0">
        <p class="added-text karla-bold mb-4">{{$t("food items to be added")}}:</p>
        <div
          class="imported-item flex items-center justify-between p-3 my-3 rounded-lg"
          :class="{'danger':checkItem(item['Food item'],index).error}"
          v-for="(item,index) in results"
          :key="index"
        >
          <div class="fooditem-name">
            <p class="karla-bold">{{item["Food item"]}}</p>
            <span
              class="text-danger text-sm"
              v-if="checkItem(item['Food item'],index).error"
            >{{checkItem(item['Food item'],index).text}}</span>
          </div>
          <div class="tools">
            <vs-icon
              icon-pack="feather"
              icon="icon-trash-2"
              class="cursor-pointer"
              @click="removeItem(index)"
            />
          </div>
        </div>
      </div>
    </VuePerfectScrollbar>
  </vs-prompt>
</template>

<script>
import ImportExcel from "@/components/excel/ImportExcel";
import VuePerfectScrollbar from "vue-perfect-scrollbar";

import { db } from "@/firebase/firebaseConfig";
export default {
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  components: {
    ImportExcel,
    VuePerfectScrollbar
  },
  data() {
    return {
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.6
      },
      header: [],
      results: []
    };
  },
  watch: {
    activePrompt(val) {
      if (val) {
        this.results = [];
      }
    }
  },
  computed: {
    checkItem() {
      return (name, index) => {
        if (name == "" || name === undefined)
          return {
            error: true,
            text: this.$t("this field is required !")
          };
        if (
          this.$store.getters["app/items"].find(
            item =>
              item.name.toLowerCase() == name.toLowerCase() &&
              (item.deleted === undefined || !item.deleted)
          ) !== undefined
        ) {
          return {
            error: true,
            text: this.$t("the food item is already exist !")
          };
        }
        if (
          this.results.find((item, i) => {
            return (
              i < index &&
              item["Food item"] !== undefined &&
              item["Food item"].toLowerCase() == name.toLowerCase()
            );
          }) !== undefined
        )
          return {
            error: true,
            text: this.$t("this food item is already exist in this file !")
          };

        return {
          error: false,
          text: ""
        };
      };
    },
    activePrompt: {
      get() {
        return this.open;
      },
      set() {
        this.$emit("close");
      }
    },
    validate() {
      return true;
    }
  },
  methods: {
    removeItem(i) {
      this.results = this.results.filter((item, index) => i != index);
    },
    loadDataInTable({ results, header, meta }) {
      this.header = header;
      this.results = results;
    },
    getSupplierID(supplier) {
      return new Promise((resolve, reject) => {
        var id = "";
        db.collection("suppliers")
          .where(
            "group",
            "==",
            JSON.parse(localStorage.getItem("userInfo")).group
          )
          .onSnapshot({ includeMetadataChanges: true }, snapshot => {
            snapshot.docChanges().forEach(change => {
              if (change.type === "added") {
                if (change.doc.data().name == supplier) {
                  id = change.doc.id;
                  resolve(id);
                }
              }
            });
          });
      });
    },
    async upload() {
      this.results.map(async (item, index) => {
        if (this.checkItem(item["Food item"], index).error) return;
        var supplier = item.Supplier === undefined ? "" : item.Supplier;
        if (supplier != "") {
          let supp = this.$store.getters["app/suppliers"].find(
            sup => sup.name.toLowerCase() == supplier.toLowerCase()
          );
          if (supp !== undefined) supplier = supp.id;
          else {
            this.$vs.loading();
            var date = new Date();
            db.collection("suppliers").add({
              name: supplier,
              group: JSON.parse(localStorage.getItem("userInfo")).group,
              created_at: date,
              created_by: JSON.parse(localStorage.getItem("userInfo")).id,
              updated_at: date,
              updated_by: JSON.parse(localStorage.getItem("userInfo")).id
            });
            supplier = await this.getSupplierID(supplier);
            this.$vs.loading.close();
          }
        }
        var allergens =
          item.Allergens === undefined ? [] : item.Allergens.split(",");
        var allergens1 = [];
        allergens.map(allergen => {
          var all = this.$store.getters["app/allergens"].find(
            a => a.name.toLowerCase() == allergen.toLowerCase()
          );
          if (all !== undefined) allergens1.push(all.id);
        });
        var quantity = item.Quantity === undefined ? "" : item.Quantity;
        var unit = item.Unit === undefined ? "" : item.Unit.toLowerCase();
        if (unit == "kg") unit = "Kg";
        var desc = item.Description === undefined ? "" : item.Description;
        var batch =
          item["Batch number"] === undefined ? "" : item["Batch number"];
        var e_date =
          item["Expire date"] === undefined ? "" : item["Expire date"];
        if (isNaN(new Date(e_date).getTime())) e_date = "";
        else e_date = new Date(e_date);
        var forever = false;
        if (item.Forever !== undefined && item.Forever == 1) forever = true;

        db.collection("fooditems").add({
          name: item["Food item"],
          allergens: allergens1,
          batch: batch,
          desc: desc,
          e_date: e_date,
          forever: forever,
          supplier: supplier,
          type: "delivered",
          measure: {
            unit: unit,
            quantity: quantity
          },
          created_at: new Date(),
          updated_at: new Date(),
          created_by: JSON.parse(localStorage.getItem("userInfo")).id,
          updated_by: JSON.parse(localStorage.getItem("userInfo")).id,
          group: JSON.parse(localStorage.getItem("userInfo")).group
        });
      });
    }
  }
};
</script>

<style scoped>
.imported-item {
  background: #f5f5fa;
}
.imported-item.danger {
  background: #ff00001a;
}
.scroll-area-add-fooditems {
  max-height: calc(100vh - 30rem);
}
</style>