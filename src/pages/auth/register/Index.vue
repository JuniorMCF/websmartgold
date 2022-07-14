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
              <span class="text-weight-bold text-h6 text-weight-bold">Sign up</span>
            </div>
          </div>

          <div class="row q-my-md">
            <div class="col-12">
              <q-input square outlined v-model="name" label="Full Name">
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
            </div>
          </div>

          <div class="row q-my-md">
            <div class="col-12">
              <q-input
                :rules="[(val) => !!val || 'Email is missing', isValidEmail()]"
                square
                outlined
                v-model="email"
                hide-bottom-space
                label="Email Id"
              >
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>
            </div>
          </div>

          <div class="row q-my-md">
            <div class="col-12">
              <q-input
                type="tel"
                :maxlength="10"
                square
                outlined
                v-model="phone"
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
                label="Sign up"
                :disabled="isButtonDisabled"
                @click.prevent="register()"
              />
            </div>
          </div>

          <div class="row q-my-lg">
            <div class="col-12 text-center">
              <span class="text-subtitle2 text-info">Already Member?</span>
              <span
                class="text-subtitle2 text-secondary q-ml-sm c-pointer"
                @click.prevent="goToLogin()"
                >Sign in</span
              >
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
  name: "register-component",
  components: {},
  data: () => ({
    name: "",
    email: "",
    phone: "",
    loading: false,
    recaptchaVerifier: null,
    recaptchaWidgetId: null,
    confirmationResult: null,
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
      self.recaptchaWidgetId = widgetId;
    });
  },
  methods: {
    goToLogin() {
      this.$router.push({ path: "/login" });
    },

    isValidEmail() {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(this.email) || "Invalid email";
    },
    register() {
      if (this.name == "" || this.name == null) {
        Notify.create({
          message: "Name is required",
          group: false,
        });
        return;
      }
      if (this.isValidEmail() == "Invalid email") {
        Notify.create({
          message: "Invalid format email",
          group: false,
        });
        return;
      }
      if (this.mobile < 1000000000 || this.mobile == "") {
        Notify.create({
          message: "Mobile is required",
          group: false,
        });
        return;
      }

      
      this.createUser();
    },
    onSignInSubmit() {
      this.loading = true;
      const mobile = "+91" + this.phone;
      const appVerifier = this.recaptchaVerifier;
      const self = this;
      firebaseAuth
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
          self.loading = false;
          self.$router.push({
            path: `/otp/${self.confirmationResult.verificationId}/${self.phone}`,
          });
        })
        .catch(function (error) {
           self.loading = false;
          self.isButtonDisabled = true;
          if (
            error.message ==
            "Firebase: We have blocked all requests from this device due to unusual activity. Try again later. (auth/too-many-requests)."
          ) {
            Notify.create({
              message: "Too many requests, We have blocked all requests from this device due to unusual activity ,try again later",
              group: false,
            });
            return;
          }
          // Error; SMS not sent
         
          Notify.create({
            message: "User Not Found",
            group: false,
          });
        });
    },
    createUser() {
      this.loading = true;
      let payload = { name: this.name, email: this.email, phone: this.phone };
      this.$store
        .dispatch("auth/signUp", payload)
        .then((res) => {
          //console.log(res);

          if (res.success == true) {
            // [START appVerifier]
            this.onSignInSubmit();

            // [END appVerifier]
            //this.$router.push({ path: "/otp" })
          } else {
            Notify.create({
              message: "User already exist",
              group: false,
            });
          }

          this.loading = false;
        })
        .catch((err) => {
          //console.log(err.message);
          Notify.create({
            message: "Network error",
            group: false,
          });
          this.loading = false;
        });
    },
  },
};
</script>

<style>
.card-auth {
  height: 700px;
  max-width: 500px;
}
</style>
