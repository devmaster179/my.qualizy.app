<template>
  <div class="score-component flex items-end pb-3">
    <p class="karla score-text pb-2 hidden md:block">Bad</p>

    <div class="score-item cursor-pointer mx-2" v-for="value in 5" :key="value" @click="val=value">
      <p class="karla text-center" :class="{'font-bold':score==value}">{{value}}</p>
      <div class="item" :class="{'active':score==value}"></div>
    </div>
    <p class="karla score-text pb-2 hidden md:block">Good</p>
  </div>
</template>
<script>
export default {
  props: {
    a: {
      type: Number,
      default: 0
    },
    p: {
      type: Number,
      default: 0
    },
    q: {
      type: Number,
      default: 0
    },
    score: {
      type: Number,
      default: 0
    }
  },
  computed: {
    val: {
      get() {
        return this.value;
      },
      set(kkk) {
        this.$emit("input", kkk, this.p, this.q, this.a);
      }
    }
  }
};
</script>
<style scoped>
.score-component div.item.active {
  border-radius: 50%;
  background-color: rgba(var(--vs-primary), 1);
  border: 4px solid #fff;
  box-shadow: 0 0 0 1.5px rgba(var(--vs-primary), 1);
}
.score-component div.item {
  -webkit-transition: all 0.25s ease;
  transition: all 0.25s ease;
  margin: 5px;
  margin-top: 0px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  box-shadow: 0 0 0 1.5px;
}
.score-text {
  font-size: 12px;
  color: #86848a;
}
.score-item:hover {
  color: rgba(var(--vs-primary), 1);
}
</style>