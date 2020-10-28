<template>
  <vs-prompt
    :title="$t('edit location')"
    :accept-text="$t('update')|capitalize"
    :cancel-text="$t('cancel')|capitalize"
    @accept="updateLocation"
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
    VueGoogleAutocomplete
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      name: "",
      address: {},
      region: "",
      // fAddress: "",
      area: ""
    };
  },
  computed: {
    openLocation: {
      get() {
        return this.open;
      },
      set() {
        this.$emit("close");
      }
    },
    validateForm() {
      return this.name != "" && Object.keys(this.address).length > 0;
    }
  },
  methods: {
    getAddressData(addressData) {
      this.address = {
        country: addressData.address_components.find(
          item => item.types.indexOf("country") > -1
        ).long_name,
        fAddress: this.$refs.addressName.$refs.input.value,
        latitude: addressData.geometry.location.lat(),
        longitude: addressData.geometry.location.lng()
      };
      this.region =
        addressData.address_components.find(
          item => item.types.indexOf("locality") > -1
        ) === undefined
          ? ""
          : addressData.address_components.find(
              item => item.types.indexOf("locality") > -1
            ).long_name;

      this.area =
        addressData.address_components.find(
          item => item.types.indexOf("route") > -1
        ) === undefined
          ? ""
          : addressData.address_components.find(
              item => item.types.indexOf("route") > -1
            ).long_name;
    },
    updateLocation() {
      var locationNames = [];
      var locations = this.$store.getters["app/locations"].filter(
        item => !item.deleted
      );
      locations.map(item => {
        if (this.id == item.id) return;
        locationNames.push(item.name.toLowerCase());
      });
      if (locationNames.indexOf(this.name.toLowerCase()) > -1) {
        this.$vs.notify({
          time: 8000,
          title: "Fail",
          text: "Location name is exist already !",
          iconPack: "feather",
          icon: "icon-alert-circle",
          color: "danger"
        });
        return false;
      }
      var updated_at = new Date();
      var addingObject = {
        address: this.address,
        active:true,
        name: this.name,
        updated_at: updated_at,
        updated_by: JSON.parse(localStorage.getItem("userInfo")).id,
        group: JSON.parse(localStorage.getItem("userInfo")).group
      };
      if (this.region != "") {
        addingObject = Object.assign({}, addingObject, { region: this.region });
        if (this.area != "")
          addingObject = Object.assign({}, addingObject, {
            area: this.area
          });
      }
      
      db.collection("locations")
        .doc(this.id)
        .set(addingObject);
      this.$vs.notify({
        title: "Success",
        text: "Location is updated successfully!",
        iconPack: "feather",
        icon: "icon-check-circle",
        color: "success"
      });
    }
  },
  watch: {
    open(val) {
      if (val) {
        let location = JSON.parse(
          JSON.stringify(this.$store.getters["app/getLocationById"](this.id))
        );
        this.address = location.address;
        this.name = location.name;
        this.region = location.region === undefined ? "" : location.region;
        this.area = location.area === undefined ? "" : location.area;
        setTimeout(() => {
          this.$refs.addressName.$refs.input.value = location.address.fAddress;
        }, 10);
      }
    }
  }
};
</script>