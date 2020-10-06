<template>
  <vs-sidebar
    click-not-close
    position-right
    parent="body"
    default-index="1"
    color="primary"
    class="add-new-data-sidebar items-no-padding"
    spacer
    v-model="isSidebarActiveLocal"
  >
    <div class="mt-6 flex items-center justify-between px-6">
      <h4>{{ $t("add task") }}</h4>
      <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>
    <div class="unschedule-container p-4">
      <vs-input
        icon-no-border
        icon-pack="feather"
        icon="icon-search"
        :placeholder="$t('Search')"
        v-model="searchTitle"
        class="is-label-placeholder w-full"
      />
      <VuePerfectScrollbar class="scroll-area--log-filter pt-4 pb-6" :settings="settings">
        <div
          v-for="(template, index) in unshceduledTemplates"
          :key="index"
          class="tempateItem"
          :class="{ active: selectedID == template.id }"
          @click="selectedID = template.id"
        >
          <div class="flex items-center">
            <vs-avatar
              size="40px"
              :src="
                require(`../../assets/images/template_image/${template.content.templateImage}`)
              "
            />
            <div>
              <p class="karla-bold templateTitle">{{ template.content.templateTitle }}</p>
              <vs-icon size="12px" icon-pack="feather" icon="icon-map-pin"></vs-icon>
              <span class="karla locationText pl-1">{{ templateLocation(template) }}</span>
            </div>
          </div>
        </div>
      </VuePerfectScrollbar>

      <div class="flex flex-wrap items-center justify-center p-6" slot="footer">
        <vs-button
          class="mr-6 karla"
          type="filled"
          color="rgba(108, 80, 240, 0.1)"
          @click="isSidebarActiveLocal = false"
          text-color="#6c50f0"
        >{{$t("cancel") | capitalize}}</vs-button>
        <vs-button
          class="karla"
          color="#6c50f0"
          :disabled="selectedID == ''"
          @click="assginTemplate"
        >{{ $t("add task") }}</vs-button>
      </div>
    </div>
  </vs-sidebar>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
export default {
  components: {
    VuePerfectScrollbar
  },
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      selectedID: "",
      searchTitle: "",
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.6
      }
    };
  },
  methods: {
    assginTemplate() {
      this.$emit('assginTemplate', { templateID: this.selectedID }, true)
      this.isSidebarActiveLocal = false
    }
  },
  watch: {
    isSidebarActiveLocal(val) {
      if (val) {
        this.searchTitle = "";
        this.selectedID = "";
      }
    }
  },
  computed: {
    templateLocation() {
      return template => {
        if (
          template.content.location === undefined ||
          template.content.location.length == 0
        )
          return this.$t("no location");
        else {
          var locations = template.content.location
          locations = locations.filter(item=> !!this.$store.getters["app/getLocationById"](item))
          if(locations.length == 0)
            return this.$t("no location");
          else {
            let location = this.$store.getters["app/getLocationById"](
              template.content.location[0]
            ).name;
            if (locations.length == 1) return location;
            else return `${location} + ${locations.length - 1}`;
          }
        }
      };
    },
    unshceduledTemplates() {
      let templates = this.$store.getters["app/getBookedTemplate"];
      return templates.filter(item => {
        let filteredLocations = this.$store.getters["app/locationList"]
        if(filteredLocations.length > 0) {
          return item.content.location.some(location => filteredLocations.includes(location)) &&
                (item.trashed === undefined || !item.trashed) && 
                 item.content.templateTitle
                .toLowerCase()
                .indexOf(this.searchTitle.toLowerCase()) > -1
        } else {
          return (item.trashed === undefined || !item.trashed) &&
                  item.content.templateTitle.toLowerCase().indexOf(this.searchTitle.toLowerCase()) > -1
        }
      });
    },
    isSidebarActiveLocal: {
      get() {
        return this.open;
      },
      set(val) {
        if (!val) {
          this.$emit("closeSidebar");
        }
      }
    }
  }
};
</script>
<style scoped>
.templateTitle {
  font-size: 14px;
  color: #1e1c26;
}
.tempateItem {
  border-radius: 8px;
  /* box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.08); */
  background-color: #f5f5fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 10px;
  transition: all 0.25s;
  cursor: pointer;
}
.tempateItem.active {
  border: solid 1px #6c50f0;
}
.tempateItem.active:hover {
  transform: unset;
  box-shadow: unset;
}
.tempateItem:hover {
  transform: translateY(-3px);
  box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.25);
}
</style>
<style lang="scss" scoped>
.add-new-data-sidebar {
  /deep/ .vs-sidebar--background {
    z-index: 52010;
  }

  /deep/ .vs-sidebar {
    z-index: 52010;
    width: 500px;
    max-width: 100vw;

    .img-upload {
      margin-top: 2rem;

      .con-img-upload {
        padding: 0;
      }

      .con-input-upload {
        width: 100%;
        margin: 0;
      }
    }
  }

  ul {
    border-left-width: 3px;
    border-left-style: dashed;
    border-left-color: rgba(var(--vs-primary), 1);
  }
  li {
    padding: 20px 0;
  }
  .active {
    background-color: #7367f024;
  }
}

.scroll-area--log-filter {
  height: calc(100vh - 15rem);
}
.w-300 {
  width: 170px;
  z-index: 420000;
}
.holamundo {
  min-height: 50%;
}
</style>
