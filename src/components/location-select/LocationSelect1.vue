<template>
  <div class="vx-auto-suggest">
    <div class="flex items-center relative">
      <vs-input
        :placeholder="placeholder"
        ref="input"
        class="z-50 w-full bg-white"
        icon-pack="feather"
        icon="icon-search"
        icon-no-border
        v-model="searchQuery"
        @keyup.esc="escPressed"
        @focus="updateInputFocus"
        @blur="updateInputFocus(false)"
      />
    </div>

    <ul
      ref="scrollContainer"
      class="auto-suggest-suggestions-list z-50 rounded-lg mt-0 shadow-lg overflow-hidden"
      :class="{ hidden: !inputFocused }"
      @mouseenter="insideSuggestions = true"
      @mouseleave="insideSuggestions = false"
      @focus="updateInputFocus"
      @blur="updateInputFocus(false)"
      tabindex="-1"
    >
      <li ref="option" class="auto-suggest__suggestion cursor-pointer">
        <VuePerfectScrollbar
          class="location-select-scroll-area"
          :settings="settings"
        >
          <div
            class="flex items-center justify-between location-items py-2 px-2"
          >
            <vs-checkbox
              v-model="selectAllLocations"
              icon-pack="feather"
              :icon="selectAllIcon"
              class="karla text-lg"
              >{{ locations.key }} ({{ selectedLocations.length }}/{{
                locations.count
              }})</vs-checkbox
            >
          </div>
          <ul class="overflow-hidden">
            <li
              class="cursor-pointer"
              v-for="(country, cIndex) in locations.items"
              :key="'c' + cIndex"
            >
              <div
                class="flex items-center justify-between py-2 px-2 pl-6 location-items"
                @click="chnOpenCountries(country.key)"
              >
                <div
                  class="flex items-center"
                  @click.stop="chnCountryValues(country.key)"
                >
                  <vs-icon
                    :icon="countryList(country.key).icon"
                    :color="countryList(country.key).color"
                    size="19px"
                  />
                  <span class="karla-bold ml-1"
                    >{{ country.key }} ({{
                      countryList(country.key).ids.length
                    }}/{{ countryList(country.key).cnt.length }})</span
                  >
                </div>
                <vs-icon
                  icon-pack="feather"
                  icon="icon-chevron-down"
                  class="cursor-pointer expand-icon"
                  :class="{ active: openCountries.indexOf(country.key) > -1 }"
                />
              </div>
              <ul
                class="overflow-hidden"
                :class="{ hidden: openCountries.indexOf(country.key) < 0 }"
              >
                <li
                  class="cursor-pointer"
                  v-for="(region, rIndex) in country.items"
                  :key="'r' + rIndex"
                >
                  <template v-if="region.key == undefined">
                    <div class="px-2 py-2 pl-10 location-items">
                      <vs-checkbox
                        v-model="selectedLocation"
                        :vs-value="region.id"
                        class="vs-checkbox-small karla"
                        >{{ region.name }}</vs-checkbox
                      >
                    </div>
                  </template>
                  <template v-else>
                    <div
                      class="flex items-center justify-between px-2 py-2 pl-10 location-items"
                      @click="chnOpenRegions(region.key)"
                    >
                      <div
                        class="flex items-center ml-1"
                        @click.stop="chnRegionValues(country.key, region.key)"
                      >
                        <vs-icon
                          :icon="regionList(country.key, region.key).icon"
                          :color="regionList(country.key, region.key).color"
                          size="19px"
                        />
                        <span class="karla-bold ml-1"
                          >{{ region.key }} ({{
                            regionList(country.key, region.key).ids.length
                          }}/{{
                            regionList(country.key, region.key).cnt.length
                          }})</span
                        >
                      </div>
                      <vs-icon
                        icon-pack="feather"
                        icon="icon-chevron-down"
                        class="cursor-pointer expand-icon"
                        :class="{
                          active: openRegions.indexOf(region.key) > -1,
                        }"
                      />
                    </div>
                    <ul
                      class="overflow-hidden"
                      :class="{ hidden: openRegions.indexOf(region.key) < 0 }"
                    >
                      <li
                        class="cursor-pointer"
                        v-for="(area, aIndex) in region.items"
                        :key="'a' + aIndex"
                      >
                        <template v-if="area.key == undefined">
                          <div
                            class="px-2 py-2 location-items"
                            style="padding-left: 3.5rem !important"
                          >
                            <vs-checkbox
                              v-model="selectedLocation"
                              :vs-value="area.id"
                              class="vs-checkbox-small karla"
                              >{{ area.name }}</vs-checkbox
                            >
                          </div>
                        </template>
                        <template v-else>
                          <div
                            class="flex items-center justify-between px-2 py-2 location-items"
                            style="padding-left: 3.5rem !important"
                            @click="chnOpenAreas(area.key)"
                          >
                            <div
                              class="flex items-center ml-1"
                              @click.stop="
                                chnAreaValues(country.key, region.key, area.key)
                              "
                            >
                              <vs-icon
                                :icon="
                                  areaList(country.key, region.key, area.key)
                                    .icon
                                "
                                :color="
                                  areaList(country.key, region.key, area.key)
                                    .color
                                "
                                size="19px"
                              />
                              <span class="karla-bold ml-1"
                                >{{ area.key }} ({{
                                  areaList(country.key, region.key, area.key)
                                    .ids.length
                                }}/{{
                                  areaList(country.key, region.key, area.key)
                                    .cnt.length
                                }})</span
                              >
                            </div>

                            <vs-icon
                              icon-pack="feather"
                              icon="icon-chevron-down"
                              class="cursor-pointer expand-icon"
                              :class="{
                                active: openAreas.indexOf(area.key) > -1,
                              }"
                            />
                          </div>
                          <ul
                            class="overflow-hidden ml-2"
                            :class="{ hidden: openAreas.indexOf(area.key) < 0 }"
                          >
                            <li
                              class="cursor-pointer"
                              v-for="(position, pIndex) in area.items"
                              :key="'p' + pIndex"
                            >
                              <div
                                class="px-2 py-2 location-items"
                                style="padding-left: 4rem !important"
                              >
                                <vs-checkbox
                                  v-model="selectedLocation"
                                  :vs-value="position.id"
                                  class="vs-checkbox-small karla"
                                  >{{ position.name }}</vs-checkbox
                                >
                              </div>
                            </li>
                          </ul>
                        </template>
                      </li>
                    </ul>
                  </template>
                </li>
              </ul>
            </li>
          </ul>
        </VuePerfectScrollbar>
      </li>
    </ul>
  </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
export default {
  components: {
    VuePerfectScrollbar,
  },
  props: {
    placeholder: {
      type: String,
      default: "Search..",
    },
    showAction: {
      type: Boolean,
      default: false,
    },

    autoFocus: {
      type: Boolean,
      default: false,
    },
    showPinned: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.6,
      },
      openCountries: [],
      openRegions: [],
      openAreas: [],
      searchQuery: "",
      filteredData: [],
      currentSelected: -1,
      inputFocused: false,
      insideSuggestions: false,
    };
  },
  watch: {
    autoFocus(val) {
      if (val) this.focusInput();
      else this.searchQuery = "";
    },
  },
  computed: {
    selectedLocations() {
      return this.$store.getters["app/locationList"];
    },
    areaList() {
      return (country, region, area) => {
        let countryList = this.locations.items.find(
          (item) => item.key == country
        );
        let regionList = countryList.items.find((item) => item.key == region);
        let areaList = regionList.items.find((item) => item.key == area);
        var cnt = [];
        var ids = [];
        areaList.items.map((position) => {
          cnt.push(position.id);
          if (this.selectedLocations.indexOf(position.id) > -1)
            ids.push(position.id);
        });
        var icon = "check_box_outline_blank";
        var color = "rgb(180,180,180)";
        if (ids.length > 0 && ids.length < cnt.length) {
          icon = "indeterminate_check_box";
          color = "primary";
        } else if (ids.length > 0 && ids.length == cnt.length) {
          icon = "check_box";
          color = "primary";
        }
        return { ids: ids, cnt: cnt, icon: icon, color: color };
      };
    },
    countryList() {
      return (country) => {
        let countryList = this.locations.items.find(
          (item) => item.key == country
        );

        var ids = [];
        var cnt = [];
        countryList.items.map((region) => {
          if (region.key == undefined) {
            cnt.push(region.id);
            if (this.selectedLocations.indexOf(region.id) > -1)
              ids.push(region.id);
          } else {
            region.items.map((area) => {
              if (area.key === undefined) {
                cnt.push(area.id);
                if (this.selectedLocations.indexOf(area.id) > -1)
                  ids.push(area.id);
              } else {
                area.items.map((position) => {
                  cnt.push(position.id);
                  if (this.selectedLocations.indexOf(position.id) > -1)
                    ids.push(position.id);
                });
              }
            });
          }
        });
        var icon = "check_box_outline_blank";
        var color = "rgb(180,180,180)";
        if (ids.length > 0 && ids.length < cnt.length) {
          icon = "indeterminate_check_box";
          color = "primary";
        } else if (ids.length > 0 && ids.length == cnt.length) {
          icon = "check_box";
          color = "primary";
        }

        return { ids: ids, cnt: cnt, icon: icon, color: color };
      };
    },
    regionList() {
      return (country, region) => {
        let countryList = this.locations.items.find(
          (item) => item.key == country
        );
        let regionList = countryList.items.find((item) => item.key == region);
        var cnt = [];
        var ids = [];
        regionList.items.map((area) => {
          if (area.key === undefined) {
            cnt.push(area.id);
            if (this.selectedLocations.indexOf(area.id) > -1) ids.push(area.id);
          } else {
            area.items.map((position) => {
              cnt.push(position.id);
              if (this.selectedLocations.indexOf(position.id) > -1)
                ids.push(position.id);
            });
          }
        });
        var icon = "check_box_outline_blank";
        var color = "rgb(180,180,180)";
        if (ids.length > 0 && ids.length < cnt.length) {
          icon = "indeterminate_check_box";
          color = "primary";
        } else if (ids.length > 0 && ids.length == cnt.length) {
          icon = "check_box";
          color = "primary";
        }
        return { ids: ids, cnt: cnt, icon: icon, color: color };
      };
    },

    allLocationIDs() {
      var cUser = this.$store.getters["app/currentUser"];
      var roleKey = 4;
      var userLocation = [];
      if (cUser == undefined || cUser.role == undefined) {
        roleKey = 4;
      } else {
        roleKey = cUser.role.key;
        userLocation = cUser.location || [];
      }
      let locations = this.$store.getters["app/locations"].filter((item) => {
        if (roleKey > 1) {
          if (userLocation.indexOf(item.id) < 0) return false;
        }
        if (this.searchQuery !== "")
          return (
            item.name.toLowerCase().indexOf(this.searchQuery.toLowerCase()) >
              -1 &&
            item.active &&
            !item.deleted
          );
        return item.active && !item.deleted;
      });

      var ids = [];
      locations.map((item) => {
        ids.push(item.id);
      });
      return ids;
    },
    selectAllLocations: {
      get() {
        return this.selectedLocations.length > 0;
      },
      set(val) {
        if (val) this.$emit("setLocations", this.allLocationIDs);
        else this.$emit("setLocations", []);
      },
    },
    selectedLocation: {
      get() {
        return this.selectedLocations;
      },
      set(val) {
        if (val) this.$emit("setLocations", val);
      },
    },
    selectAllIcon() {
      return this.locations.count == this.selectedLocations.length
        ? "icon-check"
        : "icon-minus";
    },
    locations() {
      var cUser = this.$store.getters["app/currentUser"];
      var roleKey = 4;
      var userLocation = [];
      if (cUser == undefined || cUser.role == undefined) {
        roleKey = 4;
      } else {
        roleKey = cUser.role.key;
        userLocation = cUser.location || [];
      }
      let locations = this.$store.getters["app/locations"].filter((item) => {
        if (roleKey > 1) {
          if (userLocation.indexOf(item.id) < 0) return false;
        }
        if (this.searchQuery !== "")
          return (
            item.name.toLowerCase().indexOf(this.searchQuery.toLowerCase()) >
              -1 &&
            item.active &&
            !item.deleted
          );
        return item.active && !item.deleted;
      });
      var typedLocations = {
        key: this.$t("all"),
        count: 0,
        items: [],
      };
      var count = 0;
      locations.map((location) => {
        if (location.address.country === undefined) return;
        count++;
        var country, region, area;
        country = typedLocations.items.find(
          (countries) => countries.key == location.address.country
        );

        if (country === undefined)
          typedLocations.items.push({
            key: location.address.country,
            items: [],
          });
        country = typedLocations.items.find(
          (countries) => countries.key == location.address.country
        );

        if (location.region !== undefined && location.region != "") {
          region = country.items.find(
            (regions) => regions.key == location.region
          );
          if (region === undefined)
            country.items.push({ key: location.region, items: [] });
          region = country.items.find(
            (regions) => regions.key == location.region
          );

          if (location.area !== undefined && location.area != "") {
            area = region.items.find((areas) => areas.key == location.area);
            if (area === undefined)
              region.items.push({ key: location.area, items: [] });
            area = region.items.find((areas) => areas.key == location.area);
            area.items.push({ name: location.name, id: location.id });
          } else {
            region.items.unshift({ name: location.name, id: location.id });
          }
        } else {
          country.items.unshift({ name: location.name, id: location.id });
        }
      });
      typedLocations.count = count;
      return typedLocations;
    },
  },
  methods: {
    chnAreaValues(country, region, area) {
      let ids = this.areaList(country, region, area).ids;
      let cnt = this.areaList(country, region, area).cnt;
      if (cnt.some((item) => this.selectedLocations.includes(item)))
        this.$emit("removeLocations", cnt);
      else this.$emit("addLocations", cnt);
    },
    chnRegionValues(country, region) {
      let ids = this.regionList(country, region).ids;
      let cnt = this.regionList(country, region).cnt;

      if (cnt.some((item) => this.selectedLocations.includes(item)))
        this.$emit("removeLocations", cnt);
      else this.$emit("addLocations", cnt);
    },
    chnCountryValues(country) {
      let ids = this.countryList(country).ids;
      let cnt = this.countryList(country).cnt;

      if (cnt.some((item) => this.selectedLocations.includes(item)))
        this.$emit("removeLocations", cnt);
      else this.$emit("addLocations", cnt);
    },
    chnOpenCountries(key) {
      if (this.openCountries.indexOf(key) > -1)
        this.openCountries = this.openCountries.filter((item) => item != key);
      else this.openCountries.push(key);
    },
    chnOpenRegions(key) {
      if (this.openRegions.indexOf(key) > -1)
        this.openRegions = this.openRegions.filter((item) => item != key);
      else this.openRegions.push(key);
    },
    chnOpenAreas(key) {
      if (this.openAreas.indexOf(key) > -1)
        this.openAreas = this.openAreas.filter((item) => item != key);
      else this.openAreas.push(key);
    },
    escPressed() {
      this.$emit("closeSearchbar");
      this.searchQuery = "";
      this.filteredData = [];
    },
    inputInit() {
      // if (this.showPinned) {
      //   const starredData = this.data.data.filter(item => item.highlightAction);
      //   this.filteredData = starredData;
      // } else {
      //   this.filteredData = [];
      // }
    },
    updateInputFocus(val = true) {
      if (val) {
        if (this.searchQuery == "") this.inputInit();
        setTimeout(() => {
          this.inputFocused = true;
        }, 100);
      } else {
        if (this.insideSuggestions) return;
        setTimeout(() => {
          this.inputFocused = false;
        }, 100);
        this.escPressed();
        this.$emit("hideLocation");
      }
    },

    focusInput() {
      this.$refs.input.$el.querySelector("input").focus();
    },
    fixScrolling() {
      if (this.currentSelected > 0) {
        const liH = this.$refs.option[this.currentSelected].clientHeight;
        const ulH = this.$refs.scrollContainer.clientHeight;
        if (ulH - liH * this.currentSelected < liH) {
          this.$refs.scrollContainer.scrollTop = Math.round(
            (this.currentSelected + 1 - ulH / liH + 1) * liH
          );
        }
      }
    },
  },
  mounted() {
    if (this.autoFocus) this.focusInput();
  },
};
</script>

<style>
.navbar-sticky
  .vx-navbar-wrapper
  .vx-navbar
  .vx-auto-suggest
  .auto-suggest-suggestions-list {
  width: 100% !important;
  margin-left: 0 !important;
}
</style>
<style lang="scss">
@import "@/assets/scss/vuesax/components/vxAutoSuggest.scss";
</style>
<style scoped>
.expand-icon {
  transition: all 0.2s ease;
  transform: rotate(0deg);
}
.expand-icon.active {
  transform: rotate(180deg);
}
.location-items:hover {
  background: rgba(var(--vs-primary), 0.07);
}
.location-select-scroll-area {
  max-height: 500px;
}
</style>