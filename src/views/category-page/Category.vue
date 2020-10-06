<template>
  <div id="knowledge-base-article">
    <div class="page-header flex items-center mb-4">
      <p
        @click="$router.push('/knowledge-page')"
        class="text-2xl color-my-black karla-bold mr-2 cursor-pointer"
        style="opacity:0.54;"
      >{{$t("knowledge base")}} ></p>
      <p class="text-2xl color-my-black karla-bold mr-2 cursor-pointer">{{categoryName}}</p>
    </div>
    <div class="vx-row match-height">
      <div class="vx-col w-full md:w-2/5 lg:w-1/4">
        <vx-card class="article-card">
          <div slot="no-body" class="p-4">
            <p class="karla-bold text-lg mb-4">{{$t("articles") | capitalize}}</p>
            <VuePerfectScrollbar class="article-area p-4" :settings="settings">
              <ul class>
                <li
                  v-for="article in articles"
                  :key="article.id"
                  class="p-3 my-2 article-item"
                  :class="aId==article.id?'active':''"
                >
                  <p
                    class="karla-bold text-sm cursor-pointer"
                    @click="aId=article.id"
                  >{{ article.title | capitalize }}</p>
                </li>
              </ul>
            </VuePerfectScrollbar>
          </div>
        </vx-card>
      </div>
      <div class="vx-col w-full md:w-3/5 lg:w-3/4 mt-12 md:mt-0" v-if="aId!=''">
        <vx-card>
          <div slot="no-body" class="p-4">
            <div class="article-title mb-6">
              <p class="karla-bold text-lg">{{ sArticle.title }}</p>
              <p class="mt-1 karla text-sm" v-if="sArticle.group!='global'">
                {{$t("Last updated on")}}
                <span>{{ sArticle.updated_at.toDate() | moment('DD MMMM , YYYY @ HH[h]mm') }}</span>
              </p>
            </div>
            <div class="w-full">
              <iframe class="w-full h-100" :src="sArticle.file" />
            </div>
          </div>
        </vx-card>
      </div>
    </div>
  </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";

import { db } from "@/firebase/firebaseConfig.js";
export default {
  data() {
    return {
      id: "",
      aId: "",
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.3,
      },
    };
  },
  components: {
    VuePerfectScrollbar,
  },
  computed: {
    category() {
      return this.$store.getters["app/getKnowledgeById"](this.$route.params.id);
    },
    categoryName() {
      if (this.category !== undefined) return this.category.name;
      return "";
    },

    sArticle() {
      return this.$store.getters["app/getKnowledgeById"](this.aId);
    },
    articles() {
      return this.$store.getters["app/getArticleByCategory"](this.id);
    },
  },
  created() {
    this.id = this.$route.params.id;
  },
};
</script>

<style scoped>
.h-100 {
  height: calc(100vh - 20rem);
}
.article-item {
  background: #f5f5fa;
}
.article-item.active {
  background: #6c50f0;
  color: white;
}
.article-area {
  height: calc(100vh - 18rem);
}
</style>