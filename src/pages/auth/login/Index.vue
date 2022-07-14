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
              <span class="text-weight-bold text-h6 text-weight-bold">Sign in</span>
            </div>
            <div class="col-12 text-center q-my-md">
              <span class="text-subtitle2 text-info" style="line-height: 1"
                >We need to send OTP to authenticate your number</span
              >
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
                  (val) => validatePhoneNumber(val) == true || 'Invalid Mobile Number',
                ]"
                label="Mobile Number"
              >
                <template v-slot:prepend>
                  <q-icon name="phone" />
                </template>
              </q-input>
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
                label="Sign in"
                :loading="loadLogin"
                :disabled="isButtonDisabled"
                @click.prevent="signIn()"
              />
            </div>
          </div>
          <q-separator />
          <div class="row q-my-lg">
            <div class="col-12 text-center">
              <span class="text-subtitle2 text-info">Don't have an account?</span>
              <span
                class="text-subtitle2 text-secondary q-ml-sm c-pointer"
                @click.prevent="goToRegister()"
                >Sign up</span
              >
            </div>
            <div class="col-12 text-center q-my-md">
              <q-btn flat @click.prevent="openFeedBack()" small>
                <q-icon small color="primary" name="email" left></q-icon>
                <span class="text-normal">Send Feedback</span>
              </q-btn>
            </div>
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
  <SharedApp ref="sharedApp"></SharedApp>
</template>

<script>
import { firebaseAuth, firebase } from "boot/firebase";
import SharedApp from "src/components/dialogs/SharedApp.vue";
import { Notify } from "quasar";
export default {
  name: "login-component",
  components: {
    SharedApp,
  },
  data: () => ({
    loadLogin: false,
    mobile: "",
    error: false,
    error_mobile: "",
    recaptchaVerifier: null,
    recaptchaWidgetId: null,
    isButtonDisabled: true,
  }),
  mounted() {
    const self = this;

    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha-container", {
      size: "normal",
      callback: (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        self.isButtonDisabled = false;
      },
      "expired-callback": (response) => {
        // Response expired. Ask user to solve reCAPTCHA again.
        self.isButtonDisabled = true;
      },
    });
    this.recaptchaVerifier.render().then((widgetId) => {
      //self.recaptchaWidgetId = widgetId;
    });
  },
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
    async openFeedBack() {
      const title = "Smart Gold";
      const message = "SmartGold Feedback";
      const url = "customerservice@smartgoldmart.com";

      const data = {
        url: url,
        title: title,
        text: message,
      };
      try {
        await navigator.share(data);
        //console.log("shared data");
      } catch (err) {
        console.log(err);
      }
    },
    signIn() {
      if (this.mobile < 1000000000 || this.mobile == "") {
        this.error = true;
        this.error_mobile = "Invalid Mobile Number";
        Notify.create({
          message: "Mobile not allowed",
          group: false,
        });
        return;
      }

      //;

      this.loadLogin = true;

      this.onSignInSubmit();
    },
    onSignInSubmit() {
      const mobile = "+91" + this.mobile;
      const appVerifier = this.recaptchaVerifier;
      const self = this;
      firebase
        .auth()
        .signInWithPhoneNumber(mobile, appVerifier)
        .then(function (confirmationResult) {
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).
          //console.log(confirmationResult);
          self.confirmationResult = confirmationResult;

          Notify.create({
            message: "SMS sent",
            group: false,
          });

          self.signInAfterVerification();

          self.loadLogin = false;
        })
        .catch(function (error) {
          self.loadLogin = false;
          self.isButtonDisabled = true;
          if (
            error.message ==
            "Firebase: We have blocked all requests from this device due to unusual activity. Try again later. (auth/too-many-requests)."
          ) {
            Notify.create({
              message:
                "Too many requests, We have blocked all requests from this device due to unusual activity ,try again later",
              group: false,
            });
            return;
          }

          // Error; SMS not sent
          Notify.create({
            message: "User Not Found",
            group: false,
          });
        })
        .finally(() => {
          self.loadLogin = false;
        });
    },
    signInAfterVerification() {
      this.loadLogin = true;
      let payload = { mobile: this.mobile };
      this.$store
        .dispatch("auth/signIn", payload)
        .then((res) => {
          if (res.success === true) {
            // [START appVerifier]
            // [END appVerifier]
            //this.$router.push({ path: "/otp" })
            this.$router.push({
              path: `/otp/${this.confirmationResult.verificationId}/${this.phone}`,
            });
          } else {
            Notify.create({
              message: "User not found",
              group: false,
            });
          }

          this.loadLogin = false;
        })
        .catch((err) => {
          //console.log(err.message);
          Notify.create({
            message: "Network error",
            group: false,
          });
          this.loadLogin = false;
        });
      return;
    },
  },
};
</script>

<style>
.card-auth {
  min-height: 680px;
  max-width: 500px;
}
.text-btn-lg {
  font-size: 1.11rem !important;
}
</style>
