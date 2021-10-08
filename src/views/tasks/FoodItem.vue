<template>
  <div class="flex items-center justify-between">
    <div class="vx-auto-suggest w-full py-2">
      <div
        class="flex items-center relative hasIcon"
        :class="{'open':inputFocused , 'close':!inputFocused}"
      >
        <vs-input
          class="w-full"
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
                  class="auto-suggest__suggestion-group__suggestion py-1 px-4 cursor-pointer"
                  @click="select(suggestion_list)"
                >
                  <div class="fooditem p-4" :class="{'active': selectedItem == suggestion_list.id}">
                    <p class="karla item-name">{{suggestion_list.name}}</p>
                    <!-- <div class="flex items-center justify-between"> -->
                    <div>
                      <span class="karla batch">{{$t("batch")}}:</span>
                      <span class="karla batch-number ml-2">{{suggestion_list.batch}}</span>
                    </div>
                    <div class>
                      <span class="karla batch">{{$t("expiry date") | capitalize}}:</span>
                      <span class="karla batch-number ml-2">{{expireDate(suggestion_list)}}</span>
                    </div>
                  </div>
                  <!-- </div> -->
                </li>
              </VuePerfectScrollbar>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <div class="qr-section flex items-center cursor-pointer">
      <img :src="require('../../assets/images/qr/qr.svg')" class="mx-auto" />
    </div>
  </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
export default {
  data() {
    return {
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
    },
    p: {
      type: Number,
      default: 0
    },
    q: {
      type: Number,
      default: 0
    },
    a: {
      type: Number,
      default: 0
    }
  },
  components: { VuePerfectScrollbar },
  computed: {
    selectedText() {
      let items = this.$store.getters["app/items"];
      var food_item = items.find(item => {
        return (
          (item.discard !== undefined || !item.discard) &&
          item.id == this.selectedItem
        );
      });
      if (food_item === undefined) return "";
      return food_item.name;
    },
    expireDate() {
      return item => {
        if (item.forever !== undefined && item.forever) return "No expiry date";
        if (item.e_date.seconds === undefined)
          return this.$moment(item.e_date).format("MM/DD/YYYY");
        return this.$moment(item.e_date.toDate()).format("MM/DD/YYYY");
      };
    },
    filteredData() {
      let items = this.$store.getters["app/items"];
      let _items = [];
      items.map(item => {
        let expired = true;
        expired = (item.e_date.seconds * 1000 < (new Date()).getTime()) && !item.forever;
        if (item.discard || item.deleted === true || expired) return;
        _items.push(item);
      });
      if (this.searchQuery == "" || this.searchQuery == this.selectedText)
        return _items;
      else {
        return _items.filter(
          item =>
            item.name.toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1
        );
      }
    }
  },
  methods: {
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
      this.inputFocused = false;
      if (this.selectedItem != item.id)
        this.$emit("chnItem", item.id, this.p, this.q, this.a, true, true);
    }
  },
  watch: {
    selectedItem(val) {
      this.searchQuery = this.selectedText;
    }
  },
  created() {
    this.searchQuery = this.selectedText;
  }
};
</script>

<style scoped>
.item-area {
  max-height: 300px;
}
.hasIcon::after {
  z-index: 40;
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
.fooditem {
  border-radius: 8px;
  background-color: #f5f5fa;
}
.fooditem.active {
  color: white;
  background-color: rgba(var(--vs-primary), 1);
}
.fooditem.active * {
  color: white !important;
}
.fooditem:hover {
  background-color: rgba(var(--vs-primary), 0.5);
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
  width: 48px;
  height: 48px;
  border-radius: 4px;
  border: solid 1px #ceced0;
}
</style>