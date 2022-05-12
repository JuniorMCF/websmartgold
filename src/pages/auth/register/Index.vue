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
              <q-input type="phone" square outlined v-model="phone" label="Mobile Number">
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
                label="Sign up"
                @click.prevent="goToLogin()"
              />
            </div>
          </div>

          <div class="row q-my-lg">
            <div class="col-12 text-center">
              <span class="text-subtitle2 text-info">Already Member?</span>
              <span
                class="text-subtitle2 text-secondary q-ml-sm c-pointer"
                @click.prevent="goToLogin()"
              >Sign in</span>
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
  name: 'register-component',
  components: {},
  data: () => ({
    name: "",
    email: "",
    phone: "",
  }),
  mounted() { },
  methods: {
    goToLogin() {
      this.$router.push({ path: "/login" });
    },

    isValidEmail() {
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(this.email) || "Invalid email";
    },
  },
};
</script>

<style>
.card-auth {
  height: 600px;
  max-width: 500px;
}
</style>
