<template>
  <div class="flex w-full bg-img" id="no-auth">
    <div
      class="vx-col flex items-center justify-center flex-col sm:w-1/2 md:w-3/5 lg:w-3/4 xl:w-1/2 mx-auto text-center"
    >
      <img
        src="@/assets/images/pages/not-authorized.png"
        alt="graphic-not-authorized"
        class="mx-auto mb-4"
      />
      <h1
        class="sm:mx-0 mx-4 sm:mb-12 mb-8 text-5xl d-theme-heading-color"
      >{{$t("you are not authorized")}}!</h1>
      <p
        class="sm:mx-0 mx-4 sm:mb-12 mb-8 d-theme-text-inverse"
      >{{$t("you have no authorization for this page. please contact your admin.")}}</p>
    </div>
  </div>
</template>

<style scoped>
#no-auth {
  height: calc(100vh - 12rem);
}
</style>