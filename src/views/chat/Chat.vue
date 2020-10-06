<!-- =========================================================================================
    File Name: Chat.vue
    Description: Chat Application - Stay connected
    ----------------------------------------------------------------------------------------
    Item Name: Vuesax Admin - VueJS Dashboard Admin Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div
    id="chat-app"
    class="border border-solid d-theme-border-grey-light rounded relative overflow-hidden"
  >
    <vs-sidebar
      class="items-no-padding"
      parent="#chat-app"
      :click-not-close="clickNotClose"
      :hidden-background="clickNotClose"
      v-model="isChatSidebarActive"
      id="chat-list-sidebar"
    >
      <!-- USER PROFILE SIDEBAR -->

      <div class="chat__profile-search flex p-4">
        <div class="relative inline-flex">
          <vs-avatar
            v-if="activeUserImg.startsWith('http')"
            class="m-0 border-2 border-solid border-white"
            :src="activeUserImg"
            size="40px"
          />
          <vs-avatar
            v-else
            class="m-0 border-2 border-solid border-white"
            :src="require(`@/assets/images/${activeUserImg}`)"
            size="40px"
          />
          <!-- <div class="h-3 w-3 border-white border border-solid rounded-full absolute right-0 bottom-0" :class="'bg-' + getStatusColor(true)"></div> -->
          <div
            class="h-3 w-3 border-white border border-solid rounded-full absolute right-0 bottom-0 bg-success"
          ></div>
        </div>
        <vs-input
          icon="icon-search"
          v-model="searchUser"
          icon-pack="feather"
          class="w-full mx-5 input-rounded-full no-icon-border"
          placeholder="Search or start a new chat"
        />
      </div>

      <vs-divider class="d-theme-border-grey-light m-0" />
      <VuePerfectScrollbar class="chat-scroll-area pt-4" :settings="settings">
        <!-- ACTIVE CHATS LIST -->
        <!-- <div class="chat__chats-list mb-8">
                    <h3 class="text-primary mb-5 px-4">Chats</h3>
                    <ul class="chat__active-chats bordered-items">
                        <li class="cursor-pointer" v-for="(contact, index) in users" :key="index" @click="updateActiveChatUser(contact.id)">
                            <chat-contact :contact="contact"></chat-contact>
                        </li>
                    </ul>
        </div>-->

        <!-- CONTACTS LIST -->
        <div class="chat__contacts">
          <h5 class="text-primary mb-5 px-4">Contacts</h5>
          <ul class="bordered-items">
            <li
              class="cursor-pointer"
              v-for="contact in users"
              :key="contact.id"
              @click="updateActiveChatUser(contact.id)"
            >
              <chat-contact
                :isActiveChatUser="isActiveChatUser(contact.id)"
                :unseenMsg="chatUnseenMessages(contact.id).length"
                :contact="contact"
              ></chat-contact>
            </li>
          </ul>
        </div>
      </VuePerfectScrollbar>
    </vs-sidebar>

    <!-- RIGHT COLUMN -->
    <div
      class="chat__bg chat-content-area border border-solid d-theme-border-grey-light border-t-0 border-r-0 border-b-0"
      :class="{'sidebar-spacer--wide': clickNotClose, 'flex items-center justify-center': activeChatUser === null}"
    >
      <template v-if="activeChatUser">
        <div class="chat__navbar">
          <chat-navbar
            :isSidebarCollapsed="!clickNotClose"
            :user-id="activeChatUser"
            :isPinnedProp="isChatPinned"
            @openContactsSidebar="toggleChatSidebar(true)"
            @showProfileSidebar="updateUserProfileId"
            @toggleIsChatPinned="toggleIsChatPinned"
          ></chat-navbar>
        </div>
        <VuePerfectScrollbar
          class="chat-content-scroll-area border border-solid d-theme-border-grey-light"
          :settings="settings"
          ref="chatLogPS"
        >
          <div class="chat__log" ref="chatLog">
            <chat-log :userId="activeChatUser" v-if="activeChatUser"></chat-log>
          </div>
        </VuePerfectScrollbar>
        <!-- <div class="typing-section">
                    <typing/>
        </div>-->
        <div class="chat__input flex p-4 bg-white">
          <transition name="fade" mode="out-in">
            <div
              class="absolute bg-white"
              style="bottom:50px"
              v-if="showEmoticons"
              v-closable="{exclude: ['showEmoticons'],
                          handler: 'hideEmoticons'}"
            >
              <div class="m-2">
                <picker :data="emojiIndex" @select="addEmoji" />
                <!-- <VEmojiPicker :pack="emojiIndex" @select="addEmoji" /> -->
              </div>
            </div>
          </transition>
          <div class="relative w-full">
            <vs-input
              v-model="typedMessage"
              class="w-full input-rounded-full"
              placeholder="Type Your Message"
              @focus="readMessage"
              @keyup.enter="sendMsg"
              @keyup.esc="typedMessage=''"
            />

            <div class="absolute top-0 left-0 pt-1 pl-2" ref="showEmoticons">
              <feather-icon
                icon="SmileIcon"
                svgClasses="h-8 w-8 cursor-pointer"
                @click="showEmoticons=!showEmoticons"
              />
            </div>
          </div>

          <vx-tooltip v-if="typedMessage==''" color="primary" text="Add File" position="top">
            <vs-button
              radius
              class="ml-4"
              type="filled"
              @click="$refs.fileMessage.click()"
              icon-pack="feather"
              icon="icon-paperclip"
            ></vs-button>
            <input
              type="file"
              ref="fileMessage"
              @change="sendFile($event.target.files)"
              style="display:none"
            />
          </vx-tooltip>
        </div>
      </template>
      <template v-else>
        <div class="flex flex-col items-center">
          <feather-icon
            icon="MessageSquareIcon"
            class="mb-4 bg-white p-8 shadow-md rounded-full"
            svgClasses="w-16 h-16"
          ></feather-icon>
          <h4
            class="py-2 px-4 bg-white shadow-md rounded-full cursor-pointer"
            @click.stop="toggleChatSidebar(true)"
          >Start Conversation</h4>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import contacts from "./contacts";
import ChatContact from "./ChatContact.vue";
import UserProfile from "./UserProfile.vue";
import ChatNavbar from "./ChatNavbar.vue";
import ChatLog from "./ChatLog.vue";
import { db } from "@/firebase/firebaseConfig.js";
import Typing from "./Typing.vue";

import firebase from "firebase/app";
import "@firebase/firestore";
// import Emoticons from "./chatSign";
import data from "emoji-mart-vue-fast/data/all.json";
import { Picker, EmojiIndex } from "emoji-mart-vue-fast";
import "emoji-mart-vue-fast/css/emoji-mart.css";

import VEmojiPicker from "v-emoji-picker";
// import packData from "v-emoji-picker/data/emojis.json";
import { storage } from "@/firebase/firebaseStorage";

import Vue from "vue";

// This variable will hold the reference to
// document's click handler
let handleOutsideClick;

Vue.directive("closable", {
  bind(el, binding, vnode) {
    handleOutsideClick = (e) => {
      e.stopPropagation();
      const { handler, exclude } = binding.value;

      let clickedOnExcludedEl = false;
      exclude.forEach((refName) => {
        if (!clickedOnExcludedEl) {
          const excludedEl = vnode.context.$refs[refName];
          if (excludedEl !== undefined)
            clickedOnExcludedEl = excludedEl.contains(e.target);
        }
      });

      if (!el.contains(e.target) && !clickedOnExcludedEl) {
        vnode.context[handler]();
      }
    };
    document.addEventListener("click", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
  },

  unbind() {
    document.removeEventListener("click", handleOutsideClick);
    document.removeEventListener("touchstart", handleOutsideClick);
  },
});

export default {
  data() {
    return {
      sendingFile: false,
      fileName: "",
      emojiIndex: new EmojiIndex(data),
      showEmoticons: false,
      active: true,
      isHidden: false,
      contacts: contacts,
      searchUser: "",
      activeProfileSidebar: false,
      activeChatUser: null,
      userProfileId: -1,
      typedMessage: "",
      isChatPinned: false,
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.7,
      },
      clickNotClose: true,
      isChatSidebarActive: true,
      windowWidth: window.innerWidth,
    };
  },
  computed: {
    chatUnseenMessages() {
      return (from) => {
        var cUser = this.$store.getters["app/currentUser"];
        return this.$store.getters["app/chatUnseenMessages"](from, cUser.id);
      };
    },
    users() {
      var users = this.$store.getters["app/users"];
      var cUser = this.$store.getters["app/currentUser"];
      if (this.searchUser != "")
        return users.filter(
          (user) =>
            user.status &&
            user.id != cUser.id &&
            user.name.toLowerCase().indexOf(this.searchUser.toLowerCase()) > -1
        );
      else return users.filter((user) => user.status && user.id != cUser.id);
    },
    activeUserId() {
      return this.$store.state.AppActiveUser.id;
    },
    activeUserImg() {
      var cUser = this.$store.getters["app/currentUser"];
      if (cUser == undefined) return this.$store.state.AppActiveUser.img;
      return cUser.photo || this.$store.state.AppActiveUser.img;
    },
    activeUserStatus() {
      return this.$store.state.AppActiveUser.status;
    },
    getStatusColor() {
      return (isActiveUser) => {
        const userStatus = this.getUserStatus(isActiveUser);

        if (userStatus == "online") {
          return "success";
        } else if (userStatus == "do not disturb") {
          return "danger";
        } else if (userStatus == "away") {
          return "warning";
        } else {
          return "grey";
        }
      };
    },
    chats() {
      return this.$store.getters["chat/chats"];
    },
    chatContacts() {
      return this.$store.getters["chat/chatcontacts"];
    },
    searchQuery: {
      get() {
        return this.$store.state.chat.chatSearchQuery;
      },
      set(val) {
        this.$store.dispatch("chat/setChatSearchQuery", val);
      },
    },
    isActiveChatUser() {
      return (userId) => userId == this.activeChatUser;
    },
  },

  methods: {
    sendFile(file) {
      var cUser = this.$store.getters["app/currentUser"];

      const { maxSize } = this;
      let doc = file[0];
      let fileName = doc.name;
      var src = "";
      let that = this;
      if (doc.type.indexOf("image") > -1) {
        var reader = new FileReader();
        reader.onload = function () {
          src = reader.result;
          that.$store.dispatch("app/chatFileUploding", { file: doc, src: src });
        };
        reader.readAsDataURL(doc);
      } else
        this.$store.dispatch("app/chatFileUploding", { file: doc, src: src });

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
            "/chat/" +
            doc.name;
          var metadata = {
            contentType: doc.type,
          };
          var mountainsRef = storageRef.child(this.ref);
          var docUpload = mountainsRef.put(doc, metadata);
          docUpload.on(
            "state_changed",
            (snapshot) => {
              var progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              this.$store.dispatch("app/setFileProgress", progress);
              console.log("Upload is " + progress + "% done");
              if (progress == 100) this.$store.dispatch("app/initFileUpload");
            },
            (error) => {
              console.log(error);
            },
            () => {
              docUpload.snapshot.ref.getDownloadURL().then((downloadURL) => {
                db.collection("chat").add({
                  ref: this.ref,
                  text: "",
                  file: downloadURL,
                  fileName: fileName,
                  type: doc.type,
                  isSeen: false,
                  from: cUser.id,
                  to: this.activeChatUser,
                  time: firebase.firestore.FieldValue.serverTimestamp(),
                  group: cUser.group,
                });
              });
            }
          );
        }
      }
    },
    hideEmoticons() {
      this.showEmoticons = false;
    },
    addEmoji(e) {
      console.log(e);
      if (e.native !== undefined) this.typedMessage += e.native;
    },
    readMessage() {
      var cUser = this.$store.getters["app/currentUser"];
      var unreadMessages = this.$store.getters["app/chatUnseenMessages"](
        this.activeChatUser,
        cUser.id
      );
      unreadMessages.map((item) => {
        db.collection("chat").doc(item.id).update({
          isSeen: true,
        });
      });
    },
    getUserStatus(isActiveUser) {
      return isActiveUser
        ? this.$store.state.AppActiveUser.status
        : this.contacts[this.activeChatUser].status;
    },
    closeProfileSidebar(value) {
      this.activeProfileSidebar = value;
    },
    updateUserProfileId(userId) {
      this.userProfileId = userId;
      this.activeProfileSidebar = !this.activeProfileSidebar;
    },
    updateActiveChatUser(contactId) {
      this.activeChatUser = contactId;

      // let chatData = this.$store.getters['chat/chatDataOfUser'](this.activeChatUser);
      // if(chatData) this.isChatPinned = chatData.isPinned;
      // else this.isChatPinned = false
      this.isChatPinned = false;
      this.toggleChatSidebar();
      this.typedMessage = "";
    },
    showProfileSidebar(userId) {
      this.userProfileId = userId;
      this.activeProfileSidebar = !this.activeProfileSidebar;
    },
    sendMsg() {
      if (!this.typedMessage) return;
      var cUser = this.$store.getters["app/currentUser"];
      db.collection("chat").add({
        text: this.typedMessage,
        isSeen: false,
        from: cUser.id,
        to: this.activeChatUser,
        time: firebase.firestore.FieldValue.serverTimestamp(),
        // time: new Date(),
        group: cUser.group,
      });
      this.typedMessage = "";
      this.$refs.chatLogPS.$el.scrollTop = this.$refs.chatLog.scrollHeight;
    },
    toggleIsChatPinned(value) {
      this.isChatPinned = value;
    },
    handleWindowResize(event) {
      this.windowWidth = event.currentTarget.innerWidth;
      this.setSidebarWidth();
    },
    setSidebarWidth() {
      if (this.windowWidth < 1200) {
        this.isChatSidebarActive = this.clickNotClose = false;
      } else {
        this.isChatSidebarActive = this.clickNotClose = true;
      }
    },
    toggleChatSidebar(value = false) {
      if (!value && this.clickNotClose) return;
      this.isChatSidebarActive = value;
    },
  },
  components: {
    VuePerfectScrollbar,
    ChatContact,
    UserProfile,
    ChatNavbar,
    ChatLog,
    Typing,
    Picker,
    EmojiIndex,
    VEmojiPicker,
  },
  created() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.handleWindowResize);
    });
    this.setSidebarWidth();
  },
  beforeDestroy: function () {
    window.removeEventListener("resize", this.handleWindowResize);
  },
  events: {
    closeEvent: function () {
      this.showEmoticons = false;
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/scss/vuesax/apps/chat.scss";
</style>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/animate.css@3.5.1");
.emoticons {
  width: 300px;
}
.chat-content-area {
  height: calc(100vh - 9.6rem);
}
#chat-app .chat__bg {
  background-color: #000000ad !important;
}
</style>

<style>
.chat__input .vs-con-input span {
  padding-left: 40px !important;
}

.chat__input .vs-con-input input {
  padding-left: 40px !important;
}
</style>

