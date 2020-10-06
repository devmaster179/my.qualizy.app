module.exports = {
  install(Vue) {
    Vue.mixin({
      data() {
        return {
          done: [],
          undone: [],
          newMutation: true,
        };
      },
      created() {
        if (this.$store === undefined) return
        this.$store.subscribe(mutation => {
          if (mutation.type === 'app/CHN_TEMP_TEMPLATE') {
            this.done.push(mutation)
          }
          if (this.newMutation) {
            this.undone = [];
          }
        });
      },
      methods: {
        redo() {
          if (!this.canRedo) return
          let commit = this.undone.pop();
          this.newMutation = false;
          this.$store.commit(`${commit.type}`, commit.payload);
          this.newMutation = true;
        },
        undo() {
          if (!this.canUndo) return
          this.undone.push(this.done.pop());
          this.newMutation = false;
          let initData = this.$store.getters["app/getTempTemplate1"]
          this.$store.commit("app/SET_TEMPTEMPLATE", JSON.stringify(initData))
          this.done.forEach(mutation => {
            this.$store.commit(`${mutation.type}`, mutation.payload);
            this.done.pop();
          });
          this.newMutation = true;
        }
      },
      computed: {
        canRedo() {
          return this.undone.length > 0;
        },
        canUndo() {
          return this.done.length > 0;
        }
      },
    });
  },
}