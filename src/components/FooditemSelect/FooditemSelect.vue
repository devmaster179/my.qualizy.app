<template>
  <div class="vx-auto-suggest">
    <div
      class="flex items-center relative hasIcon"
      :class="{'open':inputFocused , 'close':!inputFocused}"
    >
      <!-- Input -->
      <!-- @keyup.up="increaseIndex(false)"
        @keyup.down="increaseIndex"
      @keyup.enter="suggestionSelected"-->
      <vs-input
        ref="input"
        :class="inputClassses"
        class="z-50"
        v-model="searchQuery"
        @keyup.esc="escPressed"
        @focus="updateInputFocus"
        @blur="updateInputFocus(false)"
      />
    </div>

    <!-- Group List -->
    <ul
      ref="scrollContainer"
      :class="{'hidden': !inputFocused}"
      class="auto-suggest-suggestions-list z-50 rounded-lg mt-2 shadow-lg overflow-x-hidden"
      @mouseenter="insideSuggestions = true"
      @mouseleave="insideSuggestions = false"
      @focus="updateInputFocus"
      @blur="updateInputFocus(false)"
      tabindex="-1"
    >
      <li
        ref="grp_list"
        v-for="(suggestion_list, grp_name, grp_index) in filteredData"
        :key="grp_index"
        class="auto-suggest__suggestion-group-container"
      >
        <!-- Group Header -->
        <p class="auto-suggest__suggestion-group-title pt-3 pb-1 px-4" v-if="!hideGroupTitle">
          <slot name="group" :group_name="grp_name"></slot>
        </p>
        <!-- Suggestion List of each group -->
        <ul>
          <li
            v-for="(suggestion, index) in suggestion_list"
            :key="index"
            class="auto-suggest__suggestion-group__suggestion py-3 px-4 cursor-pointer"
            @click="suggestionSelected(suggestion)"
          >
            <slot :name="grp_name" :suggestion="suggestion"></slot>
          </li>

          <li
            class="auto-suggest__suggestion-group__suggestion py-3 px-4 no-results"
            v-if="!suggestion_list.length"
          >
            <slot name="noResult" :group_name="grp_name">
              <p>No Results Found.</p>
            </slot>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    selectedText: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: "Search.."
    },
    data: {
      type: Object,
      required: true
    },
    initalData: {
      type: Object,
      default: () => new Object()
    },
    inputClassses: {
      type: [String, Object, Array]
    },
    autoFocus: {
      type: Boolean,
      default: false
    },
    showPinned: {
      type: Boolean,
      default: false
    },
    searchLimit: {
      type: Number,
      default: 4
    },
    hideGroupTitle: {
      type: Boolean,
      default: false
    }
  },
  computed: {},
  data() {
    return {
      filteredData: {},
      currentSelected: -1,
      inputFocused: false,
      insideSuggestions: false,
      kkk: false,
      searchQuery: this.selectedText
    };
  },
  watch: {
    inputFocused(val) {
      this.searchQuery = this.selectedText;
    },
    // UPDATE SUGGESTIONS LIST
    searchQuery(val) {
      this.$emit("input", val);

      if (val == "") {
        this.inputInit();
      } else {
        let queried_data = {};
        const data_grps = Object.keys(this.data);

        data_grps.forEach((grp, i) => {
          queried_data[data_grps[i]] = this.filter_grp(this.data[grp]);
        });

        // Check if any of group has at least one queried item
        if (!Object.values(queried_data).some(obj => obj.length)) {
          this.currentSelected = -1;
        }

        this.filteredData = queried_data;
      }
    },
    autoFocus(val) {
      if (val) this.focusInput();
      //   else this.searchQuery = this.selectedText;
    },
    filteredData(val) {
      // Auto Select first item if it's not item-404
      let grp_index = null;

      for (let [index, grp_suggestions] of Object.values(val).entries()) {
        if (grp_suggestions.length) {
          grp_index = index;
          break;
        }
      }

      if (grp_index != null) this.currentSelected = grp_index + ".0";
    }
  },
  methods: {
    escPressed() {
      this.$emit("closeSearchbar");
      //   this.searchQuery = "";
    },
    filter_grp(grp) {
      let exactEle = grp.data.filter(item => {
        return item[grp.key]
          .toLowerCase()
          .startsWith(this.searchQuery.toLowerCase());
      });
      let containEle = grp.data.filter(item => {
        return (
          !item[grp.key]
            .toLowerCase()
            .startsWith(this.searchQuery.toLowerCase()) &&
          item[grp.key].toLowerCase().indexOf(this.searchQuery.toLowerCase()) >
            -1
        );
      });
      return exactEle.concat(containEle).slice(0, this.searchLimit);
    },
    inputInit() {
      if (
        Object.entries(this.initalData).length === 0 &&
        this.initalData.constructor === Object
      ) {
        this.filteredData = {};
      } else {
        this.filteredData = this.initalData;
      }
    },
    updateInputFocus(val = true) {
      if (val) {
        // this.searchQuery = "";
        this.inputInit();
        this.kkk = true;
        if (this.searchQuery == "") this.inputInit();
        setTimeout(() => {
          this.inputFocused = true;
        }, 100);
      } else {
        if (this.insideSuggestions && this.kkk) return;

        setTimeout(() => {
          this.inputFocused = false;
        }, 100);
        this.escPressed();
      }
    },
    suggestionSelected(xxxxxxxxxx) {
      this.kkk = false;
      this.updateInputFocus(false);
      //   this.searchQuery = xxxxxxxxxx.name;

      //   this.$emit("selected", selected_item.id);
    },
    increaseIndex(val = true) {
      const [grp_i, item_i] = this.currentSelected.split(".");

      const grp_arr = Object.entries(this.filteredData);
      const active_grp_total_items = grp_arr[grp_i][1].length;

      if (val) {
        // If active item is not of last item in grp
        if (active_grp_total_items - 1 > item_i) {
          this.currentSelected = grp_i + "." + (Number(item_i) + 1);

          // If active item grp is not last in grp list
        } else if (grp_i < grp_arr.length - 1) {
          this.currentSelected = Number(grp_i) + 1 + ".0";
        }
      } else {
        // If active item is not of first item in grp
        if (Number(item_i)) {
          this.currentSelected = grp_i + "." + (Number(item_i) - 1);

          // If active item grp  is not first in grp list
        } else if (Number(grp_i)) {
          this.currentSelected =
            Number(grp_i) - 1 + "." + (grp_arr[grp_i - 1][1].length - 1);
        }
      }
    },
    focusInput() {
      this.$refs.input.$el.querySelector("input").focus();
    }
  },
  mounted() {
    if (this.autoFocus) this.focusInput();
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/vuesax/components/vxAutoSuggest.scss";
</style>

<style scoped>
.hasIcon::after {
  font-family: "feather" !important;
  font-style: normal;
  font-size: 20px;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1.9;
  content: "\e845";
  position: absolute;
  top: 0px;
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
</style>
