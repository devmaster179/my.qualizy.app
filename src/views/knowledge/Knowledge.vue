<template>
  <div id="knowldge">
    <div class="page-header flex items-center justify-between">
      <p class="page-title karla-bold color-my-black text-2xl">{{$t("knowledge base") |capitalize}}</p>
      <div class="page-actions items-center hidden sm:flex justify-end">
        <vs-input
          class="bg-white hidden md:block"
          v-model="search"
          :placeholder="$t('Search')"
          icon="icon-search"
          icon-pack="feather"
          icon-no-border
        />
        <vs-button :disabled="role>2" class="ml-2" @click="addCategory">
          <span class="karla">{{$t("add category")}}</span>
        </vs-button>
      </div>
    </div>
    <div class="page-content mt-base">
      <div class="vx-row items-grid-view match-height">
        <div
          class="vx-col w-full sm:w-1/2 md:w-1/3 lg:w-1/4 sm:pl-4 px-0 mb-base"
          v-for="category in categories"
          :key="category.id"
        >
          <category-card
            class="cursor-pointer"
            :category="category"
            @edit="edit"
            @delete-category="deleteCategory"
          />
        </div>
      </div>
    </div>
    <category-edit :open="openAdd" :id="id" :category="newCategory" @close="openAdd=false" />
    <vs-popup
      classContent="popup-example"
      :title="$t('are you sure to delete ?')"
      :active.sync="deletePrompt"
    >
      <div class="delete-content">
        <div class="text-center">
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.12"
              d="M0 40C0 17.9086 17.9086 0 40 0C62.0914 0 80 17.9086 80 40C80 62.0914 62.0914 80 40 80C17.9086 80 0 62.0914 0 40Z"
              fill="#EB5743"
            />
            <path
              d="M25 30H28.3333H55"
              stroke="#EB5743"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M33.3308 29.9972V26.6639C33.3308 25.7798 33.682 24.932 34.3071 24.3069C34.9322 23.6818 35.7801 23.3306 36.6641 23.3306H43.3308C44.2149 23.3306 45.0627 23.6818 45.6878 24.3069C46.313 24.932 46.6641 25.7798 46.6641 26.6639V29.9972M51.6641 29.9972V53.3306C51.6641 54.2146 51.313 55.0625 50.6878 55.6876C50.0627 56.3127 49.2149 56.6639 48.3308 56.6639H31.6641C30.7801 56.6639 29.9322 56.3127 29.3071 55.6876C28.682 55.0625 28.3308 54.2146 28.3308 53.3306V29.9972H51.6641Z"
              stroke="#EB5743"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M36.6692 38.3306V48.3306"
              stroke="#EB5743"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M43.3308 38.3306V48.3306"
              stroke="#EB5743"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <p
          class="karla-bold text-2xl color-my-black text-center pt-base"
        >{{$t("you are about to delete category")}}</p>
        <p class="karla-bold text-sm text-center mt-4">{{$t('this will delete your category')}}</p>
        <p class="karla-bold text-sm text-center">{{$t("are you sure to delete ?")}}</p>
        <div class="flex items-center justify-center mt-base">
          <vs-button class="ml-2" color="danger" @click="deleteCate">
            <span class="karla">{{$t("yes, delete category")}}</span>
          </vs-button>
          <vs-button
            @click="deletePrompt=false"
            color="rgba(108, 80, 240, 0.1)"
            text-color="rgba(108, 80, 240)"
            class="kalar ml-2"
          >
            <span class="karla">{{$t("cancel, keep category")}}</span>
          </vs-button>
        </div>
      </div>
    </vs-popup>
  </div>
</template>

<script>
import CategoryEdit from "./CategoryEdit.vue";
import CategoryCard from "./CategoryCard.vue";
import { db } from "@/firebase/firebaseConfig.js";
export default {
  components: {
    CategoryEdit,
    CategoryCard,
  },

  data() {
    return {
      deletePrompt: false,
      newCategory: {
        image: "3.svg",
        name: "",
        locations: [],
        comment: "",
      },
      openAdd: false,
      search: "",
      id: "",
    };
  },
  methods: {
    deleteCate() {
      db.collection("knowledge").doc(this.id).delete();
      this.deletePrompt = false;
    },
    deleteCategory(id) {
      this.id = id;
      this.deletePrompt = true;
    },
    addCategory() {
      this.id = "";
      this.newCategory = {
        image: "3.svg",
        name: "",
        comment: "",
        locations: [],
      };
      this.openAdd = true;
    },

    edit(id) {
      this.id = id;
      let category = this.$store.getters["app/getKnowledgeById"](id);
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
      this.openAdd = true;
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
    categories() {
      var categories = this.$store.getters["app/knowledge_category"];
      let filteredLocation = this.$store.getters["app/locationList"]
      if(filteredLocation.length>0)
        categories = categories.filter(cat=> !!cat.locations && cat.locations.some(item=>filteredLocation.includes(item)))
      if (this.search == "") return categories;
      return categories.filter(
        (item) =>
          item.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1
      );
    },
  },
};
</script>


