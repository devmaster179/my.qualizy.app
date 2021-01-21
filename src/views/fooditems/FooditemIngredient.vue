<template>
  <vs-sidebar
    click-not-close
    position-right
    parent="body"
    default-index="1"
    color="primary"
    class="add-new-data-sidebar items-no-padding"
    spacer
    v-model="isSidebarActiveLocal"
  >
    <div class="mt-6 flex items-center justify-between px-6">
      <h4>{{$t("ingredient") | capitalize}}</h4>
      <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>
    <VuePerfectScrollbar class="scroll-area--log-filter pt-4 pb-6 px-4" :settings="settings">
      <div class="ind-content">
        <div
          class="ingredient-item flex items-center mb-2 justify-between"
          v-for="(ingredient,i) in ingredients"
          :key="i"
        >
          <template v-if="fooditemInfo(ingredient.id) !== undefined"></template>
          <p class="karla-bold">{{fooditemInfo(ingredient.id).name}}</p>
          <p class="karla-bold">{{ingredient.quantity}} {{ingredient.unit | capitalize}}</p>
        </div>
      </div>
    </VuePerfectScrollbar>
  </vs-sidebar>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
  components: {
    VuePerfectScrollbar
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object
    }
  },
  data() {
    return {
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.6
      }
    };
  },
  computed: {
    fooditemInfo() {
      return id => {
        return this.$store.getters["app/getItemById"](id);
      };
    },
    ingredients() {
      if (this.item.ingredients === undefined) return [];
      return this.item.ingredients;
    },
    isSidebarActiveLocal: {
      get() {
        return this.open;
      },
      set() {
        this.$emit("close");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.add-new-data-sidebar {
  ::v-deep .vs-sidebar--background {
    z-index: 52010;
  }

  ::v-deep .vs-sidebar {
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
.ingredient-item {
  background: #ebebf1;
  border-radius: 2px;
  padding: 16px;
}
</style>

