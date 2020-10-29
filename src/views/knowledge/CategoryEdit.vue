<template>
  <vs-popup :title="title" :active.sync="openActive">
    <div class="p-3">
      <div class="category-image">
        <category-images :image="newCategory.image" @selectImage="selectImage" />
      </div>
      <div class="category-name mt-base">
        <label class="color-my-blak text-sm font-medium">{{$t("Category name")}}</label>
        <vs-input v-model="newCategory.name" class="w-full" />
      </div>
      <div class="category-location mt-4">
        <label class="color-my-blak text-sm font-medium">{{$t("location")}}</label>
        <multiselect
          v-model="categoryLocation"
          :placeholder="$t('select location')"
          label="name"
          track-by="id"
          :options="locations"
          :option-height="50"
          :show-labels="false"
          :multiple="true"
        >
          <template slot="selection" slot-scope="{ values }">
            <div class="pb-2" v-if="values.length>0">
              <span class="selectItem inline-block karla mb-1" v-for="(value,i) in values" :key="i">
                {{value.name}}
                <vs-icon
                  icon-pack="feather"
                  size="10px"
                  icon="icon-x"
                  class="ml-2 cursor-pointer"
                  style="padding-top:1px;"
                  @click.native="removeLocation(value)"
                />
              </span>
            </div>
          </template>
          <template slot="option" slot-scope="{ option , search }">
            <div class="tag-item flex items-center justify-between">
              <div class="flex items-center">
                <vs-icon
                  v-if="categoryLocation.indexOf(option)>-1"
                  icon="check_box"
                  color="primary"
                  style="font-size: 25px; font-family: 'Material Icons';"
                ></vs-icon>
                <vs-icon
                  v-else
                  icon="check_box_outline_blank"
                  style="font-size: 25px; font-family: 'Material Icons';"
                ></vs-icon>
                <p class="tag-name karla font-light" v-if="option.name!==undefined">{{option.name}}</p>
                <p class="tag-name karla font-light" v-else>{{search}}</p>
              </div>
            </div>
          </template>
        </multiselect>
      </div>
      <div class="category-description mt-4">
        <label class="color-my-blak text-sm font-medium">{{$t("Category name")}}</label>
        <vs-textarea v-model="newCategory.comment" />
      </div>
      <div class="category-actions flex justify-end">
        <vs-button
          class="ml-4"
          color="rgba(108, 80, 240, 0.1)"
          text-color="rgba(108, 80, 240)"
          style="padding:.8rem 2rem!important;"
          @click="openActive=false"
        >
          <span class="karla ml-2">{{$t("cancel")}}</span>
        </vs-button>
        <vs-button
          @click="saveCategory"
          :disabled="newCategory.name=='' || categoryLocation.length==0"
          class="ml-4"
          color="rgba(108, 80, 240)"
          text-color="white"
          style="padding:.8rem 2rem!important;"
        >
          <span class="karla ml-2">{{title}}</span>
        </vs-button>
      </div>
    </div>
  </vs-popup>
</template>

<script>
import Multiselect from "vue-multiselect";
import CategoryImages from "./CategoryImageSelect";
import { db } from "@/firebase/firebaseConfig.js";

export default {
  props: {
    open: {
      type: Boolean,
      default: false
    },
    category: {
      type: Object
    },
    id: {
      type: String,
      default: ""
    }
  },
  components: {
    Multiselect,
    CategoryImages
  },
  data() {
    return {
      newCategory: {
        image: "3.svg",
        name: "",
        locations: [],
        comment: ""
      }
    };
  },
  watch: {
    open(val) {
      if (val) {
        this.newCategory = this.category;
      }
    }
  },
  methods: {
    removeLocation(val) {
      this.newCategory.locations = this.newCategory.locations.filter(
        item => item.id != val.id
      );
    },
    saveCategory() {
      var locations = [];
      this.newCategory.locations.map(item => locations.push(item.id));
      this.openActive = false;
      if (this.id == "") {
        db.collection("knowledge").add({
          group: JSON.parse(localStorage.getItem("userInfo")).group,
          created_by: JSON.parse(localStorage.getItem("userInfo")).id,
          updated_by: JSON.parse(localStorage.getItem("userInfo")).id,
          created_at: new Date(),
          updated_at: new Date(),
          comment: this.newCategory.comment,
          image: this.newCategory.image,
          type: "category",
          locations: locations,
          name: this.newCategory.name
        });
      } else {
        db.collection("knowledge")
          .doc(this.id)
          .update({
            updated_by: JSON.parse(localStorage.getItem("userInfo")).id,
            updated_at: new Date(),
            locations: locations,
            name: this.newCategory.name,
            comment: this.newCategory.comment,
            image: this.newCategory.image
          });
      }
    },
    selectImage(val) {
      this.newCategory.image = val;
    }
  },
  computed: {
    title() {
      if (this.id == "") return this.$t("add category");
      return this.$t("update category");
    },
    locationInfo() {
      return id => {
        return this.$store.getters["app/getLocationById"](id);
      };
    },
    categoryLocation: {
      get() {
        return this.newCategory.locations.filter(location=>location && !location.deleted);
      },
      set(val) {
        this.newCategory.locations = [];
        val.map(item => {
          this.newCategory.locations.push(item);
        });
      }
    },
    locations() {
      var cUser = this.$store.getters["app/currentUser"]
      var locationList = this.$store.getters['app/locationList']
      if(locationList.length==0) {
        if(cUser.role == undefined || cUser.role.key == undefined || cUser.role.key>0) {
          if(cUser.location !== undefined && Array.isArray(cUser.location) && cUser.location.length>0) {
            locationList = cUser.location
          } else {
            locationList = ['no']
          }
        }
      }

      var locations =  this.$store.getters["app/locations"].filter(
        item => item.deleted === undefined || !item.deleted
      );

      if(locationList.length > 0) {
        locations = []
        locationList.map(location=> {
          var location1 = this.$store.getters["app/getLocationById"](location)
          if(location1)
            locations.push(location1)
        }) 
      }
      return locations

    },
    openActive: {
      get() {
        return this.open;
      },
      set() {
        this.$emit("close");
      }
    }
  }
};
</script>

<style scoped>
.selectItem {
  background: #f5f5fa;
  padding: 5px 5px;
  margin-right: 3px;
  font-size: 12px;
  border-radius: 3px;
  color: #1e1c26;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
