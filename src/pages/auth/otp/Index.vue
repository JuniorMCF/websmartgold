<template>
  <q-page class="v-main">
    <div class="row justify-center q-mt-md">
      <div class="col-md-10 col-12 q-px-sm">
        <q-card class="card-auth q-mx-auto q-px-lg q-py-md">
          <div class="row justify-center">
            <img class src="~assets/app/smartgold_logo.png" alt="smartgold" style="height: 150px" />
          </div>

          <div class="row q-my-md">
            <div class="col-12 text-center">
              <span class="text-weight-bold text-h6 text-weight-bold">Verify OTP</span>
            </div>
            <div class="col-12 text-center q-my-md">
              <span
                class="text-subtitle2 text-info"
                style="line-height: 1"
              >Please enter the OTP sent to your mobile number</span>
            </div>
          </div>

          <div class="row q-my-md">
            <div class="col-12">
              <q-input square outlined v-model="text" label="Enter OTP"></q-input>
            </div>
          </div>

          <div class="row q-my-md">
            <div class="col-12 text-center q-my-sm">
              <span class="text-subtitle2 text-info" style="line-height: 1">Didn't receive an OTP?</span>
            </div>
            <div class="col-12 text-center q-mb-md">
              <span
                class="text-weight-bold text-subtitle2 text-weight-bold c-pointer"
              >Resend OTP {{ time }}</span>
            </div>
          </div>

          <div class="row q-my-lg">
            <div class="col-12">
              <q-btn
                size="lg"
                color="primary"
                class="full-width text-btn-lg"
                label="Submit"
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
import axios from "axios";
export default {
  name: 'otp-component',
  components: {},
  data: () => ({
    time: "",
  }),
  mounted() {
    console.log(this.$store.getters["auth/getUserId"]);
  },
  methods: {
    goToRegister() {
      this.$router.push({ path: "/register" });
    },
    verifyOTP() {
      this.$router.push({ path: "/home" });
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
