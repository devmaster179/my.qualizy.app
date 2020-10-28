<template>
  <div class="article-card">
    <vx-card>
      <div class="flex justify-between mb-base">
        <p class="karla-bold text-lg">{{$t('articles')}}</p>
        <p
          v-if="group!='global'"
          class="karla-bold text-primary text-sm cursor-pointer"
          @click="addArticle"
        >{{$t('create a new article')}}</p>
      </div>
      <vs-table stripe :data="articles">
        <template slot="thead">
          <vs-th sort-key="title">{{$t("title") | capitalize}}</vs-th>
          <vs-th v-if="group!='global'">{{$t("date") | capitalize}}</vs-th>
          <vs-th>{{$t("attachment") | capitalize}}</vs-th>
          <vs-th v-if="group!='global'"></vs-th>
        </template>
        <template slot-scope="{data}">
          <vs-tr :key="indextr" v-for="(tr, indextr) in data">
            <vs-td :data="data[indextr].title">{{ data[indextr].title }}</vs-td>
            <vs-td
              v-if="group!='global'"
              :data="data[indextr].date"
            >{{ data[indextr].updated_at.toDate() | moment('DD MMMM , YYYY') }}</vs-td>
            <vs-td :data="data[indextr].file">
              <a :href="data[indextr].file" target="_blank">{{data[indextr].fileName}}</a>
            </vs-td>
            <vs-td v-if="group!='global'" :data="indextr+'actions'">
              <div class="actions flex items-center">
                <feather-icon
                  icon="Edit2Icon"
                  class="w-5 h-5 cursor-pointer mr-2 hover:text-primary"
                  @click="editArticle(data[indextr])"
                />
                <vs-icon
                  v-if="role<2"
                  icon="icon-trash-2"
                  class="cursor-pointer hover:text-danger"
                  size="18px"
                  icon-pack="feather"
                  @click="removeArticle(data[indextr].id , data[indextr].ref)"
                />
              </div>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </vx-card>
    <article-add :open="activeAdd" @close="activeAdd=false" />
    <article-edit :open="activeEdit" :article="editedArticle" @close="activeEdit=false" />
  </div>
</template>

<script>
import { db } from "@/firebase/firebaseConfig.js";
import { storage } from "../../firebase/firebaseStorage";

import ArticleAdd from "./ArticleAdd";
import ArticleEdit from "./ArticleEdit";

export default {
  props: {
    articles: {
      type: Array,
    },
    group: {
      type: String,
      required: true,
    },
  },
  components: {
    ArticleAdd,
    ArticleEdit,
  },
  data() {
    return {
      activeAdd: false,
      articleId: "",
      activeEdit: false,
      ref: "",
      editedArticle: {},
    };
  },
  methods: {
    roleError(action) {
      this.$vs.notify({
        time: 5000,
        title: "Authorization Error",
        text:
          `You don't have authorization for ${action}.\n Please contact with your super admin`,
        color: "danger",
        iconPack: "feather",
        icon: "icon-lock",
      });
    },
    addArticle() {
      if(!this.auth('create')) {
        this.roleError('create')
        return false
      }
      this.activeAdd=true

    },
    editArticle(data) {
      if(!this.auth('edit')) {
        this.roleError('edit')
        return false
      }
      this.editedArticle = data;
      this.activeEdit = true;
    },
    removeArticle(id, ref) {
      if(!this.auth('delete')) {
        this.roleError('delete')
        return false
      }
      this.articleId = id;
      this.ref = ref;
      this.$vs.dialog({
        color: "danger",
        title: `Delete`,
        text: `This article will be deleted completely.
                Are you sure?`,
        accept: this.acceptDelete,
      });
    },
    acceptDelete() {
      this.$vs.loading();
      var storageRef = storage.ref();
      storageRef.child(this.ref).delete();

      db.collection("knowledge")
        .doc(this.articleId)
        .delete()
        .then(() => {
          this.$vs.loading.close();
          this.$vs.notify({
            title: "Success",
            text: "A article is trashed successfully",
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "success",
          });
        })
        .catch((error) => {
          this.$vs.loading.close();
          this.$vs.notify({
            title: "Failed",
            text: error.message,
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "danger",
          });
        });
    },
  },
  computed: {
    auth() {
      return action=> {
        let authList = this.$store.getters['app/auth']
        var cUser = this.$store.getters["app/currentUser"];
        if(cUser == undefined || cUser.role == undefined) return false
        else if(cUser.role.key == 0) 
          return true
        return authList['knowledge base'][cUser.role.name.toLowerCase()][action]
      }
    },
    role() {
      var cUser = this.$store.getters["app/currentUser"];
      if (cUser == undefined || cUser.role === undefined) {
        return 4;
      }
      return cUser.role.key;
    },
  },
};
</script>