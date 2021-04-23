<template>
  <div id="company" class="px-2">
    <template v-if="!auth('user and team settings', 'view')">
      <no-auth />
    </template>
    <div v-else>
      <div class="page-header flex items-center justify-between">
        <div class="sm:flex">
          <p class="page-title karla-bold text-2xl color-my-black m-2 ml-4">
            {{ $t("company profile") | capitalize }}
          </p>
          <div
            class="switch-tab flex items-center sm:ml-12 mt-2 sm:mt-0 mb-2 md:mb-0 md:ml-0 ml-4"
            v-if="isSuperAdmin"
          >
            <div
              class="text-center py-3 px-6 karla"
              :class="{ active: tab == 'payments' }"
              @click="tab = 'payments'"
            >
              {{ $t("payments") | capitalize }}
            </div>
            <div
              class="text-center py-3 px-6 karla"
              :class="{ active: tab == 'locations' }"
              @click="tab = 'locations'"
            >
              {{ $t("locations") | capitalize }}
            </div>
          </div>
        </div>
      </div>
      <div class="video-launcher ml-4">
        <a href="#" @click="howtoTemplate">{{
          $t("Watch this video to see how it works")
        }}</a>
      </div>

      <div class="page-content">
        <payment-tab v-if="isSuperAdmin && tab == 'payments'" />
        <location-tab v-else-if="!isSuperAdmin || tab == 'locations'" />
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase/firebaseConfig.js";
import { storage } from "@/firebase/firebaseStorage";
import { VueTelInput } from "vue-tel-input";
import firebase from "firebase/app";
import "@firebase/auth";

import NoAuth from "@/components/no-auth/NoAuth";
import MapCard from "./locations/MapCard.vue";
import AddLocation from "./locations/LocationAdd";
import EditLocation from "./locations/LocationEdit";
import PaymentTab from "./payments/PaymentTab";
import LocationTab from "./locations/LocationTab";

export default {
  components: {
    VueTelInput,
    MapCard,
    AddLocation,
    EditLocation,
    PaymentTab,
    LocationTab,
    NoAuth,
  },
  data() {
    return {
      tab: "payments",
      isSuperAdmin: false,
      companyName: "",
      companyPhone: "",
      companyAddress: "",
      editCompany: false,
      deletePrompt: false,
      editLocationID: "",
      activeEdit: false,
      addLocation: false,
      openCountries: [],
      openRegions: [],
      openAreas: [],
      searchQuery: "",
      code: "",
      inputOptions: {
        showDialCode: true,
        tabindex: 0,
      },
      isPhone: false,
      userInfo: "",
      ref: "",
      progressUpload: 0,
      initState: true,
      userImage: "",
      company: {},
      uploadStatus: "",
    };
  },
  computed: {
    auth() {
      return (sub, action) => {
        let authList = this.$store.getters["app/auth"];
        var cUser = this.$store.getters["app/currentUser"];
        if (cUser == undefined || cUser.role == undefined) return false;
        else if (cUser.role.key == 0) return true;
        else if (authList[sub][cUser.role.name.toLowerCase()][action])
          return true;
        else return false;
      };
    },
    locationName() {
      let location = this.$store.getters["app/getLocationById"](
        this.editLocationID
      );
      if (location === undefined) return "";
      return location.name;
    },
    calcUsers() {
      return (id) => {
        let users = this.$store.getters["app/users"];
        var count = 0;
        users.map((user) => {
          if (!user.status) return;
          if (user.location == id) count++;
        });
        return count;
      };
    },
    locations() {
      var cUser = this.$store.getters["app/currentUser"];
      var locationList = this.$store.getters["app/locationList"];
      if (locationList.length == 0) {
        if (
          cUser.role == undefined ||
          cUser.role.key == undefined ||
          cUser.role.key > 0
        ) {
          if (
            cUser.location !== undefined &&
            Array.isArray(cUser.location) &&
            cUser.location.length > 0
          ) {
            locationList = cUser.location;
          } else {
            locationList = ["no"];
          }
        }
      }
      let locations = this.$store.getters["app/locations"].filter((item) => {
        if (locationList.length > 0) {
          if (locationList.indexOf(item.id) < 0) return false;
        }
        if (this.searchQuery !== "") {
          var country = item.country !== undefined ? item.country : "";
          var region = item.region !== undefined ? item.region : "";
          var area = item.area !== undefined ? item.area : "";
          return (
            (item.name.toLowerCase().indexOf(this.searchQuery.toLowerCase()) >
              -1 ||
              item.address.fAddress
                .toLowerCase()
                .indexOf(this.searchQuery.toLowerCase()) > -1) &&
            item.active &&
            !item.deleted
          );
        }
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

        if (location.region !== undefined) {
          region = country.items.find(
            (regions) => regions.key == location.region
          );
          if (region === undefined)
            country.items.push({ key: location.region, items: [] });
          region = country.items.find(
            (regions) => regions.key == location.region
          );

          if (location.area !== undefined) {
            area = region.items.find((areas) => areas.key == location.area);
            if (area === undefined)
              region.items.push({ key: location.area, items: [] });
            area = region.items.find((areas) => areas.key == location.area);
            area.items.push({
              name: location.name,
              id: location.id,
              address: location.address,
            });
          } else {
            region.items.unshift({
              name: location.name,
              id: location.id,
              address: location.address,
            });
          }
        } else {
          country.items.unshift({
            name: location.name,
            id: location.id,
            address: location.address,
          });
        }
      });
      typedLocations.count = count;
      return typedLocations;
    },
  },
  methods: {
    howtoTemplate(event) {
      event.preventDefault();
      this.$userflow.start("cf4f573b-f063-4aad-97ec-9e690607fa21");
    },
    locationAdd() {
      if (!this.auth("user and team settings", "create")) {
        this.roleError("edit");
        return false;
      }
      this.addLocation = true;
    },
    companyEdit() {
      if (!this.auth("user and team settings", "edit")) {
        this.roleError("edit");
        return false;
      }
      this.editCompany = true;
    },
    deleteLocationY() {
      db.collection("locations").doc(this.editLocationID).update({
        deleted: true,
      });
      this.$vs.notify({
        title: "Success",
        text: "The location is deleted succesfully",
        iconPack: "feather",
        icon: "icon-alert-circle",
        color: "success",
      });
      this.deletePrompt = false;
    },
    editLocation(id) {
      if (!this.auth("user and team settings", "edit")) {
        this.roleError("edit");
        return false;
      }
      this.editLocationID = id;
      this.activeEdit = true;
    },
    deleteLocation(id) {
      if (!this.auth("user and team settings", "delete")) {
        this.roleError("delete");
        return false;
      }
      this.editLocationID = id;
      this.deletePrompt = true;
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
    saveCompany() {
      db.collection("companies")
        .doc(JSON.parse(localStorage.getItem("userInfo")).group)
        .update({
          bussiness: this.companyName,
          address: this.companyAddress,
          phone: this.companyPhone,
        });
      this.$vs.notify({
        title: "Success",
        text: "Company profiles are chnaged succesfully",
        iconPack: "feather",
        icon: "icon-alert-circle",
        color: "success",
      });
    },

    onUserPhotoChange(fileName, file) {
      const { maxSize } = this;
      let imageFile = file[0];
      if (file.length > 0) {
        let size = imageFile.size / maxSize / maxSize;
        if (!imageFile.type.match("image.*")) {
          // check whether the upload is an image
          this.errorNotify("Please choose an image file");
        } else if (size > 1) {
          this.errorNotify(
            "Your file is too big! Please select an image under 1MB"
          );
        } else {
          var d = new Date();
          var storageRef = storage.ref();
          this.ref =
            JSON.parse(localStorage.getItem("userInfo")).group +
            "/" +
            "/logo/" +
            d.getTime() +
            d.getMilliseconds();

          var mountainsRef = storageRef.child(this.ref);
          this.uploadStatus = mountainsRef.put(imageFile);
          // Append file into FormData and turn file into image URL
          // this.userImage = URL.createObjectURL(imageFile)

          // let iURL = URL.createObjectURL(imageFile)
        }
      }
    },
    launchFilePicker() {
      if (!this.auth("user and team settings", "edit")) {
        this.roleError("edit");
        return false;
      }
      this.$refs.userPhoto.click();
    },
    phoneValidate(formattedNumber, { number, isValid, country }) {
      this.isPhone = isValid;
      this.code = country;
    },
    roleError(action) {
      this.$vs.notify({
        time: 5000,
        title: "Authorization Error",
        text: `You don't have authorization to ${action}.\n Please contact with your super admin`,
        color: "danger",
        iconPack: "feather",
        icon: "icon-lock",
      });
    },
  },
  watch: {
    uploadStatus() {
      this.uploadStatus.on(
        "state_changed",
        (sp) => {
          this.progressUpload = Math.floor(
            (sp.bytesTransferred / sp.totalBytes) * 100
          );
        },
        null,
        () => {
          this.uploadStatus.snapshot.ref
            .getDownloadURL()
            .then((downloadURL) => {
              // this.$emit("url", downloadURL,this.ref,this.indexs);
              this.initState = false;
              this.userImage = downloadURL;
              db.collection("companies")
                .doc(JSON.parse(localStorage.getItem("userInfo")).group)
                .update({
                  logo: downloadURL,
                });
              setTimeout(() => {
                this.progressUpload = 0;
              }, 1000);
            });
        }
      );
    },
  },
  created() {
    db.collection("companies")
      .doc(JSON.parse(localStorage.getItem("userInfo")).group)
      .onSnapshot((doc) => {
        if (!doc.exists) {
          db.collection("companies")
            .doc(JSON.parse(localStorage.getItem("userInfo")).group)
            .set({
              logo: "",
              bussiness: "Company Name",
              address: "Address",
              phone: "",
              created_at: new Date(),
              updated_at: new Date(),
            });
          this.company = {
            logo: "",
            bussiness: "Company Name",
            address: "Address",
            phone: "",
            created_at: new Date(),
            updated_at: new Date(),
          };
        } else {
          this.company = doc.data();
        }
        this.companyName = this.company.bussiness;
        this.companyAddress = this.company.address;
        this.companyPhone = this.company.phone;
      });
  },
  mounted(){
    var superRole = {name:"super admin",key:0};
    var userRole = JSON.parse(localStorage.getItem("userInfo")).role;
    this.isSuperAdmin = JSON.stringify(userRole) == JSON.stringify(superRole);
  }
};
</script>

<style scoped>
.expand-icon {
  transition: all 0.2s ease;
  transform: rotate(0deg);
}
.expand-icon.active {
  transform: rotate(180deg);
}
.compay-card {
  min-height: 500px;
}
.con-vs-avatar {
  border-radius: 25px !important;
}
.vs-avatar--con-img {
  border-radius: 0px !important;
}

.footer {
  position: absolute;
  bottom: 0;
  left: 0;
}
.job-title {
  cursor: pointer;
}
.card-img-top {
  height: 200px;
  object-fit: cover;
  object-position: center;
}
.image-section:focus > .SC4xFe,
.image-section:hover > .SC4xFe {
  opacity: 1;
}
.uploadStatus {
  -webkit-transition: opacity 0.2s ease-in-out;
  transition: opacity 0.2s ease-in-out;
  background-color: rgba(81, 255, 60, 0.6);
  bottom: 0;
  height: 100%;
  left: 0;
  position: absolute;
  right: 0;
  opacity: 1;
}
@media (min-width: 340px) {
  .SC4xFe {
    -webkit-transition: opacity 0.2s ease-in-out;
    transition: opacity 0.2s ease-in-out;
    background-color: rgba(32, 33, 36, 0.6);
    bottom: 0;
    height: 33%;
    left: 0;
    position: absolute;
    right: 0;
    opacity: 0;
  }
  .EyVCdb {
    background-image: url(//www.gstatic.com/images/icons/material/system/2x/photo_camera_white_24dp.png);
    background-position: center;
    background-repeat: no-repeat;
    -webkit-background-size: 24px 24px;
    background-size: 24px 24px;
    height: 100%;
    opacity: 0.8;
  }
}
.video-launcher {
  font-size: 10px;
  height: 12px;
  color: #844cf5;
}
.switch-tab div {
  min-width: 100px;
  background: white;
  transition: all, 0.25;
  font-size: 12px;
  color: #6c50f0;
  border: 1px solid #6c50f0;
  cursor: pointer;
}
.switch-tab div:first-child {
  border-right-width: 0;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}
.switch-tab div:nth-child(3) {
  border-left-width: 0;
}
.switch-tab div:last-child {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}
.switch-tab div.active {
  background-color: rgba(108, 80, 240, 0.08);
}
</style>