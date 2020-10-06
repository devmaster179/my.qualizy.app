<template>
  <div>
    <div v-if="editable" ref="inputBox" v-closable="{exclude: ['inputBox'],handler: 'onClose'}" class="flex border rounded" @keyup.esc="commit">
      <span class="p-1 text-primary">{{item.item.key|capitalize}}</span>
      <select v-model="item.operator" class="p-1 text-primary" style="max-width:80px;">
        <option
          :value="operator"
          v-for="(operator,key) in operators"
          :key="key"
        >{{operator | capitalize}}</option>
      </select>
      <input
        @keypress.enter.stop.self="keyEnter"
        ref="textSearch"
        type="text"
        v-model="item.value"
        :placeholder="(item.item.key)+'...'"
        class="p-1 text-primary"
        style="max-width: 80px;"
      />
      <vs-icon class="cursor-pointer mt-2" icon="close" @click.native="commit" />
    </div>
    <div v-else class="no-boder">
      <div
        @click="reKey"
        class="flex justify-between cursor-pointer p-1 pl-3 rounded-lg"
        style="background: rgb(36, 193, 160); color: rgba(255, 255, 255, 0.9);"
      >
        <span
          class="flex items-center"
        >{{item.item.key | capitalize}} {{item.operator | capitalize}} {{item.value | truncate(7)}}</span>
        <span class="flex items-center ml-2">
          <vs-icon
            class="cursor-pointer"
            @click.native.stop="commit"
            icon="close"
            size="small"
            bg="#137b65"
            round
          ></vs-icon>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object
    },
    index: {
      type: Number
    }
  },

  data() {
    return {
      falg: false,
      editable: true,
      operators: []
    };
  },
  created() {
    this.$nextTick(() => {
      this.$refs.textSearch.focus();
    });
    if (this.item.item.type === "string") this.operators = ["same", "contain"];
    else this.operators = ["equal", "not equal", "greater", "less"];
  },
  methods: {
    commit() {
      this.$emit("removeFilter", this.index);
    },
    blur(e) {
      this.editable = false;
      if (this.item.value === "") this.commit();
      else this.$emit("success");
    },
    keyEnter() {
      this.blur();
    },
    reKey() {
      this.editable = true;
      this.$nextTick(() => {
        this.$refs.textSearch.focus();
      });
    },
    onClose() {
      if(this.falg){
        if(this.editable)
          this.keyEnter()
      }
      else{
        this.falg = true
      }
    }
  }
};
</script>

<style scoped>
select,
input {
  border: none;
  background: transparent;
}
.border {
  border: 1px solid blue;
}
</style>