<template>
  <div id="user-tab">
    <div class="flex justify-end w-full mb-4 mt-3 lg:mt-0">
      <feather-icon
        icon="ListIcon"
        @click="currentItemView='item-list-view'"
        class="p-2 mr-2 shadow-drop rounded-lg d-theme-dark-bg cursor-pointer"
        :svgClasses="{'text-primary stroke-current': currentItemView == 'item-list-view'}"
      />
      <feather-icon
        icon="GridIcon"
        @click="currentItemView='item-grid-view'"
        class="p-2 mr-2 shadow-drop rounded-lg d-theme-dark-bg cursor-pointer"
        :svgClasses="{'text-primary stroke-current': currentItemView == 'item-grid-view'}"
      />
      <vs-input
        class="bg-white hidden md:block mr-2"
        v-model="searchKey"
        :placeholder="$t('Search')"
        icon="icon-search"
        icon-pack="feather"
        icon-no-border
      />
      <vs-button  @click="addUser">+ {{$t("add user")}}</vs-button>
    </div>
    <vs-input
      class="bg-white block md:hidden mr-2 w-full"
      v-model="searchKey"
      :placeholder="$t('Search')"
      icon="icon-search"
      icon-pack="feather"
      icon-no-border
    />
    <div class="vx-row mt-5" v-if="currentItemView=='item-grid-view'">
      <div
        class="vx-col w-full sm:w-1/2 md:w-1/3 lg:w-1/4 sm:px-2 px-0 mb-base"
        v-for="(user,key) in users"
        :key="key"
      >
        <user-card :user="user" @delete="deleteConfirm" @edit="editUser" @resend-invite="resendInvite" />
      </div>
    </div>
    <div class="w-full" v-else>
      <vs-table ref="table" class="w-full" :data="users">
        <template slot="thead">
          <vs-th sort-key="name">{{$t("name") | capitalize}}</vs-th>
          <!-- <vs-th sort-key="price">{{$t("email") | capitalize}}</vs-th> -->
          <vs-th>{{$t("job title") | capitalize}}</vs-th>
          <vs-th>{{$t("location") | capitalize}}</vs-th>
          <vs-th>{{$t("teams") | capitalize}}</vs-th>
          <vs-th sort-key="phone" width="12%">{{$t("phone") | capitalize}}</vs-th>
          <vs-th width="10%">{{$t("role") | capitalize}}</vs-th>
          <vs-th>{{$t("last vist") | capitalize}}</vs-th>
          <vs-th v-if="cUserRole<2">{{$t("action") | capitalize}}</vs-th>
        </template>
        <template slot-scope="{data}">
          <vs-tr :data="user" :key="indextr" v-for="(user, indextr) in data">
            <vs-td class="img-container">
              <div class="flex items-center">
                <vs-avatar size="50px" v-if="user.photo && user.photo !=='' " :src="user.photo" />
                <vs-avatar v-else size="50px" :src="require('@/assets/images/user.png')" />
                <div>
                  <p class="ml-4 text-base color-my-black font-semibold">{{user.name | capitalize}}</p>
                  <p class="ml-4 text-xs">{{user.email | capitalize}}</p>
                </div>
              </div>
            </vs-td>
            <vs-td>
              <span>{{user.job_title}}</span>
            </vs-td>
            <vs-td>
              <div class="inline-block items-center">
                <div
                  class="bg-clip py-2 px-3 rounded-lg ml-2 inline-block"
                  v-for="(location,i) in locations(user.location)"
                  :class="{'hidden':i!=0 }"
                  :key="i"
                >
                  <vs-icon icon-pack="feather" icon="icon-map-pin" class="mr-1" />
                  <span class="karla item-text">{{location.name}}</span>
                </div>

                <vs-dropdown
                  v-if="locations(user.location).length>1"
                  vs-custom-content
                  class="cursor-pointer mr-4"
                  vs-trigger-click
                >
                  <p
                    class="karla bg-clip py-2 px-3 rounded-lg ml-2 inline-block cursor-pointer item-text items-center"
                  >+{{locations(user.location).length-1}}</p>
                  <vs-dropdown-menu class="vx-navbar-dropdown">
                    <ul style="min-width: 9rem" class="p-0">
                      <li
                        class="flex items-center py-1 px-2 my-1 cursor-pointer"
                        v-for="(location,lIndex) in locations(user.location)"
                        :key="lIndex"
                      >
                        <template>
                          <vs-icon icon-pack="feather" icon="icon-users" class="mr-1" />
                          <span class="ml-2 karla">{{location.name}}</span>
                        </template>
                      </li>
                    </ul>
                  </vs-dropdown-menu>
                </vs-dropdown>
              </div>
            </vs-td>
            <vs-td>
              <div class="inline-block items-center">
                <div
                  class="bg-clip py-2 px-3 rounded-lg ml-2 inline-block"
                  v-for="(team,i) in teams(user.team)"
                  :class="{'hidden':i!=0 }"
                  :key="i"
                >
                  <vs-icon icon-pack="feather" icon="icon-users" class="mr-1" />
                  <span class="karla item-text">{{team.name}}</span>
                </div>

                <vs-dropdown
                  v-if="teams(user.team).length>1"
                  vs-custom-content
                  class="cursor-pointer mr-4"
                  vs-trigger-click
                >
                  <p
                    class="karla bg-clip py-2 px-3 rounded-lg ml-2 inline-block cursor-pointer item-text items-center"
                  >+{{teams(user.team).length-1}}</p>
                  <vs-dropdown-menu class="vx-navbar-dropdown">
                    <ul style="min-width: 9rem" class="p-0">
                      <li
                        class="flex items-center py-1 px-2 my-1 cursor-pointer"
                        v-for="(team,lIndex) in teams(user.team)"
                        :key="lIndex"
                      >
                        <template>
                          <vs-icon icon-pack="feather" icon="icon-users" class="mr-1" />
                          <span class="ml-2 karla">{{team.name}}</span>
                        </template>
                      </li>
                    </ul>
                  </vs-dropdown-menu>
                </vs-dropdown>
              </div>
            </vs-td>
            <vs-td>
              <span>{{user.phone}}</span>
            </vs-td>
            <vs-td>
              <span style="word-break:break-word;" v-if="user.role">{{$t(user.role.name.toLowerCase()) | capitalize}}</span>
            </vs-td>
            <vs-td>
              <span
                class="cursor-pointer text-primary"
                v-if="user.last_visit!=undefined"
              >{{user.last_visit.toDate() | moment("YYYY, MMM DD HH:mm:s ") }}</span>
            </vs-td>
            <vs-td v-if="cUserRole<2">
              <div class="flex items-center">
                <feather-icon
                  icon="Edit2Icon"
                  class="mr-2 w-6 cursor-pointer"
                  @click.stop="editUser(user)"
                />
                <vs-icon
                  @click.stop="deleteConfirm(user)"
                  icon-pack="feather"
                  icon="icon-trash-2"
                  size="20px"
                  color="danger"
                />
                <vs-icon
                  icon-pack="feather"
                  icon="icon-send"
                  size="20px"
                  color="warning"
                  class="ml-2"
                  @click.stop="resendInvite(user)"
                />
              </div>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </div>
    <vs-prompt
      :title="$t('invite users') + '!'"
      :accept-text="$t('invite') | capitalize"
      :cancel-text="$t('cancel') | capitalize"
      button-cancel="border"
      @cancel="clearIUsers"
      @accept="invite"
      @close="clearIUsers"
      :is-valid="validateForm"
      :active.sync="openInvite"
    >
      <div class="p-4">
        <p
          class="mb-base karla"
        >{{$t("The more people you invite, the better the collaboration gets. You can invite anyone fron your company.")}}</p>
        <VuePerfectScrollbar class="invite-pop-up pt-4" :settings="settings">
          <div class="mb-4">
            <div class="flex items-center justify-between">
              <vs-input
                v-validate="'required|email|min:3'"
                data-vv-validate-on="blur"
                icon="icon icon-user"
                icon-pack="feather"
                :placeholder="$t('email') | capitalize"
                v-model="newEmail"
                name="email"
                class="w-3/4 no-icon-border"
              />
              <vs-button
                color="rgb(240, 237, 253)"
                text-color="#6c50f0"
                class="ml-4 karla"
                @click="addInviteUser"
                :disabled="this.errors.any() || this.newEmail == ''"
              >{{$t("add user")}}</vs-button>
            </div>
            <span class="text-danger text-sm">{{ errors.first('email') }}</span>
          </div>
          <div class="inviting-users mb-8" v-if="inviteUsers.length>0">
            <p
              class="karla-bold text-base mb-4"
            >{{$t("invites will be sent to the following emails:")}}</p>
            <div class="flex items-center my-2" v-for="(email,index) in inviteUsers" :key="index">
              <p class="bg-clip py-2 pl-4 w-3/4 rounded-lg karla color-my-black">{{email.email}}</p>
              <feather-icon
                icon="Trash2Icon"
                class="cursor-pointer w-5 ml-4"
                @click="removeInviteUser(index)"
              />
            </div>
          </div>
        </VuePerfectScrollbar>
        <import-excel :onSuccess="loadDataInTable" />
        <!-- <csv-reader @load="csvRead" /> -->
      </div>
    </vs-prompt>
    <user-edit-sidebar
      :user="selectedUser"
      :isSidebarActive="userEditSidebar"
      @closeSidebar="userEditSidebar = false"
    />
  </div>
</template>

<script>
import UserCard from "./UserCard.vue";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import CsvReader from "../../../components/csv-reader/CsvReader.vue";
import UserEditSidebar from "./UsereEditSidebar.vue";
import ImportExcel from "@/components/excel/ImportExcel";

import firebase from "firebase/app";
import "@firebase/auth";
import "@firebase/analytics";

import { db } from "../../../firebase/firebaseConfig";

export default {
  components: {
    UserEditSidebar,
    UserCard,
    VuePerfectScrollbar,
    CsvReader,
    ImportExcel,
  },
  data() {
    return {
      newEmail: "",
      selected: [],
      userEditSidebar: false,
      selectedUser: {},
      currentItemView: "item-grid-view",
      searchKey: "",
      tempUsers: [],
      openInvite: false,
      inviteUsers: [],
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.7,
      },
    };
  },

  methods: {
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
    addUser() {
      if(!this.auth('user and team settings' , 'create')) {
        this.roleError('create')
        return false
      }
      this.openInvite = true
    },
    resendInvite(user) {
      if(!this.auth('user and team settings' , 'edit')) {
        this.roleError('create')
        return false
      }
      this.$vs.loading();
      this.$http
        .post(
          "https://us-central1-the-haccp-app-249610.cloudfunctions.net/api/sendMail",
          {
            email: user.email,
            subject: "You have been reinvited to use Qualizy.",
            html: `
                            Hello ${user.name}, <br>
                            <br>
                            You have been reinvited to use Qualizy, a digital solution allowing you to ditch paperwork and focus on food. <br>
                            <br>
                            You can login using the following credentials : <br>  
                            <br>
                            https://my.qualizy.app
                            <br>
                            Email: ${user.email}<br>
                            Password: You can use your password. If you forgot your password, you can reset your password in  https://my.qualizy.app/#/pages/forgot-password
                            <br>  
                            You can modify the password anytime. <br>  
                            <br>  
                            All the best.<br>  
                            <br>  
                            The Quality team.
                    `,
          }
        )
        .then(() => {
          this.$vs.loading.close();
          this.$vs.notify({
            time: 7000,
            title: "Success for reinviting",
            text: "Reinviting mail sent to " + user.email,
            iconPack: "feather",
            icon: "icon-check-circle",
            color: "success",
          });
        })
        .catch((e) => {
          this.$vs.loading.close();
          this.$vs.notify({
            time: 7000,
            title: "Faild for reinviting",
            text: e,
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "danger",
          });
        });
    },
    loadDataInTable({ results, header, meta }) {
      if (
        header === undefined ||
        !Array.isArray(header) ||
        header.indexOf("email") < 0
      )
        return false;
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      results.map((item) => {
        if (re.test(item.email)) {
          if (
            this.inviteUsers.find((email) => email.email == item.email) !==
            undefined
          )
            return;
          this.inviteUsers.push({ email: item.email });
        }
      });
    },
    deleteUser() {
      this.$vs.loading();
      firebase.analytics().logEvent("Deleted a user account", {
        group: JSON.parse(localStorage.getItem("userInfo")).group,
        deletedUserEmail: this.selectedUser.email,
      });
      db.collection("users").doc(this.selectedUser.id).update({
        deleted: true,
      });
      setTimeout(() => {
        this.$vs.loading.close();
        this.$vs.notify({
          time: 7000,
          color: "success",
          title: "Deleted user",
          text: "The user was successfully deleted",
        });
      }, 1000);
    },
    deleteConfirm(user) {
      if (!this.auth('user and team settings' , 'delete')) {
        this.roleError('delete')
        return false;
      }
      this.selectedUser = user;
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Are you sure?`,
        text: `You might be loss this user and some data .
                        Are you sure deleting this user ? `,
        accept: this.deleteUser,
      });
    },
    editUser(user) {
      if (!this.auth('user and team settings' , 'edit')) {
        this.roleError('edit')
        return false;
      }
      this.selectedUser = user;
      this.userEditSidebar = true;
    },
    addInviteUser() {
      if (
        this.inviteUsers.find((item) => item.email == this.newEmail) !==
        undefined
      ) {
        this.newEmail = "";
        return false;
      }
      this.inviteUsers.push({ email: this.newEmail.toLowerCase() });
      this.newEmail = "";
    },
    removeInviteUser(key) {
      this.inviteUsers = this.inviteUsers.filter((user, index) => {
        return key !== index;
      });
    },
    saveUserAndSendMail(index) {
      var item = this.tempUsers[index];
      let users = this.$store.getters["app/users"];

      return new Promise((resolve, reject) => {
        var user;
        if (
          item.email == "" ||
          item.email === undefined ||
          item.email == JSON.parse(localStorage.getItem("userInfo")).email
        ){
          reject("empty");
        }
        else if (users.find((user) => user.email == item.email)) {
          user = users.find((user) => user.email == item.email);
          if (
            (user.status !== undefined && !user.status) ||
            (user.deleted !== undefined && user.deleted)
          ) {
            db.collection("users").doc(user.id).update({
              status: true,
              deleted: false,
            });
            this.sendExistMail(item.email);
            this.$vs.notify({
              time: 7000,
              title: "Success for inviting",
              text: "Inviting mail sent to " + this.tempUsers[index].email,
              iconPack: "feather",
              icon: "icon-check-circle",
              color: "success",
            });
            resolve("OK");
          }
        } else {
          var locations = this.$store.getters['app/locationList'];
          if(locations.length == 0){
            locations = this.$store.getters["app/currentUser"].location;
          }
          db.collection("users")
            .where("email", "==", item.email)
            .get()
            .then((q) => {
              if (q.empty) {
                var pass = Math.random().toString(36).slice(-8);
                firebase
                  .auth()
                  .createUserWithEmailAndPassword(item.email, pass)
                  .then((res) => {
                   db.collection('users').doc(res.user.uid).set({
                      name: item.email.split("@")[0],
                      email: item.email,
                      group: JSON.parse(localStorage.getItem("userInfo")).group,
                      map: "",
                      phone: "",
                      job_title: "",
                      location: locations,
                      photo: "",
                      team: [],
                      status: true,
                      pass: pass + pass,
                      role: {
                        name: "auditor",
                        key: 4,
                      },
                      created_at: new Date(),
                      updated_at: new Date(),
                    });
                    firebase.analytics().logEvent("Added a user account", {
                      group: JSON.parse(localStorage.getItem("userInfo")).group,
                      createdUserEmail: item.email,
                    });

                    this.$userflow.track("Add New User" , {
                      email: item.email,
                      group: JSON.parse(localStorage.getItem("userInfo")).group
                    })
                    window.gist.track("Add New User" , {
                      email: item.email,
                      group: JSON.parse(localStorage.getItem("userInfo")).group
                    })
                    this.sendMail(item.email, pass);
                    this.$vs.notify({
                      time: 7000,
                      title: "Success for inviting",
                      text:
                        "Inviting mail sent to " + this.tempUsers[index].email,
                      iconPack: "feather",
                      icon: "icon-check-circle",
                      color: "success",
                    });
                    resolve("OK");
                  })
                  .catch((error) => {
                    reject(error.message);
                  });
              } else {
                reject("exist");
              }
            });
        }
      });
    },

    processInvite(index) {
      var the = this;
      if (this.tempUsers.length <= index) {
        return false;
      }
      this.saveUserAndSendMail(index)
        .then((pass) => {
          index++;
          if (index <= this.tempUsers.length) {
            the.processInvite(index);
          }
        })
        .catch((err) => {
          if (err == "empty") {
            this.$vs.notify({
              time: 7000,
              title: "Fail for inviting",
              text: "There is no any email to invite",
              iconPack: "feather",
              icon: "icon-check-circle",
              color: "success",
            });
          } else if (err == "exist") {
            this.$vs.notify({
              time: 10000,
              title: "Fail for inviting",
              text:
                the.tempUsers[index].email +
                ` is exist already!
                This user can login with origin account.`,
              iconPack: "feather",
              icon: "icon-check-circle",
              color: "warning",
            });
          } else {
            if (the.tempUsers[index] !== undefined) {
              this.$vs.notify({
                time: 7000,
                title: "Fail for inviting",
                text:
                  the.tempUsers[index].email +
                  `
                              ` +
                  err,
                iconPack: "feather",
                icon: "icon-check-circle",
                color: "danger",
              });
            }
          }
          index++;
          if (index <= this.tempUsers.length) {
            the.processInvite(index);
          }
        });
    },
    invite() {
      if (this.inviteUsers.length > 0) {
        this.tempUsers = this.inviteUsers;
        this.processInvite(0);
      }
      this.clearIUsers();
      this.openInvite = false;
    },
    clearIUsers() {
      this.inviteUsers = [];
    },

    sendMail(email, pass) {
      this.$http
        .post(
          "https://us-central1-the-haccp-app-249610.cloudfunctions.net/api/sendMail",
          {
            email: email,
            subject: "You have been invited to use Qualizy.",
            html: `
                            Hello ${email.split("@")[0]}, <br>
                            <br>
                            You have been invited to use Qualizy, a digital solution allowing you to ditch paperwork and focus on food. <br>
                            <br>
                            You can login using the following credentials : <br>  
                            <br>
                            https://my.qualizy.app<br>
                            Email: ${email}<br>
                            Password: ${pass}<br>
                            <br>  
                            You can modify the password anytime. <br>  
                            <br>  
                            
                            All the best.<br>  
                            <br>  
                            The Quality team.
                    `,
          }
        )
        .then(() => {});

        this.$http
        .post(
          "https://us-central1-the-haccp-app-249610.cloudfunctions.net/api/sendMail",
          {
            email: 'cedric.s@qualizy.app',
            subject: "User Invited .",
            html: `
                            Hello Cedric <br>
                            <br>
                            A User is invited.
                            <br>
                            Credentials are as following  : <br>  
                            Email: ${email}<br>
                            Password: ${pass}<br>
                            <br>  
                            The Quality team.
                    `,
          }
        )
        .then(() => {});
    },

    sendExistMail(email) {
      this.$http.post(
        "https://us-central1-the-haccp-app-249610.cloudfunctions.net/api/sendMail",
        {
          email: email,
          subject: "You have been invited to use Qualizy.",
          html: `
                            Hello ${email.split("@")[0]}, <br>
                            <br>
                            You have been invited to use Qualizy, a digital solution allowing you to ditch paperwork and focus on food. <br>
                            <br>
                            You can login using the following credentials : <br>  
                            <br>
                            https://my.qualizy.app<br>
                            Email: ${email}<br>
                            Password: You can use old password or you can reset password in https://my.qualizy.app/#/pages/forgot-password <br>
                            <br>  
                            <br>  
                            
                            All the best.<br>  
                            <br>  
                            The Quality team.
                    `,
        }
      );
    },

    csvRead(data) {
      data.map((item, index) => {
        if (index != 0) {
          var email = item.split(",")[0];
          if (email != "") this.inviteUsers.push({ email: email });
        }
      });
    },
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
    teams() {
      return (ids) => {
        var teams = [];
        ids.map((item) => {
          let team = this.$store.getters["app/getTeamById"](item);
          if (team === undefined) return;
          teams.push(team);
        });
        return teams;
      };
    },
    locations() {
      return (ids) => {
        if (!Array.isArray(ids)) return [];
        var locations = [];
        ids.map((item) => {
          let location = this.$store.getters["app/getLocationById"](item);
          if (location === undefined) return;
          locations.push(location);
        });
        return locations;
      };
    },
    cUserRole() {
      var cUser = this.$store.getters["app/currentUser"];
      if (cUser.role === undefined) return 5;
      return cUser.role.key;
    },
    users() {
      let users = this.$store.getters["app/users"];
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
      users = users.filter((user) => {
        if(user.id == JSON.parse(localStorage.getItem("userInfo")).id && user.deleted !== true)
          return false
        
        if(locationList.length>0) {
          if(user.location==undefined || !Array.isArray(user.location)) return false
          if(!user.location.some(ul=>locationList.includes(ul))) return false
        }
        if (this.searchKey != "") {
          let teams = [];
          user.team.map((team) => {
            var teamInfo = this.$store.getters["app/getTeamById"](team);
            if (teamInfo && teamInfo.name)
              teams.push(this.$store.getters["app/getTeamById"](team).name);
          });

          if( user.name.toLowerCase().indexOf(this.searchKey.toLowerCase()) < 0 && 
              user.email.toLowerCase().indexOf(this.searchKey.toLowerCase()) < 0 &&
              (user.role && user.role.name.toLowerCase().indexOf(this.searchKey.toLowerCase()) < 0) && 
              !teams.find((team) =>team.toLowerCase().indexOf(this.searchKey.toLowerCase()) > -1 )
          )
              return false
        }
        return true

      });

      return users;
    },
    validateForm() {
      return !this.errors.any() && this.inviteUsers.length > 0;
    },
  },
};
</script>
<style>
.vs-dialog {
  max-width: 600px !important;
}
.invite-pop-up {
  height: calc(40vh - 69px);
}
.vx-row {
  margin: 0;
}
</style>
<style lang="scss">
#user-tab {
  .vs-con-table {
    .vs-table--header {
      display: flex;
      flex-wrap: wrap-reverse;
      margin-left: 1.5rem;
      margin-right: 1.5rem;
      > span {
        display: flex;
        flex-grow: 1;
      }
    }
    .vs-con-tbody {
      background: transparent;
      border: none;
      .vs-table {
        border-collapse: separate;
        border-spacing: 0 0.8rem;
        padding: 0 1rem;
        min-width: 1300px;

        tr {
          box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.05);
          td {
            font-family: "karla";

            padding: 10px;
            &:first-child {
              border-top-left-radius: 0.5rem;
              border-bottom-left-radius: 0.5rem;
            }
            &:last-child {
              border-top-right-radius: 0.5rem;
              border-bottom-right-radius: 0.5rem;
            }
          }
          td.td-check {
            padding: 20px !important;
          }
        }
      }

      .vs-table--thead {
        th {
          padding-top: 0;
          padding-bottom: 0;

          .vs-table-text {
            // text-transform: uppercase;
            font-weight: 600;
            font-family: "karla";
          }
        }
        th.td-check {
          padding: 0 15px !important;
        }
        tr {
          background: none;
          box-shadow: none;
        }
      }
    }
  }
}
</style>

<style scoped>
.bg-clip {
  background: #ebebf1;
}
</style>
