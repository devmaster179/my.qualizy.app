  
<template>
  <transition name="view-upload my-0">
    <div ref="view" class="view-upload" @click="closeView">
      <img :src="src" alt="image" />
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    active: {
      default: false,
      type: Boolean
    },
    src: {
      default: null,
      type: String
    }
  },
  mounted() {
    document.body.insertBefore(this.$refs.view, document.body.firstChild);
  },
  upload() {
    document.body.insertBefore(this.$refs.view, document.body.firstChild);
  },
  methods: {
    closeView(evt) {
      this.$emit("closeImage");
    }
  }
};
</script>
<style>
.con-img-upload .img-upload .btn-upload-file {
  z-index: 2 !important;
}
</style>