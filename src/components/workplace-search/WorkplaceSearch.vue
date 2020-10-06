<template>
  <div
    id="workplace-search"
    class="flex vs-inputx vs-input--input p-2"
    @keypress.enter="enterSelect"
    @keyup.esc="blur"
    @keydown.down="pointerForward"
    @keydown.up="pointerBackward"
  >
    <div class="input-key-value-item ml-4 mt-1" v-for="(item , key) in selectedKey" :key="key">
      <selected-value :item="item" :index="key" @removeFilter="removeFilter" @success="success" />
    </div>
    <div class="txt-input p-2">
      <input
        type="text"
        ref="searchBox"
        class="large pl-2 w-full"
        :placeholder="placeholder"
        v-model="searchText"
        @blur.native="blur"
        @mousedown="focus"
      />
      <ul
        class="search-list"
        v-if="viewSearchList"
        v-closable="{
            exclude: ['searchBox'],
            handler: 'onClose'
            }"
      >
        <li
          class="cursor-pointer"
          @mouseover="selectedIndex=key"
          v-for="(item , key) in searchList"
          :key="key"
          @click.prevent="selectKey(item)"
          :class="{'selected': key===selectedIndex}"
        >{{item.key | capitalize}}</li>
      </ul>
    </div>
    <vs-icon
      icon-pack="feather"
      @click.native="clearSelectedKey"
      class="mt-2"
      :class="selectedKey.length>0?'cursor-pointer':''"
      size="20px"
      :icon="selectedKey.length>0? 'icon-x' : 'icon-search'"
    />
  </div>
</template>

<script>
import Vue from "vue";
import SelectedValue from "./SelectedValue.vue";

export default {
  components: {
    SelectedValue
  },
  props: {
    placeholder: {
      type: String,
      default: "Search..."
    },
    searchList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      selectedIndex: "",
      searchText: "",
      viewSearchList: false,
      selectedKey: []
    };
  },
  methods: {
    onClose() {
      this.viewSearchList = false;
    },
    success() {
      this.$nextTick(() => {
        this.$refs.searchBox.focus();
      });
    },
    enterSelect() {
      if (this.viewSearchList) {
        if (this.selectedIndex !== "") {
          this.selectKey(this.searchList[this.selectedIndex]);
        }
      } else {
        this.viewSearchList = true;
      }
    },
    pointerBackward() {
      if (this.viewSearchList) {
        if (this.selectedIndex === "") this.selectedIndex = 0;
        else {
          this.selectedIndex--;
          if (this.selectedIndex < 0)
            this.selectedIndex = this.searchList.length - 1;
        }
      }
    },
    pointerForward() {
      if (this.viewSearchList) {
        if (this.selectedIndex === "") this.selectedIndex = 0;
        else {
          this.selectedIndex++;
          if (this.selectedIndex > this.searchList.length - 1)
            this.selectedIndex = 0;
        }
      }
    },
    clearSelectedKey() {
      this.selectedKey = [];
    },
    focus(e) {
      this.selectedIndex = "";
      this.viewSearchList = !this.viewSearchList;
    },
    blur() {
      this.viewSearchList = false;
    },
    selectKey(item) {
      if (item.type === "string") {
        this.selectedKey.push({
          item: item,
          operator: "same",
          value: ""
        });
      } else {
        this.selectedKey.push({
          item: item,
          operator: "equal",
          value: ""
        });
      }

      this.viewSearchList = false;
    },
    removeFilter(index) {
      this.selectedKey = this.selectedKey.filter((item, i) => {
        return index !== i;
      });
    }
  }
};
</script>

<style scoped>
#workplace-search {
  -ms-flex-preferred-size: 100%;
  flex-basis: 100%;
  -webkit-box-flex: 1;
  -ms-flex-positive: 1;
  flex-grow: 1;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  padding: 0 2px;
  position: relative;
}
ul.search-list {
  position: absolute;
  z-index: 10;
  width: 200px;
  background: white;
  border-radius: 0.5rem;
  -webkit-box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.1);
  box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.1);
  -webkit-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}
ul.search-list li {
  padding: 10px;
  border-radius: 0.5rem;
}
ul.search-list li.selected {
  background-color: rgba(var(--vs-primary), 1);
  color: aliceblue;
}

.txt-input {
  display: inline-block;
  flex-grow: 1;
  /* max-width: 30%; */
}
.txt-input > input {
  border: none;
  background-color: transparent;
  font-size: 1.2em;
}
.input-key-value-item {
  display: inline-block;
  white-space: nowrap;
}
</style>