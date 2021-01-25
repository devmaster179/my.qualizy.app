<template>
  <vs-popup
    v-if="Object.keys(tempTemplate).length > 0"
    classContent="popup-example"
    :title="$t(`${state}`)"
    :active.sync="activePrompt"
  >
    <VuePerfectScrollbar
      class="scroll-template-making mt-4 pb-6 px-4 log-sidebar"
      :settings="settings"
    >
      <div class="template-image">
        <template-images :image="tempTemplate.content.templateImage" />
      </div>
      <div class="template-name mt-4">
        <p class="title">{{ $t("template name") }}</p>
        <vs-input
          :placeholder="$t('template name')"
          class="w-full"
          v-model="templateTitle"
        />
      </div>
      <div class="template-location mt-4">
        <p class="title">{{ $t("location") }}</p>
        <multiselect
          v-model="templateLocation"
          :placeholder="$t('select location')"
          label="name"
          track-by="id"
          :options="locations"
          :option-height="50"
          :show-labels="false"
          :multiple="true"
        >
          <template slot="selection" slot-scope="{ values }">
            <div class="pb-2" v-if="values.length > 0">
              <span
                class="selectItem inline-block karla mb-1"
                v-for="(value, i) in values"
                :key="i"
              >
                {{ value.name }}
                <vs-icon
                  icon-pack="feather"
                  size="10px"
                  icon="icon-x"
                  class="ml-2 cursor-pointer"
                  style="padding-top: 1px"
                  @click.native="removeLocation(value)"
                />
              </span>
            </div>
          </template>
          <template slot="option" slot-scope="{ option, search }">
            <div class="tag-item flex items-center justify-between">
              <div class="flex items-center">
                <vs-icon
                  class="location-select-icon"
                  v-if="tempTemplate.content.location.indexOf(option.id) > -1"
                  icon="check_box"
                  color="primary"
                  style="font-size: 25px; font-family: 'Material Icons'"
                ></vs-icon>
                <vs-icon
                  class="location-select-icon"
                  v-else
                  icon="check_box_outline_blank"
                  style="font-size: 25px; font-family: 'Material Icons'"
                ></vs-icon>
                <p
                  class="tag-name karla font-light"
                  v-if="option.name !== undefined"
                >
                  {{ option.name }}
                </p>
                <p class="tag-name karla font-light" v-else>{{ search }}</p>
              </div>
            </div>
          </template>
        </multiselect>
      </div>
      <div class="template-label mt-4">
        <p class="title">{{ $t("tags") }}</p>
        <multiselect
          v-model="templateTag"
          :placeholder="$t('select tags')"
          label="name"
          track-by="id"
          :options="globalTags"
          :option-height="50"
          :show-labels="false"
          :multiple="true"
          :tag-placeholder="$t('add new tag')"
          :taggable="true"
          @tag="addTag"
        >
          <template slot="option" slot-scope="{ option, search }">
            <div class="tag-item flex items-center justify-between">
              <div class="flex items-center">
                <vs-icon
                  class="tag-select-icon"
                  v-if="
                    tempTemplate.content.templateLabel.indexOf(option.id) > -1
                  "
                  icon="check_box"
                  color="primary"
                  style="font-size: 25px; font-family: 'Material Icons'"
                ></vs-icon>
                <vs-icon
                  class="tag-select-icon"
                  v-else
                  icon="check_box_outline_blank"
                  style="font-size: 25px; font-family: 'Material Icons'"
                ></vs-icon>
                <p
                  class="tag-name karla font-light"
                  v-if="option.name !== undefined"
                >
                  {{ option.name | capitalize }}
                </p>
                <p class="tag-name karla font-light" v-else>{{ search }}</p>
              </div>

              <div class="flex items-center" v-if="option.name !== undefined">
                <div
                  class="h-2 w-2 rounded-full mr-4"
                  :class="{ 'mr-8': option.group == 'global' }"
                  :style="`background: ${option.color};`"
                ></div>
                <feather-icon
                  v-if="option.group != 'global'"
                  icon="Edit2Icon"
                  svgClasses="w-5 h-5"
                  @click.stop="editTag(option)"
                ></feather-icon>
              </div>
            </div>
          </template>
          <template slot="selection" slot-scope="{ values }">
            <div class="flex items-center">
              <div
                :class="{ hidden: i > 1 }"
                class="flex items-center selectItem"
                v-for="(value, i) in values"
                :key="i"
              >
                <div
                  class="h-2 w-2 rounded-full mr-1"
                  :style="`background: ${value.color};`"
                ></div>
                <span class="karla">{{ value.name | capitalize }}</span>
                <vs-icon
                  class="cursor-pointer ml-2"
                  icon-pack="feather"
                  icon="icon-x"
                  size="10px"
                  style="padding-top: 1px"
                  @click.native="removeTag(value)"
                />
              </div>
              <div
                class="flex items-center selectItem"
                v-if="values.length > 2"
              >
                <span class="karla">{{ `+ ${values.length - 2}` }}</span>
              </div>
            </div>
          </template>
        </multiselect>
        <div
          class="tag-edit flex items-center mt-3"
          v-if="tagEditActive && selectedTag.name !== undefined"
        >
          <div
            class="w-2/3 vs-component vs-con-input-label vs-input vs-input-primary is-label-placeholder mt-0"
          >
            <div class="vs-con-input">
              <input
                ref="tagEdit"
                type="text"
                placeholder="Name"
                v-model="selectedTag.name"
                class="vs-inputx vs-input--input normal hasIcon icon-after-input"
                style="border: 1px solid rgba(0, 0, 0, 0.2)"
              />
              <div class="color-picker">
                <swatches
                  v-model="selectedTag.color"
                  shapes="circles"
                  show-border
                  popover-to="left"
                  row-length="5"
                  show-fallback
                  :trigger-style="triggerStyle"
                  :swatch-style="swatchStyle"
                ></swatches>
              </div>
            </div>
          </div>
          <vs-button @click="updateTag" class="kalar ml-2">{{
            $t("save") | capitalize
          }}</vs-button>
          <vs-button
            @click="tagEditActive = false"
            color="rgba(108, 80, 240, 0.1)"
            text-color="rgba(108, 80, 240)"
            class="kalar ml-2"
            >{{ $t("cancel") | capitalize }}</vs-button
          >
        </div>
      </div>
      <div class="description mt-4">
        <p class="title">{{ $t("descriptions") }}</p>
        <vs-textarea v-model="templateComment" />
      </div>
      <div class="template-type">
        <div class="flex items-center">
          <div
            class="flex items-center cursor-pointer"
            @click="templateSD = 'schedule this template'"
          >
            <div
              class="radio-item"
              :class="{ active: templateSD == 'schedule this template' }"
            ></div>
            <p class="karla ml-1">{{ $t("scheduled") }}</p>
          </div>
          <div
            class="flex items-center cursor-pointer ml-base"
            @click="templateSD = 'bookmarked'"
          >
            <div
              class="radio-item"
              :class="{ active: templateSD == 'bookmarked' }"
            ></div>
            <p class="karla ml-1">{{ $t("unscheduled") }}</p>
          </div>
        </div>
        <div class="template-assign mt-4" v-if="templateSD == 'bookmarked'">
          <p class="title">Only available for</p>
          <!-- <p class="title">{{$t("teams")}}</p> -->
          <v-select v-model="team" :options="teams" label="name" multiple />
        </div>
      </div>
    </VuePerfectScrollbar>
    <vs-divider />
    <div class="flex items-center justify-end">
      <vs-button
        @click="activePrompt = false"
        color="rgba(108, 80, 240, 0.1)"
        text-color="rgba(108, 80, 240)"
        class="kalar ml-2 mr-4"
        >{{ $t("cancel") }}</vs-button
      >
      <!-- @click="$router.push( { name:'category' , params:{id:item.id} } ).catch(err => {})" -->
      <vs-button v-if="showCreat" @click="goTemplateEdit">{{
        $t(`${state.split(" ")[0]}`)
      }}</vs-button>
    </div>
  </vs-popup>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import TemplateImages from "./Template-Images";
import Multiselect from "vue-multiselect";
import Swatches from "vue-swatches";
import "vue-swatches/dist/vue-swatches.min.css";
import VSelect from "vue-select";
import { db } from "@/firebase/firebaseConfig";
export default {
  components: {
    VuePerfectScrollbar,
    TemplateImages,
    Multiselect,
    Swatches,
    VSelect,
  },
  props: {
    showCreat: {
      type: Boolean,
      default: true,
    },
    update: {
      type: String,
      default: "new",
    },
    state: {
      type: String,
      required: true,
    },
    open: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedTag: {},
      tagEditActive: false,
      triggerStyle: {
        width: "22px",
        height: "22px",
      },
      swatchStyle: {
        width: "32px",
        height: "32px",
      },
      activeImageSelect: false,
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.6,
      },
    };
  },
  async mounted() {
    await this.setTemplateImages();
  },
  computed: {
    globalTags() {
      const locale = this.$i18n.locale || "en-gb";
      let labels = this.$store.getters["app/labels"].filter((item) => {
        if (item.group != "global") return false;
        if (!item.lang) {
          if (locale != "en-gb") return false;
        } else {
          if (item.lang != locale) return false;
        }
        return true;
      });

      console.log("globalTags", labels);
      return labels;
    },
    teams() {
      return this.$store.getters["app/teams"].filter((team) => {
        if (!team.active || team.deleted) return false;
        // let selectedLocations = this.$store.getters["app/locationList"]
        // if(selectedLocations.length > 0) {
        //   if(team.location==undefined || !Array.isArray(team.location)) return false
        //   return team.location.some(item=> selectedLocations.includes(item))
        // }
        return true;
      });
    },
    team: {
      get() {
        var teamss = [];
        let teams = this.tempTemplate.content.teams || [];
        teams.map((team) => {
          teamss.push(this.$store.getters["app/getTeamById"](team));
        });
        return teamss;
      },
      set(val) {
        var teams = [];
        val.map((item) => {
          teams.push(item.id);
        });
        this.$store.commit("app/CHN_TEMPLATE_TEAMS", teams);
      },
    },
    templateSD: {
      get() {
        return this.tempTemplate.content.templateSD;
      },
      set(val) {
        this.$store.dispatch("app/chnTemplateSD", val);
      },
    },
    templateComment: {
      get() {
        return this.tempTemplate.content.templateComment;
      },
      set(val) {
        this.$store.commit("app/CHN_TEMPLATE_COMMENT", val);
      },
    },
    locations() {
      let locations = this.$store.getters["app/locations"].filter(
        (item) => item.deleted === undefined || !item.deleted
      );
      if (this.$store.getters["app/locationList"].length > 0) {
        locations = [];
        this.$store.getters["app/locationList"].map((item) => {
          locations.push(this.$store.getters["app/getLocationById"](item));
        });
      }
      return locations;
    },
    tags() {
      return this.$store.getters["app/labels"];
    },
    templateTag: {
      get() {
        let tags = this.tags;
        let tag = this.tempTemplate.content.templateLabel;
        return tags.filter((item) => tag.indexOf(item.id) > -1);
      },
      set(val) {
        var tags = [];
        val.map((item) => {
          tags.push(item.id);
        });
        this.$store.commit("app/CHN_TEMPLATE_TAG", tags);
      },
    },
    templateLocation: {
      get() {
        let locations = this.locations;
        let location = this.tempTemplate.content.location;
        return locations.filter((item) => location.indexOf(item.id) > -1);
      },
      set(val) {
        this.$store.dispatch("app/chnTemplateLocation", val);
      },
    },
    templateTitle: {
      get() {
        return this.tempTemplate.content.templateTitle;
      },
      set(val) {
        this.$store.commit("app/CHN_TEMPLATE_TITLE", val);
      },
    },

    tempTemplate() {
      return this.$store.getters["app/getTempTemplate"];
    },
    checkValid() {
      return true;
    },
    activePrompt: {
      get() {
        return this.open;
      },
      set() {
        this.$emit("close");
      },
    },
  },
  methods: {
    goTemplateEdit() {
      this.activePrompt = false;
      setTimeout(() => {
        this.$router.push({
          name: "template-edit",
          params: { id: this.update, state: this.state.split(" ")[0] },
        });
      }, 1);
    },
    updateTag() {
      db.collection("template_labels")
        .doc(this.selectedTag.id)
        .update({
          name: this.selectedTag.name,
          color: this.selectedTag.color,
          updated_at: new Date(),
          updated_by: JSON.parse(localStorage.getItem("userInfo")).id,
        });
      if (
        this.tempTemplate.content.templateLabel.indexOf(this.selectedTag.id) < 0
      ) {
        var oldTemplateTags = JSON.parse(
          JSON.stringify(this.tempTemplate.content)
        ).templateLabel;
        oldTemplateTags.push(this.selectedTag.id);
        this.$store.commit("app/CHN_TEMPLATE_TAG", oldTemplateTags);
      }
      this.tagEditActive = false;
    },
    editTag(tag) {
      this.tagEditActive = true;
      this.$nextTick(() => {
        this.$refs.tagEdit.focus();
      });
      this.selectedTag = {
        id: tag.id,
        name: tag.name,
        color: tag.color,
      };
    },
    getNewTagID(created_at) {
      return new Promise((resolve) => {
        var id = "";
        var date = "";
        db.collection("template_labels")
          .where(
            "group",
            "==",
            JSON.parse(localStorage.getItem("userInfo")).group
          )
          .onSnapshot({ includeMetadataChanges: true }, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
              if (change.type === "added") {
                if (change.doc.data().created_at.nanoseconds !== undefined)
                  date = change.doc.data().created_at.toDate();
                else date = change.doc.data().created_at;
                if (date.getTime() == created_at.getTime()) {
                  id = change.doc.id;
                }
              }
            });
            if (id != "") resolve(id);
          });
      });
    },
    async addTag(newTag) {
      var date = new Date();
      db.collection("template_labels").add({
        name: newTag,
        color: "#" + ((Math.random() * 0xffffff) << 0).toString(16),
        created_at: date,
        created_by: JSON.parse(localStorage.getItem("userInfo")).id,
        updated_at: date,
        updated_by: JSON.parse(localStorage.getItem("userInfo")).id,
        group: JSON.parse(localStorage.getItem("userInfo")).group,
      });
      var newID = await this.getNewTagID(date);

      this.$store.dispatch("app/addTag", newID);
    },
    deleteTag(tag) {
      db.collection("template_labels").doc(tag.id).delete();
    },
    removeTag(val) {
      this.templateTag = this.templateTag.filter((item) => item.id != val.id);
    },
    removeLocation(val) {
      this.templateLocation = this.templateLocation.filter(
        (item) => item.id != val.id
      );
    },
    makeTemplate() {},
    setTemplateImages() {
      db.collection("template_images")
        .where(
          "created_by",
          "==",
          JSON.parse(localStorage.getItem("userInfo")).id
        )
        .onSnapshot((q) => {
          let templateImages = [];
          q.forEach((doc) => {
            templateImages.push(Object.assign({}, doc.data(), { id: doc.id }));
          });
          console.log("templateImages: ", templateImages);
          this.$store.dispatch("app/setTemplateImages", templateImages);
        });
    },
  },
};
</script>

<style scoped>
.radio-item {
  transition: all 0.25s ease;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  box-shadow: 0 0 0 1.5px;
}
.radio-item.active {
  border-radius: 50%;
  background-color: rgba(var(--vs-primary), 1);
  border: 3px solid #fff;
}
.scroll-template-making {
  height: calc(100vh - 20rem);
}
.select-image-text {
  font-size: 12px;
  color: #6c50f0;
  margin-left: 12px;
}
.title {
  font-weight: 500;
  color: #1e1c26;
  opacity: 0.9;
}
.selectItem {
  background: #f5f5fa;
  padding: 5px 5px;
  margin-right: 3px;
  font-size: 12px;
  border-radius: 3px;
  color: #1e1c26;
}
.color-picker {
  position: absolute;
  right: 15px;
  top: 12px;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>


