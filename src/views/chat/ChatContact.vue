<!-- =========================================================================================
    File Name: ChatContact.vue
    Description: Chat contact - single component for chat
    ----------------------------------------------------------------------------------------
    Item Name: Vuesax Admin - VueJS Dashboard Admin Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div
    class="chat__contact flex items-center pl-2 pr-4"
    :class="{'bg-primary-gradient text-white shadow-lg': isActiveChatUser}"
  >
    <div class="mr-3 my-2 relative inline-flex">
      <vs-avatar
        v-if="contact.photo"
        class="border-2 border-solid border-white m-0"
        :src="contact.photo"
        size="40px"
      ></vs-avatar>
      <vs-avatar
        v-else
        class="border-2 border-solid border-white m-0"
        :src="require(`@/assets/images/user.png`)"
        size="40px"
      ></vs-avatar>
      <div
        class="h-3 w-3 border-white border border-solid rounded-full absolute right-0 bottom-0"
        :class="calcStatus"
      ></div>
      <!-- <div
        class="absolute h-3 w-3 border-white border border-solid rounded-full right-0 bottom-0"
        
      ></div>-->
    </div>
    <div class="contact__container w-full flex items-center overflow-hidden">
      <div class="contact__info flex flex-col truncate w-full">
        <div class="flex justify-between">
          <h5 :class="{'text-white': isActiveChatUser}">{{ contact.name }}</h5>
          <span
            class="truncate text-grey chat-text"
            v-if="lastMessage"
          >{{ chatDate(lastMessage.time.toDate()) }}</span>
        </div>
        <div class="flex justify-between">
          <span class="truncate chat-text text-grey" v-if="lastMessage">{{ lastMessage.text }}</span>
          <span class="truncate chat-text text-grey">{{ contact.about }}</span>
          <vs-chip class="number" color="danger" v-if="unseenMsg">{{ unseenMsg }}</vs-chip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    contact: {
      type: Object,
      required: true
    },
    lastMessaged: {
      type: String,
      default: ""
    },
    unseenMsg: {
      type: Number,
      default: 0
    },
    isActiveChatUser: {
      type: Boolean
    }
  },
  computed: {
    chatDate() {
      return date => {
        var today = new Date();
        if (
          date.getFullYear() === today.getFullYear() &&
          date.getMonth() === today.getMonth() &&
          date.getDate() === today.getDate()
        )
          return this.$moment(date).format("HH:mm");
        else return this.$moment(date).format("DD/M/YYYY");
      };
    },
    lastMessage() {
      var cUser = this.$store.getters["app/currentUser"];
      var chats = this.$store.getters["app/chats"];
      chats = chats.filter(
        chat =>
          (chat.from == cUser.id && chat.to == this.contact.id) ||
          (chat.to == cUser.id && chat.from == this.contact.id)
      );
      return chats.sort(
        (a, b) => -a.time.toDate().getTime() + b.time.toDate().getTime()
      )[0];
      // return chats[0]
    },
    calcStatus() {
      var user = this.$store.getters["app/getUserById"](this.contact.id);
      if (user == undefined || !user.chatStatus) return "bg-grey";
      if (user.chatStatus == "online") return "bg-success";
      else if (user.chatStatus == "do not distub") return "bg-danger";
      else if (user.chatStatus == "away") return "bg-warning";
      else return "bg-grey";
    }
  }
};
</script>

<style scoped>
.status {
  position: relative;
  top: -20px;
  left: 32px;
}
.chat-text {
  font-size: 0.9em;
}
</style>
