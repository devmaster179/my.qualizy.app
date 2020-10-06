<!-- =========================================================================================
    File Name: ChatLog.vue
    Description: Chat Application - Log of chat
    ----------------------------------------------------------------------------------------
    Item Name: Vuesax Admin - VueJS Dashboard Admin Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->
<!-- hasSentPreviousMsg -->
<template>
  <div id="component-chat-log" class="m-8" v-if="chatData">
    <div v-for="(msg, index) in chatData" class="msg-grp-container" :key="index">
      <!-- If previouse msg is older than current time -->
      <!-- <template v-if="chatData.msg[index-1]"> -->
      <template>
        <vs-divider class="mt-2 mb-0" color="#a5a5a5" v-if="!isSameDay(index)">
          <span class="text-white">{{ msg.time.toDate() | moment('dddd , MMMM DD ')}}</span>
        </vs-divider>
      </template>
      <template>
        <vs-divider
          class="mt-2 mb-0"
          color="danger"
          v-if="checkUnreadMessage!==undefined && checkUnreadMessage.id==msg.id"
        >
          <span class="text-danger">Unread Message</span>
        </vs-divider>
      </template>
      <div class="flex items-start" :class="[{'flex-row-reverse' : msg.from==currentUser.id}]">
        <!-- <template v-if="chatData.msg[index-1]">
                    <template v-if="(!hasSentPreviousMsg(chatData.msg[index-1].isSent, msg.isSent) || !isSameDay(msg.time, chatData.msg[index-1].time))">
                        <vs-avatar size="40px" class="border-2 shadow border-solid border-white m-0 flex-shrink-0" :class="msg.isSent ? 'sm:ml-5 ml-3' : 'sm:mr-5 mr-3'" :src="senderImg(msg.isSent)"></vs-avatar>
                    </template>
                </template>

                <template v-if="index == 0">
                    <vs-avatar size="40px" class="border-2 shadow border-solid border-white m-0 flex-shrink-0" :class="msg.isSent ? 'sm:ml-5 ml-3' : 'sm:mr-5 mr-3'" :src="senderImg(msg.isSent)"></vs-avatar>
                </template>

                <template v-if="chatData.msg[index-1]">
                    <div class="mr-16" v-if="!(!hasSentPreviousMsg(chatData.msg[index-1].isSent, msg.isSent) || !isSameDay(msg.time, chatData.msg[index-1].time))"></div>
        </template>-->
        <template v-if="msg.to==currentUser.id && calcAvatar(index) ">
          <vs-avatar
            size="40px"
            class="border-2 shadow border-solid border-white m-0 flex-shrink-0"
            :class="msg.isSent ? 'sm:ml-5 ml-3' : 'sm:mr-5 mr-3'"
            :src="senderImg(msg.from)"
          ></vs-avatar>
        </template>
        <template v-if="msg.to==currentUser.id">
          <div class="mr-16" v-if="!calcAvatar(index)"></div>
        </template>
        <div class="flex-col">
          <p
            class="text-grey chat-text mt-2 mb-0"
            :class="{'text-right': msg.from == currentUser.id }"
            v-if="!hasSentPreviousMsg(index) || !isSameMin(index)"
          >{{msg.time.toDate() | moment('H:mm')}}</p>
          <div
            class="msg break-words relative rounded-lg max-w-sm"
            :class="{'bg-primary-gradient shadow-lg text-white': msg.from != currentUser.id, 
              'bg-dark text-white': msg.from == currentUser.id , 
              'round-tl-0': msg.from != currentUser.id && (!hasSentPreviousMsg(index) || isSameMin(index) || calcAvatar(index)),
              'round-bl-0': msg.from != currentUser.id && hasSentNextMsg(index) && isSameMinA(index),
              'round-tr-0': msg.from == currentUser.id && (!hasSentPreviousMsg(index) || isSameMin(index) || calcAvatar(index)),
              'round-br-0': msg.from == currentUser.id && hasSentNextMsg(index) && isSameMinA(index),
              'py-2 px-3' : msg.file === undefined,
              'bg-transparent' : msg.file !== undefined,
              }"
            style="margin-bottom:1px"
          >
            <span class="chat-text font-medium" v-if="msg.file === undefined">{{ msg.text }}</span>
            <div class="con-img-upload" v-else @click="viewFile(msg)">
              <view-upload v-if="imageView" :src="viewSrc" @closeImage="closeImage" />
              <div class="img-upload bg-dark">
                <h4 class="text-archive" v-if="msg.type.indexOf('image')<0">
                  <span class="text-success">{{msg.fileName}}</span>
                </h4>
                <img :src="msg.file" v-else style="max-width:120%;max-height:120%" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="msg-grp-container" v-if="fileUploading.uploading">
      <div class="flex items-start flex-row-reverse">
        <div class="con-img-upload">
          <div class="img-upload bg-dark">
            <h4 class="text-archive" v-if="fileUploading.file.type.indexOf('image')<0">
              <span class="text-success">{{fileUploading.file.name}}</span>
            </h4>
            <img :src="fileUploading.src" style="max-width:120%;max-height: 120%;" />
            <Progress
              strokeColor="#FF00AA"
              :value="fileUploading.progress"
              class="absolute progress"
            />
          </div>
        </div>
      </div>
    </div>
    <a ref="downloadLink" target="_blank" download style="display:none"></a>
  </div>
</template>

<script>
import Progress from "easy-circular-progress";
import { storage } from "@/firebase/firebaseStorage";
import ViewUpload from "../../components/file-upload/ViewUpload.vue";

export default {
  components: { Progress, ViewUpload },
  props: {
    userId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      viewSrc: "",
      imageView: false,
      completedSteps: 5,
      totalSteps: 10,
      unreadMessageFlag: true,
      // contacts: contacts,
      fill: { gradient: ["red", "green", "blue"] },
    };
  },

  computed: {
    fileUploading() {
      return this.$store.getters["app/getChatFileUpload"];
    },
    checkUnreadMessage() {
      var chats = this.chatData;
      return chats.filter(
        (item) => item.from == this.userId && !item.isSeen
      )[0];
    },
    currentUser() {
      return this.$store.getters["app/currentUser"];
    },
    chatData() {
      var cUser = this.$store.getters["app/currentUser"];
      var chats = this.$store.getters["app/chats"];
      chats = chats.filter(
        (chat) =>
          (chat.from == cUser.id && chat.to == this.userId) ||
          (chat.to == cUser.id && chat.from == this.userId)
      );
      return chats.sort(
        (a, b) => a.time.toDate().getTime() - b.time.toDate().getTime()
      );
    },
    contactIndex() {
      return contacts.findIndex((contact) => contact.id == this.userId);
    },
    userImg() {
      if (this.contactIndex !== -1) return this.contacts[this.contactIndex].img;
    },
    activeUserImg() {
      return this.$store.state.AppActiveUser.img;
    },
    senderImg() {
      return (userId) => {
        var user = this.$store.getters["app/getUserById"](userId);
        if (user == undefined || !user.photo)
          return require("@/assets/images/user.png");
        if (user.photo) return user.photo;
        // if (isSentByActiveUser) return require(`@/assets/images/portrait/small/${this.$store.state.AppActiveUser.img}`);
        // else return require(`@/assets/images/portrait/small/${this.contacts[this.contactIndex].img}`);
      };
    },
    hasSentPreviousMsg() {
      return (index) => {
        if (index == 0) return false;
        return this.chatData[index].from == this.chatData[index - 1].from;
      };
    },
    hasSentNextMsg() {
      return (index) => {
        if (index == this.chatData.length - 1) return false;
        return this.chatData[index].from == this.chatData[index + 1].from;
      };
    },
    calcAvatar() {
      return (index) => {
        if (index == 0) return true;
        if (!this.hasSentPreviousMsg(index)) return true;
        return !this.isSameMin(index);
      };
    },
  },
  methods: {
    closeImage() {
      this.imageView = false;
    },
    viewFile(msg) {
      if (msg.type.indexOf("image") < 0) {
        var storageRef = storage.ref();
        var starsRef = storageRef.child(msg.ref);
        starsRef.getDownloadURL().then((url) => {
          this.$refs.downloadLink.href = url;
          this.$refs.downloadLink.click();
        });
      } else {
        this.viewSrc = msg.file;
        this.imageView = true;
      }
    },
    isSameMinA(index) {
      if (index == this.chatData.length) return false;
      const date1 = this.chatData[index].time.toDate();
      const date0 = this.chatData[index + 1].time.toDate();

      return (
        date1.getFullYear() === date0.getFullYear() &&
        date1.getMonth() === date0.getMonth() &&
        date1.getDate() === date0.getDate() &&
        date1.getMinutes() === date0.getMinutes()
      );
    },
    isSameDay(index) {
      if (index == 0) return false;
      const date1 = this.chatData[index].time.toDate();
      const date0 = this.chatData[index - 1].time.toDate();

      return (
        date1.getFullYear() === date0.getFullYear() &&
        date1.getMonth() === date0.getMonth() &&
        date1.getDate() === date0.getDate()
      );
    },

    isSameMin(index) {
      if (index == 0) return false;
      const date1 = this.chatData[index].time.toDate();
      const date0 = this.chatData[index - 1].time.toDate();

      return (
        date1.getFullYear() === date0.getFullYear() &&
        date1.getMonth() === date0.getMonth() &&
        date1.getDate() === date0.getDate() &&
        date1.getMinutes() === date0.getMinutes()
      );
    },
    toDate(time) {
      const locale = "en-us";
      const date_obj = new Date(Date.parse(time));
      const monthName = date_obj.toLocaleString(locale, {
        month: "short",
      });
      return date_obj.getDate() + " " + monthName;
    },
    scrollToBottom() {
      this.$nextTick(() => {
        this.$parent.$el.scrollTop = this.$parent.$el.scrollHeight;
      });
    },
  },
  updated() {
    this.scrollToBottom();
  },
  mounted() {
    this.scrollToBottom();
  },
};
</script>

<style scoped>
.chat-text {
  font-size: 0.9em;
}
.round-tl-0 {
  border-top-left-radius: 0 !important;
}
.round-bl-0 {
  border-bottom-left-radius: 0 !important;
}
.round-tr-0 {
  border-top-right-radius: 0 !important;
}
.round-br-0 {
  border-bottom-right-radius: 0 !important;
}
.con-img-upload {
  width: unset;
  max-width: 300px;
  padding: 0;
}
.img-upload {
  margin: 0;
}
.progress {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1);
}
</style>
<style>
.progress span {
  color: red;
}
</style>