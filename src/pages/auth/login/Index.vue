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
              <span class="text-weight-bold text-h6 text-weight-bold">Sign in</span>
            </div>
            <div class="col-12 text-center q-my-md">
              <span
                class="text-subtitle2 text-info"
                style="line-height: 1"
              >We need to send OTP to authenticate your number</span>
            </div>
          </div>

          <div class="row q-my-md">
            <div class="col-12">
              <q-input
                :error="error"
                :error-message="error_mobile"
                square
                outlined
                v-model="mobile"
                type="tel"
                :maxlength="10"
                lazy-rules
                :rules="[
                  (val) =>
                    validatePhoneNumber(val) == true || 'Invalid Mobile Number',
                ]"
                label="Mobile Number"
              >
                <template v-slot:prepend>
                  <q-icon name="phone" />
                </template>
              </q-input>
            </div>
          </div>

          <div class="row q-my-lg">
            <div class="col-12">
              <q-btn
                size="lg"
                color="primary"
                class="full-width text-btn-lg"
                label="Sign in"
                :loading="loadLogin"
                @click.prevent="signIn()"
              />
            </div>
          </div>

          <div class="row q-my-lg">
            <div class="col-12 text-center">
              <span class="text-subtitle2 text-info">Don't have an account?</span>
              <span
                class="text-subtitle2 text-secondary q-ml-sm c-pointer"
                @click.prevent="goToRegister()"
              >Sign up</span>
            </div>
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>

import { firebaseAuth } from 'boot/firebase'

import { Notify } from "quasar";
export default {
  name: 'login-component',
  components: {},
  data: () => ({
    loadLogin: false,
    mobile: "",
    error: false,
    recaptchaVerifier: null,
  }),
  mounted() { },
  methods: {
    goToRegister() {
      this.$router.push({ path: "/register" });
    },
    validatePhoneNumber(phone) {
      if (phone != null && phone != "") {
        if (phone.match(/\d/g).length === 10) {
          return true;
        } else {
          return false;
        }
      }
      return false;
    },
    signIn() {

      //;
      if (this.mobile != "") {
        this.loadLogin = true;
        let payload = { mobile: this.mobile }
        this.$store.dispatch("auth/signIn", payload).then(res => {
          console.log(res)


          if (res.success == true) {
            // [START appVerifier]
            this.recaptchaVerifier = firebaseAuth.RecaptchaVerifier('sign-in-button', {
              'size': 'invisible',
              'callback': function (response) {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                this.onSignInSubmit();
              }
            });
            // [END appVerifier]
          }

          this.loadLogin = false;
          //this.$router.push({ path: "/otp" })
        }).catch(err => {
          console.log(err.message)
          this.loadLogin = false;
        })
        return
      }
      this.error = true;
      this.error_mobile = "Invalid Mobile Number";
      Notify.create({
        message: "Number is empty",
        group: false,
      });
    },
  },
  onSignInSubmit() {
    const mobile = this.mobile;
    const appVerifier = this.recaptchaVerifier;
    firebaseAuth.signInWithPhoneNumber(mobile, appVerifier)
      .then(function (confirmationResult) {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        console.log(confirmationResult)

        this.$router.push({ path: "/otp" })
      }).catch(function (error) {
        // Error; SMS not sent
        console.error('Error during signInWithPhoneNumber', error);

      });
  }
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
