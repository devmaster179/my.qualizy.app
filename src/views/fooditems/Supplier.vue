<template>
  <div class="flex items-center justify-between">
    <div class="vx-auto-suggest w-full py-2">
      <div
        class="flex items-center relative hasIcon"
        :class="{'open':inputFocused , 'close':!inputFocused}"
      >
        <vs-input
          class="z-50 w-full"
          v-model="searchQuery"
          @focus="updateInputFocus"
          @blur="updateInputFocus(false)"
        />

        <ul
          ref="scrollContainer"
          :class="{'hidden': !inputFocused}"
          class="auto-suggest-suggestions-list z-50 rounded-lg mt-2 shadow-lg overflow-x-hidden py-2"
          style="top:43px;"
          @mouseenter="insideSuggestions = true"
          @mouseleave="insideSuggestions = false"
          @focus="updateInputFocus"
          @blur="updateInputFocus(false)"
          tabindex="-1"
        >
          <li ref="grp_list" class="auto-suggest__suggestion-group-container">
            <ul>
              <VuePerfectScrollbar class="item-area" :settings="settings" ref="pageLists">
                <li
                  v-for="(suggestion_list, grp_index) in filteredData"
                  :key="grp_index"
                  class="auto-suggest__suggestion-group__suggestion px-4 cursor-pointer"
                  @click="select(suggestion_list)"
                >
                  <div class="supplier px-4 py-2 vx-row">
                    <div class="vx-col w-1/12 p-0">
                      <vs-icon
                        v-if="selectedItem == suggestion_list.id"
                        icon-pack="feather"
                        icon="icon-check"
                        class="text-primary mr-2"
                      ></vs-icon>
                    </div>
                    <div class="vx-col w-11/12 p-0">
                      <p class="karla item-name">{{suggestion_list.name}}</p>
                    </div>
                  </div>
                </li>
              </VuePerfectScrollbar>
              <li
                @click="newSupplier='',error=false,errorText='',newSupplierView=true"
                v-if="!newSupplierView"
                class="mt-4 underline text-primary karla pl-base ml-base cursor-pointer"
              >{{$t('add new supplier')}}</li>
              <li class="mt-4 pl-5" v-else>
                <div class="flex items-center">
                  <vs-input v-model="newSupplier" class="w-1/2" :placeholder="$t('supplier name')" />
                  <vs-button @click="addSupplier" class="kalar ml-2">{{$t("save") | capitalize}}</vs-button>
                  <vs-button
                    color="rgba(108, 80, 240, 0.1)"
                    text-color="rgba(108, 80, 240)"
                    class="kalar ml-2"
                    @click="newSupplierView=false"
                  >{{$t("cancel") | capitalize}}</vs-button>
                </div>
                <span class="text-danger text-sm" v-if="error">{{errorText}}</span>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { db } from "@/firebase/firebaseConfig.js";

export default {
  data() {
    return {
      error: false,
      newSupplierView: false,
      newSupplier: "",
      inputFocused: false,
      insideSuggestions: false,
      searchQuery: "",
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.5
      }
    };
  },
  props: {
    selectedItem: {
      type: String,
      default: ""
    }
  },
  components: { VuePerfectScrollbar },
  computed: {
    selectedText() {
      let items = this.$store.getters["app/suppliers"];
      var supplier = items.find(item => {
        return item.id == this.selectedItem;
      });
      if (supplier === undefined) return "";
      return supplier.name;
    },
    filteredData() {
      let items = this.$store.getters["app/suppliers"];
      if (this.searchQuery == "" || this.searchQuery == this.selectedText)
        return items;
      else {
        return items.filter(
          item =>
            item.name.toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1
        );
      }
    }
  },
  methods: {
    addSupplier() {
      if (this.newSupplier == "") {
        this.error = true;
        this.errorText = this.$t("this field is required !");
      } else {
        if (
          this.$store.getters["app/suppliers"].find(
            item => item.name.toLowerCase() == this.newSupplier
          ) !== undefined
        ) {
          this.error = true;
          this.errorText = this.$t("the supplier is already exist !");
        } else {
          db.collection("suppliers").add({
            name: this.newSupplier,
            group: JSON.parse(localStorage.getItem("userInfo")).group,
            created_at: new Date(),
            updated_at: new Date(),
            created_by: JSON.parse(localStorage.getItem("userInfo")).id,
            updated_by: JSON.parse(localStorage.getItem("userInfo")).id
          });
          this.newSupplier = "";
          this.newSupplierView = false;
        }
      }
    },
    updateInputFocus(val = true) {
      if (val) {
        setTimeout(() => {
          this.inputFocused = true;
        }, 100);
      } else {
        if (this.insideSuggestions) return;
        setTimeout(() => {
          this.inputFocused = false;
        }, 100);
        this.searchQuery = this.selectedText;
      }
    },
    select(item) {
      this.searchQuery = item.name;
      this.insideSuggestions = false;
      this.updateInputFocus(false);
      this.$emit("chn_supplier", item.id);
    }
  },
  watch: {
    inputFocused(val) {
      if (val) {
        this.newSupplierView = false;
      }
    },
    selectedItem(val) {
      this.searchQuery = this.selectedText;
    }
  },
  mounted() {
    this.searchQuery = this.selectedText;
  }
};
</script>

<style scoped>
.item-area {
  max-height: 300px;
}
.hasIcon::after {
  z-index: 100;
  font-family: "feather" !important;
  font-style: normal;
  font-size: 20px;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1.9;
  content: "\e842";
  position: absolute;
  top: 5px;
  right: 10px;
  -webkit-transition: all 0.25s ease;
  transition: all 0.25s ease;
}
.hasIcon.open::after {
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg);
}
.hasIcon.close::after {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
}
.supplier {
  border-radius: 2px;
}
.supplier.active {
  color: white;
}
.supplier.active * {
}
.supplier:hover {
  background: #8364ff2e;
}
.item-name {
  font-size: 14px;
  color: #1e1c26;
}
.batch {
  font-size: 12px;
  color: #1e1c26;
  opacity: 0.54;
}
.batch-number {
  font-size: 12px;
  color: #1e1c26;
}
.qr-section {
  margin-left: 5px;
  width: 2.7rem;
  height: 2.7rem;
  border-radius: 4px;
  border: solid 1px #ceced0;
}
</style>