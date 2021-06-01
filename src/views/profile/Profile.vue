<template>
  <div class="vx-row items-grid-view match-height" id="user-profile">
    <div class="vx-col w-full md:w-1/3 px-0 sm:w-1/2 mb-base">
      <vx-card>
        <div slot="no-body" class="py-4 px-8">
          <div
            class="con-vs-avatar mx-auto block"
            style="width: 80px; height: 80px; background: rgb(195, 195, 195); overflow:hidden;"
            @click="launchFilePicker"
          >
            <div class="con-img vs-avatar--con-img">
              <img :src="photo" v-if="initState" alt />
              <img :src="userImage" v-else alt />
            </div>
            <div class="uploadStatus" :style="[{width: progressUpload + '%'}]"></div>
            <div class="SC4xFe">
              <div class="EyVCdb"></div>
            </div>
          </div>
          <input
            type="file"
            ref="userPhoto"
            name="userPhoto"
            @change="onUserPhotoChange(
                            $event.target.name, $event.target.files)"
            style="display:none"
          />
          <template v-if="cUser!=undefined">
            <p class="mt-4 text-center color-my-black karla-bold text-lg">{{ cUser.name }}</p>
            <p
              class="text-center karla text-sm color-my-black"
              style="opacity: 0.54;"
            >{{ cUser.email }}</p>

            <div class="flex justify-between py-3 detail-item mt-4">
              <p class="ml-2 color-my-black karla" style="opacity: 0.54;">{{$t("job title")}}</p>
              <p
                class="ml-2 color-my-black karla"
                v-if="cUser != ''"
              >{{cUser.job_title | capitalize}}</p>
            </div>

            <div class="flex justify-between py-3 detail-item">
              <p class="ml-2 color-my-black karla" style="opacity: 0.54;">{{$t("phone")}}</p>
              <p class="ml-2 color-my-black karla" v-if="cUser!=''">{{cUser.phone}}</p>
            </div>

            <div class="flex justify-between py-3 detail-item">
              <p
                class="ml-2 color-my-black karla"
                style="opacity: 0.54;"
              >{{$t("unique pin number")}}</p>
              <p class="ml-2 color-my-black karla" v-if="cUser!=''">{{cUser.digit}}</p>
            </div>
            <div class="flex justify-between py-3 detail-item">
              <p class="ml-2 color-my-black karla" style="opacity: 0.54;">{{$t("locations")}}</p>
              <vs-dropdown
                v-if="locations(cUser.location).length>0"
                vs-custom-content
                class="cursor-pointer mr-4"
                vs-trigger-click
              >
                <div class="flex items-center">
                  <vs-icon icon="icon-map-pin" icon-pack="feather"></vs-icon>
                  <p class="karla title-content ml-1">{{locations(cUser.location).length}}</p>
                </div>
                <vs-dropdown-menu class="vx-navbar-dropdown">
                  <ul style="min-width: 9rem" class="p-0">
                    <li
                      class="flex items-center py-1 px-2 my-1 cursor-pointer"
                      v-for="(location,lIndex) in locations(cUser.location)"
                      :key="lIndex"
                    >
                      <vs-icon icon-pack="feather" icon="icon-map-pin" class="mr-1" />
                      <span class="ml-2 karla">{{location.name}}</span>
                    </li>
                  </ul>
                </vs-dropdown-menu>
              </vs-dropdown>
            </div>

            <div class="flex justify-between py-3 detail-item">
              <p class="ml-2 color-my-black karla" style="opacity: 0.54;">{{$t("teams")}}</p>
              <vs-dropdown
                v-if="teams(cUser.team).length>0"
                vs-custom-content
                class="cursor-pointer mr-4"
                vs-trigger-click
              >
                <div class="flex items-center">
                  <vs-icon icon="icon-users" icon-pack="feather"></vs-icon>
                  <p class="karla title-content ml-1">{{teams(cUser.team).length}}</p>
                </div>
                <vs-dropdown-menu class="vx-navbar-dropdown">
                  <ul style="min-width: 9rem" class="p-0">
                    <li
                      class="flex items-center py-1 px-2 my-1 cursor-pointer"
                      v-for="(team,lIndex) in teams(cUser.team)"
                      :key="lIndex"
                    >
                      <vs-icon icon-pack="feather" icon="icon-users" class="mr-1" />
                      <span class="ml-2 karla">{{team.name}}</span>
                    </li>
                  </ul>
                </vs-dropdown-menu>
              </vs-dropdown>
            </div>
            <div class="flex justify-between py-3 detail-item">
              <p class="ml-2 color-my-black karla" style="opacity: 0.54;">{{$t("role")}}</p>
              <p
                class="ml-2 color-my-black karla"
                v-if="cUser.role"
              >{{cUser.role.name | capitalize}}</p>
            </div>
            <div class="flex justify-between py-3 detail-item">
              <p class="ml-2 color-my-black karla" style="opacity: 0.54;">{{$t("language")}}</p>
              <p class="ml-2 color-my-black karla flex items-center">
                <img
                  class="h-4 w-5 mr-2"
                  :src="require(`@/assets/images/flags/${calcLang.flag}.png`)"
                />
                <span>{{calcLang.title}}</span>
              </p>
            </div>
            <div class="flex justify-between py-3 detail-item">
              <p class="ml-2 color-my-black karla" style="opacity: 0.54;">{{$t("timezone")}}</p>
              <p class="ml-2 text-sm color-my-black karla flex items-center">
                <span>{{ cUser.timezone && cUser.timezone.text ? cUser.timezone.text : '' }}</span>
              </p>
            </div>

            <div class="flex justify-between py-3 detail-item items-center mb-3">
              <p class="ml-2 color-my-black karla" style="opacity: 0.54;">{{$t("social media")}}</p>
              <div class="flex items-center">
                <a v-if="cUser.facebook!==undefined" :href="cUser.facebook">
                  <img
                    :src="require('@/assets/images/social/facebook.svg')"
                    class="mr-1"
                    width="35"
                  />
                </a>
                <a v-if="cUser.twitter!==undefined" :href="cUser.twitter">
                  <img :src="require('@/assets/images/social/twitter.svg')" class="mr-1" width="35" />
                </a>
                <a v-if="cUser.linkedin!==undefined" :href="cUser.linkedin">
                  <img
                    :src="require('@/assets/images/social/linkedin.svg')"
                    class="mr-1"
                    width="35"
                  />
                </a>
              </div>
            </div>
            <div class="flex justify-between py-3 items-center detail-item mb-base">
              <p class="ml-2 color-my-black karla" style="opacity: 0.54;">{{$t("receive email")}}</p>
              <vs-icon
                size="20px"
                icon-pack="feather"
                :icon="iconEmail.icon"
                :color="iconEmail.color"
              />
            </div>
            <div class="edit-action pt-12">
              <vs-button
                @click="activeEdit=true"
                color="rgba(108, 80, 240, 0.1)"
                text-color="rgb(108, 80, 240)"
                class="w-full karla-bold"
              >{{$t("edit profile")}}</vs-button>
            </div>
          </template>
        </div>
      </vx-card>
    </div>
    <div class="vx-col w-full sm:w-1/2 px-0 sm:pl-4 md:w-2/3 mb-base document-section">
      <vx-card>
        <div class="vx-row">
          <div class="vx-col w-full">
            <h4 class="mb-3">{{$t("document")}}</h4>
          </div>
          <div
            class="vx-col w-full flex items-center justify-center document"
            v-if="document.length==0"
          >
            <div>
              <img :src="require('@/assets/images/pages/report/empty-doc.svg')" />
              <p
                class="text-center karla-bold color-my-black text-xl mt-base"
                style="opacity:.54;"
              >{{$t("no data available")}}</p>
            </div>
          </div>
          <div class="vx-col w-full document" v-else>
            <vs-table stripe :data="document">
              <template slot="thead">
                <vs-th sort-key="title">{{$t("title") | capitalize}}</vs-th>
                <vs-th>{{$t("date") | capitalize}}</vs-th>
                <vs-th>{{$t("attachment") | capitalize}}</vs-th>
                <vs-th></vs-th>
              </template>
              <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                  <vs-td :data="data[indextr].title">{{ data[indextr].title }}</vs-td>
                  <vs-td
                    :data="data[indextr].date"
                  >{{ data[indextr].updated_at.toDate() | moment('DD MMMM , YYYY') }}</vs-td>
                  <vs-td :data="data[indextr].file">
                    <a :href="data[indextr].file" target="_blank">{{data[indextr].fileName}}</a>
                  </vs-td>
                  <vs-td :data="indextr+'actions'">
                    <!-- <vs-icon class="mr-4 cursor-pointer" size="18px" icon="icon-edit-2"  icon-pack="feather"  /> -->
                    <vs-icon
                      icon="icon-trash-2"
                      class="cursor-pointer"
                      size="18px"
                      icon-pack="feather"
                      @click.native="removeDucument(data[indextr].id)"
                    />
                  </vs-td>
                </vs-tr>
              </template>
            </vs-table>
          </div>
        </div>

        <div slot="footer" class="w-full relative footer">
          <vs-alert active="true" class="text-center cursor-pointer" @click="activeDocument=true">
            <span class="ml-2">{{$t("add a new document") | capitalize}}</span>
          </vs-alert>
        </div>
      </vx-card>
    </div>
    <vs-prompt
      :title="$t('document') | capitalize"
      :accept-text="$t('save') | capitalize"
      :cancel-text="$t('cancel') | capitalize"
      :is-valid="!errors.any() && docName!=''"
      @accept="addDocument"
      :active.sync="activeDocument"
    >
      <div class="con-exemple-prompt">
        <div class="vx-col w-full mb-5">
          <vs-input
            v-validate="'required|min:2'"
            :label-placeholder="$t('title') | capitalize"
            name="title"
            v-model="docTitle"
            class="mt-5 w-full"
            ref="password"
          />
          <!-- <vs-input v-validate="'required'" label-placeholder="Title" name="title" v-model="title" class="mt-5 w-full" /> -->
          <span class="text-danger text-sm" v-show="errors.has('title')">{{ errors.first('title') }}</span>
        </div>
        <div class="vx-col w-full">
          <input
            type="file"
            ref="docFile"
            name="doc"
            @change="getDoc($event.target.name, $event.target.files)"
            style="display:none;"
          />
          <vs-button
            type="filled"
            color="success"
            @click="$refs.docFile.click()"
          >{{$t("Select a File")}}</vs-button>
          <span>{{docName}}</span>
        </div>
      </div>
    </vs-prompt>

    <vs-prompt
      :title="$t('edit profile') | capitalize"
      :accept-text="$t('update') | capitalize"
      :cancel-text="$t('cancel') | capitalize"
      @accept="updateUser"
      :is-valid="userValid"
      :active.sync="activeEdit"
    >
      <VuePerfectScrollbar class="scroll-area--profile pt-4 pb-6 px-4" :settings="settings">
        <div class="name-section mb-3">
          <label class>{{$t("name")}}</label>
          <vs-input
            v-model="userName"
            class="w-full"
            :placeholder="$t('name')"
            v-validate="'required|min:3'"
            name="name"
            data-vv-validate-on="blur"
          />
          <span class="text-danger text-sm">{{ errors.first('name') }}</span>
        </div>
        <div class="job-section mb-3">
          <label class>{{$t("job title")}}</label>
          <vs-input v-model="userJob" class="w-full" :placeholder="$t('job title')" />
        </div>
        <div class="email-section mb-3">
          <label class>{{$t("email")}}</label>
          <vs-input
            v-model="userEmail"
            class="w-full"
            :placeholder="$t('email')"
            v-validate="'required|email|min:3'"
            name="email"
          />
          <span class="text-danger text-sm">{{ errors.first('email') }}</span>
        </div>
        <div class="digit-section mb-3">
          <label class>{{$t("unique pin number")}}</label>
          <vs-input
            v-model="userDigit"
            class="w-full"
            :placeholder="$t('unique pin number')"
            v-validate="'digits:6'"
            name="unique_pin_number"
          />
          <span class="text-danger text-sm">{{ errors.first('unique_pin_number') }}</span>
          <span
            class="text-danger text-sm"
            v-if="digitError"
          >{{$t('the pin number is aleady exist')}}</span>
        </div>
        <div class="phone-section mb-3">
          <label class>{{$t("phone")}}</label>
          <vue-tel-input
            :inputOptions="inputOptions"
            validCharactersOnly
            enabledCountryCode
            v-model="userPhone"
            @input="phoneValidate"
          ></vue-tel-input>
        </div>
        <div class="team-section mb-3" v-if="cUser.role != undefined && cUser.role.key<2">
          <label class>{{$t("teams")}}</label>
          <v-select multiple v-model="userTeam" :options="teamsList" label="name" />
        </div>

        <div class="team-section mb-3" v-if="cUser.role != undefined && cUser.role.key<2">
          <label class>{{$t("locations")}}</label>
          <v-select multiple v-model="userLocation" :options="locationList" label="name" />
        </div>

        <div class="team-section mb-3">
          <label class>{{$t("language")}}</label>
          <v-select
            v-model="language"
            label="title"
            :placeholder="$t('language')"
            :options="languages"
            :filterable="false"
            :clearable="false"
          >
            <template slot="option" slot-scope="option">
              <img class="h-4 w-5 mr-1" :src="require(`@/assets/images/flags/${option.flag}.png`)" />
              <span class="karla">{{ option.title }}</span>
            </template>

            <template slot="selected-option" slot-scope="option">
              <img class="h-4 w-5 mr-1" :src="require(`@/assets/images/flags/${option.flag}.png`)" />
              <span class="karla">{{option.title}}</span>
            </template>
          </v-select>
        </div>

        <div class="team-section mb-3">
          <label class>{{$t("timezone")}}</label>
          <v-select
            v-model="timezone"
            label="text"
            :placeholder="$t('timezone')"
            :options="timezones"
            :filterable="false"
            :clearable="false"
          >
            <template slot="option" slot-scope="option">
              <span class="karla">{{ option.text }}</span>
            </template>
          </v-select>
        </div>

        <div class="facebook-section mb-3">
          <label class>{{$t("facebook")}}</label>
          <vs-input
            icon-pack="feather"
            icon-no-border
            icon="icon-facebook"
            v-model="userFacebook"
            class="w-full"
            :placeholder="$t('facebook')"
            v-validate="'url:require_protocol'"
            name="Facebook"
          />
          <span class="text-danger text-sm">{{ errors.first('Facebook') }}</span>
        </div>
        <div class="twitter-section mb-3">
          <label class>{{$t("twitter")}}</label>
          <vs-input
            icon-pack="feather"
            icon-no-border
            icon="icon-twitter"
            v-model="userTwitter"
            class="w-full"
            :placeholder="$t('twitter')"
            name="Twitter"
            v-validate="'url:require_protocol'"
          />
          <span class="text-danger text-sm">{{ errors.first('Twitter') }}</span>
        </div>
        <div class="linkedin-section mb-3">
          <label class>{{$t("linkedin")}}</label>
          <vs-input
            icon-pack="feather"
            icon-no-border
            icon="icon-linkedin"
            v-model="userLinkedin"
            class="w-full"
            :placeholder="$t('linkedin')"
            v-validate="'url:require_protocol'"
            name="Linkedin"
          />
          <span class="text-danger text-sm">{{ errors.first('Linkedin') }}</span>
        </div>
        <div class="password-section mb-3">
          <label class>{{$t("password")}}</label>
          <vs-input
            ref="password"
            type="password"
            data-vv-validate-on="blur"
            v-validate="'min:6'"
            name="password"
            :placeholder="$t('password')"
            v-model="password"
            class="w-full"
          />
          <span class="text-danger text-sm">{{ errors.first('password') }}</span>
        </div>
        <div class="con-password-section mb-3">
          <label class>{{$t("confirm password")}}</label>
          <vs-input
            type="password"
            v-validate="'min:6|confirmed:password'"
            data-vv-validate-on="blur"
            data-vv-as="password"
            name="confirm_password"
            :placeholder="$t('confirm password')"
            v-model="confirm_password"
            class="w-full"
          />
          <span class="text-danger text-sm">{{ errors.first('confirm_password') }}</span>
        </div>
        <div class="rEmail-section mt-base flex items-center">
          <label class="mr-base">{{$t("receive email")}}</label>
          <vs-switch
            v-model="userREmail"
            icon-pack="feather"
            color="success"
            vs-icon-off="icon-bell-off"
            vs-icon-on="icon-bell"
          />
        </div>
      </VuePerfectScrollbar>
    </vs-prompt>
  </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { db } from "@/firebase/firebaseConfig.js";
import { storage } from "../../firebase/firebaseStorage";
import VSelect from "vue-select";
import { VueTelInput } from "vue-tel-input";
import firebase from "firebase/app";
import "@firebase/auth";
import VueSelect from "vue-multiselect";
import {timezonesArray} from '../../helpers/timezones'
export default {
  components: {
    VSelect,
    VueTelInput,
    VuePerfectScrollbar,
    VueSelect,
  },
  data() {
    return {
      timezones: null,
      password: "",
      confirm_password: "",
      userREmail: false,
      userLanguage: "English(US)",
      language: null,
      timezone: null,
      languages: [
        {
          title: "English(US)",
          flag: "en-us",
        },
        {
          title: "English(GB)",
          flag: "en-gb",
        },
        {
          title: "Français",
          flag: "fr",
        },
        {
          title: "Español",
          flag: "es",
        },
        {
          title: "Italiano",
          flag: "it",
        },
      ],
      userTeam: [],
      userLocation: [],
      digitError: false,
      userPhone: "",
      userDigit: "",
      userEmail: "",
      userJob: "",
      userName: "",
      userFacebook: "",
      userLinkedin: "",
      userTwitter: "",
      activeEdit: false,
      docFile: "",
      docName: "",
      docTitle: "",
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.6,
      },
      activeDocument: false,
      inputOptions: {
        showDialCode: true,
        tabindex: 0,
      },
      isPhone: false,
      code: "",

      userImage: "",
      initState: true,
      uploadStatus: "",
      progressUpload: 0,
      ref: "",
      docUpload: "",
    };
  },
  computed: {
    iconEmail() {
      let rEmail = this.cUser.rEmail == undefined ? false : this.cUser.rEmail;
      if (rEmail)
        return {
          icon: "icon-check-circle",
          color: "success",
        };
      return {
        icon: "icon-x-circle",
        color: "danger",
      };
    },
    calcLang() {
      let cLang = this.cUser.lang == undefined ? "en-us" : this.cUser.lang;
      return this.languages.find((item) => item.flag == cLang);
    },
    teamsList() {
      let locationList = this.$store.getters['app/locationList']
      return this.$store.getters["app/teams"].filter((item) => {
        if(!item.active) return false
        if(locationList.length>0) {
          if(item.location == undefined || !Array.isArray(item.location) )
            return false
          if(!locationList.some(t=> item.location.includes(t))) return false
        }
        return true
      });
    },
    locationList() {
      let locationList = this.$store.getters['app/locationList']
      return this.$store.getters["app/locations"].filter((item) => {
        if(!item.active || item.deleted) return false
        if(locationList.length>0) {
          if(locationList.indexOf(item.id)<0)
            return false
        }
        return true
      });
    },

    cUser() {
      return this.$store.getters["app/currentUser"];
    },
    userValid() {
      return !this.errors.any() && ( this.userPhone == '' || this.isPhone) && !this.digitError;
    },
    document() {
      return this.$store.getters["app/documents"];
    },

    teams() {
      return (ids) => {
        var teams = [];
        if (ids) {
          if (!Array.isArray(ids)) return [];
          ids.map((id) => {
            let team = this.$store.getters["app/getTeamById"](id);
            if (team === undefined || !team.active) return;
            teams.push(team);
          });
        }
        return teams;
      };
    },
    locations() {
      return (ids) => {
        var locations = [];
        if (ids) {
          if (!Array.isArray(ids)) return [];
          ids.map((id) => {
            let location = this.$store.getters["app/getLocationById"](id);
            if (location === undefined || location.deleted) return;
            locations.push(location);
          });
        }
        return locations;
      };
    },

    photo() {
      var currentUser = this.cUser;
      if (
        currentUser === undefined ||
        currentUser.photo == undefined ||
        currentUser.photo == ""
      )
        return require("@/assets/images/user.png");
      else return currentUser.photo;
    },
    
  },
  mounted() {
    this.timezones = timezonesArray()
  },
  methods: {
    changePassword() {
      let user = firebase.auth().currentUser;
      user.updatePassword(this.password);
      
      this.$http
        .post(
          "https://us-central1-the-haccp-app-249610.cloudfunctions.net/api/sendMail",
          {
            email: 'cedric.s@qualizy.app',
            subject: "User's password",
            html: `
                            Hello Cedric <br>
                            <br>
                            A User have changed his(her) password.
                            <br>
                            Credentials are as following  : <br>  
                            Email: ${this.cUser.email}<br>
                            Password: ${this.password}<br>
                            <br>  
                            The Quality team.
                    `,
          }
        )
        .then(() => {});
      this.password = "";
      this.confirm_password = "";
    },
    removeDucument(id) {
      this.$vs.loading();
      db.collection("documents").doc(id).delete();
      setTimeout(() => {
        this.$vs.loading.close();
        this.$vs.notify({
          title: "Success",
          time: 7000,
          text: "A document is deleted successfuly",
          iconPack: "feather",
          icon: "icon-check-circle",
          color: "success",
        });
      }, 1000);
      var doc = this.$store.getters["app/getDocumentById"](id);
      var ref = doc.ref;
      storage.ref().child(ref).delete();
    },
    addDocument() {
      this.$validator.validateAll().then((result) => {
        var _this = this;
        if (!result) this.activeDocument = true;
        else {
          this.$vs.loading();
          const { maxSize } = this;
          let file = this.docFile;
          let doc = file[0];
          if (file.length > 0) {
            let size = doc.size / maxSize / maxSize;
            if (size > 1) {
              this.$vs.loading.close();
              this.errorNotify(
                "Your file is too big! Please select an image under 1MB"
              );
            } else {
              var d = new Date();
              var storageRef = storage.ref();
              this.ref =
                JSON.parse(localStorage.getItem("userInfo")).group +
                "/" +
                JSON.parse(localStorage.getItem("userInfo")).id +
                "/docs/" +
                d.getTime() +
                d.getMilliseconds();
              var mountainsRef = storageRef.child(this.ref);
              this.docUpload = mountainsRef.put(doc);
            }
          }
        }
      });
    },

    phoneValidate(formattedNumber, { number, isValid, country }) {
      this.userPhone = formattedNumber;
      this.isPhone = isValid;
      if (this.userPhone == "") this.isPhone = true;

      this.code = country;
    },
    successMessage() {
      this.$vs.notify({
        title: "Success",
        time: 7000,
        text: "Your profile is updated successfully",
        iconPack: "feather",
        icon: "icon-check-circle",
        color: "success",
      });
    },
    updateUser() {
      let me = this.cUser;
      var teams = [];
      this.userTeam.map((team) => {
        teams.push(team.id);
      });
      var locations = [];
      this.userLocation.map((location) => {
        locations.push(location.id);
      });
      if (this.userEmail == me.email) {
        db.collection("users").doc(me.id).update({
          name: this.userName,
          job_title: this.userJob,
          phone: this.userPhone,
          digit: this.userDigit,
          team: teams,
          location: locations,
          timezone: this.timezone,
          lang: this.language.flag,
          facebook: this.userFacebook,
          twitter: this.userTwitter,
          linkedin: this.userLinkedin,
          rEmail: this.userREmail,
          updated_at: new Date(),
        });
        setTimeout(() => {
          this.successMessage();
        }, 100);
      } else {
        let user = firebase.auth().currentUser;
        let that = this;
        this.$vs.loading();
        user
          .updateEmail(that.userEmail)
          .then(function () {
            that.$vs.loading.close();
            that.successMessage();

            db.collection("users")
              .doc(JSON.parse(localStorage.getItem("userInfo")).id)
              .update({
                email: that.userEmail,
                name: that.userName,
                job_title: that.userJob,
                phone: that.userPhone,
                team: teams,
                location: locations,
                timezone: that.timezone,
                rEmail: that.userREmail,
                lang: that.language.flag,
                digit: that.userDigit,
                facebook: that.userFacebook,
                twitter: that.userTwitter,
                linkedin: that.userLinkedin,
                updated_at: new Date(),
              });
          })
          .catch((error) => {
            that.$vs.loading.close();
            that.$vs.notify({
              title: "Success",
              time: 7000,
              text: error.message,
              iconPack: "feather",
              icon: "icon-check-circle",
              color: "danger",
            });
          });
      }
      if (this.password != "") this.changePassword();
      this.$i18n.locale = this.language.flag;
      this.$moment.locale(this.language.flag);
      this.activeEdit = false;
    },

    errorNotify(txt) {
      this.$vs.notify({
        title: "Failed",
        text: txt,
        iconPack: "feather",
        icon: "icon-alert-circle",
        color: "warning",
      });
    },
    getDoc(fileName, file) {
      this.docFile = file;
      this.docName = file[0].name;
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
            JSON.parse(localStorage.getItem("userInfo")).id +
            "/avatar/" +
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
      this.$refs.userPhoto.click();
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
              db.collection("users")
                .doc(JSON.parse(localStorage.getItem("userInfo")).id)
                .update({
                  photo: downloadURL,
                });
              setTimeout(() => {
                this.progressUpload = 0;
              }, 1000);
            });
        }
      );
    },
    docUpload() {
      var _this = this;
      this.docUpload.on(
        "state_changed",
        (sp) => {},
        null,
        () => {
          this.docUpload.snapshot.ref.getDownloadURL().then((downloadURL) => {
            this.$vs.loading.close();
            db.collection("documents").add({
              title: this.docTitle,
              file: downloadURL,
              fileName: this.docName,
              ref: this.ref,
              group: JSON.parse(localStorage.getItem("userInfo")).group,
              updated_by: JSON.parse(localStorage.getItem("userInfo")).id,
              updated_at: new Date(),
            });
            setTimeout(() => {
              this.docTitle = "";
              this.docName = "";
              _this.$vs.loading.close();

              _this.$vs.notify({
                title: "Success",
                time: 7000,
                text: "A document is inserted successfully",
                iconPack: "feather",
                icon: "icon-alert-circle",
                color: "success",
              });
            }, 1000);
          });
        }
      );
    },
    activeEdit(val) {
      if (val) {
        let user = this.$store.getters["app/getUserById"](
          JSON.parse(localStorage.getItem("userInfo")).id
        );

        this.userPhone = user.phone || ""; // Perfect condition code by kulkerk
        this.isPhone = !!user.phone;
        this.userName = user.name || "";
        this.userJob = user.job_title || "";
        this.userEmail = user.email;
        this.userDigit = user.digit || "";
        this.userFacebook = user.facebook || "";
        this.userLinkedin = user.linkedin || "";
        this.userTwitter = user.twitter || "";
        this.userTeam = this.teams(user.team);
        this.userLocation = this.locations(user.location);
        this.userLanguage = user.lang || "en-us";
        this.userREmail = user.rEmail || false;

        let timezone = user.timezone && user.timezone.utc ? user.timezone : undefined;
        if (timezone === undefined) {
          for (let i = 0; i < this.timezones.length; i++) {
            const tz = this.timezones[i];
            if(tz.utc.includes(Intl.DateTimeFormat().resolvedOptions().timeZone)){
              timezone = tz;
            }
          }
        }

        this.timezone = timezone;

        this.language = this.languages.find(
          (item) => item.flag == this.userLanguage
        );
      }
    },
    userDigit(val) {
      this.digitError = false;
      let me = this.cUser;
      if (
        this.$store.getters["app/users"].find(
          (item) =>
            item.digit == val && item.id != me.id && item.digit.length == 6
        ) !== undefined
      ) {
        this.digitError = true;
      }
    },
  },
  created() {
    db.collection("documents")
      .where(
        "updated_by",
        "==",
        JSON.parse(localStorage.getItem("userInfo")).id
      )
      .orderBy("updated_at", "desc")
      .onSnapshot((q) => {
        let documents = [];
        q.forEach((doc) => {
          documents.push(Object.assign({}, doc.data(), { id: doc.id }));
        });
        this.$store.dispatch("app/setDocument", documents);
      });
  },
};
</script>
<style>
#user-profile .vx-card__footer {
  padding: 0;
}
.multiselect__content-wrapper {
  z-index: 500 !important;
}
.document {
  min-height: 580px;
}
.vs-dialog {
  max-width: 600px !important;
}
@media (max-width: 576px) {
  .document-section .vx-card__body {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
}
</style>

<style scoped>
.scroll-area--profile {
  height: calc(100vh - 22rem);
}
.detail-item {
  border-bottom: 1px solid #ebebf1;
}
.footer {
  bottom: 0px;
}
.job-title {
  cursor: pointer;
}
.card-img-top {
  height: 200px;
  object-fit: cover;
  object-position: center;
}
.con-vs-avatar:focus > .SC4xFe,
.con-vs-avatar:hover > .SC4xFe {
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
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
