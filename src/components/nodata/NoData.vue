<template>
  <div class="flex w-full bg-img" style="height:calc(90vh - 100px);">
    <div
      class="vx-col flex items-center justify-center flex-col sm:w-1/2 md:w-3/5 lg:w-3/4 xl:w-1/2 mx-auto text-center"
    >
      <img
        :src="require(`@/assets/images/pages/rocket.png`)"
        alt="graphic-not-authorized"
        class="mx-auto mb-4"
        width="200px;"
      />
      <h1 class="sm:mx-0 mx-4 sm:mb-12 mb-8 text-5xl d-theme-heading-color my-text-color">No Data!</h1>
    </div>
  </div>
</template>

<style scoped>
.my-text-color {
  color: #f35626;
  background-image: linear-gradient(92deg, #f35626 0%, #feab3a 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: hue 10s infinite linear;
}
@-webkit-keyframes hue {
  from {
    -webkit-filter: hue-rotate(0deg);
  }

  to {
    -webkit-filter: hue-rotate(-360deg);
  }
}
</style>