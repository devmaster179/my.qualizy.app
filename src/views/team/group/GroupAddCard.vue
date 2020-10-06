<template>
  <vx-card class="cursor-pointer">
    <div class="h-100 w-center h-bottom">
      <vs-icon
        icon-pack="feather"
        icon="icon-plus"
        class="border border-solid rounded-full b-3"
        size="100px"
        color="primary"
      />
    </div>
    <div class="h-100 w-center h-top">
      <h4 class="pt-5 text-primary">{{$t("Add new a group")}}</h4>
    </div>
  </vx-card>
</template>

<style scoped>
.h-100 {
  min-height: 242px;
  display: flex;
}
.w-center {
  justify-content: center;
}
.h-bottom {
  align-items: flex-end;
}
.h-top {
  align-items: flex-start;
}
.border.b-3 {
  border-width: 2px !important;
}
</style>