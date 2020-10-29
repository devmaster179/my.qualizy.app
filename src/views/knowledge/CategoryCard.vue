<template>
  <vx-card v-if="Object.keys(category).length>0">
    <div slot="no-body" class="p-4 pl-6">
      <div class="flex items-start justify-between mb-base">
        <img
          :src="require(`@/assets/images/template_image/${categoryImage}`)"
          width="48"
          height="48"
          class="mt-2"
        />
        <vs-dropdown vs-custom-content class="cursor-pointer" vs-trigger-click>
          <feather-icon icon="MoreVerticalIcon" class="p-2 cursor-pointer" style="height:2.6rem;" />
          <vs-dropdown-menu class="vx-navbar-dropdown">
            <ul style="min-width: 9rem" class="p-0">
              <li
                class="flex py-1 px-2 my-1 cursor-pointer hover:bg-primary hover:text-white"
                @click="$router.push(`/article/${category.id}`).catch((err) => {})"
              >
                <feather-icon icon="EyeIcon" svgClasses="w-4 h-4"></feather-icon>
                <span class="ml-2 karla">{{$t("view article")}}</span>
              </li>

              <li
                v-if="role<3 && category.group!='global'"
                class="flex py-1 px-2 my-1 cursor-pointer hover:bg-primary hover:text-white"
                @click="$emit('edit' , category.id)"
              >
                <feather-icon icon="Edit2Icon" svgClasses="w-4 h-4"></feather-icon>
                <span class="ml-2 karla">{{$t("edit")}}</span>
              </li>
              <li
                v-if="role<2 && category.group!='global'"
                class="flex py-1 px-2 my-1 cursor-pointer hover:bg-primary hover:text-white"
                @click="$emit('delete-category' , category.id)"
              >
                <feather-icon icon="Trash2Icon" svgClasses="w-4 h-4"></feather-icon>
                <span class="ml-2 karla">{{$t("delete")}}</span>
              </li>
            </ul>
          </vs-dropdown-menu>
        </vs-dropdown>
      </div>
      <p class="w-full karla-bold color-my-black text-xl truncate ml-2">{{category.name}}</p>
      <span class="ml-2 mt-2 inline-block text-xs" style="color:#5d5c63; ">{{category.comment}}</span>
      <div class="location-section mt-4 flex items-center" v-if="locations.length>0">
        <div class="location-item flex items-center">
          <vs-icon icon-pack="feather" icon="icon-map-pin" />
          <span class="karla text-xs color-my-black ml-1">{{locationInfo(locations[0]).name}}</span>
        </div>

        <vs-dropdown
          vs-custom-content
          class="cursor-pointer"
          vs-trigger-click
          v-if="locations.length>1"
        >
          <div class="location-item flex items-center ml-2">
            <span class="karla text-xs color-my-black">+</span>
            <span class="karla text-xs color-my-black ml-1">{{locations.length-1}}</span>
          </div>
          <vs-dropdown-menu class="vx-navbar-dropdown">
            <div class="bg-white" style="width:300px;">
              <div class="inline-block" v-for="(location, index) in locations" :key="index">
                <div class="flex items-center location-item ml-2 mb-1">
                  <vs-icon icon-pack="feather" icon="icon-map-pin" />
                  <span class="karla text-xs color-my-black ml-1">{{locationInfo(location).name}}</span>
                </div>
              </div>
            </div>
          </vs-dropdown-menu>
        </vs-dropdown>
      </div>
    </div>
  </vx-card>
</template>

<script>
export default {
  props: {
    category: {
      type: Object,
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
    categoryImage() {
      if (
        this.category.image === undefined ||
        this.category.image == "" ||
        this.category.image.includes("http")
      )
        return "3.svg";
      return this.category.image;
    },
    locationInfo() {
      return (id) => {
        return this.$store.getters["app/getLocationById"](id);
      };
    },
    locations() {
      let locations =this.category.locations === undefined ? [] : this.category.locations;

      locations = locations.filter((item) => {
        var location = this.locationInfo(item)
        if(!location || location.deleted) return false
        return true
      });
      return locations;
    },
  },
};
</script>

<style scoped>
.location-item {
  background-color: #ebebf1;
  border-radius: 8px;
  padding: 0.6rem 0.7rem;
}
</style>