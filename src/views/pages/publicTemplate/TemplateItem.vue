
<template>
  <vx-card class="mb-4 grid-view-item overflow-hidden relative">
    <template slot="no-body">
      <!-- ITEM IMAGE -->
      <div class="item-img-container bg-white flex mt-base items-center justify-center">
        <img :src="require(`@/assets/images/template_image/${item.content.templateImage}`)" width="130px"/>
      </div>
      <div class="item-details px-4 md:pt-base pt-0">
        <!-- TITLE & DESCRIPTION -->
        <div class="sm:my-2">
          <h6 class="truncate font-semibold mb-1">{{ item.content.templateTitle | capitalize }}</h6>
          <p class="item-description truncate text-sm mb-1">{{ item.content.templateComment }}</p>
        </div>
        <div class="mt-2 mb-4" style="min-height:30px;">
          <div
            class="inline-block label-item rounded-lg mr-2 mt-3"
            v-for="(label,index) in item.content.templateLabel"
            :key="index"
            :class="{'hidden': !labelInfo(label).color}"
          >
            <template v-if="labelInfo(label).color">
              <div
                class="w-2 h-2 rounded-full mr-2 inline-block"
                :style="`background:${labelInfo(label).color}`"
              ></div>
              <span class="karla text-sm">{{labelInfo(label).name | capitalize}}</span>
            </template>
          </div>
        </div>
      </div>

      <!-- SLOT: ACTION BUTTONS -->
      <slot name="action-buttons" />
    </template>
  </vx-card>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  computed: {
    labelInfo() {
      return (id) => {
        let label = this.$store.getters["app/getLabelById"](id);
        if (label) return label;
        else
          return {
            name: "",
            color: "",
          };
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.grid-view-item {
  .grid-view-img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    transition: 0.35s;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.25);

    .grid-view-img {
      opacity: 0.9;
    }
  }
  .label-item {
    background: #ebebf1;
    padding: 3px 10px;
  }
}
</style>