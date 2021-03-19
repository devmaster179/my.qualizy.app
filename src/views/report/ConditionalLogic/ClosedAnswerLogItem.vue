<template></template>

<script>
export default {
  props: {
    parentAnswer: {
      required: true,
    },
  },
  computed: {
    getType() {
      return (id) => {
        var type = this.$store.getters["app/getTemplateTypeById"](id);
        return type;
      };
    },
  },
};
</script>

<style>
</style>