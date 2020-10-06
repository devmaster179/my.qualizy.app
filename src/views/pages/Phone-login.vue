<template>
    <div class="h-screen flex w-full bg-img vx-row no-gutter items-center justify-center" id="page-login">
        <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 sm:m-0 m-4">
            <vx-card>
                <div slot="no-body" class="full-page-bg-color">
                    <div class="vx-row no-gutter justify-center items-center">
                        <div class="vx-col hidden lg:block lg:w-1/2">
                            <img src="@/assets/images/pages/graphic-2.png" alt="login" class="mx-auto">
                        </div>
                        <div class="vx-col sm:w-full md:w-full lg:w-1/2 d-theme-dark-bg">
                            <div class="sm:p-8 p-4">
                                <div class="vx-card__title sm:mb-8">
                                    <h4 class="mb-4">Login</h4>
                                    <p>Welcome back, please login to your phone number.</p>
                                </div>
                                <vue-tel-input 
                                    :inputOptions="inputOptions"
                                    validCharactersOnly
                                    enabledCountryCode
                                    v-model="phone"
                                    @input="phoneValidate"/>
                                <div class="flex flex-wrap justify-between sm:my-5">
                                    <vs-button class="mr-auto md:mt-0 mt-4" id="sendSMS" :disabled="!isPhone || phone==''"  @click="sendSMS" icon="icon-send" icon-after icon-pack="feather">Send SMS</vs-button>
                                    <vs-button class="ml-auto md:mt-0 mt-4" @click="$router.push('/pages/login')" icon="icon-arrow-left" icon-pack="feather" color="#eb5424">Back to login</vs-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </vx-card>
        </div>
        <div id="recaptcha-container"></div>
        <vs-prompt
            title="Input SMS"
            accept-text="Done"
            @accept="login"
            :active.sync="activeSMS">
            <div class="con-exemple-prompt">
                <vs-input class="w-full" v-model="smsCode" placeholder="Input SMS"/>
            </div>
        </vs-prompt>
    </div>
</template>
<script>
import { VueTelInput } from 'vue-tel-input'
// import firebase from 'firebase/app'
// import 'firebase/auth'

import auth0 from 'auth0-js'

var webAuth = new auth0.WebAuth({
    domain:       'dev-62jr0kya.auth0.com',
    clientID:     'h944hE1ohReC6jDmlASTQTOjhMrQtP1Z',
    responseType: 'code',
});

export default {
    components: {
        VueTelInput,
    },
    data() {
        return {
            activeSMS: false,
            inputOptions: {
                showDialCode: true, tabindex: 0 
            },
            isPhone: true,
            phone: '',
            smsCode: '',
            confirmationResult: '',
        }
    },
    methods: {
        phoneValidate(formattedNumber, { number, isValid, country }) {
            // this.isPhone = isValid
        },
        login() {
            // var _this = this
            // window.confirmationResult.confirm(_this.smsCode).then(function (result) {
            // // User signed in successfully.
            // var user = result.user;
            // // ...
            // }).catch(function (error) {
            //    _this.$vs.notify({
            //         time: 70000,
            //         title: 'error',
            //         text: error.message,
            //         color: 'danger',
            //     })
            // // User couldn't sign in (bad verification code?)
            // // ...
            // });
        },
        onSignInSubmit(res) {
        },
        sendSMS() {
            webAuth.passwordlessStart({
                connection: 'sms',
                send: 'code',
                phoneNumber: "+33752825043"
            }, function (err,res) {
            });
        }
    }
}
</script>