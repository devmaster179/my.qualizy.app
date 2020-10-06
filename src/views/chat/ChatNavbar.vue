<!-- =========================================================================================
    File Name: ChatNavbar.vue
    Description: Chat Application - Chat navbar
    ----------------------------------------------------------------------------------------
    Item Name: Vuesax Admin - VueJS Dashboard Admin Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
    <div v-if="userId != null" class="chat__header">
        <vs-navbar class="p-4 flex navbar-custom" color="white" type="flat">
            <div class="relative flex mr-4">
                <feather-icon icon="MenuIcon" class="mr-4 cursor-pointer" v-if="isSidebarCollapsed" @click.stop="$emit('openContactsSidebar')"></feather-icon>
                <vs-avatar v-if="user.photo" class="m-0 border-2 border-solid border-white" size="40px" :src="user.photo" @click.stop="$emit('showProfileSidebar', userId)" />
                <vs-avatar v-else class="m-0 border-2 border-solid border-white" size="40px" :src="require(`@/assets/images/user.png`)" @click.stop="$emit('showProfileSidebar', userId)" />
                <div class="h-3 w-3 border-white border border-solid rounded-full absolute right-0 bottom-0" :class="'bg-' + getStatusColor"></div>
            </div>
            <h6>{{ user.name | capitalize }}</h6>
            <vs-spacer></vs-spacer>
            <feather-icon icon="StarIcon" class="cursor-pointer" :svgClasses="[{'text-warning stroke-current': isPinnedLocal}, 'w-6', 'h-6']" @click.stop="toggleIsPinned"></feather-icon>
        </vs-navbar>
    </div>
</template>

<script>
import contacts from './contacts'

export default{
    props: {
        userId: {
            type: String,
            required: true,
        },
        isPinnedProp: {
            type: Boolean,
            required: true,
        },
        isSidebarCollapsed: {
            type: Boolean,
            required: true,
        }
    },
    data() {
        return {
            contacts: contacts,
            isPinnedLocal: this.isPinnedProp,
        }
    },
    watch: {
        isPinnedProp(val) {
            this.isPinnedLocal = val;
        }
    },
    computed: {
        user() {
            return this.$store.getters['app/getUserById'](this.userId)
        },
        contactIndex() {
            return contacts.findIndex(contact => contact.id == this.userId);
        },
        userImg() {
            if(this.contactIndex === -1) {
                return this.$store.state.AppActiveUser.img;
            }else{
                return this.contacts[this.contactIndex].img;
            }
        },
        contactName() {
            if(this.contactIndex === -1) {
                return this.$store.state.AppActiveUser.name;
            }else{
                return this.contacts[this.contactIndex].name;
            }
        },
        getStatusColor() {
            var user = this.$store.getters['app/getUserById'](this.userId)
            if(user == undefined || user.chatStatus == undefined) return 'grey'

            var userStatus = user.chatStatus
             
                if(userStatus == "online"){
                    return "success"
                }else if(userStatus == "do not disturb"){
                    return "danger"
                }else if(userStatus == "away"){
                    return "warning"
                }else{
                    return "grey"
                }
        },
    },
    methods: {
        getUserStatus(isActiveUser) {
            return (isActiveUser) ? this.$store.state.AppActiveUser.status : this.contacts[this.contactIndex].status;
        },
        toggleIsPinned() {
            const chatData = this.$store.getters['chat/chatDataOfUser'](this.userId);
            if(chatData) {
                const payload = {id: this.userId, value: !this.isPinnedLocal};
                this.$store.dispatch('chat/toggleIsPinned', payload)
            }else{
                this.$emit('toggleIsChatPinned', !this.isPinnedLocal)
            }
            this.isPinnedLocal = !this.isPinnedLocal
        }
    },
}
</script>
