<template>
  <div id="company" class="px-2">
    <template v-if="!auth('user and team settings' , 'view')">
      <no-auth />
    </template>
    <div class="page-header">
      <p
        class="page-title karla-bold text-2xl color-my-black"
      >{{$t("company profile") | capitalize}}</p>
    </div>
    <div class="video-launcher">
      <a href="#" @click="howtoTemplate">{{ $t("Watch this video to see how it works") }}</a>      
    </div>
    <div class="vx-row items-grid-view match-height">
      <div class="vx-col md:w-1/2 w-full mt-4">
        <vx-card>
          <div class="sm:flex items-start">
            <div class="image-section relative" @click="launchFilePicker">
              <div class="con-img">
                <img
                  height="80"
                  :src="company.logo == '' ? require(`@/assets/images/logo/logo.png`) : company.logo "
                  v-if="initState"
                  alt
                />
                <img height="80" :src="userImage" v-else alt />
              </div>
              <div class="uploadStatus" :style="[{width: progressUpload + '%'}]"></div>
              <div class="SC4xFe">
                <div class="EyVCdb"></div>
              </div>
              <input
                type="file"
                ref="userPhoto"
                name="userPhoto"
                @change="onUserPhotoChange(
                        $event.target.name, $event.target.files)"
                style="display:none"
              />
            </div>
            <div class="company-details ml-3 flex items-start justify-between w-full">
              <div>
                <p class="karla-bold text-2xl color-my-black">{{company.bussiness}}</p>
                <div class="flex items-center mt-1">
                  <vs-icon size="12px" icon-pack="feather" icon="icon-map-pin" />
                  <span class="ml-1 text-sm">{{company.address | capitalize}}</span>
                </div>
                <div class="flex items-center mt-1">
                  <vs-icon size="12px" icon-pack="feather" icon="icon-phone" />
                  <span class="ml-1 text-sm">{{company.phone}}</span>
                </div>
              </div>
              <feather-icon
                icon="Edit2Icon"
                class="cursor-pointer hover:text-primary mt-1"
                style="width:20px; height:20px;"
                @click="companyEdit"
              />
            </div>
          </div>
        </vx-card>
      </div>
      <div class="vx-col md:w-1/2 w-full mt-4">
        <map-card />
      </div>
    </div>
    <div class="location-section mt-base">
      <div class="flex items-center justify-between mb-4">
        <p class="page-title karla-bold text-2xl color-my-black">{{$t("locations") | capitalize}}</p>
        <div class="flex items-center">
          <vs-input
            class="bg-white hidden md:block"
            v-model="searchQuery"
            :placeholder="$t('Search')"
            icon="icon-search"
            icon-pack="feather"
            icon-no-border
          />
          <vs-button class="kalar ml-4" @click="locationAdd">+ {{$t("add location")}}</vs-button>
        </div>
      </div>
      <div class="location-items">
        <ul>
          <li v-for="(country,index) in locations.items" :key="index" class>
            <div
              @click="chnOpenCountries(country.key)"
              class="flex items-center justify-between cursor-pointer rounded-lg mt-0 shadow-lg bg-white my-4 p-6"
            >
              <span class="karla-bold">{{country.key}}</span>
              <vs-icon
                icon-pack="feather"
                icon="icon-chevron-down"
                class="expand-icon"
                :class="{'active': openCountries.indexOf(country.key)>-1}"
              />
            </div>
            <ul :class="{'hidden':openCountries.indexOf(country.key)<0}">
              <li v-for="(region,rIndex) in country.items" :key="'r'+rIndex">
                <template v-if="region.key==undefined">
                  <div
                    class="flex items-center justify-between rounded-lg mt-0 shadow-lg bg-white my-4 p-6 ml-4"
                  >
                    <div class="vx-row w-full">
                      <div class="vx-col w-1/3">
                        <span class="karla">{{region.name}}</span>
                      </div>
                      <div class="vx-col w-1/2">
                        <div class="flex items-center">
                          <vs-icon icon-pack="feather" icon="icon-map-pin" />
                          <span class="karla ml-1">{{region.address.fAddress}}</span>
                        </div>
                      </div>
                      <div class="vx-col w-1/6">
                        <div class="flex items-center">
                          <vs-icon icon-pack="feather" icon="icon-users" />
                          <span class="karla ml-1">{{calcUsers(region.id)}}</span>
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center">
                      <feather-icon
                        icon="Edit2Icon"
                        class="cursor-pointer hover:text-primary w-5"
                        @click="editLocation(region.id)"
                      />
                      <feather-icon
                        icon="Trash2Icon"
                        class="cursor-pointer ml-2 hover:text-danger w-5"
                        @click="deleteLocation(region.id)"
                      />
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div
                    class="cursor-pointer flex items-center justify-between rounded-lg mt-0 shadow-lg bg-white my-4 p-6 ml-4"
                    @click="chnOpenRegions(region.key)"
                  >
                    <span class="karla-bold">{{region.key}} / {{country.key}}</span>
                    <vs-icon
                      icon-pack="feather"
                      icon="icon-chevron-down"
                      class="cursor-pointer expand-icon"
                      :class="{'active': openRegions.indexOf(region.key)>-1}"
                    />
                  </div>
                  <ul :class="{'hidden':openRegions.indexOf(region.key)<0}">
                    <li v-for="(area,aIndex) in region.items" :key="aIndex">
                      <template v-if="area.key===undefined">
                        <div
                          class="flex items-center justify-between rounded-lg mt-0 shadow-lg bg-white my-4 p-6 ml-8"
                        >
                          <div class="vx-row w-full">
                            <div class="vx-col w-1/3">
                              <span class="karla">{{area.name}}</span>
                            </div>
                            <div class="vx-col w-1/2">
                              <div class="flex items-center">
                                <vs-icon icon-pack="feather" icon="icon-map-pin" />
                                <span class="karla ml-1">{{area.address.fAddress}}</span>
                              </div>
                            </div>
                            <div class="vx-col w-1/6">
                              <div class="flex items-center">
                                <vs-icon icon-pack="feather" icon="icon-users" />
                                <span class="karla ml-1">{{calcUsers(area.id)}}</span>
                              </div>
                            </div>
                          </div>
                          <div class="flex items-center">
                            <feather-icon
                              icon="Edit2Icon"
                              class="cursor-pointer hover:text-primary w-5"
                              @click="editLocation(area.id)"
                            />
                            <feather-icon
                              icon="Trash2Icon"
                              class="cursor-pointer ml-2 hover:text-danger w-5"
                              @click="deleteLocation(area.id)"
                            />
                          </div>
                        </div>
                      </template>
                      <template v-else>
                        <div
                          class="cursor-pointer flex items-center justify-between rounded-lg mt-0 shadow-lg bg-white my-4 p-6 ml-8"
                          @click="chnOpenAreas(area.key)"
                        >
                          <span class="karla-bold">{{area.key}} / {{region.key}} / {{country.key}}</span>
                          <vs-icon
                            icon-pack="feather"
                            icon="icon-chevron-down"
                            class="cursor-pointer expand-icon"
                            :class="{'active': openAreas.indexOf(area.key)>-1}"
                          />
                        </div>
                        <ul :class="{'hidden':openAreas.indexOf(area.key)<0}">
                          <li v-for="(position,pIndex) in area.items" :key="pIndex">
                            <div
                              class="flex items-center justify-between rounded-lg mt-0 shadow-lg bg-white my-4 p-6 ml-12"
                            >
                              <div class="vx-row w-full">
                                <div class="vx-col w-1/3">
                                  <span class="karla">{{position.name}}</span>
                                </div>
                                <div class="vx-col w-1/2">
                                  <div class="flex items-center">
                                    <vs-icon icon-pack="feather" icon="icon-map-pin" />
                                    <span class="karla ml-1">{{position.address.fAddress}}</span>
                                  </div>
                                </div>
                                <div class="vx-col w-1/6">
                                  <div class="flex items-center">
                                    <vs-icon icon-pack="feather" icon="icon-users" />
                                    <span class="karla ml-1">{{calcUsers(position.id)}}</span>
                                  </div>
                                </div>
                              </div>
                              <div class="flex items-center">
                                <feather-icon
                                  icon="Edit2Icon"
                                  class="cursor-pointer hover:text-primary w-5"
                                  @click="editLocation(position.id)"
                                />
                                <feather-icon
                                  icon="Trash2Icon"
                                  class="cursor-pointer ml-2 hover:text-danger w-5"
                                  @click="deleteLocation(position.id)"
                                />
                              </div>
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
      </div>
    </div>

    <vs-prompt
      :title="$t('company profile') | capitalize"
      :accept-text="$t('save') | capitalize"
      :cancel-text="$t('cancel') | capitalize"
      :is-valid="!errors.first('name') && !errors.first('address') && isPhone"
      @accept="saveCompany"
      :active.sync="editCompany"
    >
      <div class="con-exemple-prompt">
        <vs-input class="w-full" name="name" v-validate="'required|min:3'" v-model="companyName" />
        <span class="text-danger text-sm ml-2">{{ errors.first('name') }}</span>
      </div>
      <div class="con-exemple-prompt">
        <vs-input
          class="w-full"
          name="address"
          v-validate="'required|min:3'"
          v-model="companyAddress"
        />
        <span class="text-danger text-sm ml-2">{{ errors.first('address') }}</span>
      </div>
      <div class="con-exemple-prompt">
        <vue-tel-input
          :inputOptions="inputOptions"
          validCharactersOnly
          enabledCountryCode
          v-model="companyPhone"
          @input="phoneValidate"
        ></vue-tel-input>
      </div>
    </vs-prompt>
    <add-location :open="addLocation" @close="addLocation=false" />
    <edit-location :open="activeEdit" :id="editLocationID" @close="activeEdit=false" />
    <vs-popup :title="$t('are you sure to delete ?')" :active.sync="deletePrompt">
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
        >{{$t("you are about to delete location")}}</p>
        <p
          class="karla-bold text-sm text-center mt-4"
        >{{$t('this will delete your')}} &#10077;{{locationName}}&#10078; {{$t("location")}}</p>
        <p class="karla-bold text-sm text-center">{{$t("are you sure to delete ?")}}</p>
        <div class="flex items-center justify-center mt-base">
          <vs-button class="ml-2" color="danger" @click="deleteLocationY">
            <span class="karla">{{$t("yes, delete location")}}</span>
          </vs-button>
          <vs-button
            @click="deletePrompt=false"
            color="rgba(108, 80, 240, 0.1)"
            text-color="rgba(108, 80, 240)"
            class="kalar ml-2"
          >
            <span class="karla">{{$t("cancel, keep location")}}</span>
          </vs-button>
        </div>
      </div>
    </vs-popup>
  </div>
</template>

<script>
import { db } from "@/firebase/firebaseConfig.js";
import { storage } from "@/firebase/firebaseStorage";
import { VueTelInput } from "vue-tel-input";
import firebase from "firebase/app";
import "@firebase/auth";
import MapCard from "./MapCard.vue";
import AddLocation from "./LocationAdd";
import EditLocation from "./LocationEdit";
import NoAuth from "@/components/no-auth/NoAuth";
export default {
  components: {
    VueTelInput,
    MapCard,
    AddLocation,
    EditLocation,
    NoAuth
  },
  data() {
    return {
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
        tabindex: 0
      },
      isPhone: false,
      userInfo: "",
      ref: "",
      progressUpload: 0,
      initState: true,
      userImage: "",
      company: {},
      uploadStatus: ""
    };
  },
  computed: {
    auth() {
      return (sub,action) => {
        let authList = this.$store.getters['app/auth']
        var cUser = this.$store.getters["app/currentUser"];
        if(cUser == undefined || cUser.role == undefined) return false
        else if(cUser.role.key == 0) 
          return true
        else if(authList[sub][cUser.role.name.toLowerCase()][action])
          return true
        else 
          return false
      }
    },
    locationName() {
      let location = this.$store.getters["app/getLocationById"](
        this.editLocationID
      );
      if (location === undefined) return "";
      return location.name;
    },
    calcUsers() {
      return id => {
        let users = this.$store.getters["app/users"];
        var count = 0;
        users.map(user => {
          if (!user.status) return;
          if (user.location == id) count++;
        });
        return count;
      };
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
      let locations = this.$store.getters["app/locations"].filter(item => {
        if (locationList.length > 0) {
          if(locationList.indexOf(item.id)<0) return false
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
        items: []
      };
      var count = 0;
      locations.map(location => {
        if (location.address.country === undefined) return;
        count++;
        var country, region, area;
        country = typedLocations.items.find(
          countries => countries.key == location.address.country
        );

        if (country === undefined)
          typedLocations.items.push({
            key: location.address.country,
            items: []
          });
        country = typedLocations.items.find(
          countries => countries.key == location.address.country
        );

        if (location.region !== undefined) {
          region = country.items.find(
            regions => regions.key == location.region
          );
          if (region === undefined)
            country.items.push({ key: location.region, items: [] });
          region = country.items.find(
            regions => regions.key == location.region
          );

          if (location.area !== undefined) {
            area = region.items.find(areas => areas.key == location.area);
            if (area === undefined)
              region.items.push({ key: location.area, items: [] });
            area = region.items.find(areas => areas.key == location.area);
            area.items.push({
              name: location.name,
              id: location.id,
              address: location.address
            });
          } else {
            region.items.unshift({
              name: location.name,
              id: location.id,
              address: location.address
            });
          }
        } else {
          country.items.unshift({
            name: location.name,
            id: location.id,
            address: location.address
          });
        }
      });
      typedLocations.count = count;
      return typedLocations;
    }
  },
  methods: {
    howtoTemplate(event) {
      event.preventDefault();
      this.$userflow.start('cf4f573b-f063-4aad-97ec-9e690607fa21');
    },
    locationAdd() {
      if(!this.auth('user and team settings' , 'create')) {
        this.roleError('edit')
        return false
      }
      this.addLocation=true
    },
    companyEdit() {
      if(!this.auth('user and team settings' , 'edit')) {
        this.roleError('edit')
        return false
      }
      this.editCompany=true
    },
    deleteLocationY() {
      db.collection("locations")
        .doc(this.editLocationID)
        .update({
          deleted: true
        });
      this.$vs.notify({
        title: "Success",
        text: "The location is deleted succesfully",
        iconPack: "feather",
        icon: "icon-alert-circle",
        color: "success"
      });
      this.deletePrompt = false;
    },
    editLocation(id) {
      if(!this.auth('user and team settings' , 'edit')) {
        this.roleError('edit')
        return false
      }
      this.editLocationID = id;
      this.activeEdit = true;
    },
    deleteLocation(id) {
      if(!this.auth('user and team settings' , 'delete')) {
        this.roleError('delete')
        return false
      }
      this.editLocationID = id;
      this.deletePrompt = true;
    },
    chnOpenCountries(key) {
      if (this.openCountries.indexOf(key) > -1)
        this.openCountries = this.openCountries.filter(item => item != key);
      else this.openCountries.push(key);
    },
    chnOpenRegions(key) {
      if (this.openRegions.indexOf(key) > -1)
        this.openRegions = this.openRegions.filter(item => item != key);
      else this.openRegions.push(key);
    },
    chnOpenAreas(key) {
      if (this.openAreas.indexOf(key) > -1)
        this.openAreas = this.openAreas.filter(item => item != key);
      else this.openAreas.push(key);
    },
    saveCompany() {
      db.collection("companies")
        .doc(JSON.parse(localStorage.getItem("userInfo")).group)
        .update({
          bussiness: this.companyName,
          address: this.companyAddress,
          phone: this.companyPhone
        });
      this.$vs.notify({
        title: "Success",
        text: "Company profiles are chnaged succesfully",
        iconPack: "feather",
        icon: "icon-alert-circle",
        color: "success"
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
      if(!this.auth('user and team settings' , 'edit')) {
        this.roleError('edit')
        return false
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
        text:
          `You don't have authorization to ${action}.\n Please contact with your super admin`,
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
        sp => {
          this.progressUpload = Math.floor(
            (sp.bytesTransferred / sp.totalBytes) * 100
          );
        },
        null,
        () => {
          this.uploadStatus.snapshot.ref.getDownloadURL().then(downloadURL => {
            // this.$emit("url", downloadURL,this.ref,this.indexs);
            this.initState = false;
            this.userImage = downloadURL;
            db.collection("companies")
              .doc(JSON.parse(localStorage.getItem("userInfo")).group)
              .update({
                logo: downloadURL
              });
            setTimeout(() => {
              this.progressUpload = 0;
            }, 1000);
          });
        }
      );
    }
  },
  created() {
    db.collection("companies")
      .doc(JSON.parse(localStorage.getItem("userInfo")).group)
      .onSnapshot(doc => {
        if (!doc.exists) {
          db.collection("companies")
            .doc(JSON.parse(localStorage.getItem("userInfo")).group)
            .set({
              logo: "",
              bussiness: "Company Name",
              address: "Address",
              phone: "",
              created_at: new Date(),
              updated_at: new Date()
            });
          this.company = {
            logo: "",
            bussiness: "Company Name",
            address: "Address",
            phone: "",
            created_at: new Date(),
            updated_at: new Date()
          };
        } else {
          this.company = doc.data();
        }
        this.companyName = this.company.bussiness;
        this.companyAddress = this.company.address;
        this.companyPhone = this.company.phone;
      });
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
  color: #844CF5;
}
</style>