<template>
  <div id="articles-page" v-if="category">
    <div class="page-header mb-4">
      <div class="page-title flex">
        <p
          @click="$router.push('/knowledge')"
          class="text-2xl color-my-black karla-bold mr-2 cursor-pointer"
          style="opacity:0.54;"
        >{{$t("knowledge base")}} &gt;</p>
        <p class="text-2xl color-my-black karla-bold">{{categoryName}}</p>
      </div>
    </div>
    <div class="vx-row">
      <div class="vx-col sm:w-1/3 w-full">
        <vx-card>
          <div slot="no-body" class="p-3">
            <div class="flex justify-end" v-if="role<3 && category.group!='global'">
              <p class="karla-bold text-primary cursor-pointer" @click="editCategory">{{$t("edit")}}</p>
            </div>
            <div class="category-image flex items-center ml-1">
              <img
                :src="require(`@/assets/images/template_image/${categoryImage}`)"
                width="48"
                height="48"
                class="mt-2"
              />
              <p class="karla-bold ml-2">{{categoryName}}</p>
            </div>
            <span
              class="karla text-sm mt-4 ml-2 inline-block"
              v-if="category!==undefined && category.comment!==undefined"
            >{{category.comment}}</span>
          </div>
        </vx-card>
      </div>
      <div class="vx-col sm:w-2/3 w-full">
        <article-card :articles="articles" :group="category.group" />
      </div>
    </div>
    <category-edit :open="edit" :id="id" :category="newCategory" @close="edit=false" />
  </div>
</template>

<script>
import KnowledgeCard from "./KnowledgeCard.vue";
import ArticleCard from "./ArticleCard.vue";
import CategoryEdit from "../knowledge/CategoryEdit";

import { db } from "@/firebase/firebaseConfig.js";

export default {
  components: {
    KnowledgeCard,
    ArticleCard,
    CategoryEdit,
  },
  data() {
    return {
      edit: false,
      newCategory: {},
      id: this.$route.params.id,
    };
  },
  methods: {
    editCategory() {
      let category = this.$store.getters["app/getKnowledgeById"](this.id);
      var locations =
        category.locations === undefined ? [] : category.locations;
      var __locations = [];
      locations.map((item) => {
        if (this.locationInfo(item) === undefined) return;
        __locations.push(this.locationInfo(item));
      });
      this.newCategory = {
        image:
          category.image === undefined ||
          category.image == "" ||
          category.image.includes("http")
            ? "3.svg"
            : category.image,
        name: category.name,
        locations: __locations,
        comment: category.comment,
      };
      this.edit = true;
    },
    showArticle(id) {
      this.category = id;
      this.init = false;
    },
  },
  computed: {
    role() {
      var cUser = this.$store.getters["app/currentUser"];
      if (cUser == undefined || cUser.role === undefined) {
        return 4;
      }
      return cUser.role.key;
    },
    locationInfo() {
      return (id) => {
        return this.$store.getters["app/getLocationById"](id);
      };
    },
    category() {
      return this.$store.getters["app/getKnowledgeById"](this.$route.params.id);
    },
    categoryImage() {
      if (
        this.category === undefined ||
        this.category.image === undefined ||
        this.category.image == "" ||
        this.category.image.includes("http")
      )
        return "3.svg";
      return this.category.image;
    },
    categoryName() {
      if (this.category !== undefined) return this.category.name;
      return "";
    },
    articles() {
      return this.$store.getters["app/getArticleByCategory"](
        this.$route.params.id
      );
    },
  },
  created() {},
};
</script>

