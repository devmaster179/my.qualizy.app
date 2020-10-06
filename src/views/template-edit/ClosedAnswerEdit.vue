<template>
  <vs-sidebar
    click-not-close
    position-right
    parent="body"
    default-index="1"
    color="primary"
    class="closed-answer-edit items-no-padding"
    spacer
    v-model="isSidebarActiveLocal"
  >
    <div class="mt-6 flex items-center justify-between px-6">
      <h4>{{title}}</h4>
      <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>
    <div class="p-4">
      <div class="sample-text my-4">
        <p class="karla-bold">{{$t("e.g.Yes,No,N/A")}}</p>
      </div>
      <Container
        @drop="onColumnDrop($event)"
        drag-handle-selector=".column-drag-handle"
        @drag-start="dragStart"
        :drop-placeholder="upperDropPlaceholderOptions"
        drag-class="card-ghost"
        drop-class="card-ghost-drop"
        group-name="col"
      >
        <Draggable v-for="(item,index) in editCloseAnswer" :key="index">
          <div class="answer-content flex p-2">
            <img
              :src="require('@/assets/images/dnd/2.svg')"
              class="column-drag-handle mt-3"
              height="24px"
              width="24px"
            />
            <closed-answer-item :content="item" :index="index" @click="acitveIndex=index" />
          </div>
        </Draggable>
      </Container>
      <p
        class="add-text cursor-pointer underline karla-bold m-6"
        @click="addResponse"
      >+{{$t("add response")}}</p>
      <div class="save-actions">
        <div class="flex justify-end items-center">
          <vs-button
            @click="isSidebarActiveLocal=false"
            color="rgba(108, 80, 240, 0.1)"
            text-color="rgba(108, 80, 240)"
            class="kalar ml-2 mr-4"
          >{{$t("cancel")}}</vs-button>
          <!-- @click="$router.push( { name:'category' , params:{id:item.id} } ).catch(err => {})" -->

          <vs-button
            @click="saveClosedAnswer"
            class="kalar ml-2 mr-4"
            :disabled="editCloseAnswer.length==0"
          >{{$t("save & apply")}}</vs-button>
        </div>
      </div>
    </div>
  </vs-sidebar>
</template>

<script>
import { Container, Draggable } from "vue-smooth-dnd";
import ClosedAnswerItem from "./ClosedAnswerItem";
import { db } from "@/firebase/firebaseConfig";
export default {
  props: {
    open: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ""
    }
  },
  components: {
    Container,
    Draggable,
    ClosedAnswerItem
  },
  data() {
    return {
      upperDropPlaceholderOptions: {
        className: "drop-preview",
        animationDuration: "150",
        showOnTop: true
      },
      closedAnswer: [],
      acitveIndex: 1
    };
  },
  computed: {
    editCloseAnswer: {
      get() {
        return this.$store.getters["app/tempClosedAnswer"];
      },
      set(val) {
        this.$store.dispatch("app/chnTempClosedAnswer", val);
      }
    },
    title() {
      return this.id != ""
        ? this.$t("edit closed answer")
        : this.$t("new closed answer");
    },
    isSidebarActiveLocal: {
      get() {
        return this.open;
      },
      set() {
        this.$emit("close");
      }
    }
  },
  methods: {
    getCreatedID(created_at) {
      return new Promise(resolve => {
        var date;
        var id = "";
        db.collection("template_type")
          .where(
            "group",
            "==",
            JSON.parse(localStorage.getItem("userInfo")).group
          )
          .onSnapshot({ includeMetadataChanges: true }, snapshot => {
            snapshot.docChanges().forEach(change => {
              if (change.type === "added") {
                date =
                  change.doc.data().updated_at.seconds === undefined
                    ? change.doc.data().updated_at
                    : change.doc.data().updated_at.toDate();
                if (date.getTime() == created_at.getTime()) id = change.doc.id;
              }
            });
            if (id != "") resolve(id);
          });
      });
    },
    async saveClosedAnswer() {
      let content = this.$store.getters["app/tempClosedAnswer"];
      var date = new Date();
      if (this.id == "") {
        db.collection("template_type").add({
          content: content,
          created_by: JSON.parse(localStorage.getItem("userInfo")).id,
          updated_by: JSON.parse(localStorage.getItem("userInfo")).id,
          group: JSON.parse(localStorage.getItem("userInfo")).group,
          created_at: date,
          updated_at: date,
          type: "closed answers"
        });
        var createdID = await this.getCreatedID(date);
        this.$emit("apply", createdID);
      } else {
        db.collection("template_type")
          .doc(this.id)
          .update({
            content: content,
            updated_by: JSON.parse(localStorage.getItem("userInfo")).id,
            updated_at: date
          });
        this.$emit("apply", this.id);
      }
    },
    addResponse() {
      this.$store.commit("app/ADD_RESPONSE", {
        name: "",
        color: "#" + ((Math.random() * 0xffffff) << 0).toString(16)
      });
    },
    dragStart() {},
    onColumnDrop(e) {
      this.$store.commit("app/CHN_EDIT_CLOSED_ANSWER_ORDER", e);
    }
  }
};
</script>

<style lang="scss" scoped>
.closed-answer-edit {
  /deep/ .vs-sidebar--background {
    z-index: 52010;
  }

  /deep/ .vs-sidebar {
    z-index: 52010;
    width: 500px;
    max-width: 100vw;
  }
}

.scroll-area-answer-type-list {
  height: calc(100% - 4.3rem);
}
</style>

<style scoped>
.answer-content {
  background: #50505014;
  border-width: 0 0 1px 0;
  border-style: solid;
  border-color: #dedede;
}
.column-drag-handle {
  cursor: grab;
}
</style>
<style >
.closed-answer-edit
  .smooth-dnd-container.vertical
  > .smooth-dnd-draggable-wrapper {
  overflow: unset !important;
}
.smooth-dnd-ghost {
  cursor: grabbing;
}
/* .card-ghost {
  transition: transform 0.18s ease;
}
.card-ghost-drop {
  transition: transform 0.18s ease-in-out;
  transform: rotate(0deg);
} */
.drop-preview {
  margin: 5px;
  background-color: rgba(150, 150, 200, 0.1);
  border: 1px dashed #abc;
}
</style>