<template>
  <label class="text-reader text-primary underline">
    <vs-icon icon-pack="feather" icon="icon-file" />
    {{$t("Import CSV")}}
    <input type="file" @change="loadTextFromFile" />
  </label>
</template>

<script>
export default {
  methods: {
    loadTextFromFile(ev) {
      const file = ev.target.files[0];
      var extension = ev.target.files[0].name.split(".").pop().toLowerCase();
      if (extension !== "csv") {
        this.$vs.notify({
          title: "Failed",
          text: "File type is not CSV",
          iconPack: "feather",
          icon: "icon-alert-circle",
          color: "warning",
        });
        return false;
      }
      const reader = new FileReader();

      reader.onload = this.fileLoad;
      reader.readAsText(file);
    },
    fileLoad(e) {
      var temp = [];
      let csv = e.target.result;
      let allLines = csv.split(/\r\n|\n/);
      this.$emit("load", allLines);
    },
  },
};
</script>

<style scoped>
.text-reader {
  position: relative;
  overflow: hidden;
  display: inline-block;

  /* Fancy button style 😎 */
  /* border: 2px solid black;
  border-radius: 5px; */
  font-size: 1.3em;
  font-weight: 500;
  /* padding: 8px 12px; */
  cursor: pointer;
}
.text-reader input {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  opacity: 0;
}
</style>