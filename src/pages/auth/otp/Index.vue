<template>
  <q-page class="v-main">
    <div class="row justify-center q-mt-md">
      <div class="col-md-10 col-12 q-px-sm">
        <q-card class="card-auth q-mx-auto q-px-lg q-py-md">
          <div class="row justify-center">
            <img
              class
              src="~assets/app/smartgold_logo.png"
              alt="smartgold"
              style="height: 150px"
            />
          </div>

          <div class="row q-my-md">
            <div class="col-12 text-center">
              <span class="text-weight-bold text-h6 text-weight-bold">Verify OTP</span>
            </div>
            <div class="col-12 text-center q-my-md">
              <span class="text-subtitle2 text-info" style="line-height: 1"
                >Please enter the OTP sent to your mobile number</span
              >
            </div>
          </div>

          <div class="row q-my-md">
            <div class="col-12">
              <q-input
                square
                outlined
                 type="text" pattern="[0-9]*" inputmode="numeric"
                 maxlength="6"
                v-model="code"
                label="Enter OTP"
              ></q-input>
            </div>
          </div>

          <div class="row q-my-md">
            <div class="col-12 text-center q-my-sm">
              <span class="text-subtitle2 text-info" style="line-height: 1"
                >Didn't receive an OTP?</span
              >
            </div>
            <div class="col-12 text-center q-mb-md">
              <span
                v-if="time > 0"
                class="text-weight-bold text-subtitle2 text-weight-bold"
                >Resend OTP {{ time }}</span
              >
              <v-btn
                v-else
                small
                
                @click.prevent="resendOTP()"
                class="text-weight-bold c-pointer"
              >
                <span class="text-secondary"> SignIn</span> again 
              </v-btn>
            </div>
          </div>
          <div class="row justify-center">
            <div class="col-auto">
              <div class="q-mx-auto">
                <div id="recaptcha-container"></div>
              </div>
            </div>
          </div>

          <div class="row q-my-lg">
            <div class="col-12">
              <q-btn
                size="lg"
                color="primary"
                class="full-width text-btn-lg"
                label="Submit"
                :loading="loading"
                @click.prevent="verifyOTP()"
              />
            </div>
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";

import { firebaseAuth, firebase } from "boot/firebase";
import { Notify } from "quasar";
export default {
  name: "otp-component",
  components: {},
  data: () => ({
    code: "",
    loading: false,
    verificationId: null,
    recaptchaVerifier:null,
    phone: null,
    timer:null
  }),
  mounted() {
    this.$store.commit("auth/initTimer")

    this.timer = setInterval(()=>{
      this.reloadTimer()
    },1000)



    this.verificationId = this.$route.params.verificationId;
    this.phone = "+91" + this.$route.params.phone;
    //console.log(this.$store.getters["auth/getUserId"]);
  },
  beforeUnmount(){
    clearInterval(this.timer)
    if(! this.$store.getters["auth/getOtp"]){
      this.$store.dispatch("auth/setLoggedIn",false)
      this.$store.dispatch("auth/signOut")
    }
  },  
  methods: {
    reloadTimer(){
      this.$store.dispatch("auth/setTimer")
    },
    verifyOTP() {
      this.loading = true;
      const self = this;
      const credential = firebase.auth.PhoneAuthProvider.credential(
        this.verificationId,
        this.code
      );
      firebaseAuth
        .signInWithCredential(credential)
        .then((res) => {

          self.$store.dispatch("auth/setOtp",true)

          self.loading = false;
          //console.log(res);
          self.$router.push({ path: "/home" });
        })
        .catch((error) => {
          
          self.$store.dispatch("auth/setOtp",false)
          self.loading = false;
          Notify.create({
            message: "Not match code",
            group: false,
          });
        })
        .finally(() => {
          
          self.loading = false;
        });
    },
    resendOTP() {
      this.$router.push({path:'/login'})
    },
  },
  computed: {
    time() {
      return this.$store.getters["auth/getTimer"];
    },
  },
};
</script>

<style>
.card-auth {
  height: 600px;
  max-width: 500px;
}
.text-btn-lg {
  font-size: 1.11rem !important;
}
</style>
