<template>
  <div id="knowledge-base-page">
    <div class="page-header mb-base">
      <p class="page-title karla-bold color-my-black text-2xl">{{$t("knowledge base") |capitalize}}</p>
    </div>
    <div class="bg-white md:pl-12 sm:pl-4 pl-1 rounded-lg mb-base vx-row py-6 mx-4">
      <div class="vx-col md:w-2/3 w-full">
        <p class="mb-1 karla-bold color-my-black" style="font-size:22px;">{{$t("How can we help")}}?</p>
        <p
          class="text-xs"
          style="color:#5d5c63;"
        >{{$t("We have some instruction for you. You can reference them right now.")}}</p>
        <vs-input
          :placeholder="$t('Search')"
          v-model="knowledgeBaseSearchQuery"
          icon-pack="feather"
          icon="icon-search"
          size="large"
          class="w-full no-icon-border mt-6"
        />
      </div>
      <div class="vx-col md:w-1/3 md:block hidden">
        <img :src="require('@/assets/images/knowledge/1.svg')" />
      </div>
    </div>
    <div class="items-grid-view vx-row match-height">
      <div
        class="vx-col w-full lg:w-1/4 md:w-1/3 sm:w-1/2 mb-base"
        v-for="item in filteredKB"
        :key="item.id"
        @click="$router.push( { name:'category' , params:{id:item.id} } ).catch(err => {})"
      >
        <vx-card class="cursor-pointer">
          <div class="category-image">
            <img
              :src="require(`@/assets/images/template_image/${categoryImage(item)}`)"
              width="48"
              height="48"
              class="mt-2"
            />
          </div>
          <div class="category-name mt-4">
            <p class="ml-2 karla-bold text-xl color-my-black">{{item.name}}</p>
          </div>
          <div class="category-comment mt-2">
            <p class="ml-2 karla text-xs color-my-black">{{item.comment}}</p>
          </div>
        </vx-card>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase/firebaseConfig.js";
export default {
  data() {
    return {
      knowledgeBaseSearchQuery: ""
    };
  },
  computed: {
    categoryImage() {
      return item => {
        if (
          item.image === undefined ||
          item.image == "" ||
          item.image.includes("http")
        )
          return "3.svg";
        return item.image;
      };
    },
    filteredKB() {
      var categories = this.$store.getters["app/knowledge_category"];
      return categories.filter(
        item =>
          item.name
            .toLowerCase()
            .indexOf(this.knowledgeBaseSearchQuery.toLowerCase()) > -1
      );
    }
  }
};
</script>

<style lang="scss">
.knowledge-base-jumbotron-content {
  background-image: url("../../assets/images/pages/knowledge-base-cover.jpg");
  background-size: cover;
}
</style>