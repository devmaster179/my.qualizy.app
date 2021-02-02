<template>
  <vs-prompt
    :title="$t('new location')"
    :accept-text="$t('save')|capitalize"
    :cancel-text="$t('cancel')|capitalize"
    @cancel="init"
    @accept="addLocation"
    :is-valid="validateForm"
    :active.sync="openLocation"
  >
    <div class="vx-row">
      <vs-input class="w-full" :label-placeholder="$t('name')|capitalize" v-model="name" />
    </div>
    <div class="vx-row">
      <div
        class="vs-component vs-con-input-label vs-input is-label-placeholder vs-input-primary is-label-placeholder w-full"
      >
        <div class="vs-con-input">
          <gmap-autocomplete
            :placeholder="$t('address') | capitalize"
            class="vs-inputx vs-input--input normal hasIcon w-full"
            @place_changed="getAddressData"
            ref="addressName"
          ></gmap-autocomplete>

          <i
            class="icon-no-border vs-icon notranslate icon-scale icon-inputx notranslate vs-input--icon feather icon-map-pin null"
          ></i>
        </div>
      </div>
    </div>
    <div class="vx-row">
      <vs-input class="w-full" :label-placeholder="$t('region')" v-model="region" />
    </div>
    <div class="vx-row" v-if="region!=''">
      <vs-input class="w-full" :label-placeholder="$t('area')" v-model="area" />
    </div>
  </vs-prompt>
</template>

<script>
import { db } from "@/firebase/firebaseConfig";
import VueGoogleAutocomplete from "vue-google-autocomplete";
import firebase from "firebase/app";
import "@firebase/analytics";
export default {
  components: {
    VueGoogleAutocomplete,
  },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      name: "",
      address: "",
      region: "",
      area: "",
    };
  },
  computed: {
    openLocation: {
      get() {
        return this.open;
      },
      set() {
        this.$emit("close");
      },
    },
    validateForm() {
      return this.name != "" && Object.keys(this.address).length > 0;
    },
  },
  methods: {
    init() {
      this.name = "";
      this.address = {};
      this.region = "";
      this.area = "";
    },
    // getAddressData: function(addressData, placeResultData, id) {
    //   this.address = Object.assign({}, addressData, {
    //     fAddress: this.$refs.addressName.$refs.autocomplete.value
    //   });
    //   delete this.address.administrative_area_level_2;
    //   if (addressData.locality !== undefined)
    //     this.region = addressData.locality;
    //   if (addressData.route !== undefined) this.area = addressData.route;
    // },
    getAddressData: function (addressData) {
      this.address = {
        country: addressData.address_components.find(
          (item) => item.types.indexOf("country") > -1
        ).long_name,
        fAddress: this.$refs.addressName.$refs.input.value,
        latitude: addressData.geometry.location.lat(),
        longitude: addressData.geometry.location.lng(),
      };
      this.region =
        addressData.address_components.find(
          (item) => item.types.indexOf("locality") > -1
        ) === undefined
          ? ""
          : addressData.address_components.find(
              (item) => item.types.indexOf("locality") > -1
            ).long_name;

      this.area =
        addressData.address_components.find(
          (item) => item.types.indexOf("route") > -1
        ) === undefined
          ? ""
          : addressData.address_components.find(
              (item) => item.types.indexOf("route") > -1
            ).long_name;
    },
    getLocationID(created_at) {
      return new Promise((resolve, reject) => {
        var id = "";
        db.collection("locations")
          .where(
            "group",
            "==",
            JSON.parse(localStorage.getItem("userInfo")).group
          )
          .where("created_at", "==", created_at)
          .onSnapshot({ includeMetadataChanges: true }, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
              if (change.type === "added") {
                id = change.doc.id;
              }
            });
            if (id != "") resolve(id);
          });
      });
    },
    async addLocation() {
      var locationNames = [];
      var locations = this.$store.getters["app/locations"].filter(
        (item) => !item.deleted
      );
      locations.map((item) => {
        locationNames.push(item.name.toLowerCase());
      });
      if (locationNames.indexOf(this.name.toLowerCase()) > -1) {
        this.$vs.notify({
          time: 8000,
          title: "Fail",
          text: "Location name is exist already !",
          iconPack: "feather",
          icon: "icon-alert-circle",
          color: "danger",
        });
        this.init();
        return false;
      }
      var created_at = new Date();
      this.$vs.loading();
      var addingObject = {
        name: this.name,
        address: this.address,
        active: true,
        created_at: created_at,
        created_by: JSON.parse(localStorage.getItem("userInfo")).id,
        group: JSON.parse(localStorage.getItem("userInfo")).group,
      };
      if (this.region != "") {
        addingObject = Object.assign({}, addingObject, { region: this.region });
        if (this.area != "")
          addingObject = Object.assign({}, addingObject, {
            area: this.area,
          });
      }
      db.collection("locations").add(addingObject);
      this.getLocationID(created_at).then((id) => {
        this.$vs.loading.close();
        this.$vs.notify({
          title: "Success",
          text: "Location is saved successfully!",
          iconPack: "feather",
          icon: "icon-check-circle",
          color: "success",
        });
        firebase.analytics().logEvent("Added a location", {
          group: JSON.parse(localStorage.getItem("userInfo")).group,
          id: id,
        });

        this.$userflow.track("Add New Location", {
          name: addingObject.name,
          group: JSON.parse(localStorage.getItem("userInfo")).group,
        });
        window.gist.track("Add New Location", {
          name: addingObject.name,
          group: JSON.parse(localStorage.getItem("userInfo")).group,
        });
      });
      this.init();
    },
  },
};
</script>