<template>
  <q-dialog
    persistent
    @keydown.esc="cancel"
    v-model="dialog"
    :max-width="options.width"
    :style="{ zIndex: options.zIndex }"
    full-height

  >
    <q-card square class="q-dialog-plugin bg-whit">
      <q-btn
        flat
        outlined
        size="sm"
        color="white"
        class="bg-primary close-fixed q-px-sm q-py-sm text-center shadow-0"
        @click.prevent="cancel"
      >
        <q-icon class="q-ml-sm" name="arrow_back_ios"></q-icon>
      </q-btn>

      <div class="cart-fixed">
        <q-img no-spinner src="~assets/app/logo.png"></q-img>
      </div>
      <div class="row justify-center q-mt-lg" style="height: 48px">
        <div class="col-12 text-center">
          <p
            class="text-h6 q-my-none"
            style="padding: 0px 80px 0px 80px; overflow: hidden; line-height: 1"
          >
            Profile
          </p>
        </div>
      </div>

      <q-separator></q-separator>
      <q-card-section class="q-py-md scroll q-pa-md" style="max-height: 540px">
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
      </q-card-section>

      <q-card-actions style="position: absolute; bottom: 0; width: 100%">
        <q-btn
          text-color="info"
          size="md"
          block
          flat
          square
          :loading="load"
          class="q-mx-auto full-width bg-primary"
          @click.prevent="updateProfile()"
          >Submit</q-btn
        >
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-overlay v-model="load" :no-scroll="true" :z-index="5000" cursor-type="inherit">
    <template #body>
      <div class="fullscreen row justify-evenly items-center">
        <div style="height: 80px; width: 80px">
          <q-img
            no-spinner
            src="~assets/app/load.gif"
            alt="gif load"
            fit="contain"
          ></q-img>
        </div>
      </div>
    </template>
  </q-overlay>
</template>

<script>
import axios from "axios";
import { Notify } from "quasar";
import { QOverlay } from "@quasar/quasar-ui-qoverlay";
export default {
  name: "edit-profile-component",
  components: {
    QOverlay,
  },
  mounted() {},
  data: function () {
    return {
      size: null,
      color: null,
      load: false,

      dialog: false,
      resolve: null,
      reject: null,

      options: {
        color: "primary",
        width: 700,
        zIndex: 2000,
        noconfirm: false,
      },
      name: "",
      email: "",
    };
  },
  methods: {
    open(options) {
      this.dialog = true;

      this.name = this.$store.getters["auth/getUsername"];
      this.email = this.$store.getters["auth/getEmail"];
      this.options = Object.assign(this.options, options);

      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    agree() {
      this.resolve(true);
      this.dialog = false;
    },
    cancel() {
      this.resolve(false);
      this.dialog = false;
    },
    isValidEmail() {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(this.email) || "Invalid email";
    },
    updateProfile() {
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

      this.update();
    },
    update() {
      this.load = true;
      let endpooint = "update_profile.php";
      let token =
        "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NDg1MDcwNTIsInN1YiI6ImVLYXJ0IEF1dGhlbnRpY2F0aW9uIiwiaXNzIjoiZUthcnQifQ.dcdE_rrGdj9jN4z-HmBu1lsO2PH3OkX1r0o63DvIkIo";

      const url = "https://smartgold.blazeaisolutions.com/api/" + endpooint;
      let data = new FormData();
      data.append("accesskey", "90336");
      data.append("name", this.name);
      data.append("email", this.email);
      data.append("user_id", this.$store.getters["auth/getUserId"]);
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      axios
        .post(url, data, {
          headers: headers,
        })
        .then((res) => {
          if (res.data.success == true) {
            //console.log(res.data.data)
            this.$store.dispatch("auth/setName",res.data.data[0].name)
             this.$store.dispatch("auth/setEmail",res.data.data[0].email)
             this.agree()
          }
          this.load = false;
        })
        .catch((err) => {
          this.load = false;
        });
    },
  },watch: {
    dialog: function() {
      if(this.dialog){
        document.documentElement.style.overflow = 'hidden'
        return
      }

      document.documentElement.style.overflow = 'auto'
    }
  }
};
</script>

<style scoped>
.q-dialog-plugin {
  width: 500px;
}
.q-dialog__inner--minimized {
  padding: 90px 0px 90px 0px !important;
}
@media (max-width: 600px) {
  .q-dialog-plugin {
    width: 100% !important;
  }
  .q-dialog__inner--minimized {
    padding: 0px 0px 0px 0px !important;
  }
}

.close-fixed {
  position: absolute;
  top: 15px;
  left: 15px;
}
.cart-fixed {
  position: absolute;
  width: 50px;
  height: 50px;
  top: 15px;
  right: 15px;
}
</style>
