<!-- =========================================================================================
    File Name: TheFooter.vue
    Description: Footer component
    Component Name: TheFooter
    ----------------------------------------------------------------------------------------
    Item Name: Vuesax Admin - VueJS Dashboard Admin Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template functional>
  <footer class="the-footer py-2 flex-wrap justify-between" :class="classes">
    <div class="flex">
      <span>COPYRIGHT @ {{ new Date().getFullYear() }} Qualizy</span>
      <span class="hidden sm:block">, All rights Reserved</span>
    </div>
    <span class="md:flex hidden items-center">
      <span>Made with</span>
      <feather-icon
        icon="HeartIcon"
        svgClasses="stroke-current text-danger w-6 h-6"
        class="ml-2 mr-2"
      />
      <span>For better food safety and traceability</span>
    </span>
  </footer>
</template>

<script>
export default {
  props: {
    classes: {
      type: String,
    },
  },
};
</script>
